'use client';

import Link from "next/link";
import Image from "next/image";
import { SITE } from "@/lib/seo";

const PRE_TREATMENT = [
  {
    timeframe: "2 Weeks Before",
    instructions: [
      "Avoid sun exposure and tanning (including self-tanners)",
      "Stop using retinoids (Retin-A, tretinoin, retinol)",
      "Discontinue AHAs, BHAs, and glycolic acid products",
      "Avoid waxing, threading, or depilatory creams on treatment area",
      "Stay well-hydrated and maintain healthy skin",
    ],
  },
  {
    timeframe: "1 Week Before",
    instructions: [
      "Stop taking blood thinners if medically approved (aspirin, ibuprofen, fish oil, vitamin E)",
      "Discontinue any exfoliating treatments",
      "Avoid Botox or filler injections in the treatment area",
      "Begin antiviral medication if prescribed (for cold sore history)",
      "No chemical peels, laser treatments, or microdermabrasion",
    ],
  },
  {
    timeframe: "48 Hours Before",
    instructions: [
      "Avoid alcohol consumption",
      "No strenuous exercise that could irritate skin",
      "Stay hydrated - drink plenty of water",
    ],
  },
  {
    timeframe: "Day Of Treatment",
    instructions: [
      "Arrive with clean, makeup-free skin",
      "No lotions, serums, or creams on treatment area",
      "Wear comfortable, loose clothing",
      "Eat a light meal before your appointment",
      "Bring sunglasses and a hat for the trip home",
    ],
  },
];

const POST_TREATMENT_TIMELINE = [
  {
    phase: "Day 1",
    title: "Immediately After Treatment",
    color: "bg-red-100 border-red-300 text-red-800",
    icon: "🔴",
    instructions: [
      "Expect redness, warmth, and mild swelling - this is NORMAL",
      "Tiny pinpoint bleeding may occur - this is normal",
      "Apply cool compresses (not ice) for 10-15 minutes if needed",
      "Keep the area clean and dry",
      "Apply recommended post-care serum or healing balm",
      "Sleep with head elevated to reduce swelling (especially for face)",
    ],
    avoid: [
      "Touching or rubbing the treated area",
      "Makeup for 24-48 hours",
      "Direct sun exposure",
      "Hot showers, saunas, or steam rooms",
      "Exercise or sweating",
      "Swimming pools or hot tubs",
    ],
  },
  {
    phase: "Days 2-3",
    title: "Initial Healing",
    color: "bg-orange-100 border-orange-300 text-orange-800",
    icon: "🟠",
    instructions: [
      "Continue applying healing serum or Aquaphor",
      "Gently cleanse with lukewarm water and gentle cleanser",
      "Redness and swelling will begin to decrease",
      "You may notice tiny scabs forming - this is normal",
      "Stay hydrated and get adequate rest",
    ],
    avoid: [
      "Picking, scratching, or peeling any flaky skin",
      "Active skincare ingredients (retinol, vitamin C, acids)",
      "Makeup if skin is still raw",
      "Exercise that causes sweating",
      "Direct sun exposure",
    ],
  },
  {
    phase: "Days 4-7",
    title: "Peeling & Shedding Phase",
    color: "bg-yellow-100 border-yellow-300 text-yellow-800",
    icon: "🟡",
    instructions: [
      "Skin will begin to peel and flake - LET IT SHED NATURALLY",
      "Continue gentle cleansing and moisturizing",
      "Apply SPF 30+ when going outside",
      "May resume light mineral makeup if needed",
      "Drink plenty of water to support healing",
    ],
    avoid: [
      "Picking or pulling off peeling skin",
      "Exfoliating products or scrubs",
      "Intense workouts or saunas",
      "Prolonged sun exposure",
      "Retinoids or acids",
    ],
  },
  {
    phase: "Week 2",
    title: "Continued Recovery",
    color: "bg-green-100 border-green-300 text-green-800",
    icon: "🟢",
    instructions: [
      "Most peeling should be complete",
      "Skin may still appear pink - this will fade",
      "Continue SPF 30+ daily (critical for results)",
      "Resume regular skincare gradually",
      "Light exercise can resume",
      "You may notice initial skin tightening",
    ],
    avoid: [
      "Harsh exfoliants or aggressive skincare",
      "Extended sun exposure without protection",
      "Very hot water on face",
    ],
  },
  {
    phase: "Weeks 3-4",
    title: "Results Emerging",
    color: "bg-teal-100 border-teal-300 text-teal-800",
    icon: "✨",
    instructions: [
      "Continue SPF 30+ daily",
      "May gradually reintroduce retinoids (with provider approval)",
      "Normal skincare routine can resume",
      "Schedule follow-up if recommended",
      "Optimal results continue developing over 3-6 months",
    ],
    avoid: [
      "Skipping sunscreen",
      "Additional treatments without provider clearance",
    ],
  },
  {
    phase: "Months 1-6",
    title: "Collagen Remodeling",
    color: "bg-blue-100 border-blue-300 text-blue-800",
    icon: "💎",
    instructions: [
      "Continue daily SPF protection",
      "Results will continue improving as new collagen forms",
      "Maintain healthy skincare routine",
      "Take progress photos to track improvement",
      "Schedule additional sessions if recommended for optimal results",
    ],
    avoid: [
      "Excessive sun exposure without protection",
      "Neglecting your skincare routine",
    ],
  },
];

