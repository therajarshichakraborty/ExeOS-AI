import Link from "next/link";
import {
  ArrowRightIcon,
  BellRingIcon,
  CalendarCheckIcon,
  LayersIcon,
  LockKeyholeIcon,
  MessageSquareReplyIcon,
  ShieldCheckIcon,
  XIcon,
  CheckIcon,
} from "lucide-react";
import { AgentCards } from "@/components/marketing/agent-cards";
import { InboxPreview } from "@/components/marketing/inbox-preview";
import { Faq } from "@/components/marketing/faq";
import { CtaBand, SectionHeading } from "@/components/marketing/section";
import { CountUp } from "@/components/motion/count-up";
import { Reveal } from "@/components/motion/reveal";

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

const AUDIENCE = [
  "Founders",
  "Recruiters",
  "Freelancers",
  "Sales leads",
  "Students",
  "Operators",
  "Consultants",
  "Engineering managers",
  "Agencies",
  "Researchers",
];

const BEFORE = [
  "142 unread, sorted by time, not importance",
  "Important threads buried under newsletters",
  "Replies written from scratch at 11pm",
  "Deadlines living only inside email bodies",
  "Every ping feels urgent",
];

const AFTER = [
  "A short list of what actually needs you",
  "Bulk mail quietly filed, never in your way",
  "Drafts waiting in the right Gmail thread",
  "Meetings and due dates already on your calendar",
  "Alerts only for the truly urgent few",
];

const DAY = [
  { time: "08:00", title: "Morning triage", body: "Overnight mail is ranked. You open a calm list of six, not sixty." },
  { time: "10:30", title: "One urgent ping", body: "A client deadline moved up. You get a single, clear push notification." },
  { time: "13:15", title: "Reply in a click", body: "The draft is already in the thread. Tweak a line, press send." },
  { time: "17:00", title: "Tomorrow, sorted", body: "The interview invite became a calendar hold while you were busy." },
];

