import type { Metadata } from "next";
import Link from "next/link";
import {
  CalendarIcon,
  CalendarCheckIcon,
  CheckIcon,
  InboxIcon,
  MailIcon,
  PenLineIcon,
  RotateCwIcon,
  StarIcon,
} from "lucide-react";
import { EmailReader } from "@/components/app/email-reader";
import { Chip, PriorityDot } from "@/components/app/priority";
import { RunAgentButton } from "@/components/run-agent-button";
import { getInbox, getSessionUser, senderName, shortDate, type InboxEmail } from "@/lib/inbox";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Inbox" };

type Params = { view?: string; cat?: string; q?: string; id?: string; p?: string };

const VIEW_FILTERS: Record<string, (e: InboxEmail) => boolean> = {
  high: (e) => e.priority === "high",
  reply: (e) => !!e.needsReply,
  drafts: (e) => !!e.draftCreated,
  scheduled: (e) => (e.eventsCreated ?? 0) > 0,
};

const VIEW_TITLES: Record<string, string> = {
  high: "High priority",
  reply: "Needs reply",
  drafts: "Drafted",
  scheduled: "Scheduled",
};

export default async function InboxPage({ searchParams }: { searchParams: Promise<Params> }) {
  const params = await searchParams;
  const { user, name } = await getSessionUser();
  const inbox = await getInbox(user.id);

  if (params.id) {
    const email = inbox.emails.find((e) => e.emailId === params.id);
    if (email) {
      const back = new URLSearchParams(
        Object.entries(params).filter(([k, v]) => k !== "id" && v) as [string, string][],
      ).toString();
      return <EmailReader email={email} backHref={`/dashboard${back ? `?${back}` : ""}`} />;
    }
  }

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
    const s = next.toString();
    return `/dashboard${s ? `?${s}` : ""}`;
  };

  const tabs = [
    { key: undefined, label: "All", icon: InboxIcon, count: inbox.counts.all },
    { key: "high", label: "High", count: inbox.counts.high },
    { key: "medium", label: "Medium", count: inbox.counts.medium },
    { key: "low", label: "Low", count: inbox.counts.low },
  ];

  return (
    <div className='flex h-full flex-col'>
      {/* Toolbar */}
      <div className='flex items-center gap-2 px-4 py-2.5'>
        <Link
          href={hrefWith({})}
          className='grid size-9 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground'
          aria-label='Refresh'
        >
          <RotateCwIcon className='size-4' />
        </Link>
        <h1 className='text-sm font-semibold'>{title}</h1>
        <span className='ml-auto text-xs text-muted-foreground tabular-nums'>
          {emails.length ? `1–${emails.length} of ${emails.length}` : "0 messages"}
        </span>
      </div>

      {/* Priority tabs (Gmail category tabs) */}
      {!params.q && (
        <div className='flex overflow-x-auto border-b'>
          {tabs.map((tab) => {
            const active = (params.p ?? undefined) === tab.key;
            return (
              <Link
                key={tab.label}
                href={hrefWith({ p: tab.key })}
                className={cn(
                  "relative flex min-w-36 items-center gap-3 px-5 py-3.5 text-sm transition-colors hover:bg-muted/60",
                  active ? "font-semibold text-brand" : "text-muted-foreground",
                )}
              >
                {tab.icon ? <tab.icon className='size-4' /> : <PriorityDot priority={tab.key} />}
                {tab.label}
                {tab.count > 0 && (
                  <span
                    className={cn(
                      "rounded-full px-1.5 text-[11px] tabular-nums",
                      active ? "bg-brand text-brand-foreground" : "bg-muted",
                    )}
                  >
                    {tab.count}
                  </span>
                )}
                {active && <span className='absolute inset-x-3 bottom-0 h-[3px] rounded-t-full bg-brand' />}
              </Link>
            );
          })}
        </div>
      )}

      {!inbox.gmailConnected || !inbox.calendarConnected ? (
        <Onboarding gmail={inbox.gmailConnected} calendar={inbox.calendarConnected} name={name} />
      ) : null}

      {emails.length > 0 ? (
        <ul className='divide-y'>
          {emails.map((email) => (
            <li key={email.emailId}>
              <Link
                href={hrefWith({ id: email.emailId })}
                className={cn(
                  "group flex items-center gap-3 px-4 py-2.5 text-sm transition-shadow hover:z-10 hover:shadow-[inset_1px_0_0_var(--border),inset_-1px_0_0_var(--border),0_1px_3px_0_rgb(0_0_0/0.08)]",
                  email.priority === "high" && "bg-high-soft/25",
                )}
              >
                <PriorityDot priority={email.priority} className='ml-1' />
                <StarIcon
                  className={cn(
                    "size-4 shrink-0",
                    email.priority === "high" ? "fill-medium text-medium" : "text-muted-foreground/40",
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
                  <span className='text-muted-foreground'> — {email.summary || email.snippet}</span>
                </span>
                <span className='hidden shrink-0 items-center gap-1.5 lg:flex'>
                  {email.draftCreated && (
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
                    "w-16 shrink-0 text-right text-xs tabular-nums",
                    email.priority !== "low" ? "font-semibold" : "text-muted-foreground",
                  )}
                >
                  {shortDate(email.date || email.processedAt)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        inbox.gmailConnected && (
          <div className='flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center'>
            <span className='grid size-14 place-items-center rounded-2xl bg-brand-soft text-brand'>
              <MailIcon className='size-6' />
            </span>
            <div className='space-y-1'>
              <p className='font-semibold'>
                {inbox.counts.all ? "Nothing matches this view" : "Your triaged inbox will appear here"}
              </p>
              <p className='max-w-sm text-sm text-muted-foreground'>
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

function Onboarding({ gmail, calendar, name }: { gmail: boolean; calendar: boolean; name: string }) {
  const steps = [
    { done: gmail, label: "Connect Gmail", icon: MailIcon, href: "/api/auth/google?provider=gmail" },
    { done: calendar, label: "Connect Google Calendar", icon: CalendarIcon, href: "/api/auth/google?provider=google_calendar" },
  ];
  return (
    <div className='m-4 rounded-2xl border bg-surface/60 p-6'>
      <p className='font-semibold'>Welcome{name ? `, ${name.split(" ")[0]}` : ""}</p>
      <p className='mt-1 text-sm text-muted-foreground'>
        Connect your Google accounts so the agents can triage mail and add events.
      </p>
      <div className='mt-5 grid gap-3 sm:grid-cols-2'>
        {steps.map(({ done, label, icon: Icon, href }) =>
          done ? (
            <div key={label} className='flex items-center gap-3 rounded-xl border bg-card px-4 py-3 text-sm text-muted-foreground'>
              <CheckIcon className='size-4 text-brand' /> {label}
            </div>
          ) : (
            <a
              key={label}
              href={href}
              className='flex items-center gap-3 rounded-xl border bg-card px-4 py-3 text-sm font-medium transition-shadow hover:shadow-md'
            >
              <Icon className='size-4 text-brand' /> {label}
              <span className='ml-auto text-xs text-brand'>Connect →</span>
            </a>
          ),
        )}
      </div>
    </div>
  );
}
