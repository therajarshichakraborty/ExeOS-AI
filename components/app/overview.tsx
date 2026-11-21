"use client";

import { useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------- Greeting */

const subscribe = () => () => {};

export function Greeting({ name }: { name: string }) {
  // Resolve the time of day in the viewer's own timezone, after hydration.
  const hour = useSyncExternalStore(subscribe, () => new Date().getHours(), () => null);
  const part =
    hour === null ? "Welcome back" : hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const first = name.split(" ")[0];
  return (
    <>
      {part}
      {first ? `, ${first}` : ""}
    </>
  );
}

/* ---------------------------------------------------------- Priority mix */

export interface MixRow {
  key: string;
  label: string;
  count: number;
  color: string;
}

/**
 * Part-to-whole bar (like the reference's language breakdown) with a legend
 * table underneath. Hovering a row or a segment highlights its partner.
 */
export function MixBar({ rows, empty }: { rows: MixRow[]; empty: string }) {
  const [hover, setHover] = useState<string | null>(null);
  const total = rows.reduce((s, r) => s + r.count, 0);
  const pct = (n: number) => (total ? Math.round((n / total) * 100) : 0);

  if (!total) {
    return (
      <div className='mt-6'>
        <div className='h-2.5 rounded-full bg-muted' />
        <p className='mt-6 text-sm text-muted-foreground'>{empty}</p>
      </div>
    );
  }

  return (
    <div className='mt-6' onMouseLeave={() => setHover(null)}>
      <div className='flex h-2.5 gap-[2px] overflow-hidden rounded-full'>
        {rows
          .filter((r) => r.count > 0)
          .map((r, i) => (
            <div
              key={r.key}
              title={`${r.label}: ${r.count} (${pct(r.count)}%)`}
              onMouseEnter={() => setHover(r.key)}
              className={cn(
                "h-full origin-left animate-grow-x transition-opacity duration-300 first:rounded-l-full last:rounded-r-full",
                r.color,
                hover && hover !== r.key && "opacity-30",
              )}
              style={{ width: `${(r.count / total) * 100}%`, animationDelay: `${i * 80}ms` }}
            />
          ))}
      </div>
      <table className='mt-5 w-full text-[15px]'>
        <tbody>
          {rows.map((r) => (
            <tr
              key={r.key}
              onMouseEnter={() => setHover(r.key)}
              className={cn(
                "transition-opacity duration-300",
                hover && hover !== r.key && "opacity-45",
              )}
            >
              <td className='py-2'>
                <span className='flex items-center gap-3'>
                  <span className={cn("size-2.5 shrink-0 rounded-full", r.color)} />
                  {r.label}
                </span>
              </td>
              <td className='w-16 py-2 text-right text-muted-foreground tabular-nums'>{r.count}</td>
              <td className='w-16 py-2 text-right font-medium tabular-nums'>{pct(r.count)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* -------------------------------------------------------- Activity chart */

export interface DayPoint {
  label: string;
  full: string;
  value: number;
}

/** Single-series column chart of emails triaged per day, with hover tooltip. */
export function ActivityChart({ days }: { days: DayPoint[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(1, ...days.map((d) => d.value));
  const total = days.reduce((s, d) => s + d.value, 0);
  const ticks = [max, Math.round(max / 2), 0];

  return (
    <div className='mt-6'>
      <div className='flex gap-3'>
        <div className='flex h-44 flex-col justify-between pb-0 text-right text-[11px] text-muted-foreground tabular-nums'>
          {ticks.map((t, i) => (
            <span key={i} className='-translate-y-1/2 first:translate-y-0 last:translate-y-0'>{t}</span>
          ))}
        </div>
        <div className='relative flex-1'>
          {/* gridlines */}
          <div className='pointer-events-none absolute inset-0 flex h-44 flex-col justify-between'>
            {ticks.map((_, i) => (
              <div key={i} className={cn("h-px", i === ticks.length - 1 ? "bg-border" : "bg-border/50")} />
            ))}
          </div>
          <div className='relative flex h-44 items-end gap-1.5' onMouseLeave={() => setHover(null)}>
            {days.map((d, i) => (
              <div
                key={d.full}
                onMouseEnter={() => setHover(i)}
                className='group relative flex h-full flex-1 cursor-default items-end justify-center'
              >
                {hover === i && (
                  <div className='absolute bottom-full z-10 mb-1 rounded-lg border bg-popover px-2.5 py-1.5 text-xs whitespace-nowrap shadow-lg animate-in fade-in-0 zoom-in-95'>
                    <p className='text-muted-foreground'>{d.full}</p>
                    <p className='font-semibold tabular-nums'>
                      {d.value} {d.value === 1 ? "email" : "emails"}
                    </p>
                  </div>
                )}
                <div
                  className={cn(
                    "w-full max-w-7 origin-bottom animate-grow-y rounded-t-[4px] transition-colors duration-200",
                    d.value === 0
                      ? "bg-muted"
                      : hover === null
                        ? "bg-brand"
                        : hover === i
                          ? "bg-brand"
                          : "bg-brand/30",
                  )}
                  style={{
                    height: d.value === 0 ? "2px" : `${Math.max(4, (d.value / max) * 100)}%`,
                    animationDelay: `${i * 35}ms`,
                  }}
                />
              </div>
            ))}
          </div>
          <div className='mt-2 flex gap-1.5 text-[11px] text-muted-foreground'>
            {days.map((d, i) => (
              <span key={d.full} className='flex-1 text-center'>
                {i % 3 === 0 || i === days.length - 1 ? d.label : ""}
              </span>
            ))}
          </div>
        </div>
      </div>
      {total === 0 && (
        <p className='mt-4 text-sm text-muted-foreground'>No runs in the last two weeks yet.</p>
      )}
    </div>
  );
}
