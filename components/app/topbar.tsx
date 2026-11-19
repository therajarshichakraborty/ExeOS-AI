import { UserButton } from "@clerk/nextjs";
import { SearchIcon, SlidersHorizontalIcon } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { NotificationBell } from "./notification-bell";

export function Topbar({ isPro }: { isPro: boolean }) {
  return (
    <header className='flex h-16 items-center gap-4 px-4'>
      <Logo href='/dashboard' className='w-60 shrink-0 pl-2 max-md:w-auto' />

      <form action='/dashboard' className='max-w-3xl flex-1'>
        <label className='flex h-12 items-center gap-3 rounded-full bg-muted/80 px-4 text-muted-foreground transition-all focus-within:bg-card focus-within:shadow-md focus-within:ring-1 focus-within:ring-border'>
          <SearchIcon className='size-5 shrink-0' />
          <input
            name='q'
            placeholder='Search mail'
            className='h-full w-full bg-transparent text-[15px] text-foreground outline-none placeholder:text-muted-foreground'
          />
          <SlidersHorizontalIcon className='size-4 shrink-0 max-sm:hidden' />
        </label>
      </form>

      <div className='ml-auto flex items-center gap-1'>
        {isPro && (
          <span className='mr-2 rounded-full bg-brand-soft px-2.5 py-1 text-xs font-semibold text-brand max-sm:hidden'>
            Pro
          </span>
        )}
        <ThemeToggle className='size-10 max-sm:hidden' />
        <NotificationBell />
        <div className='ml-1 grid size-10 place-items-center'>
          <UserButton />
        </div>
      </div>
    </header>
  );
}
