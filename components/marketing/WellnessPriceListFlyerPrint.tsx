import { SITE } from "@/lib/seo";
import {
  WELLNESS_BROCHURE_FEATURED,
  WELLNESS_PRICE_LIST_FAQS,
  WELLNESS_PRICE_LIST_PATH,
  WELLNESS_PRICE_LIST_SECTIONS,
} from "@/lib/wellness-price-list";

const QR_BOOK = `/api/app/qr-code?target=${encodeURIComponent("/wellness-price-list")}&utm_medium=brochure&utm_campaign=wellness_menu&width=256`;

function BrochureCard({
  item,
  compact,
}: {
  item: (typeof WELLNESS_BROCHURE_FEATURED)[number];
  compact?: boolean;
}) {
  return (
    <div className={`brochure-card ${compact ? "brochure-card-compact" : ""}`}>
      {item.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.image} alt="" className="brochure-card-img" />
      ) : (
        <div className="brochure-card-img brochure-card-img-placeholder" />
      )}
      <div className="brochure-card-body">
        <p className="brochure-card-name">{item.name}</p>
        {item.tagline && !compact ? <p className="brochure-card-tagline">{item.tagline}</p> : null}
        {item.benefits && item.benefits.length > 0 && !compact ? (
          <ul className="brochure-card-benefits">
            {item.benefits.slice(0, 2).map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        ) : null}
        <p className="brochure-card-price">{item.priceLabel}</p>
        {item.memberPriceLabel ? <p className="brochure-card-member">{item.memberPriceLabel}</p> : null}
      </div>
    </div>
  );
}

function CompactList({ section }: { section: (typeof WELLNESS_PRICE_LIST_SECTIONS)[number] }) {
  return (
    <section className="brochure-compact-section">
      <h2 className="brochure-section-head">{section.title}</h2>
      <ul className="brochure-list">
        {section.items.map((item) => (
          <li key={item.id}>
            <span className="brochure-list-name">{item.name}</span>
            <span className="brochure-list-price">{item.priceLabel}</span>
          </li>
        ))}
      </ul>
      {section.footerNote ? <p className="brochure-section-note">{section.footerNote.slice(0, 120)}…</p> : null}
    </section>
  );
}

