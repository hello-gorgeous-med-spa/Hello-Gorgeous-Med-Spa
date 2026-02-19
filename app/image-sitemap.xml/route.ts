import { SERVICE_IMAGES, SITE } from "@/lib/seo";

/**
 * Image Sitemap for Google Images SEO
 * Helps Google discover and index all service images
 * @see https://developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps
 */

const additionalImages = [
  // Hero & Brand Images
  { src: "/images/hero-banner.png", title: "Hello Gorgeous Med Spa Hero", caption: "Premium medical aesthetics in Oswego, IL - Botox, Fillers, Weight Loss" },
  { src: "/images/logo-full.png", title: "Hello Gorgeous Med Spa Logo", caption: "Hello Gorgeous Med Spa official logo" },
  
  // Before/After Results
  { src: "/images/lip-filler-before-after.png", title: "Lip Filler Before and After", caption: "Lip filler results at Hello Gorgeous Med Spa" },
  { src: "/images/botox-lip-flip-before-after.png", title: "Botox Lip Flip Before and After", caption: "Botox lip flip results at Hello Gorgeous Med Spa" },
  { src: "/images/gummy-smile-before-after.png", title: "Gummy Smile Correction", caption: "Gummy smile Botox treatment results" },
  { src: "/images/results/revanesse-1.png", title: "Revanesse Filler Results", caption: "Revanesse dermal filler before and after" },
  { src: "/images/results/revanesse-2.png", title: "Revanesse Filler Results", caption: "Revanesse dermal filler transformation" },
  
  // Treatment Images
  { src: "/images/botox-lip-flip-hero.png", title: "Botox Lip Flip Treatment", caption: "Botox lip flip procedure at Hello Gorgeous Med Spa" },
  { src: "/images/hg-botox-face-neck.png", title: "Botox Face and Neck", caption: "Botox treatment areas face and neck" },
  
  // Microneedling
  { src: "/images/microneedling/microneedling-before-after-1.png", title: "Microneedling Results", caption: "RF Microneedling before and after results" },
  { src: "/images/microneedling/microneedling-before-after-2.png", title: "Microneedling Results", caption: "RF Microneedling skin transformation" },
  
  // Laser
  { src: "/images/laser/laser-hair-removal-results.png", title: "Laser Hair Removal Results", caption: "Laser hair removal treatment results" },
  { src: "/images/laser/zemits-duocratis-hero.png", title: "Zemits DuoCratis Laser", caption: "Advanced laser technology at Hello Gorgeous" },
  
  // Team
  { src: "/images/team/ryan-kent.png", title: "Ryan Kent FNP-BC", caption: "Ryan Kent, Family Nurse Practitioner at Hello Gorgeous Med Spa" },
  { src: "/images/team/danielle.png", title: "Danielle Alcala", caption: "Danielle Alcala, Owner of Hello Gorgeous Med Spa" },
  { src: "/images/team/ryan-danielle.png", title: "Hello Gorgeous Team", caption: "Ryan Kent and Danielle Alcala - Hello Gorgeous Med Spa founders" },
  
  // Partners
  { src: "/images/partners/alle-rewards.png", title: "Allē Rewards Partner", caption: "Hello Gorgeous is an Allē Rewards participating provider" },
  { src: "/images/partners/jeuveau.png", title: "Jeuveau Provider", caption: "Jeuveau neuromodulator available at Hello Gorgeous" },
  { src: "/images/partners/cherry.png", title: "Cherry Financing", caption: "Cherry payment plans available at Hello Gorgeous Med Spa" },
  { src: "/images/partners/anteage.png", title: "AnteAGE Partner", caption: "AnteAGE stem cell skincare at Hello Gorgeous" },
  
  // BioTE
  { src: "/images/biote/certified-seal.png", title: "BioTE Certified Provider", caption: "BioTE certified hormone therapy provider" },
  { src: "/images/biote/info-flyer.png", title: "BioTE Hormone Therapy", caption: "BioTE bioidentical hormone replacement information" },
  
  // RX Authority
  { src: "/images/rx/hg-ryan-kent-rx-authority.png", title: "Ryan Kent Prescriptive Authority", caption: "Full prescriptive authority for medical treatments" },
  { src: "/images/rx/hg-ryan-kent-prescription-pad.png", title: "Prescription Pad", caption: "Ryan Kent FNP-BC prescription authority" },
  
  // Virtual & Consultation
  { src: "/images/hg-virtual-consult-phone.png", title: "Virtual Consultation", caption: "Book a virtual telehealth consultation" },
  { src: "/images/hg-consult-body.png", title: "Body Consultation", caption: "Full body consultation at Hello Gorgeous" },
  
  // Events
  { src: "/images/events/botox-party.png", title: "Botox Party", caption: "Host a Botox party at Hello Gorgeous Med Spa" },
];

