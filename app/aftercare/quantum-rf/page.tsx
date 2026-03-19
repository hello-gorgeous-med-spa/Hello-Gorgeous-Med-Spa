'use client';

import Link from "next/link";
import Image from "next/image";
import { SITE } from "@/lib/seo";

const PRE_TREATMENT = [
  {
    timeframe: "2 Weeks Before",
    instructions: [
      "Avoid sun exposure and tanning (including self-tanners) on treatment area",
      "Stop using retinoids (Retin-A, tretinoin, retinol) on treatment area",
      "Discontinue AHAs, BHAs, and glycolic acid products",
      "No waxing or depilatory creams on treatment area",
      "Stay well-hydrated and maintain healthy skin",
      "Inform your provider of any medications or supplements you're taking",
    ],
  },
  {
    timeframe: "1 Week Before",
    instructions: [
      "Stop taking blood thinners if medically approved (aspirin, ibuprofen, fish oil, vitamin E)",
      "Avoid alcohol consumption",
      "No other skin treatments on the treatment area",
      "Begin antiviral medication if prescribed (for cold sore history - face treatments)",
      "Arrange for someone to drive you home after the procedure",
    ],
  },
  {
    timeframe: "Day Before",
    instructions: [
      "Do not consume alcohol",
      "Get a good night's rest",
      "Shower and clean the treatment area thoroughly",
      "Prepare your recovery area at home",
      "Fill any prescribed medications in advance",
    ],
  },
  {
    timeframe: "Day Of Treatment",
    instructions: [
      "Arrive with clean skin - no lotions, creams, or makeup on treatment area",
      "Wear loose, comfortable clothing that won't rub treatment area",
      "Eat a light meal before your appointment",
      "Bring comfortable clothes for the ride home",
      "Expect to be at the office for 2-4 hours depending on treatment area",
      "Bring entertainment (phone, book) for the numbing period",
    ],
  },
];

const POST_TREATMENT_TIMELINE = [
  {
    phase: "Day 1-2",
    title: "Immediate Post-Procedure",
    color: "bg-red-100 border-red-300 text-red-800",
    icon: "🔴",
    instructions: [
      "Rest and limit activity - this is a minimally invasive procedure",
      "Keep incision sites clean and dry",
      "Apply cold compresses (wrapped in cloth) for 20 min on, 20 min off to reduce swelling",
      "Wear compression garment if provided (essential for body areas)",
      "Take prescribed pain medication as directed",
      "Sleep with head/treatment area elevated",
      "Mild bruising, swelling, and discomfort are NORMAL",
      "Small amount of drainage from tiny incision sites is normal",
    ],
    avoid: [
      "Strenuous activity or exercise",
      "Hot baths, saunas, hot tubs",
      "Submerging in water (pools, baths)",
      "Direct sun exposure on treated area",
      "Removing compression garment (if given)",
      "Touching incision sites unnecessarily",
      "Alcohol and smoking (impairs healing)",
    ],
  },
  {
    phase: "Days 3-7",
    title: "Initial Recovery",
    color: "bg-orange-100 border-orange-300 text-orange-800",
    icon: "🟠",
    instructions: [
      "Continue wearing compression garment as directed (usually 1-2 weeks)",
      "Gently cleanse incision sites as instructed",
      "Swelling will peak around day 3-4, then improve",
      "Bruising is normal and will fade over 1-2 weeks",
      "Take gentle walks to promote circulation",
      "Stay hydrated and eat nutritious foods",
      "Keep incisions clean with prescribed ointment",
    ],
    avoid: [
      "Heavy lifting or strenuous exercise",
      "Swimming pools, hot tubs, baths",
      "Direct sun exposure",
      "Tight clothing that rubs treatment area",
      "Excessive salt intake (increases swelling)",
      "Sleeping on treated area if possible",
    ],
  },
  {
    phase: "Week 2",
    title: "Continued Healing",
    color: "bg-yellow-100 border-yellow-300 text-yellow-800",
    icon: "🟡",
    instructions: [
      "Swelling and bruising continue to decrease",
      "May reduce compression garment wear (follow provider instructions)",
      "Light activities can gradually resume",
      "Numbness or tingling in treatment area is normal and temporary",
      "You may start to see initial skin tightening",
      "Schedule follow-up appointment if not already scheduled",
    ],
    avoid: [
      "Intense workouts or heavy lifting",
      "Sun exposure without SPF protection",
      "Hot environments (saunas, hot yoga)",
      "Massaging the area unless instructed",
    ],
  },
  {
    phase: "Weeks 3-4",
    title: "Results Emerging",
    color: "bg-green-100 border-green-300 text-green-800",
    icon: "🟢",
    instructions: [
      "Most swelling should be resolved",
      "Can usually resume most normal activities",
      "Early skin tightening results visible",
      "May resume exercise with provider approval",
      "Continue SPF protection on treated areas",
      "Residual numbness will continue to improve",
    ],
    avoid: [
      "Skipping sunscreen on treated area",
      "High-impact activities if not cleared",
    ],
  },
  {
    phase: "Months 1-3",
    title: "Collagen Remodeling Phase",
    color: "bg-teal-100 border-teal-300 text-teal-800",
    icon: "✨",
    instructions: [
      "Skin tightening continues to improve",
      "Collagen production is actively remodeling tissue",
      "Results become more visible each week",
      "Resume all normal activities",
      "Take progress photos to track improvement",
      "Attend any scheduled follow-up appointments",
    ],
    avoid: [
      "Major weight fluctuations (can affect results)",
      "Excessive sun exposure",
    ],
  },
  {
    phase: "Months 3-6",
    title: "Final Results",
    color: "bg-blue-100 border-blue-300 text-blue-800",
    icon: "💎",
    instructions: [
      "Optimal results typically visible at 3-6 months",
      "Skin continues tightening as collagen matures",
      "Results can last several years with proper maintenance",
      "Maintain healthy lifestyle for lasting results",
      "Consider maintenance treatments if recommended",
    ],
    avoid: [
      "Significant weight gain/loss",
      "Neglecting skin care routine",
    ],
  },
];

