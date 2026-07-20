import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import { SidebarNav } from "@/components/sidebar-nav";
import { ZapIcon, ChevronRight } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, has } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses[0].emailAddress ?? "";
  const name = clerkUser?.fullName ?? "";

  const isPaidUser = has({ plan: "pro_plan" });

  return (
    <div className='layout-wrapper flex min-h-screen bg-background'>
      {/* Premium Sidebar */}
      <aside className='sidebar-container w-64 border-r border-border/40 bg-card flex flex-col sticky top-0 h-screen shrink-0 overflow-y-auto'>
        <div className='sidebar-inner flex flex-col h-full'>
          {/* Workspace Name & Logo Header */}
          <div className='logo-container h-16 border-b border-border/40 flex items-center px-6 gap-2'>
            <Link href='/' className='flex items-center gap-2 group'>
              <div className='h-7 w-7 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-black text-sm'>
                E
              </div>
              <span className='logo-text text-sm font-bold tracking-tight text-foreground'>
                ExecOS Workspace
              </span>
            </Link>
          </div>

          {/* Sidebar Menu Nav */}
          <SidebarNav />

          {/* Upgrade Banner for Non-Paid Users */}
          {!isPaidUser && (
            <div className='sidebar-section px-4 py-4 border-t border-border/40'>
              <div className='upgrade-card bg-primary/5 border border-primary/20 rounded-xl p-4 space-y-3 shadow-sm hover:bg-primary/[0.08] transition-colors duration-200'>
                <div className='upgrade-card-header flex items-center gap-2 text-primary'>
                  <ZapIcon className='h-4 w-4 fill-primary/20' />
                  <span className='text-xs font-semibold uppercase tracking-wider'>
                    Upgrade to Pro
                  </span>
                </div>
                <p className='upgrade-card-text text-xs text-muted-foreground leading-relaxed'>
                  Activate autonomous AI agents to automate your executive
                  workflow.
                </p>
                <Link href='/#pricing' className='block'>
                  <Button
                    variant='default'
                    size='sm'
                    className='w-full text-xs font-medium gap-1'
                  >
                    Upgrade Now <ChevronRight className='h-3 w-3' />
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* User Profile Footer */}
          <div className='sidebar-section p-4 border-t border-border/40 bg-muted/10 mt-auto'>
            <div className='user-profile flex items-center justify-between gap-3 bg-muted/40 p-2.5 rounded-xl border border-border/60'>
              <div className='flex items-center gap-2.5 min-w-0'>
                <div className='h-8 w-8 flex items-center justify-center'>
                  <UserButton />
                </div>
                <div className='flex flex-col min-w-0 text-left'>
                  <span className='text-xs font-semibold text-foreground truncate'>
                    {name || "User"}
                  </span>
                  <span className='text-[10px] text-muted-foreground truncate'>
                    {email}
                  </span>
                </div>
              </div>
              {isPaidUser && (
                <Badge
                  variant='secondary'
                  className='text-[9px] bg-primary/10 text-primary hover:bg-primary/20 border-none font-bold uppercase py-0 px-1.5 shrink-0'
                >
                  Pro
                </Badge>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className='main-content flex-1 bg-background/50 min-w-0'>
        <div className='main-content-inner mx-auto max-w-5xl px-6 py-8 md:px-8'>
          {children}
        </div>
      </main>
    </div>
  );
}
