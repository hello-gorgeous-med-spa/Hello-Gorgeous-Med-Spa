import {
  ADDON_OFFERS,
  MICRONEEDLING_TIERS,
  SKIN_INTENSITY_MATRIX,
  type DeviceTrack,
  type MicroneedlingConcern,
  type MicroneedlingIntake,
  type MicroneedlingOffer,
  type MicroneedlingPlan,
  type MicroneedlingTierId,
} from "@/data/microneedling-intelligence";

function scoreTier(concerns: MicroneedlingConcern[], experience: MicroneedlingIntake["experience"]): MicroneedlingTierId {
  const set = new Set(concerns);
  let score = 0;

  if (set.has("fine_lines") || set.has("pores") || set.has("oiliness")) score += 2;
  if (set.has("acne_scars") || set.has("texture") || set.has("dullness")) score += 2;
  if (set.has("laxity") || set.has("stretch_marks")) score += 1;
  if (set.has("pigmentation")) score += 1;

  if (experience === "first_time" && score < 3) return "good";
  if (score >= 4 || set.has("acne_scars")) return "better";
  if (score >= 5 && (set.has("fine_lines") || set.has("pores"))) return "best";
  if (score >= 3) return "better";
  return "good";
}

function pickDeviceTrack(concerns: MicroneedlingConcern[], areas: MicroneedlingIntake["areas"]): {
  track: DeviceTrack;
  rationale: string;
} {
  const set = new Set(concerns);
  const body = areas.some((a) => a === "body" || a === "hands");

  if (set.has("laxity") || set.has("stretch_marks") || body) {
    return {
      track: "rf_morpheus8",
      rationale:
        "Laxity, stretch marks, or body zones benefit from RF microneedling (Morpheus8/Burst) — heat + depth for remodeling beyond classic pen limits.",
    };
  }
  if (set.has("acne_scars") && !set.has("fine_lines")) {
    return {
      track: "rf_morpheus8",
      rationale:
        "Moderate–deep acne scarring often needs RF depth for scar wall remodeling — discuss Morpheus8 vs PDRN pen series at consult.",
    };
  }
  return {
    track: "classic_pen",
    rationale: "Primary concerns fit classic microneedling with HG tier serums — texture, pores, tone, and maintenance.",
  };
}

function intensityFromSkin(intake: MicroneedlingIntake): Pick<MicroneedlingPlan, "intensity_direction" | "intensity_note"> {
  const match = SKIN_INTENSITY_MATRIX.find(
    (row) => row.fitz.includes(intake.fitzpatrick) && row.undertone.includes(intake.undertone),
  );
  if (match) return { intensity_direction: match.direction, intensity_note: match.note };

  const deep = ["V", "VI"].includes(intake.fitzpatrick);
  return {
    intensity_direction: deep ? "conservative" : "standard",
    intensity_note: deep
      ? "Deep Fitzpatrick: prioritize PIH prevention — conservative depth, document baseline, strict aftercare."
      : "Standard protocol — adjust live based on skin response.",
  };
}

function buildWatchFors(intake: MicroneedlingIntake): string[] {
  const notes: string[] = [];
  const deep = ["IV", "V", "VI"].includes(intake.fitzpatrick);

  if (intake.undertone === "olive" || intake.undertone === "warm") {
    notes.push("Undertone can drive prolonged erythema or PIH — pre-correct with conservative passes, not deeper stacking.");
  }
  if (intake.concerns.includes("pigmentation") && deep) {
    notes.push("Active pigmentation + deeper Fitz: inflammatory trigger risk — consider series with PDRN, avoid same-day aggressive actives.");
  }
  if (intake.concerns.includes("laxity")) {
    notes.push("Laxity won't fully resolve with superficial pen alone — set expectations or route to Morpheus8.");
  }
  if (intake.concerns.includes("oiliness")) {
    notes.push("Oily skin: microneedling helps texture but retention of topicals varies — Baby Tox tier may address pore/oil if appropriate.");
  }
  if (intake.experience === "first_time") {
    notes.push("First session: under-promise downtime, over-deliver aftercare education — easier to deepen at visit 2.");
  }
  notes.push("You're not treating today's photo — you're planning for heal trajectory over 4–6 weeks between sessions.");
  return notes;
}

