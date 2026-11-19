import { PlusIcon } from "lucide-react";

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className='mx-auto max-w-2xl divide-y rounded-2xl border bg-card'>
      {items.map(({ q, a }) => (
        <details key={q} className='group px-6 py-5 [&_summary::-webkit-details-marker]:hidden'>
          <summary className='flex cursor-pointer list-none items-center justify-between gap-4 font-medium'>
            {q}
            <PlusIcon className='size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-45' />
          </summary>
          <p className='mt-3 text-sm leading-relaxed text-muted-foreground'>{a}</p>
        </details>
      ))}
    </div>
  );
}
