"use client";

import { useEffect, useRef, useState } from "react";
import {
  BellRingIcon,
  CalendarCheckIcon,
  ClockIcon,
  CornerDownLeftIcon,
  LayersIcon,
  MessageSquareReplyIcon,
  MoonIcon,
  PlusIcon,
  RefreshCwIcon,
  XIcon,
} from "lucide-react";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import { TONES, type Tone } from "@/lib/tones";
import { cn } from "@/lib/utils";

/* ======================================================================= */
/* 1. Live triage — type any subject and watch it get sorted                 */
/* ======================================================================= */

type Lane = "high" | "medium" | "low";
interface Mail {
  id: number;
  from: string;
  subject: string;
  lane: Lane;
  why?: string;
}

const HIGH_RE = /\b(urgent|asap|today|tonight|deadline|interview|contract|overdue|board|security|down|outage|offer|now)\b/i;
const MED_RE = /\b(meeting|sync|review|invoice|tomorrow|call|schedule|budget|feedback|proposal|week)\b/i;

function classify(subject: string): { lane: Lane; why: string } {
  const hi = subject.match(HIGH_RE);
  if (hi) return { lane: "high", why: `“${hi[0].toLowerCase()}” signals urgency` };
  const md = subject.match(MED_RE);
  if (md) return { lane: "medium", why: `“${md[0].toLowerCase()}” needs a plan` };
  return { lane: "low", why: "No action needed" };
}

const STREAM: Omit<Mail, "id" | "lane">[] = [
  { from: "Priya", subject: "Contract redlines by Thursday deadline" },
  { from: "Stripe", subject: "Your payout is on the way" },
  { from: "Linear", subject: "Roadmap sync moved to Friday" },
  { from: "Marcus", subject: "Final interview slots" },
  { from: "Substack", subject: "Your weekly digest" },
  { from: "Ana", subject: "Budget review notes" },
  { from: "AWS", subject: "Production is down, need eyes ASAP" },
  { from: "Figma", subject: "New comments on your file" },
];

const SAMPLES = ["Server outage, need help ASAP", "Lunch & learn next week", "50% off everything"];

const LANES: { key: Lane; label: string; dot: string; card: string; badge: string }[] = [
  { key: "high", label: "High", dot: "bg-high", card: "border-high/25", badge: "bg-high/10 text-high" },
  { key: "medium", label: "Medium", dot: "bg-medium", card: "border-medium/25", badge: "bg-medium/10 text-medium" },
  { key: "low", label: "Low", dot: "bg-low", card: "border-border", badge: "bg-muted text-muted-foreground" },
];

