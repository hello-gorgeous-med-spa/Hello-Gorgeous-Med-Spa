/** Human-friendly staff notification subject + SMS label for website leads. */

const RX_INQUIRY = /^\[RX INQUIRY - ([^\]]+)\]/i;

const RX_LABELS: Record<string, string> = {
  metabolic: "Medical Weight Loss",
  hormones: "Hormone Optimization",
  peptides: "Peptides & Longevity",
  "sexual-health": "Sexual Wellness",
  dermatology: "Prescription Dermatology",
  membership: "RX Membership",
  general: "RX General",
};

function titleCase(s: string): string {
  return s
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

export function parseLeadNotification(message: string): {
  formLabel: string;
  emailSubject: string;
} {
  const rx = message.match(RX_INQUIRY);
  if (rx) {
    const key = rx[1]!.trim().toLowerCase();
    const formLabel = RX_LABELS[key] ?? titleCase(key);
    return {
      formLabel,
      emailSubject: `HG Lead: ${formLabel}`,
    };
  }
  return {
    formLabel: "Website Contact",
    emailSubject: "HG Lead: Website Contact",
  };
}

export function leadEmailSubject(formLabel: string, clientName: string): string {
  return `HG Lead: ${formLabel} — ${clientName}`;
}

/** Pull phone from RX form body: "Phone: 630..." */
export function extractPhoneFromLeadMessage(message: string): string | undefined {
  const m = message.match(/Phone:\s*([+\d().\s-]{10,})/i);
  const raw = m?.[1]?.replace(/\D/g, "");
  if (!raw || raw.length < 10) return undefined;
  if (raw.length === 10) return raw;
  if (raw.length === 11 && raw.startsWith("1")) return raw.slice(1);
  return raw;
}

export function leadEmailHtml(opts: {
  subjectLine: string;
  name: string;
  contact: string;
  message: string;
}): string {
  const escaped = (s: string) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  return `<!DOCTYPE html>
<html><body style="font-family:system-ui,sans-serif;line-height:1.5;color:#111;max-width:560px">
  <p style="margin:0 0 12px;font-size:13px;color:#666">Hello Gorgeous Med Spa · website lead</p>
  <h2 style="margin:0 0 16px;font-size:18px;color:#E6007E">${escaped(opts.subjectLine)}</h2>
  <p><strong>Name:</strong> ${escaped(opts.name)}</p>
  <p><strong>Contact:</strong> ${escaped(opts.contact)}</p>
  <hr style="border:none;border-top:1px solid #eee;margin:16px 0"/>
  <pre style="white-space:pre-wrap;font-family:inherit;font-size:14px;margin:0">${escaped(opts.message)}</pre>
  <p style="margin:24px 0 0;font-size:12px;color:#888">Reply to this email to reach the client (Reply-To is set).</p>
</body></html>`;
}
