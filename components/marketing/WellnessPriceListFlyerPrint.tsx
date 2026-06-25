import { SITE } from "@/lib/seo";
import {
  WELLNESS_BROCHURE_FEATURED,
  WELLNESS_PRICE_LIST_PATH,
  WELLNESS_PRICE_LIST_SECTIONS,
} from "@/lib/wellness-price-list";

const QR_BOOK = `/api/app/qr-code?target=${encodeURIComponent("/wellness-price-list")}&utm_medium=brochure&utm_campaign=wellness_menu&width=256`;

function BrochureItem({
  item,
  small,
}: {
  item: (typeof WELLNESS_BROCHURE_FEATURED)[number];
  small?: boolean;
}) {
  return (
    <div className={`brochure-item ${small ? "brochure-item-sm" : ""}`}>
      {item.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.image} alt="" className="brochure-thumb" />
      ) : (
        <div className="brochure-thumb brochure-thumb-placeholder" />
      )}
      <div className="brochure-item-body">
        <p className="brochure-item-name">{item.name}</p>
        <p className="brochure-item-price">{item.priceLabel}</p>
        {item.memberPriceLabel ? (
          <p className="brochure-item-member">{item.memberPriceLabel}</p>
        ) : null}
      </div>
    </div>
  );
}

export function WellnessPriceListFlyerPrint() {
  const peptideSection = WELLNESS_PRICE_LIST_SECTIONS.find((s) => s.id === "peptides")!;
  const vitaminSection = WELLNESS_PRICE_LIST_SECTIONS.find((s) => s.id === "vitamins")!;
  const hormoneSection = WELLNESS_PRICE_LIST_SECTIONS.find((s) => s.id === "hormones")!;
  const glp1Section = WELLNESS_PRICE_LIST_SECTIONS.find((s) => s.id === "glp1")!;

  return (
    <div className="brochure-root">
      <p className="print:hidden mb-4 text-center text-sm text-black/60 max-w-xl mx-auto px-4">
        Print this brochure (portrait, color). Page 1 = cover + featured menu. Page 2 = full peptide &amp; hormone
        lists. Use <strong>Print → Save as PDF</strong> to share digitally.
      </p>

      {/* Page 1 — cover + featured grid */}
      <article className="brochure-page">
        <header className="brochure-header">
          <div>
            <p className="brochure-kicker">Hello Gorgeous Med Spa · Oswego, IL</p>
            <h1 className="brochure-title">
              Wellness Menu
              <span className="brochure-title-accent">2026</span>
            </h1>
            <p className="brochure-subtitle">
              Peptides · Vitamin Bar · Hormones · GLP-1
              <br />
              NP-supervised · published starting rates
            </p>
          </div>
          <div className="brochure-qr-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={QR_BOOK} alt="Scan for full menu" width={88} height={88} className="brochure-qr" />
            <p className="brochure-qr-label">Scan for full menu</p>
          </div>
        </header>

        <div className="brochure-featured-grid">
          {WELLNESS_BROCHURE_FEATURED.map((item) => (
            <BrochureItem key={item.id} item={item} />
          ))}
        </div>

        <footer className="brochure-footer">
          <p>
            <strong>{SITE.phone}</strong> · {SITE.address.streetAddress}, {SITE.address.addressLocality}, IL
          </p>
          <p className="brochure-footer-url">hellogorgeousmedspa.com{WELLNESS_PRICE_LIST_PATH}</p>
          <p className="brochure-disclaimer">
            Starting rates only. NP consult required for peptides, hormones &amp; GLP-1. Final quote confirmed at visit.
          </p>
        </footer>
      </article>

      {/* Page 2 — compact full lists */}
      <article className="brochure-page brochure-page-2">
        <div className="brochure-columns">
          <section>
            <h2 className="brochure-section-title">Peptides — from /mo</h2>
            <ul className="brochure-list">
              {peptideSection.items.map((item) => (
                <li key={item.id}>
                  <span>{item.name}</span>
                  <span className="brochure-list-price">{item.priceLabel.replace("From ", "")}</span>
                </li>
              ))}
            </ul>
            <p className="brochure-mini-note">$49 NP consult · 10% off 3-mo prepay on medication</p>
          </section>

          <section>
            <h2 className="brochure-section-title">Vitamin Bar shots</h2>
            <ul className="brochure-list">
              {vitaminSection.items.map((item) => (
                <li key={item.id}>
                  <span>{item.name}</span>
                  <span className="brochure-list-price">
                    {item.priceLabel}
                    {item.memberPriceLabel ? ` · ${item.memberPriceLabel}` : ""}
                  </span>
                </li>
              ))}
            </ul>

            <h2 className="brochure-section-title brochure-section-title-spaced">Hormones</h2>
            <ul className="brochure-list">
              {hormoneSection.items.map((item) => (
                <li key={item.id}>
                  <span>{item.name}</span>
                  <span className="brochure-list-price">{item.priceLabel}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="brochure-section-title">GLP-1 weight loss</h2>
            <ul className="brochure-list">
              {glp1Section.items.map((item) => (
                <li key={item.id}>
                  <span>{item.name}</span>
                  <span className="brochure-list-price">{item.priceLabel}</span>
                </li>
              ))}
            </ul>

            <div className="brochure-cta-box">
              <p className="brochure-cta-headline">Book your consult</p>
              <p className="brochure-cta-body">
                Ryan Kent, FNP-BC · full prescriptive authority
                <br />
                {SITE.phone} · Fresha &amp; Hello Gorgeous app
              </p>
            </div>
          </section>
        </div>
      </article>

      <style>{`
        .brochure-root {
          min-height: 100vh;
          background: #e5e5e5;
          padding: 1rem;
        }
        .brochure-page {
          max-width: 8.5in;
          min-height: 10.9in;
          margin: 0 auto 1rem;
          padding: 0.45in;
          background: #fff;
          border: 4px solid #000;
          box-shadow: 8px 8px 0 rgba(230, 0, 126, 0.35);
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
        }
        .brochure-header {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          align-items: flex-start;
          padding-bottom: 0.35in;
          border-bottom: 4px solid #000;
          margin-bottom: 0.3in;
        }
        .brochure-kicker {
          font-size: 9pt;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #E6007E;
          margin: 0 0 6px;
        }
        .brochure-title {
          font-size: 28pt;
          font-weight: 900;
          line-height: 1;
          margin: 0;
          color: #000;
        }
        .brochure-title-accent {
          display: block;
          font-size: 14pt;
          background: linear-gradient(90deg, #FFB8DC, #FF2D8E, #E6007E);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          margin-top: 4px;
        }
        .brochure-subtitle {
          font-size: 10pt;
          font-weight: 600;
          color: #333;
          margin: 10px 0 0;
          line-height: 1.45;
        }
        .brochure-qr-block { text-align: center; flex-shrink: 0; }
        .brochure-qr { display: block; border: 2px solid #000; }
        .brochure-qr-label { font-size: 7pt; font-weight: 700; margin: 4px 0 0; color: #555; }
        .brochure-featured-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          flex: 1;
        }
        .brochure-item {
          border: 2px solid #000;
          border-radius: 8px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          background: #fff;
        }
        .brochure-thumb {
          width: 100%;
          aspect-ratio: 16 / 9;
          object-fit: cover;
          display: block;
          border-bottom: 2px solid #000;
        }
        .brochure-thumb-placeholder {
          background: linear-gradient(135deg, #FFF0F7, #fff);
        }
        .brochure-item-body { padding: 6px 8px; flex: 1; }
        .brochure-item-name {
          font-size: 7.5pt;
          font-weight: 800;
          line-height: 1.2;
          margin: 0;
          color: #000;
        }
        .brochure-item-price {
          font-size: 9pt;
          font-weight: 900;
          color: #E6007E;
          margin: 3px 0 0;
        }
        .brochure-item-member {
          font-size: 6.5pt;
          font-weight: 700;
          color: #666;
          margin: 1px 0 0;
        }
        .brochure-footer {
          margin-top: 0.25in;
          padding-top: 0.15in;
          border-top: 3px solid #000;
          text-align: center;
          font-size: 8pt;
        }
        .brochure-footer-url {
          font-weight: 800;
          color: #E6007E;
          margin: 4px 0;
        }
        .brochure-disclaimer {
          font-size: 6.5pt;
          color: #666;
          margin: 6px 0 0;
          line-height: 1.35;
        }
        .brochure-columns {
          display: grid;
          grid-template-columns: 1.1fr 1fr 0.95fr;
          gap: 0.2in;
          flex: 1;
        }
        .brochure-section-title {
          font-size: 9pt;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #fff;
          background: linear-gradient(90deg, #FF2D8E, #E6007E);
          border: 2px solid #000;
          padding: 4px 8px;
          margin: 0 0 8px;
        }
        .brochure-section-title-spaced { margin-top: 14px; }
        .brochure-list {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .brochure-list li {
          display: flex;
          justify-content: space-between;
          gap: 6px;
          font-size: 6.8pt;
          line-height: 1.25;
          padding: 3px 0;
          border-bottom: 1px solid #eee;
          font-weight: 600;
        }
        .brochure-list-price {
          font-weight: 900;
          color: #E6007E;
          text-align: right;
          flex-shrink: 0;
        }
        .brochure-mini-note {
          font-size: 6.5pt;
          color: #555;
          margin: 8px 0 0;
          font-weight: 600;
        }
        .brochure-cta-box {
          margin-top: 16px;
          border: 3px solid #000;
          background: #0a0a0a;
          color: #fff;
          padding: 10px;
          border-radius: 8px;
        }
        .brochure-cta-headline {
          font-size: 10pt;
          font-weight: 900;
          margin: 0 0 4px;
          color: #FFB8DC;
        }
        .brochure-cta-body {
          font-size: 7pt;
          font-weight: 600;
          margin: 0;
          line-height: 1.4;
        }
        @media print {
          @page { size: letter portrait; margin: 0.25in; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .brochure-root { background: #fff; padding: 0; }
          .brochure-page {
            max-width: none;
            min-height: auto;
            margin: 0;
            box-shadow: none;
            page-break-after: always;
          }
          .brochure-page:last-child { page-break-after: auto; }
        }
      `}</style>
    </div>
  );
}
