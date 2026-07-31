"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CaretDown } from "@phosphor-icons/react";
import { Reveal } from "./Reveal";

/*
  Answers are deliberately cautious: no claims of regulatory certification,
  no implied live customer base, no "proven" detection claims. See the
  content-accuracy constraint documented for the hero (src/data/heroCinematic.ts).
*/
const faqs = [
  {
    question: "Does this replace laboratory water testing?",
    answer:
      "No. Continuous monitoring flags when and where a sample is worth taking, so lab testing gets used efficiently instead of on a fixed schedule. Lab results remain the reference standard for regulatory submissions.",
  },
  {
    question: "How does a buoy send data from a remote river?",
    answer:
      "Each unit transmits via satellite, so coverage does not depend on cellular networks reaching the basin.",
  },
  {
    question: "What happens when the AI detects an anomaly?",
    answer:
      "An alert goes out to the operator and any configured regulator or community contact, instead of waiting for the next scheduled sample to catch it.",
  },
  {
    question: "Is this already deployed, or a pilot-stage product?",
    answer:
      "Amazon Hydro Sense is available for pilot deployment with mining operators and regulators. Book a demo to discuss timelines for your river basin.",
  },
  {
    question: "Can the hardware run in the wet season?",
    answer:
      "Yes. The enclosure is sealed and watertight, and the unit is solar-powered with battery backup, built to keep logging through heavy rain and long overcast stretches.",
  },
  {
    question: "Who owns the data a buoy collects?",
    answer:
      "The operator who deploys the unit. Access for regulators or community contacts is configured per deployment, not shared by default.",
  },
];

function FaqItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const reduce = useReducedMotion();

  return (
    <div className="border-t border-line py-2">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-6 py-5 text-left"
      >
        <span className="text-[17px] font-medium text-ink">{question}</span>
        <CaretDown
          size={18}
          weight="bold"
          className={`shrink-0 text-ink-dim transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden"
      >
        <p className="max-w-[62ch] pb-6 leading-relaxed text-ink-dim">
          {answer}
        </p>
      </motion.div>
    </div>
  );
}

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <h2 className="text-3xl font-medium tracking-tight text-balance md:text-4xl">
              Questions we hear before a demo
            </h2>
            <p className="mt-5 max-w-[42ch] leading-relaxed text-ink-dim">
              Straight answers to what compliance teams and regulators ask
              first.
            </p>
          </Reveal>

          <div className="lg:col-span-7">
            {faqs.map((faq, i) => (
              <FaqItem
                key={faq.question}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
