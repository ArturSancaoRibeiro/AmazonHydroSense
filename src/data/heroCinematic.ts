/*
  Central configuration for the scroll-controlled cinematic hero.

  Everything tunable about the hero lives here: asset paths, the scroll-to-
  video-time mapping, and the text stages. The components read this file and
  contain no hard-coded timing of their own.

  ── Source video ────────────────────────────────────────────────────────────
  The delivered master was HEVC (hvc1) 3840x2160 with only 2 keyframes in 361
  frames. Browsers other than Safari refuse hvc1, and scrubbing needs dense
  keyframes (seeking to frame N with a sparse GOP forces decoding every frame
  back to the previous keyframe). Both files below are H.264 all-intra
  (`-g 1`, every frame a keyframe) transcodes of that master: same 361 frames,
  same 15.042s, re-encoded purely so the browser can seek instantly.

  To replace the video later: re-encode with the same all-intra settings, drop
  it at the same paths, update VIDEO_DURATION_FALLBACK, then re-check the
  DEFECT / timeline constants below against the new footage.
*/

export const HERO_VIDEO_SRC = "/videos/amazon-hydro-sense-scroll-4k.mp4";
export const HERO_VIDEO_SRC_MOBILE =
  "/videos/amazon-hydro-sense-scroll-mobile.mp4";
export const HERO_POSTER_SRC = "/images/amazon-hydro-sense-scroll-poster.webp";

/*
  Used only until `loadedmetadata` reports the real duration, so the first
  frames of scrubbing aren't mapped against a zero duration.
*/
export const VIDEO_DURATION_FALLBACK = 15.042;

/*
  ── Source footage landmarks (seconds) ──────────────────────────────────────
  Measured by stepping through the delivered master frame by frame.

  The generated master duplicates part of the solar-panel assembly while the
  enclosure doors swing open: a second panel plate juts out on the RIGHT of
  frame, most obvious around 9.3s. We do not touch the video. Instead the
  hero (a) traverses this range faster, (b) darkens slightly, and (c) parks
  the stage-5 text block on the right, over the artifact.
*/
export const DEFECT = {
  duplicatePanelStartTime: 8.2,
  duplicatePanelEndTime: 10.5,
  underwaterTransitionStartTime: 10.8,
  underwaterTransitionEndTime: 11.6,
} as const;

/*
  ── Scroll → video time mapping ─────────────────────────────────────────────
  Piecewise linear. Each segment maps a normalized scroll range onto a video
  time range; rate = (videoEnd - videoStart) / (scrollEnd - scrollStart).

  Kept linear inside each segment on purpose: easing here would make reverse
  scrolling feel detached from the pointer. Segments are contiguous and
  monotonic, so the mapping is exactly reversible.

  Segment 5 is the mitigation: it covers the duplicated-panel range at roughly
  2.7x the rate of its neighbours, so the artifact is on screen for the least
  scroll distance without dropping so many frames that reversing looks broken.
*/
export type TimelineSegment = {
  scrollStart: number;
  scrollEnd: number;
  videoStart: number;
  videoEnd: number;
};

export const timelineSegments: TimelineSegment[] = [
  { scrollStart: 0.0, scrollEnd: 0.16, videoStart: 0.0, videoEnd: 2.2 },
  { scrollStart: 0.16, scrollEnd: 0.31, videoStart: 2.2, videoEnd: 4.3 },
  { scrollStart: 0.31, scrollEnd: 0.47, videoStart: 4.3, videoEnd: 6.4 },
  { scrollStart: 0.47, scrollEnd: 0.62, videoStart: 6.4, videoEnd: 7.9 },
  // Duplicated-panel range, traversed fast.
  { scrollStart: 0.62, scrollEnd: 0.72, videoStart: 7.9, videoEnd: 10.6 },
  { scrollStart: 0.72, scrollEnd: 0.86, videoStart: 10.6, videoEnd: 13.2 },
  { scrollStart: 0.86, scrollEnd: 0.96, videoStart: 13.2, videoEnd: 14.6 },
  { scrollStart: 0.96, scrollEnd: 1.0, videoStart: 14.6, videoEnd: 15.042 },
];

