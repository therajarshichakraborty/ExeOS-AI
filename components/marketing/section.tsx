import Link from "next/link";
import {
  ArrowRightIcon,
  CalendarCheckIcon,
  MailIcon,
  SendIcon,
} from "lucide-react";
import { AnimatedWords } from "@/components/motion/animated-words";
import { cn } from "@/lib/utils";

export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border bg-card/70 py-1 px-3 text-xs font-medium text-muted-foreground shadow-xs backdrop-blur",
        className,
      )}
    >
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
  align = "center",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  align?: "center" | "left";
}) {
  return (
    <div
      className={cn(
        "max-w-3xl space-y-5",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className='text-4xl leading-[1.05] font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl'>
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "max-w-2xl text-lg leading-relaxed text-balance text-muted-foreground",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}

/** Brand-gradient accent word(s) used inside headings. */
export function Accent({ children }: { children: React.ReactNode }) {
  return <span className='text-gradient'>{children}</span>;
}

export function PageHero({
  eyebrow,
  title,
  accent,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  description: React.ReactNode;
  children?: React.ReactNode;
}) {
  const words = title.split(" ").length;
  return (
    <section className='relative -mt-[76px] overflow-hidden px-3 pt-[76px]'>
      <div className='relative mx-auto max-w-7xl overflow-hidden rounded-b-[2.5rem]'>
        <div className='hero-wash pointer-events-none absolute inset-0 opacity-80' />
        <HeroArcs />
        <div className='relative mx-auto max-w-4xl px-5 pt-24 pb-24 text-center sm:pt-28'>
          <div className='space-y-7'>
            <div className='animate-fade-up'>
              <Eyebrow>{eyebrow}</Eyebrow>
            </div>
            <h1 className='text-5xl leading-[1.02] font-bold tracking-tight text-balance sm:text-6xl lg:text-7xl'>
              <AnimatedWords text={title} />
              {accent && (
                <>
                  {" "}
                  <AnimatedWords
                    text={accent}
                    delay={words * 35}
                    wordClassName='text-gradient pb-2'
                  />
                </>
              )}
            </h1>
            <p
              className='mx-auto max-w-2xl animate-fade-up text-lg leading-relaxed text-balance text-muted-foreground sm:text-xl'
              style={{ animationDelay: "150ms" }}
            >
              {description}
            </p>
            {children && (
              <div className='animate-fade-up' style={{ animationDelay: "220ms" }}>
                {children}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Two thin concentric arcs framing the hero, as in the reference. */
export function HeroArcs({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox='0 0 1200 600'
      preserveAspectRatio='none'
      className={cn('pointer-events-none absolute inset-x-0 bottom-0 h-[70%] w-full text-foreground/10', className)}
    >
      <path
        d='M80 600 C 160 180, 1040 180, 1120 600'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.2'
        className='[stroke-dasharray:1600] [stroke-dashoffset:1600] motion-safe:animate-[draw_1.2s_ease-out_0.1s_forwards] motion-reduce:[stroke-dashoffset:0]'
      />
      <path
        d='M220 600 C 300 300, 900 300, 980 600'
        fill='none'
        stroke='currentColor'
        strokeWidth='1'
        className='[stroke-dasharray:1200] [stroke-dashoffset:1200] motion-safe:animate-[draw_1.2s_ease-out_0.25s_forwards] motion-reduce:[stroke-dashoffset:0]'
      />
    </svg>
  );
}

const CTA_ICONS = [
  { icon: SendIcon, className: "right-[7%] top-[14%] rotate-[8deg] text-foreground", delay: "1.2s" },
  { icon: MailIcon, className: "left-[12%] bottom-[14%] rotate-[6deg] text-medium", delay: "2.1s" },
  { icon: CalendarCheckIcon, className: "right-[12%] bottom-[16%] rotate-[-6deg] text-brand", delay: "0.6s" },
];

export function CtaBand() {
  return (
    <section className='px-3 pb-24'>
      <div className='relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] border bg-card px-6 py-28 text-center sm:py-32'>
        <div className='aurora pointer-events-none absolute inset-0 opacity-50' />

        {CTA_ICONS.map(({ icon: Icon, className, delay }, i) => (
          <span
            key={i}
            aria-hidden
            className={cn(
              "absolute hidden size-20 place-items-center rounded-3xl border bg-background shadow-float md:grid",
              className,
            )}
          >
            <span className='grid size-full animate-float place-items-center' style={{ animationDelay: delay }}>
              <Icon className='size-8' strokeWidth={1.75} />
            </span>
          </span>
        ))}

        <div className='relative mx-auto max-w-2xl space-y-7'>
          <h2 className='text-4xl leading-[1.05] font-bold tracking-tight text-balance sm:text-6xl'>
            Your calmest inbox <span className='text-gradient'>starts today.</span>
          </h2>
          <p className='mx-auto max-w-lg text-lg text-muted-foreground'>
            Connect Gmail and Calendar in under a minute. Your first triage runs
            the moment you click.
          </p>
          <div className='flex flex-wrap justify-center gap-3 pt-2'>
            <Link
              href='/sign-up'
              className='btn-ink sheen press group inline-flex h-12 items-center gap-2 rounded-full px-7 font-semibold'
            >
              Get started free
              <ArrowRightIcon className='size-4 transition-transform duration-300 group-hover:translate-x-1' />
            </Link>
            <Link
              href='/pricing'
              className='press inline-flex h-12 items-center rounded-full border bg-background px-7 font-semibold transition-colors hover:bg-muted'
            >
              See pricing
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
