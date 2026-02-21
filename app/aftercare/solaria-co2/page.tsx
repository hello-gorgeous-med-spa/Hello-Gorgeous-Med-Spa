import type { Metadata } from "next";
import Link from "next/link";
import { SITE, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Solaria CO₂ Laser Pre & Post Treatment Instructions | Hello Gorgeous Med Spa",
  description:
    "Complete pre-treatment and post-treatment care instructions for Solaria CO₂ fractional laser at Hello Gorgeous Med Spa. Ensure optimal healing and results.",
  path: "/aftercare/solaria-co2",
});

const PRE_TREATMENT = [
  {
    timeframe: "2 Weeks Before",
    instructions: [
      "Avoid sun exposure and tanning (including self-tanners)",
      "Stop using retinoids (Retin-A, tretinoin, retinol)",
      "Discontinue AHAs, BHAs, and glycolic acid products",
      "Avoid waxing, threading, or depilatory creams on treatment area",
    ],
  },
  {
    timeframe: "1 Week Before",
    instructions: [
      "Stop taking blood thinners if medically approved (aspirin, ibuprofen, fish oil, vitamin E)",
      "Discontinue any exfoliating treatments",
      "Begin antiviral medication if prescribed (for cold sore history)",
      "Stay well-hydrated",
    ],
  },
  {
    timeframe: "Day Before",
    instructions: [
      "Avoid alcohol consumption",
      "Get a good night's sleep",
      "Prepare your recovery area at home with clean pillowcases",
      "Stock up on recommended post-care products",
    ],
  },
  {
    timeframe: "Day Of Treatment",
    instructions: [
      "Arrive with clean, makeup-free skin",
      "Wear comfortable, loose clothing",
      "Arrange for someone to drive you home",
      "Eat a light meal before your appointment",
      "Bring sunglasses for the ride home",
    ],
  },
];

const POST_TREATMENT_TIMELINE = [
  {
    phase: "Days 1-3",
    title: "Immediate Recovery",
    color: "bg-red-100 border-red-300 text-red-800",
    icon: "🔴",
    instructions: [
      "Apply cool compresses for 10-15 minutes every hour while awake",
      "Keep skin moist with Aquaphor or prescribed healing ointment at all times",
      "Sleep with head elevated on 2-3 pillows to reduce swelling",
      "Take prescribed pain medication as needed",
      "Drink plenty of water (aim for 8+ glasses daily)",
      "Avoid touching your face except when applying ointment with clean hands",
    ],
    avoid: [
      "Direct sun exposure",
      "Picking or peeling skin",
      "Makeup or skincare products (only healing ointment)",
      "Strenuous exercise or sweating",
      "Hot showers (lukewarm only, avoid direct water on face)",
    ],
  },
  {
    phase: "Days 4-7",
    title: "Active Peeling Phase",
    color: "bg-orange-100 border-orange-300 text-orange-800",
    icon: "🟠",
    instructions: [
      "Continue keeping skin moist with healing ointment",
      "Gently cleanse with lukewarm water and gentle cleanser (Cetaphil, CeraVe)",
      "Pat dry gently—never rub",
      "Your skin will begin peeling—this is NORMAL and expected",
      "Continue sleeping elevated if swelling persists",
      "Stay hydrated and eat nutritious foods to support healing",
    ],
    avoid: [
      "Picking, pulling, or peeling skin (let it fall off naturally)",
      "Makeup until peeling is complete",
      "Direct sun exposure",
      "Swimming pools, hot tubs, saunas",
      "Exercise that causes sweating",
      "Alcohol consumption",
    ],
  },
  {
    phase: "Week 2",
    title: "New Skin Emerges",
    color: "bg-yellow-100 border-yellow-300 text-yellow-800",
    icon: "🟡",
    instructions: [
      "Once peeling is complete, begin gentle moisturizer",
      "Start applying SPF 50+ sunscreen every morning (even indoors)",
      "Continue gentle cleansing routine",
      "Your new skin will be pink—this is normal",
      "May resume light makeup if desired (mineral makeup recommended)",
      "Light physical activity may resume",
    ],
    avoid: [
      "Harsh skincare products or active ingredients",
      "Direct prolonged sun exposure",
      "Picking at any remaining flaky areas",
      "Intense workouts that cause heavy sweating",
    ],
  },
  {
    phase: "Weeks 3-4",
    title: "Continued Healing",
    color: "bg-green-100 border-green-300 text-green-800",
    icon: "🟢",
    instructions: [
      "Continue SPF 50+ daily (this is critical for 3-6 months)",
      "May gradually introduce gentle skincare products",
      "Pink/red tone will fade over the coming weeks",
      "Normal activities can resume",
      "Schedule your follow-up appointment",
    ],
    avoid: [
      "Retinoids, AHAs, BHAs until cleared by your provider (usually 4-6 weeks)",
      "Chemical peels or aggressive treatments",
      "Tanning or prolonged sun exposure",
    ],
  },
  {
    phase: "Months 1-6",
    title: "Collagen Remodeling",
    color: "bg-blue-100 border-blue-300 text-blue-800",
    icon: "💎",
    instructions: [
      "Continue daily SPF 50+ protection",
      "Results will continue improving as collagen rebuilds",
      "May resume retinoids and active skincare when cleared by provider",
      "Consider maintenance treatments as recommended",
      "Take progress photos to track your transformation",
    ],
    avoid: [
      "Excessive sun exposure without protection",
      "Skipping sunscreen",
    ],
  },
];

