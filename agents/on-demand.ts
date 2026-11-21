import "server-only";
import { Agent, run } from "@openai/agents";
import { z } from "zod";
import { clip, configureOpenAI, MODELS, senderName, tidy } from "./config";
import { suggestReplies } from "./reply-suggester";
import type { AgentEmail } from "./types";

/**
 * On-demand agents for a single email, triggered from the reader's
 * "Get AI summary" and "Draft with AI" buttons. Each is one small call with
 * clipped input, and both fall back to zero-token heuristics without a key.
 */

const summaryOutput = z.object({
  s: z.string(),
  k: z.array(z.string()),
  a: z.string().nullable(),
});

export const summarizerAgent = new Agent({
  name: "Email summarizer",
  model: MODELS.classifier,
  instructions: `Summarize the email for a busy reader.
s: 1-2 sentences, max 40 words: what it is and what is being asked.
k: up to 3 key points, max 12 words each; empty array if trivial.
a: the single next action for the reader, max 10 words, or null if none.
Never invent facts, names or dates. No em dashes.`,
  outputType: summaryOutput,
  modelSettings: { maxTokens: 300 },
});

export interface EmailSummary {
  summary: string;
  points: string[];
  action: string | null;
  source: "ai" | "rules";
}

const SUMMARY_BODY_CHARS = 1800;

function sentences(text: string) {
  return (text.replace(/\s+/g, " ").match(/[^.!?]+[.!?]+/g) ?? [text]).map((s) => s.trim()).filter(Boolean);
}

function summarizeHeuristically(email: AgentEmail): EmailSummary {
  const text = email.body || email.snippet || email.subject;
  const parts = sentences(text);
  const summary = clip(parts.slice(0, 2).join(" ") || email.subject, 240);
  const points = parts
    .slice(2)
    .filter((s) => /\?|\b(by|due|deadline|meeting|call|tomorrow|today|monday|tuesday|wednesday|thursday|friday)\b/i.test(s))
    .slice(0, 3)
    .map((s) => clip(s, 90));
  const asks = /\?/.test(text.slice(0, 2000));
  return {
    summary,
    points,
    action: asks ? `Reply to ${senderName(email.from)}` : null,
    source: "rules",
  };
}

export async function summarizeEmail(email: AgentEmail): Promise<EmailSummary> {
  if (!configureOpenAI()) return summarizeHeuristically(email);
  try {
    const input = `From ${senderName(email.from)} | ${clip(email.subject, 160)}\n${clip(email.body || email.snippet, SUMMARY_BODY_CHARS)}`;
    const result = await run(summarizerAgent, input, { maxTurns: 1 });
    const out = result.finalOutput;
    if (!out?.s.trim()) return summarizeHeuristically(email);
    return {
      summary: tidy(out.s.trim()),
      points: out.k.map((k) => tidy(k.trim())).filter(Boolean).slice(0, 3),
      action: out.a?.trim() ? tidy(out.a.trim()) : null,
      source: "ai",
    };
  } catch (error) {
    console.error("Summarizer failed, using heuristics:", error);
    return summarizeHeuristically(email);
  }
}

function draftHeuristically(email: AgentEmail, userName: string) {
  const first = senderName(email.from).split(" ")[0] || "there";
  const topic = email.subject ? ` about “${clip(email.subject, 80)}”` : "";
  return `Hi ${first},\n\nThanks for your email${topic}. I've read it and will get back to you with a full answer shortly.\n\nBest,\n${userName || "Me"}`;
}

export async function draftReplyForEmail(
  email: AgentEmail,
  userName: string,
): Promise<{ draft: string; source: "ai" | "rules" }> {
  if (!configureOpenAI()) return { draft: draftHeuristically(email, userName), source: "rules" };
  try {
    const { replies } = await suggestReplies([{ index: 0, email }], userName);
    const draft = replies.get(0);
    if (draft) return { draft, source: "ai" };
  } catch (error) {
    console.error("Reply suggester failed, using template:", error);
  }
  return { draft: draftHeuristically(email, userName), source: "rules" };
}