/*
  Maps normalized scroll progress (0..1) to a video timestamp in seconds.
  `duration` is the real duration once known, so the mapping stays correct if
  the replacement video is a slightly different length.
*/
export function scrollProgressToVideoTime(
  progress: number,
  duration: number,
): number {
  const p = Math.min(Math.max(progress, 0), 1);
  const configuredEnd =
    timelineSegments[timelineSegments.length - 1].videoEnd || 1;
  // Rescale configured times if the actual video is a different length.
  const scale = duration > 0 ? duration / configuredEnd : 1;

  for (const seg of timelineSegments) {
    if (p >= seg.scrollStart && p <= seg.scrollEnd) {
      const span = seg.scrollEnd - seg.scrollStart;
      const local = span > 0 ? (p - seg.scrollStart) / span : 0;
      const t = seg.videoStart + local * (seg.videoEnd - seg.videoStart);
      return Math.min(t * scale, duration);
    }
  }
  return Math.min(configuredEnd * scale, duration);
}

/*
  ── Text stages ─────────────────────────────────────────────────────────────
  Positioned in normalized scroll progress, matched to what the camera is
  showing at the equivalent video time.

  `side` places the block horizontally. Stage 5 sits right specifically to
  cover the duplicated panel. `overlayBoost` adds to the base scrim for that
  stage: positive to hide the artifact, negative to let underwater sensor
  detail read through.
*/
export type HeroStage = {
  id: string;
  start: number;
  end: number;
  eyebrow: string;
  headline: string;
  /** Word inside `headline` rendered in the brand's italic display accent. */
  accentWord?: string;
  body: string;
  side: "left" | "right" | "center";
  overlayBoost?: number;
  /** Short operational highlights, not a restatement of the parameter marquee. */
  tags?: string[];
  cta?: boolean;
};

export const heroStages: HeroStage[] = [
  {
    id: "opening",
    start: 0.0,
    end: 0.16,
    eyebrow: "Environmental monitoring in the field",
    headline: "Invisible contamination, detected in minutes.",
    accentWord: "Invisible",
    body: "Sensor stations monitor Amazonian rivers continuously. Our intelligence layer transforms environmental measurements into early warnings.",
    side: "left",
  },
  {
    id: "river",
    start: 0.16,
    end: 0.31,
    eyebrow: "Continuous river monitoring",
    headline: "The river changes before the warning arrives.",
    body: "Continuous measurements reveal variations that isolated manual samples can miss.",
    side: "left",
  },
  {
    id: "station",
    start: 0.31,
    end: 0.47,
    eyebrow: "Amazon Hydro Sense",
    headline: "A connected monitoring station on the water.",
    body: "The buoy collects environmental measurements continuously in remote river environments.",
    side: "left",
  },
  {
    id: "platform",
    start: 0.47,
    end: 0.62,
    eyebrow: "From the river to the platform",
    headline: "The hardware collects. The platform interprets.",
    body: "The station is the physical connection between the river and Amazon Hydro Sense environmental intelligence.",
    // Buoy sits left of frame here, so the copy takes the right.
    side: "right",
  },
  {
    id: "field-station",
    start: 0.62,
    end: 0.72,
    eyebrow: "A self-sufficient field station",
    headline: "Built for continuous operation.",
    body: "Solar power, sealed electronics, remote communication and protected sensing operate as one connected system.",
    // Right side covers the duplicated solar-panel plate.
    side: "right",
    overlayBoost: 0.14,
  },
  {
    id: "sensing",
    start: 0.72,
    end: 0.86,
    eyebrow: "Water-quality sensing",
    headline: "Each parameter reveals part of the river's condition.",
    body: "The sensor cage stays submerged year-round, logging continuously through every season with no manual sampling.",
    side: "left",
    // Underwater footage is already dark; lighten so sensor detail reads.
    overlayBoost: -0.06,
  },
  {
    id: "analysis",
    start: 0.86,
    end: 0.96,
    eyebrow: "AI-assisted analysis",
    headline: "The value is not only in the measurement.",
    body: "Amazon Hydro Sense identifies anomalies, compares patterns against the river's baseline and turns measurements into actionable information.",
    side: "left",
  },
  {
    id: "closing",
    start: 0.96,
    end: 1.0,
    eyebrow: "Amazon Hydro Sense",
    headline: "From water to data. From data to decision.",
    body: "Continuous monitoring and environmental intelligence for Amazonian rivers.",
    side: "left",
    cta: true,
  },
];

/*
  ── Overlay strength ────────────────────────────────────────────────────────
  Raise BASE_OVERLAY to darken the whole sequence; raise TEXT_SIDE_GRADIENT for
  more contrast behind copy without dimming the river. Per-stage adjustments
  go in `overlayBoost` above.
*/
export const BASE_OVERLAY = 0.22;
export const TEXT_SIDE_GRADIENT = 0.55;

/** Scroll length of the pinned sequence, per breakpoint. */
export const SCROLL_LENGTH_VH = {
  mobile: 420,
  tablet: 500,
  desktop: 600,
} as const;
