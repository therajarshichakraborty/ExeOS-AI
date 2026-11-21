import type { Metadata } from "next";
import {
  AlertCircleIcon,
  CalendarCheckIcon,
  ClockIcon,
  InboxIcon,
  ListChecksIcon,
  MailIcon,
  PenLineIcon,
} from "lucide-react";
import { CalendarPopup } from "@/components/calendar-popup";
import { CountUp } from "@/components/motion/count-up";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import { RunAgentButton } from "@/components/run-agent-button";
import { getInbox, getSessionUser } from "@/lib/inbox";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Activity" };

const STATUS = {
  success: { label: "Completed", pill: "bg-brand/10 text-brand", dot: "bg-brand" },
  failed: { label: "Failed", pill: "bg-high-soft text-high", dot: "bg-high" },
  running: { label: "Running", pill: "bg-medium-soft text-medium", dot: "bg-medium animate-pulse" },
} as const;

export default async function ActivityPage() {
  const { user } = await getSessionUser();
  const { runs, emails, counts } = await getInbox(user.id);
  const emailEvents = emails.flatMap((e) => e.calendarEvents ?? []);

  const stats = [
    { label: "Emails triaged", value: counts.all, icon: InboxIcon },
    { label: "High priority", value: counts.high, icon: AlertCircleIcon },
    { label: "Replies drafted", value: counts.drafts, icon: PenLineIcon },
    { label: "Events scheduled", value: counts.scheduled, icon: CalendarCheckIcon },
  ];

  return (
    <div className='mx-auto w-full max-w-[1400px] space-y-6 px-4 py-8 sm:px-8 sm:py-10'>
      <div className='flex animate-fade-up flex-col justify-between gap-5 sm:flex-row sm:items-end'>
        <div>
          <h2 className='text-3xl font-bold tracking-tight'>Activity</h2>
          <p className='mt-1.5 text-[17px] text-muted-foreground'>
            Every agent run, what it read and what it did.
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <CalendarPopup emailEvents={emailEvents} triggerClassName='h-11 rounded-xl px-4' />
          <RunAgentButton />
        </div>
      </div>

      <div className='stagger grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        {stats.map(({ label, value, icon: Icon }) => (
          <SpotlightCard key={label} className='group rounded-2xl p-6'>
            <div className='flex items-start justify-between'>
              <p className='text-[15px] text-muted-foreground'>{label}</p>
              <span className='grid size-10 place-items-center rounded-xl bg-muted text-foreground ring-1 ring-border transition-all duration-300 group-hover:bg-foreground group-hover:text-background'>
                <Icon className='size-[18px]' />
              </span>
            </div>
            <p className='mt-4 text-4xl font-bold tracking-tight'>
              <CountUp to={value} />
            </p>
          </SpotlightCard>
        ))}
      </div>

      <section className='animate-fade-up overflow-hidden rounded-2xl border bg-card [animation-delay:150ms]'>
        <div className='flex items-center justify-between border-b p-6'>
          <div>
            <h3 className='text-[17px] font-semibold'>Run history</h3>
            <p className='mt-0.5 text-sm text-muted-foreground'>{runs.length} {runs.length === 1 ? "run" : "runs"} recorded</p>
          </div>
        </div>
        {runs.length === 0 ? (
          <div className='flex flex-col items-center gap-3 px-6 py-20 text-center'>
            <span className='grid size-12 animate-float place-items-center rounded-2xl bg-muted text-foreground'>
              <ClockIcon className='size-5' />
            </span>
            <p className='font-medium'>No runs yet</p>
            <p className='text-sm text-muted-foreground'>
              Hit <span className='font-medium text-foreground'>Run triage</span> to start.
            </p>
          </div>
        ) : (
          <ol className='stagger p-3 sm:p-4'>
            {runs.map((run, i) => {
              const s = STATUS[run.status];
              const first = i === 0;
              const last = i === runs.length - 1;
              return (
                <li
                  key={run.id}
                  className='group grid grid-cols-[1.25rem_minmax(0,1fr)_auto] gap-x-4 rounded-xl px-3 transition-colors hover:bg-surface'
                >
                  {/* Timeline rail: line segments meet exactly at the dot's centre */}
                  <div className='relative flex justify-center'>
                    <span className={cn("absolute top-0 h-6 w-px bg-border", first && "invisible")} />
                    <span className={cn("absolute top-6 bottom-0 w-px bg-border", last && "invisible")} />
                    <span className='relative z-10 mt-4 grid size-4 place-items-center rounded-full bg-card ring-4 ring-card transition-colors group-hover:bg-surface group-hover:ring-surface'>
                      <span className={cn("size-2.5 rounded-full", s.dot)} />
                    </span>
                  </div>

                  <div className='min-w-0 py-3'>
                    <div className='flex flex-wrap items-center gap-2'>
                      <p className='leading-6 font-medium'>{run.summary || s.label}</p>
                      <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium", s.pill)}>{s.label}</span>
                    </div>
                    {run.errorMessage && (
                      <p className='mt-1 truncate text-sm text-high'>{run.errorMessage}</p>
                    )}
                    <div className='mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground'>
                      <span className='inline-flex items-center gap-1 rounded-md border bg-background px-2 py-1'>
                        <MailIcon className='size-3' /> {run.emailsProcessed} emails
                      </span>
                      <span className='inline-flex items-center gap-1 rounded-md border bg-background px-2 py-1'>
                        <PenLineIcon className='size-3' /> {run.draftsCreated} drafts
                      </span>
                      <span className='inline-flex items-center gap-1 rounded-md border bg-background px-2 py-1'>
                        <ListChecksIcon className='size-3' /> {run.tasksCreated} tasks
                      </span>
                    </div>
                  </div>

                  <div className='py-3 text-right text-xs leading-6 text-muted-foreground'>
                    <p>{new Date(run.startedAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</p>
                    {run.durationMs != null && (
                      <p className='inline-flex items-center gap-1 leading-4'>
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
