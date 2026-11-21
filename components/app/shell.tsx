"use client";

import { createContext, useCallback, useContext, useState, useSyncExternalStore } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "exeos:sidebar-collapsed";
const EVENT = "exeos:sidebar";

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}
function readCollapsed() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

const ShellContext = createContext<{ toggle: () => void; collapsed: boolean; mobileOpen: boolean }>({
  toggle: () => {},
  collapsed: false,
  mobileOpen: false,
});

export const useShell = () => useContext(ShellContext);

/**
 * Dashboard frame: a quiet sidebar on the left and the content card on the
 * right. The sidebar collapses on desktop and becomes a drawer on mobile.
 */
export function AppShell({
  sidebar,
  children,
}: {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}) {
  const collapsed = useSyncExternalStore(subscribe, readCollapsed, () => false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const search = useSearchParams();
  const [route, setRoute] = useState(`${pathname}?${search}`);

  // Close the mobile drawer whenever the route changes.
  const current = `${pathname}?${search}`;
  if (current !== route) {
    setRoute(current);
    setMobileOpen(false);
  }

  const toggle = useCallback(() => {
    if (window.matchMedia("(max-width: 1023px)").matches) {
      setMobileOpen((v) => !v);
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, readCollapsed() ? "0" : "1");
    } catch {}
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return (
    <ShellContext.Provider value={{ toggle, collapsed, mobileOpen }}>
      <div className='flex min-h-screen bg-surface'>
        {/* Desktop sidebar */}
        <div
          className={cn(
            "sticky top-0 hidden h-screen shrink-0 overflow-hidden transition-[width,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:block",
            collapsed ? "w-0 opacity-0" : "w-[290px] opacity-100",
          )}
        >
          <div className='h-full w-[290px]'>{sidebar}</div>
        </div>

        {/* Mobile drawer */}
        <div
          className={cn(
            "fixed inset-0 z-50 lg:hidden",
            mobileOpen ? "pointer-events-auto" : "pointer-events-none",
          )}
          aria-hidden={!mobileOpen}
        >
          <div
            onClick={() => setMobileOpen(false)}
            className={cn(
              "absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300",
              mobileOpen ? "opacity-100" : "opacity-0",
            )}
          />
          <div
            className={cn(
              "absolute inset-y-0 left-0 w-[290px] max-w-[85vw] bg-surface shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
              mobileOpen ? "translate-x-0" : "-translate-x-full",
            )}
          >
            {sidebar}
          </div>
        </div>

        <div className='min-w-0 flex-1 p-2 lg:py-3 lg:pr-3 lg:pl-0'>
          <div
            className={cn(
              "flex min-h-[calc(100vh-1rem)] flex-col overflow-hidden rounded-2xl border bg-background shadow-[0_1px_3px_oklch(0.2_0.02_262/0.05)] lg:min-h-[calc(100vh-1.5rem)]",
              collapsed && "lg:ml-3",
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </ShellContext.Provider>
  );
}