export function TriageDemo() {
  const seq = useRef(3);
  const [mails, setMails] = useState<Mail[]>(() =>
    STREAM.slice(0, 3).map((m, i) => ({ ...m, id: i, lane: classify(m.subject).lane })),
  );
  const [input, setInput] = useState("");
  const [userActive, setUserActive] = useState(false);
  const [latest, setLatest] = useState<number | null>(null);

  // Auto-feed until the visitor starts typing their own emails.
  useEffect(() => {
    if (userActive) return;
    const id = setInterval(() => {
      const next = STREAM[seq.current % STREAM.length]!;
      const mail = { ...next, id: seq.current++, ...classify(next.subject) };
      setMails((list) => [...list, mail].slice(-12));
      setLatest(mail.id);
    }, 1800);
    return () => clearInterval(id);
  }, [userActive]);

  const add = (subject: string) => {
    const text = subject.trim();
    if (!text) return;
    setUserActive(true);
    const mail = { from: "You", subject: text, id: seq.current++, ...classify(text) };
    setMails((list) => [...list, mail].slice(-12));
    setLatest(mail.id);
    setInput("");
  };

  const remove = (id: number) => setMails((list) => list.filter((m) => m.id !== id));
  const newest = mails.find((m) => m.id === latest);

  return (
    <div className='flex h-full flex-col gap-3 p-5'>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          add(input);
        }}
        className='flex items-center gap-2 rounded-2xl border bg-background p-1.5 pl-4 shadow-sm transition-shadow focus-within:shadow-md focus-within:ring-3 focus-within:ring-foreground/5'
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Type any email subject…'
          className='min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground'
          aria-label='Email subject to triage'
        />
        <button type='submit' className='btn-ink press inline-flex h-8 items-center gap-1.5 rounded-xl px-3 text-xs font-semibold'>
          Triage <CornerDownLeftIcon className='size-3' />
        </button>
      </form>
      <div className='flex flex-wrap items-center gap-1.5'>
        {SAMPLES.map((s) => (
          <button
            key={s}
            type='button'
            onClick={() => add(s)}
            className='press rounded-full border bg-background px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground'
          >
            {s}
          </button>
        ))}
        {newest?.why && (
          <span key={newest.id} className='ml-auto rounded-full bg-foreground px-2.5 py-1 text-[11px] font-medium text-background animate-in fade-in-0 zoom-in-95 duration-200'>
            {newest.why}
          </span>
        )}
      </div>
      <div className='grid min-h-0 flex-1 grid-cols-3 gap-2.5'>
        {LANES.map((lane) => {
          const all = mails.filter((m) => m.lane === lane.key);
          return (
            <div key={lane.key} className='flex min-h-0 flex-col gap-1.5 overflow-hidden rounded-2xl bg-muted/50 p-2'>
              <p className='flex items-center gap-1.5 px-1 text-[11px] font-semibold text-muted-foreground'>
                <span className={cn("size-1.5 rounded-full", lane.dot)} />
                {lane.label}
                <span className={cn("ml-auto rounded-md px-1.5 tabular-nums", lane.badge)}>{all.length}</span>
              </p>
              {all.slice(-3).reverse().map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    "group/mail relative rounded-xl border bg-card px-2.5 py-2 shadow-xs animate-in fade-in-0 zoom-in-95 slide-in-from-top-3 duration-300",
                    lane.card,
                    m.id === latest && "ring-2 ring-foreground/10",
                  )}
                >
                  <p className='truncate pr-4 text-[11px] font-semibold'>{m.from}</p>
                  <p className='truncate text-[10px] text-muted-foreground'>{m.subject}</p>
                  <button
                    type='button'
                    onClick={() => remove(m.id)}
                    aria-label='Archive'
                    className='absolute top-1.5 right-1.5 grid size-4 place-items-center rounded text-muted-foreground opacity-0 transition-opacity group-hover/mail:opacity-100 hover:bg-muted'
                  >
                    <XIcon className='size-3' />
                  </button>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ======================================================================= */
/* 2. Time-back calculator                                                   */
/* ======================================================================= */

const WEEK = [
  { d: "Mon", f: 1 },
  { d: "Tue", f: 1.15 },
  { d: "Wed", f: 0.95 },
  { d: "Thu", f: 1.2 },
  { d: "Fri", f: 0.9 },
  { d: "Sat", f: 0.35 },
  { d: "Sun", f: 0.25 },
];

export function TimeDemo() {
  const [perDay, setPerDay] = useState(120);
  const [hover, setHover] = useState<number | null>(null);
  // ~45 seconds saved per email on reading, sorting and drafting.
  const minutes = WEEK.map((w) => Math.round(perDay * w.f * 0.75));
  const max = Math.max(...minutes, 1);
  const weekHours = (minutes.reduce((a, b) => a + b, 0) / 60).toFixed(1);

  return (
    <div className='flex h-full flex-col justify-between gap-4 p-5'>
      <div className='flex items-end justify-between gap-4'>
        <div>
          <p className='text-xs text-muted-foreground'>Time back every week</p>
          <p className='text-4xl font-bold tracking-tight tabular-nums'>
            {weekHours}
            <span className='ml-1 text-lg font-semibold text-muted-foreground'>hrs</span>
          </p>
        </div>
        <span className='rounded-full bg-brand/10 px-2.5 py-1 text-xs font-semibold text-brand'>
          ≈ {((Number(weekHours) * 4.3) / 8).toFixed(1)} workdays a month
        </span>
      </div>

      <div className='flex h-28 items-end gap-2' onMouseLeave={() => setHover(null)}>
        {WEEK.map((w, i) => (
          <div key={w.d} onMouseEnter={() => setHover(i)} className='relative flex h-full flex-1 flex-col items-center justify-end gap-1'>
            {hover === i && (
              <span className='absolute -top-6 z-10 rounded-md bg-foreground px-1.5 py-0.5 text-[10px] font-semibold whitespace-nowrap text-background tabular-nums'>
                {minutes[i]} min
              </span>
            )}
            <div
              className={cn(
                "w-full rounded-t-[5px] transition-all duration-300 ease-out",
                hover === null || hover === i ? "bg-brand" : "bg-brand/30",
              )}
              style={{ height: `${Math.max(4, ((minutes[i] ?? 0) / max) * 100)}%` }}
            />
            <span className='text-[10px] text-muted-foreground'>{w.d}</span>
          </div>
        ))}
      </div>

      <label className='block'>
        <span className='flex justify-between text-xs text-muted-foreground'>
          <span>Emails you get per day</span>
          <span className='font-semibold text-foreground tabular-nums'>{perDay}</span>
        </span>
        <input
          type='range'
          min={10}
          max={400}
          step={10}
          value={perDay}
          onChange={(e) => setPerDay(Number(e.target.value))}
          className='mt-2 w-full cursor-pointer accent-brand'
        />
      </label>
    </div>
  );
}

/* ======================================================================= */
/* 3. Draft studio — switch tone, regenerate                                 */
/* ======================================================================= */

const DRAFTS: Record<string, string[]> = {
  Friendly: [
    "Hi Marcus! Tuesday at 2pm works perfectly. Really looking forward to meeting the team.",
    "Hey Marcus, thanks for the options! Tuesday 2pm is great for me. See you then!",
  ],
  Formal: [
    "Dear Marcus, thank you for the invitation. I confirm my availability on Tuesday at 2:00 PM.",
    "Dear Marcus, I would be glad to attend on Tuesday at 2:00 PM. Kind regards.",
  ],
  Brief: ["Tue 2pm works. Thanks, Marcus!", "Tuesday 2pm is perfect. See you then."],
};
const TONE_KEYS = Object.keys(DRAFTS);

export function DraftDemo() {
  const [tone, setTone] = useState("Friendly");
  const [variant, setVariant] = useState(0);
  const key = `${tone}-${variant}`;
  const text = DRAFTS[tone]?.[variant % 2] ?? "";
  const [typing, setTyping] = useState({ key, n: 0 });
  const n = typing.key === key ? typing.n : 0;

  useEffect(() => {
    const id = setInterval(() => {
      setTyping((t) => {
        const cur = t.key === key ? t.n : 0;
        return { key, n: Math.min(text.length, cur + 2) };
      });
    }, 18);
    const stop = setTimeout(() => clearInterval(id), (text.length / 2 + 3) * 18);
    return () => {
      clearInterval(id);
      clearTimeout(stop);
    };
  }, [key, text]);

  const done = n >= text.length;

  return (
    <div className='flex h-full flex-col gap-3 p-5'>
      <div className='flex items-center gap-1 self-start rounded-xl bg-muted/70 p-1'>
        {TONE_KEYS.map((t) => (
          <button
            key={t}
            type='button'
            onClick={() => setTone(t)}
            className={cn(
              "rounded-lg px-3 py-1 text-xs font-medium transition-all duration-200",
              tone === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t}
          </button>
        ))}
      </div>
      <div className='max-w-[85%] self-start rounded-2xl rounded-bl-md border bg-background px-3.5 py-2.5 text-xs shadow-xs'>
        <p className='font-semibold'>Marcus · Acme</p>
        <p className='mt-0.5 text-muted-foreground'>Could you do Tue 2pm or Wed 10am for the final round?</p>
      </div>
      <div className='max-w-[90%] self-end rounded-2xl rounded-br-md bg-foreground px-3.5 py-2.5 text-xs text-background shadow-lg'>
        <p className='mb-1 text-[10px] font-semibold tracking-wider text-background/60 uppercase'>{tone} draft</p>
        <p className='min-h-10 leading-relaxed'>
          {text.slice(0, n)}
          {!done && <span className='ml-px inline-block h-3 w-px translate-y-0.5 animate-blink bg-background' />}
        </p>
      </div>
      <div className='mt-auto flex items-center gap-2 self-end'>
        <button
          type='button'
          onClick={() => setVariant((v) => v + 1)}
          className='press inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1.5 text-[11px] font-medium hover:bg-muted'
        >
          <RefreshCwIcon className='size-3' /> Regenerate
        </button>
        <span className={cn("btn-ink rounded-full px-3.5 py-1.5 text-[11px] font-semibold transition-opacity", done ? "opacity-100" : "opacity-40")}>
          Send
        </span>
      </div>
    </div>
  );
}

/* ======================================================================= */
/* 4. Calendar planner — click to add / remove holds                         */
/* ======================================================================= */

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const SUGGESTED = [
  { day: 1, row: 1, title: "Final interview", tone: "violet" },
  { day: 2, row: 3, title: "Redlines due", tone: "rose" },
  { day: 4, row: 0, title: "Roadmap sync", tone: "sky" },
  { day: 0, row: 2, title: "Budget review", tone: "amber" },
] as const;
const EVENT_TONE = {
  violet: "border-foreground bg-muted text-foreground",
  rose: "border-high bg-high/10 text-high",
  sky: "border-foreground bg-muted text-foreground",
  amber: "border-medium bg-medium/10 text-medium",
  emerald: "border-brand bg-brand/10 text-brand",
} as const;
type Ev = { day: number; row: number; title: string; tone: keyof typeof EVENT_TONE };

export function CalendarDemo() {
  const [events, setEvents] = useState<Ev[]>([]);
  const [auto, setAuto] = useState(true);
  const step = useRef(0);

  // Auto-schedule the suggested holds one by one.
  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => {
      const next = SUGGESTED[step.current];
      if (!next) {
        setAuto(false);
        return;
      }
      step.current += 1;
      setEvents((list) =>
        list.some((e) => e.day === next.day && e.row === next.row) ? list : [...list, { ...next }],
      );
    }, 700);
    return () => clearInterval(id);
  }, [auto]);

  const toggle = (day: number, row: number) => {
    setAuto(false);
    setEvents((list) => {
      const hit = list.find((e) => e.day === day && e.row === row);
      if (hit) return list.filter((e) => e !== hit);
      return [...list, { day, row, title: "Focus block", tone: "emerald" }];
    });
  };

  const replay = () => {
    step.current = 0;
    setEvents([]);
    setAuto(true);
  };

  return (
    <div className='flex h-full flex-col gap-3 p-5'>
      <div className='flex items-center justify-between'>
        <p className='text-xs text-muted-foreground'>Click any slot to add or remove a hold</p>
        <button
          type='button'
          onClick={replay}
          className='press inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1 text-[11px] font-medium hover:bg-muted'
        >
          <RefreshCwIcon className={cn("size-3", auto && "animate-spin")} /> Auto-schedule
        </button>
      </div>
      <div className='grid flex-1 grid-cols-5 gap-1.5 rounded-2xl border bg-background p-2.5'>
        {DAYS.map((d, di) => (
          <div key={d} className='flex flex-col gap-1.5'>
            <p className='text-center text-[10px] font-semibold text-muted-foreground'>{d}</p>
            {[0, 1, 2, 3].map((r) => {
              const ev = events.find((e) => e.day === di && e.row === r);
              return (
                <button
                  key={r}
                  type='button'
                  onClick={() => toggle(di, r)}
                  className={cn(
                    "group/slot relative min-h-9 flex-1 rounded-lg text-left transition-colors duration-150",
                    ev ? "" : "bg-muted/50 hover:bg-muted",
                  )}
                  aria-label={ev ? `Remove ${ev.title}` : `Add hold on ${d}`}
                >
                  {ev ? (
                    <span
                      className={cn(
                        "absolute inset-0 rounded-lg border-l-[3px] px-1.5 py-1 text-[10px] leading-tight font-semibold animate-in fade-in-0 zoom-in-90 duration-200",
                        EVENT_TONE[ev.tone],
                      )}
                    >
                      {ev.title}
                    </span>
                  ) : (
                    <PlusIcon className='absolute inset-0 m-auto size-3 text-muted-foreground opacity-0 transition-opacity group-hover/slot:opacity-100' />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>
      <p className='flex items-center gap-2 text-xs'>
        <CalendarCheckIcon className='size-4 text-brand' />
        <span className='font-medium tabular-nums'>{events.length} holds</span>
        <span className='text-muted-foreground'>on your Google Calendar</span>
      </p>
    </div>
  );
}

/* ======================================================================= */
/* 5. Alerts — only urgent mail can interrupt you                            */
/* ======================================================================= */

const PINGS = [
  { title: "Redlines due Thursday", body: "Priya is waiting on contract edits.", urgent: true },
  { title: "Weekly digest", body: "12 tools we loved this month.", urgent: false },
  { title: "Production is down", body: "AWS alarm needs your eyes now.", urgent: true },
  { title: "Payout sent", body: "Stripe payout of $2,140 is on its way.", urgent: false },
  { title: "Interview tomorrow", body: "Marcus confirmed Tue 2:00 PM.", urgent: true },
  { title: "50% off sale", body: "Ends tonight at midnight.", urgent: false },
];

export function AlertsDemo() {
  const [urgentOnly, setUrgentOnly] = useState(true);
  const [quiet, setQuiet] = useState(false);
  const [feed, setFeed] = useState(() => PINGS.slice(0, 4).map((p, i) => ({ ...p, id: i })));
  const seq = useRef(4);

  const simulate = () => {
    const p = PINGS[seq.current % PINGS.length]!;
    setFeed((f) => [{ ...p, id: seq.current++ }, ...f].slice(0, 6));
  };

  const visible = feed.filter((p) => !quiet && (!urgentOnly || p.urgent));
  const muted = feed.length - visible.length;

  return (
    <div className='flex h-full flex-col gap-3 p-5'>
      <div className='flex flex-wrap items-center gap-2'>
        <Switch on={urgentOnly} onChange={setUrgentOnly} label='Urgent only' />
        <Switch on={quiet} onChange={setQuiet} label='Quiet hours' icon={<MoonIcon className='size-3' />} />
        <button
          type='button'
          onClick={simulate}
          className='press ml-auto inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1 text-[11px] font-medium hover:bg-muted'
        >
          <PlusIcon className='size-3' /> New mail
        </button>
      </div>
      <div className='flex min-h-0 flex-1 flex-col gap-2 overflow-hidden'>
        {visible.slice(0, 3).map((p) => (
          <div key={p.id} className='flex items-start gap-2.5 rounded-2xl border bg-background/90 p-3 shadow-sm backdrop-blur animate-in fade-in-0 slide-in-from-top-2 duration-300'>
            <span className={cn("grid size-8 shrink-0 place-items-center rounded-xl", p.urgent ? "bg-high/10 text-high" : "bg-muted text-muted-foreground")}>
              <BellRingIcon className='size-4' />
            </span>
            <div className='min-w-0'>
              <p className='truncate text-xs font-semibold'>{p.title}</p>
              <p className='truncate text-[11px] text-muted-foreground'>{p.body}</p>
            </div>
            <span className='ml-auto shrink-0 text-[10px] text-muted-foreground'>now</span>
          </div>
        ))}
        {visible.length === 0 && (
          <div className='grid flex-1 place-items-center rounded-2xl border border-dashed text-xs text-muted-foreground'>
            <span className='flex items-center gap-1.5'>
              <MoonIcon className='size-3.5' /> All quiet. Nothing interrupts you.
            </span>
          </div>
        )}
      </div>
      <p className='text-xs text-muted-foreground'>
        <span className='font-semibold text-foreground tabular-nums'>{muted}</span> notifications held back for later
      </p>
    </div>
  );
}

function Switch({
  on,
  onChange,
  label,
  icon,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  label: string;
  icon?: React.ReactNode;
}) {
  return (
    <button
      type='button'
      role='switch'
      aria-checked={on}
      onClick={() => onChange(!on)}
      className='inline-flex items-center gap-2 rounded-full border bg-background py-1 pr-3 pl-1 text-[11px] font-medium'
    >
      <span className={cn("relative h-4 w-7 rounded-full transition-colors duration-200", on ? "bg-brand" : "bg-muted-foreground/30")}>
        <span className={cn("absolute top-0.5 left-0.5 size-3 rounded-full bg-white shadow transition-transform duration-200", on && "translate-x-3")} />
      </span>
      {icon}
      {label}
    </button>
  );
}

/* ======================================================================= */
/* Bento (home)                                                              */
/* ======================================================================= */

const CARDS: { title: string; body: string; visual: React.ReactNode; className: string; tone: Tone; hint: string }[] = [
  {
    title: "Sorted by what matters",
    body: "Every unread email is ranked high, medium or low in one batched pass. Try it: type any subject above.",
    visual: <TriageDemo />,
    className: "lg:col-span-3",
    tone: "rose",
    hint: "Type to triage",
  },
  {
    title: "Hours back, every week",
    body: "Drag the slider to see how much reading, sorting and drafting ExeOS takes off your plate.",
    visual: <TimeDemo />,
    className: "lg:col-span-2",
    tone: "emerald",
    hint: "Drag the slider",
  },
  {
    title: "Drafts that sound like you",
    body: "Pick a tone and regenerate. Replies land in the right Gmail thread and never send without you.",
    visual: <DraftDemo />,
    className: "lg:col-span-2",
    tone: "violet",
    hint: "Switch the tone",
  },
  {
    title: "Deadlines land on your calendar",
    body: "Meetings and due dates become Google Calendar holds. Click the grid to add or remove your own.",
    visual: <CalendarDemo />,
    className: "lg:col-span-3",
    tone: "amber",
    hint: "Click a slot",
  },
];

export function Bento() {
  return (
    <div className='grid gap-4 lg:grid-cols-5'>
      {CARDS.map((card) => (
        <SpotlightCard key={card.title} className={cn("bg-surface/60", card.className)}>
          <div className='flex h-full flex-col'>
            <div className='relative h-80'>{card.visual}</div>
            <div className='p-7 pt-3'>
              <div className='flex items-center gap-2'>
                <h3 className='text-xl font-semibold tracking-tight'>{card.title}</h3>
                <span className={cn("ml-auto shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold", TONES[card.tone].tile)}>
                  {card.hint}
                </span>
              </div>
              <p className='mt-2 max-w-md leading-relaxed text-muted-foreground'>{card.body}</p>
            </div>
          </div>
        </SpotlightCard>
      ))}
    </div>
  );
}

/* ======================================================================= */
/* Feature explorer (features page)                                          */
/* ======================================================================= */

const TABS: { key: string; label: string; title: string; body: string; icon: typeof LayersIcon; tone: Tone; demo: React.ReactNode }[] = [
  { key: "triage", label: "Triage", title: "Priority, not chronology", body: "Type a subject and watch the classifier sort it into the right lane, with the reason why.", icon: LayersIcon, tone: "rose", demo: <TriageDemo /> },
  { key: "drafts", label: "Drafts", title: "Replies, already written", body: "Choose a tone and regenerate. Every draft lands in the original Gmail thread.", icon: MessageSquareReplyIcon, tone: "violet", demo: <DraftDemo /> },
  { key: "calendar", label: "Calendar", title: "Deadlines, already scheduled", body: "Dates in emails become calendar holds automatically. Click to add your own.", icon: CalendarCheckIcon, tone: "amber", demo: <CalendarDemo /> },
  { key: "alerts", label: "Alerts", title: "Only the urgent interrupts", body: "Flip the switches. Newsletters and receipts wait quietly while real fires reach you.", icon: BellRingIcon, tone: "sky", demo: <AlertsDemo /> },
  { key: "time", label: "Time saved", title: "Your week, handed back", body: "Drag the slider to your daily volume and see the hours you get back.", icon: ClockIcon, tone: "emerald", demo: <TimeDemo /> },
];

const AUTOPLAY_MS = 6500;

export function FeatureExplorer() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setTimeout(() => setActive((a) => (a + 1) % TABS.length), AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [active, paused]);

  const tab = TABS[active]!;

  return (
    <div className='grid gap-4 lg:grid-cols-[360px_1fr]'>
      <div
        role='tablist'
        aria-label='Features'
        className='flex gap-2 overflow-x-auto no-scrollbar lg:flex-col lg:overflow-visible'
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "ArrowRight") setActive((a) => (a + 1) % TABS.length);
          if (e.key === "ArrowUp" || e.key === "ArrowLeft") setActive((a) => (a - 1 + TABS.length) % TABS.length);
        }}
      >
        {TABS.map((t, i) => {
          const on = i === active;
          const tone = TONES[t.tone];
          return (
            <button
              key={t.key}
              role='tab'
              aria-selected={on}
              type='button'
              onClick={() => {
                setActive(i);
                setPaused(true);
              }}
              className={cn(
                "group relative shrink-0 overflow-hidden rounded-2xl border p-4 text-left transition-all duration-200 lg:p-5",
                on ? "bg-card shadow-soft" : "border-transparent hover:bg-card/60",
              )}
            >
              <div className='flex items-center gap-3'>
                <span className={cn("grid size-10 place-items-center rounded-xl transition-all duration-200", on ? tone.solid : tone.tile)}>
                  <t.icon className='size-[18px]' />
                </span>
                <div className='min-w-0'>
                  <p className='font-semibold'>{t.label}</p>
                  <p className='hidden truncate text-sm text-muted-foreground lg:block'>{t.title}</p>
                </div>
              </div>
              {on && (
                <p className='mt-3 hidden text-sm leading-relaxed text-muted-foreground animate-in fade-in-0 duration-200 lg:block'>{t.body}</p>
              )}
              {on && !paused && (
                <span
                  key={active}
                  className={cn("absolute inset-x-0 bottom-0 h-0.5 origin-left", tone.solid)}
                  style={{ animation: `grow-x ${AUTOPLAY_MS}ms linear both` }}
                />
              )}
            </button>
          );
        })}
      </div>

      <div
        className='relative min-h-[26rem] overflow-hidden rounded-[2rem] border bg-surface/60'
        onPointerEnter={() => setPaused(true)}
      >
        <div className={cn("pointer-events-none absolute -top-24 -right-24 size-72 rounded-full blur-3xl transition-colors duration-500", TONES[tab.tone].glow)} />
        <div key={tab.key} className='relative h-[26rem] animate-in fade-in-0 slide-in-from-bottom-2 duration-200'>
          {tab.demo}
        </div>
        {paused && (
          <button
            type='button'
            onClick={() => setPaused(false)}
            className='absolute right-4 bottom-4 rounded-full border bg-background/90 px-3 py-1 text-[11px] text-muted-foreground backdrop-blur hover:text-foreground'
          >
            Resume tour
          </button>
        )}
      </div>
    </div>
  );
}
