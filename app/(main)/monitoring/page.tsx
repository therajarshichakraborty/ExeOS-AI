import { EmailDetail } from "@/components/email-detail";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getAgentRuns,
  getOrCreateUser,
  getUserIntegrations,
} from "@/db/queries";
import { auth, currentUser } from "@clerk/nextjs/server";
import {
  AlertCircleIcon,
  FileTextIcon,
  ListTodoIcon,
  MailIcon,
  PlugZapIcon,
} from "lucide-react";
import { getGmailClient } from "@/lib/google-client";
import { parseGmailMessage } from "@/lib/agents/gmail";
import { CalendarPopup } from "@/components/calendar-popup";
import { redirect } from "next/navigation";
import { RunAgentButton } from "@/components/run-agent-button";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function MonitoringPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    redirect("/sign-in");
  }
  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses[0].emailAddress ?? "";
  const name = clerkUser?.fullName ?? "";
  const user = await getOrCreateUser(clerkId, email, name);

  const integrations = await getUserIntegrations(user.id);
  const isGmailConnected = integrations.some((i) => i.provider === "gmail");

  const runs = await getAgentRuns(user.id);

  const processedEmals: any[] = [];
  for (const run of runs) {
    const log = run.actionsLog ?? [];
    for (const entry of log) {
      if (entry.emailId) {
        processedEmals.push({
          ...entry,
          processedAt: run.startedAt,
        });
      }
    }
  }

  // Dynamically fetch missing body/snippets from Gmail for past runs/failed runs
  const gmailClient = await getGmailClient(user.id);
  if (gmailClient) {
    await Promise.allSettled(
      processedEmals.map(async (emailEntry) => {
        if (!emailEntry.body) {
          try {
            const msg = await gmailClient.users.messages.get({
              userId: "me",
              id: emailEntry.emailId,
              format: "full",
            });
            const parsed = parseGmailMessage(msg.data);
            emailEntry.body = parsed.body ?? "";
            emailEntry.snippet = parsed.snippet ?? "";
            if (!emailEntry.subject) {
              emailEntry.subject = parsed.subject ?? "";
            }
          } catch (err) {
            console.error(
              `Failed to fetch body fallback for ${emailEntry.emailId}:`,
              err,
            );
          }
        }
      }),
    );
  }

  // Collect calendar events extracted from emails by the AI agent
  const emailEvents: any[] = [];
  for (const email of processedEmals) {
    if (email.calendarEvents && email.calendarEvents.length > 0) {
      emailEvents.push(...email.calendarEvents);
    }
  }

  const highPriority = processedEmals.filter(
    (email) => email.priority === "high",
  ).length;
  const totalTasks = processedEmals.reduce(
    (acc, email) => acc + (email.tasksCreated ?? 0),
    0,
  );
  const totalDrafts = processedEmals.filter(
    (email) => email.draftCreated,
  ).length;
  const totalProcessed = processedEmals.length;

  return (
    <div className='page-wrapper space-y-8'>
      {/* Header Container */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-5'>
        <div>
          <h1 className='page-title text-3xl font-extrabold tracking-tight text-foreground'>
            Monitoring Hub
          </h1>
          <p className='page-description text-sm text-muted-foreground mt-1.5'>
            Real-time feed of emails categorized, replied, and scheduled by your
            autonomous AI loop.
          </p>
        </div>
        <div className='shrink-0 flex items-center gap-3'>
          <RunAgentButton
            className='w-auto px-4'
            label='Trigger AI Scan'
            variant='default'
          />
          <CalendarPopup emailEvents={emailEvents} />
        </div>
      </div>

      {/* Stats Counter Cards Grid */}
      <div className='grid gap-4 grid-cols-2 lg:grid-cols-4'>
        {[
          {
            label: "Emails Processed",
            value: totalProcessed,
            icon: MailIcon,
            color: "text-blue-500",
          },
          {
            label: "High Priority",
            value: highPriority,
            icon: AlertCircleIcon,
            color: "text-destructive",
          },
          {
            label: "Drafts Created",
            value: totalDrafts,
            icon: FileTextIcon,
            color: "text-emerald-500",
          },
          {
            label: "Tasks Extracted",
            value: totalTasks,
            icon: ListTodoIcon,
            color: "text-purple-500",
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className='border border-border/80 bg-card'>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                {label}
              </CardTitle>
              <Icon className={`h-4.5 w-4.5 ${color}`} />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-extrabold text-foreground tracking-tight'>
                {value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Feed List Section */}
      <div className='space-y-4 pt-2'>
        <div className='flex items-center gap-2 px-1'>
          <h2 className='text-sm font-semibold text-foreground uppercase tracking-wider'>
            Processed Feed
          </h2>
          <span className='h-2 w-2 rounded-full bg-emerald-500 animate-pulse' />
        </div>

        {processedEmals.length > 0 ? (
          <div className='space-y-3'>
            {processedEmals.map((email, idx) => (
              <EmailDetail key={`${email.emailId}-${idx}`} email={email} />
            ))}
          </div>
        ) : (
          <div className='text-center py-12 px-4 border border-dashed border-border rounded-2xl bg-card max-w-lg mx-auto space-y-4'>
            <div className='h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-primary'>
              <MailIcon className='h-6 w-6' />
            </div>
            {!isGmailConnected ? (
              <div className='space-y-3'>
                <h3 className='font-bold text-foreground text-base'>
                  Gmail Not Connected
                </h3>
                <p className='text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed'>
                  Your current account ({email}) has not connected Gmail yet.
                  Please connect your Gmail integration in Settings to allow
                  ExeOS-AI to process your unread emails.
                </p>
                <div className='pt-2'>
                  <Button variant='default' size='sm' className='gap-2'>
                    <Link href='/settings'>
                      <PlugZapIcon className='h-4 w-4' />
                      Go to Settings & Connect Gmail
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className='space-y-3'>
                <h3 className='font-bold text-foreground text-base'>
                  No processed emails found
                </h3>
                <p className='text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed'>
                  Gmail is connected for {email}. Click the button below to scan
                  your inbox for unread messages and generate AI summaries,
                  drafts, and tasks.
                </p>
                <div className='pt-2 flex justify-center'>
                  <RunAgentButton
                    className='w-auto px-6'
                    label='Run Agent Now'
                    variant='default'
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
