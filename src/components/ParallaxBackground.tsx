"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

type ParallaxBackgroundProps = {
  src: string;
  alt: string;
};

/*
  Full-bleed section background with ambient parallax: the photo drifts
  slower than the scroll. The inner layer is 16% taller than the mask so
  the drift never exposes an edge. Static cover under prefers-reduced-motion.
*/
export function ParallaxBackground({ src, alt }: ParallaxBackgroundProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-x-0 -inset-y-[8%]"
        style={reduce ? undefined : { y }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="100vw"
        />
      </motion.div>
    </div>
  );
}
