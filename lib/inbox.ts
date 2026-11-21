import "server-only";
import { cache } from "react";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  getAgentRuns,
  getOrCreateUser,
  getUserByClerkId,
  getUserIntegrations,
} from "@/db/queries";
import type { AgentRun, ProcessedEmail } from "@/db/schema";

export type InboxEmail = ProcessedEmail & { runId: string };

/**
 * Resolves the signed-in user once per request (shared by layout + page).
 * auth() is read locally from the session token, and name/email come from our
 * own users row, so the slow Clerk API call (currentUser) only happens once,
 * the first time a new user is seen.
 */
export const getSessionUser = cache(async () => {
  const { userId: clerkId, has } = await auth();
  if (!clerkId) redirect("/sign-in");
  let user = await getUserByClerkId(clerkId);
  if (!user) {
    const clerkUser = await currentUser();
    user = await getOrCreateUser(
      clerkId,
      clerkUser?.emailAddresses[0]?.emailAddress ?? "",
      clerkUser?.fullName ?? "",
    );
  }
  return { user, email: user.email, name: user.name ?? "", isPro: has({ plan: "pro_plan" }) };
});

/** Flattens recent agent runs into a de-duplicated, newest-first inbox. */
export const getInbox = cache(async (userId: string) => {
  const [runs, integrations] = await Promise.all([
    getAgentRuns(userId),
    getUserIntegrations(userId),
  ]);

  const seen = new Set<string>();
  const emails: InboxEmail[] = [];
  for (const run of runs) {
    for (const entry of run.actionsLog ?? []) {
      if (!entry.emailId || seen.has(entry.emailId)) continue;
      seen.add(entry.emailId);
      emails.push({ ...entry, processedAt: run.startedAt, runId: run.id });
    }
  }
  emails.sort((a, b) => dateOf(b) - dateOf(a));

  const count = (fn: (e: InboxEmail) => boolean) => emails.filter(fn).length;
  return {
    emails,
    runs: runs as AgentRun[],
    gmailConnected: integrations.some((i) => i.provider === "gmail"),
    calendarConnected: integrations.some((i) => i.provider === "google_calendar"),
    counts: {
      all: emails.length,
      high: count((e) => e.priority === "high"),
      medium: count((e) => e.priority === "medium"),
      low: count((e) => e.priority === "low"),
      reply: count((e) => !!e.needsReply),
      drafts: count((e) => !!e.draftCreated),
      scheduled: count((e) => (e.eventsCreated ?? 0) > 0),
    },
  };
});

function dateOf(email: InboxEmail) {
  const t = new Date(email.date).getTime();
  return Number.isNaN(t) ? new Date(email.processedAt).getTime() : t;
}

export function senderName(from: string) {
  return from?.split("<")[0]?.replace(/"/g, "").trim() || from || "Unknown";
}

export function shortDate(input: string | Date) {
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return "";
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }
  return d.toLocaleDateString([], {
    day: "numeric",
    month: "short",
    ...(d.getFullYear() !== now.getFullYear() && { year: "numeric" }),
  });
}
