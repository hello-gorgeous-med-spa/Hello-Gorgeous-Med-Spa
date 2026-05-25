import type {
  AsymmetryFinding,
  BrowMappingGeometry,
  BrowMappingIntake,
  BrowMappingPlan,
  BrowTechnique,
  FitzpatrickType,
  PigmentDirection,
  PigmentRecommendation,
  SkinUndertone,
} from "@/data/brow-mapping-intelligence";
import { BROW_SHAPES, BROW_STYLE_PREVIEWS, PIGMENT_DIRECTION_LABELS, TINA_PIGMENT_BY_ID } from "@/data/brow-mapping-intelligence";

function pigmentDirection(fitz: FitzpatrickType, undertone: SkinUndertone): PigmentDirection {
  if (undertone === "olive") return "olive-ash";
  if (["I", "II"].includes(fitz) && undertone === "cool") return "warm";
  if (["III", "IV"].includes(fitz) && undertone === "neutral") return "neutral";
  if (undertone === "warm" && ["III", "IV", "V", "VI"].includes(fitz)) return "cool-lean";
  if (["V", "VI"].includes(fitz)) return "cool-lean";
  return "neutral";
}

function startingFamily(
  hair: BrowMappingIntake["naturalHair"],
  direction: PigmentDirection,
): string {
  if (hair === "blonde") return "Blonde / Soft Brown family (Tina Davies I ❤️ INK)";
  if (hair === "light_brown") return "Medium Brown / Bombshell-type neutral";
  if (hair === "medium_brown") return "Medium Brown — HG workhorse neutral";
  if (hair === "dark_brown") return "Dark Brown family — avoid jet black";
  if (direction === "olive-ash") return "Neutral brown + olive/ash modifier (Perma Blend)";
  return "Darkest Brown / Espresso — measured warmth only if cool-pull risk";
}

function buildPigment(intake: BrowMappingIntake): PigmentRecommendation {
  const direction = pigmentDirection(intake.fitzpatrick, intake.undertone);
  const family = startingFamily(intake.naturalHair, direction);

  const modifiers: string[] = [];
  if (direction === "warm") modifiers.push("Warm brown / golden modifier — prevents gray heal on fair cool skin");
  if (direction === "cool-lean") modifiers.push("Slight cool/neutral base — counters warm fade on deep skin");
  if (direction === "olive-ash") modifiers.push("Olive or ash modifier — counters orange drift");

  const healWatch =
    direction === "warm"
      ? "Fair + cool: watch ash/gray heal — pre-warm, go one shade lighter first pass."
      : direction === "olive-ash"
        ? "Olive undertone: orange fade risk over 12–18 months — neutralize early, document photos."
        : direction === "cool-lean"
          ? "Deep/warm skin: avoid ash AND avoid red heal — dark brown with measured warmth."
          : "Neutral path: match hair within ~1 shade; build depth at touch-up.";

  return {
    direction,
    directionLabel: PIGMENT_DIRECTION_LABELS[direction],
    startingFamily: family,
    modifiers,
    healWatch,
    brandNotes:
      "Verify current Perma Blend / Tina Davies shade names with authorized US distributor before ordering. Log brand, mix, lot.",
  };
}

function analyzeAsymmetry(g: BrowMappingGeometry): AsymmetryFinding[] {
  const findings: AsymmetryFinding[] = [];
  const headDelta = Math.abs(g.left.head.y - g.right.head.y);
  const archDelta = Math.abs(g.left.arch.y - g.right.arch.y);
  const leftWidth = Math.hypot(g.left.tail.x - g.left.head.x, g.left.tail.y - g.left.head.y);
  const rightWidth = Math.hypot(g.right.tail.x - g.right.head.x, g.right.tail.y - g.right.head.y);
  const widthRatio = leftWidth / Math.max(rightWidth, 1);

  if (headDelta > 4) {
    findings.push({
      id: "head-height",
      severity: headDelta > 10 ? "moderate" : "mild",
      title: "Head start uneven",
      detail: `Left head ${headDelta.toFixed(0)}px ${g.left.head.y > g.right.head.y ? "lower" : "higher"} than right.`,
      adjust: "Map each side to its own nostril vertical — do not mirror. Match bone, not eyelid.",
    });
  }

  if (archDelta > 5) {
    findings.push({
      id: "arch-height",
      severity: archDelta > 12 ? "moderate" : "mild",
      title: "Arch height mismatch",
      detail: `Arch peaks differ by ~${archDelta.toFixed(0)}px.`,
      adjust:
        g.left.arch.y < g.right.arch.y
          ? "Left arch higher — soften left peak or build right slightly; avoid copying the high side."
          : "Right arch higher — common with dominant side; design for front-view balance at rest.",
    });
  }

  if (widthRatio < 0.85 || widthRatio > 1.15) {
    findings.push({
      id: "tail-length",
      severity: "mild",
      title: "Tail length asymmetry",
      detail: `Brow length ratio L:R ≈ ${widthRatio.toFixed(2)}.`,
      adjust: "Extend shorter tail only to outer-eye guide — never float past nostril→eye corner line.",
    });
  }

  const midX = (g.left.head.x + g.right.head.x) / 2;
  const leftDist = Math.abs(g.left.head.x - midX);
  const rightDist = Math.abs(g.right.head.x - midX);
  if (Math.abs(leftDist - rightDist) > 8) {
    findings.push({
      id: "facial-midline",
      severity: "note",
      title: "Midline offset",
      detail: "Head points sit unevenly from facial center — common with nose/camera angle.",
      adjust: "Trust nostril→pupil lines per side; re-check client is looking straight at camera.",
    });
  }

  if (findings.length === 0) {
    findings.push({
      id: "balanced",
      severity: "note",
      title: "Relatively balanced mapping",
      detail: "Landmark-based guides are close — still confirm in person with client sitting upright.",
      adjust: "Fine-tune handles on canvas if bone structure differs from photo angle.",
    });
  }

  return findings;
}

