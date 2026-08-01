"use client";

import { useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { ArrowRight } from "@phosphor-icons/react";

/*
  Submits to Formspree, which forwards each entry straight to
  amazonhydrosense@gmail.com. This replaced an earlier mailto: link: that
  approach depended on the visitor's own mail client actually sending the
  draft, so a submission could silently never arrive. Formspree removes that
  dependency, and needs no backend of our own.
*/
const FORM_ENDPOINT = "https://formspree.io/f/mpqvgaqn";
const RECIPIENT = "amazonhydrosense@gmail.com";

type FormState = {
  name: string;
  company: string;
  email: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const initialState: FormState = {
  name: "",
  company: "",
  email: "",
  message: "",
};

function inputClass(hasError: boolean) {
  return [
    "w-full rounded-md border bg-background px-3.5 py-2.5 text-sm text-ink",
    "focus:outline-none focus:ring-2 focus:ring-accent/50",
    hasError ? "border-amber-500" : "border-line",
  ].join(" ");
}

function Field({
  label,
  hint,
  error,
  className,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={`grid gap-2 text-left ${className ?? ""}`}>
      <span className="flex items-baseline justify-between text-sm font-medium text-ink">
        {label}
        {hint && (
          <span className="text-xs font-normal text-ink-muted">{hint}</span>
        )}
      </span>
      {children}
      {error && <span className="text-xs text-amber-500">{error}</span>}
    </label>
  );
}

type SubmitState = "idle" | "submitting" | "sent" | "error";

export function DemoRequestForm() {
  const [values, setValues] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<SubmitState>("idle");

  function handleChange(field: keyof FormState) {
    return (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      setValues((v) => ({ ...v, [field]: value }));
      setErrors((err) => ({ ...err, [field]: undefined }));
    };
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const nextErrors: FormErrors = {};
    if (!values.name.trim()) nextErrors.name = "Enter your name.";
    if (!values.company.trim()) nextErrors.company = "Enter your company.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          company: values.company,
          email: values.email,
          message: values.message.trim() || "(no message)",
          _subject: `Amazon Hydro Sense demo request, ${values.company}`,
        }),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-xl border border-line bg-surface p-6 lg:p-8">
        <p className="text-sm font-medium text-ink">
          Request sent. We&apos;ll get back to you shortly.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-ink-dim">
          You can also reach us directly at{" "}
          <a
            href={`mailto:${RECIPIENT}`}
            className="text-accent underline underline-offset-2"
          >
            {RECIPIENT}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-xl border border-line bg-surface p-6 lg:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" error={errors.name}>
          <input
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={handleChange("name")}
            className={inputClass(!!errors.name)}
          />
        </Field>
        <Field label="Company" error={errors.company}>
          <input
            type="text"
            autoComplete="organization"
            value={values.company}
            onChange={handleChange("company")}
            className={inputClass(!!errors.company)}
          />
        </Field>
        <Field label="Work email" error={errors.email} className="sm:col-span-2">
          <input
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={handleChange("email")}
            className={inputClass(!!errors.email)}
          />
        </Field>
        <Field label="Message" hint="Optional">
          <textarea
            rows={3}
            value={values.message}
            onChange={handleChange("message")}
            className={inputClass(false)}
          />
        </Field>
      </div>

      {status === "error" && (
        <p className="mt-4 text-sm text-amber-500">
          Something went wrong sending this. Try again, or write to us
          directly at{" "}
          <a href={`mailto:${RECIPIENT}`} className="underline underline-offset-2">
            {RECIPIENT}
          </a>
          .
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-ink transition hover:bg-white active:translate-y-px disabled:opacity-60 sm:w-auto"
      >
        {status === "submitting" ? "Sending..." : "Book a demo"}
        {status !== "submitting" && <ArrowRight size={16} weight="bold" />}
      </button>
      <p className="mt-4 text-xs leading-relaxed text-ink-muted">
        We only use this information to respond to your request. It is never
        sold or shared with third parties.
      </p>
    </form>
  );
}
