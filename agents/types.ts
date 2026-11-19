export type Priority = "high" | "medium" | "low";

export const CATEGORIES = [
  "work",
  "personal",
  "finance",
  "newsletter",
  "notification",
  "promotion",
  "spam",
  "other",
] as const;
export type Category = (typeof CATEGORIES)[number];

/** Minimal email shape the agents need. */
export interface AgentEmail {
  id: string;
  from: string;
  subject: string;
  body: string;
  snippet: string;
}

export interface Classification {
  priority: Priority;
  category: Category;
  summary: string;
  needsReply: boolean;
  actionItems: { title: string; description: string; dueDate: string | null }[];
  calendarEvents: {
    title: string;
    description: string;
    date: string;
    startTime: string | null;
    endTime: string | null;
  }[];
}

export interface PushNotification {
  emailId: string;
  title: string;
  body: string;
  priority: Priority;
}

export interface AgentUsage {
  inputTokens: number;
  outputTokens: number;
}
