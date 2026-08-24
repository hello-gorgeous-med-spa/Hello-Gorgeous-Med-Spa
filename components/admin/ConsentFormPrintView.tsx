"use client";

import Link from "next/link";
import { useEffect } from "react";

import type { ConsentForm } from "@/lib/hgos/consent-forms";

type Props = {
  form: ConsentForm;
  autoPrint?: boolean;
};

export function ConsentFormPrintView({ form, autoPrint = false }: Props) {
  useEffect(() => {
    if (!autoPrint) return;
    const timer = window.setTimeout(() => window.print(), 400);
    return () => window.clearTimeout(timer);
  }, [autoPrint]);

  return (
    <>
      <div className="no-print mx-auto max-w-3xl px-6 py-5">
        <Link
          href="/admin/owner/consents"
          className="text-sm font-medium text-[#2D63A4] hover:underline"
        >
          ← Back to consent library
        </Link>
        <h1 className="mt-3 text-xl font-bold text-black">{form.name}</h1>
        <p className="mt-1 text-sm text-black/65">
          Version {form.version} · {form.lastUpdated}. Print this page — or in the print dialog choose{" "}
          <strong>Save as PDF</strong>. The sidebar and admin chrome will not print.
        </p>
        <button
          type="button"
          onClick={() => window.print()}
          className="mt-4 rounded-lg bg-[#E6007E] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#c4006b]"
        >
          Print / Save as PDF
        </button>
      </div>

      <article className="consent-print mx-auto max-w-[8.5in] bg-white px-8 py-6 text-black">
        <div dangerouslySetInnerHTML={{ __html: form.content }} />
        <div className="mt-12 border-t border-black/20 pt-6">
          <p>
            <strong>Patient Signature:</strong>{" "}
            <span className="signature-line" />
          </p>
          <p>
            <strong>Printed Name:</strong>{" "}
            <span className="signature-line" />
          </p>
          <p>
            <strong>Date:</strong> <span className="date-line" />
          </p>
          <p className="mt-6 text-[10pt] text-black/55">
            Form Version: {form.version} | Last Updated: {form.lastUpdated} | Hello Gorgeous Med Spa
          </p>
        </div>
      </article>

      <style jsx global>{`
        .consent-print {
          font-family: "Times New Roman", Times, serif;
          font-size: 12pt;
          line-height: 1.55;
        }
        .consent-print h2 {
          text-align: center;
          font-size: 16pt;
          margin: 0 0 16px;
        }
        .consent-print h3 {
          font-size: 13pt;
          margin: 18px 0 8px;
        }
        .consent-print .clinic-name {
          text-align: center;
          margin-bottom: 24px;
        }
        .consent-print .important-notice {
          background: #fff3cd;
          padding: 12px 14px;
          border: 1px solid #ffc107;
          margin: 16px 0;
        }
        .consent-print .warning-box {
          background: #f8d7da;
          padding: 12px 14px;
          border: 1px solid #f5c6cb;
          margin: 16px 0;
        }
        .consent-print ul {
          margin: 8px 0 8px 22px;
        }
        .consent-print li {
          margin-bottom: 4px;
        }
        .signature-line,
        .date-line {
          display: inline-block;
          border-bottom: 1px solid #000;
          margin: 6px 0;
          min-height: 1.2em;
        }
        .signature-line {
          width: 280px;
        }
        .date-line {
          width: 140px;
        }
        @media print {
          .no-print {
            display: none !important;
          }
          body * {
            visibility: hidden !important;
          }
          .consent-print,
          .consent-print * {
            visibility: visible !important;
          }
          .consent-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            max-width: none;
            margin: 0;
            padding: 0;
            background: white;
          }
          body {
            background: white !important;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          @page {
            margin: 0.6in;
            size: letter;
          }
        }
      `}</style>
    </>
  );
}
