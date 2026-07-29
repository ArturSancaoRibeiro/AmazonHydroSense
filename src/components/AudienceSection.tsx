import { Reveal } from "./Reveal";

const audiences = [
  {
    title: "Mining operators",
    body: "Continuous evidence of compliance for licensing, ESG reporting and the environmental due diligence required by the EU's CSDDD.",
  },
  {
    title: "Regulators",
    body: "Oversight built on a continuous, logged time series instead of sparse samples.",
  },
  {
    title: "River communities",
    body: "Access to the state of the water that supplies, feeds and crosses their territory, without waiting for a third-party report.",
  },
];

export function AudienceSection() {
  return (
    <section id="who-its-for" className="py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <Reveal>
          <h2 className="text-3xl font-medium tracking-tight text-balance md:text-4xl">
            Who uses Hydro Sense
          </h2>
          <p className="mt-5 max-w-[52ch] leading-relaxed text-ink-dim">
            The same data, three readings: compliance, oversight, transparency.
          </p>
        </Reveal>

        <div className="mt-12">
          {audiences.map((audience, i) => (
            <Reveal key={audience.title} delay={i * 0.06}>
              <div className="grid gap-2 border-t border-line py-8 md:grid-cols-12 md:gap-6">
                <h3 className="text-xl font-medium tracking-tight text-ink md:col-span-4">
                  {audience.title}
                </h3>
                <p className="leading-relaxed text-ink-dim md:col-span-8 lg:col-span-6">
                  {audience.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