const FAQ = [
  { q: "Does ExeOS send emails without me?", a: "Never. Replies are Gmail drafts until you press Send in ExeOS or Gmail." },
  { q: "Do I have to switch email clients?", a: "No. ExeOS works on top of Gmail, so everything stays in sync with your existing inbox." },
  { q: "How much does each run cost in AI usage?", a: "Bulk mail is sorted locally and real conversations are batched, so a run is usually a fraction of a cent." },
  { q: "Can I use it without an AI key?", a: "Yes. A built-in rules engine still ranks your mail and flags urgent messages." },
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
      <section className='px-5 pb-20'>
        <Reveal className='relative mx-auto max-w-5xl'>
          <div className='pointer-events-none absolute -inset-x-16 -inset-y-10 rounded-[3rem] bg-gradient-to-b from-brand/15 via-blue-400/10 to-transparent blur-3xl' />
          <InboxPreview className='relative' />
        </Reveal>
      </section>

      {/* Audience marquee */}
      <section className='pb-28' aria-label='Who uses ExeOS'>
        <p className='mb-6 text-center text-sm text-muted-foreground'>
          Made for people whose inbox is part of the job
        </p>
        <div className='group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]'>
          <div className='flex w-max animate-marquee gap-3 group-hover:[animation-play-state:paused]'>
            {[...AUDIENCE, ...AUDIENCE].map((label, i) => (
              <span
                key={i}
                aria-hidden={i >= AUDIENCE.length}
                className='rounded-full border bg-card px-5 py-2 text-sm whitespace-nowrap text-foreground/80 shadow-xs transition-colors hover:border-brand/40 hover:text-brand'
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Before / after */}
      <section className='mx-auto max-w-6xl space-y-14 px-5 pb-28'>
        <Reveal>
          <SectionHeading
            eyebrow='Before and after'
            title='Same inbox. Completely different day.'
            description='ExeOS does the sorting you were going to do anyway, before you even open your laptop.'
          />
        </Reveal>
        <div className='grid gap-5 md:grid-cols-2'>
          <Reveal className='rounded-3xl border bg-card p-8'>
            <p className='text-sm font-semibold text-muted-foreground'>Your inbox today</p>
            <ul className='mt-6 space-y-4'>
              {BEFORE.map((item) => (
                <li key={item} className='flex gap-3 text-[15px] text-muted-foreground'>
                  <span className='mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-muted'>
                    <XIcon className='size-3' />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal
            delay={120}
            className='relative overflow-hidden rounded-3xl border border-brand/30 bg-card p-8 shadow-xl shadow-brand/5'
          >
            <div className='pointer-events-none absolute -top-20 -right-20 size-56 rounded-full bg-brand/10 blur-3xl' />
            <p className='relative text-sm font-semibold text-brand'>With ExeOS</p>
            <ul className='relative mt-6 space-y-4'>
              {AFTER.map((item) => (
                <li key={item} className='flex gap-3 text-[15px]'>
                  <span className='mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand text-brand-foreground'>
                    <CheckIcon className='size-3' />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Agents */}
      <section className='mx-auto max-w-6xl space-y-14 px-5 pb-28'>
        <Reveal>
          <SectionHeading
            eyebrow='Built on the OpenAI Agents SDK'
            title={<>Three specialists, one tidy run.</>}
            description='Each agent does one job and sees only what it needs: fast, accurate and remarkably cheap to run.'
          />
        </Reveal>
        <Reveal delay={100}>
          <AgentCards />
        </Reveal>
      </section>

      {/* A day with ExeOS */}
      <section className='border-y bg-surface/60'>
        <div className='mx-auto grid max-w-6xl gap-14 px-5 py-28 lg:grid-cols-[1fr_1.3fr]'>
          <Reveal className='lg:sticky lg:top-28 lg:self-start'>
            <SectionHeading
              eyebrow='A day with ExeOS'
              title='Your inbox, working in the background.'
              description='No new habits to build. You just notice that email stopped being the loudest thing in your day.'
              className='mx-0 text-left'
            />
          </Reveal>
          <ol className='relative space-y-4'>
            {DAY.map(({ time, title, body }, i) => (
              <Reveal
                as='li'
                key={time}
                delay={i * 90}
                className='group relative flex gap-5 rounded-2xl border bg-card p-5 transition-shadow hover:shadow-lg'
              >
                <span className='grid h-9 w-14 shrink-0 place-items-center rounded-full bg-background font-mono text-xs ring-1 ring-border transition-colors duration-300 group-hover:bg-brand group-hover:text-brand-foreground group-hover:ring-brand'>
                  {time}
                </span>
                <div>
                  <h3 className='font-semibold'>{title}</h3>
                  <p className='mt-1 text-sm leading-relaxed text-muted-foreground'>{body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Numbers */}
      <section className='mx-auto max-w-6xl px-5 py-28'>
        <div className='grid grid-cols-2 gap-5 md:grid-cols-4'>
          {[
            { node: <CountUp to={3} />, label: "model calls per run, max" },
            { node: <CountUp to={15} />, label: "emails triaged per run" },
            { node: <CountUp to={1} prefix='<' suffix='¢' />, label: "typical AI cost per run" },
            { node: <CountUp to={0} />, label: "emails sent without you" },
          ].map(({ node, label }, i) => (
            <Reveal
              key={label}
              delay={i * 80}
              className='lift rounded-2xl border bg-card p-6 text-center hover:shadow-lg'
            >
              <p className='text-gradient text-5xl font-bold tracking-tight'>{node}</p>
              <p className='mt-2 text-sm text-muted-foreground'>{label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section className='mx-auto max-w-6xl px-5 pb-28'>
        <Reveal className='grid gap-px overflow-hidden rounded-3xl border bg-border md:grid-cols-3'>
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
        </Reveal>
        <p className='mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground'>
          <ShieldCheckIcon className='size-4 text-brand' /> Nothing is ever sent without your click.
        </p>
      </section>

      {/* FAQ */}
      <section className='mx-auto max-w-6xl space-y-12 px-5 pb-28'>
        <Reveal>
          <SectionHeading eyebrow='FAQ' title='Questions, answered.' />
        </Reveal>
        <Reveal delay={100}>
          <Faq items={FAQ} />
        </Reveal>
      </section>

      <Reveal>
        <CtaBand />
      </Reveal>
    </>
  );
}
