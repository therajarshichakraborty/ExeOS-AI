import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
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
      <div className='relative mx-auto max-w-5xl overflow-hidden rounded-3xl border bg-card px-6 py-16 text-center shadow-sm'>
        <div className='bg-dots pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,#000_20%,transparent_70%)]' />
        <div className='spotlight pointer-events-none absolute inset-0' />
        <div className='relative space-y-6'>
          <h2 className='text-3xl font-semibold tracking-tight text-balance sm:text-4xl'>
            Get back the hour you spend <Accent>sorting email</Accent>.
          </h2>
          <p className='mx-auto max-w-lg text-muted-foreground'>
            Connect Gmail and Calendar in under a minute. Your first triage runs
            the moment you click.
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
              href='/pricing'
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-11 rounded-full px-6",
              )}
            >
              See pricing
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
