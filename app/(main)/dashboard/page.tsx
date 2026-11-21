import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { formatDistanceToNowStrict } from "date-fns";
import {
  ArrowRightIcon,
  CalendarCheckIcon,
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  ExternalLinkIcon,
  InboxIcon,
  MailIcon,
  PenLineIcon,
  ReplyIcon,
  StarIcon,
} from "lucide-react";
import { EmailReader } from "@/components/app/email-reader";
import { ActivityChart, Greeting, MixBar, type DayPoint } from "@/components/app/overview";
import { Chip, PriorityDot } from "@/components/app/priority";
import { CountUp } from "@/components/motion/count-up";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import { RunAgentButton } from "@/components/run-agent-button";
import { EmailSkeleton, InboxSkeleton, OverviewSkeleton } from "@/components/skeletons";
import { getInbox, getSessionUser, senderName, shortDate, type InboxEmail } from "@/lib/inbox";
import { TONES, type Tone } from "@/lib/tones";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Dashboard" };

type Params = { view?: string; cat?: string; q?: string; id?: string; p?: string; ai?: string };
type Inbox = Awaited<ReturnType<typeof getInbox>>;

const VIEW_FILTERS: Record<string, (e: InboxEmail) => boolean> = {
  high: (e) => e.priority === "high",
  reply: (e) => !!e.needsReply,
  drafts: (e) => !!e.draftCreated,
  scheduled: (e) => (e.eventsCreated ?? 0) > 0,
};

const VIEW_TITLES: Record<string, string> = {
  inbox: "Inbox",
  high: "High priority",
  reply: "Needs reply",
  drafts: "Drafted",
  scheduled: "Scheduled",
};

export default async function DashboardPage({ searchParams }: { searchParams: Promise<Params> }) {
  const params = await searchParams;
  const isOverview = !params.view && !params.cat && !params.q && !params.p && !params.id;
  const fallback = params.id ? <EmailSkeleton /> : isOverview ? <OverviewSkeleton /> : <InboxSkeleton />;
  // Keyed on the query so every view switch shows its own skeleton while data streams in.
  return (
    <Suspense key={JSON.stringify({ ...params, ai: undefined })} fallback={fallback}>
      <DashboardContent params={params} />
    </Suspense>
  );
}

async function DashboardContent({ params }: { params: Params }) {
  const { user, name } = await getSessionUser();
  const inbox = await getInbox(user.id);

  if (params.id) {
    const email = inbox.emails.find((e) => e.emailId === params.id);
    if (email) {
      const back = new URLSearchParams(
        Object.entries(params).filter(([k, v]) => k !== "id" && k !== "ai" && v) as [string, string][],
      ).toString();
      return (
        <EmailReader
          email={email}
          backHref={`/dashboard${back ? `?${back}` : ""}`}
          autoAction={params.ai === "summary" || params.ai === "draft" ? params.ai : undefined}
        />
      );
    }
  }

  const isOverview = !params.view && !params.cat && !params.q && !params.p;
  if (isOverview) return <Overview inbox={inbox} name={name} />;
  return <InboxList inbox={inbox} params={params} name={name} />;
}

/* ===================================================================== */
/* Overview                                                                */
/* ===================================================================== */

function timeAgo(input: string | Date) {
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return "";
  return formatDistanceToNowStrict(d, { addSuffix: true });
}

function lastTwoWeeks(runs: Inbox["runs"]): DayPoint[] {
  const days: DayPoint[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push({
      label: d.toLocaleDateString("en-US", { day: "numeric", month: "short" }),
      full: d.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" }),
      value: 0,
    });
  }
  for (const run of runs) {
    const d = new Date(run.startedAt);
    d.setHours(0, 0, 0, 0);
    const idx = 13 - Math.round((today.getTime() - d.getTime()) / 86_400_000);
    if (idx >= 0 && idx < 14 && days[idx]) days[idx].value += run.emailsProcessed ?? 0;
  }
  return days;
}