const TREATMENT_AREAS_INFO = [
  {
    area: "Chin & Neck (Submental)",
    recovery: "1-2 weeks",
    compression: "Optional chin strap",
    notes: "Most popular area. Treats double chin and neck laxity. Sleep elevated for 1 week.",
    swelling: "Peaks day 3-4, resolves in 1-2 weeks"
  },
  {
    area: "Lower Abdomen",
    recovery: "2-3 weeks",
    compression: "Required 1-2 weeks",
    notes: "Addresses loose abdominal skin. Wear compression garment consistently.",
    swelling: "Significant initially, resolves over 2-3 weeks"
  },
  {
    area: "Full Abdomen",
    recovery: "2-3 weeks",
    compression: "Required 1-2 weeks",
    notes: "Larger treatment area. Plan for more downtime. Compression is essential.",
    swelling: "More pronounced, resolves over 3-4 weeks"
  },
  {
    area: "Arms (Bat Wings)",
    recovery: "1-2 weeks",
    compression: "Compression sleeve recommended",
    notes: "Treats upper arm laxity. Avoid lifting heavy objects for 2 weeks.",
    swelling: "Moderate, resolves in 1-2 weeks"
  },
  {
    area: "Buttocks",
    recovery: "2-3 weeks",
    compression: "Compression garment required",
    notes: "For Ozempic butt or general skin laxity. Avoid sitting for extended periods initially.",
    swelling: "Significant, plan activities accordingly"
  },
];

const EMERGENCY_SIGNS = [
  "Signs of infection: increasing redness, warmth, pus, fever, or red streaks",
  "Severe pain not controlled by prescribed medication",
  "Excessive bleeding or fluid drainage from incision sites",
  "Numbness that spreads or worsens significantly",
  "Difficulty breathing or severe swelling",
  "Fever above 101°F (38.3°C)",
  "Any concerns that feel abnormal to you",
];

