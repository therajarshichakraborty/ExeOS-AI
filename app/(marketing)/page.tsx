import Link from "next/link";
import {
  ArrowRightIcon,
  BotIcon,
  CalendarDaysIcon,
  DatabaseIcon,
  KeyRoundIcon,
  LayersIcon,
  LockKeyholeIcon,
  MailIcon,
  MousePointerClickIcon,
  ShieldCheckIcon,
  TriangleIcon,
} from "lucide-react";
import { AgentCards } from "@/components/marketing/agent-cards";
import { BeforeAfter } from "@/components/marketing/before-after";
import { Bento } from "@/components/marketing/bento";
import { Faq } from "@/components/marketing/faq";
import { InboxPreview } from "@/components/marketing/inbox-preview";
import { CtaBand, HeroArcs, SectionHeading } from "@/components/marketing/section";
import { Stats } from "@/components/marketing/stats";
import { RoleCards, Testimonials } from "@/components/marketing/testimonials";
import { AnimatedWords } from "@/components/motion/animated-words";
import { Reveal } from "@/components/motion/reveal";

const STACK = [
  { icon: MailIcon, label: "Gmail" },
  { icon: CalendarDaysIcon, label: "Google Calendar" },
  { icon: BotIcon, label: "OpenAI Agents" },
  { icon: KeyRoundIcon, label: "Clerk" },
  { icon: DatabaseIcon, label: "Postgres" },
  { icon: TriangleIcon, label: "Vercel" },
];

const STEPS = [
  {
    icon: LockKeyholeIcon,
    title: "Connect Google",
    body: "Secure OAuth with encrypted tokens. Revoke any time from your Google account.",
  },
  {
    icon: LayersIcon,
    title: "Agents triage",
    body: "Priorities, drafts and calendar holds in one quiet, token-frugal run.",
  },
  {
    icon: MousePointerClickIcon,
    title: "You decide",
    body: "Review a calm, ranked inbox and send with one click. Nothing goes out without you.",
  },
];

const FAQ = [
  { q: "Does ExeOS send emails without me?", a: "Never. Replies are Gmail drafts until you press Send in ExeOS or Gmail." },
  { q: "Do I have to switch email clients?", a: "No. ExeOS works on top of Gmail, so everything stays in sync with your existing inbox." },
  { q: "How much does each run cost in AI usage?", a: "Bulk mail is sorted locally and real conversations are batched, so a run is usually a fraction of a cent." },
  { q: "Can I use it without an AI key?", a: "Yes. A built-in rules engine still ranks your mail and flags urgent messages." },
  { q: "Is my email used to train models?", a: "No. Emails are processed only for the run that handles them and are never used for training." },
];

