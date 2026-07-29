import Image from "next/image";
import { Reveal } from "./Reveal";

const steps = [
  {
    title: "Buoys in the field",
    body: "Units anchored upstream and downstream of the mining operations, solar powered, transmitting via satellite.",
  },
  {
    title: "Continuous measurement",
    body: "Turbidity, dissolved oxygen, pH and heavy metals, sampled around the clock, wet season and dry.",
  },
  {
    title: "AI analysis",
    body: "Models trained on the river's baseline tell a heavy rainfall apart from a tailings discharge.",
  },
  {
    title: "Report and alert",
    body: "Anomalies trigger an immediate alert. Compliance reports come out ready for the regulator and the stakeholder dashboard.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <Reveal>
              <h2 className="text-3xl font-medium tracking-tight text-balance md:text-4xl">
                From buoy to report
              </h2>
              <p className="mt-5 max-w-[48ch] leading-relaxed text-ink-dim">
                Hardware in the field, continuous transmission, automated
                analysis. No step depends on manual sampling.
              </p>
            </Reveal>
            <Reveal delay={0.1} className="mt-10">
              <div className="media-frame aspect-[4/3] w-full rounded-xl">
                <Image
                  src="/images/sensor-closeup.png"
                  alt="A brushed-steel water quality probe half submerged in dark river water, forest out of focus behind it"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 40vw, 100vw"
                />
              </div>
              <p className="mt-3 text-xs text-ink-dim">
                The multiparameter probe on a Hydro Sense unit.
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-7 lg:pl-6">
            <ol className="relative border-l border-line">
              {steps.map((step, i) => (
                <li key={step.title} className="relative pb-12 pl-8 last:pb-0">
                  <Reveal delay={i * 0.06}>
                    <span
                      aria-hidden
                      className="absolute -left-[37px] top-1.5 block size-3 rounded-full border-2 border-accent bg-background"
                    />
                    <h3 className="text-lg font-medium text-ink">
                      {step.title}
                    </h3>
                    <p className="mt-2 max-w-[52ch] text-[15px] leading-relaxed text-ink-dim">
                      {step.body}
                    </p>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
