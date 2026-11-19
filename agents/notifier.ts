import { Agent, run } from "@openai/agents";
import { z } from "zod";
import { clip, LIMITS, MODELS, senderName, tidy } from "./config";
import type {
  AgentEmail,
  AgentUsage,
  Classification,
  PushNotification,
} from "./types";

const output = z.object({
  n: z.array(
    z.object({
      i: z.number().int(),
      t: z.string().describe("title, max 6 words"),
      b: z.string().describe("body, max 18 words"),
    }),
  ),
});

export const notifierAgent = new Agent({
  name: "Push notifier",
  model: MODELS.notifier,
  instructions: `Pick only emails worth interrupting the user for (urgent, deadlines, money, people waiting). Skip the rest.
Write a short push title and body for each pick. Plain text, no emoji.`,
  outputType: output,
  modelSettings: { maxTokens: 400 },
});

type Candidate = { index: number; email: AgentEmail; analysis: Classification };

/** Only high/medium emails are ever sent to the model, keeping input tiny. */
export function notificationCandidates(candidates: Candidate[]) {
  return candidates
    .filter((c) => c.analysis.priority !== "low")
    .sort((a, b) =>
      a.analysis.priority === b.analysis.priority
        ? 0
        : a.analysis.priority === "high"
          ? -1
          : 1,
    )
    .slice(0, LIMITS.notificationsPerRun * 2);
}

export async function composeNotifications(
  candidates: Candidate[],
): Promise<{ notifications: PushNotification[]; usage: AgentUsage }> {
  const pool = notificationCandidates(candidates);
  if (pool.length === 0) {
    return { notifications: [], usage: { inputTokens: 0, outputTokens: 0 } };
  }

  const input = pool
    .map(
      ({ index, email, analysis }) =>
        `#${index} ${analysis.priority} | ${senderName(email.from)} | ${clip(analysis.summary || email.subject, 140)}`,
    )
    .join("\n");

  const result = await run(notifierAgent, input, { maxTurns: 1 });
  const byIndex = new Map(pool.map((c) => [c.index, c]));
  const notifications: PushNotification[] = [];

  for (const { i, t, b } of result.finalOutput?.n ?? []) {
    const match = byIndex.get(i);
    if (!match || notifications.length >= LIMITS.notificationsPerRun) continue;
    notifications.push({
      emailId: match.email.id,
      title: clip(tidy(t), 60),
      body: clip(tidy(b), 160),
      priority: match.analysis.priority,
    });
  }

  const { inputTokens, outputTokens } = result.runContext.usage;
  return { notifications, usage: { inputTokens, outputTokens } };
}
