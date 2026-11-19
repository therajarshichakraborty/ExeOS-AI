import "server-only";
import { classifyEmails } from "./classifier";
import { configureOpenAI } from "./config";
import { classifyHeuristically, notifyHeuristically } from "./fallback";
import { composeNotifications } from "./notifier";
import { suggestReplies } from "./reply-suggester";
import type {
  AgentEmail,
  AgentUsage,
  Classification,
  PushNotification,
} from "./types";

export interface PipelineItem {
  email: AgentEmail;
  analysis: Classification;
  draftReply: string | null;
}

export interface PipelineResult {
  items: PipelineItem[];
  notifications: PushNotification[];
  usage: AgentUsage;
  mode: "ai" | "heuristic";
  warnings: string[];
}

/**
 * Runs the three agents with at most three model calls per run, regardless of
 * inbox size: classify (batched) -> suggest replies (only rp=true) -> notify
 * (only high/medium). Each stage degrades to heuristics on failure.
 */
export async function runInboxPipeline(
  emails: AgentEmail[],
  opts: { userName: string; today?: string },
): Promise<PipelineResult> {
  const today = opts.today ?? new Date().toISOString().slice(0, 10);
  const usage: AgentUsage = { inputTokens: 0, outputTokens: 0 };
  const warnings: string[] = [];
  const add = (u: AgentUsage) => {
    usage.inputTokens += u.inputTokens;
    usage.outputTokens += u.outputTokens;
  };

  const aiEnabled = configureOpenAI();
  if (!aiEnabled) warnings.push("OPENAI_API_KEY not set — using heuristics");

  // 1. Classification
  let classified = new Map<number, Classification>();
  if (aiEnabled && emails.length > 0) {
    try {
      const res = await classifyEmails(emails, today);
      classified = res.results;
      add(res.usage);
    } catch (error) {
      warnings.push(`classifier: ${errorText(error)}`);
    }
  }
  const items: PipelineItem[] = emails.map((email, i) => ({
    email,
    analysis: classified.get(i) ?? classifyHeuristically(email),
    draftReply: null,
  }));

  // 2. Reply suggestions (AI only — a canned reply is worse than none)
  if (aiEnabled) {
    const needing = items
      .map((item, index) => ({ index, ...item }))
      .filter((x) => x.analysis.needsReply && x.analysis.category !== "spam");
    if (needing.length > 0) {
      try {
        const res = await suggestReplies(needing, opts.userName);
        res.replies.forEach((text, index) => (items[index].draftReply = text));
        add(res.usage);
      } catch (error) {
        warnings.push(`reply-suggester: ${errorText(error)}`);
      }
    }
  }

  // 3. Push notifications
  let notifications: PushNotification[] = [];
  const indexed = items.map((item, index) => ({ index, ...item }));
  if (aiEnabled) {
    try {
      const res = await composeNotifications(indexed);
      notifications = res.notifications;
      add(res.usage);
    } catch (error) {
      warnings.push(`notifier: ${errorText(error)}`);
      notifications = notifyHeuristically(items);
    }
  } else {
    notifications = notifyHeuristically(items);
  }

  return {
    items,
    notifications,
    usage,
    mode: aiEnabled && classified.size > 0 ? "ai" : "heuristic",
    warnings,
  };
}

function errorText(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}
