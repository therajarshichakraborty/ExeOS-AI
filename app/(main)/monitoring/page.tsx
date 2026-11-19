import type { Metadata } from "next";
import {
  CheckCircle2Icon,
  CircleDashedIcon,
  ClockIcon,
  XCircleIcon,
} from "lucide-react";
import { CalendarPopup } from "@/components/calendar-popup";
import { RunAgentButton } from "@/components/run-agent-button";
import { getInbox, getSessionUser } from "@/lib/inbox";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Activity" };

const STATUS = {
  success: { icon: CheckCircle2Icon, className: "text-brand", label: "Completed" },
  failed: { icon: XCircleIcon, className: "text-high", label: "Failed" },
  running: { icon: CircleDashedIcon, className: "animate-spin text-medium", label: "Running" },
} as const;

export default async function ActivityPage() {
  const { user } = await getSessionUser();
  const { runs, emails, counts } = await getInbox(user.id);
  const emailEvents = emails.flatMap((e) => e.calendarEvents ?? []);

  const stats = [
    { label: "Emails triaged", value: counts.all },
    { label: "High priority", value: counts.high, accent: "text-high" },
    { label: "Replies drafted", value: counts.drafts },
    { label: "Events scheduled", value: counts.scheduled },
  ];

  return (
    <div className='space-y-8 p-6 sm:p-8'>
      <div className='flex flex-col justify-between gap-4 sm:flex-row sm:items-end'>
        <div>
          <h1 className='text-2xl font-semibold tracking-tight'>Activity</h1>
          <p className='mt-1 text-sm text-muted-foreground'>
            Every agent run, what it read and what it did.
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <CalendarPopup emailEvents={emailEvents} triggerClassName='h-12 px-4' />
          <RunAgentButton />
        </div>
      </div>

      <div className='grid grid-cols-2 gap-px overflow-hidden rounded-2xl border bg-border lg:grid-cols-4'>
        {stats.map((s) => (
          <div key={s.label} className='bg-card p-5'>
            <p className='text-xs text-muted-foreground'>{s.label}</p>
            <p className={cn("mt-1 text-3xl font-semibold tracking-tight tabular-nums", s.accent)}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <section className='space-y-3'>
        <h2 className='text-sm font-semibold'>Run history</h2>
        {runs.length === 0 ? (
          <div className='rounded-2xl border border-dashed p-10 text-center text-sm text-muted-foreground'>
            No runs yet. Hit <span className='font-medium text-foreground'>Run triage</span> to start.
          </div>
        ) : (
          <ol className='divide-y overflow-hidden rounded-2xl border'>
            {runs.map((run) => {
              const s = STATUS[run.status];
              return (
                <li key={run.id} className='flex items-start gap-4 px-5 py-4'>
                  <s.icon className={cn("mt-0.5 size-5 shrink-0", s.className)} />
                  <div className='min-w-0 flex-1'>
                    <p className='text-sm font-medium'>{run.summary || s.label}</p>
                    {run.errorMessage && (
                      <p className='mt-0.5 truncate text-xs text-muted-foreground'>{run.errorMessage}</p>
                    )}
                    <div className='mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground'>
                      <span>{run.emailsProcessed} emails</span>
                      <span>{run.draftsCreated} drafts</span>
                      <span>{run.tasksCreated} tasks</span>
                    </div>
                  </div>
                  <div className='shrink-0 text-right text-xs text-muted-foreground'>
                    <p>{new Date(run.startedAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</p>
                    {run.durationMs != null && (
                      <p className='mt-1 inline-flex items-center gap-1'>
                        <ClockIcon className='size-3' /> {(run.durationMs / 1000).toFixed(1)}s
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </section>
    </div>
  );
}
