import { Agent, run } from "@openai/agents";
import { z } from "zod";
import { clip, LIMITS, MODELS, senderName, tidy } from "./config";
import type { AgentEmail, AgentUsage } from "./types";

const output = z.object({
  r: z.array(z.object({ i: z.number().int(), t: z.string() })),
});

export const replySuggesterAgent = new Agent({
  name: "Reply suggester",
  model: MODELS.reply,
  instructions: `Draft a reply for each #i email, written as the user.
Rules: max 80 words, warm and professional, answer what was asked, never invent facts, dates or commitments; if info is missing, ask briefly. No subject line, no em dashes. End with "Best,\\n<USER>".`,
  outputType: output,
  modelSettings: { maxTokens: 900 },
});

/** Returns a map of email index -> suggested reply text. */
export async function suggestReplies(
  emails: { index: number; email: AgentEmail }[],
  userName: string,
): Promise<{ replies: Map<number, string>; usage: AgentUsage }> {
  const replies = new Map<number, string>();
  const batch = emails.slice(0, LIMITS.repliesPerRun);
  if (batch.length === 0) {
    return { replies, usage: { inputTokens: 0, outputTokens: 0 } };
  }

  const input = [
    `USER ${userName || "Me"}`,
    ...batch.map(
      ({ index, email }) =>
        `#${index} from ${senderName(email.from)} | ${clip(email.subject, 120)} | ${clip(email.body || email.snippet, LIMITS.replyBodyChars)}`,
    ),
  ].join("\n");

  const result = await run(replySuggesterAgent, input, { maxTurns: 1 });
  const allowed = new Set(batch.map((b) => b.index));
  for (const { i, t } of result.finalOutput?.r ?? []) {
    if (allowed.has(i) && t.trim()) {
      replies.set(i, tidy(t.replace(/<USER>/g, userName || "Me")).trim());
    }
  }

  const { inputTokens, outputTokens } = result.runContext.usage;
  return { replies, usage: { inputTokens, outputTokens } };
}
