import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRightIcon,
  BellRingIcon,
  CalendarIcon,
  CheckCircle2Icon,
  CpuIcon,
  MailIcon,
  TriangleAlertIcon,
  ZapIcon,
} from "lucide-react";
import { getInbox, getSessionUser } from "@/lib/inbox";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Settings" };

const ERRORS: Record<string, string> = {
  consent_denied: "Google access was declined.",
  missing_params: "Google didn't return an authorization code. Please try again.",
  invalid_state: "The sign-in link expired. Please try connecting again.",
  no_tokens: "Google didn't issue a refresh token. Remove ExeOS from your Google account permissions and reconnect.",
  user_not_found: "We couldn't find your account. Refresh and try again.",
  callback_failed: "Something went wrong while connecting Google.",
};

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className='grid animate-fade-up gap-4 border-t py-8 first:border-t-0 lg:grid-cols-[280px_1fr] lg:gap-10'>
      <div>
        <h3 className='font-semibold'>{title}</h3>
        <p className='mt-1 text-sm leading-relaxed text-muted-foreground'>{description}</p>
      </div>
      <div className='stagger divide-y overflow-hidden rounded-2xl border bg-card'>{children}</div>
    </section>
  );
}

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; connected?: string }>;
}) {
  const { error, connected } = await searchParams;
  const { user, email, isPro } = await getSessionUser();
  const inbox = await getInbox(user.id);
  const aiReady = Boolean(process.env.OPENAI_API_KEY?.trim());

  const providers = [
    {
      key: "gmail",
      name: "Gmail",
      description: "Read unread mail, mark it as triaged and save suggested replies as drafts.",
      icon: MailIcon,
      connected: inbox.gmailConnected,
    },
    {
      key: "google_calendar",
      name: "Google Calendar",
      description: "Check your schedule and add holds for deadlines and meetings.",
      icon: CalendarIcon,
      connected: inbox.calendarConnected,
    },
  ];

  return (
    <div className='mx-auto w-full max-w-5xl px-4 py-8 sm:px-8 sm:py-10'>
      <div className='animate-fade-up'>
        <h2 className='text-3xl font-bold tracking-tight'>Settings</h2>
        <p className='mt-1.5 text-[17px] text-muted-foreground'>Signed in as {email}</p>
      </div>

      {error && (
        <div className='mt-6 flex animate-fade-up gap-3 rounded-xl border border-high/30 bg-high-soft p-4 text-sm text-high'>
          <TriangleAlertIcon className='size-4 shrink-0' />
          {ERRORS[error] ?? "Couldn't connect your Google account."}
        </div>
      )}
      {connected && (
        <div className='mt-6 flex animate-fade-up gap-3 rounded-xl border border-brand/30 bg-brand/10 p-4 text-sm text-brand'>
          <CheckCircle2Icon className='size-4 shrink-0' />
          {connected === "gmail" ? "Gmail" : "Google Calendar"} connected.
        </div>
      )}

      <div className='mt-4'>
        <Section title='Integrations' description='Google accounts the agents can read from and write drafts and events to.'>
          {providers.map((p) => (
            <div key={p.key} className='flex items-center gap-4 p-5 transition-colors hover:bg-surface'>
              <span className='grid size-11 shrink-0 place-items-center rounded-xl border bg-surface'>
                <p.icon className='size-5' />
              </span>
              <div className='min-w-0 flex-1'>
                <p className='font-medium'>{p.name}</p>
                <p className='text-sm leading-relaxed text-muted-foreground'>{p.description}</p>
              </div>
              {p.connected ? (
                <span className='inline-flex shrink-0 items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand'>
                  <span className='size-1.5 rounded-full bg-brand' /> Connected
                </span>
              ) : (
                <a
                  href={`/api/auth/google?provider=${p.key}`}
                  className='btn-ink press inline-flex h-9 shrink-0 items-center rounded-lg px-4 text-sm font-semibold'
                >
                  Connect
                </a>
              )}
            </div>
          ))}
        </Section>

        <Section title='Agents' description='How triage runs and how you get notified about what matters.'>
          <div className='flex items-center gap-4 p-5'>
            <span className='grid size-11 shrink-0 place-items-center rounded-xl border bg-surface'>
              <CpuIcon className='size-5' />
            </span>
            <div className='min-w-0 flex-1'>
              <p className='font-medium'>AI mode</p>
              <p className='text-sm text-muted-foreground'>
                {aiReady
                  ? "Classifier, reply suggester and notifier run on the OpenAI Agents SDK."
                  : "No OpenAI key configured, so runs use the built-in heuristic triage."}
              </p>
            </div>
            <span
              className={cn(
                "shrink-0 rounded-full px-3 py-1 text-xs font-medium",
                aiReady ? "bg-brand/10 text-brand" : "bg-medium-soft text-medium",
              )}
            >
              {aiReady ? "Active" : "Heuristic"}
            </span>
          </div>
          <div className='flex items-center gap-4 p-5'>
            <span className='grid size-11 shrink-0 place-items-center rounded-xl border bg-surface'>
              <BellRingIcon className='size-5' />
            </span>
            <div className='min-w-0 flex-1'>
              <p className='font-medium'>Push notifications</p>
              <p className='text-sm text-muted-foreground'>
                Enable browser push from the bell in the top bar. Only urgent mail notifies you.
              </p>
            </div>
          </div>
        </Section>

        <Section title='Plan' description='Your current subscription and billing.'>
          <div className='relative flex items-center gap-4 overflow-hidden p-5'>
            <div className='pointer-events-none absolute -top-16 -right-16 size-40 rounded-full bg-brand/10 blur-2xl' />
            <span className='relative grid size-11 shrink-0 place-items-center rounded-xl bg-foreground text-background'>
              <ZapIcon className='size-5' />
            </span>
            <div className='relative min-w-0 flex-1'>
              <p className='font-medium'>{isPro ? "Pro" : "Free"}</p>
              <p className='text-sm text-muted-foreground'>
                {isPro ? "Background runs, drafts and push alerts are on. Thank you!" : "Upgrade for background runs, Gmail drafts and push alerts."}
              </p>
            </div>
            <Link
              href='/pricing'
              className='press group relative inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border bg-background px-4 text-sm font-semibold hover:bg-muted'
            >
              {isPro ? "Manage" : "Upgrade"}
              <ArrowRightIcon className='size-3.5 transition-transform group-hover:translate-x-0.5' />
            </Link>
          </div>
        </Section>
      </div>
    </div>
  );
}
