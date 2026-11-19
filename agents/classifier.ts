import { Agent, run } from "@openai/agents";
import { z } from "zod";
import { clip, LIMITS, MODELS, tidy } from "./config";
import {
  CATEGORIES,
  type AgentEmail,
  type AgentUsage,
  type Classification,
} from "./types";

// Short keys = fewer output tokens. Expanded into `Classification` below.
const output = z.object({
  r: z.array(
    z.object({
      i: z.number().int(),
      p: z.enum(["high", "medium", "low"]),
      c: z.enum(CATEGORIES),
      s: z.string().describe("summary, max 15 words"),
      rp: z.boolean().describe("a personal reply is expected"),
      a: z.array(z.string()).describe("action items, max 2, else []"),
      ev: z
        .array(
          z.object({
            t: z.string(),
            d: z.string().describe("YYYY-MM-DD"),
            h: z.string().nullable().describe("HH:MM 24h or null"),
          }),
        )
        .describe("meetings/deadlines with a date, else []"),
    }),
  ),
});

export const classifierAgent = new Agent({
  name: "Inbox classifier",
  model: MODELS.classifier,
  instructions: `Triage emails. For each #i return one item.
p: high=urgent, deadline<48h, boss/client/interview/payment issue; medium=needs action this week; low=FYI, newsletters, promos, automated.
rp=true only if a human wrote to the user and expects an answer.
Resolve relative dates against TODAY. Be terse.`,
  outputType: output,
  modelSettings: { maxTokens: 1800 },
});

export async function classifyEmails(
  emails: AgentEmail[],
  today: string,
): Promise<{ results: Map<number, Classification>; usage: AgentUsage }> {
  const input = [
    `TODAY ${today}`,
    ...emails.map(
      (e, i) =>
        `#${i} ${clip(e.from, 60)} | ${clip(e.subject, 120)} | ${clip(e.body || e.snippet, LIMITS.classifierBodyChars)}`,
    ),
  ].join("\n");

  const result = await run(classifierAgent, input, { maxTurns: 1 });
  const results = new Map<number, Classification>();

  for (const item of result.finalOutput?.r ?? []) {
    if (item.i < 0 || item.i >= emails.length) continue;
    results.set(item.i, {
      priority: item.p,
      category: item.c,
      summary: tidy(item.s),
      needsReply: item.rp,
      actionItems: item.a.slice(0, 2).map((title) => ({
        title,
        description: emails[item.i].subject,
        dueDate: item.ev[0]?.d ?? null,
      })),
      calendarEvents: item.ev.slice(0, 2).map((ev) => toCalendarEvent(ev, item.s)),
    });
  }

  const { inputTokens, outputTokens } = result.runContext.usage;
  return { results, usage: { inputTokens, outputTokens } };
}

function toCalendarEvent(
  ev: { t: string; d: string; h: string | null },
  description: string,
) {
  const date = /^\d{4}-\d{2}-\d{2}$/.test(ev.d) ? ev.d : ev.d.slice(0, 10);
  const time = ev.h && /^\d{1,2}:\d{2}$/.test(ev.h) ? ev.h.padStart(5, "0") : null;
  if (!time) {
    return { title: ev.t, description, date, startTime: null, endTime: null };
  }
  const [hh, mm] = time.split(":").map(Number);
  const end = hh < 23 ? `${String(hh + 1).padStart(2, "0")}:${String(mm).padStart(2, "0")}` : null;
  return {
    title: ev.t,
    description,
    date,
    startTime: `${date}T${time}:00`,
    endTime: end ? `${date}T${end}:00` : null,
  };
}
