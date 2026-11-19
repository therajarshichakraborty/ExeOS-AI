import { clip, senderName } from "./config";
import type {
  AgentEmail,
  Category,
  Classification,
  Priority,
  PushNotification,
} from "./types";

/**
 * Zero-token heuristics used when OPENAI_API_KEY is missing or a model call fails,
 * so the inbox still gets triaged instead of the whole run failing.
 */
const HIGH = /\b(urgent|asap|immediately|today|tonight|deadline|overdue|final notice|action required|interview|offer letter|payment failed|security alert)\b/i;
const MEDIUM = /\b(meeting|schedule|invoice|reminder|tomorrow|this week|review|approve|follow[- ]?up|application|proposal|call)\b/i;
const AUTOMATED = /(no-?reply|noreply|notifications?@|mailer|newsletter|digest)/i;
const PROMO = /\b(sale|% off|discount|deal|offer ends|unsubscribe|webinar)\b/i;
const FINANCE = /\b(invoice|receipt|payment|bank|statement|refund|billing)\b/i;

export function classifyHeuristically(email: AgentEmail): Classification {
  const text = `${email.subject} ${email.snippet} ${email.body.slice(0, 600)}`;
  const automated = AUTOMATED.test(email.from);

  let category: Category = "other";
  if (FINANCE.test(text)) category = "finance";
  else if (PROMO.test(text)) category = "promotion";
  else if (/newsletter|digest/i.test(text + email.from)) category = "newsletter";
  else if (automated) category = "notification";
  else category = "work";

  let priority: Priority = "low";
  if (HIGH.test(text)) priority = "high";
  else if (MEDIUM.test(text)) priority = "medium";
  if (category === "promotion" || category === "newsletter") priority = "low";

  return {
    priority,
    category,
    summary: clip(email.snippet || email.subject, 140),
    needsReply: !automated && /\?/.test(email.body.slice(0, 1500)),
    actionItems: [],
    calendarEvents: [],
  };
}

export function notifyHeuristically(
  items: { email: AgentEmail; analysis: Classification }[],
): PushNotification[] {
  return items
    .filter(({ analysis }) => analysis.priority === "high")
    .slice(0, 5)
    .map(({ email, analysis }) => ({
      emailId: email.id,
      title: `Urgent from ${clip(senderName(email.from), 40)}`,
      body: clip(email.subject || analysis.summary, 140),
      priority: analysis.priority,
    }));
}