export async function GET() {
  const allImages = [
    ...SERVICE_IMAGES.map(img => ({
      src: img.src,
      title: img.title,
      caption: img.alt,
    })),
    ...additionalImages,
  ];

  // Group images by the page they're most relevant to
  const pageImageMap: Record<string, typeof allImages> = {
    "/": allImages.filter(img => 
      img.src.includes("hero") || 
      img.src.includes("logo") || 
      img.src.includes("consultation") ||
      img.src.includes("vip") ||
      img.src.includes("team")
    ),
    "/services/botox-dysport-jeuveau": allImages.filter(img => 
      img.src.toLowerCase().includes("botox") || 
      img.src.includes("jeuveau")
    ),
    "/services/dermal-fillers": allImages.filter(img => 
      img.src.includes("filler") || 
      img.src.includes("lip") ||
      img.src.includes("revanesse")
    ),
    "/services/lip-filler": allImages.filter(img => 
      img.src.includes("lip")
    ),
    "/services/weight-loss-therapy": allImages.filter(img => 
      img.src.includes("weight") || 
      img.src.includes("semaglutide") ||
      img.src.includes("glp1")
    ),
    "/services/rf-microneedling": allImages.filter(img => 
      img.src.includes("microneedling")
    ),
    "/services/biote-hormone-therapy": allImages.filter(img => 
      img.src.includes("biote") || 
      img.src.includes("hormone") ||
      img.src.includes("pellet")
    ),
    "/services/laser-hair-removal": allImages.filter(img => 
      img.src.includes("laser")
    ),
    "/services/hydra-facial": allImages.filter(img => 
      img.src.includes("hydrafacial")
    ),
    "/services/chemical-peels": allImages.filter(img => 
      img.src.includes("peel")
    ),
    "/services/prp": allImages.filter(img => 
      img.src.includes("prp") || 
      img.src.includes("prf")
    ),
    "/services/iv-therapy": allImages.filter(img => 
      img.src.includes("iv-") || 
      img.src.includes("vitamin")
    ),
    "/rx": allImages.filter(img => 
      img.src.includes("rx") || 
      img.src.includes("prescription") ||
      img.src.includes("peptide")
    ),
    "/rx/hormones": allImages.filter(img => 
      img.src.includes("hormone")
    ),
    "/rx/metabolic": allImages.filter(img => 
      img.src.includes("weight") || 
      img.src.includes("glp1") ||
      img.src.includes("semaglutide")
    ),
    "/providers": allImages.filter(img => 
      img.src.includes("team") || 
      img.src.includes("ryan") ||
      img.src.includes("danielle")
    ),
    "/about": allImages.filter(img => 
      img.src.includes("team")
    ),
  };

  // Build XML
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

  for (const [pagePath, images] of Object.entries(pageImageMap)) {
    if (images.length === 0) continue;
    
    xml += `  <url>
    <loc>${SITE.url}${pagePath}</loc>
`;
    
    for (const img of images) {
      xml += `    <image:image>
      <image:loc>${SITE.url}${img.src}</image:loc>
      <image:title>${escapeXml(img.title)}</image:title>
      <image:caption>${escapeXml(img.caption)}</image:caption>
    </image:image>
`;
    }
    
    xml += `  </url>
`;
  }

  xml += `</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
