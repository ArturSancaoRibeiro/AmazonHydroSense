import type { Ref } from "react";
import type { HeroStage } from "@/data/heroCinematic";

type Props = {
  stage: HeroStage;
  index: number;
  /** The first stage carries the page's only h1. */
  isPrimary: boolean;
  /** The scroll loop writes opacity and transform straight to this element. */
  ref?: Ref<HTMLDivElement>;
};

const sideClass: Record<HeroStage["side"], string> = {
  left: "items-start text-left",
  right: "items-start text-left lg:items-end lg:text-right",
  center: "items-center text-center",
};

const columnClass: Record<HeroStage["side"], string> = {
  left: "lg:col-start-1 lg:col-end-7",
  right: "lg:col-start-7 lg:col-end-13",
  center: "lg:col-start-3 lg:col-end-11",
};

/*
  One text stage inside the pinned viewport. Rendered in the server HTML, then
  faded in and out by the scroll loop writing straight to style.opacity and
  style.transform. Never re-rendered while scrolling.
*/
export function HeroStageOverlay({ stage, index, isPrimary, ref }: Props) {
  const Heading = isPrimary ? "h1" : "h2";

  const headlineContent = stage.accentWord ? (
    <>
      <em className="font-display font-bold pb-1 text-accent">
        {stage.accentWord}
      </em>{" "}
      {stage.headline.replace(stage.accentWord, "").trimStart()}
    </>
  ) : (
    stage.headline
  );

  return (
    <div
      ref={ref}
      data-hero-stage={index}
      className="hero-stage pointer-events-none absolute inset-x-0 top-1/2 mx-auto grid w-full max-w-[1400px] -translate-y-1/2 grid-cols-1 px-6 lg:grid-cols-12 lg:px-10"
      style={{ opacity: index === 0 ? 1 : 0 }}
    >
      <div className={`flex flex-col ${sideClass[stage.side]} ${columnClass[stage.side]}`}>
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-accent">
          {stage.eyebrow}
        </p>
        <Heading className="mt-5 max-w-[20ch] text-4xl font-medium leading-[1.05] tracking-tighter text-balance text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.55)] md:text-5xl">
          {headlineContent}
        </Heading>
        <p className="mt-5 max-w-[46ch] text-[15px] leading-relaxed text-white/80 drop-shadow-[0_1px_12px_rgba(0,0,0,0.6)] md:text-base">
          {stage.body}
        </p>

        {stage.parameters && (
          <ul
            className={`mt-6 flex max-w-[42ch] flex-wrap gap-x-5 gap-y-2 ${
              stage.side === "right" ? "lg:justify-end" : ""
            }`}
          >
            {stage.parameters.map((parameter) => (
              <li
                key={parameter}
                className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/55"
              >
                {parameter}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
