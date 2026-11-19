"use client";

import { AnimatedThemeToggler } from "@/components/animated-theme-toggler";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  return (
    <AnimatedThemeToggler
      className={cn(
        "grid size-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground [&_svg]:size-4",
        className,
      )}
    />
  );
}
