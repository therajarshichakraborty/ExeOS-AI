import { getUserByClerkId } from "@/db/queries";
import { fetchUpcomingEvents } from "@/lib/agents/calender";
import { getCalendarClient } from "@/lib/google-client";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await getUserByClerkId(clerkId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const calendarClient = await getCalendarClient(user.id);
  if (!calendarClient) {
    return NextResponse.json(
      { error: "Google Calendar not connected" },
      { status: 400 },
    );
  }

  try {
    // Fetch upcoming events for the next 10 days (240 hours)
    const events = await fetchUpcomingEvents(calendarClient, 240);
    return NextResponse.json({ success: true, events });
  } catch (error: any) {
    console.error("Failed to fetch Google Calendar events:", error);
    return NextResponse.json(
      { success: false, error: error.message || String(error) },
      { status: 500 },
    );
  }
}
