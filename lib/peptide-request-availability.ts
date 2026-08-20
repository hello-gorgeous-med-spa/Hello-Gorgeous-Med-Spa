/**
 * Which peptides a client can start an intake for.
 *
 * The shop now lists only the peptides on the BoomRx sheet, so the intake picker has to
 * agree: a client should not be able to request a protocol we no longer buy. The list is
 * derived from the sheet — items stay in `PEPTIDE_REQUEST_ITEMS` so education hubs,
 * staff pricing tools, and the Square importer keep resolving every id.
 *
 * A peptide counts as available when the sheet carries it on its own or inside a blend:
 * Selank only ships as Semax / Selank, but Ryan can still prescribe it.
 */

import {
  getPeptideBoomRxCatalogEntry,
  isCarriedOnBoomRxSheet,
} from "@/lib/peptide-boomrx-catalog";
import { isNeverClientVisibleText } from "@/lib/regen/catalog/client-visibility";
import {
  PEPTIDE_REQUEST_ITEMS,
  peptideRequestItemsByCategory,
  type PeptideRequestCategory,
  type PeptideRequestItem,
} from "@/lib/peptide-request-menu";

/**
 * GLP-1s are not on the peptide sheet — they are the weight-loss program, priced by
 * dose tier — but weight loss is one of the three things the shop sells, so the picker
 * keeps offering it.
 */
const GLP1_MENU_IDS = new Set(["tirzepatide", "semaglutide"]);

export function isClientRequestablePeptide(item: PeptideRequestItem): boolean {
  if (isNeverClientVisibleText(item.id, item.name)) return false;
  if (GLP1_MENU_IDS.has(item.id)) return true;
  if (getPeptideBoomRxCatalogEntry(item.id)) return true;
  // Blends are listed by their trade name ("HEAL Blend"), so match on the sheet name.
  const sheetName = getPeptideBoomRxCatalogEntry(item.id)?.productName ?? item.name;
  return isCarriedOnBoomRxSheet(sheetName) || isCarriedOnBoomRxSheet(item.name);
}

export const CLIENT_PEPTIDE_REQUEST_ITEMS: PeptideRequestItem[] =
  PEPTIDE_REQUEST_ITEMS.filter(isClientRequestablePeptide);

export function clientPeptideRequestItemsByCategory(): Array<{
  category: PeptideRequestCategory;
  items: PeptideRequestItem[];
}> {
  return peptideRequestItemsByCategory(CLIENT_PEPTIDE_REQUEST_ITEMS);
}
