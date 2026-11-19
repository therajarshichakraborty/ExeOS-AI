"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BellIcon, BellRingIcon, CheckCheckIcon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Item {
  id: string;
  title: string;
  body: string;
  priority: "low" | "medium" | "high";
  read: boolean;
  createdAt: string;
  emailId: string | null;
}

const POLL_MS = 60_000;
const SEEN_KEY = "exeos:seen-notifications";

function loadSeen(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(SEEN_KEY) ?? "[]"));
  } catch {
    return new Set();
  }
}

/**
 * Polls the notifier agent's output and surfaces new items as browser push
 * notifications (when permitted) plus an in-app dropdown.
 */
export function NotificationBell() {
  const [items, setItems] = useState<Item[]>([]);
  const [open, setOpen] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">(() =>
    typeof window === "undefined" || !("Notification" in window)
      ? "unsupported"
      : Notification.permission,
  );
  const seen = useRef<Set<string> | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/notifications").catch(() => null);
    if (!res?.ok) return;
    const data = (await res.json()) as { notifications: Item[] };
    setItems(data.notifications);

    seen.current ??= loadSeen();
    const fresh = data.notifications.filter((n) => !n.read && !seen.current!.has(n.id));
    for (const n of fresh.slice(0, 3)) {
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(n.title, { body: n.body, tag: n.id, icon: "/favicon.ico" });
      } else {
        toast(n.title, { description: n.body });
      }
    }
    fresh.forEach((n) => seen.current!.add(n.id));
    try {
      localStorage.setItem(SEEN_KEY, JSON.stringify([...seen.current].slice(-200)));
    } catch {}
  }, []);

  useEffect(() => {
    const first = setTimeout(load, 0);
    const id = setInterval(load, POLL_MS);
    // Refresh right after a manual run completes.
    const onFocus = () => load();
    window.addEventListener("focus", onFocus);
    return () => {
      clearTimeout(first);
      clearInterval(id);
      window.removeEventListener("focus", onFocus);
    };
  }, [load]);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const unread = items.filter((n) => !n.read).length;

  const markAll = async () => {
    setItems((list) => list.map((n) => ({ ...n, read: true })));
    await fetch("/api/notifications", { method: "POST", body: "{}" }).catch(() => {});
  };

  const enablePush = async () => {
    if (!("Notification" in window)) return;
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === "granted") toast.success("Push notifications enabled");
  };

  return (
    <div ref={ref} className='relative'>
      <button
        type='button'
        onClick={() => setOpen((v) => !v)}
        className='relative grid size-10 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'
        aria-label={`Notifications${unread ? ` (${unread} unread)` : ""}`}
      >
        {unread ? <BellRingIcon className='size-5' /> : <BellIcon className='size-5' />}
        {unread > 0 && (
          <span className='absolute top-1.5 right-1.5 grid min-w-4 place-items-center rounded-full bg-high px-1 text-[10px] font-semibold text-white'>
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className='absolute right-0 z-50 mt-2 w-[22rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border bg-popover shadow-xl animate-in fade-in-0 zoom-in-95'>
          <div className='flex items-center justify-between border-b px-4 py-3'>
            <p className='text-sm font-semibold'>Notifications</p>
            {unread > 0 && (
              <button onClick={markAll} className='flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground'>
                <CheckCheckIcon className='size-3.5' /> Mark all read
              </button>
            )}
          </div>

          {permission === "default" && (
            <button
              onClick={enablePush}
              className='flex w-full items-center gap-2 border-b bg-brand-soft/60 px-4 py-2.5 text-left text-xs font-medium text-brand hover:bg-brand-soft'
            >
              <BellRingIcon className='size-3.5' /> Enable browser push for urgent mail
            </button>
          )}

          <div className='max-h-96 overflow-y-auto'>
            {items.length === 0 ? (
              <p className='px-4 py-10 text-center text-sm text-muted-foreground'>
                You&apos;re all caught up.
              </p>
            ) : (
              items.map((n) => (
                <a
                  key={n.id}
                  href={n.emailId ? `/dashboard?id=${n.emailId}` : "/dashboard"}
                  className={cn(
                    "flex gap-3 border-b px-4 py-3 last:border-0 hover:bg-muted/60",
                    !n.read && "bg-muted/30",
                  )}
                >
                  <span
                    className={cn(
                      "mt-1.5 size-2 shrink-0 rounded-full",
                      n.priority === "high" ? "bg-high" : n.priority === "medium" ? "bg-medium" : "bg-low",
                    )}
                  />
                  <span className='min-w-0'>
                    <span className='block truncate text-sm font-medium'>{n.title}</span>
                    <span className='block text-xs leading-snug text-muted-foreground'>{n.body}</span>
                  </span>
                </a>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
