'use client';

// ============================================================
// CHARM EHR INTEGRATION PAGE
// Connect to Charm Health for EHR & E-Prescribing
// ============================================================

import { useState } from 'react';
import Link from 'next/link';

export default function CharmEHRPage() {
  const [charmConnected, setCharmConnected] = useState(false);
  const [showSetupGuide, setShowSetupGuide] = useState(true);

  // Charm Health URLs
  const CHARM_URLS = {
    login: 'https://ehr.charmhealth.com/',
    signup: 'https://www.charmhealth.com/signup.html',
    dashboard: 'https://ehr.charmhealth.com/allpatients/list',
    newPatient: 'https://ehr.charmhealth.com/patient/new',
    appointments: 'https://ehr.charmhealth.com/appointments',
    prescriptions: 'https://ehr.charmhealth.com/erx',
    epcsEnroll: 'https://www.charmhealth.com/resources/addons/epcs-enrollment-new.html',
    pricing: 'https://www.charmhealth.com/ehr/ehr-pricing-us.html',
    api: 'https://www.charmhealth.com/resources/ehr-api-program.html',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Charm EHR</h1>
          <p className="text-gray-500">Electronic Health Records & E-Prescribing</p>
        </div>
        <div className="flex gap-3">
          <a
            href={CHARM_URLS.login}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600"
          >
            Open Charm EHR →
          </a>
        </div>
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <a
          href={CHARM_URLS.dashboard}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg hover:border-pink-200 transition-all group"
        >
          <span className="text-3xl">👥</span>
          <h3 className="font-semibold text-gray-900 mt-3 group-hover:text-pink-600">Patient Records</h3>
          <p className="text-sm text-gray-500 mt-1">View all patients in Charm</p>
        </a>

        <a
          href={CHARM_URLS.prescriptions}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg hover:border-pink-200 transition-all group"
        >
          <span className="text-3xl">💊</span>
          <h3 className="font-semibold text-gray-900 mt-3 group-hover:text-pink-600">E-Prescribe</h3>
          <p className="text-sm text-gray-500 mt-1">Send prescriptions to pharmacies</p>
        </a>

        <a
          href={CHARM_URLS.appointments}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg hover:border-pink-200 transition-all group"
        >
          <span className="text-3xl">📅</span>
          <h3 className="font-semibold text-gray-900 mt-3 group-hover:text-pink-600">Appointments</h3>
          <p className="text-sm text-gray-500 mt-1">Charm calendar view</p>
        </a>

        <a
          href={CHARM_URLS.newPatient}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg hover:border-pink-200 transition-all group"
        >
          <span className="text-3xl">➕</span>
          <h3 className="font-semibold text-gray-900 mt-3 group-hover:text-pink-600">New Patient</h3>
          <p className="text-sm text-gray-500 mt-1">Add patient to Charm</p>
        </a>
      </div>

      {/* Setup Guide */}
      {showSetupGuide && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold text-blue-900">🚀 Getting Started with Charm EHR</h3>
            <button 
              onClick={() => setShowSetupGuide(false)}
              className="text-blue-400 hover:text-blue-600"
            >
              ✕
            </button>
          </div>
          
          <div className="mt-4 space-y-4">
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
              <div>
                <h4 className="font-semibold text-gray-900">Create Charm Account (Free)</h4>
                <p className="text-sm text-gray-600 mt-1">Sign up at charmhealth.com - the basic EHR is completely free for up to 50 encounters/month.</p>
                <a 
                  href={CHARM_URLS.signup}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-sm text-blue-600 font-medium hover:text-blue-700"
                >
                  Sign Up for Charm →
                </a>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
              <div>
                <h4 className="font-semibold text-gray-900">Enable E-Prescribing (eRx)</h4>
                <p className="text-sm text-gray-600 mt-1">Add the e-Prescribing module to send prescriptions to 70,000+ pharmacies. Drug database with interaction alerts included.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
              <div>
                <h4 className="font-semibold text-gray-900">Enroll in EPCS (Controlled Substances)</h4>
                <p className="text-sm text-gray-600 mt-1">Required for Semaglutide (Ozempic/Wegovy), Tirzepatide, and other controlled medications. Requires DEA number and identity verification.</p>
                <a 
                  href={CHARM_URLS.epcsEnroll}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-sm text-blue-600 font-medium hover:text-blue-700"
                >
                  EPCS Enrollment Guide →
                </a>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">4</div>
              <div>
                <h4 className="font-semibold text-gray-900">Import/Sync Patients</h4>
                <p className="text-sm text-gray-600 mt-1">We can sync your patient list from Hello Gorgeous to Charm via their API for seamless records.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charm Features */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Free Features */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 bg-green-50 border-b border-green-100">
            <h3 className="font-semibold text-green-900">✅ Free Features (Included)</h3>
          </div>
          <div className="p-6">
            <ul className="space-y-3">
              {[
                '50 encounters/month',
                'Electronic health records',
                'Custom templates & flowsheets',
                'Appointment scheduling',
                'Practice management',
                'Lab integration',
                'Secure patient messaging',
                'Task management',
                'Inventory management',
                'Business analytics',
                'Mobile app access',
                'HIPAA compliant',
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="text-green-500">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Paid Add-ons */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 bg-purple-50 border-b border-purple-100">
            <h3 className="font-semibold text-purple-900">💎 Paid Add-ons</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="p-4 border border-purple-100 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-gray-900">E-Prescribing (eRx)</h4>
                  <p className="text-sm text-gray-600 mt-1">Send prescriptions to pharmacies electronically</p>
                </div>
                <span className="text-pink-600 font-medium">Required</span>
              </div>
              <ul className="mt-3 space-y-1 text-sm text-gray-600">
                <li>• 70,000+ connected pharmacies</li>
                <li>• Drug-drug interaction alerts</li>
                <li>• Refill request management</li>
              </ul>
            </div>

            <div className="p-4 border border-purple-100 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-gray-900">EPCS (Controlled Substances)</h4>
                  <p className="text-sm text-gray-600 mt-1">Prescribe Schedule II-V medications</p>
                </div>
                <span className="text-pink-600 font-medium">Required</span>
              </div>
              <ul className="mt-3 space-y-1 text-sm text-gray-600">
                <li>• Semaglutide, Tirzepatide, etc.</li>
                <li>• DEA & NIST certified</li>
                <li>• Two-factor authentication</li>
                <li>• PMP gateway access</li>
              </ul>
            </div>

            <div className="p-4 border border-gray-100 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-gray-900">Fax Integration</h4>
                  <p className="text-sm text-gray-600 mt-1">Send/receive faxes within Charm</p>
                </div>
                <span className="text-gray-400 font-medium">Optional</span>
              </div>
            </div>

            <a
              href={CHARM_URLS.pricing}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center py-2 text-pink-600 font-medium hover:text-purple-700"
            >
              View Full Pricing →
            </a>
          </div>
        </div>
      </div>

      {/* Common Prescriptions for Med Spa */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">💊 Common Med Spa Prescriptions</h3>
          <p className="text-sm text-gray-500">What you'll prescribe through Charm</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-pink-50 rounded-lg">
              <h4 className="font-semibold text-pink-900">Weight Loss</h4>
              <ul className="mt-2 space-y-1 text-sm text-pink-800">
                <li>• Semaglutide (Ozempic/Wegovy)</li>
                <li>• Tirzepatide (Mounjaro/Zepbound)</li>
                <li>• Phentermine</li>
                <li>• Metformin</li>
              </ul>
              <p className="text-xs text-pink-600 mt-2">⚠️ Requires EPCS</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-900">Topicals</h4>
              <ul className="mt-2 space-y-1 text-sm text-purple-800">
                <li>• Tretinoin (Retin-A)</li>
                <li>• Hydroquinone</li>
                <li>• Latisse</li>
                <li>• Custom compounds</li>
              </ul>
              <p className="text-xs text-pink-600 mt-2">✓ Basic eRx</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900">Other</h4>
              <ul className="mt-2 space-y-1 text-sm text-blue-800">
                <li>• Antivirals (cold sore)</li>
                <li>• Antibiotics (if needed)</li>
                <li>• Anti-nausea for GLP-1</li>
                <li>• Supplements</li>
              </ul>
              <p className="text-xs text-blue-600 mt-2">✓ Basic eRx</p>
            </div>
          </div>
        </div>
      </div>

      {/* API Integration Note */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-2">🔗 Future Integration</h3>
        <p className="text-gray-600 text-sm">
          Charm offers REST APIs and FHIR APIs for deeper integration. We can potentially:
        </p>
        <ul className="mt-3 space-y-1 text-sm text-gray-600">
          <li>• Sync patients between Hello Gorgeous and Charm automatically</li>
          <li>• Show Charm prescription history in Hello Gorgeous patient profiles</li>
          <li>• Launch Charm directly to a specific patient from client list</li>
          <li>• Pull medication data into your charting notes</li>
        </ul>
        <a
          href={CHARM_URLS.api}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-3 text-sm text-pink-600 font-medium hover:text-pink-700"
        >
          View Charm API Documentation →
        </a>
      </div>

      {/* Quick Links */}
      <div className="flex flex-wrap gap-3">
        <a
          href="https://www.charmhealth.com/resources/videos.html"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
        >
          📹 Training Videos
        </a>
        <a
          href="https://www.charmhealth.com/resources/faq.html"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
        >
          ❓ FAQ
        </a>
        <a
          href="https://www.charmhealth.com/support.html"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
        >
          🎧 Charm Support
        </a>
      </div>
    </div>
  );
}
