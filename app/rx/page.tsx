import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RE GEN by Hello Gorgeous Med Spa | Medical Prescriptions",
  description: "RE GEN — the prescription arm of Hello Gorgeous Med Spa. NP-directed medical weight loss, peptides, hormones, and labs. 100% online. Flat $30 shipping.",
};

export default function RxPage() {
  return (
    <iframe
      src="/regen-site/index.html"
      style={{
        width: "100%",
        height: "100vh",
        border: "none",
        display: "block",
      }}
      title="RE GEN by Hello Gorgeous Med Spa"
    />
  );
}
