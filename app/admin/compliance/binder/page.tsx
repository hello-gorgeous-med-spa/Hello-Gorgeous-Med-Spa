// ============================================================
// Compliance Binder — List of documents to view, print, or download
// ============================================================

'use client';

import Link from 'next/link';

const DOCUMENTS = [
  { slug: '00-README', title: 'Binder index (README)', description: 'Contents and how to use this binder.' },
  { slug: '01-botox-complication-protocol', title: 'Botox Complication Protocol', description: 'Recognition and management of botulinum toxin complications.' },
  { slug: '02-vascular-occlusion-emergency-protocol', title: 'Vascular Occlusion Emergency Protocol', description: 'Immediate response to suspected vascular occlusion from filler.' },
  { slug: '03-hyaluronidase-emergency-protocol', title: 'Hyaluronidase Emergency Protocol', description: 'Safe use of hyaluronidase for HA reversal.' },
  { slug: '04-laser-safety-protocol', title: 'Laser Safety Protocol', description: 'Laser/IPL safety, eye protection, training.' },
  { slug: '05-patient-consent-requirements', title: 'Patient Consent Requirements', description: 'When and how to obtain informed consent.' },
  { slug: '06-standing-orders-injectables', title: 'Standing Orders for Injectables', description: 'Physician-signed standing orders template.' },
  { slug: '07-chart-audit-checklist', title: 'Chart Audit Checklist', description: 'Periodic chart review checklist.' },
  { slug: '08-illinois-idfpr-inspection-readiness', title: 'Illinois IDFPR Inspection Readiness Checklist', description: 'License, supervision, protocols, inspection-day readiness.' },
];

// PDFs in public/compliance-binder/ — add ryan_2026_medical_director_agreement.pdf (export from .docx in Word)
const PDF_DOCUMENTS = [
  { file: 'ryan_2026_medical_director_agreement.pdf', title: 'Medical Director Agreement (Ryan 2026)', description: 'Medical director agreement for inspections and binder.' },
];

export default function ComplianceBinderPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-black">Compliance Binder</h1>
        <p className="text-black mt-1">
          Core documents for inspections and legal protection. View and print to PDF, or download the file for your binder.
        </p>
      </div>

      <ul className="space-y-4">
        {DOCUMENTS.map((doc) => (
          <li
            key={doc.slug}
            className="flex flex-wrap items-center gap-3 p-4 rounded-xl border border-gray-200 bg-white"
          >
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-black">{doc.title}</h2>
              <p className="text-sm text-gray-600 mt-0.5">{doc.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/compliance/binder/${doc.slug}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2D63A4] text-white text-sm font-medium hover:bg-[#002168]"
              >
                View &amp; print / Save as PDF
              </Link>
              <a
                href={`/api/compliance-binder/${doc.slug}?download=1`}
                download
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-black text-sm font-medium hover:bg-gray-50"
              >
                Download .md
              </a>
            </div>
          </li>
        ))}
      </ul>

      {PDF_DOCUMENTS.length > 0 && (
        <>
          <h2 className="text-lg font-semibold text-black mt-10 mb-3">Additional documents (PDFs)</h2>
          <p className="text-sm text-gray-600 mb-4">
            Add the PDF to your project at <code className="bg-gray-100 px-1 rounded">public/compliance-binder/</code> (e.g. export your .docx to PDF in Word, then save it there with the filename below).
          </p>
          <ul className="space-y-4">
            {PDF_DOCUMENTS.map((doc) => (
              <li
                key={doc.file}
                className="flex flex-wrap items-center gap-3 p-4 rounded-xl border border-gray-200 bg-white"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-black">{doc.title}</h3>
                  <p className="text-sm text-gray-600 mt-0.5">{doc.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`/compliance-binder/${doc.file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2D63A4] text-white text-sm font-medium hover:bg-[#002168]"
                  >
                    Open to print / Save as PDF
                  </a>
                  <a
                    href={`/compliance-binder/${doc.file}`}
                    download={doc.file}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-black text-sm font-medium hover:bg-gray-50"
                  >
                    Download PDF
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      <p className="mt-8 text-sm text-gray-600">
        <strong>Tip:</strong> Use &quot;View &amp; print&quot; then your browser&apos;s Print → &quot;Save as PDF&quot; to create PDFs for your binder. Or download the .md files and convert with Word or an online converter.
      </p>
    </div>
  );
}
