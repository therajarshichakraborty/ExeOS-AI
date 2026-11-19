import "server-only";
import { setDefaultOpenAIKey, setTracingDisabled } from "@openai/agents";

/**
 * Token budget knobs. Every agent receives clipped, whitespace-collapsed text and
 * returns short-keyed JSON, so a batch of 15 emails stays around a few thousand tokens.
 */
export const MODELS = {
  classifier: process.env.OPENAI_CLASSIFIER_MODEL ?? "gpt-4.1-nano",
  reply: process.env.OPENAI_REPLY_MODEL ?? "gpt-4.1-mini",
  notifier: process.env.OPENAI_NOTIFIER_MODEL ?? "gpt-4.1-nano",
} as const;

export const LIMITS = {
  /** Max emails analysed per run (one batched classifier call). */
  emailsPerRun: 15,
  /** Characters of body sent to the classifier per email. */
  classifierBodyChars: 450,
  /** Characters of body sent to the reply suggester per email. */
  replyBodyChars: 700,
  /** Max replies drafted per run. */
  repliesPerRun: 5,
  /** Max push notifications per run. */
  notificationsPerRun: 5,
} as const;

let configured = false;

export function hasOpenAI() {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

/** Wires the SDK to OPENAI_API_KEY once. Returns false when no key is set. */
export function configureOpenAI() {
  if (!hasOpenAI()) return false;
  if (!configured) {
    setDefaultOpenAIKey(process.env.OPENAI_API_KEY!.trim());
    // Tracing uploads every span to OpenAI; we don't need it in production runs.
    setTracingDisabled(true);
    configured = true;
  }
  return true;
}

/** Collapse whitespace and hard-clip text to keep prompts small. */
export function clip(text: string | null | undefined, max: number) {
  const flat = (text ?? "").replace(/\s+/g, " ").trim();
  return flat.length > max ? `${flat.slice(0, max)}…` : flat;
}

/** Models love em dashes; the product voice doesn't use them. */
export function tidy(text: string) {
  return text.replace(/\s*—\s*/g, ", ").replace(/–/g, "-");
}

/** "Jane Doe <jane@x.com>" -> "Jane Doe" */
export function senderName(from: string) {
  return from.split("<")[0].replace(/"/g, "").trim() || from;
}
