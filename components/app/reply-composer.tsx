"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2Icon,
  Loader2Icon,
  ReplyIcon,
  SaveIcon,
  SendIcon,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Props {
  emailId: string;
  to: string;
  initialBody: string | null;
  /** Text currently saved in Gmail; edits are compared against this. */
  savedBody?: string | null;
  hasDraft: boolean;
  sentAt: string | null;
  /** Type the initial body in, for freshly generated AI drafts. */
  typeIn?: boolean;
}

/**
 * Edits the email's Gmail draft in place and sends it. The text here and the
 * draft in Gmail are the same object, so they can never drift apart.
 */
export function ReplyComposer({ emailId, to, initialBody, savedBody, hasDraft, sentAt, typeIn = false }: Props) {
  const router = useRouter();
  const target = initialBody ?? "";
  const [open, setOpen] = useState(Boolean(initialBody));
  const [body, setBody] = useState(typeIn ? "" : target);
  const [typing, setTyping] = useState(typeIn && target.length > 0);
  const [pending, setPending] = useState<"draft" | "send" | null>(null);
  const [, startTransition] = useTransition();
  const textarea = useRef<HTMLTextAreaElement>(null);
  const baseline = savedBody !== undefined ? (savedBody ?? "") : target;
  const dirty = body.trim() !== baseline.trim();
  const fresh = typeIn && body.trim() !== (savedBody ?? "").trim();

  // Type a fresh AI draft in, a few characters per frame.
  useEffect(() => {
    if (!typing) return;
    const id = setInterval(() => {
      setBody((b) => {
        if (b.length >= target.length) return b;
        return target.slice(0, b.length + 3);
      });
    }, 14);
    const stop = setTimeout(() => {
      clearInterval(id);
      setTyping(false);
      setBody(target);
    }, (target.length / 3 + 4) * 14);
    return () => {
      clearInterval(id);
      clearTimeout(stop);
    };
  }, [typing, target]);

  // Auto-grow the textarea with its content.
  useEffect(() => {
    const el = textarea.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [body, open]);

  if (sentAt) {
    return (
      <section className='animate-fade-up rounded-2xl border border-brand/30 bg-brand/5 p-5'>
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
        className='press group inline-flex items-center gap-2 rounded-full border bg-card px-5 py-2.5 text-sm font-medium shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-md'
      >
        <ReplyIcon className='size-4 transition-transform group-hover:-translate-x-0.5' /> Reply yourself
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
    <section
      className={cn(
        "animate-fade-up overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow focus-within:shadow-lg focus-within:ring-1 focus-within:ring-foreground/10",
        fresh && "border-brand/30",
      )}
    >
      <div className='flex items-center justify-between gap-3 border-b bg-surface/60 px-5 py-2.5 text-xs text-muted-foreground'>
        <span className='truncate'>
          To <span className='text-foreground'>{to}</span>
        </span>
        {fresh ? (
          <span className='inline-flex shrink-0 items-center gap-1 font-medium text-brand'>
            {typing && <Loader2Icon className='size-3 animate-spin' />}
            {typing ? "Writing…" : "Fresh AI draft · not saved yet"}
          </span>
        ) : (
          initialBody && (
            <span className='inline-flex shrink-0 items-center gap-1 text-foreground'>
              {hasDraft ? "Synced with Gmail draft" : "AI suggestion"}
            </span>
          )
        )}
      </div>

      <textarea
        ref={textarea}
        value={body}
        onChange={(e) => {
          setTyping(false);
          setBody(e.target.value);
        }}
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
          disabled={!body.trim() || !!pending || typing}
          className='btn-ink press inline-flex h-9 items-center gap-2 rounded-full px-5 text-sm font-medium disabled:opacity-50'
        >
          {pending === "send" ? <Loader2Icon className='size-4 animate-spin' /> : <SendIcon className='size-4' />}
          Send
        </button>
        <button
          type='button'
          onClick={() => submit("draft")}
          disabled={!body.trim() || !!pending || typing || (!dirty && hasDraft)}
          className='inline-flex h-9 items-center gap-2 rounded-full px-4 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50'
        >
          {pending === "draft" ? <Loader2Icon className='size-4 animate-spin' /> : <SaveIcon className='size-4' />}
          {dirty || !hasDraft ? "Save to Gmail" : "Saved"}
        </button>
        <span className='ml-auto hidden text-xs text-muted-foreground sm:block'>
          <kbd className='rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px]'>Ctrl</kbd>{" "}
          <kbd className='rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px]'>Enter</kbd> to send
        </span>
      </div>
    </section>
  );
}
