"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "./Reveal";

/*
  Answers stay deliberately cautious: no regulatory certification claims, no
  implied live customer base, no proven-detection numbers. Same content
  constraint the hero copy runs under (see src/data/heroCinematic.ts).

  Signature element: the open/closed indicator is the concentric-ring sonar
  mark from the brand logo, not a caret. Opening a question fires one ring
  outward, which is feedback for the action rather than ambient decoration.
  That mark is the only place this section spends any boldness; the layout,
  the type scale and the palette all sit on the existing section tokens.
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
      "Amazon Hydro Sense is available for pilot deployment with mining operators and regulators. Get in touch to discuss timelines for your river basin.",
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

const COLUMN_SIZE = 3;

/*
  Concentric sonar mark. Three elements: a core dot, a static middle ring, and
  a pulse ring that expands once per open. Closed state is muted and quiet so
  the open question is the one that reads as active.
*/
function SonarMark({ isOpen, reduce }: { isOpen: boolean; reduce: boolean }) {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      aria-hidden
      className="shrink-0 overflow-visible"
    >
      <motion.circle
        cx="13"
        cy="13"
        r="7"
        fill="none"
        strokeWidth="1"
        className="stroke-accent"
        initial={false}
        animate={
          isOpen && !reduce
            ? { scale: [1, 1.85], opacity: [0.65, 0] }
            : { scale: 1, opacity: 0 }
        }
        transition={{ duration: 0.7, ease: "easeOut" }}
        style={{ transformOrigin: "center", transformBox: "fill-box" }}
      />
      {/*
        The resting ring has to stay readable, otherwise the closed state
        collapses into a plain list bullet and the sonar reference is lost on
        the majority of items.
      */}
      <circle
        cx="13"
        cy="13"
        r="7"
        fill="none"
        strokeWidth="1"
        className={`transition-colors duration-300 ${
          isOpen ? "stroke-accent/55" : "stroke-ink-muted/40"
        }`}
      />
      <circle
        cx="13"
        cy="13"
        r="2.25"
        className={`transition-colors duration-300 ${
          isOpen ? "fill-accent" : "fill-ink-muted/70"
        }`}
      />
    </svg>
  );
}

function FaqItem({
  question,
  answer,
  index,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const reduce = useReducedMotion() ?? false;
  const buttonId = `faq-button-${index}`;
  const panelId = `faq-panel-${index}`;

  return (
    <div
      className={`rounded-xl border transition-colors duration-300 ${
        isOpen
          ? "border-accent/25 bg-surface-elevated"
          : "border-line bg-surface hover:border-ink-muted/40"
      }`}
    >
      <h3>
        <button
          id={buttonId}
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className="flex w-full items-start gap-4 rounded-xl px-5 py-5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <SonarMark isOpen={isOpen} reduce={reduce} />
          <span
            className={`text-[16px] font-medium leading-snug transition-colors duration-300 ${
              isOpen ? "text-ink" : "text-ink-dim"
            }`}
          >
            {question}
          </span>
        </button>
      </h3>

      <motion.div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={
          reduce ? { duration: 0 } : { duration: 0.35, ease: [0.16, 1, 0.3, 1] }
        }
        className="overflow-hidden"
      >
        {/* Left padding matches the question text, not the mark. */}
        <p className="px-5 pb-5 text-[15px] leading-relaxed text-ink-dim sm:pl-[60px]">
          {answer}
        </p>
      </motion.div>
    </div>
  );
}

export function FaqSection() {
  /*
    Two independent columns, so opening an item never shifts the other column.
    The first item of each column starts open: the section reads as answers
    rather than as a wall of closed rows.
  */
  const [openIndexes, setOpenIndexes] = useState<number[]>([0, COLUMN_SIZE]);

  const toggle = (index: number) =>
    setOpenIndexes((prev) =>
      prev.includes(index)
        ? prev.filter((value) => value !== index)
        : [...prev, index],
    );

  const columns = [faqs.slice(0, COLUMN_SIZE), faqs.slice(COLUMN_SIZE)];

  return (
    <section id="faq" className="py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <Reveal>
          <h2 className="text-3xl font-medium tracking-tight text-balance md:text-4xl">
            Questions we hear first
          </h2>
          <p className="mt-5 max-w-[52ch] leading-relaxed text-ink-dim">
            What compliance teams, regulators and operators ask before a first
            call.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 lg:grid-cols-2 lg:gap-x-6">
          {columns.map((column, columnIndex) => (
            <div key={columnIndex} className="flex flex-col gap-4">
              {column.map((faq, rowIndex) => {
                const index = columnIndex * COLUMN_SIZE + rowIndex;
                return (
                  <Reveal key={faq.question} delay={rowIndex * 0.06}>
                    <FaqItem
                      question={faq.question}
                      answer={faq.answer}
                      index={index}
                      isOpen={openIndexes.includes(index)}
                      onToggle={() => toggle(index)}
                    />
                  </Reveal>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
