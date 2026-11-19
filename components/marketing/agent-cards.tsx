import { BellRingIcon, LayersIcon, MessageSquareReplyIcon } from "lucide-react";

export const AGENTS = [
  {
    icon: LayersIcon,
    name: "Classifier",
    tagline: "Priority triage in one pass",
    body: "Reads every unread email in a single batched call and sorts it into high, medium or low priority with a category, summary and any dates it finds.",
  },
  {
    icon: MessageSquareReplyIcon,
    name: "Reply suggester",
    tagline: "Drafts that sound like you",
    body: "Only wakes up for emails where a real person is waiting on you, then leaves a short, careful draft in Gmail. Nothing is ever sent without you.",
  },
  {
    icon: BellRingIcon,
    name: "Notifier",
    tagline: "Pings only when it matters",
    body: "Looks at what's urgent and writes a crisp push notification. Newsletters and receipts never interrupt you again.",
  },
];

export function AgentCards() {
  return (
    <div className='grid gap-4 md:grid-cols-3'>
      {AGENTS.map(({ icon: Icon, name, tagline, body }, i) => (
        <div
          key={name}
          className='group relative overflow-hidden rounded-2xl border bg-card p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg'
        >
          <div className='pointer-events-none absolute -top-24 -right-24 size-48 rounded-full bg-brand/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100' />
          <div className='mb-5 flex items-center justify-between'>
            <span className='grid size-10 place-items-center rounded-xl bg-brand-soft text-brand'>
              <Icon className='size-5' />
            </span>
            <span className='font-mono text-xs text-muted-foreground'>
              0{i + 1}
            </span>
          </div>
          <p className='text-xs font-medium tracking-wider text-muted-foreground uppercase'>
            {name}
          </p>
          <h3 className='mt-1 text-lg font-semibold tracking-tight'>{tagline}</h3>
          <p className='mt-2 text-sm leading-relaxed text-muted-foreground'>
            {body}
          </p>
        </div>
      ))}
    </div>
  );
}
