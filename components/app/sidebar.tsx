"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { SignOutButton, UserButton } from "@clerk/nextjs";
import {
  ActivityIcon,
  AlertCircleIcon,
  CalendarCheckIcon,
  InboxIcon,
  LayoutGridIcon,
  LogOutIcon,
  PenLineIcon,
  RefreshCwIcon,
  ReplyIcon,
  SearchIcon,
  SettingsIcon,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

export interface SidebarCounts {
  all: number;
  high: number;
  reply: number;
  drafts: number;
  scheduled: number;
}

const CATEGORY_DOTS: Record<string, string> = {
  work: "bg-brand",
  finance: "bg-foreground/70",
  personal: "bg-foreground/50",
  newsletter: "bg-foreground/30",
  promotion: "bg-foreground/20",
  social: "bg-foreground/40",
};

export function AppSidebar({
  counts,
  categories,
  name,
  email,
}: {
  counts: SidebarCounts;
  categories: { key: string; count: number }[];
  name: string;
  email: string;
}) {
  const pathname = usePathname();
  const params = useSearchParams();
  const router = useRouter();
  const [filter, setFilter] = useState("");
  const [refreshing, startRefresh] = useTransition();

  const view = params.get("view");
  const cat = params.get("cat");
  const onDash = pathname === "/dashboard";
  const isOverview = onDash && !params.toString();

  const primary = [
    { href: "/dashboard", label: "Overview", icon: LayoutGridIcon, active: isOverview },
    { href: "/dashboard?view=inbox", label: "Inbox", icon: InboxIcon, count: counts.all, active: onDash && view === "inbox" },
    { href: "/monitoring", label: "Activity", icon: ActivityIcon, active: pathname === "/monitoring" },
    { href: "/settings", label: "Settings", icon: SettingsIcon, active: pathname === "/settings" },
  ];

  const views = [
    { href: "/dashboard?view=high", label: "High priority", icon: AlertCircleIcon, count: counts.high, active: onDash && view === "high" },
    { href: "/dashboard?view=reply", label: "Needs reply", icon: ReplyIcon, count: counts.reply, active: onDash && view === "reply" },
    { href: "/dashboard?view=drafts", label: "Drafted", icon: PenLineIcon, count: counts.drafts, active: onDash && view === "drafts" },
    { href: "/dashboard?view=scheduled", label: "Scheduled", icon: CalendarCheckIcon, count: counts.scheduled, active: onDash && view === "scheduled" },
    ...categories.map((c) => ({
      href: `/dashboard?cat=${c.key}`,
      label: c.key.charAt(0).toUpperCase() + c.key.slice(1),
      dot: CATEGORY_DOTS[c.key] ?? "bg-muted-foreground/50",
      count: c.count,
      active: onDash && cat === c.key,
    })),
  ];

  const q = filter.trim().toLowerCase();
  const filtered = q ? views.filter((v) => v.label.toLowerCase().includes(q)) : views;

  return (
    <aside className='flex h-full flex-col px-3 py-5'>
      <Logo href='/dashboard' className='px-3' />

      <nav className='mt-7 space-y-1'>
        {primary.map(({ href, label, icon: Icon, count, active }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "group relative flex h-10 items-center gap-3 rounded-xl px-3 text-[15px] transition-all duration-200",
              active
                ? "bg-background font-semibold text-foreground shadow-[0_1px_3px_oklch(0.2_0.02_262/0.08)] ring-1 ring-border"
                : "text-foreground/75 hover:bg-background/70 hover:text-foreground",
            )}
          >
            <Icon
              className={cn(
                "size-[18px] shrink-0 transition-transform duration-300 group-hover:scale-110",
                active ? "text-foreground" : "text-muted-foreground group-hover:text-foreground",
              )}
            />
            <span className='flex-1 truncate'>{label}</span>
            {!!count && (
              <span className='rounded-md bg-muted px-1.5 text-xs text-muted-foreground tabular-nums'>{count}</span>
            )}
          </Link>
        ))}
      </nav>

      <div className='mx-3 my-5 h-px bg-border' />

      <div className='flex items-center justify-between px-3'>
        <p className='text-sm text-muted-foreground'>
          Views <span className='ml-1 tabular-nums'>{views.length}</span>
        </p>
        <button
          type='button'
          onClick={() => startRefresh(() => router.refresh())}
          className='press grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-background hover:text-foreground'
          aria-label='Refresh'
          title='Refresh'
        >
          <RefreshCwIcon className={cn("size-4", refreshing && "animate-spin")} />
        </button>
      </div>

      <label className='mx-1 mt-2 flex h-10 items-center gap-2 rounded-xl border bg-background px-3 text-muted-foreground transition-all focus-within:border-foreground/20 focus-within:ring-3 focus-within:ring-foreground/5'>
        <SearchIcon className='size-4 shrink-0' />
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder='Filter views'
          className='h-full w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground'
        />
      </label>

      <nav className='thin-scrollbar mt-3 min-h-0 flex-1 space-y-0.5 overflow-y-auto'>
        {filtered.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group flex h-9 items-center gap-3 rounded-lg px-3 text-sm transition-colors duration-200",
              item.active
                ? "bg-background font-semibold text-foreground ring-1 ring-border"
                : "text-foreground/80 hover:bg-background/70 hover:text-foreground",
            )}
          >
            {"icon" in item && item.icon ? (
              <item.icon className={cn("size-4 shrink-0", item.active ? "text-foreground" : "text-muted-foreground")} />
            ) : (
              <span className={cn("ml-1 size-2 shrink-0 rounded-full transition-transform group-hover:scale-125", "dot" in item ? item.dot : "")} />
            )}
            <span className='flex-1 truncate'>{item.label}</span>
            {!!item.count && <span className='text-xs text-muted-foreground tabular-nums'>{item.count}</span>}
          </Link>
        ))}
        {filtered.length === 0 && (
          <p className='px-3 py-4 text-center text-sm text-muted-foreground'>No views match “{filter}”</p>
        )}
      </nav>

      <div className='mx-1 mt-3 flex items-center gap-3 rounded-2xl p-2 transition-colors hover:bg-background'>
        <div className='grid size-10 shrink-0 place-items-center'>
          <UserButton appearance={{ elements: { avatarBox: "size-10" } }} />
        </div>
        <div className='min-w-0 flex-1'>
          <p className='truncate text-sm font-semibold'>{name || "Your account"}</p>
          <p className='truncate text-xs text-muted-foreground'>{email}</p>
        </div>
        <SignOutButton redirectUrl='/'>
          <button
            type='button'
            className='press grid size-9 shrink-0 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground'
            aria-label='Sign out'
            title='Sign out'
          >
            <LogOutIcon className='size-4' />
          </button>
        </SignOutButton>
      </div>
    </aside>
  );
}