const PRODUCTS_NEEDED = [
  { name: "Compression Garment", purpose: "Reduces swelling, supports healing", when: "1-2 weeks (body areas)" },
  { name: "Prescribed Pain Medication", purpose: "Manage discomfort", when: "Days 1-5 as needed" },
  { name: "Antibiotic Ointment", purpose: "Keep incision sites clean", when: "Days 1-7" },
  { name: "Cold Compresses", purpose: "Reduce swelling", when: "Days 1-3" },
  { name: "SPF 30+ Sunscreen", purpose: "Protect treated area from sun", when: "Once healed, ongoing" },
  { name: "Loose, Comfortable Clothing", purpose: "Avoid friction on treated area", when: "1-2 weeks" },
  { name: "Arnica (optional)", purpose: "May help reduce bruising", when: "Before and after (with provider approval)" },
];

export default function QuantumRFAftercarePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "name": "Quantum RF Skin Tightening Pre & Post Treatment Instructions",
    "description": "Complete pre-treatment and post-treatment care instructions for Quantum RF minimally invasive skin tightening at Hello Gorgeous Med Spa in Oswego, IL.",
    "url": "https://www.hellogorgeousmedspa.com/aftercare/quantum-rf",
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
      "name": "Quantum RF Subdermal Skin Tightening",
      "procedureType": "Minimally Invasive Cosmetic Procedure",
      "bodyLocation": ["Chin", "Neck", "Abdomen", "Arms", "Buttocks"]
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
        "name": "What is Quantum RF and how is it different from Morpheus8?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Quantum RF is a minimally invasive treatment that delivers radiofrequency energy beneath the skin (subdermal) through tiny incisions for surgical-like skin tightening without surgery. Unlike Morpheus8 which uses microneedles from the surface, Quantum RF works from inside for more dramatic results on significant skin laxity."
        }
      },
      {
        "@type": "Question",
        "name": "What is the downtime for Quantum RF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Quantum RF typically requires 1-3 weeks of recovery depending on the treatment area. Chin/neck usually requires 1-2 weeks, while body areas like abdomen may require 2-3 weeks. Compression garments are typically worn for 1-2 weeks."
        }
      },
      {
        "@type": "Question",
        "name": "How long do Quantum RF results last?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Quantum RF results can last several years as it stimulates long-term collagen production. Results continue improving for 3-6 months after treatment. Maintaining a stable weight helps preserve results."
        }
      },
      {
        "@type": "Question",
        "name": "Is Quantum RF painful?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The procedure is performed under local anesthesia, so you should not feel pain during treatment. Afterward, expect mild to moderate discomfort, swelling, and bruising for 1-2 weeks, manageable with prescribed pain medication."
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
              src="/images/trifecta/quantum-rf.png" 
              alt="Quantum RF Device" 
              width={120} 
              height={72} 
              className="object-contain"
            />
          </div>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/20 border border-pink-500/30 mb-6">
            <span className="text-pink-300 text-sm font-semibold uppercase tracking-wider">Patient Instructions</span>
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Quantum RF Skin Tightening
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400">
              Pre & Post Treatment Care
            </span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Quantum RF is a minimally invasive procedure. Following these instructions is essential for proper healing, minimizing complications, and achieving optimal skin tightening results.
          </p>
          <p className="mt-4 text-sm">
            <a
              href="https://www.inmodemd.com/workstation/luxora/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-300 hover:text-pink-200 underline"
            >
              Learn more about the Luxora / QuantumRF technology →
            </a>
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

      {/* Important Notice */}
      <section className="bg-amber-50 border-y border-amber-200 py-4">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-amber-800 font-medium">
            ⚠️ Quantum RF is a minimally invasive procedure performed under local anesthesia. Plan for adequate recovery time and follow all instructions carefully.
          </p>
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
          <span className="flex items-center gap-2">
            <span>🚨</span>
            <span className="text-red-600 font-medium">Emergency? Call immediately</span>
          </span>
        </div>
      </section>

      {/* What is Quantum RF */}
      <section className="py-12 bg-gradient-to-r from-pink-50 to-rose-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What is Quantum RF?</h2>
          <p className="text-gray-700 mb-4">
            Quantum RF delivers radiofrequency energy <strong>beneath the skin</strong> (subdermal) through tiny incisions, causing immediate tissue contraction and long-term collagen remodeling. Unlike surface treatments, Quantum RF provides surgical-like skin tightening without the extensive downtime of surgery.
          </p>
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div className="bg-white rounded-xl p-5 border border-pink-200">
              <h3 className="font-bold text-gray-900 mb-2">Ideal For:</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Moderate to significant skin laxity</li>
                <li>• Double chin / neck sagging</li>
                <li>• Post-weight loss loose skin</li>
                <li>• "Ozempic butt" or skin laxity from weight loss medications</li>
                <li>• Arm skin laxity (bat wings)</li>
                <li>• Abdominal skin looseness</li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-5 border border-pink-200">
              <h3 className="font-bold text-gray-900 mb-2">How It Works:</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Local anesthesia for comfort</li>
                <li>• Tiny incisions (minimal scarring)</li>
                <li>• RF energy delivered beneath skin</li>
                <li>• Immediate tissue contraction</li>
                <li>• Collagen stimulation for months</li>
                <li>• Results last years</li>
              </ul>
            </div>
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
              Proper preparation is essential for safety and optimal results
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
            🛒 What You'll Need for Recovery
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {PRODUCTS_NEEDED.map((product) => (
              <div key={product.name} className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center text-xl flex-shrink-0">
                  {product.name.includes("Compression") ? "👕" : 
                   product.name.includes("Pain") ? "💊" : 
                   product.name.includes("Cold") ? "🧊" : "🧴"}
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
              Your recovery journey - what to expect each step of the way
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
            📍 Recovery by Treatment Area
          </h2>
          <div className="space-y-4">
            {TREATMENT_AREAS_INFO.map((area) => (
              <div key={area.area} className="bg-white rounded-xl border border-purple-200 p-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{area.area}</h3>
                    <p className="text-sm text-gray-600 mt-1">{area.notes}</p>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="bg-pink-50 px-3 py-2 rounded-lg">
                      <span className="text-pink-600 font-semibold">Recovery: {area.recovery}</span>
                    </div>
                    <div className="bg-blue-50 px-3 py-2 rounded-lg">
                      <span className="text-blue-600 font-semibold">{area.compression}</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3">Swelling: {area.swelling}</p>
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
              When to Contact Us IMMEDIATELY
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
              <p className="text-red-700 text-sm mt-1">
                For life-threatening emergencies, call 911 or go to your nearest emergency room.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Timeline */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            📅 Visual Recovery Timeline
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {[
              { day: "Day 1-2", status: "Rest & Recover", icon: "🔴", tip: "Ice & compress" },
              { day: "Day 3-7", status: "Swelling Peaks", icon: "🟠", tip: "Stay patient" },
              { day: "Week 2", status: "Improving", icon: "🟡", tip: "Light activity" },
              { day: "Week 3-4", status: "Results Show", icon: "🟢", tip: "Resume normal" },
              { day: "Month 1-3", status: "Tightening", icon: "✨", tip: "Collagen builds" },
              { day: "Month 3-6", status: "Final Results", icon: "💎", tip: "Enjoy!" },
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
          <Link href="/services/quantum-rf" className="inline-flex items-center gap-2 text-pink-600 font-medium hover:underline">
            ← Back to Quantum RF Service Page
          </Link>
          <span className="mx-4 text-gray-300">|</span>
          <Link href="/vip-skin-tightening" className="inline-flex items-center gap-2 text-pink-600 font-medium hover:underline">
            VIP Launch Waitlist →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <div className="bg-gray-50 border-t border-gray-200 py-6">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>
            These instructions are general guidelines. Always follow your provider's personalized instructions based on your specific treatment.
          </p>
          <p className="mt-2">
            © {new Date().getFullYear()} Hello Gorgeous Med Spa • 74 W. Washington St, Oswego, IL • {SITE.phone}
          </p>
        </div>
      </div>
    </main>
  );
}
