"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight } from "@phosphor-icons/react";
import {
  BASE_OVERLAY,
  HERO_POSTER_SRC,
  HERO_VIDEO_SRC,
  HERO_VIDEO_SRC_MOBILE,
  TEXT_SIDE_GRADIENT,
  heroStages,
} from "@/data/heroCinematic";
import { useScrollVideoScrub } from "@/hooks/useScrollVideoScrub";
import { HeroStageOverlay } from "./HeroStageOverlay";

const LAST_STAGE = heroStages[heroStages.length - 1];

/*
  Opacity for a stage at a given scroll progress.

  The fade window straddles each boundary (half before, half after) so
  consecutive stages cross at 0.5 instead of both hitting zero, which would
  leave a blank frame between messages. The first stage never fades in and the
  last never fades out, so the hero is fully legible at rest at both ends and
  the CTAs survive to the release.
*/
const STAGE_FADE = 0.03;

function stageOpacity(progress: number, index: number): number {
  const stage = heroStages[index];
  const half = STAGE_FADE / 2;
  const fadeIn =
    index === 0 ? 1 : (progress - (stage.start - half)) / STAGE_FADE;
  const fadeOut =
    index === heroStages.length - 1
      ? 1
      : (stage.end + half - progress) / STAGE_FADE;
  return Math.max(0, Math.min(1, Math.min(fadeIn, fadeOut)));
}

