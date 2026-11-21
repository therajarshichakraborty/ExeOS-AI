"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRightIcon,
  Loader2Icon,
  PenLineIcon,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ReplyComposer } from "./reply-composer";

type Action = "summary" | "draft";

interface Summary {
  summary: string;
  points: string[];
  action: string | null;
  source: "ai" | "rules" | "triage";
}

interface Props {
  emailId: string;
  to: string;
  initialSummary: string | null;
  draftReply: string | null;
  hasDraft: boolean;
  sentAt: string | null;
  autoAction?: Action;
}

/**
 * Per-email AI tools: "Get AI summary" and "Draft with AI". The summary is
 * stored on the email; the draft lands in the composer and only reaches Gmail
 * when the user saves or sends it.
 */
export function EmailAssistant({ emailId, to, initialSummary, draftReply, hasDraft, sentAt, autoAction }: Props) {
  const router = useRouter();
  const [summary, setSummary] = useState<Summary | null>(
    initialSummary ? { summary: initialSummary, points: [], action: null, source: "triage" } : null,
  );
  const [summaryKey, setSummaryKey] = useState(0);
  const [draft, setDraft] = useState<{ text: string | null; nonce: number }>({ text: draftReply, nonce: 0 });
  const [loading, setLoading] = useState<Action | null>(null);
  const composerRef = useRef<HTMLDivElement>(null);
  const autoRan = useRef(false);

  const run = async (action: Action) => {
    if (loading) return;
    setLoading(action);
    if (action === "draft") {
      requestAnimationFrame(() => composerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }));
    }
    try {
      const res = await fetch(`/api/emails/${encodeURIComponent(emailId)}/ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "The AI couldn't finish");
      if (action === "summary") {
        setSummary(data as Summary);
        setSummaryKey((k) => k + 1);
        router.refresh();
      } else {
        setDraft((d) => ({ text: data.draft as string, nonce: d.nonce + 1 }));
        if (data.source === "rules") toast.info("No AI key configured, so this is a template draft.");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(null);
    }
  };

  // Deep links from the inbox (…&ai=summary / …&ai=draft) run the action on open.
  useEffect(() => {
    if (!autoAction || autoRan.current) return;
    autoRan.current = true;
    // Drop the ?ai= flag so a reload doesn't re-run it.
    const url = new URL(window.location.href);
    url.searchParams.delete("ai");
    window.history.replaceState(window.history.state, "", url);
    const id = setTimeout(() => run(autoAction), 0);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoAction]);

  const sent = Boolean(sentAt);

  return (
    <div className='space-y-4'>
      {/* Assistant bar */}
      <div className='flex flex-wrap items-center gap-2 rounded-2xl border bg-surface/70 p-2'>
        <span className='px-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase'>AI assistant</span>
        <div className='ml-auto flex flex-wrap gap-2'>
          <button
            type='button'
            onClick={() => run("summary")}
            disabled={!!loading}
            className='press group inline-flex h-9 items-center gap-2 rounded-xl border bg-background px-3.5 text-sm font-medium shadow-xs transition-all hover:border-foreground/15 hover:shadow-sm disabled:opacity-60'
          >
            {loading === "summary" && <Loader2Icon className='size-4 animate-spin' />}
            {loading === "summary" ? "Summarizing…" : summary?.source === "ai" || summary?.source === "rules" ? "Refresh summary" : "Get AI summary"}
          </button>
          {!sent && (
            <button
              type='button'
              onClick={() => run("draft")}
              disabled={!!loading}
              className='press group inline-flex h-9 items-center gap-2 rounded-xl bg-foreground px-3.5 text-sm font-semibold text-background shadow-sm transition-all hover:-translate-y-px hover:shadow-md disabled:opacity-60'
            >
              {loading === "draft" ? (
                <Loader2Icon className='size-4 animate-spin' />
              ) : (
                <PenLineIcon className='size-4 transition-transform group-hover:-rotate-12' />
              )}
              {loading === "draft" ? "Drafting…" : draft.nonce > 0 ? "Redraft with AI" : "Draft with AI"}
            </button>
          )}
        </div>
      </div>

      {/* Summary */}
      {loading === "summary" ? (
        <section className='space-y-3 rounded-2xl border border-foreground/15 bg-muted p-5'>
          <p className='flex items-center gap-1.5 text-xs font-semibold tracking-wide text-foreground uppercase'>
            <Loader2Icon className='size-3.5 animate-spin' /> Reading the email…
          </p>
          <div className='skeleton h-3.5 w-full rounded-full' />
          <div className='skeleton h-3.5 w-11/12 rounded-full' />
          <div className='skeleton h-3.5 w-2/3 rounded-full' />
        </section>
      ) : (
        summary && (
          <section key={summaryKey} className='animate-fade-up rounded-2xl border border-foreground/15 bg-muted p-5'>
            <div className='mb-2 flex items-center justify-between gap-2'>
              <p className='flex items-center gap-1.5 text-xs font-semibold tracking-wide text-foreground uppercase'>
                AI summary
              </p>
              <span className='rounded-full border bg-background px-2 py-0.5 text-[10px] text-muted-foreground'>
                {summary.source === "ai" ? "Fresh from the model" : summary.source === "rules" ? "Rules-based" : "From triage"}
              </span>
            </div>
            <Typewriter text={summary.summary} animate={summaryKey > 0} className='text-[15px] leading-relaxed' />
            {summary.points.length > 0 && (
              <ul className='stagger mt-3 space-y-1.5'>
                {summary.points.map((p) => (
                  <li key={p} className='flex gap-2 text-sm text-foreground/85'>
                    <span className='mt-2 size-1.5 shrink-0 rounded-full bg-foreground' />
                    {p}
                  </li>
                ))}
              </ul>
            )}
            {summary.action && (
              <p className='mt-4 inline-flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1 text-xs font-medium text-background'>
                <ArrowRightIcon className='size-3' /> {summary.action}
              </p>
            )}
          </section>
        )
      )}

      {/* Composer */}
      <div ref={composerRef} className='scroll-mt-24'>
        {loading === "draft" ? (
          <section className='overflow-hidden rounded-2xl border border-brand/30 bg-card'>
            <div className='flex items-center gap-2 border-b bg-surface/60 px-5 py-2.5 text-xs font-medium text-brand'>
              <Loader2Icon className='size-3.5 animate-spin' /> Writing a reply to {to}…
            </div>
            <div className='space-y-3 p-5'>
              <div className='skeleton h-3.5 w-1/3 rounded-full' />
              <div className='skeleton h-3.5 w-full rounded-full' />
              <div className='skeleton h-3.5 w-5/6 rounded-full' />
              <div className='skeleton h-3.5 w-1/4 rounded-full' />
            </div>
          </section>
        ) : (
          <ReplyComposer
            key={`${emailId}-${draft.nonce}-${sentAt ?? ""}-${draftReply ?? ""}`}
            emailId={emailId}
            to={to}
            initialBody={draft.text}
            savedBody={draft.nonce > 0 ? (hasDraft ? draftReply : null) : undefined}
            hasDraft={hasDraft}
            sentAt={sentAt}
            typeIn={draft.nonce > 0}
          />
        )}
      </div>
    </div>
  );
}

function Typewriter({ text, animate, className }: { text: string; animate: boolean; className?: string }) {
  const [n, setN] = useState(animate ? 0 : text.length);
  useEffect(() => {
    if (!animate) return;
    const id = setInterval(() => setN((v) => (v >= text.length ? v : v + 3)), 12);
    return () => clearInterval(id);
  }, [animate, text]);
  const done = n >= text.length;
  return (
    <p className={className}>
      {text.slice(0, n)}
      {!done && <span className={cn("ml-px inline-block h-4 w-px translate-y-0.5 animate-blink bg-foreground")} />}
    </p>
  );
}
