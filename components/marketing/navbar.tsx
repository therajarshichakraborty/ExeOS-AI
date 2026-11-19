"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Show } from "@clerk/nextjs";
import { MenuIcon, XIcon } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { MARKETING_LINKS } from "./links";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border/60 bg-background/75 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <nav className='mx-auto grid h-20 max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-5 max-md:flex max-md:justify-between'>
        <Logo />

        <div className='hidden items-center gap-8 md:flex'>
          {MARKETING_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative py-1 text-[15px] text-foreground/70 transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-foreground after:transition-transform after:duration-300 hover:text-foreground hover:after:scale-x-100",
                pathname === link.href && "text-foreground after:scale-x-100",
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className='hidden items-center justify-end gap-2 md:flex'>
          <ThemeToggle />
          <Show when='signed-out'>
            <Link
              href='/sign-in'
              className={buttonVariants({ variant: "ghost", size: "lg" })}
            >
              Sign in
            </Link>
            <Link
              href='/sign-up'
              className='glow-pill press ml-1 rounded-full bg-background px-5 py-2 text-sm font-medium ring-1 ring-border transition-transform'
            >
              Get started
            </Link>
          </Show>
          <Show when='signed-in'>
            <Link
              href='/dashboard'
              className='glow-pill press ml-1 rounded-full bg-background px-5 py-2 text-sm font-medium ring-1 ring-border transition-transform'
            >
              Open inbox
            </Link>
          </Show>
        </div>

        <button
          className='grid size-9 place-items-center rounded-lg border md:hidden'
          onClick={() => setOpen((v) => !v)}
          aria-label='Toggle menu'
        >
          {open ? <XIcon className='size-4' /> : <MenuIcon className='size-4' />}
        </button>
      </nav>

      {open && (
        <div className='border-t bg-background px-5 pb-5 md:hidden'>
          <div className='flex flex-col py-2'>
            {MARKETING_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className='py-2.5 text-sm text-muted-foreground hover:text-foreground'
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className='flex items-center gap-2'>
            <ThemeToggle />
            <Link
              href='/dashboard'
              className={cn(buttonVariants({ size: "lg" }), "flex-1 rounded-full")}
            >
              Open ExeOS
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
