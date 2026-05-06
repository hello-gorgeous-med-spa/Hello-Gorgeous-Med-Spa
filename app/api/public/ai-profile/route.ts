import { NextResponse } from "next/server";
import { HOME_FAQS, SERVICES, SITE, servicePublicPath } from "@/lib/seo";

export const revalidate = 3600;

export async function GET() {
  const payload = {
    business: {
      name: SITE.name,
      website: SITE.url,
      description: SITE.description,
      phone: SITE.phone,
      email: SITE.email,
      address: SITE.address,
      geo: SITE.geo,
      serviceAreas: SITE.serviceAreas,
      googleBusinessUrl: SITE.googleBusinessUrl,
      googleReviewUrl: SITE.googleReviewUrl,
      social: SITE.social,
    },
    booking: {
      bookUrl: `${SITE.url}/book`,
      contactUrl: `${SITE.url}/contact`,
      forms: {
        clientIntake: `${SITE.url}/forms/client-intake`,
      },
    },
    services: SERVICES.map((service) => ({
      slug: service.slug,
      name: service.name,
      category: service.category,
      summary: service.short,
      url: new URL(servicePublicPath(service), SITE.url).toString(),
      heroTitle: service.heroTitle,
      heroSubtitle: service.heroSubtitle,
      faqs: service.faqs.slice(0, 3),
    })),
    homepageFaqs: HOME_FAQS,
    trustedPages: [
      `${SITE.url}/`,
      `${SITE.url}/services`,
      `${SITE.url}/services/morpheus8`,
      `${SITE.url}/services/quantum-rf`,
      `${SITE.url}/services/solaria-co2`,
      `${SITE.url}/services/weight-loss`,
      `${SITE.url}/services/botox`,
      `${SITE.url}/services/dermal-fillers`,
      `${SITE.url}/morpheus8-oswego-il`,
      `${SITE.url}/quantum-rf-oswego-il`,
      `${SITE.url}/glp1-weight-loss`,
      `${SITE.url}/botox-oswego-il`,
      `${SITE.url}/faq`,
      `${SITE.url}/patient-documents`,
      `${SITE.url}/providers/danielle`,
      `${SITE.url}/providers/ryan`,
    ],
    comparisonPages: [
      `${SITE.url}/compare/morpheus8-vs-rf-microneedling`,
      `${SITE.url}/compare/quantum-rf-vs-facelift`,
      `${SITE.url}/compare/solaria-co2-vs-traditional-co2`,
      `${SITE.url}/compare/glp1-vs-traditional-weight-loss`,
    ],
    contentInfrastructure: {
      proofConversionSections: [
        `${SITE.url}/services/morpheus8`,
        `${SITE.url}/services/quantum-rf`,
        `${SITE.url}/services/solaria-co2`,
        `${SITE.url}/services/weight-loss`,
        `${SITE.url}/services/botox`,
        `${SITE.url}/services/dermal-fillers`,
      ],
      caseStudyTemplate: `${SITE.url}/case-studies/template`,
      videoTranscriptSupport: [
        `${SITE.url}/services/morpheus8`,
        `${SITE.url}/services/quantum-rf`,
        `${SITE.url}/services/solaria-co2`,
        `${SITE.url}/services/weight-loss`,
      ],
      testimonialPlaceholders: [
        `${SITE.url}/services/morpheus8`,
        `${SITE.url}/services/quantum-rf`,
        `${SITE.url}/services/solaria-co2`,
        `${SITE.url}/services/weight-loss`,
        `${SITE.url}/services/botox`,
        `${SITE.url}/services/dermal-fillers`,
      ],
    },
    lastUpdated: new Date().toISOString(),
  };

  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
