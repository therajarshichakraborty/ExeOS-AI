"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Show } from "@clerk/nextjs";
import { ArrowRightIcon, MenuIcon, XIcon } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";
import { MARKETING_LINKS } from "./links";

const NAV = [{ href: "/", label: "Home" }, ...MARKETING_LINKS];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className='pointer-events-none sticky top-0 z-50 px-3 pt-3'>
      <nav
        className={cn(
          "pointer-events-auto mx-auto flex items-center justify-between transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          scrolled
            ? "h-16 max-w-4xl rounded-full border border-border/70 bg-background/75 pr-2 pl-5 shadow-float backdrop-blur-xl"
            : "h-16 max-w-6xl rounded-full border border-transparent px-4",
        )}
      >
        <Logo />

        <div
          className='hidden items-center md:flex'
          onMouseLeave={() => setHovered(null)}
        >
          {NAV.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onMouseEnter={() => setHovered(link.href)}
                className={cn(
                  "relative isolate px-4 py-2 text-[15px] transition-colors duration-200",
                  active ? "text-foreground" : "text-foreground/65 hover:text-foreground",
                )}
              >
                {(hovered ?? (active ? link.href : null)) === link.href && (
                  <span className='absolute inset-0 -z-10 rounded-full bg-muted animate-in fade-in-0 zoom-in-90 duration-200' />
                )}
                {link.label}
                {active && (
                  <span className='absolute -bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-foreground' />
                )}
              </Link>
            );
          })}
        </div>

        <div className='hidden items-center gap-2 md:flex'>
          <Show when='signed-out'>
            <Link
              href='/sign-in'
              className={cn(
                "press inline-flex h-10 items-center rounded-full border bg-background px-5 text-sm font-semibold transition-all hover:bg-muted",
                scrolled && "hidden lg:inline-flex",
              )}
            >
              Login
            </Link>
            <Link
              href='/sign-up'
              className='btn-ink sheen press group inline-flex h-10 items-center gap-1.5 rounded-full px-5 text-sm font-semibold'
            >
              Sign up
              <ArrowRightIcon className='size-3.5 transition-transform duration-300 group-hover:translate-x-0.5' />
            </Link>
          </Show>
          <Show when='signed-in'>
            <Link
              href='/dashboard'
              className='btn-ink sheen press group inline-flex h-10 items-center gap-1.5 rounded-full px-5 text-sm font-semibold'
            >
              Open dashboard
              <ArrowRightIcon className='size-3.5 transition-transform duration-300 group-hover:translate-x-0.5' />
            </Link>
          </Show>
        </div>

        <button
          className='press grid size-10 place-items-center rounded-full border bg-background md:hidden'
          onClick={() => setOpen((v) => !v)}
          aria-label='Toggle menu'
          aria-expanded={open}
        >
          {open ? <XIcon className='size-4' /> : <MenuIcon className='size-4' />}
        </button>
      </nav>

      {open && (
        <div className='pointer-events-auto mx-auto mt-2 max-w-6xl rounded-3xl border bg-background/95 p-3 shadow-float backdrop-blur-xl animate-in fade-in-0 slide-in-from-top-2 md:hidden'>
          <div className='stagger flex flex-col' onClick={() => setOpen(false)}>
            {NAV.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-2xl px-4 py-3 text-[15px] transition-colors hover:bg-muted",
                  pathname === link.href ? "bg-muted font-medium" : "text-foreground/75",
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className='mt-2 flex items-center gap-2 border-t pt-3'>
            <Show when='signed-out'>
              <Link href='/sign-in' className='press inline-flex h-11 flex-1 items-center justify-center rounded-full border font-semibold'>
                Login
              </Link>
              <Link href='/sign-up' className='btn-ink press inline-flex h-11 flex-1 items-center justify-center rounded-full font-semibold'>
                Sign up
              </Link>
            </Show>
            <Show when='signed-in'>
              <Link href='/dashboard' className='btn-ink press inline-flex h-11 flex-1 items-center justify-center rounded-full font-semibold'>
                Open dashboard
              </Link>
            </Show>
          </div>
        </div>
      )}
    </header>
  );
}
