import { PlusIcon } from "lucide-react";

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className='mx-auto max-w-3xl space-y-3'>
      {items.map(({ q, a }) => (
        <details
          key={q}
          className='group rounded-2xl border bg-card px-6 py-5 transition-all duration-300 open:border-foreground/15 open:shadow-soft hover:border-foreground/15 [&_summary::-webkit-details-marker]:hidden'
        >
          <summary className='flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-semibold'>
            {q}
            <span className='grid size-8 shrink-0 place-items-center rounded-full border bg-background transition-all duration-300 group-open:rotate-45 group-open:border-foreground group-open:bg-foreground group-open:text-background'>
              <PlusIcon className='size-4' />
            </span>
          </summary>
          <p className='mt-3 pr-12 leading-relaxed text-muted-foreground animate-in fade-in-0 slide-in-from-top-1'>
            {a}
          </p>
        </details>
      ))}
    </div>
  );
}
