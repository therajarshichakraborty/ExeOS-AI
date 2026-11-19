import Link from "next/link";
import {
  ArrowRightIcon,
  CalendarCheckIcon,
  CoinsIcon,
  LockKeyholeIcon,
  MailCheckIcon,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { AgentCards } from "@/components/marketing/agent-cards";
import { InboxPreview } from "@/components/marketing/inbox-preview";
import {
  Accent,
  CtaBand,
  Eyebrow,
  SectionHeading,
} from "@/components/marketing/section";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    icon: MailCheckIcon,
    title: "Connect Gmail & Calendar",
    body: "Secure Google OAuth. Tokens are encrypted at rest and you can disconnect any time.",
  },
  {
    icon: CalendarCheckIcon,
    title: "Agents triage your inbox",
    body: "Priorities, summaries, drafts and calendar holds — created in one quiet run.",
  },
  {
    icon: CoinsIcon,
    title: "You review in seconds",
    body: "A Gmail-familiar inbox sorted by what matters, with replies ready to send.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className='relative overflow-hidden'>
        <div className='bg-grid pointer-events-none absolute inset-0' />
        <div className='spotlight pointer-events-none absolute inset-0' />
        <div className='relative mx-auto max-w-6xl px-5 pt-20 pb-24 sm:pt-28'>
          <div className='mx-auto max-w-3xl animate-fade-up space-y-7 text-center'>
            <Eyebrow>Three AI agents, one calm inbox</Eyebrow>
            <h1 className='text-5xl font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl'>
              Your inbox, <Accent>quietly</Accent> handled.
            </h1>
            <p className='mx-auto max-w-xl text-lg leading-relaxed text-balance text-muted-foreground'>
              ExeOS reads your Gmail, ranks it by priority, drafts the replies,
              puts deadlines on your calendar and only taps you on the shoulder
              when something truly can&apos;t wait.
            </p>
            <div className='flex flex-wrap justify-center gap-3'>
              <Link
                href='/sign-up'
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-11 rounded-full px-6",
                )}
              >
                Start free <ArrowRightIcon />
              </Link>
              <Link
                href='/features'
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-11 rounded-full px-6",
                )}
              >
                See how it works
              </Link>
            </div>
            <p className='text-xs text-muted-foreground'>
              Free plan included · No credit card · Works with any Gmail account
            </p>
          </div>

          <div
            className='relative mx-auto mt-16 max-w-4xl animate-fade-up'
            style={{ animationDelay: "150ms" }}
          >
            <div className='pointer-events-none absolute -inset-x-10 -top-10 bottom-0 rounded-[3rem] bg-brand/10 blur-3xl' />
            <InboxPreview />
          </div>
        </div>
      </section>

      {/* Agents */}
      <section className='mx-auto max-w-6xl space-y-12 px-5 py-24'>
        <SectionHeading
          eyebrow='Built on the OpenAI Agents SDK'
          title={
            <>
              Three specialists. <Accent>One</Accent> tidy run.
            </>
          }
          description='Each agent does one job well and sees only what it needs — which keeps runs fast, accurate and remarkably cheap.'
        />
        <AgentCards />
      </section>

      {/* How it works */}
      <section className='border-y bg-surface/60'>
        <div className='mx-auto grid max-w-6xl gap-12 px-5 py-24 lg:grid-cols-[1fr_1.2fr] lg:items-center'>
          <div className='space-y-5'>
            <Eyebrow>How it works</Eyebrow>
            <h2 className='text-3xl font-semibold tracking-tight text-balance sm:text-4xl'>
              From overflowing to <Accent>organised</Accent> in three steps.
            </h2>
            <p className='leading-relaxed text-muted-foreground'>
              No new inbox to learn. ExeOS works on top of Gmail, so drafts,
              labels and events show up exactly where you expect them.
            </p>
            <div className='flex items-center gap-2 text-sm text-muted-foreground'>
              <LockKeyholeIcon className='size-4 text-brand' />
              AES-encrypted tokens · You approve every reply
            </div>
          </div>
          <ol className='space-y-3'>
            {STEPS.map(({ icon: Icon, title, body }, i) => (
              <li
                key={title}
                className='flex gap-4 rounded-2xl border bg-card p-5 shadow-xs'
              >
                <span className='grid size-10 shrink-0 place-items-center rounded-xl border bg-background'>
                  <Icon className='size-5 text-brand' />
                </span>
                <div>
                  <p className='font-medium'>
                    <span className='mr-2 font-mono text-xs text-muted-foreground'>
                      0{i + 1}
                    </span>
                    {title}
                  </p>
                  <p className='mt-1 text-sm leading-relaxed text-muted-foreground'>
                    {body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Stats */}
      <section className='mx-auto grid max-w-5xl grid-cols-2 gap-px overflow-hidden px-5 py-24 md:grid-cols-4'>
        {[
          ["3", "model calls per run, max"],
          ["< 1¢", "typical cost per triage"],
          ["15", "emails triaged per run"],
          ["0", "emails sent without you"],
        ].map(([value, label]) => (
          <div key={label} className='space-y-1 p-6 text-center'>
            <p className='text-4xl font-semibold tracking-tight'>{value}</p>
            <p className='text-sm text-muted-foreground'>{label}</p>
          </div>
        ))}
      </section>

      <CtaBand />
    </>
  );
}
