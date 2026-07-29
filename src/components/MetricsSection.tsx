import { CountUp } from "./CountUp";
import { Reveal } from "./Reveal";

const metrics = [
  {
    name: "Turbidity",
    prefix: "≤ ",
    value: 100,
    decimals: 0,
    unit: "NTU",
    body: "Suspended sediment is the first trace of tailings and silting in the river.",
  },
  {
    name: "Dissolved oxygen",
    prefix: "≥ ",
    value: 5.0,
    decimals: 1,
    unit: "mg/L",
    body: "Below this floor, aquatic life collapses. It is the river's most direct vital sign.",
  },
  {
    name: "pH",
    prefix: "",
    value: null,
    decimals: 1,
    unit: "range",
    body: "Acid mine drainage pulls pH down long before anything shows on the surface.",
  },
  {
    name: "Total mercury",
    prefix: "≤ ",
    value: 0.2,
    decimals: 1,
    unit: "µg/L",
    body: "Dissolved heavy metals have no color and no smell. Only a sensor picks them up.",
  },
];

export function MetricsSection() {
  return (
    <section id="metrics" className="py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <Reveal>
          <h2 className="text-3xl font-medium tracking-tight text-balance md:text-4xl">
            What each buoy measures
          </h2>
          <p className="mt-5 max-w-[58ch] leading-relaxed text-ink-dim">
            Four core parameters, benchmarked against the limits of Brazil's
            CONAMA Resolution 357/2005.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:gap-6">
          {metrics.map((metric, i) => (
            <Reveal key={metric.name} delay={i * 0.06}>
              <div className="h-full rounded-xl border border-line bg-surface p-6 lg:p-8">
                <p className="text-sm font-medium text-ink">{metric.name}</p>
                <p className="mt-5 font-mono text-3xl tracking-tight text-ink md:text-4xl">
                  {metric.value === null ? (
                    <>
                      <CountUp value={6.0} decimals={1} /> to{" "}
                      <CountUp value={9.0} decimals={1} />
                    </>
                  ) : (
                    <>
                      {metric.prefix}
                      <CountUp value={metric.value} decimals={metric.decimals} />
                    </>
                  )}{" "}
                  <span className="text-base text-ink-dim">{metric.unit}</span>
                </p>
                <p className="mt-4 text-sm leading-relaxed text-ink-dim">
                  {metric.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <p className="mt-6 max-w-[70ch] text-xs leading-relaxed text-ink-dim">
          Reference limits for class 2 freshwater under CONAMA Resolution
          357/2005. Each unit also logs temperature and conductivity for
          context.
        </p>
      </div>
    </section>
  );
}
