"use client";

import { useEffect, useState } from "react";
import {
  BellRingIcon,
  CalendarCheckIcon,
  CheckIcon,
  PenLineIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const WORDS = [
  { text: "triaged.", color: "text-high" },
  { text: "drafted.", color: "text-foreground" },
  { text: "scheduled.", color: "text-medium" },
  { text: "handled.", color: "text-brand" },
];

const ROWS = [
  { from: "Priya Raman", subject: "Contract redlines by Thursday", dot: "bg-high", tag: "Draft ready" },
  { from: "Marcus Lee", subject: "Final interview: pick a slot", dot: "bg-high", tag: "Needs reply" },
  { from: "Linear", subject: "Roadmap sync moved to Fri", dot: "bg-medium", tag: "Scheduled" },
  { from: "Stripe", subject: "Your payout is on the way", dot: "bg-low", tag: "Filed" },
];

/** The visual half of the auth screen: a live-looking product moment. */
export function AuthShowcase() {
  const [word, setWord] = useState(0);
  const [row, setRow] = useState(0);

  useEffect(() => {
    const a = setInterval(() => setWord((w) => (w + 1) % WORDS.length), 2200);
    const b = setInterval(() => setRow((r) => (r + 1) % ROWS.length), 1600);
    return () => {
      clearInterval(a);
      clearInterval(b);
    };
  }, []);

  const w = WORDS[word]!;

  return (
    <div className='relative flex h-full flex-col overflow-hidden rounded-[2rem] border bg-surface p-10 xl:p-14'>
      <div className='aurora pointer-events-none absolute inset-0 opacity-70' />

      {/* Product moment */}
      <div className='relative flex flex-1 items-center justify-center py-10'>
        <div className='relative w-full max-w-md'>
          <div className='rounded-3xl border bg-card/90 p-2 shadow-float backdrop-blur-xl animate-fade-up'>
            <div className='rounded-[1.1rem] border bg-background'>
              <div className='flex items-center justify-between border-b px-4 py-3'>
                <div>
                  <p className='text-sm font-semibold'>Today</p>
                  <p className='text-xs text-muted-foreground'>6 of 48 emails need you</p>
                </div>
                <span className='inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-2.5 py-1 text-[11px] font-semibold text-brand'>
                  <span className='relative flex size-1.5'>
                    <span className='absolute inset-0 animate-ping-soft rounded-full bg-brand' />
                    <span className='relative size-1.5 rounded-full bg-brand' />
                  </span>
                  Agents on
                </span>
              </div>
              <ul className='divide-y'>
                {ROWS.map((r, i) => (
                  <li
                    key={r.subject}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 transition-colors duration-300",
                      i === row && "bg-muted/60",
                    )}
                    style={{ animation: `fade-up 0.35s cubic-bezier(0.22,1,0.36,1) ${120 + i * 60}ms both` }}
                  >
                    <span className={cn("size-2 shrink-0 rounded-full", r.dot)} />
                    <div className='min-w-0 flex-1'>
                      <p className='truncate text-[13px] font-semibold'>{r.from}</p>
                      <p className='truncate text-xs text-muted-foreground'>{r.subject}</p>
                    </div>
                    <span className='shrink-0 rounded-full border px-2 py-0.5 text-[10px] text-muted-foreground'>{r.tag}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Floating satellites */}
          <div className='absolute -top-10 -right-6 flex w-60 animate-float items-start gap-2.5 rounded-2xl border bg-card/95 p-3 shadow-float backdrop-blur-xl xl:-right-16'>
            <span className='relative grid size-8 shrink-0 place-items-center rounded-xl bg-high/10 text-high'>
              <span className='absolute inset-0 animate-ping-soft rounded-xl bg-high/20' />
              <BellRingIcon className='size-4' />
            </span>
            <div className='min-w-0'>
              <p className='text-xs font-semibold'>Urgent: redlines due</p>
              <p className='text-[11px] leading-snug text-muted-foreground'>Priya is waiting. Draft is ready.</p>
            </div>
          </div>

          <div
            className='absolute -bottom-12 -left-8 flex animate-float items-center gap-2.5 rounded-2xl border bg-card/95 py-2.5 pr-4 pl-2.5 shadow-float backdrop-blur-xl xl:-left-16'
            style={{ animationDelay: "1.2s" }}
          >
            <span className='grid size-8 place-items-center rounded-xl bg-medium/10 text-medium'>
              <CalendarCheckIcon className='size-4' />
            </span>
            <div>
              <p className='text-xs font-semibold'>Hold added</p>
              <p className='text-[11px] text-muted-foreground'>Final interview · Tue 2:00 PM</p>
            </div>
          </div>

          <div
            className='absolute -right-4 -bottom-16 hidden animate-float items-center gap-2 rounded-2xl border bg-card/95 py-2 pr-3.5 pl-2 shadow-float backdrop-blur-xl xl:flex'
            style={{ animationDelay: "2.2s" }}
          >
            <span className='grid size-7 place-items-center rounded-lg bg-muted text-foreground'>
              <PenLineIcon className='size-3.5' />
            </span>
            <p className='text-[11px] font-semibold'>3 drafts in Gmail</p>
            <CheckIcon className='size-3.5 text-brand' />
          </div>
        </div>
      </div>

      {/* Copy */}
      <div className='relative space-y-5'>
        <h2 className='text-4xl leading-[1.08] font-bold tracking-tight xl:text-5xl'>
          Your inbox,{" "}
          <span key={word} className={cn("inline-block animate-in fade-in-0 slide-in-from-bottom-2 duration-300", w.color)}>
            {w.text}
          </span>
          <br />
          <span className='text-muted-foreground'>Before you even open it.</span>
        </h2>
        <div className='flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground'>
          <span className='flex items-center gap-1.5'>
            <ShieldCheckIcon className='size-4 text-brand' /> Nothing sent without your click
          </span>
          <span className='flex items-center gap-1.5'>
            <CheckIcon className='size-4 text-brand' /> Free forever plan
          </span>
        </div>
      </div>
    </div>
  );
}
