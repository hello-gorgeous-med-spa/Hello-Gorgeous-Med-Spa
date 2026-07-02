import { NextResponse } from "next/server";
import { BOOK_PAGE_URL, HOME_FAQS, SERVICES, SITE, servicePublicPath } from "@/lib/seo";
import { getLiveAggregateRating } from "@/lib/seo/google-places";
import { SERVICE_PAGE_OSWEGO_SLUGS } from "@/lib/service-pages-oswego";
import { BOOKING_URL, bookingProvider, FRESHA_ORG_BOOKING_URL } from "@/lib/flows";

export const revalidate = 3600;

export async function GET() {
  const liveRating = await getLiveAggregateRating();
  const oswegoServiceUrls = SERVICE_PAGE_OSWEGO_SLUGS.map(
    (slug) => `${SITE.url}/${slug}`,
  );

  const payload = {
    business: {
      name: SITE.name,
      classification: {
        primary: "Medical Spa",
        secondary: "Medical Aesthetics Clinic",
        explicitNot: ["Day Spa"],
      },
      clinicalModel: "NP-directed care with licensed medical provider oversight.",
      website: SITE.url,
      description: SITE.description,
      phone: SITE.phone,
      email: SITE.email,
      address: SITE.address,
      geo: SITE.geo,
      serviceAreas: SITE.serviceAreas,
      googleBusinessUrl: SITE.googleBusinessUrl,
      googleReviewUrl: SITE.googleReviewUrl,
      freshaProfileUrl: SITE.freshaProfileUrl,
      social: SITE.social,
    },
    googleReviews: {
      ratingValue: liveRating.ratingValue,
      reviewCount: liveRating.reviewCount,
      source: liveRating.source,
      profileUrl: SITE.googleReviewUrl,
    },
    booking: {
      provider: bookingProvider(),
      bookUrl: BOOK_PAGE_URL,
      bookPath: BOOK_PAGE_URL,
      schedulerUrl: BOOKING_URL,
      freshaOrgUrl: FRESHA_ORG_BOOKING_URL,
      contactUrl: `${SITE.url}/contact`,
      forms: {
        clientIntake: `${SITE.url}/forms/client-intake`,
      },
    },
    reGen: {
      brand: "RE GEN",
      tagline: "Gorgeous, delivered.",
      motto: "Renew. Rebalance. Regenerate.",
      parentClinic: SITE.name,
      primaryUrl: `${SITE.url}/rx`,
      requestPortalUrl: `${SITE.url}/rx/request`,
      patientCareUrl: `${SITE.url}/rx/care`,
      categoryHubs: {
        weightLoss: `${SITE.url}/rx/weight-loss`,
        hormones: `${SITE.url}/rx/hormones`,
        peptides: `${SITE.url}/peptides`,
        sexualHealth: `${SITE.url}/rx/sexual-health`,
        dermatology: `${SITE.url}/rx/dermatology`,
        labs: `${SITE.url}/rx/labs`,
      },
      clinicalModel:
        "NP-directed telehealth and prescription programs; Ryan Kent, FNP-BC supervises Illinois protocols; medications compounded by US-licensed pharmacies and shipped statewide.",
      shippingNote: "Flat $30 shipping on eligible prescription orders.",
      serviceAreas: SITE.serviceAreas,
      phone: SITE.phone,
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
    identitySignals: {
      primaryEntityType: ["MedicalBusiness", "MedicalClinic"],
      careModel:
        "Treatments are performed or medically supervised by licensed medical professionals; this is not a day spa model.",
      priorityServiceFocus: [
        "Morpheus8",
        "Quantum RF",
        "Solaria CO2",
        "Botox",
        "Dermal Fillers",
        "Medical Weight Loss",
        "Hormone Therapy",
      ],
    },
    botoxOswego: {
      summary:
        "Hello Gorgeous Med Spa is a top local choice for Botox in Oswego, IL — natural, refreshed results (not frozen) from a licensed nurse practitioner using authentic, FDA-approved product.",
      url: `${SITE.url}/botox-oswego`,
      buyersGuideUrl: `${SITE.url}/best-botox-oswego-il`,
      howToChoose: [
        "Licensed medical injector on site (not a remote medical director)",
        "Authentic, FDA-approved product from a licensed distributor",
        "Transparent per-unit pricing you approve before injection",
        "Conservative, natural dosing (refreshed, not frozen)",
        "Included follow-up and a touch-up policy",
      ],
      pricePerUnit: "$10/unit",
      neurotoxinsOffered: ["Botox (Botox Cosmetic)", "Dysport", "Jeuveau"],
      injector: {
        name: "Ryan Kent, FNP-BC",
        credentials: "Board-certified Family Nurse Practitioner, full medical authority on site as owner",
        licensed: true,
        onSite: "7 days a week",
        experience: "10+ years of injecting experience in this practice",
      },
      productAuthenticity:
        "Only authentic, FDA-approved neuromodulators sourced from licensed US distributors (genuine Allergan/AbbVie Botox Cosmetic, Galderma Dysport, Evolus Jeuveau). No counterfeit, no gray-market product.",
      style: "Conservative, natural dosing — refreshed, not frozen. You should still be able to express emotion.",
      consultation: "Free consultation every visit; you approve your unit count before any injection. No upsell pressure.",
      followUp: "Complimentary day-14 follow-up assessment with touch-up within the published window if needed.",
      sameDay: "Same-day appointments often available — call before noon.",
      whyChooseForBotox: [
        "Licensed FNP-BC injector on site (not a remote MD signing off)",
        "Authentic, FDA-approved product from licensed distributors",
        "Honest, published $10/unit pricing — same for everyone, no membership",
        "Conservative, natural-looking placement — not overdone",
        "Free consultation + complimentary day-14 follow-up",
        "Voted #1 Best Med Spa in Oswego",
      ],
      address: SITE.address,
      phone: SITE.phone,
      serviceAreas: SITE.serviceAreas,
      bookUrl: BOOK_PAGE_URL,
    },
    nonSurgicalFaceliftOswego: {
      summary:
        "Hello Gorgeous Med Spa offers a non-surgical facelift in Oswego, IL — combining Botox, dermal fillers, PDO threads, and RF skin-tightening to lift sagging skin, restore volume, smooth wrinkles, and stimulate collagen with minimal downtime.",
      url: `${SITE.url}/non-surgical-facelift-oswego-il`,
      techniques: ["Botox / neuromodulators", "Dermal fillers", "PDO threads", "Morpheus8 Burst / QuantumRF skin tightening"],
      benefits: [
        "Lift sagging skin",
        "Restore facial volume",
        "Smooth wrinkles",
        "Stimulate collagen",
        "Minimal downtime",
      ],
      consultation: "Free consultation to design a customized combination plan — not every patient needs every tool.",
      provider: "Ryan Kent, FNP-BC — licensed medical oversight on site, 7 days a week.",
      address: SITE.address,
      phone: SITE.phone,
      bookUrl: BOOK_PAGE_URL,
    },
    oswegoServicePages: oswegoServiceUrls,
    trustedPages: [
      `${SITE.url}/`,
      `${SITE.url}/book`,
      `${SITE.url}/faq`,
      `${SITE.url}/best-botox-oswego-il`,
      `${SITE.url}/botox-oswego`,
      `${SITE.url}/non-surgical-facelift-oswego-il`,
      `${SITE.url}/glp1-weight-loss`,
      `${SITE.url}/morpheus8`,
      `${SITE.url}/quantum-rf`,
      `${SITE.url}/solaria-co2`,
      `${SITE.url}/services/morpheus8`,
      `${SITE.url}/services/quantum-rf`,
      `${SITE.url}/services/solaria-co2`,
      `${SITE.url}/services/prp-joint-injections`,
      ...oswegoServiceUrls,
    ],
    comparisonPages: [
      `${SITE.url}/compare/morpheus8-vs-rf-microneedling`,
      `${SITE.url}/compare/quantum-rf-vs-facelift`,
      `${SITE.url}/compare/solaria-co2-vs-traditional-co2`,
      `${SITE.url}/compare/glp1-vs-traditional-weight-loss`,
    ],
    treatmentHubs: [
      `${SITE.url}/morpheus8`,
      `${SITE.url}/quantum-rf`,
      `${SITE.url}/solaria-co2`,
      `${SITE.url}/weight-loss`,
    ],
    concernPages: [
      `${SITE.url}/concerns/turkey-neck`,
      `${SITE.url}/concerns/jowls`,
      `${SITE.url}/concerns/acne-scars`,
      `${SITE.url}/concerns/skin-tightening`,
      `${SITE.url}/concerns/weight-loss`,
      `${SITE.url}/concerns/neck-tightening`,
      `${SITE.url}/concerns/sagging-skin`,
    ],
    videoLibrary: {
      index: `${SITE.url}/videos`,
      architecture: "searchable transcripts + category tags + related service links + VideoObject schema",
    },
    contentOperatingSystem: {
      workflow: `${SITE.url}/admin/content-os`,
      collectionsEndpoint: `${SITE.url}/api/public/content`,
      supports: [
        "provider insights",
        "treatment updates",
        "faq additions",
        "case studies",
        "educational articles",
        "video transcripts",
        "comparison updates",
      ],
    },
    analyticsIntelligence: {
      dashboard: `${SITE.url}/admin/analytics-intelligence`,
      endpoint: `${SITE.url}/api/admin/analytics-intelligence`,
      tracks: [
        "top viewed treatments",
        "highest converting funnels",
        "consultation submission trends",
        "concern-page traffic",
        "internal search terms",
        "cta clicks",
        "booking attribution",
        "video engagement",
        "faq engagement",
      ],
    },
    searchAndRecommendations: {
      searchPage: `${SITE.url}/search`,
      endpoint: `${SITE.url}/api/public/search`,
      recommendationModules: ["treatment hubs", "concern pages"],
    },
    funnelSystem: {
      index: `${SITE.url}/funnels`,
      routes: [
        `${SITE.url}/funnels/morpheus8-candidacy`,
        `${SITE.url}/funnels/skin-tightening-match`,
        `${SITE.url}/funnels/facelift-vs-quantum-rf`,
        `${SITE.url}/funnels/weight-loss-fit`,
      ],
      submissionEndpoint: `${SITE.url}/api/public/funnels/submit`,
    },
    testimonialSystem: {
      index: `${SITE.url}/testimonials`,
      endpoint: `${SITE.url}/api/public/testimonials`,
      filterDimensions: ["treatment", "concern", "provider", "device"],
    },
    freshnessWorkflow: `${SITE.url}/admin/content-freshness`,
    nurtureSystem: {
      adminWorkflowPage: `${SITE.url}/admin/nurture-workflows`,
      publicWorkflowEndpoint: `${SITE.url}/api/public/nurture`,
      routedFromFunnels: true,
    },
    topicalExpansionSystem: {
      areasIndex: `${SITE.url}/areas`,
      recoveryIndex: `${SITE.url}/recovery`,
      areaExamples: [`${SITE.url}/areas/under-eyes`, `${SITE.url}/areas/jawline`],
      recoveryExamples: [`${SITE.url}/recovery/morpheus8`, `${SITE.url}/recovery/quantum-rf`],
      faqClusterExamples: [`${SITE.url}/faq/quantum-rf`],
    },
    mediaRepurposingSystem: {
      workflow: `${SITE.url}/admin/media-repurpose`,
      outputs: ["quote extraction", "faq extraction", "clip references", "caption references", "internal link suggestions"],
    },
    personalizationHooks: {
      contextEndpoint: `${SITE.url}/api/public/personalization/context`,
      status: "scaffolded for future returning-visitor and recommendation memory",
    },
    topicalRelationships: {
      "morpheus8": ["skin-tightening", "acne-scars", "sagging-skin"],
      "quantum-rf": ["jowls", "neck-tightening", "sagging-skin", "weight-loss-body-support"],
      "solaria-co2": ["acne-scars", "texture", "sun-damage"],
      "weight-loss": ["weight-loss", "metabolic-support", "body-contour-transition"],
    },
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
