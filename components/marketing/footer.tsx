import Link from "next/link";
import { Logo } from "@/components/brand/logo";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { href: "/features", label: "Features" },
      { href: "/pricing", label: "Pricing" },
      { href: "/dashboard", label: "Open inbox" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/security", label: "Security" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/sign-in", label: "Sign in" },
      { href: "/sign-up", label: "Create account" },
      { href: "/settings", label: "Integrations" },
    ],
  },
];

export function Footer() {
  return (
    <footer className='border-t border-border/60'>
      <div className='mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]'>
        <div className='space-y-3'>
          <Logo />
          <p className='max-w-xs text-sm leading-relaxed text-muted-foreground'>
            The calm inbox that triages, replies and schedules for you — so you
            only see what matters.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title} className='space-y-3'>
            <p className='text-xs font-medium tracking-wider text-muted-foreground uppercase'>
              {col.title}
            </p>
            <ul className='space-y-2'>
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className='text-sm text-foreground/80 transition-colors hover:text-foreground'
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className='border-t border-border/60'>
        <div className='mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 py-6 text-xs text-muted-foreground sm:flex-row'>
          <p>© {new Date().getFullYear()} ExeOS. All rights reserved.</p>
          <p>Built for people with better things to do than email.</p>
        </div>
      </div>
    </footer>
  );
}
