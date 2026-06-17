import Link from "next/link";

import type { FooterNavColumn, FooterNavLink } from "@/lib/footer-nav";

function FooterNavLinkItem({ link }: { link: FooterNavLink }) {
  const className = "text-white hover:text-[#FF2D8E] transition-colors";

  if (link.external || link.href.startsWith("tel:") || link.href.startsWith("http")) {
    return (
      <a
        href={link.href}
        className={className}
        {...(link.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {link.label}
      </a>
    );
  }

  return (
    <Link href={link.href} className={className}>
      {link.label}
    </Link>
  );
}

export function FooterNavColumnBlock({ column }: { column: FooterNavColumn }) {
  return (
    <div>
      <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#FF2D8E]">{column.title}</h4>
      <ul className="space-y-2.5 text-sm">
        {column.links.map((link) => (
          <li key={`${column.id}-${link.href}-${link.label}`}>
            <FooterNavLinkItem link={link} />
          </li>
        ))}
      </ul>
    </div>
  );
}