function buildOffers(
  tierId: MicroneedlingTierId,
  device: DeviceTrack,
  concerns: MicroneedlingConcern[],
): MicroneedlingOffer[] {
  const offers: MicroneedlingOffer[] = [];
  const add = (id: string) => {
    const o = ADDON_OFFERS.find((x) => x.id === id);
    if (o && !offers.some((x) => x.id === id)) offers.push(o);
  };

  add("package-3");
  add("post-care-kit");

  if (concerns.includes("acne_scars") || concerns.includes("dullness")) add("prp");
  if (device === "rf_morpheus8") add("morpheus-upgrade");
  else if (tierId !== "best") add("morpheus-upgrade");
  if (tierId === "better" || tierId === "best") add("home-peptides");

  return offers.slice(0, 5);
}

function depthGuidance(tierId: MicroneedlingTierId, direction: MicroneedlingPlan["intensity_direction"], device: DeviceTrack): string {
  if (device === "rf_morpheus8") {
    return direction === "conservative"
      ? "Morpheus8: start lower RF + depth, face 1.5–2.5mm equivalent; body Burst only if indicated — build series."
      : "Morpheus8: zone-based depth — face 2–3.5mm for laxity/scars; body Burst up to 8mm per HG protocol & tolerance.";
  }
  const depths: Record<MicroneedlingTierId, string> = {
    good: "Classic pen: 0.5–1.5mm face · 1.5–2.5mm scar zones if tolerated",
    better: "PDRN tier: 1.0–2.0mm scar passes · 0.5–1.25mm general rejuvenation",
    best: "Baby Tox: superficial 0.25–0.75mm — fine lines, pore band, T-zone only where trained",
  };
  const base = depths[tierId];
  return direction === "conservative" ? `${base} · start low end, assess at 15 min` : base;
}

function screenList(concerns: MicroneedlingConcern[]): string[] {
  const base = [
    "Pregnancy / breastfeeding",
    "Active herpes in treatment zone",
    "Isotretinoin within 6 months",
    "Active infection or open lesions",
    "Uncontrolled medical conditions",
  ];
  if (concerns.includes("pigmentation")) {
    base.push("Recent sunburn or tanning — delay until calm");
  }
  if (concerns.includes("acne_scars")) {
    base.push("Active inflammatory acne breakout in target zone");
  }
  return base;
}

export function recommendMicroneedlingPlan(intake: MicroneedlingIntake): MicroneedlingPlan {
  const tierId = scoreTier(intake.concerns, intake.experience);
  const tier = MICRONEEDLING_TIERS[tierId];
  const { track, rationale: device_rationale } = pickDeviceTrack(intake.concerns, intake.areas);
  const { intensity_direction, intensity_note } = intensityFromSkin(intake);
  const watch_fors = buildWatchFors(intake);
  const offers = buildOffers(tierId, track, intake.concerns);
  const depth_guidance = depthGuidance(tierId, intensity_direction, track);

  const concernText = intake.concerns.length
    ? intake.concerns.join(", ")
    : "general rejuvenation";

  const client_summary = [
    `Based on your ${intake.fitzpatrick} skin, ${intake.undertone} undertone, and goals (${concernText}),`,
    `we'd start with **${tier.name}** using ${tier.serum}.`,
    track === "rf_morpheus8"
      ? "Your concerns may also benefit from a Morpheus8 RF consult for deeper remodeling."
      : "Classic microneedling with our tier serums is a strong first line for your goals.",
    `${tier.sessions}. Results build over weeks — a series gives the best collagen outcome.`,
  ].join(" ");

  const provider_note = [
    `Tier: ${tier.label} (${tier.name}) · Serum: ${tier.serum}`,
    `Device track: ${track === "rf_morpheus8" ? "RF Morpheus8 path" : "Classic pen"}`,
    `Intensity: ${intensity_direction} — ${intensity_note}`,
    intake.vision_notes?.length ? `Vision notes: ${intake.vision_notes.join("; ")}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    recommended_tier: tierId,
    tier,
    device_track: track,
    device_rationale,
    serum_protocol: `${tier.serum} — ${tier.serumDetail}`,
    depth_guidance,
    session_plan: tier.sessions,
    offers,
    watch_fors,
    intensity_direction,
    intensity_note,
    screen_before_treating: screenList(intake.concerns),
    client_summary,
    provider_note,
    confidence_message:
      "Educational chairside guide only — licensed provider confirms depth, device, and medical clearance in person.",
  };
}

/** Merge vision-detected concerns with user selections (deduped). */
export function mergeConcerns(
  user: MicroneedlingConcern[],
  vision: MicroneedlingConcern[] | undefined,
): MicroneedlingConcern[] {
  if (!vision?.length) return user;
  return [...new Set([...user, ...vision])].slice(0, 8);
}
