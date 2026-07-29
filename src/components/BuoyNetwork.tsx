"use client";

import { motion, useReducedMotion } from "framer-motion";

/*
  Buoy network diagram: the site's one hero graphic.

  Peripheral nodes are sensor buoys, the center node is the analysis engine.
  Dashes travel along each link toward the center, which is the literal thing
  the product does: readings flow from the river to the model. Two buoys
  pulse to stand for a transmission in progress.

  Positions are deliberately uneven rather than a clean radial ring, so it
  reads as stations placed along a river rather than a stock network motif.
*/

const CENTER = { x: 240, y: 240 };

const buoys = [
  { x: 74, y: 132, pulse: false, delay: 0 },
  { x: 158, y: 58, pulse: true, delay: 0.4 },
  { x: 396, y: 104, pulse: false, delay: 0.9 },
  { x: 430, y: 252, pulse: false, delay: 1.3 },
  { x: 348, y: 400, pulse: true, delay: 1.8 },
  { x: 188, y: 430, pulse: false, delay: 2.2 },
  { x: 58, y: 322, pulse: false, delay: 2.6 },
];

// Dash period is 16 units, so a 32-unit offset sweep loops seamlessly.
const DASH_PERIOD = 32;

export function BuoyNetwork() {
  const reduce = useReducedMotion();

  return (
    <div className="relative w-full">
      <svg
        viewBox="0 0 480 480"
        className="h-auto w-full"
        role="img"
        aria-label="Diagram of seven sensor buoys transmitting readings to a central analysis node"
      >
        <defs>
          <radialGradient id="core-glow">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.34" />
            <stop offset="55%" stopColor="#34d399" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient glow behind the analysis node */}
        <circle cx={CENTER.x} cy={CENTER.y} r={168} fill="url(#core-glow)" />

        {/* Links: a faint static rail plus a travelling dash overlay */}
        {buoys.map((buoy, i) => (
          <g key={`link-${i}`}>
            <line
              x1={buoy.x}
              y1={buoy.y}
              x2={CENTER.x}
              y2={CENTER.y}
              stroke="#34d399"
              strokeOpacity={0.16}
              strokeWidth={1}
            />
            <motion.line
              x1={buoy.x}
              y1={buoy.y}
              x2={CENTER.x}
              y2={CENTER.y}
              stroke="#34d399"
              strokeOpacity={0.85}
              strokeWidth={1.4}
              strokeLinecap="round"
              strokeDasharray="3 13"
              initial={{ strokeDashoffset: DASH_PERIOD }}
              animate={{ strokeDashoffset: 0 }}
              transition={
                reduce
                  ? { duration: 0 }
                  : {
                      duration: 2.4 + i * 0.22,
                      repeat: Infinity,
                      ease: "linear",
                    }
              }
            />
          </g>
        ))}

        {/* Buoy nodes */}
        {buoys.map((buoy, i) => (
          <g key={`node-${i}`}>
            {buoy.pulse && !reduce && (
              <motion.circle
                cx={buoy.x}
                cy={buoy.y}
                r={5}
                fill="none"
                stroke="#34d399"
                strokeWidth={1.2}
                initial={{ scale: 1, opacity: 0.7 }}
                animate={{ scale: 3.2, opacity: 0 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: buoy.delay,
                }}
                style={{ transformOrigin: `${buoy.x}px ${buoy.y}px` }}
              />
            )}
            <circle
              cx={buoy.x}
              cy={buoy.y}
              r={5}
              fill="#0a0a0a"
              stroke="#34d399"
              strokeWidth={1.6}
            />
          </g>
        ))}

        {/* Analysis node */}
        <motion.g
          initial={reduce ? false : { scale: 1 }}
          animate={reduce ? undefined : { scale: [1, 1.05, 1] }}
          transition={
            reduce
              ? undefined
              : { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }
          style={{ transformOrigin: `${CENTER.x}px ${CENTER.y}px` }}
        >
          <circle
            cx={CENTER.x}
            cy={CENTER.y}
            r={30}
            fill="#0a0a0a"
            stroke="#34d399"
            strokeOpacity={0.45}
            strokeWidth={1}
          />
          <circle cx={CENTER.x} cy={CENTER.y} r={13} fill="#34d399" />
        </motion.g>
      </svg>

      <ul className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-dim">
        <li className="flex items-center gap-2">
          <span
            aria-hidden
            className="block size-2 rounded-full border border-accent"
          />
          Sensor buoy
        </li>
        <li className="flex items-center gap-2">
          <span aria-hidden className="block size-2 rounded-full bg-accent" />
          Analysis node
        </li>
      </ul>
    </div>
  );
}
