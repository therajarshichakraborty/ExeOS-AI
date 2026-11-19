/** Re-mounts on every navigation inside the app, giving pages a soft entrance. */
export default function AppTemplate({ children }: { children: React.ReactNode }) {
  return <div className='h-full animate-fade-up'>{children}</div>;
}
