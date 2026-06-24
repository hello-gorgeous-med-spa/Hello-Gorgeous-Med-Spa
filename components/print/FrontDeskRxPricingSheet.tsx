import {
  GLP1_RETAIL_PROGRAM,
  PEPTIDE_PHARMACY_SHIPPING_USD,
  PEPTIDE_PREPAY_DISCOUNT_PERCENT,
  PEPTIDE_PREPAY_MONTHS,
  PEPTIDE_PRICING_DISCLAIMER,
  PEPTIDE_RETAIL_FROM_MONTHLY_USD,
  formatFromMonthly,
  peptideRetailMenuByCategory,
} from "@/lib/peptide-retail-pricing";
import { PEPTIDE_CONSULT_FEE_USD } from "@/lib/peptide-request-menu";
import { HELLO_GORGEOUS_RX_START_PATH, PEPTIDE_REQUEST_PATH } from "@/lib/flows";
import { SITE } from "@/lib/seo";

const BRAND = {
  pink: "#E6007E",
  hot: "#FF2D8E",
  wash: "#FFF0F7",
};

export function FrontDeskRxPricingSheet() {
  const groups = peptideRetailMenuByCategory();
  const updated = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article
      className="front-desk-rx-sheet mx-auto bg-white text-black"
      style={{ maxWidth: "8.5in", fontFamily: "system-ui, sans-serif" }}
    >
      {/* Header */}
      <header
        className="border-4 border-black px-6 py-5"
        style={{
          background: `linear-gradient(125deg, ${BRAND.hot} 0%, ${BRAND.pink} 55%, #9b0a4d 100%)`,
        }}
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">
          Internal · Front desk reference
        </p>
        <h1 className="mt-1 text-2xl font-black text-white tracking-tight">
          Hello Gorgeous RX™ — Peptide &amp; GLP-1 Pricing
        </h1>
        <p className="mt-2 text-sm font-medium text-white/90">
          {SITE.address.streetAddress}, {SITE.address.addressLocality},{" "}
          {SITE.address.addressRegion} {SITE.address.postalCode} · {SITE.phone}
        </p>
        <p className="mt-1 text-xs text-white/75">Updated {updated} · Aggressive retail + 15%</p>
      </header>

      {/* Quick refs */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-0 border-x-4 border-b-4 border-black">
        {[
          { label: "NP consult (new)", value: `$${PEPTIDE_CONSULT_FEE_USD}` },
          { label: "Protocols from", value: `$${PEPTIDE_RETAIL_FROM_MONTHLY_USD}/mo` },
          {
            label: `${PEPTIDE_PREPAY_MONTHS}-mo prepay`,
            value: `${PEPTIDE_PREPAY_DISCOUNT_PERCENT}% off meds`,
          },
          { label: "Shipping (typical)", value: `$${PEPTIDE_PHARMACY_SHIPPING_USD}` },
        ].map((cell) => (
          <div
            key={cell.label}
            className="border-r border-black/15 last:border-r-0 px-4 py-3 text-center"
            style={{ background: BRAND.wash }}
          >
            <p className="text-[9px] font-bold uppercase tracking-wide text-black/55">{cell.label}</p>
            <p className="text-lg font-black" style={{ color: BRAND.pink }}>
              {cell.value}
            </p>
          </div>
        ))}
      </section>

      {/* Menu tables */}
      {groups.map((group) => (
        <section key={group.category} className="border-x-4 border-b-4 border-black">
          <h2
            className="px-4 py-2 text-xs font-black uppercase tracking-wider text-white border-b-2 border-black"
            style={{ background: BRAND.pink }}
          >
            {group.category}
          </h2>
          <table className="w-full text-sm">
            <tbody>
              {group.rows.map((row, i) => (
                <tr
                  key={row.id}
                  className={i % 2 === 0 ? "bg-white" : "bg-[#FFF0F7]/50"}
                >
                  <td className="px-4 py-2.5 font-bold border-b border-black/10 w-[45%]">
                    {row.name}
                  </td>
                  <td className="px-4 py-2.5 text-black/65 border-b border-black/10 w-[35%] text-xs">
                    {row.note ?? "—"}
                  </td>
                  <td
                    className="px-4 py-2.5 font-black text-right border-b border-black/10 whitespace-nowrap"
                    style={{ color: BRAND.pink }}
                  >
                    {formatFromMonthly(row.fromMonthlyUsd)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}

      {/* GLP-1 callout */}
      <section className="border-x-4 border-b-4 border-black px-5 py-4" style={{ background: BRAND.wash }}>
        <h2 className="text-xs font-black uppercase tracking-wider text-black">
          Medical weight loss (program pricing)
        </h2>
        <div className="mt-2 flex flex-wrap gap-6 text-sm">
          <p>
            <strong>Semaglutide:</strong>{" "}
            <span className="font-black" style={{ color: BRAND.pink }}>
              From ${GLP1_RETAIL_PROGRAM.semaglutideFromUsd}/mo
            </span>
          </p>
          <p>
            <strong>Tirzepatide:</strong>{" "}
            <span className="font-black" style={{ color: BRAND.pink }}>
              From ${GLP1_RETAIL_PROGRAM.tirzepatideFromUsd}/mo
            </span>
          </p>
        </div>
        <p className="mt-2 text-xs text-black/60">
          Includes provider oversight &amp; titration language — confirm dose tier at consult.
        </p>
      </section>

      {/* Staff scripts */}
      <section className="border-x-4 border-b-4 border-black px-5 py-4">
        <h2 className="text-xs font-black uppercase tracking-wider mb-3">Front desk talking points</h2>
        <ul className="space-y-2 text-xs leading-relaxed text-black/80 list-disc pl-4">
          <li>
            <strong>New peptide protocols:</strong> book $49 NP consult → Start Here or peptide request
            form → Square prepay → Charm telehealth with Ryan Kent, FNP-BC.
          </li>
          <li>
            <strong>Refills:</strong> existing RX patients skip $49 gate — use request/refill flow.
          </li>
          <li>
            Say <strong>&ldquo;from $X per month&rdquo;</strong> — final price confirmed after NP
            evaluation (dose, format, cycle).
          </li>
          <li>
            <strong>Never quote</strong> pharmacy wholesale, supplier names, or internal markup.
          </li>
          <li>
            <strong>Recovery Blend from $229/mo</strong> — strong vs competitors (~$394 recovery
            stacks elsewhere).
          </li>
          <li>
            <strong>Sermorelin from $149/mo</strong> injectable · <strong>$160/mo</strong> troche when
            discussed.
          </li>
        </ul>
      </section>

      {/* URLs */}
      <section className="grid sm:grid-cols-2 gap-0 border-x-4 border-b-4 border-black text-xs">
        <div className="px-5 py-4 border-b sm:border-b-0 sm:border-r border-black/15">
          <p className="font-black uppercase tracking-wide text-black/50 mb-2">Client links</p>
          <p>
            <strong>Peptide hub:</strong> {SITE.url}/peptides
          </p>
          <p className="mt-1">
            <strong>Start Here:</strong> {SITE.url}
            {HELLO_GORGEOUS_RX_START_PATH}
          </p>
          <p className="mt-1">
            <strong>Request / refill:</strong> {SITE.url}
            {PEPTIDE_REQUEST_PATH}
          </p>
        </div>
        <div className="px-5 py-4">
          <p className="font-black uppercase tracking-wide text-black/50 mb-2">Compliance</p>
          <p className="text-black/65 leading-relaxed">{PEPTIDE_PRICING_DISCLAIMER}</p>
        </div>
      </section>

      <footer className="border-x-4 border-b-4 border-black px-5 py-3 text-center text-[10px] text-black/45">
        Hello Gorgeous Med Spa · Hello Gorgeous RX™ · For staff use — not for client handout without NP
        context · © {new Date().getFullYear()}
      </footer>
    </article>
  );
}
