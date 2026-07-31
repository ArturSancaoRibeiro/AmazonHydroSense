"use client";

import { useEffect, useRef, type RefObject } from "react";
import {
  scrollProgressToVideoTime,
  VIDEO_DURATION_FALLBACK,
} from "@/data/heroCinematic";

type Options = {
  trackRef: RefObject<HTMLElement | null>;
  videoRef: RefObject<HTMLVideoElement | null>;
  /** False for reduced motion or after a video failure: no loop, no seeking. */
  enabled: boolean;
  /** Called on every animation frame with clamped scroll progress (0..1). */
  onFrame: (progress: number) => void;
};

/*
  Drives the pinned hero: maps window scroll to video currentTime.

  Deliberately state-free. Everything that changes per frame lives in refs and
  is written straight to the DOM, so scrolling never re-renders React. Layout
  is measured once and cached, then re-measured on resize only, keeping reads
  and writes out of the same frame.

  The video is never played. It stays paused and we seek it, which is why the
  source is encoded all-intra (see heroCinematic.ts).
*/
export function useScrollVideoScrub({
  trackRef,
  videoRef,
  enabled,
  onFrame,
}: Options) {
  // Kept in a ref so the rAF loop reads the latest callback without
  // re-subscribing. Assigned in an effect, never during render.
  const onFrameRef = useRef(onFrame);
  useEffect(() => {
    onFrameRef.current = onFrame;
  }, [onFrame]);

  const rafRef = useRef<number | null>(null);
  const metricsRef = useRef({ top: 0, height: 0, viewport: 0 });
  const currentTimeRef = useRef(0);
  const targetTimeRef = useRef(0);
  const durationRef = useRef(VIDEO_DURATION_FALLBACK);
  const inViewRef = useRef(true);

  useEffect(() => {
    if (!enabled) return;

    const track = trackRef.current;
    const video = videoRef.current;
    if (!track) return;

    const measure = () => {
      const rect = track.getBoundingClientRect();
      metricsRef.current = {
        top: rect.top + window.scrollY,
        height: track.offsetHeight,
        viewport: window.innerHeight,
      };
    };
    measure();

    const readDuration = () => {
      if (video && Number.isFinite(video.duration) && video.duration > 0) {
        durationRef.current = video.duration;
      }
    };
    readDuration();
    video?.addEventListener("loadedmetadata", readDuration);

    const loop = () => {
      rafRef.current = requestAnimationFrame(loop);
      if (!inViewRef.current) return;

      const { top, height, viewport } = metricsRef.current;
      const scrollable = height - viewport;
      const progress =
        scrollable > 0
          ? Math.min(Math.max((window.scrollY - top) / scrollable, 0), 1)
          : 0;

      onFrameRef.current(progress);

      if (!video) return;
      targetTimeRef.current = scrollProgressToVideoTime(
        progress,
        durationRef.current,
      );

      /*
        Small lerp purely to smooth frame stepping. The factor is high enough
        that it converges within a few frames, so the video never keeps
        drifting after the user stops scrolling.
      */
      const delta = targetTimeRef.current - currentTimeRef.current;
      currentTimeRef.current =
        Math.abs(delta) < 0.008
          ? targetTimeRef.current
          : currentTimeRef.current + delta * 0.22;

      if (
        video.readyState >= 1 &&
        Math.abs(video.currentTime - currentTimeRef.current) > 0.008
      ) {
        try {
          video.currentTime = currentTimeRef.current;
        } catch {
          // Seeking can throw while the element is tearing down. Harmless.
        }
      }
    };

    // Only burn frames while the hero is actually on screen.
    const io = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting;
      },
      { rootMargin: "120px 0px" },
    );
    io.observe(track);

    let resizeRaf: number | null = null;
    const onResize = () => {
      if (resizeRaf !== null) return;
      resizeRaf = requestAnimationFrame(() => {
        resizeRaf = null;
        measure();
      });
    };

    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("orientationchange", onResize, { passive: true });
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      if (resizeRaf !== null) cancelAnimationFrame(resizeRaf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      video?.removeEventListener("loadedmetadata", readDuration);
      io.disconnect();
    };
  }, [enabled, trackRef, videoRef]);
}