export function WellnessPriceListFlyerPrint() {
  const byId = (id: (typeof WELLNESS_PRICE_LIST_SECTIONS)[number]["id"]) =>
    WELLNESS_PRICE_LIST_SECTIONS.find((s) => s.id === id)!;

  return (
    <div className="brochure-root">
      <p className="print:hidden mb-4 text-center text-sm text-[#2d1020]/60 max-w-xl mx-auto px-4">
        Print this brochure (portrait, color). Use <strong>Print → Save as PDF</strong> to share digitally. Full menu
        always at hellogorgeousmedspa.com/wellness-price-list
      </p>

      {/* Page 1 — cover */}
      <article className="brochure-page">
        <header className="brochure-hero">
          <div className="brochure-hero-text">
            <p className="brochure-brand">Hello Gorgeous Med Spa</p>
            <h1 className="brochure-title">Advanced Wellness Therapies</h1>
            <p className="brochure-tagline">Optimize Health · Enhance Recovery · Elevate Wellness</p>
            <p className="brochure-lede">
              Peptide therapy · Vitamin injections · IV drips · Medical weight loss · Hormones · Memberships
              <br />
              NP-supervised · Oswego, IL · published starting rates
            </p>
          </div>
          <div className="brochure-hero-qr">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={QR_BOOK} alt="Scan for full menu" width={92} height={92} className="brochure-qr" />
            <p className="brochure-qr-label">Scan for live pricing</p>
          </div>
        </header>

        <h2 className="brochure-featured-label">Featured therapies</h2>
        <div className="brochure-featured-grid">
          {WELLNESS_BROCHURE_FEATURED.map((item) => (
            <BrochureCard key={item.id} item={item} />
          ))}
        </div>

        <footer className="brochure-page-footer">
          <p>
            <strong>{SITE.phone}</strong> · {SITE.address.streetAddress}, {SITE.address.addressLocality}, IL
          </p>
          <p className="brochure-url">hellogorgeousmedspa.com{WELLNESS_PRICE_LIST_PATH}</p>
        </footer>
      </article>

      {/* Page 2 — peptides + vitamins */}
      <article className="brochure-page">
        <div className="brochure-two-col">
          <CompactList section={byId("peptides")} />
          <CompactList section={byId("vitamins")} />
        </div>
      </article>

      {/* Page 3 — IV + weight loss + hormones */}
      <article className="brochure-page">
        <div className="brochure-three-col">
          <CompactList section={byId("iv")} />
          <CompactList section={byId("weight-loss")} />
          <CompactList section={byId("hormones")} />
        </div>
      </article>

      {/* Page 4 — memberships + FAQ + CTA */}
      <article className="brochure-page brochure-page-last">
        <div className="brochure-bottom-grid">
          <CompactList section={byId("memberships")} />

          <div className="brochure-faq-col">
            <h2 className="brochure-section-head">Wellness FAQs</h2>
            <dl className="brochure-faq">
              {WELLNESS_PRICE_LIST_FAQS.map((faq) => (
                <div key={faq.q}>
                  <dt>{faq.q}</dt>
                  <dd>{faq.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="brochure-cta-row">
          <div className="brochure-cta-box brochure-cta-light">
            <p className="brochure-cta-title">Schedule your consultation</p>
            <p className="brochure-cta-body">
              Ryan Kent, FNP-BC · full prescriptive authority
              <br />
              {SITE.phone} · Fresha &amp; Hello Gorgeous app
            </p>
          </div>
          <div className="brochure-cta-box brochure-cta-dark">
            <p className="brochure-cta-title">Curious about pricing?</p>
            <p className="brochure-cta-body">Scan the QR on page 1 for the full live menu &amp; member rates.</p>
          </div>
        </div>

        <p className="brochure-disclaimer">
          Starting rates only. NP consult required for peptides, hormones, GLP-1 &amp; NAD+. Final quote confirmed at
          visit. Compounded medications when clinically appropriate.
        </p>
      </article>

      <style>{`
        .brochure-root {
          min-height: 100vh;
          background: #e8e0d8;
          padding: 1rem;
          font-family: Georgia, "Times New Roman", serif;
        }
        .brochure-page {
          max-width: 8.5in;
          min-height: 10.9in;
          margin: 0 auto 1rem;
          padding: 0.5in 0.55in;
          background: #FAF7F4;
          border: 1px solid rgba(45, 16, 32, 0.12);
          box-shadow: 0 12px 40px rgba(45, 16, 32, 0.08);
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          color: #2d1020;
        }
        .brochure-hero {
          display: flex;
          justify-content: space-between;
          gap: 0.35in;
          align-items: flex-start;
          padding-bottom: 0.28in;
          border-bottom: 1px solid rgba(201, 145, 122, 0.45);
          margin-bottom: 0.22in;
        }
        .brochure-brand {
          font-size: 8pt;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #C9917A;
          margin: 0 0 8px;
          font-family: system-ui, sans-serif;
          font-weight: 600;
        }
        .brochure-title {
          font-size: 26pt;
          font-weight: 600;
          line-height: 1.05;
          margin: 0;
          color: #2d1020;
        }
        .brochure-tagline {
          font-size: 8.5pt;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #C9917A;
          margin: 10px 0 0;
          font-family: system-ui, sans-serif;
          font-weight: 600;
        }
        .brochure-lede {
          font-size: 9pt;
          line-height: 1.5;
          margin: 10px 0 0;
          color: rgba(45, 16, 32, 0.72);
          font-family: system-ui, sans-serif;
        }
        .brochure-hero-qr { text-align: center; flex-shrink: 0; }
        .brochure-qr { display: block; border: 1px solid rgba(45,16,32,0.15); border-radius: 6px; }
        .brochure-qr-label {
          font-size: 6.5pt;
          font-weight: 600;
          margin: 4px 0 0;
          color: rgba(45, 16, 32, 0.55);
          font-family: system-ui, sans-serif;
        }
        .brochure-featured-label {
          font-size: 9pt;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #2d1020;
          margin: 0 0 10px;
          font-family: system-ui, sans-serif;
        }
        .brochure-featured-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          flex: 1;
        }
        .brochure-card {
          background: #fff;
          border: 1px solid rgba(45, 16, 32, 0.1);
          border-radius: 6px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .brochure-card-img {
          width: 100%;
          aspect-ratio: 4 / 3;
          object-fit: cover;
          display: block;
        }
        .brochure-card-img-placeholder {
          background: linear-gradient(135deg, #FFF0F7, #FAF7F4);
        }
        .brochure-card-body { padding: 6px 7px 8px; flex: 1; display: flex; flex-direction: column; }
        .brochure-card-name {
          font-size: 7pt;
          font-weight: 600;
          line-height: 1.2;
          margin: 0;
          color: #2d1020;
        }
        .brochure-card-tagline {
          font-size: 5.5pt;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #C9917A;
          margin: 2px 0 0;
          font-family: system-ui, sans-serif;
          font-weight: 600;
        }
        .brochure-card-benefits {
          list-style: none;
          margin: 4px 0 0;
          padding: 0;
          flex: 1;
        }
        .brochure-card-benefits li {
          font-size: 5.5pt;
          line-height: 1.25;
          color: rgba(45, 16, 32, 0.65);
          font-family: system-ui, sans-serif;
          padding-left: 8px;
          position: relative;
        }
        .brochure-card-benefits li::before {
          content: "✓";
          position: absolute;
          left: 0;
          color: #E6007E;
          font-size: 5pt;
        }
        .brochure-card-price {
          font-size: 8pt;
          font-weight: 700;
          color: #E6007E;
          margin: 4px 0 0;
          font-family: system-ui, sans-serif;
        }
        .brochure-card-member {
          font-size: 5.5pt;
          color: rgba(45, 16, 32, 0.5);
          margin: 1px 0 0;
          font-family: system-ui, sans-serif;
        }
        .brochure-page-footer {
          margin-top: 0.2in;
          padding-top: 0.12in;
          border-top: 1px solid rgba(45, 16, 32, 0.12);
          text-align: center;
          font-size: 7.5pt;
          font-family: system-ui, sans-serif;
        }
        .brochure-url { font-weight: 700; color: #E6007E; margin: 3px 0 0; }
        .brochure-two-col {
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          gap: 0.25in;
          flex: 1;
        }
        .brochure-three-col {
          display: grid;
          grid-template-columns: 1fr 0.9fr 1fr;
          gap: 0.18in;
          flex: 1;
        }
        .brochure-bottom-grid {
          display: grid;
          grid-template-columns: 1fr 1.1fr;
          gap: 0.22in;
          flex: 1;
        }
        .brochure-section-head {
          font-size: 9pt;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #fff;
          background: linear-gradient(135deg, #2d1020, #1a1228);
          padding: 5px 10px;
          margin: 0 0 8px;
          font-family: system-ui, sans-serif;
        }
        .brochure-list {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .brochure-list li {
          display: flex;
          justify-content: space-between;
          gap: 6px;
          font-size: 6.5pt;
          line-height: 1.3;
          padding: 3px 0;
          border-bottom: 1px solid rgba(45, 16, 32, 0.08);
          font-family: system-ui, sans-serif;
        }
        .brochure-list-name { font-weight: 500; color: #2d1020; }
        .brochure-list-price {
          font-weight: 700;
          color: #E6007E;
          text-align: right;
          flex-shrink: 0;
        }
        .brochure-section-note {
          font-size: 5.5pt;
          color: rgba(45, 16, 32, 0.5);
          margin: 6px 0 0;
          font-style: italic;
          font-family: system-ui, sans-serif;
        }
        .brochure-faq dt {
          font-size: 7pt;
          font-weight: 600;
          margin: 0 0 2px;
          color: #2d1020;
        }
        .brochure-faq dd {
          font-size: 6pt;
          line-height: 1.35;
          margin: 0 0 8px;
          color: rgba(45, 16, 32, 0.65);
          font-family: system-ui, sans-serif;
        }
        .brochure-cta-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 0.18in;
        }
        .brochure-cta-box {
          padding: 10px 12px;
          border-radius: 6px;
        }
        .brochure-cta-light {
          background: linear-gradient(135deg, #FFF8F5, #FAF7F4);
          border: 1px solid rgba(201, 145, 122, 0.4);
        }
        .brochure-cta-dark {
          background: linear-gradient(135deg, #2d1020, #1a1228);
          color: #fff;
        }
        .brochure-cta-title {
          font-size: 9pt;
          font-weight: 600;
          margin: 0 0 4px;
          font-family: system-ui, sans-serif;
        }
        .brochure-cta-light .brochure-cta-title { color: #2d1020; }
        .brochure-cta-dark .brochure-cta-title { color: #FFB8DC; }
        .brochure-cta-body {
          font-size: 6.5pt;
          line-height: 1.4;
          margin: 0;
          font-family: system-ui, sans-serif;
        }
        .brochure-cta-light .brochure-cta-body { color: rgba(45, 16, 32, 0.7); }
        .brochure-cta-dark .brochure-cta-body { color: rgba(255,255,255,0.8); }
        .brochure-disclaimer {
          font-size: 5.5pt;
          color: rgba(45, 16, 32, 0.5);
          margin: 10px 0 0;
          text-align: center;
          line-height: 1.35;
          font-family: system-ui, sans-serif;
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
          .brochure-page-last { page-break-after: auto; }
        }
      `}</style>
    </div>
  );
}
