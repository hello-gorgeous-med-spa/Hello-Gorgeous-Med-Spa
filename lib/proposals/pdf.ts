import { readFileSync } from "fs";
import path from "path";
import { jsPDF } from "jspdf";
import { SITE } from "@/lib/seo";
import { proposalCredibilityPdfLines } from "@/lib/proposals/credibility";
import {
  calculateDiscount,
  calculateSubtotal,
  calculateTotal,
  formatProposalServiceLine,
  type ProposalOption,
  type ProposalService,
} from "@/lib/proposals/utils";
import type { TreatmentProposalRecord } from "@/lib/proposals/types";

const PINK = "#E6007E";
const INK = "#111111";
const MUTED = "#555555";

function money(value: number): string {
  return `$${value.toFixed(2)}`;
}

/** Helvetica / WinAnsi cannot render many Unicode glyphs — normalize for PDF. */
function pdfSafe(text: string): string {
  return text
    .replace(/\u0000/g, "")
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
    .replace(/[\u2013\u2014\u2212]/g, "-")
    .replace(/\u2026/g, "...")
    .replace(/\u00D7|\u2715/g, "x")
    .replace(/CO\u2082/gi, "CO2")
    .replace(/CO₂/gi, "CO2")
    .replace(/[\u00A0\u202F]/g, " ")
    .replace(/[^\x09\x0A\x0D\x20-\x7E\xA0-\xFF]/g, "");
}

function preparedByLabel(raw: string | null | undefined): string {
  const v = (raw || "").trim();
  if (!v) return "Hello Gorgeous Med Spa";
  if (/^(owner|admin|staff)$/i.test(v)) return "Hello Gorgeous Med Spa";
  return v;
}

function timelineServiceLabel(serviceId: string, services: ProposalService[]): string {
  const hit = services.find((s) => s.id === serviceId);
  return hit?.name || serviceId;
}

function loadInterBoldBase64(): string | null {
  try {
    const fontPath = path.join(process.cwd(), "public/fonts/Inter-700-latin.ttf");
    return readFileSync(fontPath).toString("base64");
  } catch {
    return null;
  }
}

