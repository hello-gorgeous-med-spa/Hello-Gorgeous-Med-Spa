import Link from "next/link";

/**
 * Renders body copy with contextual internal links.
 * Phrases in the links map are wrapped in Link components.
 */
export function ContentWithLinks({
  content,
  links,
  className,
}: {
  content: string;
  links: Record<string, string>;
  className?: string;
}) {
  const phrases = Object.keys(links)
    .filter((p) => p.length > 0)
    .sort((a, b) => b.length - a.length);
  if (phrases.length === 0) {
    return <span className={className}>{content}</span>;
  }
  const escaped = phrases.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const regex = new RegExp(`(${escaped.join("|")})`, "g");
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push(content.slice(lastIndex, match.index));
    }
    const phrase = match[1];
    const href = links[phrase];
    if (href) {
      parts.push(
        <Link
          key={`${phrase}-${match.index}`}
          href={href}
          className="text-[#FF2D8E] hover:text-pink-300 underline"
        >
          {phrase}
        </Link>
      );
    } else {
      parts.push(phrase);
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < content.length) {
    parts.push(content.slice(lastIndex));
  }
  return <span className={className}>{parts}</span>;
}
