"use client";

/* eslint-disable @next/next/no-img-element -- remote SVG avatars, no optimisation needed */
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRightIcon, CheckIcon, ZapIcon } from "lucide-react";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import { cn } from "@/lib/utils";

/**
 * Portraits are DiceBear "Notionists" illustrations (by Zoish, CC0 1.0, public
 * domain): https://www.dicebear.com/styles/notionists/
 * The seed is just a role label, so no user data ever leaves the page.
 */
const avatar = (seed: string, bg: string) =>
  `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(seed)}&backgroundColor=${bg}&radius=50`;

const PEOPLE = [
  {
    name: "Founders",
    img: avatar("Founder-Avery", "dbeafe"),
    role: "Investors, customers and hires in one inbox",
    quote: "Open your laptop to the six emails that matter, not sixty. Investor updates and customer escalations rise to the top on their own.",
    bullets: ["Investor and customer threads ranked first", "Board deadlines become calendar holds", "Newsletters filed, never deleted"],
    pos: "left-[18%] top-[4%]",
    size: "size-20 sm:size-28",
  },
  {
    name: "Recruiters",
    img: avatar("Recruiter-Jordan", "e2e8f0"),
    role: "Dozens of candidates, every week",
    quote: "Interview slots become calendar holds before you even read the thread, and candidates get a warm draft reply waiting in Gmail.",
    bullets: ["Interview slots turned into calendar holds", "Warm candidate replies drafted for you", "Scheduling back-and-forth flagged"],
    pos: "right-[6%] top-[0%]",
    size: "size-20 sm:size-28",
  },
  {
    name: "Freelancers",
    img: avatar("Freelancer-Riley", "e0e7ff"),
    role: "Clients, invoices and deadlines",
    quote: "Client requests are flagged, deadlines land on your calendar, and payout receipts stay quietly out of the way.",
    bullets: ["Client requests surfaced first", "Invoices and payouts quietly filed", "Project deadlines on your calendar"],
    pos: "left-[2%] top-[36%]",
    size: "size-24 sm:size-32",
  },
  {
    name: "Eng managers",
    img: avatar("Manager-Sam", "f1f5f9"),
    role: "Reviews, incidents and 1:1s",
    quote: "Only the truly urgent gets a push notification. Everything else waits calmly in a ranked list for your next break.",
    bullets: ["Incident mail pings you instantly", "Review requests ranked by urgency", "1:1 reschedules caught and scheduled"],
    pos: "left-[6%] bottom-[2%]",
    size: "size-20 sm:size-28",
  },
  {
    name: "Sales leads",
    img: avatar("Sales-Morgan", "dbeafe"),
    role: "Every reply is revenue",
    quote: "Prospects who are waiting on you are surfaced first, with a careful draft already in the thread.",
    bullets: ["Prospects waiting on you surface first", "Follow-up drafts ready in the thread", "Demo requests become calendar holds"],
    pos: "left-[42%] bottom-[0%]",
    size: "size-20 sm:size-28",
  },
  {
    name: "Consultants",
    img: avatar("Consultant-Casey", "e2e8f0"),
    role: "Many clients, one calm inbox",
    quote: "Every run is logged and nothing is ever sent without your click, so you stay fully in control of client communication.",
    bullets: ["Every client thread in one ranked list", "Every agent run logged for review", "Nothing sent without your click"],
    pos: "right-[2%] bottom-[10%]",
    size: "size-24 sm:size-32",
  },
];

const POINTS = [
  "Prove email ROI to your team",
  "Reply faster without writing from scratch",
  "Never miss a deadline buried in a thread",
];

