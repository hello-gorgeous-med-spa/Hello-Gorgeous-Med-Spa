"use client";

import {
  BROW_STYLE_PREVIEWS,
  FITZPATRICK_OPTIONS,
  GOAL_OPTIONS,
  HAIR_OPTIONS,
  UNDERTONE_OPTIONS,
  type BrowMappingIntake,
  type BrowStylePreviewId,
  type FitzpatrickType,
  type SkinUndertone,
} from "@/data/brow-mapping-intelligence";

type Props = {
  fitzpatrick: FitzpatrickType;
  undertone: SkinUndertone;
  naturalHair: BrowMappingIntake["naturalHair"];
  goalShape: BrowMappingIntake["goalShape"];
  stylePreview: BrowStylePreviewId;
  oilySkin: boolean;
  existingPmu: boolean;
  onFitzpatrick: (v: FitzpatrickType) => void;
  onUndertone: (v: SkinUndertone) => void;
  onHair: (v: BrowMappingIntake["naturalHair"]) => void;
  onGoal: (v: BrowMappingIntake["goalShape"]) => void;
  onStyle: (v: BrowStylePreviewId) => void;
  onOilySkin: (v: boolean) => void;
  onExistingPmu: (v: boolean) => void;
};

export function ClientProfilePanel(props: Props) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-[#E6007E]">Client profile</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <label className="text-xs text-black">
          Fitzpatrick
          <select
            value={props.fitzpatrick}
            onChange={(e) => props.onFitzpatrick(e.target.value as FitzpatrickType)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-2 py-2 text-sm"
          >
            {FITZPATRICK_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs text-black">
          Undertone
          <select
            value={props.undertone}
            onChange={(e) => props.onUndertone(e.target.value as SkinUndertone)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-2 py-2 text-sm"
          >
            {UNDERTONE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs text-black sm:col-span-2">
          Natural hair
          <select
            value={props.naturalHair}
            onChange={(e) => props.onHair(e.target.value as BrowMappingIntake["naturalHair"])}
            className="mt-1 w-full rounded-lg border border-gray-300 px-2 py-2 text-sm"
          >
            {HAIR_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="mt-3 text-xs font-bold uppercase text-gray-500">Brow goal</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {GOAL_OPTIONS.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => props.onGoal(o.value)}
            className={`rounded-full border px-3 py-1 text-xs font-bold ${
              props.goalShape === o.value ? "border-[#E6007E] bg-[#FFF0F7] text-[#E6007E]" : "border-gray-300"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>

      <p className="mt-4 text-xs font-bold uppercase text-gray-500">Technique preview</p>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {BROW_STYLE_PREVIEWS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => props.onStyle(s.id)}
            className={`rounded-lg border px-3 py-2 text-left ${
              props.stylePreview === s.id ? "border-[#E6007E] bg-[#FFF0F7]" : "border-gray-200"
            }`}
          >
            <p className="text-sm font-bold text-black">{s.label}</p>
            <p className="text-[11px] text-gray-600">{s.description}</p>
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-4 text-sm text-black">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={props.oilySkin} onChange={(e) => props.onOilySkin(e.target.checked)} />
          Oily skin
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={props.existingPmu} onChange={(e) => props.onExistingPmu(e.target.checked)} />
          Existing PMU / correction
        </label>
      </div>
    </section>
  );
}
