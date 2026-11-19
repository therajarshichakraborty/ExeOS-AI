import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className='inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur'>
      <span className='size-1.5 rounded-full bg-brand' />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto max-w-2xl space-y-4 text-center", className)}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className='text-3xl font-semibold tracking-tight text-balance sm:text-4xl'>
        {title}
      </h2>
      {description && (
        <p className='text-base leading-relaxed text-balance text-muted-foreground'>
          {description}
        </p>
      )}
    </div>
  );
}

/** Serif italic accent used inside headings. */
export function Accent({ children }: { children: React.ReactNode }) {
  return (
    <span className='font-serif font-normal tracking-normal text-brand italic'>
      {children}
    </span>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description: React.ReactNode;
}) {
  return (
    <section className='relative overflow-hidden'>
      <div className='bg-grid pointer-events-none absolute inset-0' />
      <div className='spotlight pointer-events-none absolute inset-0' />
      <div className='relative mx-auto max-w-3xl px-5 pt-20 pb-14 text-center'>
        <div className='animate-fade-up space-y-5'>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className='text-4xl font-semibold tracking-tight text-balance sm:text-5xl'>
            {title}
          </h1>
          <p className='mx-auto max-w-xl text-lg leading-relaxed text-balance text-muted-foreground'>
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}

export function CtaBand() {
  return (
    <section className='px-5 pb-24'>
      <div className='panel-grid relative mx-auto max-w-6xl overflow-hidden rounded-3xl px-6 py-24 text-center text-white shadow-2xl shadow-slate-900/20'>
        <div className='pointer-events-none absolute -top-40 left-1/2 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-blue-400/25 blur-3xl' />
        <div className='relative space-y-6'>
          <h2 className='text-4xl font-bold tracking-tight text-balance sm:text-5xl'>
            Let&apos;s clear your inbox today.
          </h2>
          <p className='mx-auto max-w-lg text-lg text-white/70'>
            Connect Gmail and Calendar in under a minute. Your first triage runs
            the moment you click.
          </p>
          <div className='flex flex-wrap justify-center gap-3 pt-2'>
            <Link
              href='/sign-up'
              className='press inline-flex h-12 items-center gap-2 rounded-xl bg-white px-6 font-semibold text-slate-900 transition-all hover:bg-white/90'
            >
              Start free <ArrowRightIcon className='size-4' />
            </Link>
            <Link
              href='/pricing'
              className='press inline-flex h-12 items-center rounded-xl border border-white/40 px-6 font-semibold transition-colors hover:bg-white/10'
            >
              See pricing
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
