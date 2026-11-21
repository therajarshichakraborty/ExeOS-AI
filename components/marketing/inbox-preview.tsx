"use client";

import { useEffect, useState } from "react";
import {
  BellIcon,
  CalendarCheckIcon,
  CalendarIcon,
  CheckIcon,
  InboxIcon,
  LayoutGridIcon,
  LockIcon,
  PenLineIcon,
  ReplyIcon,
  SearchIcon,
  StarIcon,
} from "lucide-react";
import { LogoMark } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

const ROWS = [
  {
    from: "Priya Raman",
    org: "Northwind",
    subject: "Contract redlines needed by Thursday",
    summary: "Legal wants final redlines before Thursday's board call. Two clauses are still open.",
    priority: "high",
    tag: "Reply drafted",
    time: "9:41",
    draft: "Hi Priya, thanks for the nudge. I'll send the final redlines by Wednesday 5pm so legal has a full day before the board call.",
    event: "Redlines due · Wed 5:00 PM",
  },
  {
    from: "Design Review",
    org: "Linear",
    subject: "Moved: Q3 roadmap sync → Fri 11:00",
    summary: "The roadmap sync moved to Friday 11:00. Already added to your calendar.",
    priority: "medium",
    tag: "Scheduled",
    time: "9:12",
    draft: "Works for me. See you Friday at 11. I'll bring the updated Q3 milestones.",
    event: "Q3 roadmap sync · Fri 11:00 AM",
  },
  {
    from: "Marcus Lee",
    org: "Acme Hiring",
    subject: "Final round interview: next steps",
    summary: "Marcus is offering two interview slots next week and needs a pick by tomorrow.",
    priority: "high",
    tag: "Needs reply",
    time: "8:57",
    draft: "Hi Marcus, Tuesday at 2pm is perfect. Looking forward to meeting the team.",
    event: "Final interview · Tue 2:00 PM",
  },
  {
    from: "Stripe",
    org: "Payouts",
    subject: "Your payout is on the way",
    summary: "Routine payout notification. No action required.",
    priority: "low",
    tag: "Finance",
    time: "Yesterday",
    draft: "",
    event: "",
  },
  {
    from: "Product Weekly",
    org: "Newsletter",
    subject: "12 tools we loved this month",
    summary: "Newsletter, filed under your reading list.",
    priority: "low",
    tag: "Newsletter",
    time: "Yesterday",
    draft: "",
    event: "",
  },
] as const;

const DOT = { high: "bg-high", medium: "bg-medium", low: "bg-low" } as const;
const ACTIVE_CYCLE = [0, 1, 2];