function loadLogoDataUrl(): string | null {
  try {
    const logoPath = path.join(process.cwd(), "public/images/hello-gorgeous-logo.png");
    const buf = readFileSync(logoPath);
    return `data:image/png;base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

export function buildProposalPdf(proposal: TreatmentProposalRecord): Uint8Array {
  const doc = new jsPDF({ format: "letter", unit: "pt" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 44;
  const maxWidth = pageWidth - marginX * 2;
  let y = 48;

  const interBold = loadInterBoldBase64();
  if (interBold) {
    doc.addFileToVFS("Inter-Bold.ttf", interBold);
    doc.addFont("Inter-Bold.ttf", "Inter", "bold");
  }
  const displayFont = interBold ? "Inter" : "helvetica";
  const bodyFont = "helvetica";

  const ensureSpace = (needed: number) => {
    if (y + needed <= pageHeight - 48) return;
    doc.addPage();
    y = 48;
  };

  const setBody = (size = 10, color = INK) => {
    doc.setFont(bodyFont, "normal");
    doc.setFontSize(size);
    doc.setTextColor(color);
  };

  const setDisplay = (size = 16, color = INK) => {
    doc.setFont(displayFont, "bold");
    doc.setFontSize(size);
    doc.setTextColor(color);
  };

  const write = (text: string, size = 10, color = INK, spacing = 14) => {
    setBody(size, color);
    const lines = doc.splitTextToSize(pdfSafe(text), maxWidth);
    ensureSpace(lines.length * spacing + 4);
    doc.text(lines, marginX, y);
    y += lines.length * spacing;
  };

  const writeHeading = (text: string, size = 14) => {
    ensureSpace(size + 22);
    setDisplay(size, PINK);
    doc.text(pdfSafe(text), marginX, y);
    y += size + 8;
  };

  // —— Cover header band ——
  doc.setFillColor(10, 10, 10);
  doc.rect(0, 0, pageWidth, 118, "F");
  doc.setFillColor(230, 0, 126);
  doc.rect(0, 118, pageWidth, 4, "F");

  const logo = loadLogoDataUrl();
  if (logo) {
    try {
      doc.addImage(logo, "PNG", marginX, 22, 42, 45);
    } catch {
      /* ignore logo failure */
    }
  }

  setDisplay(11, "#FFB8DC");
  doc.text("HELLO GORGEOUS MED SPA", logo ? marginX + 52 : marginX, 38);
  setDisplay(22, "#FFFFFF");
  doc.text("Personalized Treatment Plan", logo ? marginX + 52 : marginX, 64);
  setBody(10, "#FFB8DC");
  doc.text(
    pdfSafe(
      `Prepared for ${proposal.client_name}  ·  ${new Date(proposal.created_at).toLocaleDateString()}  ·  ${SITE.phone}`,
    ),
    logo ? marginX + 52 : marginX,
    86,
  );
  setBody(9, "#FFFFFF");
  doc.text(pdfSafe(`Prepared by ${preparedByLabel(proposal.created_by)}`), logo ? marginX + 52 : marginX, 102);

  y = 148;

  if (proposal.concerns?.length) {
    setBody(9, MUTED);
    doc.text("CONSULT FOCUS", marginX, y);
    y += 14;
    write(proposal.concerns.join("  ·  "), 11, INK, 15);
    y += 6;
  }

  if (proposal.client_instructions?.trim()) {
    ensureSpace(100);
    doc.setFillColor(255, 240, 247);
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(2);
    const noteStart = y;
    y += 18;
    setDisplay(11, PINK);
    doc.text("A NOTE FROM HELLO GORGEOUS", marginX + 14, y);
    y += 18;
    setDisplay(16, INK);
    doc.text("Welcome", marginX + 14, y);
    y += 16;
    setBody(10, "#222222");
    const noteLines = doc.splitTextToSize(pdfSafe(proposal.client_instructions.trim()), maxWidth - 28);
    doc.text(noteLines, marginX + 14, y);
    y += noteLines.length * 13 + 16;
    doc.roundedRect(marginX, noteStart, maxWidth, y - noteStart, 8, 8, "S");
    y += 18;
  }

  // Credibility (compact on cover if short)
  const credibilityLines = proposalCredibilityPdfLines(proposal.options || []);
  if (credibilityLines.length) {
    writeHeading("Why this plan", 13);
    credibilityLines.slice(0, 12).forEach((line) => {
      if (!line.trim()) {
        y += 6;
        return;
      }
      write(line, 9, "#333333", 12);
    });
    if (credibilityLines.length > 12) {
      write("(Full technology details continue with each plan and on your online proposal.)", 8, MUTED, 11);
    }
    y += 8;
  }

  // —— One page per option ——
  proposal.options.forEach((option: ProposalOption, index) => {
    doc.addPage();
    y = 48;

    // Option header bar
    doc.setFillColor(index === 1 ? 230 : 255, index === 1 ? 0 : 255, index === 1 ? 126 : 255);
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(2.5);
    doc.roundedRect(marginX, y, maxWidth, 56, 10, 10, index === 1 ? "FD" : "S");
    if (index === 1) {
      setDisplay(10, "#FFFFFF");
      doc.text("MOST POPULAR", marginX + 16, y + 18);
      setDisplay(18, "#FFFFFF");
      doc.text(pdfSafe(`Option ${index + 1}: ${option.name}`), marginX + 16, y + 40);
    } else {
      setDisplay(10, PINK);
      doc.text(`OPTION ${index + 1}`, marginX + 16, y + 18);
      setDisplay(18, INK);
      doc.text(pdfSafe(option.name), marginX + 16, y + 40);
    }
    y += 72;

    setDisplay(11, INK);
    doc.text("What's included", marginX, y);
    y += 16;

    option.services.forEach((service) => {
      ensureSpace(36);
      setBody(10, INK);
      const line = pdfSafe(`•  ${formatProposalServiceLine(service)}`);
      const lines = doc.splitTextToSize(line, maxWidth);
      doc.text(lines, marginX, y);
      y += lines.length * 13;
      if (service.description) {
        setBody(8, MUTED);
        const desc = doc.splitTextToSize(pdfSafe(service.description), maxWidth - 12);
        doc.text(desc, marginX + 12, y);
        y += desc.length * 11 + 4;
      } else {
        y += 4;
      }
    });

    y += 10;
    ensureSpace(90);
    doc.setFillColor(255, 240, 247);
    doc.setDrawColor(230, 0, 126);
    doc.setLineWidth(1.5);
    const boxTop = y;
    y += 18;
    const subtotal = calculateSubtotal(option.services);
    const discount = calculateDiscount(subtotal, option.discountType, option.discountValue);
    const total = calculateTotal(option);

    setBody(10, MUTED);
    doc.text(`Subtotal  ${money(subtotal)}`, marginX + 16, y);
    y += 14;
    if (discount > 0) {
      setBody(10, PINK);
      doc.text(`Savings  -${money(discount)}`, marginX + 16, y);
      y += 14;
    }
    setDisplay(16, INK);
    doc.text(`Total  ${money(total)}`, marginX + 16, y);
    y += 20;
    doc.roundedRect(marginX, boxTop, maxWidth, y - boxTop, 8, 8, "FD");
    y += 16;

    if (option.timeline?.length) {
      setDisplay(11, INK);
      doc.text("Suggested timeline", marginX, y);
      y += 14;
      option.timeline.forEach((monthRow) => {
        const labels = monthRow.services
          .map((id) => timelineServiceLabel(id, option.services))
          .join(", ");
        write(`Month ${monthRow.month}: ${labels}`, 9, "#222222", 12);
      });
    }

    y += 8;
    setBody(8, MUTED);
    doc.text(
      pdfSafe(`Reserve online at ${SITE.url}/proposals/${proposal.public_id}  ·  Questions? ${SITE.phone}`),
      marginX,
      y,
    );
  });

  // —— Next steps ——
  doc.addPage();
  y = 64;
  writeHeading("Next steps", 20);
  y += 4;
  write("1) Choose your preferred option on your digital proposal link.", 12, INK, 18);
  write("2) Reserve with a 50% deposit or pay in full via secure Square checkout.", 12, INK, 18);
  write("3) We confirm your first treatment date and send pre-care guides.", 12, INK, 18);
  y += 16;
  doc.setFillColor(230, 0, 126);
  doc.roundedRect(marginX, y, maxWidth, 72, 10, 10, "F");
  setDisplay(14, "#FFFFFF");
  doc.text("Questions? We're here.", marginX + 18, y + 28);
  setBody(11, "#FFFFFF");
  doc.text(pdfSafe(`Call ${SITE.phone}  ·  ${SITE.url}/book`), marginX + 18, y + 50);
  y += 96;
  setBody(9, MUTED);
  write(
    "Educational proposal only. Final treatment plan and medical eligibility are confirmed during your in-person consultation with our medical team.",
    8,
    MUTED,
    11,
  );

  return new Uint8Array(doc.output("arraybuffer"));
}
