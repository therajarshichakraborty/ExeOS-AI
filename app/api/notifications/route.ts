import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import {
  getNotifications,
  getUserByClerkId,
  markNotificationsRead,
} from "@/db/queries";

async function currentDbUser() {
  const { userId } = await auth();
  if (!userId) return null;
  return getUserByClerkId(userId);
}

export async function GET() {
  const user = await currentDbUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const notifications = await getNotifications(user.id);
    return NextResponse.json({
      notifications,
      unread: notifications.filter((n) => !n.read).length,
    });
  } catch (error) {
    console.error("Failed to load notifications:", error);
    return NextResponse.json({ notifications: [], unread: 0 });
  }
}

/** Body: { ids?: string[] }. Omit ids to mark everything read. */
export async function POST(request: NextRequest) {
  const user = await currentDbUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await request.json().catch(() => ({}))) as { ids?: unknown };
  const ids = Array.isArray(body.ids)
    ? body.ids.filter((id): id is string => typeof id === "string")
    : undefined;
  await markNotificationsRead(user.id, ids);
  return NextResponse.json({ ok: true });
}
