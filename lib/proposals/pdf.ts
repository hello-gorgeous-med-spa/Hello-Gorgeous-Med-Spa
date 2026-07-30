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

function timelineServiceLabel(
  serviceId: string,
  services: ProposalService[],
): string {
  const hit = services.find((s) => s.id === serviceId);
  return hit?.name || serviceId;
}

export function buildProposalPdf(proposal: TreatmentProposalRecord): Uint8Array {
  const doc = new jsPDF({ format: "letter", unit: "pt" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const marginX = 48;
  const maxWidth = pageWidth - marginX * 2;
  let y = 56;

  const ensureSpace = (needed: number) => {
    if (y + needed <= 740) return;
    doc.addPage();
    y = 56;
  };

  const write = (text: string, size = 11, color = "#000000", spacing = 16) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(size);
    doc.setTextColor(color);
    const lines = doc.splitTextToSize(pdfSafe(text), maxWidth);
    ensureSpace(lines.length * spacing);
    doc.text(lines, marginX, y);
    y += lines.length * spacing;
  };

  const writeHeading = (text: string, size = 12) => {
    ensureSpace(size + 20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(size);
    doc.setTextColor("#E6007E");
    doc.text(pdfSafe(text), marginX, y);
    y += size + 6;
  };

  const sectionGap = () => {
    y += 8;
    ensureSpace(24);
    doc.setDrawColor("#E6007E");
    doc.line(marginX, y, pageWidth - marginX, y);
    y += 20;
  };

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor("#E6007E");
  doc.text(pdfSafe(SITE.name.toUpperCase()), marginX, y);
  y += 28;

  doc.setFontSize(14);
  doc.setTextColor("#000000");
  doc.text("Personalized Treatment Proposal", marginX, y);
  y += 20;
  write(`Client: ${proposal.client_name}`, 11, "#000000");
  write(`Created: ${new Date(proposal.created_at).toLocaleDateString()}`, 11, "#444444");
  write(`Prepared by: ${preparedByLabel(proposal.created_by)}`, 11, "#444444");
  sectionGap();

  if (proposal.concerns?.length) {
    writeHeading("Consult concerns");
    write(proposal.concerns.join(", "), 11, "#000000");
    sectionGap();
  }

  if (proposal.client_instructions?.trim()) {
    writeHeading("Your instructions");
    write(proposal.client_instructions.trim(), 11, "#000000");
    sectionGap();
  }

  if (proposal.media?.length) {
    writeHeading("Before & after references");
    write(
      `${proposal.media.length} photo(s) attached to your digital proposal link (view online for images).`,
      10,
      "#444444",
    );
    proposal.media.forEach((item) => {
      write(`- ${item.label || item.kind}: ${item.url}`, 9, "#666666", 12);
    });
    sectionGap();
  }

  const credibilityLines = proposalCredibilityPdfLines(proposal.options || []);
  if (credibilityLines.length) {
    writeHeading("Why this plan - technology & credibility", 14);
    credibilityLines.forEach((line) => {
      if (!line.trim()) {
        y += 8;
        return;
      }
      write(line, 10, "#222222", 13);
    });
  }

  // Always start each option on its own page so Option 1 never paints over the cover.
  proposal.options.forEach((option: ProposalOption, index) => {
    doc.addPage();
    y = 56;

    writeHeading(`Option ${index + 1}: ${option.name}`, 16);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor("#000000");
    doc.text("Services", marginX, y);
    y += 16;

    option.services.forEach((service) => {
      write(`- ${formatProposalServiceLine(service)}`, 10, "#111111", 14);
      if (service.description) {
        write(service.description, 9, "#555555", 12);
      }
    });

    sectionGap();
    const subtotal = calculateSubtotal(option.services);
    const discount = calculateDiscount(subtotal, option.discountType, option.discountValue);
    const total = calculateTotal(option);

    write(`Subtotal: ${money(subtotal)}`, 11, "#000000");
    if (discount > 0) {
      write(`Discount: -${money(discount)}`, 11, "#E6007E");
    }
    write(`Total: ${money(total)}`, 13, "#000000");

    if (option.timeline?.length) {
      sectionGap();
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor("#000000");
      doc.text("Suggested timeline", marginX, y);
      y += 16;
      option.timeline.forEach((monthRow) => {
        const labels = monthRow.services
          .map((id) => timelineServiceLabel(id, option.services))
          .join(", ");
        write(`Month ${monthRow.month}: ${labels}`, 10, "#222222", 14);
      });
    }
  });

  doc.addPage();
  y = 72;
  writeHeading("Next Steps", 18);
  write("1) Choose your preferred option.", 12);
  write("2) Confirm your timeline with your provider.", 12);
  write("3) Book your first treatment to lock in your plan.", 12);
  y += 12;
  write(`Questions? Call ${SITE.phone}`, 12, "#000000");
  write(`Book online: ${SITE.url}/book`, 12, "#000000");

  // jsPDF 4.x: "array" returns null in Node — use arraybuffer (same as brow-mapping export).
  return new Uint8Array(doc.output("arraybuffer"));
}
