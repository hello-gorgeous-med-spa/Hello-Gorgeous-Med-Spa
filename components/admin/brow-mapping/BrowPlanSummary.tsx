"use client";

import type { BrowMappingIntake, BrowMappingPlan } from "@/data/brow-mapping-intelligence";
import { BROW_SHAPES, BROW_STYLE_PREVIEWS, PIGMENT_DIRECTION_LABELS } from "@/data/brow-mapping-intelligence";
import { CLINICAL_DISCLAIMER, PIGMENT_PREVIEW_DISCLAIMER, TINA_PIGMENT_BY_ID } from "@/lib/brow-mapping/pigments";

export function BrowPlanSummary({ plan, intake }: { plan: BrowMappingPlan; intake: BrowMappingIntake }) {
  const shape = BROW_SHAPES.find((s) => s.id === intake.browShape);
  const style = BROW_STYLE_PREVIEWS.find((s) => s.id === intake.stylePreview);
  const pigment = TINA_PIGMENT_BY_ID[intake.tinaPigmentId];

  return (
    <div className="space-y-4" id="brow-plan-summary">
      <section className="rounded-xl border-2 border-[#E6007E] bg-[#FFF0F7] p-4">
        <h3 className="font-black text-[#E6007E]">Brow Design Plan</h3>
        <dl className="mt-3 grid gap-2 text-sm text-black">
          <div>
            <dt className="font-bold">Shape</dt>
            <dd>{shape?.label}</dd>
          </div>
          <div>
            <dt className="font-bold">Technique</dt>
            <dd>{style?.label}</dd>
          </div>
          <div>
            <dt className="font-bold">Pigment preview</dt>
            <dd>{pigment?.name}</dd>
          </div>
          <div>
            <dt className="font-bold">Skin profile</dt>
            <dd>
              Fitzpatrick {intake.fitzpatrick}, {intake.undertone} undertone
            </dd>
          </div>
          <div>
            <dt className="font-bold">Hair</dt>
            <dd>{intake.naturalHair.replace("_", " ")}</dd>
          </div>
          <div>
            <dt className="font-bold">Flags</dt>
            <dd>
              Oily skin: {intake.oilySkin ? "Yes" : "No"} · Existing PMU: {intake.existingPmu ? "Yes" : "No"}
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-4">
        <h3 className="font-black text-[#E6007E]">Asymmetry notes</h3>
        <ul className="mt-2 space-y-2 text-sm text-black">
          {plan.asymmetry.map((a) => (
            <li key={a.id} className="rounded-lg bg-gray-50 p-3">
              <p className="font-bold">{a.title}</p>
              <p className="text-gray-700">{a.detail}</p>
              <p className="mt-1 text-[#E6007E]">→ {a.adjust}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-black">
        <h3 className="font-black text-[#E6007E]">Pigment direction</h3>
        <p className="mt-2 text-xl font-black">{PIGMENT_DIRECTION_LABELS[plan.pigment.direction]}</p>
        <p className="mt-2">
          <strong>Start:</strong> {plan.pigment.startingFamily}
        </p>
        {plan.pigment.modifiers.map((m) => (
          <p key={m} className="text-gray-700">
            • {m}
          </p>
        ))}
        <p className="mt-2 rounded-lg border-l-4 border-[#E6007E] bg-[#FFF0F7] px-3 py-2">{plan.pigment.healWatch}</p>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-black">
        <h3 className="font-black text-[#E6007E]">Client script</h3>
        <p className="mt-2 leading-relaxed">{plan.client_script}</p>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-black">
        <h3 className="font-black text-[#E6007E]">Reminders</h3>
        <ul className="mt-2 space-y-1">
          {plan.offers.map((o) => (
            <li key={o.title}>
              <strong>{o.title}</strong> — {o.detail}
            </li>
          ))}
          <li>Final healed results vary. Touch-up is recommended at 6–8 weeks.</li>
        </ul>
      </section>

      <p className="text-[11px] text-gray-500">
        {PIGMENT_PREVIEW_DISCLAIMER} {CLINICAL_DISCLAIMER}
      </p>
    </div>
  );
}
