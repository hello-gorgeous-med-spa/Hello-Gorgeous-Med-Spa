/**
 * Resolve a RE GEN hub card to the facts a shopper sees: price text, form, and
 * whether the shop lists the SKU.
 *
 * Cards declare a *source* (`RxCardPriceSource`), never a dollar amount. This
 * module is the only place those sources become copy, so a card cannot drift
 * onto the wrong SKU and keep looking normal.
 */

import {
  glp1LowestSemaglutideUsd,
  glp1LowestTirzepatideUsd,
} from "@/lib/glp1-dose-tiers";
import { getCatalogProduct, isClientVisibleProductId } from "@/lib/regen/catalog";
import { catalogClientPriceText, catalogClientSupplyUsd } from "@/lib/regen/catalog/client-price";
import { formatMoney } from "@/lib/regen/catalog/pricing";
import type { CatalogProduct } from "@/lib/regen/catalog/types";
import type { RxCategoryProduct } from "@/lib/rx-category-hubs";

export const HUB_CONSULT_PRICE_TEXT = "Quoted at consult";
export const HUB_EXISTING_PATIENT_PRICE_TEXT = "Existing patients";

export type HubCardFacts = {
  /** Same rule `RxCategoryLanding` uses to pick ProductCard vs fallback. */
  listed: boolean;
  /** Copy for the price line. Never a hand-typed dollar amount from the card. */
  priceText: string;
  form: string | null;
  catalogProduct: CatalogProduct | undefined;
  /** Positive derived USD when the source can quote one; null for consult/audience. */
  priceUsd: number | null;
};

/**
 * A hub card links to its SKU only while the shop lists it; the rest open intake.
 * Cards with no `catalogProductId` are treated as listed for href purposes (they
 * keep their own `href`) — matching the previous inline helper.
 */
export function hubProductIsListed(product: RxCategoryProduct): boolean {
  return !product.catalogProductId || isClientVisibleProductId(product.catalogProductId);
}

function glp1ProgramFromUsd(compound: "semaglutide" | "tirzepatide"): number {
  return compound === "tirzepatide"
    ? glp1LowestTirzepatideUsd()
    : glp1LowestSemaglutideUsd();
}

export function hubCardFacts(card: RxCategoryProduct): HubCardFacts {
  const listed = hubProductIsListed(card);
  const catalogProduct = card.catalogProductId
    ? getCatalogProduct(card.catalogProductId)
    : undefined;
  const form = catalogProduct?.form ?? null;

  switch (card.price.source) {
    case "catalog": {
      if (!catalogProduct) {
        return {
          listed,
          priceText: HUB_CONSULT_PRICE_TEXT,
          form,
          catalogProduct,
          priceUsd: null,
        };
      }
      const usd = catalogClientSupplyUsd(catalogProduct, 30);
      return {
        listed,
        priceText: catalogClientPriceText(catalogProduct),
        form,
        catalogProduct,
        priceUsd: Number.isFinite(usd) && usd > 0 ? usd : null,
      };
    }
    case "glp1-program": {
      const usd = glp1ProgramFromUsd(card.price.compound);
      return {
        listed,
        priceText: `from $${formatMoney(usd)}/mo`,
        form,
        catalogProduct,
        priceUsd: usd,
      };
    }
    case "consult":
      return {
        listed,
        priceText: HUB_CONSULT_PRICE_TEXT,
        form,
        catalogProduct,
        priceUsd: null,
      };
    case "existing-patient":
      return {
        listed,
        priceText: HUB_EXISTING_PATIENT_PRICE_TEXT,
        form,
        catalogProduct,
        priceUsd: null,
      };
  }
}
