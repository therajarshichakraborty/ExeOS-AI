/** Inbox-shaped skeleton shown while server data loads. */
export default function Loading() {
  return (
    <div className='animate-in fade-in-0' aria-busy='true' aria-label='Loading'>
      <div className='flex items-center gap-3 px-5 py-4'>
        <div className='h-4 w-24 animate-pulse rounded-full bg-muted' />
        <div className='ml-auto h-3 w-16 animate-pulse rounded-full bg-muted' />
      </div>
      <div className='flex border-b px-3'>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className='m-3 h-4 w-20 animate-pulse rounded-full bg-muted' />
        ))}
      </div>
      <ul className='divide-y'>
        {Array.from({ length: 10 }, (_, i) => (
          <li key={i} className='flex items-center gap-4 px-5 py-3.5'>
            <div className='size-2 rounded-full bg-muted' />
            <div className='h-3.5 w-36 animate-pulse rounded-full bg-muted' />
            <div
              className='h-3.5 flex-1 animate-pulse rounded-full bg-muted/70'
              style={{ animationDelay: `${i * 60}ms`, maxWidth: `${70 - (i % 4) * 10}%` }}
            />
            <div className='ml-auto h-3 w-10 animate-pulse rounded-full bg-muted' />
          </li>
        ))}
      </ul>
    </div>
  );
}
