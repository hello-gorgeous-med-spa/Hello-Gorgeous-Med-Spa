"use client";

import { useState } from "react";
import { SMSDisclosure, SMSConsentCheckbox } from "@/components/SMSDisclosure";

/**
 * Mobile opt-in block for 10DLC/MNO compliance.
 * Shown on /contact and /sms-opt-in so reviewers can verify the opt-in path.
 * Checkbox is NOT pre-checked.
 */
export function ContactSMSOptIn() {
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);

  return (
    <div className="mt-4 space-y-3">
      <label className="block text-sm font-medium text-black">
        Mobile number (optional)
      </label>
      <input
        type="tel"
        autoComplete="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="(630) 555-1234"
        className="w-full min-h-[44px] px-4 py-3 border border-black rounded-lg text-black placeholder:text-black/50 focus:ring-2 focus:ring-[#E6007E] focus:border-[#E6007E]"
      />
      <SMSDisclosure variant="light" className="!mt-2" />
      <SMSConsentCheckbox
        variant="light"
        required={false}
        checked={consent}
        onChange={setConsent}
      />
    </div>
  );
}