export default function HomePage() {
  return (
    <>
      {/* ------------------------------------------------------------ Hero */}
      <section className='relative -mt-[76px] px-3 pt-[76px]'>
        <div className='relative mx-auto max-w-7xl overflow-hidden rounded-b-[2.5rem]'>
          <div className='hero-wash pointer-events-none absolute inset-0' />
          <HeroArcs className='h-[55%]' />

          <div className='relative mx-auto max-w-5xl px-5 pt-20 text-center sm:pt-28'>
            <Link
              href='/features'
              className='group mx-auto inline-flex animate-fade-up items-center gap-2 rounded-full border bg-card/80 py-1 pr-3 pl-1 text-sm shadow-sm backdrop-blur transition-colors hover:border-foreground/20'
            >
              <span className='rounded-full bg-brand px-2.5 py-0.5 text-xs font-semibold text-brand-foreground'>New</span>
              <span className='text-muted-foreground'>Drafts now sync straight into Gmail threads</span>
              <ArrowRightIcon className='size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5' />
            </Link>

            <h1 className='mt-8 text-[2.75rem] leading-[1.02] font-bold tracking-[-0.035em] text-balance sm:text-7xl lg:text-[5.75rem]'>
              <AnimatedWords text='The inbox that' delay={40} />{" "}
              <AnimatedWords text='runs itself.' delay={140} wordClassName='text-gradient pb-3' />
              <br className='hidden sm:block' />{" "}
              <AnimatedWords text='Calmer days,' delay={220} />{" "}
              <AnimatedWords text='by design.' delay={300} wordClassName='text-gradient pb-3' />
            </h1>

            <p
              className='mx-auto mt-7 max-w-2xl animate-fade-up text-lg leading-relaxed text-balance text-muted-foreground sm:text-xl'
              style={{ animationDelay: "250ms" }}
            >
              ExeOS reads your <span className='font-semibold text-foreground'>Gmail</span>, ranks it by
              priority, drafts the replies and puts deadlines on your{" "}
              <span className='font-semibold text-foreground'>Google Calendar</span>. It pings you only
              when it truly matters.
            </p>

            <div
              className='mt-10 flex animate-fade-up flex-wrap justify-center gap-3'
              style={{ animationDelay: "320ms" }}
            >
              <Link
                href='/sign-up'
                className='btn-ink sheen press group inline-flex h-13 items-center gap-2 rounded-2xl px-8 text-[15px] font-semibold'
              >
                Get started free
                <ArrowRightIcon className='size-4 transition-transform duration-300 group-hover:translate-x-1' />
              </Link>
              <Link
                href='/features'
                className='press inline-flex h-13 items-center gap-2 rounded-2xl border bg-background/80 px-8 text-[15px] font-semibold backdrop-blur transition-colors hover:bg-muted'
              >
                See how it works
              </Link>
            </div>

            <p
              className='mt-6 flex animate-fade-up items-center justify-center gap-2 text-sm text-muted-foreground'
              style={{ animationDelay: "380ms" }}
            >
              <ShieldCheckIcon className='size-4 text-brand' /> Free forever plan · No credit card ·
              Nothing sent without your click
            </p>

            <div
              className='relative mx-auto mt-20 max-w-6xl animate-fade-up pb-24 text-left'
              style={{ animationDelay: "420ms" }}
            >
              <InboxPreview />
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- Built on */}
      <section className='mx-auto max-w-6xl px-5 py-20' aria-label='Built on'>
        <p className='text-center text-lg font-semibold tracking-tight'>
          Built on the tools you already trust
        </p>
        <div className='mask-fade-x group mt-10 overflow-hidden'>
          <div className='flex w-max animate-marquee gap-14 group-hover:[animation-play-state:paused]'>
            {[...STACK, ...STACK].map(({ icon: Icon, label }, i) => (
              <span
                key={i}
                aria-hidden={i >= STACK.length}
                className='flex items-center gap-2.5 text-2xl font-bold tracking-tight whitespace-nowrap text-foreground/40 transition-colors duration-300 hover:text-foreground'
              >
                <Icon className='size-7' strokeWidth={2.25} />
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- Stats */}
      <section className='mx-auto max-w-7xl space-y-14 px-5 pb-32'>
        <Reveal>
          <SectionHeading
            title={
              <>
                Calm at <span className='text-gradient'>any</span> volume
              </>
            }
            description='Whether it is 20 unread or 2,000, ExeOS batches the work so every run stays fast, cheap and quiet.'
          />
        </Reveal>
        <Stats />
      </section>

      {/* ---------------------------------------------------------- Bento */}
      <section className='mx-auto max-w-7xl space-y-14 px-5 pb-32'>
        <Reveal>
          <SectionHeading
            title={
              <>
                Features so good you&apos;ll <span className='text-gradient'>love it</span>
              </>
            }
            description='Every card below is live. Type an email, drag the slider, switch the tone, click the calendar.'
          />
        </Reveal>
        <Reveal delay={100}>
          <Bento />
        </Reveal>
      </section>

      {/* ---------------------------------------------------- How it works */}
      <section className='px-3 pb-32'>
        <div className='panel-ink relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] px-6 py-24 text-white sm:px-12'>
          <Reveal className='relative mx-auto max-w-2xl space-y-5 text-center'>
            <h2 className='text-4xl leading-[1.05] font-bold tracking-tight sm:text-5xl'>
              Set up in <span className='bg-gradient-to-r from-white to-white/55 bg-clip-text text-transparent'>60 seconds.</span>
            </h2>
            <p className='text-lg text-white/65'>
              Three steps. No new email client, no migration, no habits to build.
            </p>
          </Reveal>
          <div className='relative mt-16 grid gap-5 md:grid-cols-3'>
            <div className='pointer-events-none absolute top-8 right-[16%] left-[16%] hidden h-px overflow-hidden bg-white/10 md:block'>
              <div className='h-full w-1/3 animate-beam bg-gradient-to-r from-transparent via-brand to-transparent' />
            </div>
            {STEPS.map(({ icon: Icon, title, body }, i) => (
              <Reveal key={title} delay={i * 120} className='group relative text-center'>
                <span className='relative mx-auto grid size-16 place-items-center rounded-2xl border border-white/15 bg-white/5 backdrop-blur transition-all duration-500 group-hover:-translate-y-1 group-hover:border-white/40 group-hover:bg-white/10'>
                  <Icon className='size-6 text-white/85 transition-colors group-hover:text-white' />
                  <span className='absolute -top-2 -right-2 grid size-6 place-items-center rounded-full bg-white font-mono text-[11px] font-bold text-slate-900'>
                    {i + 1}
                  </span>
                </span>
                <h3 className='mt-6 text-xl font-semibold'>{title}</h3>
                <p className='mx-auto mt-2 max-w-xs leading-relaxed text-white/60'>{body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------- Before/after */}
      <section className='mx-auto max-w-5xl space-y-12 px-5 pb-32'>
        <Reveal>
          <SectionHeading
            title={
              <>
                Same inbox. <span className='text-gradient'>Different day.</span>
              </>
            }
            description='ExeOS does the sorting you were going to do anyway, before you even open your laptop.'
          />
        </Reveal>
        <Reveal delay={100}>
          <BeforeAfter />
        </Reveal>
      </section>

      {/* --------------------------------------------------------- Agents */}
      <section className='mx-auto max-w-7xl space-y-14 px-5 pb-32'>
        <Reveal>
          <SectionHeading
            eyebrow='Built on the OpenAI Agents SDK'
            title={
              <>
                Three specialists. <span className='text-gradient'>One tidy run.</span>
              </>
            }
            description='Each agent does one job and sees only what it needs: fast, accurate and remarkably cheap to run.'
          />
        </Reveal>
        <Reveal delay={100}>
          <AgentCards />
        </Reveal>
      </section>

      {/* ---------------------------------------------------- Personas */}
      <section className='mx-auto max-w-7xl px-5 pb-32'>
        <Reveal>
          <Testimonials />
        </Reveal>
        <Reveal delay={100} className='mt-20'>
          <RoleCards />
        </Reveal>
      </section>

      {/* ------------------------------------------------------------ FAQ */}
      <section className='mx-auto max-w-6xl space-y-12 px-5 pb-32'>
        <Reveal>
          <SectionHeading
            title={
              <>
                Questions, <span className='text-gradient'>answered.</span>
              </>
            }
          />
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
