import type { Metadata } from "next";
import Link from "next/link";
import { PricingTable, Show } from "@clerk/nextjs";
import { ArrowRightIcon, CheckIcon, MinusIcon } from "lucide-react";
import { Faq } from "@/components/marketing/faq";
import { PageHero, SectionHeading } from "@/components/marketing/section";
import { Reveal } from "@/components/motion/reveal";
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

const COMPARE: { label: string; values: (boolean | string)[] }[] = [
  { label: "Priority triage", values: [true, true, true] },
  { label: "Triage runs", values: ["Manual", "Scheduled", "Scheduled"] },
  { label: "Gmail draft replies", values: [false, true, true] },
  { label: "Calendar holds", values: [false, true, true] },
  { label: "Browser push alerts", values: [false, true, true] },
  { label: "Run history", values: ["Recent", "Full", "Full"] },
  { label: "Shared rules", values: [false, false, true] },
];

const FAQ = [
  { q: "Does ExeOS ever send email on my behalf?", a: "No. Suggested replies are saved as Gmail drafts in the original thread. You always review and send them yourself." },
  { q: "What does an AI run actually cost?", a: "Each run makes at most three small, batched model calls with clipped email text, which usually costs well under a cent." },
  { q: "Can I disconnect Google at any time?", a: "Yes. Revoke access from your Google account and ExeOS removes the stored tokens on the next refresh attempt." },
  { q: "Is my email used to train models?", a: "No. Emails are sent to the model only for the run that processes them and are not used for training." },
];

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow='Pricing'
        title='Simple pricing for a'
        accent='quieter inbox.'
        description='Start free. Upgrade when you want ExeOS running in the background for you.'
      />

      <section className='mx-auto -mt-4 grid max-w-6xl items-start gap-5 px-5 lg:grid-cols-3'>
        {PLANS.map((plan, i) => (
          <Reveal key={plan.name} delay={i * 100} className={cn(plan.featured && "lg:-mt-4")}>
            <div
              className={cn(
                "lift relative flex flex-col rounded-[2rem] border bg-card p-8 hover:shadow-float",
                plan.featured && "ring-gradient border-transparent shadow-float",
              )}
            >
              {plan.featured && (
                <>
                  <div className='pointer-events-none absolute inset-0 -z-10 rounded-[2rem] bg-gradient-to-b from-muted/80 to-card' />
                  <span className='btn-ink absolute -top-3.5 left-8 rounded-full px-3 py-1 text-xs font-semibold'>
                    Most popular
                  </span>
                </>
              )}
              <p className='text-lg font-semibold'>{plan.name}</p>
              <p className='mt-1 text-muted-foreground'>{plan.blurb}</p>
              <p className='mt-8 flex items-baseline gap-2'>
                <span className='text-6xl font-bold tracking-tight'>{plan.price}</span>
                <span className='text-muted-foreground'>{plan.cadence}</span>
              </p>
              <Link
                href={plan.href}
                className={cn(
                  "press group mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-2xl font-semibold",
                  plan.featured ? "btn-ink sheen" : "border bg-background hover:bg-muted",
                )}
              >
                {plan.cta}
                <ArrowRightIcon className='size-4 transition-transform duration-300 group-hover:translate-x-1' />
              </Link>
              <div className='my-8 h-px bg-border' />
              <ul className='space-y-3.5'>
                {plan.features.map((feature) => (
                  <li key={feature} className='flex items-start gap-3'>
                    <span className={cn("mt-0.5 grid size-5 shrink-0 place-items-center rounded-full", plan.featured ? "bg-brand text-brand-foreground" : "bg-brand/10 text-brand")}>
                      <CheckIcon className='size-3' strokeWidth={3} />
                    </span>
                    <span className='text-foreground/85'>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </section>

      {/* Comparison */}
      <section className='mx-auto max-w-5xl space-y-12 px-5 pt-32'>
        <Reveal>
          <SectionHeading title={<>Compare <span className='text-gradient'>plans</span></>} />
        </Reveal>
        <Reveal delay={100} className='overflow-x-auto rounded-3xl border bg-card'>
          <table className='w-full min-w-[560px] text-left'>
            <thead>
              <tr className='border-b'>
                <th className='p-5 text-sm font-medium text-muted-foreground'>Feature</th>
                {PLANS.map((p) => (
                  <th key={p.name} className={cn("p-5 text-center font-semibold", p.featured && "text-foreground")}>
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARE.map((row) => (
                <tr key={row.label} className='border-b transition-colors last:border-0 hover:bg-muted/40'>
                  <td className='p-5'>{row.label}</td>
                  {row.values.map((v, i) => (
                    <td key={i} className={cn("p-5 text-center", i === 1 && "bg-muted/50")}>
                      {v === true ? (
                        <CheckIcon className='mx-auto size-5 text-brand' strokeWidth={2.5} />
                      ) : v === false ? (
                        <MinusIcon className='mx-auto size-5 text-muted-foreground/40' />
                      ) : (
                        <span className='text-sm text-muted-foreground'>{v}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </section>

      <section id='checkout' className='mx-auto max-w-4xl scroll-mt-28 px-5 pt-32'>
        <Show when='signed-in'>
          <SectionHeading
            title='Manage your plan'
            description='Billing is handled securely by Clerk.'
            className='mb-10'
          />
          <PricingTable />
        </Show>
        <Show when='signed-out'>
          <div className='rounded-3xl border bg-surface p-8 text-center'>
            <p className='text-lg'>
              <Link href='/sign-up' className='font-semibold text-foreground underline underline-offset-4 hover:underline'>
                Create an account
              </Link>{" "}
              to upgrade. It takes about 20 seconds.
            </p>
          </div>
        </Show>
      </section>

      <section className='mx-auto max-w-6xl space-y-12 px-5 py-32'>
        <Reveal>
          <SectionHeading title={<>Questions, <span className='text-gradient'>answered.</span></>} />
        </Reveal>
        <Reveal delay={100}>
          <Faq items={FAQ} />
        </Reveal>
      </section>
    </>
  );
}
