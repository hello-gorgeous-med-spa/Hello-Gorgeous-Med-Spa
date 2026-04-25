import QRCode from "qrcode";
import { SITE } from "@/lib/seo";

const PRE_POST_LINKS: { title: string; subtitle: string; path: string }[] = [
  {
    title: "Morpheus8 (Burst)",
    subtitle: "Pre & post RF microneedling",
    path: "/pre-post-care/morpheus8-burst",
  },
  {
    title: "Solaria CO₂",
    subtitle: "Pre & post fractional laser",
    path: "/pre-post-care/solaria-co2",
  },
  {
    title: "Quantum RF",
    subtitle: "Pre & post subdermal RF",
    path: "/pre-post-care/quantum-rf",
  },
];

function absoluteUrl(path: string): string {
  return new URL(path, `${SITE.url}/`).toString();
}

/**
 * Scannable QR codes for procedure pre/post care guides — for tent cards, front desk, and screenshots.
 * Renders on the server (no client JavaScript for generation).
 */
export default async function ProcedurePrePostQrSection() {
  const items = await Promise.all(
    PRE_POST_LINKS.map(async (row) => {
      const fullUrl = absoluteUrl(row.path);
      const svg = await QRCode.toString(fullUrl, {
        type: "svg",
        width: 220,
        margin: 1,
        errorCorrectionLevel: "M",
        color: { dark: "#0a0a0a", light: "#ffffff" },
      });
      return { ...row, fullUrl, svg };
    })
  );

  return (
    <section className="border-t-2 border-[#E6007E]/20 bg-gradient-to-b from-rose-50/90 to-white">
      <div className="mx-auto max-w-4xl px-4 py-12 md:py-14">
        <p className="text-center text-xs font-bold uppercase tracking-[0.35em] text-[#E6007E]">Scan on your phone</p>
        <h2 className="mt-2 text-center text-2xl font-bold text-black md:text-3xl">Pre &amp; post care — QR codes</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-black/70">
          Open your camera and point at a code to load the <strong>full web care guide</strong> for that procedure—works
          in the waiting room, after booking, or from a printed tent card.
        </p>

        <ul className="mt-8 grid gap-6 sm:grid-cols-3 print:grid-cols-3">
          {items.map((item) => (
            <li
              key={item.path}
              className="print:break-inside-avoid flex flex-col items-center rounded-2xl border-2 border-black bg-white p-5 text-center shadow-sm"
            >
              <h3 className="text-base font-bold text-black">{item.title}</h3>
              <p className="mt-0.5 text-xs text-black/55">{item.subtitle}</p>
              <div
                className="mt-4 rounded-xl border border-black/10 bg-white p-2 [&>svg]:h-auto [&>svg]:w-full [&>svg]:max-w-[200px]"
                aria-hidden
                dangerouslySetInnerHTML={{ __html: item.svg }}
              />
              <p className="mt-3 max-w-[200px] break-all font-mono text-[10px] leading-snug text-black/45">
                {item.fullUrl}
              </p>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-center text-xs text-black/50 print:hidden">
          Tip: use your browser’s print dialog to save this section as a PDF for acrylic stands or check-in handouts.
        </p>
      </div>
    </section>
  );
}
