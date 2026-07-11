import { completeAgentRun, createAgentRun, createTask } from "@/db/queries";
import { getCalendarClient, getGmailClient } from "./google-client";
import { createDraft, fetchUnreadEmails, markAsRead } from "./agents/gmail";
import {
  CalendarEvent,
  createCalendarEvent,
  fetchUpcomingEvents,
} from "./agents/calender";
import { ActionLogEntry } from "@/db/schema";
import { anaylzeWithAI } from "./agents/process-email";

export async function runAgent(userId: string) {
  const startTime = Date.now();
  const agentRun = await createAgentRun(userId);

  try {
    const gmailClient = await getGmailClient(userId);
    if (!gmailClient) {
      const run = await completeAgentRun(agentRun.id, {
        status: "failed",
        summary: "Gmail not connected",
        actionsLog: [],
        emailsProcessed: 0,
        tasksCreated: 0,
        draftsCreated: 0,
        errorMessage: "Gmail integration not found or token expired",
        durationMs: Date.now() - startTime,
      });
      return {
        runId: run.id,
        status: "failed" as const,
        summary: "Gmail not connected",
      };
    }
    const emails = await fetchUnreadEmails(gmailClient, 20);
    if (emails.length === 0) {
      const run = await completeAgentRun(agentRun.id, {
        status: "success",
        summary: "No unread emails to process",
        actionsLog: [],
        emailsProcessed: 0,
        tasksCreated: 0,
        draftsCreated: 0,
        durationMs: Date.now() - startTime,
      });
      return {
        runId: run.id,
        status: "success" as const,
        summary: "No unread emails to process",
      };
    }

    // Sort unread emails by date descending (latest first) to ensure the first 5 are the newest
    emails.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    const calendarClient = await getCalendarClient(userId);

    let upcomingEvents: CalendarEvent[] = [];
    if (calendarClient) {
      try {
        upcomingEvents = await fetchUpcomingEvents(calendarClient, 24);
      } catch (error) {
        console.error("Calendar fetch failed (non-fatal):", error);
      }
    }

    const actionsLog: ActionLogEntry[] = [];
    let totalTasksCreated = 0;
    let totalDraftsCreated = 0;
    let totalEventsCreated = 0;

    const results = [];
    for (let index = 0; index < emails.length; index++) {
      const email = emails[index];
      try {
        if (index >= 5) {
          await markAsRead(gmailClient, email.id);
          results.push({
            status: "fulfilled" as const,
            value: {
              emailId: email.id,
              subject: email.subject,
              from: email.from,
              date: email.date,
              snippet: email.snippet,
              body: email.body,
              status: "success" as const,
              summary: email.snippet,
              priority: "low",
              category: "other",
              needsReply: false,
              draftReply: null,
              actionItems: [],
              calendarEvents: [],
              tasksCreated: 0,
              draftCreated: false,
              eventsCreated: 0,
            },
          });
          continue;
        }

        // Add a small delay between AI requests to avoid rate limits
        if (index > 0) {
          await new Promise((resolve) => setTimeout(resolve, 500));
        }

        const analysis = await anaylzeWithAI(email, upcomingEvents);
        let emailTasksCreated = 0;

        for (const item of analysis.actionItems) {
          await createTask({
            userId,
            title: item.title,
            description: item.description,
            priority: analysis.priority,
            dueDate: item.dueDate ? new Date(item.dueDate) : null,
            createdByAgent: true,
          });
          emailTasksCreated++;
        }

        let draftCreated = false;
        if (analysis.needsReply && analysis.draftReply) {
          await createDraft(
            gmailClient,
            email.from,
            email.subject,
            analysis.draftReply,
            email.threadId,
          );
          draftCreated = true;
        }

        let emailEventsCreated = 0;
        if (calendarClient && analysis.calendarEvents?.length > 0) {
          for (const event of analysis.calendarEvents) {
            try {
              await createCalendarEvent(calendarClient, event);
              emailEventsCreated++;
            } catch (err) {
              console.error(
                `[Agent] Failed to create calendar event "${event.title}":`,
                err,
              );
            }
          }
        }

        await markAsRead(gmailClient, email.id);

        results.push({
          status: "fulfilled" as const,
          value: {
            emailId: email.id,
            subject: email.subject,
            from: email.from,
            date: email.date,
            snippet: email.snippet,
            body: email.body,
            status: "success" as const,
            summary: analysis.summary,
            priority: analysis.priority,
            category: analysis.category,
            needsReply: analysis.needsReply,
            draftReply: analysis.draftReply,
            actionItems: analysis.actionItems,
            calendarEvents: analysis.calendarEvents,
            tasksCreated: emailTasksCreated,
            draftCreated: draftCreated,
            eventsCreated: emailEventsCreated,
          },
        });
      } catch (error) {
        console.error("Email processing failed:", error);
        results.push({
          status: "fulfilled" as const,
          value: {
            emailId: email.id,
            subject: email.subject,
            from: email.from,
            date: email.date,
            snippet: email.snippet,
            body: email.body,
            status: "error" as const,
            error: error instanceof Error ? error.message : "Unknown error",
          },
        });
      }
    }

    for (const result of results) {
      if (result.status === "fulfilled") {
        const entry = result.value;
        actionsLog.push({
          emailId: entry.emailId,
          subject: entry.subject,
          from: entry.from,
          date: entry.date,
          status: entry.status as "success" | "error",
          snippet: entry.snippet,
          body: entry.body,
          summary: entry.summary,
          priority: entry.priority,
          category: entry.category,
          needsReply: entry.needsReply,
          draftReply: entry.draftReply,
          actionItems: entry.actionItems,
          calendarEvents: entry.calendarEvents,
          tasksCreated: entry.tasksCreated,
          draftCreated: entry.draftCreated,
          eventsCreated: entry.eventsCreated,
          error: entry.error,
        });
        if (entry.status === "success") {
          totalTasksCreated += entry.tasksCreated ?? 0;
          totalDraftsCreated += entry.draftCreated ? 1 : 0;
          totalEventsCreated += entry.eventsCreated ?? 0;
        }
      }
    }
    const successCount = actionsLog.filter(
      (entry) => entry.status === "success",
    ).length;
    const errorCount = actionsLog.filter(
      (entry) => entry.status === "error",
    ).length;
    const overallStatus = successCount > 0 ? "success" : "failed";

    const summary = [
      `Processed ${successCount} email${successCount !== 1 ? "s" : ""}`,
      totalTasksCreated > 0
        ? `created ${totalTasksCreated} task${totalTasksCreated !== 1 ? "s" : ""}`
        : null,
      totalDraftsCreated > 0
        ? `drafted ${totalDraftsCreated} repl${totalDraftsCreated !== 1 ? "ies" : "y"}`
        : null,
      totalEventsCreated > 0
        ? `created ${totalEventsCreated} calendar event${totalEventsCreated !== 1 ? "s" : ""}`
        : null,
      errorCount > 0
        ? `${errorCount} error${errorCount !== 1 ? "s" : ""}`
        : null,
      upcomingEvents.length > 0
        ? `${upcomingEvents.length} upcoming event${upcomingEvents.length !== 1 ? "s" : ""}`
        : null,
    ]
      .filter(Boolean)
      .join(", ");

    //10. log completed Agent run
    const run = await completeAgentRun(agentRun.id, {
      status: overallStatus,
      summary: summary,
      actionsLog: actionsLog,
      emailsProcessed: successCount,
      tasksCreated: totalTasksCreated,
      draftsCreated: totalDraftsCreated,
      durationMs: Date.now() - startTime,
      errorMessage:
        errorCount > 0 ? `${errorCount} email(s) failed to process` : undefined,
    });
    // 11. and return the result
    return {
      runId: run.id,
      status: overallStatus,
      summary,
    };
  } catch (error) {
    console.error("Agent run error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const run = await completeAgentRun(agentRun.id, {
      status: "failed",
      summary: "Agent run failed",
      actionsLog: [],
      emailsProcessed: 0,
      tasksCreated: 0,
      draftsCreated: 0,
      durationMs: Date.now() - startTime,
    });
    return {
      runId: run.id,
      status: "failed",
      summary: errorMessage,
    };
  }
}
