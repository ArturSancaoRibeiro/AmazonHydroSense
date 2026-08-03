"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Drop,
  Lightning,
  TestTube,
  ThermometerSimple,
  Waves,
} from "@phosphor-icons/react";

/*
  Continuous marquee of the parameters every buoy reports. This is the page's
  only marquee: the list is breadth without individual weight, which is
  exactly what a marquee is for.
*/

const parameters = [
  { label: "Turbidity", unit: "NTU", Icon: Waves },
  { label: "Dissolved oxygen", unit: "mg/L", Icon: Drop },
  { label: "pH", unit: "0 to 14", Icon: TestTube },
  { label: "Conductivity", unit: "µS/cm", Icon: Lightning },
  { label: "Temperature", unit: "°C", Icon: ThermometerSimple },
];

function Track({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <ul
      className="flex shrink-0 items-center"
      aria-hidden={ariaHidden || undefined}
    >
      {parameters.map(({ label, unit, Icon }) => (
        <li
          key={label}
          className="flex items-center gap-3 whitespace-nowrap px-8 font-mono text-[12px] uppercase tracking-[0.16em] text-ink-dim"
        >
          <Icon size={16} weight="regular" className="text-accent" />
          {label}
          <span className="text-ink-muted">{unit}</span>
        </li>
      ))}
    </ul>
  );
}

export function ParameterMarquee() {
  const reduce = useReducedMotion();

  return (
    <section
      aria-label="Parameters measured by every buoy"
      className="overflow-hidden border-y border-line-soft py-5"
    >
      <motion.div
        className="flex w-max"
        animate={reduce ? undefined : { x: ["0%", "-50%"] }}
        transition={
          reduce
            ? undefined
            : { duration: 38, repeat: Infinity, ease: "linear" }
        }
      >
        <Track />
        <Track ariaHidden />
      </motion.div>
    </section>
  );
}
