"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2Icon, SparklesIcon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface RunAgentButtonProps {
  className?: string;
  label?: string;
}

/** Gmail "Compose"-style pill that triggers the three-agent pipeline. */
export function RunAgentButton({
  className,
  label = "Run triage",
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
        "group inline-flex h-14 items-center gap-3 rounded-2xl bg-card px-6 text-sm font-semibold shadow-md ring-1 ring-border/70 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98] disabled:opacity-70",
        className,
      )}
    >
      {isPending ? (
        <Loader2Icon className='size-4 animate-spin text-brand' />
      ) : (
        <SparklesIcon className='size-4 text-brand transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110' />
      )}
      {isPending ? "Running agents…" : label}
    </button>
  );
}
