import { DemoRequestForm } from "./DemoRequestForm";
import { Reveal } from "./Reveal";

export function FinalCta() {
  return (
    <section id="contact" className="py-24 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <h2 className="text-3xl font-medium tracking-tight text-balance md:text-4xl">
                See Hydro Sense running on live data.
              </h2>
              <p className="mt-5 max-w-[42ch] leading-relaxed text-ink-dim">
                Tell us about your operation and we will set up a walkthrough
                of a unit running in the Itacaiúnas basin.
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal delay={0.1}>
              <DemoRequestForm />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
