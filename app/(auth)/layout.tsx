import Link from "next/link";
import { ArrowLeftIcon, LockKeyholeIcon } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { AuthShowcase } from "@/components/auth/showcase";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='grid min-h-screen bg-background lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]'>
      {/* Form side */}
      <main className='relative flex min-h-screen flex-col px-6 py-6 sm:px-12'>
        <div className='pointer-events-none absolute -top-40 -left-40 size-[30rem] rounded-full bg-brand/10 blur-3xl' />
        <div className='pointer-events-none absolute -bottom-40 left-1/3 size-[26rem] rounded-full bg-muted blur-3xl' />

        <header className='relative flex items-center justify-between'>
          <Logo />
          <div className='flex items-center gap-1'>
            <Link
              href='/'
              className='press inline-flex h-9 items-center gap-1.5 rounded-full border bg-background px-3.5 text-sm text-muted-foreground transition-colors hover:text-foreground'
            >
              <ArrowLeftIcon className='size-3.5' /> Back to site
            </Link>
          </div>
        </header>

        <div className='relative mx-auto flex w-full max-w-[400px] flex-1 flex-col justify-center py-12'>
          <div className='animate-fade-up'>{children}</div>
        </div>

        <footer className='relative flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground'>
          <span className='flex items-center gap-1.5'>
            <LockKeyholeIcon className='size-3.5' /> Secured with encrypted Google OAuth tokens
          </span>
          <span className='flex gap-4'>
            <Link href='/security' className='hover:text-foreground'>Security</Link>
            <Link href='/pricing' className='hover:text-foreground'>Pricing</Link>
          </span>
        </footer>
      </main>

      {/* Showcase side */}
      <aside className='hidden p-3 lg:block'>
        <div className='sticky top-3 h-[calc(100vh-1.5rem)]'>
          <AuthShowcase />
        </div>
      </aside>
    </div>
  );
}
