import type { PmuTemplateId } from "@/data/pmu-practice";

const SKIN = "#e8c4a8";
const SKIN_SHADOW = "#d4a882";
const LINE = "#c9a07a";

/** Stylized practice face — illustration only, no client likeness. */
function frontFaceSvg(showGuides: boolean): string {
  const guides = showGuides
    ? `
  <g opacity="0.85" stroke="#E6007E" stroke-width="1.5" fill="none">
    <line x1="250" y1="520" x2="250" y2="180" stroke-dasharray="6 4"/>
    <line x1="350" y1="520" x2="350" y2="180" stroke-dasharray="6 4"/>
    <line x1="250" y1="520" x2="195" y2="248"/>
    <line x1="350" y1="520" x2="405" y2="248"/>
    <line x1="250" y1="520" x2="168" y2="268"/>
    <line x1="350" y1="520" x2="432" y2="268"/>
    <line x1="120" y1="248" x2="480" y2="248"/>
    <line x1="300" y1="520" x2="300" y2="180" opacity="0.5"/>
    <text x="252" y="172" font-size="9" fill="#E6007E" font-family="sans-serif">HEAD</text>
    <text x="392" y="238" font-size="9" fill="#E6007E" font-family="sans-serif">ARCH</text>
    <text x="430" y="258" font-size="9" fill="#E6007E" font-family="sans-serif">TAIL</text>
  </g>`
    : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 720" width="600" height="720">
  <defs>
    <radialGradient id="skin" cx="50%" cy="40%" r="55%">
      <stop offset="0%" stop-color="${SKIN}"/>
      <stop offset="100%" stop-color="${SKIN_SHADOW}"/>
    </radialGradient>
  </defs>
  <rect width="600" height="720" fill="#f5f0eb"/>
  <ellipse cx="300" cy="380" rx="195" ry="240" fill="url(#skin)"/>
  <ellipse cx="300" cy="430" rx="120" ry="145" fill="${SKIN_SHADOW}" opacity="0.15"/>
  <path d="M300 620 Q260 660 220 640 Q200 600 210 560 Q240 590 300 600 Q360 590 390 560 Q400 600 380 640 Q340 660 300 620" fill="#c97878" opacity="0.35"/>
  <path d="M300 598 Q285 610 270 605 Q275 595 300 592 Q325 595 330 605 Q315 610 300 598" fill="#b85c5c" opacity="0.5"/>
  <ellipse cx="230" cy="340" rx="38" ry="22" fill="#fff" opacity="0.9"/>
  <ellipse cx="370" cy="340" rx="38" ry="22" fill="#fff" opacity="0.9"/>
  <circle cx="230" cy="342" r="14" fill="#4a3728"/>
  <circle cx="370" cy="342" r="14" fill="#4a3728"/>
  <circle cx="234" cy="338" r="4" fill="#fff" opacity="0.6"/>
  <circle cx="374" cy="338" r="4" fill="#fff" opacity="0.6"/>
  <path d="M300 360 L292 430 L308 430 Z" fill="${LINE}" opacity="0.35"/>
  <path d="M268 248 Q300 222 332 248" stroke="${LINE}" stroke-width="2" fill="none" opacity="0.25"/>
  <ellipse cx="185" cy="248" rx="52" ry="18" fill="${SKIN_SHADOW}" opacity="0.12"/>
  <ellipse cx="415" cy="248" rx="52" ry="18" fill="${SKIN_SHADOW}" opacity="0.12"/>
  <text x="300" y="690" text-anchor="middle" font-size="11" fill="#8b7355" font-family="sans-serif">Front face · brow mapping template</text>
  ${guides}
</svg>`;
}

function browCloseupSvg(showGuides: boolean): string {
  const guides = showGuides
    ? `
  <g opacity="0.8" stroke="#E6007E" stroke-width="1.2" fill="none">
    <line x1="120" y1="280" x2="480" y2="280" stroke-dasharray="5 3"/>
    <line x1="300" y1="120" x2="300" y2="380"/>
    <rect x="155" y="248" width="290" height="52" rx="26" stroke="#FF2D8E" stroke-dasharray="4 4" fill="none"/>
    <text x="300" y="110" text-anchor="middle" font-size="10" fill="#E6007E" font-family="sans-serif">SPINE · LOW → HIGH</text>
  </g>`
    : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 420" width="600" height="420">
  <rect width="600" height="420" fill="#faf6f2"/>
  <ellipse cx="300" cy="290" rx="240" ry="110" fill="${SKIN}"/>
  <ellipse cx="185" cy="268" rx="70" ry="28" fill="${SKIN_SHADOW}" opacity="0.2"/>
  <ellipse cx="415" cy="268" rx="70" ry="28" fill="${SKIN_SHADOW}" opacity="0.2"/>
  <path d="M155 276 Q220 248 300 252 Q380 248 445 276" stroke="${LINE}" stroke-width="1.5" fill="none" opacity="0.2"/>
  <text x="300" y="395" text-anchor="middle" font-size="11" fill="#8b7355" font-family="sans-serif">Brow close-up · stroke density practice</text>
  ${guides}
</svg>`;
}

function blankWorksheetSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 720" width="600" height="720">
  <rect width="600" height="720" fill="#fff"/>
  <defs>
    <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
      <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#ece6df" stroke-width="0.8"/>
    </pattern>
  </defs>
  <rect width="600" height="720" fill="url(#grid)"/>
  <rect x="80" y="140" width="440" height="120" rx="60" fill="none" stroke="#ddd5cc" stroke-width="1.5" stroke-dasharray="8 6"/>
  <rect x="80" y="460" width="440" height="120" rx="60" fill="none" stroke="#ddd5cc" stroke-width="1.5" stroke-dasharray="8 6"/>
  <text x="300" y="130" text-anchor="middle" font-size="11" fill="#8b7355" font-family="sans-serif">Left brow zone</text>
  <text x="300" y="450" text-anchor="middle" font-size="11" fill="#8b7355" font-family="sans-serif">Right brow zone</text>
  <text x="300" y="690" text-anchor="middle" font-size="11" fill="#8b7355" font-family="sans-serif">Blank worksheet · repeat shapes &amp; strokes</text>
</svg>`;
}

export function templateSvgDataUrl(templateId: PmuTemplateId, showGuides: boolean): string {
  let svg: string;
  switch (templateId) {
    case "front-face":
      svg = frontFaceSvg(showGuides);
      break;
    case "brow-closeup":
      svg = browCloseupSvg(showGuides);
      break;
    case "blank-canvas":
      svg = blankWorksheetSvg();
      break;
  }
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function templateDimensions(templateId: PmuTemplateId): { width: number; height: number } {
  switch (templateId) {
    case "brow-closeup":
      return { width: 600, height: 420 };
    default:
      return { width: 600, height: 720 };
  }
}

export async function loadTemplateImage(
  templateId: PmuTemplateId,
  showGuides: boolean,
): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = templateSvgDataUrl(templateId, showGuides);
  });
}
