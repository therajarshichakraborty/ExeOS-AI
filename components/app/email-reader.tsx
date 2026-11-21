import Link from "next/link";
import {
  ArrowLeftIcon,
  CalendarPlusIcon,
  ExternalLinkIcon,
  ListChecksIcon,
  TriangleAlertIcon,
} from "lucide-react";
import type { InboxEmail } from "@/lib/inbox";
import { senderName } from "@/lib/inbox";
import { EmailAssistant } from "./email-assistant";
import { Chip, PriorityBadge } from "./priority";

function formatEventTime(e: { date: string; startTime: string | null }) {
  const d = new Date(e.startTime ?? `${e.date}T00:00:00`);
  if (Number.isNaN(d.getTime())) return e.date;
  return d.toLocaleString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
    ...(e.startTime && { hour: "numeric", minute: "2-digit" }),
  });
}


export function EmailReader({
  email,
  backHref,
  autoAction,
}: {
  email: InboxEmail;
  backHref: string;
  autoAction?: "summary" | "draft";
}) {
  const name = senderName(email.from);
  const address = email.from.match(/<(.+)>/)?.[1] ?? "";
  const body = email.body || email.snippet || "";

  return (
    <article className='flex h-full flex-col'>
      <div className='flex items-center gap-2 border-b px-4 py-2.5'>
        <Link
          href={backHref}
          className='press inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground'
          aria-label='Back'
        >
          <ArrowLeftIcon className='size-4' /> Back
        </Link>
        <a
          href={`https://mail.google.com/mail/u/0/#all/${email.emailId}`}
          target='_blank'
          rel='noreferrer'
          className='ml-auto inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground'
        >
          Open in Gmail <ExternalLinkIcon className='size-3.5' />
        </a>
      </div>

      <div className='stagger mx-auto w-full max-w-3xl space-y-6 px-5 py-8 sm:px-6'>
        <header className='space-y-4'>
          <div className='flex flex-wrap items-center gap-2'>
            <h1 className='text-2xl font-bold tracking-tight sm:text-3xl'>{email.subject || "(No subject)"}</h1>
            <PriorityBadge priority={email.priority} />
            {email.category && <Chip className='capitalize'>{email.category}</Chip>}
          </div>
          <div className='flex items-center gap-3'>
            <span className='grid size-10 place-items-center rounded-full bg-foreground text-sm font-semibold text-background'>
              {name.charAt(0).toUpperCase()}
            </span>
            <div className='min-w-0 flex-1'>
              <p className='truncate text-sm font-semibold'>
                {name} {address && <span className='font-normal text-muted-foreground'>&lt;{address}&gt;</span>}
              </p>
              <p className='text-xs text-muted-foreground'>
                {email.date ? new Date(email.date).toLocaleString() : ""}
              </p>
            </div>
          </div>
        </header>

        {email.status === "error" && (
          <div className='flex gap-3 rounded-xl border border-high/30 bg-high-soft p-4 text-sm text-high'>
            <TriangleAlertIcon className='size-4 shrink-0' />
            {email.error || "This email could not be processed."}
          </div>
        )}

        <EmailAssistant
          emailId={email.emailId}
          to={name}
          initialSummary={email.summary ?? null}
          draftReply={email.draftReply ?? null}
          hasDraft={Boolean(email.draftId || email.draftCreated)}
          sentAt={email.replySentAt ?? null}
          autoAction={autoAction}
        />

        {(!!email.actionItems?.length || !!email.calendarEvents?.length) && (
          <div className='grid gap-4 sm:grid-cols-2'>
            {!!email.actionItems?.length && (
              <section className='rounded-2xl border p-5'>
                <p className='mb-3 flex items-center gap-2 text-sm font-semibold'>
                  <ListChecksIcon className='size-4 text-medium' /> Action items
                </p>
                <ul className='space-y-2 text-sm'>
                  {email.actionItems.map((item, i) => (
                    <li key={i} className='flex gap-2'>
                      <span className='mt-2 size-1.5 shrink-0 rounded-full bg-medium' />
                      <span>
                        {item.title}
                        {item.dueDate && <span className='text-muted-foreground'> · due {item.dueDate}</span>}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {!!email.calendarEvents?.length && (
              <section className='rounded-2xl border p-5'>
                <p className='mb-3 flex items-center gap-2 text-sm font-semibold'>
                  <CalendarPlusIcon className='size-4 text-foreground' /> Calendar
                </p>
                <ul className='space-y-2 text-sm'>
                  {email.calendarEvents.map((ev, i) => (
                    <li key={i}>
                      <p className='font-medium'>{ev.title}</p>
                      <p className='text-xs text-muted-foreground'>{formatEventTime(ev)}</p>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        )}

        <section className='border-t pt-6'>
          <p className='mb-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase'>Original message</p>
          <p className='text-[15px] leading-7 whitespace-pre-wrap text-foreground/90'>
            {body || <span className='text-muted-foreground'>No content preview available.</span>}
          </p>
        </section>
      </div>
    </article>
  );
}
