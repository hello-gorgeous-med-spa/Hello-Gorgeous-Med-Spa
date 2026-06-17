import { HOME_TESTIMONIALS } from "@/lib/seo";

export function StaticFeaturedReviews() {
  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {HOME_TESTIMONIALS.map((t) => (
        <li
          key={`${t.name}-${t.service}`}
          className="rounded-2xl border-2 border-black bg-white p-6 shadow-[4px_4px_0_0_rgba(230,0,126,0.25)]"
        >
          <p className="text-[#E6007E]" aria-label={`${t.rating} stars`}>
            {"★".repeat(t.rating)}
            <span className="text-black/20">{"★".repeat(5 - t.rating)}</span>
          </p>
          <blockquote className="mt-3 text-black/85 leading-relaxed">&ldquo;{t.text}&rdquo;</blockquote>
          <p className="mt-4 text-sm font-bold text-black">{t.name}</p>
          <p className="text-xs text-black/60">
            {t.location} · {t.service}
          </p>
        </li>
      ))}
    </ul>
  );
}
