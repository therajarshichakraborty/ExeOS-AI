import { cn } from "@/lib/utils";

/**
 * Shimmering placeholders shaped like each real page, so loading feels like
 * the page assembling itself rather than a blank screen.
 */
export function Bone({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <div className={cn("skeleton rounded-md", className)} style={style} aria-hidden />;
}

function Shell({ children, label, className }: { children: React.ReactNode; label: string; className?: string }) {
  return (
    <div
      role='status'
      aria-busy='true'
      aria-label={label}
      className={cn("mx-auto w-full max-w-[1400px] animate-in fade-in-0 duration-200 px-4 py-8 sm:px-8 sm:py-10", className)}
    >
      {children}
      <span className='sr-only'>{label}</span>
    </div>
  );
}

function PageHeading({ action = true, sub = "w-80" }: { action?: boolean; sub?: string }) {
  return (
    <div className='flex flex-col justify-between gap-5 sm:flex-row sm:items-end'>
      <div className='space-y-3'>
        <Bone className='h-8 w-64 rounded-lg' />
        <Bone className={cn("h-4 max-w-[70vw] rounded-full", sub)} />
      </div>
      {action && <Bone className='h-11 w-36 rounded-xl' />}
    </div>
  );
}

function StatCard() {
  return (
    <div className='space-y-5 rounded-2xl border bg-card p-6'>
      <div className='flex items-start justify-between'>
        <Bone className='h-4 w-28 rounded-full' />
        <Bone className='size-10 rounded-xl' />
      </div>
      <Bone className='h-9 w-16 rounded-lg' />
      <Bone className='h-3 w-40 rounded-full' />
    </div>
  );
}

function CardHeader({ border = false }: { border?: boolean }) {
  return (
    <div className={cn("space-y-2", border && "border-b p-6")}>
      <Bone className='h-5 w-44 rounded-full' />
      <Bone className='h-3 w-64 rounded-full' />
    </div>
  );
}

/* ------------------------------------------------------------ dashboard */

export function OverviewSkeleton() {
  return (
    <Shell label='Loading overview' className='space-y-6'>
      <PageHeading />
      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        {[0, 1, 2, 3].map((i) => (
          <StatCard key={i} />
        ))}
      </div>
      <div className='grid gap-4 lg:grid-cols-[1fr_1.25fr]'>
        <div className='space-y-6 rounded-2xl border bg-card p-6'>
          <CardHeader />
          <Bone className='h-2.5 w-full rounded-full' />
          <div className='space-y-4'>
            {[0, 1, 2].map((i) => (
              <div key={i} className='flex items-center gap-3'>
                <Bone className='size-2.5 rounded-full' />
                <Bone className='h-4 w-32 rounded-full' />
                <Bone className='ml-auto h-4 w-8 rounded-full' />
                <Bone className='h-4 w-10 rounded-full' />
              </div>
            ))}
          </div>
        </div>
        <div className='overflow-hidden rounded-2xl border bg-card'>
          <CardHeader border />
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className='space-y-2.5 border-b px-6 py-4 last:border-0'>
              <div className='flex justify-between gap-4'>
                <Bone className='h-4 rounded-full' style={{ width: `${55 - i * 7}%` }} />
                <Bone className='h-3.5 w-20 rounded-full' />
              </div>
              <Bone className='h-3.5 rounded-full' style={{ width: `${80 - i * 9}%` }} />
            </div>
          ))}
        </div>
      </div>
      <div className='grid gap-4 lg:grid-cols-[1.25fr_1fr]'>
        <div className='space-y-6 rounded-2xl border bg-card p-6'>
          <CardHeader />
          <div className='flex h-44 items-end gap-1.5'>
            {Array.from({ length: 14 }, (_, i) => (
              <Bone key={i} className='flex-1 rounded-t-[4px] rounded-b-none' style={{ height: `${20 + ((i * 37) % 70)}%` }} />
            ))}
          </div>
        </div>
        <div className='overflow-hidden rounded-2xl border bg-card'>
          <CardHeader border />
          {[0, 1, 2].map((i) => (
            <div key={i} className='flex items-center gap-4 border-b px-6 py-4 last:border-0'>
              <Bone className='size-2.5 rounded-full' />
              <div className='flex-1 space-y-2'>
                <Bone className='h-4 w-3/4 rounded-full' />
                <Bone className='h-3 w-1/2 rounded-full' />
              </div>
              <Bone className='h-3 w-14 rounded-full' />
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}

export function InboxSkeleton() {
  return (
    <Shell label='Loading inbox'>
      <div className='flex flex-col justify-between gap-5 sm:flex-row sm:items-end'>
        <div className='space-y-3'>
          <Bone className='h-8 w-44 rounded-lg' />
          <Bone className='h-4 w-60 rounded-full' />
        </div>
        <Bone className='h-10 w-80 max-w-full rounded-xl' />
      </div>
      <div className='mt-6 overflow-hidden rounded-2xl border bg-card'>
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className='flex items-center gap-3 border-b px-5 py-4 last:border-0'>
            <Bone className='size-2 rounded-full' />
            <Bone className='size-4 rounded' />
            <Bone className='h-4 w-36 rounded-full max-sm:w-24' />
            <Bone className='h-4 flex-1 rounded-full' style={{ maxWidth: `${70 - (i % 4) * 9}%` }} />
            <Bone className='ml-auto hidden h-5 w-16 rounded-full lg:block' />
            <Bone className='h-3.5 w-12 rounded-full' />
          </div>
        ))}
      </div>
    </Shell>
  );
}

