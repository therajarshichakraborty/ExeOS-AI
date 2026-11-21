import { BellRingIcon, LayersIcon, MessageSquareReplyIcon } from "lucide-react";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import { TONES, type Tone } from "@/lib/tones";
import { cn } from "@/lib/utils";

export const AGENTS = [
  {
    icon: LayersIcon,
    name: "Classifier",
    tagline: "Priority triage in one pass",
    body: "Reads every unread email in a single batched call and sorts it into high, medium or low priority with a category, summary and any dates it finds.",
    meta: "1 batched call",
    tone: "rose" as Tone,
  },
  {
    icon: MessageSquareReplyIcon,
    name: "Reply suggester",
    tagline: "Drafts that sound like you",
    body: "Only wakes up for emails where a real person is waiting on you, then leaves a short, careful draft in Gmail. Nothing is ever sent without you.",
    meta: "Only when needed",
    tone: "violet" as Tone,
  },
  {
    icon: BellRingIcon,
    name: "Notifier",
    tagline: "Pings only when it matters",
    body: "Looks at what's urgent and writes a crisp push notification. Newsletters and receipts never interrupt you again.",
    meta: "Urgent only",
    tone: "amber" as Tone,
  },
];

export function AgentCards() {
  return (
    <div className='relative grid gap-4 md:grid-cols-3'>
      {/* Connecting beam between the three agents */}
      <div className='pointer-events-none absolute top-[3.25rem] right-[16%] left-[16%] hidden h-px overflow-hidden bg-border md:block'>
        <div className='h-full w-1/3 animate-beam bg-gradient-to-r from-transparent via-foreground/40 to-transparent' />
      </div>
      {AGENTS.map(({ icon: Icon, name, tagline, body, meta, tone }, i) => (
        <SpotlightCard key={name} tilt className='p-7'>
          <div className='mb-6 flex items-center justify-between'>
            <span className={cn('grid size-12 place-items-center rounded-2xl transition-all duration-300 group-hover/spot:-rotate-6 group-hover/spot:scale-110', TONES[tone].tile, TONES[tone].hoverTile)}>
              <Icon className='size-5' />
            </span>
            <span className='rounded-full border bg-background px-2.5 py-1 font-mono text-[11px] text-muted-foreground'>
              0{i + 1} · {meta}
            </span>
          </div>
          <p className={cn('text-xs font-semibold tracking-widest uppercase', TONES[tone].text)}>{name}</p>
          <h3 className='mt-1.5 text-xl font-semibold tracking-tight'>{tagline}</h3>
          <p className='mt-3 leading-relaxed text-muted-foreground'>{body}</p>
        </SpotlightCard>
      ))}
    </div>
  );
}
