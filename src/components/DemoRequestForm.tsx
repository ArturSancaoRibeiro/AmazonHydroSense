"use client";

import { useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { ArrowRight } from "@phosphor-icons/react";

/*
  No backend yet: submitting builds a mailto: link from the field values and
  hands off to the visitor's mail client. This is a placeholder funnel, not
  a lead-capture system, until a real form endpoint or CRM integration
  exists. B2B visitors almost always have a corporate mail client
  registered, so mailto: is the simpler default here.
*/
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

export function DemoRequestForm() {
  const [values, setValues] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [sent, setSent] = useState(false);

  function handleChange(field: keyof FormState) {
    return (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      setValues((v) => ({ ...v, [field]: value }));
      setErrors((err) => ({ ...err, [field]: undefined }));
    };
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
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

    const subject = `Amazon Hydro Sense demo request, ${values.company}`;
    const body = [
      `Name: ${values.name}`,
      `Company: ${values.company}`,
      `Email: ${values.email}`,
      "",
      values.message.trim() || "(no message)",
    ].join("\n");
    window.location.href = `mailto:${RECIPIENT}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  if (sent) {
    return (
      <div className="rounded-xl border border-line bg-surface p-6 lg:p-8">
        <p className="text-sm font-medium text-ink">
          Your email client should be open now.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-ink-dim">
          If nothing happened, write to us directly at{" "}
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
      <button
        type="submit"
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-ink transition hover:bg-white active:translate-y-px sm:w-auto"
      >
        Book a demo
        <ArrowRight size={16} weight="bold" />
      </button>
      <p className="mt-4 text-xs leading-relaxed text-ink-muted">
        We only use this information to respond to your request. It is never
        sold or shared with third parties.
      </p>
    </form>
  );
}
