import {
  BellIcon,
  CalendarIcon,
  InboxIcon,
  PenLineIcon,
  SearchIcon,
  SparklesIcon,
  StarIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ROWS = [
  {
    from: "Priya, Northwind",
    subject: "Contract redlines needed by Thursday",
    summary: "Legal wants final redlines before the Thursday board call.",
    priority: "high",
    tag: "Reply drafted",
  },
  {
    from: "Design Review",
    subject: "Moved: Q3 roadmap sync → Fri 11:00",
    summary: "Meeting moved, added to your calendar automatically.",
    priority: "medium",
    tag: "Scheduled",
  },
  {
    from: "Stripe",
    subject: "Your payout is on the way",
    summary: "Routine payout notification, no action required.",
    priority: "low",
    tag: "Finance",
  },
  {
    from: "Product Weekly",
    subject: "12 tools we loved this month",
    summary: "Newsletter. Filed under reading list.",
    priority: "low",
    tag: "Newsletter",
  },
] as const;

const DOT = {
  high: "bg-high",
  medium: "bg-medium",
  low: "bg-low",
} as const;

/** Static, illustrative product shot used on marketing pages. */
export function InboxPreview({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border bg-card/80 p-2 shadow-2xl shadow-black/5 backdrop-blur-xl dark:shadow-black/40",
        className,
      )}
    >
      <div className='overflow-hidden rounded-xl border bg-background'>
        {/* top bar */}
        <div className='flex items-center gap-3 border-b px-4 py-3'>
          <div className='flex gap-1.5'>
            <span className='size-2.5 rounded-full bg-border' />
            <span className='size-2.5 rounded-full bg-border' />
            <span className='size-2.5 rounded-full bg-border' />
          </div>
          <div className='flex h-8 flex-1 items-center gap-2 rounded-full bg-muted px-3 text-xs text-muted-foreground'>
            <SearchIcon className='size-3.5' /> Search mail
          </div>
          <span className='hidden items-center gap-1 rounded-full bg-brand-soft px-2.5 py-1 text-[11px] font-medium text-brand sm:flex'>
            <SparklesIcon className='size-3' /> Agents on
          </span>
        </div>

        <div className='grid sm:grid-cols-[170px_1fr]'>
          {/* sidebar */}
          <div className='hidden space-y-1 border-r p-3 sm:block'>
            <div className='mb-3 flex items-center gap-2 rounded-xl bg-card px-3 py-2.5 text-xs font-medium shadow-sm ring-1 ring-border'>
              <PenLineIcon className='size-3.5' /> Run triage
            </div>
            {[
              { icon: InboxIcon, label: "Inbox", count: 12, active: true },
              { icon: StarIcon, label: "Priority", count: 3 },
              { icon: CalendarIcon, label: "Scheduled", count: 2 },
              { icon: BellIcon, label: "Alerts", count: 1 },
            ].map(({ icon: Icon, label, count, active }) => (
              <div
                key={label}
                className={cn(
                  "flex items-center gap-2 rounded-full px-3 py-1.5 text-xs",
                  active
                    ? "bg-accent font-semibold text-accent-foreground"
                    : "text-muted-foreground",
                )}
              >
                <Icon className='size-3.5' />
                <span className='flex-1'>{label}</span>
                <span className='text-[10px]'>{count}</span>
              </div>
            ))}
          </div>

          {/* list */}
          <div className='stagger divide-y'>
            {ROWS.map((row) => (
              <div
                key={row.subject}
                className='flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50'
              >
                <span
                  className={cn("mt-1.5 size-2 shrink-0 rounded-full", DOT[row.priority])}
                />
                <div className='min-w-0 flex-1'>
                  <div className='flex items-center justify-between gap-2'>
                    <p className='truncate text-[13px] font-semibold'>{row.from}</p>
                    <span className='shrink-0 rounded-full border px-2 py-0.5 text-[10px] text-muted-foreground'>
                      {row.tag}
                    </span>
                  </div>
                  <p className='truncate text-[13px]'>{row.subject}</p>
                  <p className='truncate text-xs text-muted-foreground'>
                    {row.summary}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* floating push notification */}
      <div className='glass absolute -right-3 -bottom-6 hidden w-64 animate-float rounded-xl p-3 shadow-xl sm:block'>
        <div className='flex items-start gap-2.5'>
          <span className='relative grid size-7 shrink-0 place-items-center rounded-lg bg-high-soft text-high'>
            <span className='absolute inset-0 animate-ping-soft rounded-lg bg-high/30' />
            <BellIcon className='size-3.5' />
          </span>
          <div className='min-w-0'>
            <p className='text-xs font-semibold'>Redlines due Thursday</p>
            <p className='text-[11px] leading-snug text-muted-foreground'>
              Priya is waiting on contract edits. Draft reply is ready.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
