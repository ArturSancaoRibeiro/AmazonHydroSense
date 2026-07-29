"use client";

import { useEffect } from "react";

/*
  next.config.ts sets devIndicators: false, but in this Next.js version the
  dev overlay's disable state depends on a runtime sync message that doesn't
  always land before first paint, so the bubble can still show up. Dev-only
  belt-and-suspenders: hide just the indicator button, leave the error
  overlay untouched. Dead-code-eliminated from the production bundle since
  the branch never executes there.
*/
export function DevIndicatorHider() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    const hide = () => {
      const root = document.querySelector("nextjs-portal")?.shadowRoot;
      const indicator = root?.getElementById("devtools-indicator");
      if (indicator) indicator.style.display = "none";
    };

    hide();
    const interval = setInterval(hide, 500);
    return () => clearInterval(interval);
  }, []);

  return null;
}
