/** Block obvious bad / non-client addresses before marketing or review mail. */
export function isDeliverableMarketingEmail(raw: string | null | undefined): boolean {
  const email = (raw ?? "").trim().toLowerCase();
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return false;

  const [local, domain] = email.split("@");
  if (!local || !domain) return false;

  // School / student inboxes bounce and are not spa clients.
  if (domain.endsWith(".edu")) return false;
  if (domain.includes("students.") || domain.includes("student.")) return false;
  if (/^\d+@/.test(local) && (domain.includes("k12") || domain.includes("school"))) return false;

  // Role / disposable patterns
  if (/^(noreply|no-reply|donotreply|mailer-daemon)@/.test(email)) return false;

  return true;
}
