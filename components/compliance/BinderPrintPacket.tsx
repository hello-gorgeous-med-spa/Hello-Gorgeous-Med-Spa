"use client";

import Link from "next/link";
import ReactMarkdown from "react-markdown";

import {
  BINDER_PDF_KITS,
  type BinderMdDoc,
} from "@/lib/compliance-binder-catalog";

export type BinderPrintDoc = BinderMdDoc & { content: string };

export default function BinderPrintPacket({ docs }: { docs: BinderPrintDoc[] }) {
  return (
    <>
      <div className="no-print mx-auto max-w-3xl px-6 pt-6 pb-4">
        <Link href="/admin/compliance/binder" className="text-sm font-medium text-[#2D63A4] hover:underline">
          ← Back to Compliance Binder
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-black">Print packet for Dr. Arora</h1>
        <p className="mt-2 text-sm text-black/75">
          This prints the cover/sign-off page plus core documents 01–12. Then print the three
          complete SOP kit PDFs (buttons below) and put everything in the front-desk binder after
          he signs.
        </p>
        <ol className="mt-4 list-decimal space-y-1 pl-5 text-sm text-black/80">
          <li>
            Click <strong>Print this packet</strong> → printer or Save as PDF.
          </li>
          <li>Print each complete kit PDF (Operations, Weight loss, Skin &amp; laser).</li>
          <li>
            Dr. Arora signs the adoption page and <strong>Standing Orders for Injectables</strong>.
          </li>
          <li>File the signed original at the front desk. Use this same page to reprint later.</li>
        </ol>
        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-lg bg-[#E6007E] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#c4006b]"
          >
            Print this packet
          </button>
          {BINDER_PDF_KITS.map((kit) => (
            <a
              key={kit.id}
              href={`/compliance-binder/${kit.complete.file}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-black/20 bg-white px-4 py-2.5 text-sm font-medium text-black hover:bg-gray-50"
            >
              Print {kit.title}
            </a>
          ))}
        </div>
      </div>

      <div className="print-packet mx-auto max-w-3xl px-6 py-6 text-black">
        {docs.map((doc) => (
          <section key={doc.slug} className="binder-section">
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h1 className="mb-3 text-2xl font-bold">{children}</h1>,
                h2: ({ children }) => <h2 className="mt-6 mb-2 text-xl font-bold">{children}</h2>,
                h3: ({ children }) => <h3 className="mt-4 mb-1 text-base font-semibold">{children}</h3>,
                p: ({ children }) => <p className="my-2 leading-relaxed">{children}</p>,
                ul: ({ children }) => <ul className="my-2 list-disc pl-6">{children}</ul>,
                ol: ({ children }) => <ol className="my-2 list-decimal pl-6">{children}</ol>,
                li: ({ children }) => <li className="my-0.5">{children}</li>,
                strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                table: ({ children }) => (
                  <div className="my-4 overflow-x-auto">
                    <table className="min-w-full border border-gray-300">{children}</table>
                  </div>
                ),
                thead: ({ children }) => <thead className="bg-gray-100">{children}</thead>,
                th: ({ children }) => (
                  <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">
                    {children}
                  </th>
                ),
                td: ({ children }) => <td className="border border-gray-300 px-3 py-2 text-sm">{children}</td>,
                tr: ({ children }) => <tr>{children}</tr>,
                tbody: ({ children }) => <tbody>{children}</tbody>,
                hr: () => <hr className="my-4 border-black/20" />,
                code: ({ children }) => <code className="rounded bg-gray-100 px-1 text-sm">{children}</code>,
              }}
            >
              {doc.content}
            </ReactMarkdown>
          </section>
        ))}
      </div>

      <style jsx global>{`
        @media print {
          .no-print,
          nav,
          header,
          aside,
          [data-admin-sidebar],
          .admin-panel > header,
          footer {
            display: none !important;
          }
          .print-packet {
            max-width: 100%;
            padding: 0;
          }
          .binder-section {
            break-before: page;
          }
          .binder-section:first-child {
            break-before: auto;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          @page {
            margin: 0.7in;
          }
        }
      `}</style>
    </>
  );
}
