import type { Metadata } from "next";
import Link from "next/link";
import {
  BellRingIcon,
  CalendarIcon,
  CheckCircle2Icon,
  CpuIcon,
  MailIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
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
    <div className='mx-auto max-w-3xl space-y-8 p-6 sm:p-8'>
      <div>
        <h1 className='text-2xl font-semibold tracking-tight'>Settings</h1>
        <p className='mt-1 text-sm text-muted-foreground'>Signed in as {email}</p>
      </div>

      {error && (
        <div className='flex gap-3 rounded-xl border border-high/30 bg-high-soft p-4 text-sm text-high'>
          <TriangleAlertIcon className='size-4 shrink-0' />
          {ERRORS[error] ?? "Couldn't connect your Google account."}
        </div>
      )}
      {connected && (
        <div className='flex gap-3 rounded-xl border border-brand/30 bg-brand-soft p-4 text-sm text-brand'>
          <CheckCircle2Icon className='size-4 shrink-0' />
          {connected === "gmail" ? "Gmail" : "Google Calendar"} connected.
        </div>
      )}

      <section className='space-y-3'>
        <h2 className='text-sm font-semibold'>Integrations</h2>
        <div className='divide-y overflow-hidden rounded-2xl border'>
          {providers.map((p) => (
            <div key={p.key} className='flex items-center gap-4 p-5'>
              <span className='grid size-10 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand'>
                <p.icon className='size-5' />
              </span>
              <div className='min-w-0 flex-1'>
                <p className='text-sm font-medium'>{p.name}</p>
                <p className='text-xs leading-relaxed text-muted-foreground'>{p.description}</p>
              </div>
              {p.connected ? (
                <span className='inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-xs font-medium text-brand'>
                  <CheckCircle2Icon className='size-3.5' /> Connected
                </span>
              ) : (
                <a
                  href={`/api/auth/google?provider=${p.key}`}
                  className={cn(buttonVariants({ size: "lg" }), "rounded-full px-4")}
                >
                  Connect
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className='space-y-3'>
        <h2 className='text-sm font-semibold'>Agents</h2>
        <div className='divide-y overflow-hidden rounded-2xl border'>
          <div className='flex items-center gap-4 p-5'>
            <span className='grid size-10 shrink-0 place-items-center rounded-xl bg-muted'>
              <CpuIcon className='size-5' />
            </span>
            <div className='min-w-0 flex-1'>
              <p className='text-sm font-medium'>AI mode</p>
              <p className='text-xs text-muted-foreground'>
                {aiReady
                  ? "Classifier, reply suggester and notifier run on the OpenAI Agents SDK."
                  : "No OpenAI key configured — runs use the built-in heuristic triage."}
              </p>
            </div>
            <span
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium",
                aiReady ? "bg-brand-soft text-brand" : "bg-medium-soft text-medium",
              )}
            >
              {aiReady ? "Active" : "Heuristic"}
            </span>
          </div>
          <div className='flex items-center gap-4 p-5'>
            <span className='grid size-10 shrink-0 place-items-center rounded-xl bg-muted'>
              <BellRingIcon className='size-5' />
            </span>
            <div className='min-w-0 flex-1'>
              <p className='text-sm font-medium'>Push notifications</p>
              <p className='text-xs text-muted-foreground'>
                Enable browser push from the bell in the top bar. Only urgent mail notifies you.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className='flex items-center justify-between rounded-2xl border p-5'>
        <div>
          <p className='text-sm font-medium'>Plan</p>
          <p className='text-xs text-muted-foreground'>{isPro ? "Pro — thank you!" : "Free"}</p>
        </div>
        <Link href='/pricing' className={cn(buttonVariants({ variant: "outline", size: "lg" }), "rounded-full px-4")}>
          {isPro ? "Manage plan" : "Upgrade"}
        </Link>
      </section>
    </div>
  );
}
