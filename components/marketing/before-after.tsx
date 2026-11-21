"use client";

import { useState } from "react";
import { CheckIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const BEFORE = [
  { title: "142 unread, sorted by time", body: "Not by importance. The urgent ones hide on page three." },
  { title: "Important threads buried", body: "Newsletters and receipts drown out the people waiting on you." },
  { title: "Replies written at 11pm", body: "Every answer starts from a blank page, long after it was due." },
  { title: "Deadlines live inside emails", body: "Dates mentioned in passing never make it to your calendar." },
];

const AFTER = [
  { title: "A short list of what needs you", body: "Ranked high, medium and low with a one-line summary each." },
  { title: "Bulk mail quietly filed", body: "Receipts and newsletters stay out of the way, never deleted." },
  { title: "Drafts waiting in the thread", body: "A careful reply is already in Gmail. Tweak a line and send." },
  { title: "Deadlines already scheduled", body: "Meetings and due dates become Google Calendar holds." },
];

export function BeforeAfter() {
  const [after, setAfter] = useState(true);
  const items = after ? AFTER : BEFORE;

  return (
    <div className='space-y-10'>
      <div className='flex justify-center'>
        <div className='relative grid grid-cols-2 rounded-full border bg-muted/60 p-1 text-sm font-semibold'>
          <span
            className={cn(
              "absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full shadow-sm transition-all duration-250 ease-[cubic-bezier(0.22,1,0.36,1)]",
              after ? "translate-x-full bg-brand" : "translate-x-0 bg-card",
            )}
          />
          <button
            type='button'
            onClick={() => setAfter(false)}
            className={cn("relative z-10 rounded-full px-6 py-2.5 transition-colors", !after ? "text-foreground" : "text-muted-foreground")}
          >
            Your inbox today
          </button>
          <button
            type='button'
            onClick={() => setAfter(true)}
            className={cn("relative z-10 rounded-full px-6 py-2.5 transition-colors", after ? "text-brand-foreground" : "text-muted-foreground")}
          >
            With ExeOS
          </button>
        </div>
      </div>

      <div key={String(after)} className='stagger grid gap-4 sm:grid-cols-2'>
        {items.map((item) => (
          <div
            key={item.title}
            className={cn(
              "flex gap-4 rounded-3xl border p-6 transition-colors",
              after ? "bg-card shadow-soft" : "bg-muted/40",
            )}
          >
            <span
              className={cn(
                "grid size-9 shrink-0 place-items-center rounded-xl",
                after ? "bg-brand text-brand-foreground" : "bg-background text-muted-foreground ring-1 ring-border",
              )}
            >
              {after ? <CheckIcon className='size-4' strokeWidth={3} /> : <XIcon className='size-4' />}
            </span>
            <div>
              <p className={cn("text-[17px] font-semibold", !after && "text-muted-foreground line-through decoration-muted-foreground/40")}>
                {item.title}
              </p>
              <p className='mt-1 leading-relaxed text-muted-foreground'>{item.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
