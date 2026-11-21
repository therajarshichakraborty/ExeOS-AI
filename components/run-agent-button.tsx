"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface RunAgentButtonProps {
  className?: string;
  label?: string;
  variant?: "brand" | "outline" | "ghost";
}

const VARIANTS = {
  brand: "btn-ink sheen h-11 rounded-xl px-5 text-[15px] font-semibold",
  outline:
    "h-9 rounded-lg border bg-background px-3.5 text-sm font-medium shadow-xs hover:bg-muted",
  ghost: "h-9 rounded-lg px-3 text-sm font-medium hover:bg-muted",
} as const;

/** Triggers the three-agent pipeline (classifier → reply suggester → notifier). */
export function RunAgentButton({
  className,
  label = "Run triage",
  variant = "brand",
}: RunAgentButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const run = () =>
    startTransition(async () => {
      const id = toast.loading("Agents are reading your inbox…");
      try {
        const response = await fetch("/api/agents/run", { method: "POST" });
        const result = await response.json().catch(() => ({}));
        if (!response.ok || result.status === "failed") {
          toast.error(result.error || result.summary || "Agent run failed", { id });
        } else {
          toast.success(result.summary || "Triage complete", { id });
        }
        router.refresh();
      } catch {
        toast.error("Couldn't reach the server. Check your connection.", { id });
      }
    });

  return (
    <button
      type='button'
      onClick={run}
      disabled={isPending}
      className={cn(
        "press group inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap transition-all disabled:opacity-70",
        VARIANTS[variant],
        className,
      )}
    >
      {isPending && <Loader2Icon className='size-4 animate-spin' />}
      {isPending ? "Running agents…" : label}
    </button>
  );
}
