'use client';

import Link from 'next/link';
import OwnerLayout from '../layout-wrapper';

export default function ClinicalPage() {
  return (
    <OwnerLayout title="Clinical Governance" description="Protocols, consents, and clinical standards.">
      <div className="space-y-6">
        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link 
            href="/admin/owner/consents"
            className="bg-white rounded-xl border p-6 hover:border-pink-300 hover:shadow-md transition-all group"
          >
            <div className="flex items-start gap-4">
              <span className="text-3xl">📋</span>
              <div>
                <h3 className="font-semibold text-lg group-hover:text-pink-600 transition-colors">Consents & Legal</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Manage all consent forms, print, download, and send to clients via email, SMS, or link.
                </p>
                <span className="text-pink-600 text-sm font-medium mt-2 inline-block">
                  Manage Forms →
                </span>
              </div>
            </div>
          </Link>

          <div className="bg-white rounded-xl border p-6 opacity-60">
            <div className="flex items-start gap-4">
              <span className="text-3xl">📖</span>
              <div>
                <h3 className="font-semibold text-lg">Treatment Protocols</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Clinical protocols and standard operating procedures for treatments.
                </p>
                <span className="text-gray-400 text-sm font-medium mt-2 inline-block">
                  Coming Soon
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border p-6 opacity-60">
            <div className="flex items-start gap-4">
              <span className="text-3xl">🩺</span>
              <div>
                <h3 className="font-semibold text-lg">Medical Director Oversight</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Medical director approvals, supervision requirements, and delegation.
                </p>
                <span className="text-gray-400 text-sm font-medium mt-2 inline-block">
                  Coming Soon
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border p-6 opacity-60">
            <div className="flex items-start gap-4">
              <span className="text-3xl">⚠️</span>
              <div>
                <h3 className="font-semibold text-lg">Adverse Event Tracking</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Track and manage adverse events, complications, and incident reports.
                </p>
                <span className="text-gray-400 text-sm font-medium mt-2 inline-block">
                  Coming Soon
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="font-medium text-blue-800">Clinical Governance Module</h3>
          <p className="text-sm text-blue-700 mt-1">
            This section manages clinical standards, consent requirements, and regulatory compliance. 
            The Consents & Legal section is fully operational for managing all patient consent forms.
          </p>
        </div>
      </div>
    </OwnerLayout>
  );
}
