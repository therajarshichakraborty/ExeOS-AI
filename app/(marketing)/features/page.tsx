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
import { FeatureExplorer } from "@/components/marketing/bento";
import { InboxPreview } from "@/components/marketing/inbox-preview";
import { CtaBand, PageHero, SectionHeading } from "@/components/marketing/section";
import { Reveal } from "@/components/motion/reveal";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import { TONES, TONE_CYCLE } from "@/lib/tones";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Features" };

const FEATURES = [
  { icon: FilterIcon, title: "Priority inbox", body: "High, medium and low lanes with categories like work, finance and newsletters. Filter in one click." },
  { icon: PenLineIcon, title: "Drafts in Gmail", body: "Suggested replies land as real Gmail drafts in the right thread. Edit, send or discard." },
  { icon: CalendarPlusIcon, title: "Calendar holds", body: "Deadlines and meetings become Google Calendar events, de-duplicated against what's already there." },
  { icon: BellRingIcon, title: "Smart notifications", body: "Browser push for the few emails that are truly urgent, with an in-app bell for everything else." },
  { icon: ListChecksIcon, title: "Action items", body: "Concrete to-dos are pulled out of long threads and saved with due dates." },
  { icon: HistoryIcon, title: "Run history", body: "Every run is logged with what was read, drafted and scheduled, for full transparency." },
  { icon: GaugeIcon, title: "Token-frugal by design", body: "Batched calls, clipped inputs and short structured outputs keep AI costs to fractions of a cent." },
  { icon: MoonStarIcon, title: "Works without AI too", body: "If the model is unavailable, a rules-based fallback still triages so nothing slips." },
  { icon: KeyRoundIcon, title: "Private by default", body: "OAuth tokens are AES-encrypted. Emails are processed per run and never used for training." },
];

export default function FeaturesPage() {
  return (
    <>
      <PageHero
        eyebrow='Features'
        title='Everything your inbox needs,'
        accent="nothing it doesn't."
        description='ExeOS pairs an inbox you already know how to use with agents that do the sorting, drafting and scheduling for you.'
      />

      <section className='mx-auto -mt-6 max-w-6xl px-5 pb-32'>
        <Reveal>
          <InboxPreview />
        </Reveal>
      </section>

      <section className='mx-auto max-w-7xl space-y-14 px-5 pb-32'>
        <Reveal>
          <SectionHeading
            title={<>Take it for a <span className='text-gradient'>spin</span></>}
            description='Every demo below is live. Type, drag, click and toggle. Pick a feature or let the tour play.'
          />
        </Reveal>
        <Reveal delay={100}>
          <FeatureExplorer />
        </Reveal>
      </section>

      <section className='mx-auto max-w-7xl space-y-14 px-5 pb-32'>
        <Reveal>
          <SectionHeading
            eyebrow='The agents'
            title={<>Meet the team working <span className='text-gradient'>your inbox</span></>}
            description='Each run calls at most three focused agents, in order.'
          />
        </Reveal>
        <Reveal delay={100}>
          <AgentCards />
        </Reveal>
      </section>

      <section className='mx-auto max-w-7xl space-y-14 px-5 pb-32'>
        <Reveal>
          <SectionHeading title={<>Thoughtful details, <span className='text-gradient'>everywhere.</span></>} />
        </Reveal>
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {FEATURES.map(({ icon: Icon, title, body }, i) => (
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
