"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Thin multi-hue progress bar along the top of the window. Starts the moment
 * an internal link is clicked and completes when the new route renders, so
 * every navigation gets instant feedback even while server data loads.
 */
export function NavProgress() {
  const pathname = usePathname();
  const search = useSearchParams();
  const route = `${pathname}?${search}`;
  const [state, setState] = useState<{ phase: "idle" | "loading" | "done"; from: string }>({
    phase: "idle",
    from: route,
  });

  // Route changed while loading -> finish the bar.
  if (state.phase === "loading" && state.from !== route) {
    setState({ phase: "done", from: route });
  }

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement | null)?.closest("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname && url.search === location.search) return;
      if (url.pathname.startsWith("/api/")) return;
      setState({ phase: "loading", from: `${location.pathname}?${location.search.slice(1)}` });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  useEffect(() => {
    if (state.phase !== "done") return;
    const id = setTimeout(() => setState((s) => ({ ...s, phase: "idle" })), 350);
    return () => clearTimeout(id);
  }, [state.phase]);

  if (state.phase === "idle") return null;

  return (
    <div className='pointer-events-none fixed inset-x-0 top-0 z-[100] h-[2.5px] overflow-hidden' aria-hidden>
      <div
        className='h-full origin-left'
        style={{
          background: "linear-gradient(90deg, #1d4ed8, #3b82f6, #93c5fd)",
          animation:
            state.phase === "loading"
              ? "nav-progress 8s cubic-bezier(0.1,0.7,0.2,1) forwards"
              : "nav-progress-done 320ms cubic-bezier(0.22,1,0.36,1) forwards",
        }}
      />
    </div>
  );
}
