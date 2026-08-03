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
  /** Called on every animation frame with clamped, rate-limited progress (0..1). */
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

  ── Rate limit ──────────────────────────────────────────────────────────────
  The video is 15s; a fast flick can otherwise cover the whole 600vh runway in
  under 2 seconds, blowing past every caption unread. `effectiveProgress` is a
  lagged progress value that can only advance at a maximum of 1x (one second
  of video per one second of real time), in either direction. Scrolling
  slower than that is untouched, unmodified passthrough.

  Two values are tracked, not one:
  - `desiredProgress`: where the reader's own scroll input wants to be. It
    only moves in response to NEW scroll delta since our own last correction,
    tracked via `lastAppliedScrollYRef`, so it never forgets how far the
    reader was trying to go just because a previous frame paused progress
    there.
  - `effectiveProgress`: the rate-capped value that actually drives the video
    and the on-screen copy.

  Naive versions of this collapse the two into one: after each correction,
  the very next frame reads the corrected scrollY back as if it were fresh
  input, sees no further delta, and stops advancing until the next discrete
  scroll event arrives. Wheel input is not a continuous stream, it is
  discrete notches (as few as ~15-20/sec on plain mice), often sparser than
  the ~120Hz this rAF loop can run at. Collapsing the two values means most
  frames land in the "nothing to resist" gap between notches, and the
  measured advance rate ends up well under the intended 1x rather than at
  it. Tracking desire and effective progress separately fixes that: every
  frame still advances `effectiveProgress` toward the remembered desired
  value at up to the capped rate, whether or not that particular frame
  carried fresh input.

  Once `effectiveProgress` reaches 0 or 1, correction stops touching scrollY
  entirely, at either end, so the reader is never blocked from leaving the
  section once the sequence has actually finished.
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
  const desiredProgressRef = useRef(0);
  const effectiveProgressRef = useRef(0);
  const lastAppliedScrollYRef = useRef<number | null>(null);
  const lastFrameAtRef = useRef<number | null>(null);

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

    // Seed from wherever the reader actually is (deep link, browser scroll
    // restoration, etc.) instead of forcing a replay from zero.
    {
      const { top, height, viewport } = metricsRef.current;
      const scrollable = height - viewport;
      const initial =
        scrollable > 0
          ? Math.min(Math.max((window.scrollY - top) / scrollable, 0), 1)
          : 0;
      desiredProgressRef.current = initial;
      effectiveProgressRef.current = initial;
      lastAppliedScrollYRef.current = window.scrollY;
    }

    const readDuration = () => {
      if (video && Number.isFinite(video.duration) && video.duration > 0) {
        durationRef.current = video.duration;
      }
    };
    readDuration();
    video?.addEventListener("loadedmetadata", readDuration);

    const loop = (now: number) => {
      rafRef.current = requestAnimationFrame(loop);
      if (!inViewRef.current) {
        lastFrameAtRef.current = null; // don't count paused-offscreen time
        return;
      }

      const { top, height, viewport } = metricsRef.current;
      const cachedScrollable = height - viewport;
      const currentScrollY = window.scrollY;

      /*
        Guard against a large external jump landing far from the track, and
        against the one-frame race with the IntersectionObserver: the
        observer's isIntersecting is asynchronous, so the frame right after
        a big jump can still run with `inViewRef` stale from before the jump.
        If that frame's progress is still mid-sequence, the correction below
        fires and pulls scrollY straight back into the track - which means
        the observer, checking again afterward, sees the reader back inside
        and never reports "left the view" at all. The result is a scroll
        position that keeps getting silently dragged back toward the hero
        with no user input, converging at the 1x rate as if still scrubbing.
        This check is synchronous and doesn't depend on the observer's
        timing: if the raw position is farther from the track than a single
        real scroll gesture could plausibly cover, treat the hero as not
        currently being interacted with, pin progress to the nearer edge,
        and skip the correction for this frame instead of fighting the jump.
      */
      const slack = viewport;
      const farOutside =
        currentScrollY < top - slack || currentScrollY > top + height + slack;

      if (farOutside) {
        desiredProgressRef.current = currentScrollY < top ? 0 : 1;
        effectiveProgressRef.current = desiredProgressRef.current;
        lastAppliedScrollYRef.current = currentScrollY;
      } else if (cachedScrollable > 0) {
        const nativeDeltaPx =
          currentScrollY - (lastAppliedScrollYRef.current ?? currentScrollY);
        if (nativeDeltaPx !== 0) {
          desiredProgressRef.current = Math.min(
            Math.max(
              desiredProgressRef.current + nativeDeltaPx / cachedScrollable,
              0,
            ),
            1,
          );
        }
      }

      const dt =
        lastFrameAtRef.current === null
          ? 0
          : Math.min((now - lastFrameAtRef.current) / 1000, 0.1);
      lastFrameAtRef.current = now;

      const maxStep = dt / durationRef.current; // progress-units for 1x speed
      const delta = desiredProgressRef.current - effectiveProgressRef.current;

      if (Math.abs(delta) > maxStep) {
        effectiveProgressRef.current += Math.sign(delta) * maxStep;
      } else {
        effectiveProgressRef.current = desiredProgressRef.current;
      }

      const progress = effectiveProgressRef.current;

      // Only hold the reader inside the section mid-sequence. At either end
      // (finished, or not yet started), stop touching scrollY entirely so
      // leaving the section is never blocked.
      if (progress > 0 && progress < 1 && cachedScrollable > 0) {
        const correctedScrollY = top + progress * cachedScrollable;
        // `behavior: "instant"` bypasses the site-wide `scroll-behavior:
        // smooth`: without it, each correction kicks off its own smooth
        // animation that fights the next frame's correction, netting out
        // well under the intended 1x cap instead of exactly at it.
        window.scrollTo({ top: correctedScrollY, left: 0, behavior: "instant" });
        lastAppliedScrollYRef.current = correctedScrollY;
      } else {
        lastAppliedScrollYRef.current = window.scrollY;
      }

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
      const timeDelta = targetTimeRef.current - currentTimeRef.current;
      currentTimeRef.current =
        Math.abs(timeDelta) < 0.008
          ? targetTimeRef.current
          : currentTimeRef.current + timeDelta * 0.22;

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
