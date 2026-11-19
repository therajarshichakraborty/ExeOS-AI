"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  ActivityIcon,
  AlertCircleIcon,
  CalendarCheckIcon,
  InboxIcon,
  PenLineIcon,
  ReplyIcon,
  SettingsIcon,
  ZapIcon,
} from "lucide-react";
import { RunAgentButton } from "@/components/run-agent-button";
import { cn } from "@/lib/utils";

export interface SidebarCounts {
  all: number;
  high: number;
  reply: number;
  drafts: number;
  scheduled: number;
}

const CATEGORIES = [
  { key: "work", label: "Work", dot: "bg-brand" },
  { key: "finance", label: "Finance", dot: "bg-medium" },
  { key: "personal", label: "Personal", dot: "bg-low" },
  { key: "newsletter", label: "Newsletters", dot: "bg-muted-foreground/50" },
  { key: "promotion", label: "Promotions", dot: "bg-high/70" },
];

export function AppSidebar({
  counts,
  isPro,
  className,
}: {
  counts: SidebarCounts;
  isPro: boolean;
  className?: string;
}) {
  const pathname = usePathname();
  const params = useSearchParams();
  const view = params.get("view");
  const cat = params.get("cat");
  const onInbox = pathname === "/dashboard";

  const items = [
    { href: "/dashboard", label: "Inbox", icon: InboxIcon, count: counts.all, active: onInbox && !view && !cat },
    { href: "/dashboard?view=high", label: "High priority", icon: AlertCircleIcon, count: counts.high, active: onInbox && view === "high" },
    { href: "/dashboard?view=reply", label: "Needs reply", icon: ReplyIcon, count: counts.reply, active: onInbox && view === "reply" },
    { href: "/dashboard?view=drafts", label: "Drafted", icon: PenLineIcon, count: counts.drafts, active: onInbox && view === "drafts" },
    { href: "/dashboard?view=scheduled", label: "Scheduled", icon: CalendarCheckIcon, count: counts.scheduled, active: onInbox && view === "scheduled" },
    { href: "/monitoring", label: "Activity", icon: ActivityIcon, active: pathname === "/monitoring" },
    { href: "/settings", label: "Settings", icon: SettingsIcon, active: pathname === "/settings" },
  ];

  return (
    <aside className={cn("flex w-64 shrink-0 flex-col gap-1 pr-3", className)}>
      <RunAgentButton className='mb-4 ml-1 self-start' />

      <nav className='space-y-0.5'>
        {items.map(({ href, label, icon: Icon, count, active }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex h-9 items-center gap-4 rounded-r-full pr-4 pl-5 text-sm transition-colors",
              active
                ? "bg-accent font-semibold text-accent-foreground"
                : "text-foreground/80 hover:bg-muted",
            )}
          >
            <Icon className='size-4 shrink-0' />
            <span className='flex-1 truncate'>{label}</span>
            {!!count && <span className='text-xs tabular-nums'>{count}</span>}
          </Link>
        ))}
      </nav>

      <p className='mt-6 mb-1 pl-5 text-sm font-medium'>Labels</p>
      <nav className='space-y-0.5'>
        {CATEGORIES.map((c) => (
          <Link
            key={c.key}
            href={`/dashboard?cat=${c.key}`}
            className={cn(
              "flex h-8 items-center gap-4 rounded-r-full pr-4 pl-5 text-sm transition-colors",
              onInbox && cat === c.key
                ? "bg-accent font-semibold text-accent-foreground"
                : "text-foreground/80 hover:bg-muted",
            )}
          >
            <span className={cn("size-2.5 rounded-full", c.dot)} />
            {c.label}
          </Link>
        ))}
      </nav>

      {!isPro && (
        <Link
          href='/pricing'
          className='group mt-auto ml-2 rounded-2xl border bg-card p-4 transition-shadow hover:shadow-md'
        >
          <span className='flex items-center gap-2 text-xs font-semibold text-brand'>
            <ZapIcon className='size-3.5' /> Upgrade to Pro
          </span>
          <span className='mt-1 block text-xs leading-relaxed text-muted-foreground'>
            Background runs, Gmail drafts and push alerts.
          </span>
        </Link>
      )}
    </aside>
  );
}
