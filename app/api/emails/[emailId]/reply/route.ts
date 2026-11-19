import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  getAgentRuns,
  getUserByClerkId,
  updateActionLogEntry,
} from "@/db/queries";
import { getGmailClient } from "@/lib/google/client";
import { saveReplyDraft, sendReply } from "@/lib/google/gmail";

const payload = z.object({
  body: z.string().trim().min(1, "Reply is empty").max(10_000),
  mode: z.enum(["draft", "send"]),
});

/**
 * Saves (mode=draft) or sends (mode=send) the reply for a triaged email.
 * Both go through the same Gmail draft, so the app and Gmail never diverge.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ emailId: string }> },
) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await getUserByClerkId(clerkId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const parsed = payload.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 400 },
    );
  }

  const { emailId } = await params;
  const run = (await getAgentRuns(user.id)).find((r) =>
    r.actionsLog.some((e) => e.emailId === emailId),
  );
  const entry = run?.actionsLog.find((e) => e.emailId === emailId);
  if (!run || !entry) {
    return NextResponse.json({ error: "Email not found" }, { status: 404 });
  }

  const gmail = await getGmailClient(user.id);
  if (!gmail) {
    return NextResponse.json(
      { error: "Reconnect Gmail in Settings to send replies" },
      { status: 400 },
    );
  }

  const { body, mode } = parsed.data;
  try {
    if (mode === "send") {
      await sendReply(gmail, { messageId: emailId, body, draftId: entry.draftId });
      await updateActionLogEntry(user.id, run.id, emailId, {
        draftReply: body,
        draftId: null,
        draftCreated: false,
        replySentAt: new Date().toISOString(),
      });
    } else {
      const draftId = await saveReplyDraft(gmail, {
        messageId: emailId,
        body,
        draftId: entry.draftId,
      });
      await updateActionLogEntry(user.id, run.id, emailId, {
        draftReply: body,
        draftId,
        draftCreated: true,
      });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(`Reply ${mode} failed:`, error);
    return NextResponse.json(
      { error: mode === "send" ? "Gmail couldn't send this reply" : "Couldn't save the draft" },
      { status: 502 },
    );
  }
}