export function EmailSkeleton() {
  return (
    <div role='status' aria-busy='true' aria-label='Loading email' className='animate-in fade-in-0 duration-200'>
      <div className='flex items-center justify-between border-b px-4 py-3'>
        <Bone className='h-7 w-20 rounded-lg' />
        <Bone className='h-7 w-28 rounded-lg' />
      </div>
      <div className='mx-auto w-full max-w-3xl space-y-6 px-5 py-8 sm:px-6'>
        <div className='space-y-4'>
          <Bone className='h-8 w-4/5 rounded-lg' />
          <div className='flex items-center gap-3'>
            <Bone className='size-10 rounded-full' />
            <div className='space-y-2'>
              <Bone className='h-4 w-56 rounded-full' />
              <Bone className='h-3 w-32 rounded-full' />
            </div>
          </div>
        </div>
        <Bone className='h-14 w-full rounded-2xl' />
        <div className='space-y-3 rounded-2xl border p-5'>
          <Bone className='h-3 w-24 rounded-full' />
          <Bone className='h-4 w-full rounded-full' />
          <Bone className='h-4 w-11/12 rounded-full' />
          <Bone className='h-4 w-2/3 rounded-full' />
        </div>
        <div className='space-y-3 border-t pt-6'>
          {[92, 100, 85, 96, 60].map((w, i) => (
            <Bone key={i} className='h-4 rounded-full' style={{ width: `${w}%` }} />
          ))}
        </div>
      </div>
      <span className='sr-only'>Loading email</span>
    </div>
  );
}

