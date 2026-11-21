/**
 * Re-mounts on every navigation inside the app, giving each page a quick,
 * CSS-only entrance. (Native view transitions abort with an InvalidStateError
 * when a refresh lands while the tab is hidden, so they are not used.)
 */
export default function AppTemplate({ children }: { children: React.ReactNode }) {
  return <div className='page-enter h-full'>{children}</div>;
}
