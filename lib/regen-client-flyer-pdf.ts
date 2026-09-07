"use client";

import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

import { REGEN_CLIENT_FLYER_PDF_FILENAME } from "@/lib/regen-client-flyer";

const PAGE_W_IN = 8.5;
const PAGE_H_IN = 11;

/**
 * Rasterize the two letter pages (no staff toolbar) into a print-shop PDF.
 */
export async function downloadRegenClientFlyerPdf(pages: HTMLElement[]): Promise<void> {
  if (pages.length === 0) {
    throw new Error("Flyer pages are not on the screen yet.");
  }

  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "in",
    format: "letter",
    compress: true,
  });

  for (let i = 0; i < pages.length; i += 1) {
    const page = pages[i];
    const canvas = await html2canvas(page, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#0A0A0A",
      logging: false,
      width: page.offsetWidth,
      height: page.offsetHeight,
      windowWidth: page.offsetWidth,
      windowHeight: page.offsetHeight,
    });
    const img = canvas.toDataURL("image/jpeg", 0.95);
    if (i > 0) pdf.addPage("letter", "p");
    pdf.addImage(img, "JPEG", 0, 0, PAGE_W_IN, PAGE_H_IN, undefined, "MEDIUM");
  }

  pdf.save(REGEN_CLIENT_FLYER_PDF_FILENAME);
}

/** Facebook / IG need JPG or PNG — they reject the print-shop PDF. */
export async function downloadRegenClientFlyerImages(pages: HTMLElement[]): Promise<void> {
  if (pages.length === 0) {
    throw new Error("Flyer pages are not on the screen yet.");
  }

  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

  for (let i = 0; i < pages.length; i += 1) {
    const page = pages[i];
    const canvas = await html2canvas(page, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#0A0A0A",
      logging: false,
      width: page.offsetWidth,
      height: page.offsetHeight,
      windowWidth: page.offsetWidth,
      windowHeight: page.offsetHeight,
    });
    const href = canvas.toDataURL("image/jpeg", 0.92);
    const a = document.createElement("a");
    a.href = href;
    a.download = `REGEN-RX-Flyer-Facebook-page-${i + 1}.jpg`;
    a.click();
  }
}
