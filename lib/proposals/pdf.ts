import { jsPDF } from "jspdf";
import { SITE } from "@/lib/seo";
import { proposalCredibilityPdfLines } from "@/lib/proposals/credibility";
import {
  calculateDiscount,
  calculateSubtotal,
  calculateTotal,
  formatProposalServiceLine,
  type ProposalOption,
} from "@/lib/proposals/utils";
import type { TreatmentProposalRecord } from "@/lib/proposals/types";

function money(value: number): string {
  return `$${value.toFixed(2)}`;
}

export function buildProposalPdf(proposal: TreatmentProposalRecord): Uint8Array {
  const doc = new jsPDF({ format: "letter", unit: "pt" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const marginX = 48;
  const maxWidth = pageWidth - marginX * 2;
  let y = 56;

  const write = (text: string, size = 11, color = "#000000", spacing = 16) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(size);
    doc.setTextColor(color);
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, marginX, y);
    y += lines.length * spacing;
  };

  const sectionGap = () => {
    y += 8;
    doc.setDrawColor("#E6007E");
    doc.line(marginX, y, pageWidth - marginX, y);
    y += 20;
  };

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor("#E6007E");
  doc.text(SITE.name.toUpperCase(), marginX, y);
  y += 28;

  doc.setFontSize(14);
  doc.setTextColor("#000000");
  doc.text("Personalized Treatment Proposal", marginX, y);
  y += 20;
  write(`Client: ${proposal.client_name}`, 11, "#000000");
  write(`Created: ${new Date(proposal.created_at).toLocaleDateString()}`, 11, "#444444");
  write(`Prepared by: ${proposal.created_by}`, 11, "#444444");
  sectionGap();

  if (proposal.concerns?.length) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor("#E6007E");
    doc.text("Consult concerns", marginX, y);
    y += 16;
    write(proposal.concerns.join(", "), 11, "#000000");
    sectionGap();
  }

  if (proposal.client_instructions?.trim()) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor("#E6007E");
    doc.text("Your instructions", marginX, y);
    y += 16;
    write(proposal.client_instructions.trim(), 11, "#000000");
    sectionGap();
  }

  if (proposal.media?.length) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor("#E6007E");
    doc.text("Before & after references", marginX, y);
    y += 16;
    write(
      `${proposal.media.length} photo(s) attached to your digital proposal link (view online for images).`,
      10,
      "#444444"
    );
    proposal.media.forEach((item) => {
      write(`- ${item.label || item.kind}: ${item.url}`, 9, "#666666", 12);
    });
    sectionGap();
  }

  const credibilityLines = proposalCredibilityPdfLines(proposal.options || []);
  if (credibilityLines.length) {
    if (y > 640) {
      doc.addPage();
      y = 56;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor("#E6007E");
    doc.text("Why this plan — technology & credibility", marginX, y);
    y += 20;
    credibilityLines.forEach((line) => {
      if (!line.trim()) {
        y += 8;
        return;
      }
      if (y > 720) {
        doc.addPage();
        y = 56;
      }
      write(line, 10, "#222222", 13);
    });
    sectionGap();
  }

  proposal.options.forEach((option: ProposalOption, index) => {
    if (index > 0) doc.addPage();
    y = 56;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor("#E6007E");
    doc.text(`Option ${index + 1}: ${option.name}`, marginX, y);
    y += 24;

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
    write(`Discount: -${money(discount)}`, 11, "#E6007E");
    write(`Total: ${money(total)}`, 12, "#000000");

    if (option.timeline?.length) {
      sectionGap();
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor("#000000");
      doc.text("Suggested timeline", marginX, y);
      y += 16;
      option.timeline.forEach((monthRow) => {
        write(`Month ${monthRow.month}: ${monthRow.services.join(", ")}`, 10, "#222222", 14);
      });
    }
  });

  doc.addPage();
  y = 72;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor("#E6007E");
  doc.text("Next Steps", marginX, y);
  y += 24;
  write("1) Choose your preferred option.", 12);
  write("2) Confirm your timeline with your provider.", 12);
  write("3) Book your first treatment to lock in your plan.", 12);
  y += 12;
  write(`Questions? Call ${SITE.phone}`, 12, "#000000");
  write(`Book online: ${SITE.url}/book`, 12, "#000000");

  // jsPDF 4.x: "array" returns null in Node — use arraybuffer (same as brow-mapping export).
  return new Uint8Array(doc.output("arraybuffer"));
}
