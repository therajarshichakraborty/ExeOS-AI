import Link from "next/link";
import {
  ArrowRightIcon,
  BellRingIcon,
  CalendarCheckIcon,
  LayersIcon,
  LockKeyholeIcon,
  MessageSquareReplyIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { AgentCards } from "@/components/marketing/agent-cards";
import { InboxPreview } from "@/components/marketing/inbox-preview";
import { CtaBand, SectionHeading } from "@/components/marketing/section";

const PILLARS = [
  {
    icon: LayersIcon,
    title: "Priority, not chronology",
    body: "Every unread email is ranked high, medium or low with a one-line summary, so you read what matters first.",
  },
  {
    icon: MessageSquareReplyIcon,
    title: "Replies, already drafted",
    body: "Careful drafts land in the right Gmail thread. Edit and send from ExeOS or Gmail, it's the same draft.",
  },
  {
    icon: BellRingIcon,
    title: "Alerts that earn it",
    body: "Push notifications only for the urgent few. Receipts and newsletters never interrupt your day again.",
  },
];

const STEPS = [
  { icon: LockKeyholeIcon, title: "Connect Google", body: "Secure OAuth, encrypted tokens, revoke any time." },
  { icon: LayersIcon, title: "Agents triage", body: "Priorities, drafts and calendar holds in one quiet run." },
  { icon: CalendarCheckIcon, title: "You decide", body: "Review in a Gmail-familiar inbox and hit send." },
];

/** Hand-drawn chevron mark echoing the brand, drawn on load. */
function Glyph() {
  return (
    <svg viewBox='0 0 64 48' className='mx-auto h-12 w-16 text-foreground/80' aria-hidden>
      <path
        d='M10 8 C 28 16, 44 20, 54 24 C 44 28, 28 34, 12 42'
        fill='none'
        stroke='currentColor'
        strokeWidth='6'
        strokeLinecap='round'
        className='[stroke-dasharray:120] [stroke-dashoffset:120] motion-safe:animate-[draw_1.2s_ease-out_0.2s_forwards] motion-reduce:[stroke-dashoffset:0]'
      />
    </svg>
  );
}

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className='relative overflow-hidden'>
        <div className='bg-grid pointer-events-none absolute inset-0 opacity-60' />
        <div className='relative mx-auto max-w-6xl px-5 pt-20 pb-20 text-center sm:pt-28'>
          <div className='stagger space-y-8'>
            <Glyph />
            <h1 className='mx-auto max-w-5xl text-5xl leading-[1.05] font-bold tracking-tight text-balance text-foreground/90 sm:text-7xl lg:text-[5.5rem]'>
              Email that finally <span className='text-gradient'>makes sense.</span>
            </h1>
            <p className='mx-auto max-w-2xl text-lg leading-relaxed text-balance text-muted-foreground sm:text-xl'>
              ExeOS reads your <span className='font-semibold text-foreground'>Gmail</span>, ranks it by
              priority, drafts the replies and puts deadlines on your{" "}
              <span className='font-semibold text-foreground'>Google Calendar</span>, then pings you only
              when it truly matters.
            </p>
            <div className='flex flex-wrap justify-center gap-3'>
              <Link
                href='/sign-up'
                className='press group inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-6 font-semibold text-primary-foreground shadow-lg shadow-primary/10 transition-all hover:opacity-90'
              >
                Start free
                <ArrowRightIcon className='size-4 transition-transform group-hover:translate-x-0.5' />
              </Link>
              <Link
                href='/features'
                className='press inline-flex h-12 items-center rounded-xl border bg-background px-6 font-semibold transition-colors hover:bg-muted'
              >
                See how it works
              </Link>
            </div>
          </div>

          {/* Three pillars, outlined icons as in the reference */}
          <div className='stagger mx-auto mt-24 grid max-w-5xl gap-10 text-left md:grid-cols-3'>
            {PILLARS.map(({ icon: Icon, title, body }) => (
              <div key={title} className='group flex gap-4'>
                <span className='grid size-11 shrink-0 place-items-center rounded-xl border-2 border-brand/60 text-brand transition-all duration-300 group-hover:-rotate-6 group-hover:bg-brand-soft'>
                  <Icon className='size-5' />
                </span>
                <div>
                  <h3 className='font-semibold'>{title}</h3>
                  <p className='mt-2 leading-relaxed text-muted-foreground'>{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product showcase */}
      <section className='px-5 pb-28'>
        <div className='relative mx-auto max-w-5xl'>
          <div className='pointer-events-none absolute -inset-x-16 -inset-y-10 rounded-[3rem] bg-gradient-to-b from-brand/15 via-blue-400/10 to-transparent blur-3xl' />
          <InboxPreview className='relative' />
        </div>
      </section>

      {/* Agents */}
      <section className='mx-auto max-w-6xl space-y-14 px-5 pb-28'>
        <SectionHeading
          eyebrow='Built on the OpenAI Agents SDK'
          title={<>Three specialists, one tidy run.</>}
          description='Each agent does one job and sees only what it needs: fast, accurate and remarkably cheap to run.'
        />
        <AgentCards />
      </section>

      {/* Steps */}
      <section className='mx-auto max-w-6xl px-5 pb-28'>
        <div className='grid gap-px overflow-hidden rounded-3xl border bg-border md:grid-cols-3'>
          {STEPS.map(({ icon: Icon, title, body }, i) => (
            <div key={title} className='group bg-card p-8 transition-colors hover:bg-surface'>
              <div className='flex items-center justify-between'>
                <Icon className='size-5 text-brand transition-transform duration-300 group-hover:scale-110' />
                <span className='font-mono text-xs text-muted-foreground'>0{i + 1}</span>
              </div>
              <h3 className='mt-6 text-lg font-semibold'>{title}</h3>
              <p className='mt-1.5 text-sm text-muted-foreground'>{body}</p>
            </div>
          ))}
        </div>
        <p className='mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground'>
          <ShieldCheckIcon className='size-4 text-brand' /> Nothing is ever sent without your click.
        </p>
      </section>

      <CtaBand />
    </>
  );
}
