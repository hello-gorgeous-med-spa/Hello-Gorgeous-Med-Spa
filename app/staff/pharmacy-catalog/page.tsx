import { readFileSync, existsSync } from "fs";
import { join } from "path";

import StaffPharmacyCatalog, {
  type StaffCatalogData,
} from "@/components/staff/StaffPharmacyCatalog";

export const metadata = {
  title: "Pharmacy Selector | Hello Gorgeous Staff",
  description:
    "Compare BoomRx, Formulation Rx & Olympia pricing — Jul 2026 Illinois formulary.",
};

function loadCatalog(): StaffCatalogData | null {
  const catalogPath = join(process.cwd(), "data/regen-best-prices.json");
  if (!existsSync(catalogPath)) return null;
  const raw = JSON.parse(readFileSync(catalogPath, "utf-8"));
  return {
    generatedAt: raw.generatedAt,
    totalProducts: raw.totalProducts,
    byPharmacy: raw.byPharmacy,
    products: raw.products,
  };
}

export default function StaffPharmacyCatalogPage() {
  const catalog = loadCatalog();

  if (!catalog) {
    return (
      <div className="min-h-screen bg-gray-950 p-8 text-white">
        <p>Catalog not built. Run: npm run sync:boomrx-catalog</p>
      </div>
    );
  }

  return <StaffPharmacyCatalog catalog={catalog} />;
}
