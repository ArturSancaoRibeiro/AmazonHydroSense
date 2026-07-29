"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

type CountUpProps = {
  value: number;
  decimals?: number;
};

/*
  Counts from 0 to the final reading when the metric enters the viewport, so
  the number reads as live data. Server-renders the final value, so it is
  correct without JS and under prefers-reduced-motion.
*/
export function CountUp({ value, decimals = 0 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce || !inView) return;
    const controls = animate(0, value, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = v.toFixed(decimals);
      },
    });
    return () => controls.stop();
  }, [inView, reduce, value, decimals]);

  return <span ref={ref}>{value.toFixed(decimals)}</span>;
}