export function Testimonials() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setActive((a) => (a + 1) % PEOPLE.length), 3500);
    return () => clearInterval(id);
  }, [paused]);

  const person = PEOPLE[active]!;

  return (
    <div className='grid items-center gap-16 lg:grid-cols-2'>
      <div className='space-y-8'>
        <h2 className='text-4xl leading-[1.05] font-bold tracking-tight sm:text-5xl lg:text-6xl'>
          Made for people who <span className='text-gradient'>live in email</span>
        </h2>
        <p className='max-w-lg text-lg leading-relaxed text-muted-foreground'>
          If your inbox is part of the job, ExeOS turns it into a short, calm
          list. Tap a role to see how it helps.
        </p>
        <ul className='space-y-4'>
          {POINTS.map((p) => (
            <li key={p} className='flex items-center gap-3 text-[17px]'>
              <span className='grid size-6 place-items-center rounded-full bg-brand/10 text-brand'>
                <CheckIcon className='size-3.5' strokeWidth={3} />
              </span>
              {p}
            </li>
          ))}
        </ul>

        <div key={active} className='relative max-w-lg rounded-3xl border bg-card p-6 shadow-soft animate-in fade-in-0 slide-in-from-bottom-2 duration-300'>
          <p className='text-[17px] leading-relaxed'>{person.quote}</p>
          <div className='mt-4 flex items-center gap-3'>
            <img src={person.img} alt='' width={40} height={40} className='size-10 rounded-full ring-1 ring-border' />
            <div>
              <p className='text-sm font-semibold'>{person.name}</p>
              <p className='text-xs text-muted-foreground'>{person.role}</p>
            </div>
            <div className='ml-auto flex gap-1'>
              {PEOPLE.map((p, i) => (
                <button
                  key={p.name}
                  type='button'
                  aria-label={`Show ${p.name}`}
                  onClick={() => setActive(i)}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    i === active ? "w-5 bg-foreground" : "w-1.5 bg-border hover:bg-muted-foreground/40",
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        <Link
          href='/sign-up'
          className='btn-ink sheen press group inline-flex h-12 items-center gap-2 rounded-full px-7 font-semibold'
        >
          Get started
          <ArrowRightIcon className='size-4 transition-transform duration-300 group-hover:translate-x-1' />
        </Link>
      </div>

      <div
        className='relative mx-auto aspect-square w-full max-w-[520px]'
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className='absolute inset-[18%] rounded-full border border-dashed border-foreground/15 animate-spin-slow' />
        <div className='absolute inset-[34%] rounded-full border border-foreground/10' />
        <div className='absolute top-1/2 left-1/2 grid size-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-3xl border bg-card shadow-float'>
          <ZapIcon className='size-9 fill-brand text-brand' />
        </div>

        {PEOPLE.map((p, i) => {
          const on = i === active;
          return (
            <button
              key={p.name}
              type='button'
              onClick={() => setActive(i)}
              aria-label={`How ExeOS helps ${p.name}`}
              className={cn("absolute", p.pos)}
            >
              <span
                className='block animate-float'
                style={{ animationDelay: `${i * 0.7}s`, animationDuration: `${6 + (i % 3)}s` }}
              >
                <img
                  src={p.img}
                  alt=''
                  width={128}
                  height={128}
                  loading='lazy'
                  className={cn(
                    "block rounded-full bg-card shadow-float ring-4 transition-all duration-300",
                    p.size,
                    on ? "scale-105 ring-brand/40" : "opacity-75 ring-background grayscale-[60%] hover:-translate-y-1 hover:opacity-100 hover:grayscale-0",
                  )}
                />
                <span
                  className={cn(
                    "mx-auto mt-2 block w-max rounded-lg px-2.5 py-1 text-xs font-semibold shadow-lg transition-colors duration-300",
                    on ? "bg-foreground text-background" : "border bg-background text-foreground",
                  )}
                >
                  {p.name}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** One card per role: who it is for and what ExeOS takes off their plate. */
export function RoleCards() {
  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
      {PEOPLE.map((p) => (
        <SpotlightCard key={p.name} className='h-full p-7'>
          <div className='flex items-center gap-4'>
            <img
              src={p.img}
              alt={`Illustration representing ${p.name.toLowerCase()}`}
              width={56}
              height={56}
              loading='lazy'
              className='size-14 rounded-full ring-1 ring-border transition-transform duration-300 group-hover/spot:scale-105'
            />
            <div>
              <h3 className='text-lg font-semibold tracking-tight'>{p.name}</h3>
              <p className='text-sm text-muted-foreground'>{p.role}</p>
            </div>
          </div>
          <ul className='mt-6 space-y-3'>
            {p.bullets.map((b) => (
              <li key={b} className='flex items-start gap-2.5 text-[15px]'>
                <span className='mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand/10 text-brand'>
                  <CheckIcon className='size-3' strokeWidth={3} />
                </span>
                {b}
              </li>
            ))}
          </ul>
        </SpotlightCard>
      ))}
    </div>
  );
}
