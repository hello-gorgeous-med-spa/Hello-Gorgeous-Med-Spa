// ============================================================
// SMS OPT-IN WORKFLOW
// 10DLC documentation: links, screenshots, and confirmation scripts
// For Telnyx campaign Message Flow field
// ============================================================

import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'SMS Opt-In Workflow | Hello Gorgeous Med Spa',
  description: 'SMS consent and opt-in workflow documentation for 10DLC compliance',
  robots: 'noindex, nofollow',
};

const BASE_URL = 'https://www.hellogorgeousmedspa.com';

export default function SmsOptInWorkflowPage() {
  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-black mb-2">SMS Opt-In Workflow</h1>
        <p className="text-black text-sm mb-8">
          Hello Gorgeous Med Spa • 10DLC campaign documentation
        </p>

        {/* Digital Opt-In */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-black mb-4">1. Digital Opt-In (Web Form)</h2>
          <div className="bg-white p-4 rounded-lg text-sm font-mono text-black whitespace-pre-wrap">
{`Message Flow:
• The user navigates to Hello Gorgeous Med Spa's website and subscribes via the online booking form at ${BASE_URL}/book
• The opt-in form clearly displays the phone number field and states:
  "I consent to receive recurring automated text messages (appointment reminders, confirmations, and promotional offers) at the phone number provided. Message frequency varies. Msg & data rates may apply. Reply STOP to opt out, HELP for help. Consent is not a condition of purchase. View our SMS Communications Policy."
• The SMS consent checkbox is optional, unchecked by default, and links to: ${BASE_URL}/privacy#sms-communications-policy
• Once the user submits the form with SMS consent checked, they receive a confirmation SMS (see Confirmation Script below)`}
          </div>
          <div className="mt-4 flex flex-wrap gap-4">
            <a
              href={`${BASE_URL}/book`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg text-sm font-medium hover:bg-pink-600"
            >
              Live Opt-In Form (Booking) →
            </a>
            <a
              href={`${BASE_URL}/privacy#sms-communications-policy`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 border border-black text-black rounded-lg text-sm font-medium hover:bg-white"
            >
              SMS Communications Policy →
            </a>
          </div>
          <p className="mt-3 text-sm text-black">
            <strong>Screenshot for Telnyx:</strong> Navigate to {BASE_URL}/book, select a service, proceed to the details step. The form shows the phone number field and SMS consent checkbox with full opt-in language.
          </p>
        </section>

        {/* Physical Opt-In */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-black mb-4">2. Physical Opt-In (Paper Form)</h2>
          <div className="bg-white p-4 rounded-lg text-sm font-mono text-black whitespace-pre-wrap">
{`Message Flow:
• The user fills out a paper form during their appointment/onboarding at 74 W. Washington St, Oswego, IL 60543 (learned via website, social media, or in-office)
• The form includes a phone number field, full SMS disclaimer, and signature line
• Disclaimer on form: "By signing this form and providing your phone number, you agree to receive SMS (appointment reminders, confirmations, and promotional offers) from Hello Gorgeous Med Spa. Message frequency may vary. Standard Message and Data Rates may apply. Reply STOP to opt out. Reply HELP for help. Consent is not a condition of purchase. Your mobile information will not be sold or shared with third parties for promotional or marketing purposes."
• Once the information is entered into the system, the user receives a confirmation SMS (see below)`}
          </div>
          <div className="mt-4">
            <a
              href={`${BASE_URL}/forms/sms-consent`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg text-sm font-medium hover:bg-pink-600"
            >
              View / Print Physical Form →
            </a>
          </div>
          <p className="mt-3 text-sm text-black">
            <strong>Screenshot for Telnyx:</strong> Open the link above and capture a screenshot showing the phone number field, complete SMS opt-in language, and signature line.
          </p>
        </section>

        {/* Confirmation SMS Script */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-black mb-4">3. Confirmation SMS Script</h2>
          <p className="text-sm text-black mb-3">
            Sent when a user opts in (digital or physical):
          </p>
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
            <p className="text-black font-medium text-sm mb-1">Confirmation message:</p>
            <p className="text-black text-sm">
              &ldquo;Hello Gorgeous Med Spa: You have agreed to receive SMS updates including appointment reminders and promotional offers. Msg frequency varies. Msg &amp; data rates may apply. Reply STOP to opt out, HELP for help.&rdquo;
            </p>
          </div>
          <p className="mt-3 text-xs text-black">
            Reference: <a href="https://support.telnyx.com/en/articles/10562019-guide-to-10dlc-message-flow-field" target="_blank" rel="noopener noreferrer" className="text-pink-600 underline">Telnyx Message Flow Guide</a>
          </p>
        </section>

        {/* Quick links for Telnyx submission */}
        <section className="border-t pt-6">
          <h2 className="text-lg font-semibold text-black mb-3">Links for Telnyx Campaign Resubmission</h2>
          <ul className="space-y-2 text-sm">
            <li>• <strong>Digital opt-in form:</strong> <a href={`${BASE_URL}/book`} className="text-pink-600 underline" target="_blank" rel="noopener noreferrer">{BASE_URL}/book</a></li>
            <li>• <strong>Physical form:</strong> <a href={`${BASE_URL}/forms/sms-consent`} className="text-pink-600 underline" target="_blank" rel="noopener noreferrer">{BASE_URL}/forms/sms-consent</a></li>
            <li>• <strong>SMS Communications Policy:</strong> <a href={`${BASE_URL}/privacy#sms-communications-policy`} className="text-pink-600 underline" target="_blank" rel="noopener noreferrer">{BASE_URL}/privacy#sms-communications-policy</a></li>
            <li>• <strong>Privacy Policy (SMS section):</strong> <a href={`${BASE_URL}/privacy#sms-mobile`} className="text-pink-600 underline" target="_blank" rel="noopener noreferrer">{BASE_URL}/privacy#sms-mobile</a></li>
          </ul>
        </section>

        <p className="mt-8 text-center text-black text-xs">
          <Link href="/" className="hover:text-black">← Back to Home</Link>
        </p>
      </div>
    </div>
  );
}
