import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { BuoyNetwork } from "./BuoyNetwork";
import { Reveal } from "./Reveal";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Field photography, pushed deep into the background so the diagram
          leads and the hero still proves this is real hardware. */}
      <div aria-hidden className="absolute inset-0">
        <Image
          src="/images/hero-buoy.png"
          alt=""
          fill
          priority
          className="ken-burns object-cover opacity-45"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/80" />
      </div>

      <div className="relative mx-auto w-full max-w-[1400px] px-6 lg:px-10">
        <div className="grid items-center gap-12 py-16 lg:min-h-[calc(100dvh-4rem)] lg:grid-cols-12 lg:gap-10 lg:py-12">
          <div className="lg:col-span-6 xl:col-span-5">
            <Reveal>
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-accent">
                Environmental monitoring in the field
              </p>
              <h1 className="mt-5 text-4xl font-medium leading-[1.05] tracking-tighter text-balance md:text-5xl">
                <em className="font-display font-bold pb-1 text-accent">
                  Invisible
                </em>{" "}
                contamination, detected in minutes.
              </h1>
              <p className="mt-6 max-w-[44ch] leading-relaxed text-ink-dim">
                Sensor buoys track water quality across the rivers of Carajás.
                AI reads the data and flags contamination in real time.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-ink transition hover:bg-white active:translate-y-px"
                >
                  Book a demo
                  <ArrowRight size={16} weight="bold" />
                </Link>
                <Link
                  href="#how-it-works"
                  className="inline-flex items-center rounded-full border border-line px-6 py-3 text-sm font-medium text-ink transition hover:border-ink-dim active:translate-y-px"
                >
                  See how it works
                </Link>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-6 xl:col-span-7">
            <Reveal delay={0.15}>
              <div className="mx-auto max-w-[560px] lg:ml-auto lg:mr-0">
                <BuoyNetwork />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
