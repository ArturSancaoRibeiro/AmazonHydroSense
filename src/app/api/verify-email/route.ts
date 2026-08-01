import { resolveMx, resolve4, resolve6 } from "node:dns/promises";
import { NextResponse } from "next/server";

/*
  Domain-level email check: confirms the email's domain has a mail server
  willing to receive mail (an MX record, or an A/AAAA record as the RFC 5321
  fallback for domains without MX). This is NOT mailbox verification: it
  cannot tell whether a specific inbox exists, only that the domain isn't
  fabricated (catches things like a@f.co, which has no mail-capable domain
  at all). Real mailbox verification needs an SMTP handshake or a paid
  third-party service; out of scope here.

  TEST_EXCEPTIONS bypasses the DNS check entirely so the team can keep
  testing the form without a deliverable inbox.
*/
const TEST_EXCEPTIONS = new Set(["teste-integracao@example.com"]);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let email: unknown;
  try {
    ({ email } = await request.json());
  } catch {
    return NextResponse.json({ valid: false, reason: "malformed-request" }, { status: 400 });
  }

  if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
    return NextResponse.json({ valid: false, reason: "invalid-format" });
  }

  const normalized = email.trim().toLowerCase();
  if (TEST_EXCEPTIONS.has(normalized)) {
    return NextResponse.json({ valid: true, reason: "test-exception" });
  }

  const domain = normalized.split("@")[1];

  try {
    const mx = await resolveMx(domain);
    if (mx.length > 0) {
      return NextResponse.json({ valid: true, reason: "mx-found" });
    }
  } catch {
    // No MX record. Fall through to the A/AAAA fallback below.
  }

  try {
    const [a4, a6] = await Promise.allSettled([resolve4(domain), resolve6(domain)]);
    const hasAddress =
      (a4.status === "fulfilled" && a4.value.length > 0) ||
      (a6.status === "fulfilled" && a6.value.length > 0);
    if (hasAddress) {
      return NextResponse.json({ valid: true, reason: "a-record-fallback" });
    }
  } catch {
    // Fall through to invalid below.
  }

  return NextResponse.json({ valid: false, reason: "domain-unreachable" });
}
