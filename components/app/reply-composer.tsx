"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2Icon,
  Loader2Icon,
  ReplyIcon,
  SaveIcon,
  SendIcon,
  SparklesIcon,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Props {
  emailId: string;
  to: string;
  initialBody: string | null;
  hasDraft: boolean;
  sentAt: string | null;
}

/**
 * Edits the email's Gmail draft in place and sends it. The text here and the
 * draft in Gmail are the same object, so they can never drift apart.
 */
export function ReplyComposer({ emailId, to, initialBody, hasDraft, sentAt }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(Boolean(initialBody));
  const [body, setBody] = useState(initialBody ?? "");
  const [pending, setPending] = useState<"draft" | "send" | null>(null);
  const [, startTransition] = useTransition();
  const textarea = useRef<HTMLTextAreaElement>(null);
  const dirty = body.trim() !== (initialBody ?? "").trim();

  // Auto-grow the textarea with its content.
  useEffect(() => {
    const el = textarea.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [body, open]);

  if (sentAt) {
    return (
      <section className='animate-fade-up rounded-2xl border border-brand/30 bg-brand-soft/40 p-5'>
        <p className='flex items-center gap-2 text-sm font-semibold text-brand'>
          <CheckCircle2Icon className='size-4' /> Reply sent ·{" "}
          {new Date(sentAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}
        </p>
        {initialBody && (
          <p className='mt-3 text-sm leading-relaxed whitespace-pre-wrap text-foreground/80'>{initialBody}</p>
        )}
      </section>
    );
  }

  if (!open) {
    return (
      <button
        type='button'
        onClick={() => {
          setOpen(true);
          requestAnimationFrame(() => textarea.current?.focus());
        }}
        className='group inline-flex items-center gap-2 rounded-full border bg-card px-5 py-2.5 text-sm font-medium shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-md active:translate-y-0'
      >
        <ReplyIcon className='size-4 transition-transform group-hover:-translate-x-0.5' /> Reply
      </button>
    );
  }

  const submit = async (mode: "draft" | "send") => {
    if (!body.trim() || pending) return;
    setPending(mode);
    try {
      const res = await fetch(`/api/emails/${encodeURIComponent(emailId)}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body, mode }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      toast.success(mode === "send" ? "Reply sent" : "Draft saved to Gmail");
      startTransition(() => router.refresh());
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setPending(null);
    }
  };

  return (
    <section className='animate-fade-up overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow focus-within:shadow-lg focus-within:ring-1 focus-within:ring-brand/30'>
      <div className='flex items-center justify-between gap-3 border-b bg-surface/60 px-5 py-2.5 text-xs text-muted-foreground'>
        <span className='truncate'>
          To <span className='text-foreground'>{to}</span>
        </span>
        {initialBody && (
          <span className='inline-flex shrink-0 items-center gap-1 text-brand'>
            <SparklesIcon className='size-3' />
            {hasDraft ? "Synced with Gmail draft" : "AI suggestion"}
          </span>
        )}
      </div>

      <textarea
        ref={textarea}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit("send");
        }}
        placeholder='Write your reply…'
        rows={4}
        className='block min-h-28 w-full resize-none bg-transparent px-5 py-4 text-[15px] leading-relaxed outline-none placeholder:text-muted-foreground'
      />

      <div className='flex items-center gap-2 border-t px-4 py-3'>
        <button
          type='button'
          onClick={() => submit("send")}
          disabled={!body.trim() || !!pending}
          className='inline-flex h-9 items-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:opacity-90 active:scale-[0.97] disabled:opacity-50'
        >
          {pending === "send" ? <Loader2Icon className='size-4 animate-spin' /> : <SendIcon className='size-4' />}
          Send
        </button>
        <button
          type='button'
          onClick={() => submit("draft")}
          disabled={!body.trim() || !!pending || (!dirty && hasDraft)}
          className='inline-flex h-9 items-center gap-2 rounded-full px-4 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50'
        >
          {pending === "draft" ? <Loader2Icon className='size-4 animate-spin' /> : <SaveIcon className='size-4' />}
          {dirty || !hasDraft ? "Save draft" : "Saved"}
        </button>
        <span className={cn("ml-auto hidden text-xs text-muted-foreground sm:block")}>
          <kbd className='rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px]'>Ctrl</kbd>{" "}
          <kbd className='rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px]'>Enter</kbd> to send
        </span>
      </div>
    </section>
  );
}
