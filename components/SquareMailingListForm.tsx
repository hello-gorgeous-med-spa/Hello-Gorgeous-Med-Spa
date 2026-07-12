import {
  SQUARE_MAILING_LIST_ENROLL_URL,
  SQUARE_MAILING_LIST_SUBSCRIBE_ACTION,
} from "@/lib/flows";

type Theme = "dark" | "light";

/**
 * Square Outreach email subscribe — posts to Square (opens confirmation in a new tab).
 */
export function SquareMailingListForm({
  theme = "dark",
  className = "",
  id,
  heading = "Get offers & updates",
  subcopy = "Specials, new services, and booking reminders — no spam.",
  showSmsLink = true,
}: {
  theme?: Theme;
  className?: string;
  id?: string;
  heading?: string;
  subcopy?: string;
  /** Link to Square Customer Programs enroll (email + optional SMS). */
  showSmsLink?: boolean;
}) {
  const isDark = theme === "dark";

  return (
    <div id={id} className={className.trim()}>
      {heading ? (
        <p
          className={`text-xs font-bold uppercase tracking-wider ${
            isDark ? "text-[#FFB8DC]" : "text-[#E6007E]"
          }`}
        >
          {heading}
        </p>
      ) : null}
      {subcopy ? (
        <p className={`mt-1 text-sm leading-relaxed ${isDark ? "text-white/70" : "text-black/65"}`}>
          {subcopy}
        </p>
      ) : null}
      <form
        action={SQUARE_MAILING_LIST_SUBSCRIBE_ACTION}
        method="POST"
        target="_blank"
        className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-stretch"
        aria-label="Join Hello Gorgeous mailing list"
      >
        <label className="sr-only" htmlFor="square-mailing-email">
          Email address
        </label>
        <input
          id="square-mailing-email"
          type="email"
          name="email_address"
          required
          autoComplete="email"
          placeholder="Your email address"
          className={`min-w-0 flex-1 rounded-full border-2 px-4 py-2.5 text-sm outline-none transition focus:border-[#E6007E] ${
            isDark
              ? "border-white/20 bg-white/10 text-white placeholder:text-white/45"
              : "border-black/15 bg-white text-black placeholder:text-black/40"
          }`}
        />
        <input type="hidden" name="embed" value="true" />
        <button
          type="submit"
          className="shrink-0 rounded-full border-2 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-5 py-2.5 text-sm font-bold text-white shadow-[3px_3px_0_0_rgba(230,0,126,0.35)] transition hover:brightness-110"
        >
          Join now
        </button>
      </form>
      {showSmsLink ? (
        <p className={`mt-2 text-[11px] ${isDark ? "text-white/50" : "text-black/50"}`}>
          Want texts too?{" "}
          <a
            href={SQUARE_MAILING_LIST_ENROLL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`font-semibold underline underline-offset-2 ${
              isDark ? "text-[#FFB8DC] hover:text-white" : "text-[#E6007E] hover:text-black"
            }`}
          >
            Full Square signup
          </a>
        </p>
      ) : null}
    </div>
  );
}
