import { isBreach, LIMIT_NTU, readings } from "@/data/readings";
import { Reveal } from "./Reveal";
import { RevealRow } from "./RevealRow";
import { TurbidityChart } from "./TurbidityChart";

const recent = [...readings].slice(-6).reverse();

function SampleDataTag() {
  return (
    <span className="inline-flex shrink-0 items-center rounded-full border border-line px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
      Sample data
    </span>
  );
}

export function DataSection() {
  return (
    <section id="data" className="py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <Reveal>
          <h2 className="text-3xl font-medium tracking-tight text-balance md:text-4xl">
            What detection looks like
          </h2>
          <p className="mt-5 max-w-[58ch] leading-relaxed text-ink-dim">
            Illustrative data: fourteen days of turbidity from a single buoy,
            shaped to show a detection event. A plume pushes the reading past
            the regulatory limit around day eleven, and the system flags it
            the same hour.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-10">
          <div className="rounded-xl border border-line bg-surface p-4 sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <p className="text-sm font-medium text-ink">
                Turbidity, 14-day sample
              </p>
              <SampleDataTag />
            </div>
            <TurbidityChart />
          </div>
        </Reveal>

        <Reveal delay={0.05} className="mt-12">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-sm font-medium text-ink-dim">
              Sample readings, buoy ITC-04
            </h3>
            <SampleDataTag />
          </div>
        </Reveal>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left">
            <thead>
              <tr className="border-b border-line font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted">
                <th scope="col" className="py-3 pr-4 font-normal">
                  Day
                </th>
                <th scope="col" className="py-3 pr-4 font-normal">
                  Turbidity
                </th>
                <th scope="col" className="py-3 pr-4 font-normal">
                  Oxygen
                </th>
                <th scope="col" className="py-3 pr-4 font-normal">
                  pH
                </th>
                <th scope="col" className="py-3 pr-4 font-normal">
                  Mercury
                </th>
                <th scope="col" className="py-3 font-normal">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-soft font-mono text-sm">
              {recent.map((reading, i) => {
                const breach = isBreach(reading);
                return (
                  <RevealRow key={reading.id} delay={i * 0.04}>
                    <td className="py-3.5 pr-4 text-ink-dim">
                      {reading.label}
                    </td>
                    <td
                      className={`py-3.5 pr-4 ${
                        reading.turbidity > LIMIT_NTU
                          ? "text-amber-500"
                          : "text-ink"
                      }`}
                    >
                      {reading.turbidity} NTU
                    </td>
                    <td className="py-3.5 pr-4 text-ink">
                      {reading.oxygen.toFixed(1)} mg/L
                    </td>
                    <td className="py-3.5 pr-4 text-ink">
                      {reading.ph.toFixed(1)}
                    </td>
                    <td className="py-3.5 pr-4 text-ink">
                      {reading.mercury.toFixed(2)} µg/L
                    </td>
                    <td
                      className={`py-3.5 ${
                        breach ? "text-amber-500" : "text-ink-dim"
                      }`}
                    >
                      {breach ? "Above limit" : "Within limits"}
                    </td>
                  </RevealRow>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="mt-5 max-w-[70ch] text-xs leading-relaxed text-ink-dim">
          Sample data for illustration. Limits follow CONAMA Resolution
          357/2005 for class 2 freshwater.
        </p>
      </div>
    </section>
  );
}
