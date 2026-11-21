"use client";

import { useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { PanelLeftIcon, SearchIcon, XIcon, ZapIcon } from "lucide-react";
import { RunAgentButton } from "@/components/run-agent-button";
import { cn } from "@/lib/utils";
import { NotificationBell } from "./notification-bell";
import { useShell } from "./shell";

const VIEW_TITLES: Record<string, string> = {
  inbox: "Inbox",
  high: "High priority",
  reply: "Needs reply",
  drafts: "Drafted",
  scheduled: "Scheduled",
};

function useTitle() {
  const pathname = usePathname();
  const params = useSearchParams();
  if (pathname === "/monitoring") return "Activity";
  if (pathname === "/settings") return "Settings";
  if (params.get("id")) return "Message";
  if (params.get("q")) return "Search";
  const cat = params.get("cat");
  if (cat) return cat.charAt(0).toUpperCase() + cat.slice(1);
  const view = params.get("view");
  if (view) return VIEW_TITLES[view] ?? "Inbox";
  if (params.get("p")) return "Inbox";
  return "Overview";
}

export function Topbar({ isPro }: { isPro: boolean }) {
  const { toggle } = useShell();
  const title = useTitle();
  const router = useRouter();
  const params = useSearchParams();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState(params.get("q") ?? "");
  const input = useRef<HTMLInputElement>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/dashboard?view=inbox&q=${encodeURIComponent(q)}` : "/dashboard?view=inbox");
  };

  return (
    <header className='sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b bg-background/80 px-3 backdrop-blur-xl sm:px-5'>
      <button
        type='button'
        onClick={toggle}
        className='press grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground'
        aria-label='Toggle sidebar'
      >
        <PanelLeftIcon className='size-[18px]' />
      </button>
      <span className='h-6 w-px bg-border' />
      <h1
        key={title}
        className={cn(
          "truncate text-[17px] font-semibold tracking-tight animate-in fade-in-0 slide-in-from-left-1 duration-300",
          searchOpen && "max-sm:hidden",
        )}
      >
        {title}
      </h1>
      {isPro ? (
        <span className='rounded-full bg-brand/10 px-2 py-0.5 text-[11px] font-semibold text-brand max-sm:hidden'>
          Pro
        </span>
      ) : (
        <Link
          href='/pricing'
          className='press group inline-flex h-7 shrink-0 items-center gap-1 rounded-full border border-brand/25 bg-brand/10 px-2.5 text-xs font-semibold text-brand transition-colors hover:bg-brand hover:text-brand-foreground'
        >
          <ZapIcon className='size-3 fill-current transition-transform group-hover:scale-110' />
          <span className='max-sm:hidden'>Upgrade to Pro</span>
          <span className='sm:hidden'>Pro</span>
        </Link>
      )}

      <div className='ml-auto flex items-center gap-1.5'>
        <form
          onSubmit={submit}
          className={cn(
            "flex h-9 items-center overflow-hidden rounded-lg border bg-background transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus-within:border-foreground/20 focus-within:ring-3 focus-within:ring-foreground/5",
            searchOpen ? "w-52 sm:w-72" : "w-9 border-transparent",
          )}
        >
          <button
            type='button'
            onClick={() => {
              setSearchOpen(true);
              requestAnimationFrame(() => input.current?.focus());
            }}
            className='grid size-9 shrink-0 place-items-center text-muted-foreground hover:text-foreground'
            aria-label='Search mail'
          >
            <SearchIcon className='size-4' />
          </button>
          <input
            ref={input}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && setSearchOpen(false)}
            placeholder='Search mail…'
            tabIndex={searchOpen ? 0 : -1}
            className='h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground'
          />
          {searchOpen && (
            <button
              type='button'
              onClick={() => {
                setSearchOpen(false);
                setQuery("");
              }}
              className='grid size-9 shrink-0 place-items-center text-muted-foreground hover:text-foreground'
              aria-label='Close search'
            >
              <XIcon className='size-3.5' />
            </button>
          )}
        </form>

        <RunAgentButton variant='outline' label='Sync inbox' className='max-md:hidden' />
        <NotificationBell />
      </div>
    </header>
  );
}
