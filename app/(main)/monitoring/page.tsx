import type { Metadata } from "next";
import { ClockIcon } from "lucide-react";
import { CalendarPopup } from "@/components/calendar-popup";
import { RunAgentButton } from "@/components/run-agent-button";
import { getInbox, getSessionUser } from "@/lib/inbox";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Activity" };

const STATUS = {
  success: { label: "Completed", pill: "bg-brand-soft text-brand", dot: "bg-brand" },
  failed: { label: "Failed", pill: "bg-high-soft text-high", dot: "bg-high" },
  running: { label: "Running", pill: "bg-medium-soft text-medium", dot: "bg-medium animate-pulse" },
} as const;

/** Quiet status pill: a dot and a word, no glyph icons. */
function StatusPill({ status }: { status: keyof typeof STATUS }) {
  const s = STATUS[status];
  return (
    <span className={cn("inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium", s.pill)}>
      <span className={cn("size-1.5 rounded-full", s.dot)} />
      {s.label}
    </span>
  );
}

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
          <ol className='stagger divide-y overflow-hidden rounded-2xl border bg-card/60'>
            {runs.map((run) => {
              const s = STATUS[run.status];
              return (
                <li key={run.id} className='flex items-start gap-4 px-5 py-4 transition-colors hover:bg-card'>
                  <StatusPill status={run.status} />
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
