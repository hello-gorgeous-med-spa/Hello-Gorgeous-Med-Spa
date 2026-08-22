import fs from "fs/promises";
import path from "path";

import BinderPrintPacket, {
  type BinderPrintDoc,
} from "@/components/compliance/BinderPrintPacket";
import { BINDER_MD_DOCS } from "@/lib/compliance-binder-catalog";

export const dynamic = "force-dynamic";

const PRINT_ORDER = [
  "13-medical-director-adoption",
  "00-README",
  "01-botox-complication-protocol",
  "02-vascular-occlusion-emergency-protocol",
  "03-hyaluronidase-emergency-protocol",
  "04-laser-safety-protocol",
  "05-patient-consent-requirements",
  "06-standing-orders-injectables",
  "07-chart-audit-checklist",
  "08-illinois-idfpr-inspection-readiness",
  "09-glp1-good-faith-exam",
  "10-glp1-compounded-semaglutide-tirzepatide",
  "11-glp1-monitoring-adverse-events-off-ramps",
  "12-practice-readiness-audit",
];

export default async function BinderPrintPage() {
  const baseDir = path.join(process.cwd(), "docs", "compliance-binder");
  const bySlug = new Map(BINDER_MD_DOCS.map((d) => [d.slug, d]));
  const docs: BinderPrintDoc[] = [];

  for (const slug of PRINT_ORDER) {
    const meta = bySlug.get(slug);
    if (!meta) continue;
    const content = await fs.readFile(path.join(baseDir, `${slug}.md`), "utf-8");
    docs.push({ ...meta, content });
  }

  return <BinderPrintPacket docs={docs} />;
}
