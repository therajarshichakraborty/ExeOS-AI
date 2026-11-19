import {
  completeAgentRun,
  createAgentRun,
  createNotifications,
  createTask,
  getUserById,
} from "@/db/queries";
import type { ActionLogEntry } from "@/db/schema";
import { runInboxPipeline } from "@/agents";
import { LIMITS } from "@/agents/config";
import { getCalendarClient, getGmailClient } from "./google-client";
import { createDraft, fetchUnreadEmails, markAsRead } from "./agents/gmail";
import {
  type CalendarEvent,
  createCalendarEvent,
  fetchUpcomingEvents,
} from "./agents/calender";

const plural = (n: number, word: string, many = `${word}s`) =>
  `${n} ${n === 1 ? word : many}`;

export async function runAgent(userId: string) {
  const startTime = Date.now();
  const agentRun = await createAgentRun(userId);
  const finish = (
    data: Omit<Parameters<typeof completeAgentRun>[1], "durationMs">,
  ) =>
    completeAgentRun(agentRun.id, {
      ...data,
      durationMs: Date.now() - startTime,
    });

  try {
    const gmailClient = await getGmailClient(userId);
    if (!gmailClient) {
      const run = await finish({
        status: "failed",
        summary: "Gmail not connected",
        actionsLog: [],
        emailsProcessed: 0,
        tasksCreated: 0,
        draftsCreated: 0,
        errorMessage: "Gmail integration not found or token expired",
      });
      return { runId: run.id, status: "failed" as const, summary: run.summary };
    }

    const emails = await fetchUnreadEmails(gmailClient, LIMITS.emailsPerRun);
    if (emails.length === 0) {
      const run = await finish({
        status: "success",
        summary: "Inbox zero — no unread emails to process",
        actionsLog: [],
        emailsProcessed: 0,
        tasksCreated: 0,
        draftsCreated: 0,
      });
      return { runId: run.id, status: "success" as const, summary: run.summary };
    }
    emails.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const calendarClient = await getCalendarClient(userId);
    let upcoming: CalendarEvent[] = [];
    if (calendarClient) {
      upcoming = await fetchUpcomingEvents(calendarClient, 24 * 14).catch(
        (error) => {
          console.error("Calendar fetch failed (non-fatal):", error);
          return [];
        },
      );
    }
    const alreadyScheduled = new Set(
      upcoming.map((e) => `${e.summary.toLowerCase()}|${e.start.slice(0, 10)}`),
    );

    const user = await getUserById(userId);
    const pipeline = await runInboxPipeline(emails, {
      userName: user?.name ?? "",
    });

    const actionsLog: ActionLogEntry[] = [];
    let tasksCreated = 0;
    let draftsCreated = 0;
    let eventsCreated = 0;

    for (const [index, { analysis, draftReply }] of pipeline.items.entries()) {
      const email = emails[index];
      try {
        for (const item of analysis.actionItems) {
          await createTask({
            userId,
            title: item.title,
            description: item.description,
            priority: analysis.priority,
            dueDate: item.dueDate ? new Date(item.dueDate) : null,
            createdByAgent: true,
          });
          tasksCreated++;
        }

        let draftCreated = false;
        if (draftReply) {
          await createDraft(
            gmailClient,
            email.from,
            email.subject,
            draftReply,
            email.threadId,
          );
          draftCreated = true;
          draftsCreated++;
        }

        let emailEvents = 0;
        if (calendarClient) {
          for (const event of analysis.calendarEvents) {
            const key = `${event.title.toLowerCase()}|${event.date}`;
            if (alreadyScheduled.has(key)) continue;
            try {
              await createCalendarEvent(calendarClient, event);
              alreadyScheduled.add(key);
              emailEvents++;
            } catch (err) {
              console.error(`[Agent] Calendar event "${event.title}":`, err);
            }
          }
        }
        eventsCreated += emailEvents;

        await markAsRead(gmailClient, email.id);

        actionsLog.push({
          emailId: email.id,
          subject: email.subject,
          from: email.from,
          date: email.date,
          status: "success",
          snippet: email.snippet,
          body: email.body,
          summary: analysis.summary,
          priority: analysis.priority,
          category: analysis.category,
          needsReply: analysis.needsReply,
          draftReply,
          actionItems: analysis.actionItems,
          calendarEvents: analysis.calendarEvents,
          tasksCreated: analysis.actionItems.length,
          draftCreated,
          eventsCreated: emailEvents,
          notified: pipeline.notifications.some((n) => n.emailId === email.id),
        });
      } catch (error) {
        console.error("Email processing failed:", error);
        actionsLog.push({
          emailId: email.id,
          subject: email.subject,
          from: email.from,
          date: email.date,
          status: "error",
          snippet: email.snippet,
          body: email.body,
          priority: analysis.priority,
          category: analysis.category,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    if (pipeline.notifications.length > 0) {
      await createNotifications(
        pipeline.notifications.map((n) => ({ userId, ...n })),
      ).catch((error) => console.error("Saving notifications failed:", error));
    }

    const ok = actionsLog.filter((e) => e.status === "success").length;
    const failed = actionsLog.length - ok;
    const summary = [
      `Processed ${plural(ok, "email")}`,
      tasksCreated && `created ${plural(tasksCreated, "task")}`,
      draftsCreated && `drafted ${plural(draftsCreated, "reply", "replies")}`,
      eventsCreated && `scheduled ${plural(eventsCreated, "event")}`,
      pipeline.notifications.length &&
        `sent ${plural(pipeline.notifications.length, "notification")}`,
      failed && plural(failed, "error"),
      pipeline.mode === "heuristic" && "heuristic mode",
    ]
      .filter(Boolean)
      .join(", ");

    console.log(
      `[Agent] ${summary} · tokens in=${pipeline.usage.inputTokens} out=${pipeline.usage.outputTokens}`,
    );

    const run = await finish({
      status: ok > 0 ? "success" : "failed",
      summary,
      actionsLog,
      emailsProcessed: ok,
      tasksCreated,
      draftsCreated,
      errorMessage:
        [failed > 0 && `${failed} email(s) failed`, ...pipeline.warnings]
          .filter(Boolean)
          .join("; ") || undefined,
    });
    return { runId: run.id, status: run.status, summary };
  } catch (error) {
    console.error("Agent run error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const run = await finish({
      status: "failed",
      summary: "Agent run failed",
      actionsLog: [],
      emailsProcessed: 0,
      tasksCreated: 0,
      draftsCreated: 0,
      errorMessage,
    });
    return { runId: run.id, status: "failed" as const, summary: errorMessage };
  }
}