export function CinematicHero() {
  const trackRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const stageRefs = useRef<(HTMLElement | null)[]>([]);
  const ctaRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const gradientLeftRef = useRef<HTMLDivElement>(null);
  const gradientRightRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const ctaInteractiveRef = useRef(false);

  const [isStatic, setIsStatic] = useState(false);
  const [isReady, setIsReady] = useState(false);

  /*
    Reduced motion and video failure both collapse the hero to a single static
    frame in normal document flow. Decided after mount so the server HTML stays
    identical for every visitor.
  */
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setIsStatic(query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  // Pick the source, then load exactly once.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || isStatic) return;

    const wantsMobile = window.matchMedia("(max-width: 767px)").matches;
    let triedDesktopFallback = false;

    const onLoaded = () => setIsReady(true);
    const onError = () => {
      // A missing mobile encode falls back to the desktop file before failing.
      if (!triedDesktopFallback && video.src.includes(HERO_VIDEO_SRC_MOBILE)) {
        triedDesktopFallback = true;
        video.src = HERO_VIDEO_SRC;
        video.load();
        return;
      }
      setIsStatic(true);
    };

    video.addEventListener("loadedmetadata", onLoaded);
    video.addEventListener("error", onError);

    video.preload = "auto";
    video.src = wantsMobile ? HERO_VIDEO_SRC_MOBILE : HERO_VIDEO_SRC;
    video.load();

    // If metadata never arrives, fall back rather than sit on a dead frame.
    const timeout = window.setTimeout(() => {
      if (video.readyState < 1) setIsStatic(true);
    }, 15000);

    return () => {
      video.removeEventListener("loadedmetadata", onLoaded);
      video.removeEventListener("error", onError);
      window.clearTimeout(timeout);
    };
  }, [isStatic]);

  const handleFrame = useCallback((progress: number) => {
    let activeSide: "left" | "right" | "center" = "left";
    let overlayBoost = 0;

    for (let i = 0; i < heroStages.length; i += 1) {
      const el = stageRefs.current[i];
      if (!el) continue;
      const opacity = stageOpacity(progress, i);
      el.style.opacity = String(opacity);
      el.style.transform = `translateY(calc(-50% + ${((1 - opacity) * 12).toFixed(2)}px))`;
      if (opacity > 0.5) {
        activeSide = heroStages[i].side;
        overlayBoost = heroStages[i].overlayBoost ?? 0;
      }
    }

    if (overlayRef.current) {
      overlayRef.current.style.opacity = String(
        Math.max(0, Math.min(0.85, BASE_OVERLAY + overlayBoost)),
      );
    }
    if (gradientLeftRef.current) {
      gradientLeftRef.current.style.opacity =
        activeSide === "left" ? String(TEXT_SIDE_GRADIENT) : "0";
    }
    if (gradientRightRef.current) {
      gradientRightRef.current.style.opacity =
        activeSide === "right" ? String(TEXT_SIDE_GRADIENT) : "0";
    }

    if (ctaRef.current) {
      const ctaOpacity = Math.max(
        0,
        Math.min(1, (progress - (LAST_STAGE.start - 0.02)) / 0.03),
      );
      ctaRef.current.style.opacity = String(ctaOpacity);
      const interactive = ctaOpacity > 0.6;
      if (interactive !== ctaInteractiveRef.current) {
        ctaInteractiveRef.current = interactive;
        ctaRef.current.style.pointerEvents = interactive ? "auto" : "none";
      }
    }

    if (progressRef.current) {
      progressRef.current.style.transform = `scaleX(${progress.toFixed(4)})`;
    }
  }, []);

  useScrollVideoScrub({
    trackRef,
    videoRef,
    enabled: !isStatic,
    onFrame: handleFrame,
  });

  return (
    <div
      ref={trackRef}
      data-hero-static={isStatic ? "true" : "false"}
      className="hero-track relative"
    >
      <div className="hero-sticky sticky top-0 overflow-hidden bg-black">
        <video
          ref={videoRef}
          poster={HERO_POSTER_SRC}
          muted
          playsInline
          preload="none"
          aria-hidden="true"
          tabIndex={-1}
          disablePictureInPicture
          className="hero-video absolute inset-0 h-full w-full object-contain md:object-cover"
        />

        {/* Layered scrim: flat base, then a directional wash behind the copy. */}
        <div
          ref={overlayRef}
          aria-hidden
          className="absolute inset-0 bg-black"
          style={{ opacity: BASE_OVERLAY }}
        />
        <div
          ref={gradientLeftRef}
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent transition-opacity duration-500"
          style={{ opacity: TEXT_SIDE_GRADIENT }}
        />
        <div
          ref={gradientRightRef}
          aria-hidden
          className="absolute inset-0 bg-gradient-to-l from-black via-black/40 to-transparent transition-opacity duration-500"
          style={{ opacity: 0 }}
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/70 to-transparent"
        />

        {/* Available to assistive tech, which never sees the scrubbing. */}
        <p className="sr-only">
          A scroll-controlled sequence follows the river from the air down to a
          floating Amazon Hydro Sense monitoring station, its solar-powered
          electronics and its underwater sensors.
        </p>

        {heroStages.map((stage, index) => (
          <HeroStageOverlay
            key={stage.id}
            stage={stage}
            index={index}
            isPrimary={index === 0}
            ref={(el) => {
              stageRefs.current[index] = el;
            }}
          />
        ))}

        <div
          ref={ctaRef}
          className="hero-cta absolute inset-x-0 bottom-[14vh] mx-auto flex w-full max-w-[1400px] flex-col gap-3 px-6 sm:flex-row sm:items-center lg:px-10"
          style={{ opacity: 0, pointerEvents: "none" }}
        >
          <Link
            href="#contact"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-ink transition hover:bg-white active:translate-y-px"
          >
            Get in touch
            <ArrowRight size={16} weight="bold" />
          </Link>
          <Link
            href="#how-it-works"
            className="inline-flex items-center justify-center rounded-full border border-white/30 bg-black/30 px-6 py-3 text-sm font-medium text-white backdrop-blur-sm transition hover:border-white/60 active:translate-y-px"
          >
            See how it works
          </Link>
        </div>

        {/* Progress hairline, hidden in static mode by CSS. */}
        <div
          aria-hidden
          className="hero-progress absolute inset-x-0 bottom-0 h-px bg-accent/70 origin-left"
          style={{ transform: "scaleX(0)" }}
          ref={progressRef}
        />

        {!isReady && !isStatic && (
          <div
            aria-hidden
            className="absolute bottom-8 left-1/2 h-1 w-24 -translate-x-1/2 overflow-hidden rounded-full bg-white/15"
          >
            <div className="hero-loading-bar h-full w-1/3 rounded-full bg-accent" />
          </div>
        )}
      </div>
    </div>
  );
}
