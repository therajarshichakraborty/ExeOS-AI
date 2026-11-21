import type { Metadata } from "next";
import {
  BellRingIcon,
  CompassIcon,
  FeatherIcon,
  LayersIcon,
  MessageSquareReplyIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { CtaBand, PageHero, SectionHeading } from "@/components/marketing/section";
import { Reveal } from "@/components/motion/reveal";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import { TONES, type Tone } from "@/lib/tones";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "About" };

const VALUES = [
  {
    icon: FeatherIcon,
    title: "Calm over clever",
    body: "Software should lower your heart rate. We'd rather show you three things that matter than thirty that might.",
  },
  {
    icon: ShieldCheckIcon,
    title: "You stay in control",
    body: "ExeOS drafts, suggests and schedules. It never sends. Every action is visible in your run history.",
  },
  {
    icon: CompassIcon,
    title: "Frugal by default",
    body: "We send models the minimum they need. Lower cost, lower latency, less of your data in flight.",
  },
];

const TRIO = [
  { icon: LayersIcon, label: "Classifier", tone: "rose" as Tone },
  { icon: MessageSquareReplyIcon, label: "Reply suggester", tone: "violet" as Tone },
  { icon: BellRingIcon, label: "Notifier", tone: "amber" as Tone },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow='About'
        title='We think email should feel'
        accent='finished.'
        description='ExeOS started as a weekend fix for a 400-unread inbox. It turned into a small set of agents that quietly do the triage most of us put off.'
      />

      <section className='mx-auto grid max-w-6xl items-center gap-14 px-5 pb-32 lg:grid-cols-[1.2fr_1fr]'>
        <Reveal className='space-y-6 text-xl leading-relaxed text-muted-foreground'>
          <p>
            The average professional spends hours a week deciding what deserves
            attention. Most of that work is pattern-matching:{" "}
            <span className='text-foreground'>is this urgent, does someone need an answer, is there a date in here?</span>
          </p>
          <p>
            Those are exactly the questions small, focused AI agents answer well.
            So ExeOS splits the job in three and wraps them in an inbox that
            feels like the one you already use.
          </p>
        </Reveal>
        <Reveal delay={120}>
          <div className='relative rounded-[2rem] border bg-surface p-8'>
            <div className='relative space-y-3'>
              {TRIO.map(({ icon: Icon, label, tone }, i) => (
                <div
                  key={label}
                  className='flex animate-float items-center gap-4 rounded-2xl border bg-card p-4 shadow-soft'
                  style={{ animationDelay: `${i * 0.8}s`, marginLeft: `${i * 1.5}rem` }}
                >
                  <span className={cn('grid size-11 place-items-center rounded-xl', TONES[tone].solid)}>
                    <Icon className='size-5' />
                  </span>
                  <div>
                    <p className='font-semibold'>{label}</p>
                    <p className='text-xs text-muted-foreground'>Agent 0{i + 1}</p>
                  </div>
                  <span className='ml-auto size-2 rounded-full bg-brand' />
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <section className='mx-auto max-w-7xl space-y-14 px-5 pb-32'>
        <Reveal>
          <SectionHeading title={<>What we <span className='text-gradient'>believe</span></>} />
        </Reveal>
        <div className='grid gap-4 md:grid-cols-3'>
          {VALUES.map(({ icon: Icon, title, body }, i) => (
            <Reveal key={title} delay={i * 100}>
              <SpotlightCard tilt className='h-full p-8'>
                <span className={cn('grid size-12 place-items-center rounded-2xl', TONES[(['emerald', 'sky', 'amber'] as Tone[])[i]!].tile)}>
                  <Icon className='size-5' />
                </span>
                <h3 className='mt-6 text-xl font-semibold tracking-tight'>{title}</h3>
                <p className='mt-2 leading-relaxed text-muted-foreground'>{body}</p>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </section>

      <section id='contact' className='mx-auto max-w-3xl scroll-mt-28 px-5 pb-32 text-center'>
        <Reveal className='rounded-[2rem] border bg-card p-12 shadow-soft'>
          <h2 className='text-3xl font-bold tracking-tight'>Say hello</h2>
          <p className='mt-3 text-lg text-muted-foreground'>
            Questions, feedback or team plans? Reach out from your account
            settings and a human will get back to you.
          </p>
        </Reveal>
      </section>

      <CtaBand />
    </>
  );
}