const EMERGENCY_SIGNS = [
  "Signs of infection: increasing redness, pus, fever, or foul odor",
  "Severe pain not controlled by over-the-counter medication",
  "Excessive swelling that worsens after 48 hours",
  "Blistering or burns that seem abnormal",
  "Allergic reaction: difficulty breathing, severe swelling",
  "Any concerns about your healing process",
];

const PRODUCTS_NEEDED = [
  { name: "Gentle Cleanser (Cetaphil/CeraVe)", purpose: "Gentle cleansing without irritation", when: "Immediately" },
  { name: "Aquaphor or Healing Balm", purpose: "Keep skin moist during healing", when: "Days 1-7" },
  { name: "Hyaluronic Acid Serum", purpose: "Hydration and healing support", when: "Days 3+" },
  { name: "SPF 30+ Sunscreen", purpose: "Sun protection (crucial for results)", when: "Day 3+ and ongoing" },
  { name: "Gentle Moisturizer", purpose: "Maintain skin hydration", when: "Throughout recovery" },
];

const TREATMENT_AREAS = [
  { area: "Face", downtime: "3-5 days", notes: "Most common area. Expect redness and minor swelling." },
  { area: "Neck", downtime: "3-5 days", notes: "Sensitive area - follow face protocol." },
  { area: "Abdomen", downtime: "5-7 days", notes: "Keep area clean and dry. Loose clothing recommended." },
  { area: "Arms", downtime: "5-7 days", notes: "Avoid friction. Long sleeves protect from sun." },
  { area: "Thighs/Buttocks", downtime: "5-7 days", notes: "Loose clothing essential. Avoid sitting for long periods initially." },
];

