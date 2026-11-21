"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Card with a cursor-following light: a soft wash on the surface plus a thin
 * highlight that runs along the border, and a gentle lift on hover. Driven by
 * CSS variables, so it never re-renders on mouse move.
 */
export function SpotlightCard({
  children,
  className,
  tilt = false,
}: {
  children: React.ReactNode;
  className?: string;
  tilt?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);
    if (tilt) {
      const rx = (y / r.height - 0.5) * -5;
      const ry = (x / r.width - 0.5) * 5;
      el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-3px)`;
    }
  };

  const onLeave = () => {
    if (tilt && ref.current) ref.current.style.transform = "";
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={cn(
        "group/spot relative isolate overflow-hidden rounded-3xl border bg-card transition-[transform,box-shadow,translate] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:shadow-soft",
        !tilt && "hover:-translate-y-[3px]",
        className,
      )}
    >
      {/* surface wash */}
      <div
        aria-hidden
        className='pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100'
        style={{
          background:
            "radial-gradient(480px circle at var(--mx, 50%) var(--my, 50%), color-mix(in oklch, var(--brand) 7%, transparent), transparent 65%)",
        }}
      />
      {/* border light */}
      <div
        aria-hidden
        className='pointer-events-none absolute inset-0 z-20 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100'
        style={{
          padding: 1,
          background:
            "radial-gradient(220px circle at var(--mx, 50%) var(--my, 50%), color-mix(in oklch, var(--brand) 75%, transparent), color-mix(in oklch, var(--foreground) 12%, transparent) 45%, transparent 75%)",
          WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      <div className='relative z-10 h-full'>{children}</div>
    </div>
  );
}
