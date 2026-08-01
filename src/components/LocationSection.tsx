import { ParallaxBackground } from "./ParallaxBackground";
import { Reveal } from "./Reveal";

const details = [
  { label: "Country", value: "Brazil, Amazon rainforest" },
  { label: "Region", value: "Serra dos Carajás, Pará" },
  { label: "River basin", value: "Rio Itacaiúnas" },
  { label: "Nearby operations", value: "Salobo and Paulo Afonso" },
];

export function LocationSection() {
  return (
    <section
      id="coverage"
      className="relative flex min-h-[80vh] items-end overflow-hidden"
    >
      <ParallaxBackground
        src="/images/aerial-river.png"
        alt="Aerial view of a river winding through dense, unbroken Amazon rainforest"
      />
      {/* Scrim: uniform base plus a gradient rising from the text area */}
      <div aria-hidden className="absolute inset-0 bg-background/45" />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/25"
      />

      <div className="relative mx-auto w-full max-w-[1400px] px-6 pb-16 pt-40 lg:px-10 lg:pb-20">
        <Reveal>
          <h2 className="text-3xl font-medium tracking-tight text-balance text-ink md:text-4xl">
            Where Hydro Sense operates
          </h2>
          <p className="mt-5 max-w-[60ch] leading-relaxed text-ink-dim">
            Northern Brazil, deep in the Amazon rainforest. The first units
            cover the Itacaiúnas river basin, which drains the Serra dos
            Carajás region in the state of Pará and supplies communities
            downstream of the Salobo and Paulo Afonso mining operations.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <dl className="mt-10 grid grid-cols-2 gap-8 border-t border-line pt-8 md:grid-cols-4">
            {details.map((item) => (
              <div key={item.label}>
                <dt className="text-sm text-ink-dim">{item.label}</dt>
                <dd className="mt-1 font-medium text-ink">{item.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