function Overview({ inbox, name }: { inbox: Inbox; name: string }) {
  const { counts, emails, runs } = inbox;

  const stats = [
    {
      label: "Emails triaged",
      value: counts.all,
      sub: `${counts.high} high · ${counts.medium} medium · ${counts.low} low`,
      icon: InboxIcon,
      href: "/dashboard?view=inbox",
      tone: "emerald" as Tone,
    },
    {
      label: "Needs your reply",
      value: counts.reply,
      sub: "People waiting on you",
      icon: ReplyIcon,
      href: "/dashboard?view=reply",
      tone: "rose" as Tone,
    },
    {
      label: "Drafts ready",
      value: counts.drafts,
      sub: "Saved in your Gmail threads",
      icon: PenLineIcon,
      href: "/dashboard?view=drafts",
      tone: "violet" as Tone,
    },
    {
      label: "Events scheduled",
      value: counts.scheduled,
      sub: "Added to Google Calendar",
      icon: CalendarCheckIcon,
      href: "/dashboard?view=scheduled",
      tone: "amber" as Tone,
    },
  ];

  const priorityRows = [
    { key: "high", label: "High priority", count: counts.high, color: "bg-high" },
    { key: "medium", label: "Medium priority", count: counts.medium, color: "bg-medium" },
    { key: "low", label: "Low priority", count: counts.low, color: "bg-low" },
  ];

  const pickUp = emails
    .filter((e) => !e.replySentAt && (e.needsReply || e.priority === "high"))
    .slice(0, 5);

  const recentRuns = runs.slice(0, 4);
  const days = lastTwoWeeks(runs);

  return (
    <div className='mx-auto w-full max-w-[1400px] space-y-6 px-4 py-8 sm:px-8 sm:py-10'>
      {/* Heading */}
      <div className='flex animate-fade-up flex-col justify-between gap-5 sm:flex-row sm:items-end'>
        <div>
          <h2 className='text-3xl font-bold tracking-tight sm:text-[2.1rem]'>
            <Greeting name={name} />
          </h2>
          <p className='mt-1.5 text-[17px] text-muted-foreground'>
            Here is what is happening across your inbox.
          </p>
        </div>
        <RunAgentButton label='Run triage' />
      </div>

      {(!inbox.gmailConnected || !inbox.calendarConnected) && (
        <Onboarding gmail={inbox.gmailConnected} calendar={inbox.calendarConnected} />
      )}

      {/* Stat cards */}
      <div className='stagger grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        {stats.map(({ label, value, sub, icon: Icon, href, tone }) => (
          <SpotlightCard key={label} className='rounded-2xl'>
            <Link href={href} className='group relative block p-6'>
              <div className='flex items-start justify-between'>
                <p className='text-[15px] text-muted-foreground'>{label}</p>
                <span className={cn("grid size-10 place-items-center rounded-xl transition-all duration-300", TONES[tone].tile, TONES[tone].hoverTile)}>
                  <Icon className='size-[18px]' />
                </span>
              </div>
              <p className='mt-4 text-4xl font-bold tracking-tight'>
                <CountUp to={value} />
              </p>
              <p className='mt-2 flex items-center gap-1 text-sm text-muted-foreground'>
                {sub}
                <ArrowRightIcon className='size-3.5 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100' />
              </p>
            </Link>
          </SpotlightCard>
        ))}
      </div>

      {/* Mix + pick up */}
      <div className='grid gap-4 lg:grid-cols-[1fr_1.25fr]'>
        <section className='animate-fade-up rounded-2xl border bg-card p-6 [animation-delay:150ms]'>
          <h3 className='text-[17px] font-semibold'>Priority mix</h3>
          <p className='mt-0.5 text-sm text-muted-foreground'>Share of triaged emails by priority</p>
          <MixBar rows={priorityRows} empty='Run triage to see how your inbox breaks down.' />
        </section>

        <section className='animate-fade-up overflow-hidden rounded-2xl border bg-card [animation-delay:200ms]'>
          <div className='flex items-start justify-between gap-4 border-b p-6'>
            <div>
              <h3 className='text-[17px] font-semibold'>Pick up where you left off</h3>
              <p className='mt-0.5 text-sm text-muted-foreground'>High-priority mail and people waiting on a reply</p>
            </div>
            <Link
              href='/dashboard?view=reply'
              className='shrink-0 text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline'
            >
              View all
            </Link>
          </div>
          {pickUp.length === 0 ? (
            <div className='flex flex-col items-center gap-3 px-6 py-14 text-center'>
              <span className='grid size-12 place-items-center rounded-2xl bg-brand/10 text-brand'>
                <CheckIcon className='size-5' />
              </span>
              <p className='font-medium'>You&apos;re all caught up</p>
              <p className='max-w-xs text-sm text-muted-foreground'>
                Nothing urgent is waiting on you right now.
              </p>
            </div>
          ) : (
            <ul className='stagger divide-y'>
              {pickUp.map((e) => (
                <li key={e.emailId}>
                  <Link
                    href={`/dashboard?id=${e.emailId}`}
                    className='group flex flex-col gap-2 px-6 py-4 transition-colors hover:bg-surface'
                  >
                    <div className='flex items-center justify-between gap-4'>
                      <p className='flex min-w-0 items-center gap-2.5 font-semibold'>
                        <PriorityDot priority={e.priority} />
                        <span className='truncate'>
                          {senderName(e.from)}
                          <span className='font-normal text-muted-foreground'> / {e.subject || "(No subject)"}</span>
                        </span>
                      </p>
                      <span className='shrink-0 text-sm text-muted-foreground'>{timeAgo(e.date || e.processedAt)}</span>
                    </div>
                    <p className='flex items-center gap-2.5 text-sm text-muted-foreground'>
                      <span className='truncate'>{e.summary || e.snippet}</span>
                    </p>
                    {e.draftCreated && (
                      <p className='flex items-center gap-2.5 text-sm text-muted-foreground'>
                        <PenLineIcon className='size-4 shrink-0' />
                        Draft reply ready in Gmail
                      </p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Activity + runs */}
      <div className='grid gap-4 lg:grid-cols-[1.25fr_1fr]'>
        <section className='animate-fade-up rounded-2xl border bg-card p-6 [animation-delay:250ms]'>
          <div className='flex items-start justify-between gap-4'>
            <div>
              <h3 className='text-[17px] font-semibold'>Emails triaged</h3>
              <p className='mt-0.5 text-sm text-muted-foreground'>Per day, last 14 days</p>
            </div>
            <p className='text-right'>
              <span className='text-2xl font-bold tabular-nums'>{days.reduce((s, d) => s + d.value, 0)}</span>
              <span className='block text-xs text-muted-foreground'>total</span>
            </p>
          </div>
          <ActivityChart days={days} />
        </section>

        <section className='animate-fade-up overflow-hidden rounded-2xl border bg-card [animation-delay:300ms]'>
          <div className='flex items-start justify-between gap-4 border-b p-6'>
            <div>
              <h3 className='text-[17px] font-semibold'>Recent runs</h3>
              <p className='mt-0.5 text-sm text-muted-foreground'>What the agents did, and when</p>
            </div>
            <Link href='/monitoring' className='shrink-0 text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline'>
              Activity
            </Link>
          </div>
          {recentRuns.length === 0 ? (
            <p className='px-6 py-14 text-center text-sm text-muted-foreground'>
              No runs yet. Hit <span className='font-medium text-foreground'>Run triage</span> to start.
            </p>
          ) : (
            <ul className='divide-y'>
              {recentRuns.map((run) => (
                <li key={run.id} className='flex items-center gap-4 px-6 py-4 transition-colors hover:bg-surface'>
                  <span className='relative flex size-2.5 shrink-0'>
                    {run.status === "running" && <span className='absolute inset-0 animate-ping-soft rounded-full bg-medium' />}
                    <span
                      className={cn(
                        "relative size-2.5 rounded-full ring-4",
                        run.status === "success" && "bg-brand ring-brand/15",
                        run.status === "failed" && "bg-high ring-high/15",
                        run.status === "running" && "bg-medium ring-medium/15",
                      )}
                    />
                  </span>
                  <div className='min-w-0 flex-1'>
                    <p className='truncate text-sm font-medium'>
                      {run.summary || (run.status === "failed" ? "Run failed" : "Triage run")}
                    </p>
                    <p className='mt-0.5 text-xs text-muted-foreground'>
                      {run.emailsProcessed} emails · {run.draftsCreated} drafts · {run.tasksCreated} tasks
                    </p>
                  </div>
                  <span className='shrink-0 text-right text-xs text-muted-foreground'>
                    {timeAgo(run.startedAt)}
                    {run.durationMs != null && (
                      <span className='mt-0.5 flex items-center justify-end gap-1'>
                        <ClockIcon className='size-3' /> {(run.durationMs / 1000).toFixed(1)}s
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

/* ===================================================================== */
/* Inbox list                                                              */
/* ===================================================================== */

function InboxList({ inbox, params, name }: { inbox: Inbox; params: Params; name: string }) {
  let emails = inbox.emails;
  if (params.view && VIEW_FILTERS[params.view]) emails = emails.filter(VIEW_FILTERS[params.view]);
  if (params.cat) emails = emails.filter((e) => e.category === params.cat);
  if (params.p) emails = emails.filter((e) => e.priority === params.p);
  if (params.q) {
    const q = params.q.toLowerCase();
    emails = emails.filter((e) =>
      [e.subject, e.from, e.summary, e.snippet].some((f) => f?.toLowerCase().includes(q)),
    );
  }

  const title = params.q
    ? `Results for “${params.q}”`
    : params.cat
      ? params.cat.charAt(0).toUpperCase() + params.cat.slice(1)
      : (params.view && VIEW_TITLES[params.view]) || "Inbox";

  const hrefWith = (patch: Partial<Params>) => {
    const next = new URLSearchParams();
    for (const [k, v] of Object.entries({ ...params, id: undefined, ...patch })) if (v) next.set(k, v);
    if (!next.toString()) next.set("view", "inbox");
    return `/dashboard?${next.toString()}`;
  };

  const tabs = [
    { key: undefined, label: "All", count: inbox.counts.all },
    { key: "high", label: "High", count: inbox.counts.high },
    { key: "medium", label: "Medium", count: inbox.counts.medium },
    { key: "low", label: "Low", count: inbox.counts.low },
  ];

  return (
    <div className='mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-8 sm:py-10'>
      <div className='flex animate-fade-up flex-col justify-between gap-5 sm:flex-row sm:items-end'>
        <div>
          <h2 className='text-3xl font-bold tracking-tight'>{title}</h2>
          <p className='mt-1.5 text-muted-foreground tabular-nums'>
            {emails.length ? `${emails.length} ${emails.length === 1 ? "message" : "messages"}, ranked by priority` : "No messages"}
          </p>
        </div>
        {!params.q && (
          <div className='flex gap-1 overflow-x-auto rounded-xl border bg-surface p-1'>
            {tabs.map((tab) => {
              const active = (params.p ?? undefined) === tab.key;
              return (
                <Link
                  key={tab.label}
                  href={hrefWith({ p: tab.key })}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-sm whitespace-nowrap transition-all duration-200",
                    active
                      ? "bg-background font-semibold text-foreground shadow-sm ring-1 ring-border"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {tab.key ? <PriorityDot priority={tab.key} /> : <InboxIcon className='size-3.5' />}
                  {tab.label}
                  <span className='text-xs text-muted-foreground tabular-nums'>{tab.count}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {(!inbox.gmailConnected || !inbox.calendarConnected) && (
        <div className='mt-6'>
          <Onboarding gmail={inbox.gmailConnected} calendar={inbox.calendarConnected} name={name} />
        </div>
      )}

      {emails.length > 0 ? (
        <ul className='stagger mt-6 divide-y overflow-hidden rounded-2xl border bg-card'>
          {emails.map((email) => (
            <li key={email.emailId} className='group/row relative'>
              <Link
                href={hrefWith({ id: email.emailId })}
                className={cn(
                  "relative flex items-center gap-3 px-5 py-3.5 text-sm transition-colors duration-150 hover:bg-surface",
                  email.replySentAt && "opacity-70",
                )}
              >
                <span className='absolute inset-y-2 left-0 w-[3px] scale-y-0 rounded-r-full bg-foreground transition-transform duration-200 group-hover/row:scale-y-100' />
                <PriorityDot priority={email.priority} />
                <StarIcon
                  className={cn(
                    "size-4 shrink-0 transition-transform duration-200 group-hover/row:scale-110",
                    email.priority === "high" ? "fill-medium text-medium" : "text-muted-foreground/30",
                  )}
                />
                <span
                  className={cn(
                    "w-44 shrink-0 truncate max-sm:w-28",
                    email.priority !== "low" ? "font-semibold" : "text-foreground/80",
                  )}
                >
                  {senderName(email.from)}
                </span>
                <span className='min-w-0 flex-1 truncate'>
                  <span className={cn(email.priority !== "low" && "font-semibold")}>
                    {email.subject || "(No subject)"}
                  </span>
                  <span className='text-muted-foreground'> · {email.summary || email.snippet}</span>
                </span>
                <span className='hidden shrink-0 items-center gap-1.5 lg:flex'>
                  {email.replySentAt && (
                    <Chip className='border-brand/30 text-brand'>
                      <ReplyIcon className='size-3' /> Replied
                    </Chip>
                  )}
                  {email.draftCreated && !email.replySentAt && (
                    <Chip>
                      <PenLineIcon className='size-3' /> Draft
                    </Chip>
                  )}
                  {(email.eventsCreated ?? 0) > 0 && (
                    <Chip>
                      <CalendarCheckIcon className='size-3' /> Event
                    </Chip>
                  )}
                  {email.category && <Chip className='capitalize'>{email.category}</Chip>}
                </span>
                <span
                  className={cn(
                    "w-16 shrink-0 text-right text-xs tabular-nums transition-opacity sm:group-hover/row:opacity-0",
                    email.priority !== "low" ? "font-semibold" : "text-muted-foreground",
                  )}
                >
                  {shortDate(email.date || email.processedAt)}
                </span>
              </Link>
              <div className='pointer-events-none absolute inset-y-0 right-3 z-20 hidden items-center gap-1 bg-gradient-to-l from-surface from-70% pl-6 opacity-0 transition-opacity duration-150 group-hover/row:pointer-events-auto group-hover/row:opacity-100 sm:flex'>
                <Link
                  href={`${hrefWith({ id: email.emailId })}&ai=summary`}
                  className='press inline-flex h-7 items-center gap-1 rounded-lg border bg-background px-2 text-xs font-medium text-muted-foreground hover:text-foreground'
                >
                  AI summary
                </Link>
                <Link
                  href={`${hrefWith({ id: email.emailId })}&ai=draft`}
                  className='press inline-flex h-7 items-center gap-1 rounded-lg border bg-background px-2 text-xs font-medium text-muted-foreground hover:text-foreground'
                >
                  <PenLineIcon className='size-3 text-brand' /> Draft with AI
                </Link>
                <Link
                  href={hrefWith({ id: email.emailId })}
                  title={email.replySentAt ? "Replied" : "Reply"}
                  className='press grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground'
                >
                  <ReplyIcon className='size-4' />
                </Link>
                <a
                  href={`https://mail.google.com/mail/u/0/#all/${email.emailId}`}
                  target='_blank'
                  rel='noreferrer'
                  title='Open in Gmail'
                  className='press grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground'
                >
                  <ExternalLinkIcon className='size-4' />
                </a>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        inbox.gmailConnected && (
          <div className='mt-6 flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed px-6 py-24 text-center'>
            <span className='grid size-14 animate-float place-items-center rounded-2xl bg-muted text-foreground'>
              <MailIcon className='size-6' />
            </span>
            <div className='space-y-1'>
              <p className='text-lg font-semibold'>
                {inbox.counts.all ? "Nothing matches this view" : "Your triaged inbox will appear here"}
              </p>
              <p className='max-w-sm text-muted-foreground'>
                Run the agents to classify unread mail, draft replies and schedule deadlines.
              </p>
            </div>
            <RunAgentButton />
          </div>
        )
      )}
    </div>
  );
}

/* ===================================================================== */

function Onboarding({ gmail, calendar, name }: { gmail: boolean; calendar: boolean; name?: string }) {
  const steps = [
    { done: gmail, label: "Connect Gmail", body: "Read unread mail and save drafts", icon: MailIcon, href: "/api/auth/google?provider=gmail" },
    { done: calendar, label: "Connect Google Calendar", body: "Add holds for deadlines", icon: CalendarIcon, href: "/api/auth/google?provider=google_calendar" },
  ];
  const done = steps.filter((s) => s.done).length;
  return (
    <div className='relative animate-fade-up overflow-hidden rounded-2xl border bg-card p-6'>
      <div className='pointer-events-none absolute -top-24 -right-24 size-64 rounded-full bg-brand/10 blur-3xl' />
      <div className='relative flex flex-wrap items-center justify-between gap-4'>
        <div>
          <p className='text-lg font-semibold'>
            Finish setting up{name ? `, ${name.split(" ")[0]}` : ""}
          </p>
          <p className='mt-0.5 text-sm text-muted-foreground'>
            Connect your Google accounts so the agents can triage mail and add events.
          </p>
        </div>
        <div className='flex items-center gap-3 text-sm text-muted-foreground'>
          <div className='h-2 w-32 overflow-hidden rounded-full bg-muted'>
            <div className='h-full rounded-full bg-brand transition-all duration-500' style={{ width: `${(done / steps.length) * 100}%` }} />
          </div>
          <span className='tabular-nums'>{done}/{steps.length}</span>
        </div>
      </div>
      <div className='relative mt-5 grid gap-3 sm:grid-cols-2'>
        {steps.map(({ done: ok, label, body, icon: Icon, href }) =>
          ok ? (
            <div key={label} className='flex items-center gap-3 rounded-xl border bg-surface px-4 py-3.5 text-sm'>
              <span className='grid size-9 place-items-center rounded-lg bg-brand text-brand-foreground'>
                <CheckIcon className='size-4' />
              </span>
              <div>
                <p className='font-medium'>{label}</p>
                <p className='text-xs text-muted-foreground'>Connected</p>
              </div>
            </div>
          ) : (
            <a
              key={label}
              href={href}
              className='group lift press flex items-center gap-3 rounded-xl border bg-background px-4 py-3.5 text-sm hover:border-foreground/20 hover:shadow-soft'
            >
              <span className='grid size-9 place-items-center rounded-lg bg-muted text-foreground'>
                <Icon className='size-4' />
              </span>
              <div>
                <p className='font-medium'>{label}</p>
                <p className='text-xs text-muted-foreground'>{body}</p>
              </div>
              <ArrowRightIcon className='ml-auto size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground' />
            </a>
          ),
        )}
      </div>
    </div>
  );
}
