import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { MARKETING_LINKS } from "./links";

export function Footer() {
  return (
    <footer className='mx-auto w-full max-w-6xl px-5'>
      <div className='flex flex-col items-center gap-6 border-t py-16 text-center'>
        <Logo />
        <nav className='flex flex-wrap justify-center gap-x-8 gap-y-2'>
          {MARKETING_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className='text-sm text-muted-foreground transition-colors hover:text-foreground'
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <p className='text-sm text-muted-foreground'>
          © {new Date().getFullYear()} ExeOS. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
