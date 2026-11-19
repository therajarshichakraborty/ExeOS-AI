import type { Metadata } from "next";
import Link from "next/link";
import { PricingTable, Show } from "@clerk/nextjs";
import { CheckIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Faq } from "@/components/marketing/faq";
import {
  Accent,
  PageHero,
  SectionHeading,
} from "@/components/marketing/section";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Pricing" };

const PLANS = [
  {
    name: "Free",
    price: "$0",
    cadence: "forever",
    blurb: "Try ExeOS on your own inbox.",
    cta: "Start free",
    href: "/sign-up",
    features: [
      "Manual triage runs",
      "Priority inbox & categories",
      "Gmail + Google Calendar connect",
      "In-app notifications",
    ],
  },
  {
    name: "Pro",
    price: "$12",
    cadence: "per month",
    blurb: "Hands-off email for busy operators.",
    cta: "Upgrade to Pro",
    href: "#checkout",
    featured: true,
    features: [
      "Everything in Free",
      "Scheduled background runs",
      "Suggested replies as Gmail drafts",
      "Automatic calendar holds",
      "Browser push for urgent mail",
      "Full run history",
    ],
  },
  {
    name: "Team",
    price: "Custom",
    cadence: "",
    blurb: "Shared triage rules for small teams.",
    cta: "Talk to us",
    href: "/about#contact",
    features: [
      "Everything in Pro",
      "Shared priority rules",
      "Usage reporting",
      "Priority support",
    ],
  },
];

const FAQ = [
  {
    q: "Does ExeOS ever send email on my behalf?",
    a: "No. Suggested replies are saved as Gmail drafts in the original thread. You always review and send them yourself.",
  },
  {
    q: "What does an AI run actually cost?",
    a: "Each run makes at most three small, batched model calls with clipped email text, which usually costs well under a cent.",
  },
  {
    q: "Can I disconnect Google at any time?",
    a: "Yes. Revoke access from your Google account and ExeOS removes the stored tokens on the next refresh attempt.",
  },
  {
    q: "Is my email used to train models?",
    a: "No. Emails are sent to the model only for the run that processes them and are not used for training.",
  },
];

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow='Pricing'
        title={
          <>
            Simple pricing for a <Accent>quieter</Accent> inbox.
          </>
        }
        description='Start free. Upgrade when you want ExeOS running in the background for you.'
      />

      <section className='mx-auto grid max-w-6xl gap-5 px-5 lg:grid-cols-3'>
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              "relative flex flex-col rounded-3xl border bg-card p-7",
              plan.featured && "shimmer-border shadow-xl lg:-translate-y-3",
            )}
          >
            {plan.featured && (
              <span className='absolute -top-3 left-7 rounded-full bg-brand px-3 py-1 text-[11px] font-semibold text-brand-foreground'>
                Most popular
              </span>
            )}
            <p className='font-medium'>{plan.name}</p>
            <p className='mt-1 text-sm text-muted-foreground'>{plan.blurb}</p>
            <p className='mt-6 flex items-baseline gap-1.5'>
              <span className='text-4xl font-semibold tracking-tight'>
                {plan.price}
              </span>
              <span className='text-sm text-muted-foreground'>{plan.cadence}</span>
            </p>
            <Link
              href={plan.href}
              className={cn(
                buttonVariants({
                  variant: plan.featured ? "default" : "outline",
                  size: "lg",
                }),
                "mt-6 h-10 rounded-full",
              )}
            >
              {plan.cta}
            </Link>
            <ul className='mt-7 space-y-3 text-sm'>
              {plan.features.map((feature) => (
                <li key={feature} className='flex items-start gap-2.5'>
                  <CheckIcon className='mt-0.5 size-4 shrink-0 text-brand' />
                  <span className='text-foreground/85'>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section id='checkout' className='mx-auto max-w-4xl scroll-mt-24 px-5 pt-24'>
        <Show when='signed-in'>
          <SectionHeading
            title='Manage your plan'
            description='Billing is handled securely by Clerk.'
            className='mb-10'
          />
          <PricingTable />
        </Show>
        <Show when='signed-out'>
          <p className='text-center text-sm text-muted-foreground'>
            <Link href='/sign-up' className='font-medium text-foreground underline underline-offset-4'>
              Create an account
            </Link>{" "}
            to upgrade. It takes about 20 seconds.
          </p>
        </Show>
      </section>

      <section className='mx-auto max-w-6xl space-y-10 px-5 py-24'>
        <SectionHeading title='Questions, answered' />
        <Faq items={FAQ} />
      </section>
    </>
  );
}
