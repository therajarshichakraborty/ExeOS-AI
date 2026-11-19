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
        "inline-flex h-12 items-center gap-3 rounded-2xl bg-card px-5 text-sm font-medium shadow-sm ring-1 ring-border transition-all hover:shadow-md disabled:opacity-70",
        className,
      )}
    >
      {isPending ? (
        <Loader2Icon className='size-4 animate-spin text-brand' />
      ) : (
        <SparklesIcon className='size-4 text-brand' />
      )}
      {isPending ? "Running agents…" : label}
    </button>
  );
}