const EMERGENCY_SIGNS = [
  "Signs of infection: increasing redness, pus, fever, or foul odor",
  "Severe pain not controlled by prescribed medication",
  "Blistering or oozing that seems excessive",
  "Allergic reaction: difficulty breathing, severe swelling",
  "Any concerns about your healing process",
];

const PRODUCTS_NEEDED = [
  { name: "Aquaphor Healing Ointment", purpose: "Keep skin moist during healing", when: "Days 1-7" },
  { name: "Gentle Cleanser (Cetaphil/CeraVe)", purpose: "Gentle cleansing", when: "Day 3+" },
  { name: "SPF 50+ Mineral Sunscreen", purpose: "Sun protection", when: "Once healed (Week 2+)" },
  { name: "Gentle Moisturizer", purpose: "Hydration after peeling", when: "Week 2+" },
  { name: "Clean Pillowcases", purpose: "Prevent bacteria", when: "Change daily Days 1-7" },
  { name: "Ice Packs/Cool Compresses", purpose: "Reduce swelling", when: "Days 1-3" },
];

export default function SolariaCO2AftercarePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-900 to-black text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/20 border border-pink-500/30 mb-6">
            <span className="text-pink-300 text-sm font-semibold uppercase tracking-wider">Patient Instructions</span>
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Solaria CO₂ Laser
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400">
              Pre & Post Treatment Care
            </span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Follow these instructions carefully to ensure optimal healing and the best possible results from your treatment.
          </p>
          <div className="mt-8 flex justify-center gap-4 text-sm">
            <a href="#pre-treatment" className="px-6 py-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
              Pre-Treatment →
            </a>
            <a href="#post-treatment" className="px-6 py-3 bg-pink-500 rounded-lg hover:bg-pink-600 transition-colors">
              Post-Treatment →
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
          <span className="flex items-center gap-2">
            <span>🚨</span>
            <span>Emergency? Call immediately</span>
          </span>
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
              Proper preparation is essential for optimal results and safety
            </p>
          </div>

          <div className="space-y-8">
            {PRE_TREATMENT.map((phase, idx) => (
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
              <p className="text-red-700 text-sm mt-1">
                For life-threatening emergencies, call 911 or go to your nearest emergency room.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Healing Timeline Visual */}
      <section className="py-12 bg-gradient-to-r from-pink-50 to-rose-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            📅 Visual Healing Timeline
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { day: "Day 1-3", status: "Red & Swollen", icon: "🔴", tip: "Keep moist, ice" },
              { day: "Day 4-7", status: "Peeling", icon: "🟠", tip: "Don't pick!" },
              { day: "Week 2", status: "Pink & New", icon: "🟡", tip: "Start SPF" },
              { day: "Week 3-4", status: "Fading Pink", icon: "🟢", tip: "Normal routine" },
              { day: "Month 1-6", status: "Improving", icon: "💎", tip: "Collagen building" },
            ].map((phase) => (
              <div key={phase.day} className="bg-white rounded-xl border border-pink-200 p-4 text-center">
                <span className="text-3xl block mb-2">{phase.icon}</span>
                <p className="font-bold text-gray-900 text-sm">{phase.day}</p>
                <p className="text-gray-600 text-xs">{phase.status}</p>
                <p className="text-pink-600 text-xs font-medium mt-2">{phase.tip}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Print Button */}
      <section className="py-8 bg-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
          >
            <span>🖨️</span>
            Print These Instructions
          </button>
          <p className="text-gray-500 text-sm mt-2">
            Save or print this page for easy reference during your recovery
          </p>
        </div>
      </section>

      {/* Back to Solaria Page */}
      <section className="py-8 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Link
            href="/services/solaria-co2"
            className="inline-flex items-center gap-2 text-pink-600 font-medium hover:underline"
          >
            ← Back to Solaria CO₂ Service Page
          </Link>
          <span className="mx-4 text-gray-300">|</span>
          <Link
            href="/book"
            className="inline-flex items-center gap-2 text-pink-600 font-medium hover:underline"
          >
            Book a Consultation →
          </Link>
        </div>
      </section>

      {/* Footer Disclaimer */}
      <div className="bg-gray-50 border-t border-gray-200 py-6">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>
            These instructions are general guidelines. Your provider may give you specific instructions based on your individual treatment. 
            Always follow your provider's personalized instructions if they differ from these guidelines.
          </p>
          <p className="mt-2">
            © {new Date().getFullYear()} Hello Gorgeous Med Spa • 74 W. Washington St, Oswego, IL • {SITE.phone}
          </p>
        </div>
      </div>
    </main>
  );
}
