import { Suspense } from "react";
import Link from "next/link";
import { AppSidebar } from "@/components/app/sidebar";
import { Topbar } from "@/components/app/topbar";
import { RunAgentButton } from "@/components/run-agent-button";
import { getInbox, getSessionUser } from "@/lib/inbox";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isPro } = await getSessionUser();
  const { counts } = await getInbox(user.id);

  return (
    <div className='relative min-h-screen bg-surface'>
      <div className='spotlight pointer-events-none fixed inset-x-0 top-0 h-96 opacity-60' />
      <div className='relative'>
        <Topbar isPro={isPro} />

        {/* Mobile nav */}
        <div className='flex items-center gap-2 overflow-x-auto px-4 pb-3 md:hidden'>
          <RunAgentButton className='h-9 shrink-0 rounded-full px-4' label='Run' />
          {[
            ["/dashboard", "Inbox"],
            ["/dashboard?view=high", "High"],
            ["/dashboard?view=reply", "Reply"],
            ["/monitoring", "Activity"],
            ["/settings", "Settings"],
          ].map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className='shrink-0 rounded-full border bg-card px-3.5 py-1.5 text-sm'
            >
              {label}
            </Link>
          ))}
        </div>

        <div className='flex gap-2 pr-4 pb-4 max-md:pl-4'>
          <Suspense fallback={<div className='w-64 shrink-0 max-md:hidden' />}>
            <AppSidebar
              counts={counts}
              isPro={isPro}
              className='sticky top-4 h-[calc(100vh-6rem)] max-md:hidden'
            />
          </Suspense>
          <main className='min-h-[calc(100vh-5rem)] min-w-0 flex-1 overflow-hidden rounded-2xl border bg-card shadow-xs'>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
