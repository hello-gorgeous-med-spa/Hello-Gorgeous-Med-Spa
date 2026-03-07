// ============================================================
// Printable compliance binder document — View and Print / Save as PDF
// ============================================================

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

const ALLOWED_SLUGS = [
  '00-README',
  '01-botox-complication-protocol',
  '02-vascular-occlusion-emergency-protocol',
  '03-hyaluronidase-emergency-protocol',
  '04-laser-safety-protocol',
  '05-patient-consent-requirements',
  '06-standing-orders-injectables',
  '07-chart-audit-checklist',
  '08-illinois-idfpr-inspection-readiness',
];

const SLUG_TITLES: Record<string, string> = {
  '00-README': 'Compliance Binder — Index',
  '01-botox-complication-protocol': 'Botox Complication Protocol',
  '02-vascular-occlusion-emergency-protocol': 'Vascular Occlusion Emergency Protocol',
  '03-hyaluronidase-emergency-protocol': 'Hyaluronidase Emergency Protocol',
  '04-laser-safety-protocol': 'Laser Safety Protocol',
  '05-patient-consent-requirements': 'Patient Consent Requirements',
  '06-standing-orders-injectables': 'Standing Orders for Injectables',
  '07-chart-audit-checklist': 'Chart Audit Checklist',
  '08-illinois-idfpr-inspection-readiness': 'Illinois IDFPR Inspection Readiness Checklist',
};

export default function BinderDocumentPage({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState<string | null>(null);
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const resolved = await params;
      const s = resolved?.slug;
      if (!s || !ALLOWED_SLUGS.includes(s)) {
        setError('Document not found');
        setLoading(false);
        return;
      }
      setSlug(s);
      try {
        const res = await fetch(`/api/compliance-binder/${s}`);
        if (!res.ok) throw new Error('Failed to load');
        const text = await res.text();
        if (!cancelled) setContent(text);
      } catch (e) {
        if (!cancelled) setError('Could not load document.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [params]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <p className="text-gray-600">Loading…</p>
      </div>
    );
  }

  if (error || !slug) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <p className="text-red-600">{error || 'Not found'}</p>
        <Link href="/admin/compliance/binder" className="text-[#2D63A4] hover:underline mt-2 inline-block">← Back to Binder</Link>
      </div>
    );
  }

  const title = SLUG_TITLES[slug] || slug;

  return (
    <>
      {/* Screen-only: back link and actions */}
      <div className="no-print max-w-3xl mx-auto px-6 pt-6 flex flex-wrap items-center justify-between gap-4">
        <Link href="/admin/compliance/binder" className="text-[#2D63A4] hover:underline font-medium">
          ← Back to Compliance Binder
        </Link>
        <div className="flex items-center gap-2">
          <a
            href={`/api/compliance-binder/${slug}?download=1`}
            download
            className="px-4 py-2 rounded-lg border border-gray-300 text-black text-sm font-medium hover:bg-gray-50"
          >
            Download .md
          </a>
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 rounded-lg bg-[#2D63A4] text-white text-sm font-medium hover:bg-[#002168]"
          >
            Print / Save as PDF
          </button>
        </div>
      </div>

      {/* Printable content */}
      <div className="print-doc max-w-3xl mx-auto px-6 py-8">
        <div className="prose prose-neutral max-w-none">
          <h1 className="text-2xl font-bold text-black mb-6">{title}</h1>
          {content ? (
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h2 className="text-xl font-bold mt-6 mb-2">{children}</h2>,
                h2: ({ children }) => <h3 className="text-lg font-semibold mt-4 mb-2">{children}</h3>,
                h3: ({ children }) => <h4 className="text-base font-semibold mt-3 mb-1">{children}</h4>,
                p: ({ children }) => <p className="my-2">{children}</p>,
                ul: ({ children }) => <ul className="list-disc pl-6 my-2">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-6 my-2">{children}</ol>,
                li: ({ children }) => <li className="my-0.5">{children}</li>,
                strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                table: ({ children }) => (
                  <div className="overflow-x-auto my-4">
                    <table className="min-w-full border border-gray-300">{children}</table>
                  </div>
                ),
                thead: ({ children }) => <thead className="bg-gray-100">{children}</thead>,
                th: ({ children }) => (
                  <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="border border-gray-300 px-3 py-2 text-sm">{children}</td>
                ),
                tr: ({ children }) => <tr>{children}</tr>,
                tbody: ({ children }) => <tbody>{children}</tbody>,
                code: ({ children }) => (
                  <code className="bg-gray-100 px-1 rounded text-sm">{children}</code>
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          ) : null}
        </div>
      </div>

      <style jsx global>{`
        @media print {
          .no-print,
          nav,
          header,
          [data-admin-sidebar] {
            display: none !important;
          }
          .print-doc {
            max-width: 100%;
            padding: 0;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </>
  );
}
