import Link from "next/link";

/** Geo-targeted internal links for local SEO. Renders as subtle inline links. */
export function GeoInternalLinks() {
  const links = [
    { href: "/botox-oswego", label: "Botox in Oswego" },
    { href: "/best-botox-oswego-il", label: "Best Botox in Oswego" },
    { href: "/med-spa-naperville-il", label: "Medical Spa near Naperville" },
    { href: "/weight-loss-oswego-il", label: "Weight Loss Injections in Kendall County" },
    { href: "/tirzepatide-program", label: "10-Week Tirzepatide Program" },
    { href: "/hormone-therapy-oswego-il", label: "Hormone Therapy in Oswego" },
    { href: "/prf-hair-restoration-oswego-il", label: "PRF Hair Restoration" },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-black">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="hover:text-[#FF2D8E] transition-colors"
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
