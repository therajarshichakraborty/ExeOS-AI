import type { Metadata } from "next";
import {
  BotIcon,
  DatabaseIcon,
  EyeOffIcon,
  KeyRoundIcon,
  LockIcon,
  MailIcon,
  PenLineIcon,
  ScrollTextIcon,
  ShieldCheckIcon,
  UnplugIcon,
} from "lucide-react";
import { CtaBand, PageHero, SectionHeading } from "@/components/marketing/section";
import { Reveal } from "@/components/motion/reveal";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import { TONES, TONE_CYCLE } from "@/lib/tones";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Security" };

const ITEMS = [
  { icon: KeyRoundIcon, title: "Encrypted OAuth tokens", body: "Google access and refresh tokens are AES-encrypted before they touch the database." },
  { icon: LockIcon, title: "Least-privilege scopes", body: "Gmail read/modify/compose and Calendar events only. Nothing broader than the job needs." },
  { icon: EyeOffIcon, title: "Minimal model exposure", body: "Agents receive clipped excerpts, not full mailboxes, and outputs are short structured JSON." },
  { icon: DatabaseIcon, title: "Scoped storage", body: "We keep run summaries, priorities and draft metadata: enough to show your history, nothing more." },
  { icon: ScrollTextIcon, title: "Auditable runs", body: "Every run records what was processed, drafted and scheduled, visible to you in Activity." },
  { icon: UnplugIcon, title: "Disconnect any time", body: "Revoke access in your Google account; revoked tokens are deleted automatically." },
];

const FLOW = [
  { icon: MailIcon, label: "Gmail", note: "Unread only" },
  { icon: ShieldCheckIcon, label: "ExeOS", note: "Encrypted tokens" },
  { icon: BotIcon, label: "Agents", note: "Clipped excerpts" },
  { icon: PenLineIcon, label: "Draft", note: "You hit send" },
];

export default function SecurityPage() {
  return (
    <>
      <PageHero
        eyebrow='Security'
        title='Your inbox is personal.'
        accent='We treat it that way.'
        description='ExeOS is built around a simple rule: touch as little of your data as possible, and make everything we do visible.'
      />

      {/* Data flow */}
      <section className='mx-auto -mt-4 max-w-5xl px-5 pb-32'>
        <Reveal className='relative overflow-hidden rounded-[2rem] border bg-card p-8 shadow-soft sm:p-12'>
          <p className='relative text-center text-sm font-semibold tracking-widest text-muted-foreground uppercase'>
            How your data moves
          </p>
          <div className='relative mt-10 grid grid-cols-2 gap-8 md:grid-cols-4'>
            <div className='pointer-events-none absolute top-9 right-[12%] left-[12%] hidden h-px overflow-hidden bg-border md:block'>
              <div className='h-full w-1/4 animate-beam bg-gradient-to-r from-transparent via-brand to-transparent' />
            </div>
            {FLOW.map(({ icon: Icon, label, note }, i) => (
              <div key={label} className='group relative text-center'>
                <span
                  className={
                    i === 1
                      ? "btn-ink mx-auto grid size-[4.5rem] place-items-center rounded-3xl transition-transform duration-500 group-hover:-translate-y-1"
                      : "mx-auto grid size-[4.5rem] place-items-center rounded-3xl border bg-background shadow-soft transition-transform duration-500 group-hover:-translate-y-1"
                  }
                >
                  <Icon className='size-7' />
                </span>
                <p className='mt-4 font-semibold'>{label}</p>
                <p className='text-sm text-muted-foreground'>{note}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section className='mx-auto max-w-7xl space-y-14 px-5 pb-32'>
        <Reveal>
          <SectionHeading title={<>Six promises, <span className='text-gradient'>kept by design.</span></>} />
        </Reveal>
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {ITEMS.map(({ icon: Icon, title, body }, i) => (
            <Reveal key={title} delay={(i % 3) * 90}>
              <SpotlightCard className='h-full p-7'>
                <span className={cn('grid size-11 place-items-center rounded-xl transition-all duration-300 group-hover/spot:scale-110 group-hover/spot:-rotate-6', TONES[TONE_CYCLE[i % TONE_CYCLE.length]!].tile, TONES[TONE_CYCLE[i % TONE_CYCLE.length]!].hoverTile)}>
                  <Icon className='size-5' />
                </span>
                <h3 className='mt-5 text-lg font-semibold tracking-tight'>{title}</h3>
                <p className='mt-2 leading-relaxed text-muted-foreground'>{body}</p>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </section>

      <CtaBand />
    </>
  );
}
