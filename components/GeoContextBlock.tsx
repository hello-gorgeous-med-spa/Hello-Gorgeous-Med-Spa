import Link from "next/link";

/** Geo-targeted internal links by city. Used on location pages for local SEO. */
export function GeoContextBlock({
  city,
  className = "",
}: {
  city: "oswego" | "naperville" | "plainfield" | "aurora";
  className?: string;
}) {
  const links: Record<string, { href: string; label: string }[]> = {
    oswego: [
      { href: "/botox-oswego-il", label: "Botox in Oswego" },
      { href: "/med-spa-oswego-il", label: "Medical Spa in Oswego" },
      { href: "/weight-loss-oswego-il", label: "Weight Loss Injections near Oswego" },
      { href: "/prf-hair-restoration-oswego-il", label: "PRF Hair Restoration in Oswego" },
      { href: "/hormone-therapy-oswego-il", label: "Hormone Therapy in Oswego" },
    ],
    naperville: [
      { href: "/botox-naperville-il", label: "Botox in Naperville" },
      { href: "/med-spa-naperville-il", label: "Medical Spa near Naperville" },
      { href: "/weight-loss-naperville-il", label: "Weight Loss in Naperville" },
      { href: "/prf-hair-restoration-oswego-il", label: "PRF Hair Restoration" },
      { href: "/hormone-therapy-oswego-il", label: "Hormone Therapy in Oswego" },
    ],
    plainfield: [
      { href: "/botox-plainfield-il", label: "Botox in Plainfield" },
      { href: "/med-spa-plainfield-il", label: "Medical Spa near Plainfield" },
      { href: "/weight-loss-plainfield-il", label: "Weight Loss in Plainfield" },
      { href: "/prf-hair-restoration-oswego-il", label: "PRF Hair Restoration" },
      { href: "/hormone-therapy-oswego-il", label: "Hormone Therapy in Oswego" },
    ],
    aurora: [
      { href: "/botox-aurora-il", label: "Botox in Aurora" },
      { href: "/med-spa-aurora-il", label: "Medical Spa near Aurora" },
      { href: "/weight-loss-aurora-il", label: "Weight Loss in Aurora" },
      { href: "/prf-hair-restoration-oswego-il", label: "PRF Hair Restoration" },
      { href: "/hormone-therapy-oswego-il", label: "Hormone Therapy in Oswego" },
    ],
  };

  const displayLinks = links[city] ?? links.oswego;

  return (
    <div className={`flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-black ${className}`}>
      {displayLinks.map((link) => (
        <Link key={link.href + link.label} href={link.href} className="hover:text-pink-400 transition-colors">
          {link.label}
        </Link>
      ))}
    </div>
  );
}
