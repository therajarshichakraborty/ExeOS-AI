import type { Metadata } from "next";
import { CompassIcon, FeatherIcon, ShieldCheckIcon } from "lucide-react";
import { Accent, CtaBand, PageHero } from "@/components/marketing/section";

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

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow='About'
        title={
          <>
            We think email should feel <Accent>finished</Accent>.
          </>
        }
        description='ExeOS started as a weekend fix for a 400-unread inbox. It turned into a small set of agents that quietly do the triage most of us put off.'
      />

      <section className='mx-auto max-w-3xl space-y-6 px-5 text-lg leading-relaxed text-muted-foreground'>
        <p>
          The average professional spends hours a week deciding what deserves
          attention. Most of that work is pattern-matching: is this urgent, does
          someone need an answer, is there a date in here?
        </p>
        <p>
          Those are exactly the questions small, focused AI agents answer well.
          So ExeOS splits the job in three: a{" "}
          <span className='text-foreground'>classifier</span>, a{" "}
          <span className='text-foreground'>reply suggester</span> and a{" "}
          <span className='text-foreground'>notifier</span>, and wraps them in
          an inbox that feels like the one you already use.
        </p>
      </section>

      <section className='stagger mx-auto grid max-w-6xl gap-4 px-5 py-24 md:grid-cols-3'>
        {VALUES.map(({ icon: Icon, title, body }) => (
          <div key={title} className='lift rounded-2xl border bg-card p-7 hover:shadow-lg'>
            <Icon className='size-5 text-brand' />
            <h3 className='mt-4 font-semibold tracking-tight'>{title}</h3>
            <p className='mt-2 text-sm leading-relaxed text-muted-foreground'>
              {body}
            </p>
          </div>
        ))}
      </section>

      <section id='contact' className='mx-auto max-w-3xl scroll-mt-24 px-5 pb-24 text-center'>
        <h2 className='text-2xl font-semibold tracking-tight'>Say hello</h2>
        <p className='mt-2 text-muted-foreground'>
          Questions, feedback or team plans? Reach out from your account
          settings and a human will get back to you.
        </p>
      </section>

      <CtaBand />
    </>
  );
}
