import type { Metadata } from "next";
import {
  DatabaseIcon,
  EyeOffIcon,
  KeyRoundIcon,
  LockIcon,
  ScrollTextIcon,
  UnplugIcon,
} from "lucide-react";
import { Accent, PageHero } from "@/components/marketing/section";

export const metadata: Metadata = { title: "Security" };

const ITEMS = [
  {
    icon: KeyRoundIcon,
    title: "Encrypted OAuth tokens",
    body: "Google access and refresh tokens are AES-encrypted before they touch the database.",
  },
  {
    icon: LockIcon,
    title: "Least-privilege scopes",
    body: "Gmail read/modify/compose and Calendar events only. ExeOS cannot send mail or delete your account data.",
  },
  {
    icon: EyeOffIcon,
    title: "Minimal model exposure",
    body: "Agents receive clipped excerpts, not full mailboxes, and outputs are short structured JSON.",
  },
  {
    icon: DatabaseIcon,
    title: "Scoped storage",
    body: "We keep run summaries, priorities and drafts metadata — enough to show your history, nothing more.",
  },
  {
    icon: ScrollTextIcon,
    title: "Auditable runs",
    body: "Every run records what was processed, drafted and scheduled, visible to you in Activity.",
  },
  {
    icon: UnplugIcon,
    title: "Disconnect any time",
    body: "Revoke access in your Google account; revoked tokens are deleted automatically.",
  },
];

export default function SecurityPage() {
  return (
    <>
      <PageHero
        eyebrow='Security'
        title={
          <>
            Your inbox is <Accent>personal</Accent>. We treat it that way.
          </>
        }
        description='ExeOS is built around a simple rule: touch as little of your data as possible, and make everything we do visible.'
      />
      <section className='mx-auto grid max-w-6xl gap-4 px-5 pb-24 sm:grid-cols-2 lg:grid-cols-3'>
        {ITEMS.map(({ icon: Icon, title, body }) => (
          <div key={title} className='rounded-2xl border bg-card p-6'>
            <span className='grid size-9 place-items-center rounded-lg bg-brand-soft text-brand'>
              <Icon className='size-4' />
            </span>
            <h3 className='mt-4 font-semibold tracking-tight'>{title}</h3>
            <p className='mt-1.5 text-sm leading-relaxed text-muted-foreground'>
              {body}
            </p>
          </div>
        ))}
      </section>
    </>
  );
}
