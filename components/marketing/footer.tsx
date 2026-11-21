import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";
import { Logo } from "@/components/brand/logo";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { href: "/features", label: "Features" },
      { href: "/pricing", label: "Pricing" },
      { href: "/security", label: "Security" },
      { href: "/dashboard", label: "Dashboard" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/about#contact", label: "Contact" },
      { href: "/sign-up", label: "Get started" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/security", label: "Privacy" },
      { href: "/security", label: "Data handling" },
      { href: "/security", label: "Google API use" },
    ],
  },
];

export function Footer() {
  return (
    <footer className='px-3 pb-3'>
      <div className='relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border bg-surface'>
        <div className='relative grid gap-12 px-8 pt-16 pb-10 sm:px-12 lg:grid-cols-[1.3fr_2fr]'>
          <div className='space-y-6'>
            <Logo />
            <p className='max-w-sm text-2xl leading-snug font-medium tracking-tight text-balance'>
              Triage, drafts and deadlines.{" "}
              <span className='text-muted-foreground'>Handled before you open your laptop.</span>
            </p>
            <div className='inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-xs text-muted-foreground'>
              <span className='relative flex size-2'>
                <span className='absolute inset-0 animate-ping-soft rounded-full bg-brand' />
                <span className='relative size-2 rounded-full bg-brand' />
              </span>
              All agents operational
            </div>
          </div>

          <div className='grid grid-cols-2 gap-8 sm:grid-cols-3'>
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <p className='text-sm font-semibold'>{col.title}</p>
                <ul className='mt-5 space-y-3.5'>
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className='group inline-flex items-center gap-1 text-[15px] text-muted-foreground transition-colors hover:text-foreground'
                      >
                        {link.label}
                        <ArrowUpRightIcon className='size-3.5 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100' />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className='relative flex flex-col items-center justify-between gap-3 border-t px-8 py-6 text-sm text-muted-foreground sm:flex-row sm:px-12'>
          <p>© {new Date().getFullYear()} ExeOS. All rights reserved.</p>
          <p>Built with the OpenAI Agents SDK · Gmail · Google Calendar</p>
        </div>

        {/* Oversized wordmark */}
        <p
          aria-hidden
          className='pointer-events-none relative -mb-[0.22em] text-center text-[22vw] leading-none font-bold tracking-tighter text-transparent select-none lg:text-[17rem]'
          style={{
            backgroundImage:
              "linear-gradient(to bottom, color-mix(in oklch, var(--foreground) 12%, transparent), transparent 85%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
          }}
        >
          ExeOS
        </p>
      </div>
    </footer>
  );
}
