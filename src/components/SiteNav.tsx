"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/*
  Transparent over the top of the cinematic hero, then picks up a background
  once the visitor scrolls, so the logo stays readable against the video.
  The scroll handler is rAF-throttled and only sets state when the boolean
  actually flips, so it never re-renders per frame.
*/
export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const scrolledRef = useRef(false);

  useEffect(() => {
    let frame: number | null = null;

    const read = () => {
      frame = null;
      const next = window.scrollY > 24;
      if (next !== scrolledRef.current) {
        scrolledRef.current = next;
        setScrolled(next);
      }
    };

    const onScroll = () => {
      if (frame === null) frame = requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-300 ${
        scrolled
          ? "border-b border-line-soft bg-background/90 backdrop-blur-sm"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-center px-6 lg:px-10">
        <Image
          src="/brand/logo.png"
          alt="Amazon Hydro Sense"
          width={845}
          height={288}
          priority
          className="h-9 w-auto drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]"
        />
      </div>
    </header>
  );
}
