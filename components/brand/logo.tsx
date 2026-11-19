import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative grid size-7 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm",
        className,
      )}
    >
      <svg viewBox='0 0 24 24' fill='none' className='size-4' aria-hidden>
        <path
          d='M4 7.5 12 13l8-5.5M5 5h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z'
          stroke='currentColor'
          strokeWidth='1.8'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
      <span className='absolute -top-0.5 -right-0.5 size-2 rounded-full bg-brand ring-2 ring-background' />
    </span>
  );
}

export function Logo({
  href = "/",
  className,
}: {
  href?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn("flex items-center gap-2.5 font-semibold", className)}
    >
      <LogoMark />
      <span className='text-[15px] tracking-tight'>ExeOS</span>
    </Link>
  );
}
