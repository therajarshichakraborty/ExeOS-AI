"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Loader2Icon, PlayIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface RunAgentButtonProps {
  variant?:
    "default" | "outline" | "secondary" | "destructive" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  label?: string;
}

export function RunAgentButton({
  variant = "outline",
  size = "default",
  className = "w-full",
  label = "Run Agent Now",
}: RunAgentButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleRunAgent = async () => {
    startTransition(async () => {
      try {
        toast.info("Triggering AI Agent execution loop...");
        const response = await fetch("/api/agents/run", {
          method: "POST",
        });

        const result = await response.json();
        if (!response.ok) {
          toast.error(result.error || "Agent run failed");
          console.error("Agent run failed", result.error);
        } else {
          toast.success(result.summary || "Agent run completed successfully!");
        }

        router.refresh();
      } catch (error) {
        console.error("Agent run error:", error);
        toast.error("Failed to execute agent. Please check your connection.");
      }
    });
  };

  return (
    <Button
      className={className}
      variant={variant}
      size={size}
      onClick={handleRunAgent}
      disabled={isPending}
    >
      {isPending ? (
        <>
          <Loader2Icon className='h-4 w-4 animate-spin mr-2' />
          Running Agent...
        </>
      ) : (
        <>
          <PlayIcon className='h-3.5 w-3.5 mr-2 text-primary' />
          {label}
        </>
      )}
    </Button>
  );
}
