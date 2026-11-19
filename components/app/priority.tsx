import { cn } from "@/lib/utils";

const STYLES = {
  high: "bg-high-soft text-high",
  medium: "bg-medium-soft text-medium",
  low: "bg-low-soft text-low",
} as const;

const DOTS = { high: "bg-high", medium: "bg-medium", low: "bg-low" } as const;

type P = keyof typeof STYLES;
const isP = (p?: string): p is P => !!p && p in STYLES;

export function PriorityDot({ priority, className }: { priority?: string; className?: string }) {
  return (
    <span
      className={cn("size-2 shrink-0 rounded-full", isP(priority) ? DOTS[priority] : "bg-border", className)}
      title={priority ? `${priority} priority` : undefined}
    />
  );
}

export function PriorityBadge({ priority }: { priority?: string }) {
  if (!isP(priority)) return null;
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium capitalize", STYLES[priority])}>
      {priority}
    </span>
  );
}

export function Chip({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] text-muted-foreground", className)}>
      {children}
    </span>
  );
}
