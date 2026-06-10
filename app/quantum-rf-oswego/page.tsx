import type { Metadata } from "next";

import { OswegoMenuLanding } from "@/components/services/OswegoMenuLanding";
import { QUANTUM_RF_OSWEGO_MENU } from "@/lib/oswego-inmode-menus";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: QUANTUM_RF_OSWEGO_MENU.metaTitle,
  description: QUANTUM_RF_OSWEGO_MENU.metaDescription,
  path: QUANTUM_RF_OSWEGO_MENU.path,
});

export default function QuantumRfOswegoPage() {
  return (
    <OswegoMenuLanding
      slug="quantum-rf-oswego"
      config={QUANTUM_RF_OSWEGO_MENU}
      breadcrumbName="Quantum RF Oswego"
    />
  );
}