export default function Morpheus8AftercarePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "name": "Morpheus8 RF Microneedling Pre & Post Treatment Instructions",
    "description": "Complete pre-treatment and post-treatment care instructions for Morpheus8 RF microneedling at Hello Gorgeous Med Spa in Oswego, IL.",
    "url": "https://www.hellogorgeousmedspa.com/aftercare/morpheus8",
    "lastReviewed": new Date().toISOString().split('T')[0],
    "reviewedBy": {
      "@type": "Person",
      "name": "Danielle Glazier-Alcala",
      "jobTitle": "Owner & Lead Injector",
      "worksFor": {
        "@type": "MedicalBusiness",
        "name": "Hello Gorgeous Med Spa"
      }
    },
    "about": {
      "@type": "MedicalProcedure",
      "name": "Morpheus8 RF Microneedling",
      "procedureType": "Cosmetic",
      "bodyLocation": ["Face", "Neck", "Body"]
    },
    "provider": {
      "@type": "MedicalBusiness",
      "name": "Hello Gorgeous Med Spa",
      "url": "https://www.hellogorgeousmedspa.com",
      "telephone": "+1-630-636-6193",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "74 W. Washington St",
        "addressLocality": "Oswego",
        "addressRegion": "IL",
        "postalCode": "60543"
      }
    }
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is the downtime for Morpheus8?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Morpheus8 typically has 3-5 days of social downtime for face treatments. Expect redness, mild swelling, and peeling. Body areas may take 5-7 days. Full results develop over 3-6 months."
        }
      },
      {
        "@type": "Question",
        "name": "How long do Morpheus8 results last?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Morpheus8 results can last 1-3 years. The treatment stimulates collagen production that continues for months after treatment. Maintenance sessions can extend results."
        }
      },
      {
        "@type": "Question",
        "name": "When can I wear makeup after Morpheus8?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Avoid makeup for the first 24-48 hours after Morpheus8. After that, mineral makeup can be used if the skin isn't raw. Most patients can resume full makeup by day 4-5."
        }
      },
      {
        "@type": "Question",
        "name": "Can I exercise after Morpheus8?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Avoid exercise and activities that cause sweating for 48-72 hours after Morpheus8. Light exercise can resume after about a week. This prevents irritation and infection."
        }
      }
    ]
  };

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-900 to-black text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <Image 
              src="/images/trifecta/morpheus8.png" 
              alt="Morpheus8 Device" 
              width={120} 
              height={72} 
              className="object-contain"
            />
          </div>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/20 border border-pink-500/30 mb-6">
            <span className="text-pink-300 text-sm font-semibold uppercase tracking-wider">Patient Instructions</span>
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Morpheus8 RF Microneedling
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400">
              Pre & Post Treatment Care
            </span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Follow these instructions carefully to ensure optimal healing, minimize downtime, and achieve the best possible results from your Morpheus8 treatment.
          </p>
          <div className="mt-8 flex justify-center gap-4 text-sm flex-wrap">
            <a href="#pre-treatment" className="px-6 py-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
              Pre-Treatment →
            </a>
            <a href="#post-treatment" className="px-6 py-3 bg-pink-500 rounded-lg hover:bg-pink-600 transition-colors">
              Post-Treatment →
            </a>
            <a href="#by-area" className="px-6 py-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
              By Treatment Area →
            </a>
          </div>
        </div>
      </section>

      {/* Quick Contact */}
      <section className="bg-pink-50 border-b border-pink-200 py-4">
        <div className="max-w-4xl mx-auto px-4 flex flex-wrap justify-center gap-6 text-sm">
          <span className="flex items-center gap-2">
            <span>📞</span>
            <span>Questions? Call <a href={`tel:${SITE.phone}`} className="text-pink-600 font-medium hover:underline">{SITE.phone}</a></span>
          </span>
          <span className="flex items-center gap-2">
            <span>💬</span>
            <span>Text us: <a href="sms:630-881-3398" className="text-pink-600 font-medium hover:underline">630-881-3398</a></span>
          </span>
        </div>
      </section>

      {/* What is Morpheus8 */}
      <section className="py-12 bg-gradient-to-r from-pink-50 to-rose-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What is Morpheus8?</h2>
          <p className="text-gray-700 mb-4">
            Morpheus8 is an FDA-cleared fractional RF (radiofrequency) microneedling device that penetrates up to 8mm deep to remodel collagen, tighten skin, and reduce fat. It treats:
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: "Fine Lines & Wrinkles", desc: "Stimulates collagen to smooth skin" },
              { title: "Skin Laxity", desc: "Tightens loose, sagging skin" },
              { title: "Acne Scars", desc: "Resurfaces and improves texture" },
              { title: "Stretch Marks", desc: "Reduces appearance on body" },
              { title: "Uneven Texture", desc: "Creates smoother skin surface" },
              { title: "Jowls & Jawline", desc: "Defines and lifts facial contours" },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-4 border border-pink-200">
                <p className="font-semibold text-gray-900">{item.title}</p>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pre-Treatment Instructions */}
      <section id="pre-treatment" className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              <span className="text-blue-600">Pre-Treatment</span> Instructions
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Proper preparation helps ensure safety and optimal results
            </p>
          </div>

          <div className="space-y-8">
            {PRE_TREATMENT.map((phase) => (
              <div key={phase.timeframe} className="bg-blue-50 rounded-2xl border-2 border-blue-200 overflow-hidden">
                <div className="bg-blue-600 text-white px-6 py-4">
                  <h3 className="text-xl font-bold">{phase.timeframe}</h3>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    {phase.instructions.map((instruction, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                          ✓
                        </span>
                        <span className="text-gray-700">{instruction}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Needed */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            🛒 Products You'll Need
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {PRODUCTS_NEEDED.map((product) => (
              <div key={product.name} className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center text-xl flex-shrink-0">
                  🧴
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{product.name}</h4>
                  <p className="text-sm text-gray-600">{product.purpose}</p>
                  <p className="text-xs text-pink-600 font-medium mt-1">{product.when}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Post-Treatment Timeline */}
      <section id="post-treatment" className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              <span className="text-green-600">Post-Treatment</span> Care Timeline
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Your healing journey day by day
            </p>
          </div>

          <div className="space-y-8">
            {POST_TREATMENT_TIMELINE.map((phase) => (
              <div key={phase.phase} className={`rounded-2xl border-2 overflow-hidden ${phase.color.replace('text-', 'border-').replace('-800', '-300')}`}>
                <div className={`px-6 py-4 ${phase.color.split(' ')[0]} border-b ${phase.color.split(' ')[1]}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{phase.icon}</span>
                    <div>
                      <h3 className={`text-xl font-bold ${phase.color.split(' ')[2]}`}>{phase.phase}</h3>
                      <p className={`text-sm ${phase.color.split(' ')[2]} opacity-80`}>{phase.title}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 bg-white">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                        <span>✅</span> DO:
                      </h4>
                      <ul className="space-y-2">
                        {phase.instructions.map((instruction, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                            <span className="text-green-500 mt-0.5">•</span>
                            {instruction}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                        <span>🚫</span> AVOID:
                      </h4>
                      <ul className="space-y-2">
                        {phase.avoid.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                            <span className="text-red-500 mt-0.5">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* By Treatment Area */}
      <section id="by-area" className="py-12 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            📍 Downtime by Treatment Area
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TREATMENT_AREAS.map((area) => (
              <div key={area.area} className="bg-white rounded-xl border border-purple-200 p-5">
                <h3 className="font-bold text-gray-900 text-lg">{area.area}</h3>
                <p className="text-pink-600 font-semibold mt-1">{area.downtime} downtime</p>
                <p className="text-sm text-gray-600 mt-2">{area.notes}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Signs */}
      <section className="py-12 bg-red-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl border-2 border-red-300 p-8">
            <h2 className="text-2xl font-bold text-red-800 mb-4 flex items-center gap-3">
              <span className="text-3xl">🚨</span>
              When to Contact Us Immediately
            </h2>
            <ul className="space-y-3">
              {EMERGENCY_SIGNS.map((sign, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                    !
                  </span>
                  <span className="text-gray-700">{sign}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 p-4 bg-red-100 rounded-lg">
              <p className="font-semibold text-red-800">
                Contact us at <a href={`tel:${SITE.phone}`} className="underline">{SITE.phone}</a> or text <a href="sms:630-881-3398" className="underline">630-881-3398</a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Timeline */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            📅 Visual Healing Timeline
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {[
              { day: "Day 1", status: "Red & Warm", icon: "🔴", tip: "Keep moist" },
              { day: "Day 2-3", status: "Swelling Peaks", icon: "🟠", tip: "Be patient" },
              { day: "Day 4-7", status: "Peeling", icon: "🟡", tip: "Don't pick!" },
              { day: "Week 2", status: "Pink & Healing", icon: "🟢", tip: "Start SPF" },
              { day: "Week 3-4", status: "Results Show", icon: "✨", tip: "Looking good" },
              { day: "Month 1-6", status: "Collagen Builds", icon: "💎", tip: "Keep glowing" },
            ].map((phase) => (
              <div key={phase.day} className="bg-gray-50 rounded-xl border border-gray-200 p-4 text-center">
                <span className="text-2xl block mb-2">{phase.icon}</span>
                <p className="font-bold text-gray-900 text-sm">{phase.day}</p>
                <p className="text-gray-600 text-xs">{phase.status}</p>
                <p className="text-pink-600 text-xs font-medium mt-2">{phase.tip}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Print & Navigation */}
      <section className="py-8 bg-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
          >
            <span>🖨️</span>
            Print These Instructions
          </button>
        </div>
      </section>

      {/* Navigation */}
      <section className="py-8 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Link href="/services/morpheus8" className="inline-flex items-center gap-2 text-pink-600 font-medium hover:underline">
            ← Back to Morpheus8 Service Page
          </Link>
          <span className="mx-4 text-gray-300">|</span>
          <Link href="/book" className="inline-flex items-center gap-2 text-pink-600 font-medium hover:underline">
            Book a Consultation →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <div className="bg-gray-50 border-t border-gray-200 py-6">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>
            These instructions are general guidelines. Always follow your provider's personalized instructions if they differ.
          </p>
          <p className="mt-2">
            © {new Date().getFullYear()} Hello Gorgeous Med Spa • 74 W. Washington St, Oswego, IL • {SITE.phone}
          </p>
        </div>
      </div>
    </main>
  );
}
