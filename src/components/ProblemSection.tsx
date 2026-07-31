import { ParallaxBackground } from "./ParallaxBackground";
import { Reveal } from "./Reveal";

const facts = [
  {
    title: "Invisible to the naked eye",
    body: "Dissolved mercury, lead and arsenic leave no trace in the water's color or smell.",
  },
  {
    title: "Weeks until a lab result",
    body: "Manual sampling, transport and analysis add up to weeks between event and response.",
  },
  {
    title: "No continuous record",
    body: "Sparse measurements can't prove when contamination started, or where it came from.",
  },
];

export function ProblemSection() {
  return (
    <section id="problem" className="relative overflow-hidden">
      <ParallaxBackground
        src="/images/sediment-plume.png"
        alt="Aerial view of a muddy sediment plume meeting dark clear water in an Amazonian river"
      />
      {/* Scrim: uniform base plus a gradient weighted to the text side */}
      <div aria-hidden className="absolute inset-0 bg-background/60" />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-background via-background/75 to-background/35"
      />

      <div className="relative mx-auto max-w-[1400px] px-6 py-24 lg:px-10 lg:py-36">
        <div className="max-w-xl">
          <Reveal>
            <h2 className="text-3xl font-medium tracking-tight text-balance text-ink md:text-4xl">
              Heavy metals don&apos;t change the color of the water.
            </h2>
            <p className="mt-5 leading-relaxed text-ink-dim">
              The most dangerous contamination is invisible from the riverbank.
              By the time a sample reaches the lab, the plume has moved
              downstream.
            </p>
          </Reveal>

          <div className="mt-12 space-y-8">
            {facts.map((fact, i) => (
              <Reveal key={fact.title} delay={i * 0.08}>
                <div className="border-l-2 border-accent/70 pl-6">
                  <h3 className="font-medium text-ink">{fact.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-dim">
                    {fact.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