function pickTechnique(intake: BrowMappingIntake): { technique: BrowTechnique; rationale: string } {
  const preview = BROW_STYLE_PREVIEWS.find((s) => s.id === intake.stylePreview);
  if (preview && preview.id !== "mapping-only") {
    const rationales: Record<BrowMappingIntake["stylePreview"], string> = {
      "mapping-only": "",
      "individual-strokes":
        "Individual hair strokes — stagger spines low → medium → high; best for soft, fluffy, natural goals.",
      ombre: "Ombre powder — pendulum/whip shading; lighter at head, build density toward tail. Ideal for oily skin or filled brow look.",
      hybrid:
        "Hybrid combo — hair strokes through body for texture, powder in tail and sparse zones for retention and balance.",
    };
    return { technique: preview.technique, rationale: rationales[intake.stylePreview] };
  }

  if (intake.existingPmu) {
    return { technique: "combo", rationale: "Existing PMU — combo or correction path; assess old pigment before stroke work." };
  }
  if (intake.oilySkin) {
    return {
      technique: "combo",
      rationale: "Oily skin — softer stroke retention; powder/combo sets realistic expectations vs hair strokes alone.",
    };
  }
  if (intake.goalShape === "fluffy" || intake.goalShape === "soft") {
    return { technique: "microblading", rationale: "Soft/fluffy goal — hair strokes with low/medium/high spine layering." };
  }
  if (intake.goalShape === "lifted" || intake.goalShape === "structured") {
    return { technique: "combo", rationale: "Structured/lifted — define outline + spine strokes with light powder for density." };
  }
  return { technique: "nano", rationale: "Balanced default — nano strokes for even saturation and forgiving heal." };
}

function shapeGuidance(intake: BrowMappingIntake): string {
  const shape = BROW_SHAPES.find((s) => s.id === intake.browShape);
  const shapes: Record<BrowMappingIntake["goalShape"], string> = {
    soft: "Soft arch: keep arch peak subtle, tail tapers thin — stroke weight lighter in head, dense in body.",
    structured: "Structured: crisp outline first, arch 1–2mm above current bone peak max, tail clean to guide.",
    fluffy: "Fluffy: stay inside mapping body, stagger strokes, leave micro-gaps — avoid solid fill.",
    lifted: "Lifted: arch point on nostril–pupil line is anchor; extend tail horizontally, not downward.",
  };
  return `${shape?.label ?? "Arch"} shape — ${shape?.hint ?? ""}. ${shapes[intake.goalShape]}`;
}

export function buildBrowMappingPlan(geometry: BrowMappingGeometry, intake: BrowMappingIntake): BrowMappingPlan {
  const asymmetry = analyzeAsymmetry(geometry);
  const pigment = buildPigment(intake);
  const { technique, rationale: technique_rationale } = pickTechnique(intake);

  const offers = [
    { title: "6–8 week touch-up", detail: "Book at mapping — first pass should stay conservative for depth build." },
    { title: "Aftercare kit + SPF", detail: "PIH prevention especially for " + intake.undertone + " undertone." },
  ];
  if (technique === "combo") offers.push({ title: "Powder refresh add-on", detail: "Tail density or oily zones between stroke sessions." });
  if (intake.existingPmu) offers.push({ title: "Correction consult", detail: "Perma Blend corrector range if neutralizing old tone." });

  const client_script = [
    `We're previewing a ${BROW_SHAPES.find((s) => s.id === intake.browShape)?.label ?? "Soft Arch"} with ${TINA_PIGMENT_BY_ID[intake.tinaPigmentId]?.name ?? "your selected"} pigment, mapped to your bone structure.`,
    `The goal is to create symmetry while keeping the healed result soft and natural.`,
    `For your ${intake.undertone} undertone and ${intake.naturalHair.replace("_", " ")} hair, we'll aim ${pigment.directionLabel.toLowerCase()} so your heal stays natural.`,
    `Today I'm planning ${technique.replace("_", " ")} — ${technique_rationale.split("—")[0]?.trim()}.`,
    `Final healed results vary. Touch-up is recommended at 6–8 weeks.`,
  ].join(" ");

  const provider_checklist = [
    "Confirm client facing straight — retake photo if tilted",
    "Mark mapping with disposable pencil before blade",
    "Patch test if sensitive / correction case",
    "Document photo + pigment + blade + lot",
    ...asymmetry.filter((a) => a.severity !== "note").map((a) => a.adjust),
  ];

  return {
    geometry,
    asymmetry,
    pigment,
    technique,
    technique_rationale,
    shape_guidance: shapeGuidance(intake),
    offers,
    client_script,
    provider_checklist,
    confidence_message:
      "Mapping guides are educational — provider confirms final shape, pigment, and technique in person. Not for client self-treatment.",
  };
}
