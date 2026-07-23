import { CalendarEvent } from "./calender";
import { ParsedEmail } from "./gmail";
import { generateText, Output } from "ai";

import { z } from "zod";
import { aiModel } from "./model";

const emailAnalysisSchema = z.object({
  summary: z.string().describe("A 1-2 sentence summary of the email"),
  priority: z
    .enum(["low", "medium", "high"])
    .describe(
      "Priority level: high = urgent/time-sensitive, medium = requires action soon, low = informational",
    ),
  actionItems: z
    .array(
      z.object({
        title: z.string().describe("Short task title"),
        description: z
          .string()
          .describe("More detail about what needs to be done"),
        dueDate: z
          .string()
          .nullable()
          .describe(
            "ISO date string if a deadline is mentioned, otherwise null",
          ),
      }),
    )
    .describe("Concrete action items extracted from the email"),
  needsReply: z.boolean().describe("Whether this email requires a response"),
  draftReply: z
    .string()
    .nullable()
    .describe(
      "A professional draft reply if needsReply is true, otherwise null",
    ),
  calendarEvents: z
    .array(
      z.object({
        title: z
          .string()
          .describe(
            'Short event title, e.g. "Review proposal" or "Meeting with Sarah"',
          ),
        description: z
          .string()
          .describe("Brief event description with context from the email"),
        date: z
          .string()
          .describe(
            "ISO date string for the event (e.g. deadline day or meeting day)",
          ),
        startTime: z
          .string()
          .nullable()
          .describe(
            "ISO datetime string if a specific time is mentioned, otherwise null for all-day event",
          ),
        endTime: z
          .string()
          .nullable()
          .describe("ISO datetime string for event end, otherwise null"),
      }),
    )
    .describe(
      'Calendar events to create from this email. Create events for deadlines, meetings, reminders, or any time-sensitive items mentioned. If someone says "by Friday", create a reminder event on that day.',
    ),
  category: z
    .enum(["work", "personal", "newsletter", "notification", "spam", "other"])
    .describe("Email category for organization"),
});

export type EmailAnalysis = z.infer<typeof emailAnalysisSchema>;

// ---------------------------------------------------------------------------
// Safe fallback returned when all retries fail
// ---------------------------------------------------------------------------

function makeFallback(reason: string): EmailAnalysis {
  return {
    summary: `Could not analyze this email automatically. Reason: ${reason}`,
    priority: "low",
    actionItems: [],
    needsReply: false,
    draftReply: null,
    calendarEvents: [],
    category: "other",
  };
}

// ---------------------------------------------------------------------------
// Truncate email body to keep prompt within token budget
// Rough estimate: 1 token ≈ 4 chars. gpt-4o-mini context = 128k tokens.
// We budget 3000 tokens max for the body (≈12 000 chars).
// ---------------------------------------------------------------------------

const MAX_BODY_CHARS = 12_000;

function sanitizeBody(body: string): string {
  // Remove invisible Unicode characters (zero-width spaces, joiners, etc.)
  // eslint-disable-next-line no-control-regex
  let clean = body.replace(/[\u200B-\u200D\uFEFF\u00AD]/g, "");
  // Remove any leftover HTML entity sequences like &zwnj; &nbsp; etc.
  clean = clean.replace(/&[a-z]{2,8};/gi, " ");
  // Collapse excessive whitespace
  clean = clean.replace(/[ \t]{3,}/g, "  ").replace(/\n{4,}/g, "\n\n");
  // Hard-truncate
  if (clean.length > MAX_BODY_CHARS) {
    clean =
      clean.substring(0, MAX_BODY_CHARS) + "\n\n[Email truncated for AI processing]";
  }
  return clean.trim();
}

// ---------------------------------------------------------------------------
// Main analysis function with automatic retries
// ---------------------------------------------------------------------------

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

export async function anaylzeWithAI(
  email: ParsedEmail,
  upcomingEvents: CalendarEvent[],
): Promise<EmailAnalysis> {
  const today = new Date().toISOString().split("T")[0];

  let calendarContext = "";
  if (upcomingEvents.length > 0) {
    const eventsList = upcomingEvents
      .map(
        (e) =>
          `- ${e.summary} (${e.start} to ${e.end}${e.location ? `, at ${e.location}` : ""})`,
      )
      .join("\n");
    calendarContext = `\n\nUpcoming calendar events (next 24 hours):\n${eventsList}\n\nUse these events to inform your analysis. If the email mentions a meeting already on the calendar, do not create a duplicate task. If someone proposes a time conflicting with an existing event, note the conflict in the draft reply.`;
  }

  const body = sanitizeBody(email.body);

  const systemPrompt = `You are an AI email assistant. Today's date is ${today}. Analyze the email and extract structured data exactly matching the required JSON schema. Do not include markdown formatting, code fences, or any text outside the JSON object.`;

  const userPrompt = `Analyze the following email and extract structured information.

From: ${email.from}
To: ${email.to}
Subject: ${email.subject}
Date: ${email.date}

Body:
${body}${calendarContext}

Instructions:
- Extract action items for any tasks or requests mentioned.
- If the email mentions ANY deadline, meeting, or time-sensitive event (e.g. "by Friday", "next Tuesday", "schedule a call"), you MUST create a calendar event. Convert relative dates like "Friday" to actual ISO dates based on today (${today}).
- If a reply is needed, draft a professional response.
- Categorize the email and set priority based on urgency.
- For newsletters, promotions, or automated emails: set category to "newsletter" or "notification", priority to "low", needsReply to false, and skip action items.`;

  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await generateText({
        model: aiModel,
        maxOutputTokens: 2000,
        output: Output.object({ schema: emailAnalysisSchema }),
        system: systemPrompt,
        prompt: userPrompt,
      });

      return result.output;
    } catch (err) {
      lastError = err;
      console.error(
        `[AI] anaylzeWithAI attempt ${attempt}/${MAX_RETRIES} failed:`,
        err instanceof Error ? err.message : err,
      );

      if (attempt < MAX_RETRIES) {
        await new Promise((resolve) =>
          setTimeout(resolve, RETRY_DELAY_MS * attempt),
        );
      }
    }
  }

  // All retries exhausted — return a safe fallback so the agent doesn't crash
  console.error("[AI] All retries exhausted. Returning fallback analysis.", lastError);
  return makeFallback(
    lastError instanceof Error ? lastError.message : "Unknown AI error",
  );
}
