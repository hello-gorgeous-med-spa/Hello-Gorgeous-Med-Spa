// ============================================================
// PHYSICAL SMS CONSENT FORM
// Printable form for in-office opt-in (10DLC compliance)
// ============================================================

import { Metadata } from 'next';
import PrintButton from './PrintButton';

export const metadata: Metadata = {
  title: 'SMS Consent Form | Hello Gorgeous Med Spa',
  description: 'Paper form for SMS opt-in',
  robots: 'noindex, nofollow',
};

export default function SmsConsentFormPage() {
  return (
    <div className="min-h-screen bg-white p-8 print:p-4">
      <div className="max-w-2xl mx-auto">
        {/* Printable form */}
        <div className="border-2 border-gray-300 p-8 print:border-gray-400">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Hello Gorgeous Med Spa</h1>
          <p className="text-gray-600 text-sm mb-6">74 W. Washington St, Oswego, IL 60543 • (630) 636-6193</p>

          <h2 className="text-lg font-semibold text-gray-900 mb-4">SMS/Text Message Consent</h2>

          <div className="space-y-4 text-sm text-gray-800">
            <p>
              By signing this form and providing your phone number, you agree to receive SMS (text) messages from Hello Gorgeous Med Spa related to:
            </p>
            <ul className="list-disc list-inside ml-2 space-y-1">
              <li>Appointment reminders</li>
              <li>Appointment confirmations</li>
              <li>Post-treatment follow-ups</li>
              <li>Promotional offers and announcements</li>
            </ul>
            <p>
              Message frequency may vary. Standard Message and Data Rates may apply. Reply <strong>STOP</strong> to opt out. Reply <strong>HELP</strong> for help. Consent is not a condition of purchase.
            </p>
            <p className="font-medium">
              Your mobile information will not be sold or shared with third parties for promotional or marketing purposes.
            </p>
          </div>

          <div className="mt-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <div className="border-b-2 border-gray-400 h-10" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Print Name</label>
              <div className="border-b-2 border-gray-400 h-10" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Signature</label>
              <div className="border-b-2 border-gray-400 h-14" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <div className="border-b-2 border-gray-400 h-10 w-32" />
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500 print:hidden">
          <PrintButton />
        </p>
      </div>
    </div>
  );
}
