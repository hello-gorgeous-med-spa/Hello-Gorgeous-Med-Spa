"use client";

import { useState } from "react";
import type { MascotExplanation } from "@/lib/regen/mascot-education";

const MASCOT_CONFIG = {
  peppy: {
    name: "Peppy",
    emoji: "🧬",
    color: "from-purple-600 to-pink-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    textColor: "text-purple-700",
  },
  "slim-t": {
    name: "Slim-T",
    emoji: "⚖️",
    color: "from-pink-600 to-rose-600",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200",
    textColor: "text-pink-700",
  },
  harmony: {
    name: "Harmony",
    emoji: "🧘‍♀️",
    color: "from-violet-600 to-purple-600",
    bgColor: "bg-violet-50",
    borderColor: "border-violet-200",
    textColor: "text-violet-700",
  },
};

function EducationCard({ item }: { item: MascotExplanation }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const config = MASCOT_CONFIG[item.mascot];

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border-2 ${config.borderColor} ${config.bgColor} p-6 transition-all hover:shadow-lg`}
    >
      {/* Mascot Badge */}
      <div className="absolute -right-2 -top-2">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${config.color} text-xl shadow-lg`}
        >
          {config.emoji}
        </div>
      </div>

      {/* Product Name */}
      <p className={`text-xs font-semibold uppercase tracking-wider ${config.textColor}`}>
        {config.name} explains
      </p>
      <h3 className="mb-1 mt-2 text-xl font-bold text-gray-900">{item.product}</h3>
      <p className={`mb-4 text-sm font-medium ${config.textColor}`}>{item.headline}</p>

      {/* Explanation */}
      <p className="mb-4 text-sm leading-relaxed text-gray-700">{item.explanation}</p>

      {/* Benefits */}
      <div className="mb-4 flex flex-wrap gap-2">
        {item.benefits.map((benefit) => (
          <span
            key={benefit}
            className={`rounded-full border ${config.borderColor} bg-white px-3 py-1 text-xs font-medium text-gray-700`}
          >
            ✓ {benefit}
          </span>
        ))}
      </div>

      {/* Fun Fact (Expandable) */}
      {item.funFact && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex w-full items-center gap-2 rounded-xl border ${config.borderColor} bg-white p-3 text-left text-sm transition hover:bg-gray-50`}
        >
          <span className="text-lg">💡</span>
          <span className="flex-1 font-medium text-gray-700">
            {isExpanded ? item.funFact : "Fun fact..."}
          </span>
          <svg
            className={`h-4 w-4 text-gray-400 transition ${isExpanded ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      )}
    </div>
  );
}

export function MascotEducationSection({
  title,
  subtitle,
  explanations,
}: {
  title: string;
  subtitle: string;
  explanations: MascotExplanation[];
}) {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#E6007E]">
            Learn from our guides
          </p>
          <h2 className="mt-2 text-3xl font-bold text-gray-900">{title}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-gray-600">{subtitle}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {explanations.map((item) => (
            <EducationCard key={item.product} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function SingleMascotCard({ explanation }: { explanation: MascotExplanation }) {
  return <EducationCard item={explanation} />;
}