export function ActivitySkeleton() {
  return (
    <Shell label='Loading activity' className='space-y-6'>
      <PageHeading />
      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        {[0, 1, 2, 3].map((i) => (
          <StatCard key={i} />
        ))}
      </div>
      <div className='overflow-hidden rounded-2xl border bg-card'>
        <CardHeader border />
        <div className='space-y-2 p-6'>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className='flex gap-5 py-3'>
              <Bone className='mt-1 size-4 rounded-full' />
              <div className='flex-1 space-y-2.5'>
                <Bone className='h-4 rounded-full' style={{ width: `${60 - i * 6}%` }} />
                <div className='flex gap-2'>
                  <Bone className='h-6 w-20 rounded-md' />
                  <Bone className='h-6 w-20 rounded-md' />
                  <Bone className='h-6 w-20 rounded-md' />
                </div>
              </div>
              <Bone className='h-3.5 w-28 rounded-full' />
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}

export function SettingsSkeleton() {
  return (
    <Shell label='Loading settings' className='max-w-5xl'>
      <div className='space-y-3'>
        <Bone className='h-8 w-40 rounded-lg' />
        <Bone className='h-4 w-72 rounded-full' />
      </div>
      {[2, 2, 1].map((rows, s) => (
        <div key={s} className='grid gap-4 border-t py-8 first-of-type:border-t-0 lg:grid-cols-[280px_1fr] lg:gap-10'>
          <div className='space-y-2'>
            <Bone className='h-4 w-28 rounded-full' />
            <Bone className='h-3 w-56 rounded-full' />
          </div>
          <div className='overflow-hidden rounded-2xl border bg-card'>
            {Array.from({ length: rows }, (_, i) => (
              <div key={i} className='flex items-center gap-4 border-b p-5 last:border-0'>
                <Bone className='size-11 rounded-xl' />
                <div className='flex-1 space-y-2'>
                  <Bone className='h-4 w-32 rounded-full' />
                  <Bone className='h-3 w-3/4 rounded-full' />
                </div>
                <Bone className='h-8 w-24 rounded-full' />
              </div>
            ))}
          </div>
        </div>
      ))}
    </Shell>
  );
}

/* ------------------------------------------------------------ marketing */

export function MarketingSkeleton() {
  return (
    <div role='status' aria-busy='true' aria-label='Loading page' className='animate-in fade-in-0 duration-200'>
      <div className='mx-auto max-w-4xl space-y-6 px-5 pt-24 pb-20 text-center sm:pt-28'>
        <Bone className='mx-auto h-7 w-40 rounded-full' />
        <Bone className='mx-auto h-14 w-11/12 rounded-2xl' />
        <Bone className='mx-auto h-14 w-3/4 rounded-2xl' />
        <Bone className='mx-auto h-5 w-2/3 rounded-full' />
        <div className='flex justify-center gap-3 pt-4'>
          <Bone className='h-12 w-40 rounded-2xl' />
          <Bone className='h-12 w-40 rounded-2xl' />
        </div>
      </div>
      <div className='mx-auto grid max-w-7xl gap-4 px-5 pb-24 sm:grid-cols-2 lg:grid-cols-3'>
        {[0, 1, 2].map((i) => (
          <div key={i} className='space-y-4 rounded-3xl border bg-card p-7'>
            <Bone className='size-11 rounded-xl' />
            <Bone className='h-5 w-2/3 rounded-full' />
            <Bone className='h-3.5 w-full rounded-full' />
            <Bone className='h-3.5 w-4/5 rounded-full' />
          </div>
        ))}
      </div>
      <span className='sr-only'>Loading page</span>
    </div>
  );
}

/* ------------------------------------------------------------ auth */

export function AuthFormSkeleton() {
  return (
    <div role='status' aria-busy='true' aria-label='Loading sign-in' className='w-full space-y-7 py-2'>
      <div className='space-y-3'>
        <Bone className='h-8 w-56 rounded-lg' />
        <Bone className='h-4 w-72 max-w-full rounded-full' />
      </div>
      <Bone className='h-11 w-full rounded-xl' />
      <div className='flex items-center gap-3'>
        <Bone className='h-px flex-1' />
        <Bone className='h-3 w-6 rounded-full' />
        <Bone className='h-px flex-1' />
      </div>
      <div className='space-y-2'>
        <Bone className='h-3.5 w-24 rounded-full' />
        <Bone className='h-11 w-full rounded-xl' />
      </div>
      <Bone className='h-11 w-full rounded-xl' />
      <Bone className='h-4 w-52 rounded-full' />
      <span className='sr-only'>Loading sign-in</span>
    </div>
  );
}
