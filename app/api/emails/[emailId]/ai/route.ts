import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { draftReplyForEmail, summarizeEmail } from "@/agents/on-demand";
import { getAgentRuns, getUserByClerkId, updateActionLogEntry } from "@/db/queries";

const payload = z.object({ action: z.enum(["summary", "draft"]) });

/**
 * Runs a single on-demand agent for one triaged email.
 * - summary: summarizes the email and stores the new summary on the entry.
 * - draft:   returns a suggested reply; it only reaches Gmail when the user saves or sends it.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ emailId: string }> },
) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await getUserByClerkId(clerkId);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const parsed = payload.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const { emailId } = await params;
  const run = (await getAgentRuns(user.id)).find((r) => r.actionsLog.some((e) => e.emailId === emailId));
  const entry = run?.actionsLog.find((e) => e.emailId === emailId);
  if (!run || !entry) return NextResponse.json({ error: "Email not found" }, { status: 404 });

  const email = {
    id: entry.emailId,
    from: entry.from ?? "",
    subject: entry.subject ?? "",
    body: entry.body ?? "",
    snippet: entry.snippet ?? "",
  };

  try {
    if (parsed.data.action === "summary") {
      const result = await summarizeEmail(email);
      await updateActionLogEntry(user.id, run.id, emailId, { summary: result.summary });
      return NextResponse.json(result);
    }
    const result = await draftReplyForEmail(email, user.name ?? "");
    return NextResponse.json(result);
  } catch (error) {
    console.error(`AI ${parsed.data.action} failed:`, error);
    return NextResponse.json({ error: "The AI couldn't finish. Please try again." }, { status: 502 });
  }
}
