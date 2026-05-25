"use client";
/**
 * components/ScrollRestoration.tsx
 *
 * Preserves scroll position across Next.js App Router navigation.
 * - Saves scrollY to sessionStorage before route changes
 * - Restores it after the new page mounts
 * - Uses usePathname to detect route changes
 */

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function ScrollRestoration() {
  const pathname  = usePathname();
  const prevPath  = useRef<string>(pathname);
  const savedScrolls = useRef<Record<string, number>>({});

  useEffect(() => {
    // Save scroll position for the PREVIOUS route before unmounting
    const handleBeforeUnload = () => {
      savedScrolls.current[prevPath.current] = window.scrollY;
    };

    // When pathname changes, save old position and restore new one
    if (pathname !== prevPath.current) {
      // Save current scroll for the route we're leaving
      savedScrolls.current[prevPath.current] = window.scrollY;
      prevPath.current = pathname;

      // Restore scroll for the route we're arriving at
      const saved = savedScrolls.current[pathname];
      if (saved !== undefined && saved > 0) {
        // Use requestAnimationFrame to wait for page content to paint
        const restore = () => {
          window.scrollTo({ top: saved, behavior: "instant" });
        };
        // Small delay ensures the new page's DOM has rendered
        requestAnimationFrame(() => requestAnimationFrame(restore));
      } else {
        // New page — scroll to top
        window.scrollTo({ top: 0, behavior: "instant" });
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [pathname]);

  return null;
}
