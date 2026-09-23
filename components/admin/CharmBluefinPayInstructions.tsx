import {
  CHARM_ONLINE_PAY_DOCS,
  CHARM_SIGNIN_URL,
  CHARM_STAFF_PAYMENT_GUIDE,
} from '@/lib/regen/charm-payments';

export function CharmBluefinPayInstructions({ title }: { title?: string }) {
  return (
    <div className="max-w-2xl mx-auto rounded-2xl border-4 border-black bg-white p-6 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
      <p className="text-xs font-bold uppercase tracking-widest text-[#E6007E]">
        REGEN payments
      </p>
      <h2 className="mt-1 text-2xl font-black text-gray-900">
        {title || 'Take the card in Charm with Bluefin'}
      </h2>
      <p className="mt-3 text-gray-700 font-medium">
        Stripe is off. Do not send a website checkout link. Square is spa booking only — not prescription products.
      </p>
      <ol className="mt-5 list-decimal space-y-2 pl-5 font-semibold text-gray-900">
        <li>
          Sign in to{' '}
          <a className="text-[#E6007E] underline" href={CHARM_SIGNIN_URL} target="_blank" rel="noopener noreferrer">
            Charm
          </a>
          .
        </li>
        <li>Open the patient → Billing → + Invoice. Clear Insurance / Payer (self-pay).</li>
        <li>Type a real Charge (not $0). Total / Balance Due must show dollars before Bluefin will run.</li>
        <li>Send Invoice → Send Payment Link (email and/or SMS) with the Bluefin beneficiary.</li>
        <li>After it posts, Danielle or Ryan opens the order and taps Send to Formulation.</li>
      </ol>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <a
          href={CHARM_STAFF_PAYMENT_GUIDE}
          className="inline-flex justify-center rounded-xl border-2 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-4 py-3 text-center font-bold text-white"
        >
          Open the staff pay kit
        </a>
        <a
          href={CHARM_ONLINE_PAY_DOCS}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex justify-center rounded-xl border-2 border-black bg-white px-4 py-3 text-center font-bold text-gray-900"
        >
          Charm online pay docs
        </a>
      </div>
    </div>
  );
}
