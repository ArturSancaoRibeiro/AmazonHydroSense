import { resolveMx } from "node:dns/promises";
import { NextResponse } from "next/server";

/*
  Domain-level email check: confirms the email's domain has an MX record, i.e.
  a mail server actually configured to receive mail. This is NOT mailbox
  verification: it cannot tell whether a specific inbox exists, only that the
  domain is set up to receive email at all.

  Deliberately does NOT fall back to a domain's A/AAAA record. RFC 5321
  allows that as a legacy fallback, but in practice a domain with an A record
  and no MX almost never actually runs a mail server there, it's just a
  website, exactly the case that let a@f.co through before this existed.
  Requiring MX is the stronger, more accurate signal for "can this receive
  mail," which is the whole point of this check.

  Real mailbox verification needs an SMTP handshake or a paid third-party
  service; out of scope here.

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
    return NextResponse.json({ valid: false, reason: "no-mx-record" });
  } catch {
    return NextResponse.json({ valid: false, reason: "domain-unreachable" });
  }
}
