import Link from "next/link";

/**
 * Static SMS disclosure for server components.
 * Used on /book page for 10DLC/MNO compliance verification.
 * Shows the required disclosure text without interactive elements.
 */
export function SMSDisclosureStatic() {
  return (
    <div
      className="rounded-lg p-4 text-sm leading-relaxed bg-black text-white"
      style={{ fontSize: "14px" }}
      role="region"
      aria-label="SMS consent disclosure"
    >
      <p className="font-semibold mb-2">SMS Opt-In Disclosure:</p>
      <p>
        By providing your mobile phone number, you agree to receive SMS messages from
        Hello Gorgeous Med Spa regarding appointments, updates, and promotional
        offers. Message frequency varies (up to 4 messages per month). Message
        &amp; data rates may apply. Reply <strong>STOP</strong> to unsubscribe. Reply <strong>HELP</strong> for
        help. View our{" "}
        <Link href="https://www.hellogorgeousmedspa.com/privacy" className="underline text-[#FF2D8E] hover:text-[#FF2D8E]/90">
          Privacy Policy
        </Link>
        .
      </p>
      <p className="mt-3 text-white/80 text-xs">
        The checkbox is not pre-checked and requires affirmative consent.
      </p>
    </div>
  );
}
