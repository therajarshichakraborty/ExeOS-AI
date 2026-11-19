import type { Metadata } from "next";
import {
  BellRingIcon,
  CalendarPlusIcon,
  FilterIcon,
  GaugeIcon,
  HistoryIcon,
  KeyRoundIcon,
  ListChecksIcon,
  MoonStarIcon,
  PenLineIcon,
} from "lucide-react";
import { AgentCards } from "@/components/marketing/agent-cards";
import { InboxPreview } from "@/components/marketing/inbox-preview";
import {
  Accent,
  CtaBand,
  PageHero,
  SectionHeading,
} from "@/components/marketing/section";

export const metadata: Metadata = { title: "Features" };

const FEATURES = [
  {
    icon: FilterIcon,
    title: "Priority inbox",
    body: "High, medium and low lanes with categories like work, finance and newsletters — filter in one click.",
  },
  {
    icon: PenLineIcon,
    title: "Drafts in Gmail",
    body: "Suggested replies land as real Gmail drafts in the right thread. Edit, send or discard.",
  },
  {
    icon: CalendarPlusIcon,
    title: "Calendar holds",
    body: "Deadlines and meetings become Google Calendar events, de-duplicated against what's already there.",
  },
  {
    icon: BellRingIcon,
    title: "Smart notifications",
    body: "Browser push for the few emails that are truly urgent, with an in-app bell for everything else.",
  },
  {
    icon: ListChecksIcon,
    title: "Action items",
    body: "Concrete to-dos are pulled out of long threads and saved with due dates.",
  },
  {
    icon: HistoryIcon,
    title: "Run history",
    body: "Every run is logged with what was read, drafted and scheduled — full transparency.",
  },
  {
    icon: GaugeIcon,
    title: "Token-frugal by design",
    body: "Batched calls, clipped inputs and short structured outputs keep AI costs to fractions of a cent.",
  },
  {
    icon: MoonStarIcon,
    title: "Works without AI too",
    body: "If the model is unavailable, a rules-based fallback still triages so nothing slips.",
  },
  {
    icon: KeyRoundIcon,
    title: "Private by default",
    body: "OAuth tokens are AES-encrypted. Emails are processed per run and never used for training.",
  },
];

export default function FeaturesPage() {
  return (
    <>
      <PageHero
        eyebrow='Features'
        title={
          <>
            Everything your inbox needs, <Accent>nothing</Accent> it
            doesn&apos;t.
          </>
        }
        description='ExeOS pairs the Gmail layout you already know with agents that do the sorting, drafting and scheduling for you.'
      />

      <section className='mx-auto max-w-6xl px-5'>
        <InboxPreview className='mx-auto max-w-4xl' />
      </section>

      <section className='mx-auto max-w-6xl space-y-12 px-5 py-24'>
        <SectionHeading
          eyebrow='The agents'
          title='Meet the team working your inbox'
          description='Each run calls at most three focused agents, in order.'
        />
        <AgentCards />
      </section>

      <section className='border-t bg-surface/60'>
        <div className='mx-auto max-w-6xl space-y-12 px-5 py-24'>
          <SectionHeading
            title={
              <>
                Thoughtful details, <Accent>everywhere</Accent>.
              </>
            }
          />
          <div className='grid gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-2 lg:grid-cols-3 [&>*]:bg-card'>
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <div key={title} className='space-y-3 p-7'>
                <Icon className='size-5 text-brand' />
                <h3 className='font-semibold tracking-tight'>{title}</h3>
                <p className='text-sm leading-relaxed text-muted-foreground'>
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className='pt-24'>
        <CtaBand />
      </div>
    </>
  );
}
