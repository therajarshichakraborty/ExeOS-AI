import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * The ExeOS mark: an open "E" drawn as three inbox rows on a blue tile. The
 * middle row is shorter and ends in a dot (the agent at work). Identical to
 * app/icon.svg, which is used as the favicon.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative grid size-8 shrink-0 place-items-center overflow-hidden rounded-[9px] shadow-[0_6px_16px_-6px_oklch(0.5_0.22_262/0.7),inset_0_0_0_1px_oklch(1_0_0/0.18)]",
        className,
      )}
      style={{ background: "linear-gradient(145deg, #4b8bff 0%, #2563eb 55%, #1d3fbf 100%)" }}
      aria-hidden
    >
      <svg viewBox='0 0 32 32' className='relative z-10 size-full'>
        <rect x='8.5' y='8.6' width='15' height='3.4' rx='1.7' fill='#fff' />
        <rect x='8.5' y='14.3' width='8.6' height='3.4' rx='1.7' fill='#fff' />
        <circle cx='21.1' cy='16' r='2' fill='#fff' />
        <rect x='8.5' y='20' width='15' height='3.4' rx='1.7' fill='#fff' />
      </svg>
      <span className='pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent' />
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
    <Link href={href} className={cn("group flex items-center gap-2.5", className)}>
      <LogoMark className='transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105' />
      <span className='flex items-baseline gap-1 text-[17px] font-semibold tracking-[-0.025em]'>
        ExeOS
        <span className='rounded-[5px] bg-brand/10 px-1 py-px text-[10px] leading-none font-bold tracking-wide text-brand'>
          AI
        </span>
      </span>
    </Link>
  );
}