/** Live, illustrative product shot used on marketing pages. */
export function InboxPreview({ className }: { className?: string }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [typing, setTyping] = useState({ id: 0, n: 0 });

  const row = ROWS[active];
  const typed = typing.id === active ? typing.n : 0;

  // Auto-advance through the actionable emails.
  useEffect(() => {
    if (paused) return;
    const id = setTimeout(() => {
      const idx = ACTIVE_CYCLE.indexOf(active);
      setActive(ACTIVE_CYCLE[(idx + 1) % ACTIVE_CYCLE.length] ?? 0);
    }, 5000);
    return () => clearTimeout(id);
  }, [active, paused]);

  // Type the draft out.
  useEffect(() => {
    const len = row.draft.length;
    if (!len) return;
    const id = setInterval(() => {
      setTyping((prev) => {
        const n = prev.id === active ? prev.n : 0;
        return { id: active, n: Math.min(len, n + 2) };
      });
    }, 18);
    const stop = setTimeout(() => clearInterval(id), (len / 2 + 4) * 18);
    return () => {
      clearInterval(id);
      clearTimeout(stop);
    };
  }, [active, row.draft]);

  const done = typed >= row.draft.length;

  return (
    <div
      className={cn("relative", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className='rounded-[1.75rem] border bg-card/70 p-2 shadow-float backdrop-blur-xl'>
        <div className='overflow-hidden rounded-[1.25rem] border bg-background'>
          {/* Window chrome */}
          <div className='flex items-center gap-3 border-b bg-surface/70 px-4 py-2.5'>
            <div className='flex gap-1.5'>
              <span className='size-3 rounded-full bg-[#ff5f57]' />
              <span className='size-3 rounded-full bg-[#febc2e]' />
              <span className='size-3 rounded-full bg-[#28c840]' />
            </div>
            <div className='mx-auto flex h-7 w-full max-w-xs items-center justify-center gap-1.5 rounded-lg border bg-background text-[11px] text-muted-foreground'>
              <LockIcon className='size-3' /> app.exeos.ai/dashboard
            </div>
            <span className='hidden w-14 sm:block' />
          </div>

          <div className='grid min-h-[420px] grid-cols-1 sm:grid-cols-[180px_1fr] lg:grid-cols-[180px_1fr_300px]'>
            {/* Sidebar */}
            <div className='hidden flex-col gap-1 border-r p-3 sm:flex'>
              <div className='mb-2 flex items-center gap-2 px-2 py-1.5 text-[13px] font-semibold'>
                <LogoMark className='size-5 rounded-md' />
                ExeOS
              </div>
              {[
                { icon: LayoutGridIcon, label: "Overview" },
                { icon: InboxIcon, label: "Inbox", count: 12, active: true },
                { icon: StarIcon, label: "High priority", count: 3 },
                { icon: PenLineIcon, label: "Drafted", count: 2 },
                { icon: CalendarIcon, label: "Scheduled", count: 2 },
              ].map(({ icon: Icon, label, count, active: on }) => (
                <div
                  key={label}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs",
                    on ? "bg-muted font-semibold text-foreground" : "text-muted-foreground",
                  )}
                >
                  <Icon className='size-3.5' />
                  <span className='flex-1'>{label}</span>
                  {count && <span className='text-[10px] tabular-nums'>{count}</span>}
                </div>
              ))}
              <div className='mt-auto rounded-xl border bg-brand/5 p-2.5'>
                <p className='flex items-center gap-1.5 text-[11px] font-semibold text-brand'>
                  <span className='relative flex size-1.5'>
                    <span className='absolute inset-0 animate-ping-soft rounded-full bg-brand' />
                    <span className='relative size-1.5 rounded-full bg-brand' />
                  </span>
                  Agents running
                </p>
                <div className='mt-2 h-1 overflow-hidden rounded-full bg-brand/15'>
                  <div className='h-full w-1/2 animate-beam rounded-full bg-brand' />
                </div>
              </div>
            </div>

            {/* List */}
            <div className='min-w-0'>
              <div className='flex items-center gap-2 border-b px-4 py-2.5'>
                <div className='flex h-8 flex-1 items-center gap-2 rounded-lg bg-muted px-3 text-xs text-muted-foreground'>
                  <SearchIcon className='size-3.5' /> Search mail
                </div>
                <span className='hidden items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-foreground sm:flex'>
                  Triaged
                </span>
              </div>
              <ul className='divide-y'>
                {ROWS.map((r, i) => {
                  const on = i === active;
                  return (
                    <li key={r.subject}>
                      <button
                        type='button'
                        onClick={() => r.draft && setActive(i)}
                        className={cn(
                          "relative flex w-full items-start gap-3 px-4 py-3 text-left transition-all duration-300",
                          on ? "bg-muted/70" : "hover:bg-muted/40",
                          !r.draft && "cursor-default opacity-70",
                        )}
                        style={{ animation: `fade-up 0.3s cubic-bezier(0.22,1,0.36,1) ${i * 40 + 80}ms both` }}
                      >
                        <span
                          className={cn(
                            "absolute inset-y-2 left-0 w-[3px] rounded-r-full bg-foreground transition-transform duration-300",
                            on ? "scale-y-100" : "scale-y-0",
                          )}
                        />
                        <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", DOT[r.priority])} />
                        <div className='min-w-0 flex-1'>
                          <div className='flex items-center justify-between gap-2'>
                            <p className='truncate text-[13px] font-semibold'>{r.from}</p>
                            <span className='shrink-0 text-[10px] text-muted-foreground tabular-nums'>{r.time}</span>
                          </div>
                          <p className='truncate text-[13px]'>{r.subject}</p>
                          <div className='mt-1 flex items-center gap-1.5'>
                            <span className='truncate text-[11px] text-muted-foreground'>{r.summary}</span>
                          </div>
                        </div>
                        <span
                          className={cn(
                            "mt-0.5 hidden shrink-0 rounded-full border px-2 py-0.5 text-[10px] md:inline lg:hidden xl:inline",
                            r.priority === "high" ? "border-high/30 text-high" : "text-muted-foreground",
                          )}
                        >
                          {r.tag}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Detail */}
            <div className='hidden flex-col gap-3 border-l bg-surface/40 p-4 lg:flex'>
              <div key={active} className='stagger flex flex-col gap-3'>
                <div>
                  <p className='text-[11px] text-muted-foreground'>{row.from} · {row.org}</p>
                  <p className='mt-0.5 text-sm leading-snug font-semibold'>{row.subject}</p>
                </div>
                <div className='rounded-xl border border-foreground/15 bg-card p-3'>
                  <p className='flex items-center gap-1 text-[10px] font-semibold tracking-wider text-foreground uppercase'>
                    Summary
                  </p>
                  <p className='mt-1 text-xs leading-relaxed'>{row.summary}</p>
                </div>
                <div className='rounded-xl border bg-card p-3'>
                  <p className='flex items-center gap-1 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase'>
                    <ReplyIcon className='size-3' /> Draft reply
                  </p>
                  <p className='mt-1 min-h-[4.5rem] text-xs leading-relaxed'>
                    {row.draft.slice(0, typed)}
                    {!done && <span className='ml-px inline-block h-3 w-px translate-y-0.5 animate-blink bg-foreground' />}
                  </p>
                </div>
                {row.event && (
                  <div
                    className={cn(
                      "flex items-center gap-2 rounded-xl border bg-card p-2.5 text-xs transition-all duration-500",
                      done ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
                    )}
                  >
                    <span className='grid size-7 place-items-center rounded-lg bg-medium/10 text-medium'>
                      <CalendarCheckIcon className='size-3.5' />
                    </span>
                    <span className='min-w-0 flex-1 truncate font-medium'>{row.event}</span>
                    <CheckIcon className='size-3.5 text-brand' />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating push notification */}
      <div className='absolute -right-4 -bottom-8 hidden w-72 animate-float rounded-2xl border bg-card/90 p-3.5 shadow-float backdrop-blur-xl sm:block'>
        <div className='flex items-start gap-3'>
          <span className='relative grid size-9 shrink-0 place-items-center rounded-xl bg-high-soft text-high'>
            <span className='absolute inset-0 animate-ping-soft rounded-xl bg-high/25' />
            <BellIcon className='size-4' />
          </span>
          <div className='min-w-0'>
            <p className='text-[13px] font-semibold'>Redlines due Thursday</p>
            <p className='text-xs leading-snug text-muted-foreground'>
              Priya is waiting on contract edits. Your draft is ready.
            </p>
          </div>
        </div>
      </div>

      {/* Floating run summary */}
      <div
        className='absolute -top-6 -left-4 hidden animate-float items-center gap-2.5 rounded-2xl border bg-card/90 py-2.5 pr-4 pl-2.5 shadow-float backdrop-blur-xl md:flex'
        style={{ animationDelay: "1.5s" }}
      >
        <div>
          <p className='text-[13px] font-semibold'>Triage complete</p>
          <p className='text-[11px] text-muted-foreground'>15 emails · 3 drafts · 2 events</p>
        </div>
      </div>
    </div>
  );
}
