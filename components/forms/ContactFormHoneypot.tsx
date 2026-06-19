/** Hidden honeypot field — bots fill this; humans never see it. */
export function ContactFormHoneypot() {
  return (
    <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
      <label htmlFor="hg-contact-website">Website</label>
      <input
        type="text"
        id="hg-contact-website"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        defaultValue=""
      />
    </div>
  );
}
