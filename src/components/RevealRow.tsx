"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type RevealRowProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

/*
  Scroll reveal for a real table row. Keeps <tr> semantics and column
  alignment intact, which a wrapper div inside a cell would break.
*/
export function RevealRow({ children, delay = 0, className }: RevealRowProps) {
  const reduce = useReducedMotion();

  return (
    <motion.tr
      className={className}
      initial={reduce ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.tr>
  );
}
