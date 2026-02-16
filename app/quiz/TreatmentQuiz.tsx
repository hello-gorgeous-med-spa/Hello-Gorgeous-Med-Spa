"use client";

import { useState } from "react";
import { trackEvent } from "@/components/GoogleAnalytics";
import { FadeUp, Section } from "@/components/Section";
import { BOOKING_URL } from "@/lib/flows";

type Answer = {
  id: string;
  text: string;
  icon: string;
  tags: string[];
};

type Question = {
  id: string;
  question: string;
  subtitle?: string;
  multiSelect?: boolean;
  answers: Answer[];
};

type Treatment = {
  id: string;
  name: string;
  description: string;
  benefits: string[];
  price: string;
  icon: string;
  tags: string[];
  link: string;
  priority: number;
};

const questions: Question[] = [
  {
    id: "goal",
    question: "What's your primary goal?",
    subtitle: "Select the one that matters most to you",
    answers: [
      { id: "anti-aging", text: "Look younger & reduce wrinkles", icon: "✨", tags: ["botox", "fillers", "skincare"] },
      { id: "weight-loss", text: "Lose weight & feel healthier", icon: "⚖️", tags: ["weight-loss", "peptides"] },
      { id: "energy", text: "More energy & better mood", icon: "⚡", tags: ["hormones", "iv-therapy", "vitamins"] },
      { id: "skin-glow", text: "Glowing, clear skin", icon: "🌟", tags: ["facials", "skincare", "iv-therapy"] },
      { id: "enhancement", text: "Enhance my features", icon: "💋", tags: ["fillers", "botox"] },
      { id: "wellness", text: "Overall wellness & prevention", icon: "🧘", tags: ["hormones", "iv-therapy", "vitamins", "peptides"] },
    ],
  },
  {
    id: "age",
    question: "What's your age range?",
    answers: [
      { id: "20s", text: "20-29", icon: "🌱", tags: ["prevention", "skincare"] },
      { id: "30s", text: "30-39", icon: "🌿", tags: ["early-intervention", "botox", "skincare"] },
      { id: "40s", text: "40-49", icon: "🌳", tags: ["correction", "fillers", "hormones"] },
      { id: "50s", text: "50-59", icon: "🍂", tags: ["restoration", "hormones", "fillers"] },
      { id: "60+", text: "60+", icon: "🌺", tags: ["restoration", "hormones", "iv-therapy"] },
    ],
  },
  {
    id: "concerns",
    question: "What concerns you most?",
    subtitle: "Select all that apply",
    multiSelect: true,
    answers: [
      { id: "wrinkles", text: "Fine lines & wrinkles", icon: "〰️", tags: ["botox", "skincare", "fillers"] },
      { id: "volume-loss", text: "Volume loss / sagging", icon: "📉", tags: ["fillers", "prp"] },
      { id: "weight", text: "Stubborn weight", icon: "🏋️", tags: ["weight-loss", "peptides"] },
      { id: "fatigue", text: "Low energy / fatigue", icon: "😴", tags: ["hormones", "iv-therapy", "vitamins"] },
      { id: "skin-texture", text: "Skin texture / acne", icon: "🔍", tags: ["facials", "skincare", "peels"] },
      { id: "lips", text: "Thin or uneven lips", icon: "👄", tags: ["fillers"] },
      { id: "jawline", text: "Undefined jawline", icon: "💎", tags: ["fillers", "botox"] },
      { id: "dark-circles", text: "Dark circles / tired eyes", icon: "👁️", tags: ["fillers", "skincare"] },
    ],
  },
  {
    id: "experience",
    question: "Have you had aesthetic treatments before?",
    answers: [
      { id: "never", text: "No, this would be my first time", icon: "🆕", tags: ["beginner"] },
      { id: "some", text: "Yes, a few treatments", icon: "👍", tags: ["experienced"] },
      { id: "regular", text: "Yes, I'm a regular!", icon: "⭐", tags: ["advanced"] },
    ],
  },
  {
    id: "timeline",
    question: "When do you want to see results?",
    answers: [
      { id: "asap", text: "As soon as possible!", icon: "🚀", tags: ["quick-results"] },
      { id: "event", text: "I have an event coming up", icon: "📅", tags: ["event-prep"] },
      { id: "gradual", text: "Gradual improvement is fine", icon: "📈", tags: ["long-term"] },
      { id: "maintenance", text: "Just maintaining what I have", icon: "🔄", tags: ["maintenance"] },
    ],
  },
  {
    id: "budget",
    question: "What's your comfort level for investment?",
    subtitle: "This helps us recommend the best options",
    answers: [
      { id: "budget", text: "Budget-friendly options", icon: "💵", tags: ["budget"] },
      { id: "moderate", text: "Moderate investment", icon: "💰", tags: ["moderate"] },
      { id: "premium", text: "Premium results, any cost", icon: "💎", tags: ["premium"] },
      { id: "financing", text: "Open to financing", icon: "📊", tags: ["financing"] },
    ],
  },
];

const treatments: Treatment[] = [
  {
    id: "botox",
    name: "Botox / Dysport",
    description: "Smooth wrinkles and prevent new ones from forming. Results in 3-7 days.",
    benefits: ["Reduces forehead lines", "Smooths crow's feet", "Prevents new wrinkles", "Quick treatment"],
    price: "$10/unit",
    icon: "💉",
    tags: ["botox", "anti-aging", "wrinkles", "prevention", "early-intervention", "quick-results", "budget", "moderate", "beginner", "experienced", "advanced"],
    link: "/services/botox-dysport-jeuveau",
    priority: 10,
  },
  {
    id: "fillers",
    name: "Dermal Fillers",
    description: "Restore volume, enhance lips, and sculpt facial contours naturally.",
    benefits: ["Instant volume", "Natural-looking results", "Long-lasting (6-18 months)", "Reversible"],
    price: "$500+/syringe",
    icon: "✨",
    tags: ["fillers", "volume-loss", "lips", "jawline", "dark-circles", "correction", "restoration", "moderate", "premium", "experienced", "advanced", "event-prep"],
    link: "/services/dermal-fillers",
    priority: 9,
  },
  {
    id: "lip-filler",
    name: "Lip Enhancement",
    description: "Soft, natural lip enhancement tailored to your face shape.",
    benefits: ["Fuller lips", "Better definition", "Hydration boost", "Customizable"],
    price: "$500+",
    icon: "💋",
    tags: ["fillers", "lips", "enhancement", "moderate", "premium", "beginner", "experienced", "event-prep"],
    link: "/services/lip-filler",
    priority: 8,
  },
  {
    id: "weight-loss",
    name: "GLP-1 Weight Loss",
    description: "Medical weight loss with Semaglutide or Tirzepatide. Average 15-20% body weight loss.",
    benefits: ["Proven results", "Reduces appetite", "Medical supervision", "First month FREE"],
    price: "1st Month FREE",
    icon: "⚖️",
    tags: ["weight-loss", "weight", "wellness", "long-term", "budget", "moderate", "financing", "beginner", "experienced"],
    link: "/services/weight-loss-therapy",
    priority: 10,
  },
  {
    id: "hormones",
    name: "Biote Hormone Therapy",
    description: "Bio-identical hormone pellets to restore energy, mood, and vitality.",
    benefits: ["More energy", "Better sleep", "Improved mood", "Enhanced libido"],
    price: "Starting at $650",
    icon: "🧬",
    tags: ["hormones", "energy", "fatigue", "wellness", "restoration", "correction", "moderate", "premium", "long-term", "maintenance"],
    link: "/services/biote-hormone-therapy",
    priority: 9,
  },
  {
    id: "iv-therapy",
    name: "IV Vitamin Therapy",
    description: "100% absorption of vitamins and minerals for instant energy and wellness.",
    benefits: ["Instant hydration", "Energy boost", "Immune support", "Skin glow"],
    price: "$125-$350",
    icon: "💧",
    tags: ["iv-therapy", "energy", "fatigue", "skin-glow", "wellness", "vitamins", "quick-results", "budget", "moderate", "beginner"],
    link: "/iv-therapy",
    priority: 7,
  },
  {
    id: "vitamin-injections",
    name: "Vitamin Injections",
    description: "Quick B12, glutathione, and biotin shots for energy and glow.",
    benefits: ["Instant energy", "Metabolism boost", "Skin brightening", "Hair/nail support"],
    price: "$25-$35",
    icon: "⚡",
    tags: ["vitamins", "energy", "fatigue", "skin-glow", "wellness", "budget", "quick-results", "beginner", "maintenance"],
    link: "/services/vitamin-injections",
    priority: 6,
  },
  {
    id: "facials",
    name: "Hydrafacial / Geneo",
    description: "Deep cleansing and hydration for instantly glowing skin.",
    benefits: ["Deep cleanse", "Instant glow", "No downtime", "All skin types"],
    price: "$150-$250",
    icon: "🌟",
    tags: ["facials", "skin-glow", "skin-texture", "skincare", "quick-results", "event-prep", "budget", "moderate", "beginner"],
    link: "/services/hydra-facial",
    priority: 6,
  },
  {
    id: "chemical-peels",
    name: "Chemical Peels",
    description: "Exfoliation treatment for smoother, brighter, more even skin.",
    benefits: ["Improves texture", "Reduces acne", "Brightens skin", "Anti-aging"],
    price: "$100-$200",
    icon: "🧪",
    tags: ["peels", "skincare", "skin-texture", "skin-glow", "anti-aging", "budget", "moderate", "beginner", "experienced"],
    link: "/services/chemical-peels",
    priority: 5,
  },
  {
    id: "rf-microneedling",
    name: "RF Microneedling",
    description: "Collagen-boosting treatment for firmer, smoother skin.",
    benefits: ["Stimulates collagen", "Tightens skin", "Reduces scars", "Long-lasting"],
    price: "$300-$500",
    icon: "📍",
    tags: ["skincare", "skin-texture", "anti-aging", "correction", "moderate", "premium", "experienced", "advanced", "long-term"],
    link: "/services/rf-microneedling",
    priority: 7,
  },
  {
    id: "prp",
    name: "PRP / PRF Therapy",
    description: "Regenerative treatment using your own growth factors.",
    benefits: ["Natural rejuvenation", "Collagen boost", "Hair restoration", "Skin renewal"],
    price: "$600+",
    icon: "🩸",
    tags: ["prp", "skincare", "volume-loss", "restoration", "premium", "long-term", "experienced", "advanced"],
    link: "/services/prf-prp",
    priority: 6,
  },
  {
    id: "peptides",
    name: "Peptide Therapy",
    description: "Advanced peptides for healing, anti-aging, and performance.",
    benefits: ["Accelerated healing", "Anti-aging", "Better sleep", "Muscle recovery"],
    price: "$150-$400/mo",
    icon: "🔬",
    tags: ["peptides", "wellness", "energy", "weight-loss", "restoration", "moderate", "premium", "long-term", "experienced", "advanced"],
    link: "/services/sermorelin-growth-peptide",
    priority: 5,
  },
];

export function TreatmentQuiz() {
  const [started, setStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [showResults, setShowResults] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [satisfactionRated, setSatisfactionRated] = useState(false);

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleAnswer = (answerId: string) => {
    const question = questions[currentStep];
    
    if (question.multiSelect) {
      const current = answers[question.id] || [];
      const updated = current.includes(answerId)
        ? current.filter((a) => a !== answerId)
        : [...current, answerId];
      setAnswers({ ...answers, [question.id]: updated });
    } else {
      setAnswers({ ...answers, [question.id]: [answerId] });
      // Auto-advance for single select
      setTimeout(() => {
        if (currentStep < questions.length - 1) {
          setCurrentStep(currentStep + 1);
        } else {
          setShowLeadCapture(true);
        }
      }, 300);
    }
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowLeadCapture(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Log lead (in production, send to CRM/email service)
    console.log("Quiz Lead:", { name, email, phone, answers });
    
    // Also send to subscribe endpoint
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "treatment-quiz" }),
      });
    } catch {
      // Ignore errors, still show results
    }
    
    trackEvent("quiz_complete", { source: "treatment-quiz", email_captured: "true" });
    setSubmitted(true);
    setShowResults(true);
    setShowLeadCapture(false);
  };

  const skipLeadCapture = () => {
    trackEvent("quiz_complete", { source: "treatment-quiz", email_captured: "false" });
    setShowResults(true);
    setShowLeadCapture(false);
  };

  // Calculate recommended treatments based on answers
  const getRecommendations = (): Treatment[] => {
    const allTags: string[] = [];
    
    Object.entries(answers).forEach(([questionId, answerIds]) => {
      const question = questions.find((q) => q.id === questionId);
      if (question) {
        answerIds.forEach((answerId) => {
          const answer = question.answers.find((a) => a.id === answerId);
          if (answer) {
            allTags.push(...answer.tags);
          }
        });
      }
    });

    // Score each treatment based on tag matches
    const scored = treatments.map((treatment) => {
      let score = 0;
      allTags.forEach((tag) => {
        if (treatment.tags.includes(tag)) {
          score += 1;
        }
      });
      return { ...treatment, score: score + treatment.priority / 10 };
    });

    // Sort by score and return top 4
    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);
  };

  const recommendations = showResults ? getRecommendations() : [];

  // Start screen
  if (!started && !showResults) {
    return (
      <>
        <Section className="relative py-20 bg-gradient-to-b from-pink-950/30 via-purple-950/20 to-black overflow-hidden min-h-screen flex items-center">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-20 left-10 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
          </div>
          <div className="w-full">
            <FadeUp>
              <div className="text-center max-w-2xl mx-auto relative z-10">
                <span className="inline-block px-4 py-1 rounded-full bg-pink-500/20 text-pink-400 text-sm font-medium mb-4">
                  ✨ 2-Minute Quiz
                </span>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                  Find Your{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                    Perfect Treatment
                  </span>
                </h1>
                <p className="text-black text-lg mb-8">
                  Answer a few quick questions and get personalized treatment 
                  recommendations tailored to your goals, concerns, and lifestyle.
                </p>
                
                <div className="grid grid-cols-3 gap-4 mb-8 max-w-md mx-auto">
                  {[
                    { icon: "⏱️", text: "2 minutes" },
                    { icon: "🎯", text: "Personalized" },
                    { icon: "💝", text: "Free" },
                  ].map((item) => (
                    <div key={item.text} className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <span className="text-2xl mb-1 block">{item.icon}</span>
                      <span className="text-white text-sm">{item.text}</span>
                    </div>
                  ))}
                </div>
                
                <button
                  type="button"
                  onClick={() => setStarted(true)}
                  className="px-12 py-5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-xl hover:opacity-90 transition transform hover:scale-105"
                >
                  Start Quiz →
                </button>
                
                <p className="mt-6 text-black text-sm">
                  No commitment required. Get instant recommendations!
                </p>
              </div>
            </FadeUp>
          </div>
        </Section>
      </>
    );
  }

  // Lead capture screen
  if (showLeadCapture) {
    return (
      <Section className="relative py-20 bg-gradient-to-b from-pink-950/30 via-purple-950/20 to-black min-h-screen flex items-center">
        <div className="w-full max-w-md mx-auto">
          <FadeUp>
            <div className="bg-black/50 border border-pink-500/20 rounded-3xl p-8">
              <div className="text-center mb-6">
                <span className="text-5xl mb-4 block">🎉</span>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Your Results Are Ready!
                </h2>
                <p className="text-black">
                  Enter your info to see your personalized treatment plan 
                  and get 10% off your first visit.
                </p>
              </div>
              
              <form onSubmit={handleSubmitLead} className="space-y-4">
                <div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-pink-500 focus:outline-none"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-pink-500 focus:outline-none"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone (optional)"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-pink-500 focus:outline-none"
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold hover:opacity-90 transition"
                >
                  See My Results + Get 10% Off →
                </button>
              </form>
              
              <button
                type="button"
                onClick={skipLeadCapture}
                className="w-full mt-4 text-black text-sm hover:text-black transition"
              >
                Skip and see results
              </button>
            </div>
          </FadeUp>
        </div>
      </Section>
    );
  }

  // Results screen
  if (showResults) {
    return (
      <>
        <Section className="relative py-16 bg-gradient-to-b from-pink-950/30 via-purple-950/20 to-black">
          <FadeUp>
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1 rounded-full bg-pink-500/20 text-pink-400 text-sm font-medium mb-4">
                ✨ Your Personalized Results
              </span>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                Your Perfect{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                  Treatment Plan
                </span>
              </h1>
              <p className="text-black max-w-xl mx-auto">
                Based on your answers, here are the treatments we recommend for you.
                {submitted && " Check your email for your 10% off code!"}
              </p>
            </div>
          </FadeUp>

          {/* Recommendations */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
            {recommendations.map((treatment, i) => (
              <FadeUp key={treatment.id} delayMs={i * 100}>
                <div className={`p-6 rounded-2xl border transition h-full flex flex-col ${
                  i === 0 
                    ? "bg-gradient-to-br from-pink-500/20 to-purple-500/20 border-pink-500/30" 
                    : "bg-white/5 border-white/10"
                }`}>
                  {i === 0 && (
                    <span className="inline-block px-3 py-1 rounded-full bg-pink-500 text-white text-xs font-medium mb-3 w-fit">
                      #1 Best Match
                    </span>
                  )}
                  <div className="flex items-start gap-4 mb-4">
                    <span className="text-4xl">{treatment.icon}</span>
                    <div>
                      <h3 className="text-xl font-bold text-white">{treatment.name}</h3>
                      <p className="text-pink-400 font-semibold">{treatment.price}</p>
                    </div>
                  </div>
                  <p className="text-black text-sm mb-4">{treatment.description}</p>
                  <div className="flex-1">
                    <p className="text-black text-xs mb-2">Benefits:</p>
                    <div className="flex flex-wrap gap-2">
                      {treatment.benefits.map((benefit) => (
                        <span
                          key={benefit}
                          className="px-2 py-1 rounded-full bg-white/5 text-black text-xs"
                        >
                          ✓ {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                  <a
                    href={treatment.link}
                    className={`mt-4 block w-full py-3 rounded-xl font-medium text-center transition ${
                      i === 0
                        ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:opacity-90"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    Learn More →
                  </a>
                </div>
              </FadeUp>
            ))}
          </div>

          {/* CTA */}
          <FadeUp delayMs={400}>
            <div className="max-w-2xl mx-auto text-center p-8 rounded-3xl bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20">
              <h2 className="text-2xl font-bold text-white mb-3">
                Ready to Get Started?
              </h2>
              <p className="text-black mb-6">
                Book a free consultation to discuss your personalized treatment plan 
                with our expert team.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold hover:opacity-90 transition"
                >
                  Book Free Consultation →
                </a>
                <a
                  href="tel:630-636-6193"
                  className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition"
                >
                  📞 Call 630-636-6193
                </a>
              </div>
              {submitted && (
                <p className="mt-4 text-pink-400 text-sm">
                  ✓ Your 10% off code has been sent to {email}
                </p>
              )}
            </div>
          </FadeUp>

          {/* Post-quiz satisfaction micro-survey */}
          {!satisfactionRated && (
            <FadeUp delayMs={500}>
              <div className="max-w-md mx-auto mt-8 p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                <p className="text-black text-sm mb-3">How helpful was this quiz?</p>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => {
                        trackEvent("quiz_satisfaction", { rating: n, source: "treatment-quiz" });
                        setSatisfactionRated(true);
                      }}
                      className="w-10 h-10 rounded-full bg-white/5 hover:bg-pink-500/30 text-lg transition hover:scale-110"
                      aria-label={`Rate ${n} out of 5`}
                    >
                      {n === 5 ? "😍" : n === 4 ? "😊" : n === 3 ? "🙂" : n === 2 ? "😐" : "😕"}
                    </button>
                  ))}
                </div>
              </div>
            </FadeUp>
          )}

          {/* Retake */}
          <div className="text-center mt-8">
            <button
              type="button"
              onClick={() => {
                setStarted(false);
                setAnswers({});
                setCurrentStep(0);
                setShowResults(false);
                setShowLeadCapture(false);
                setSubmitted(false);
              }}
              className="text-black hover:text-white transition"
            >
              ← Retake Quiz
            </button>
          </div>
        </Section>
      </>
    );
  }

  // Question screen
  return (
    <Section className="relative py-16 bg-gradient-to-b from-pink-950/30 via-purple-950/20 to-black min-h-screen">
      <div className="max-w-2xl mx-auto">
        {/* Progress bar */}
        <FadeUp>
          <div className="mb-8">
            <div className="flex items-center justify-between text-sm text-black mb-2">
              <span>Question {currentStep + 1} of {questions.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </FadeUp>

        {/* Question */}
        <FadeUp>
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {currentQuestion.question}
            </h2>
            {currentQuestion.subtitle && (
              <p className="text-black">{currentQuestion.subtitle}</p>
            )}
          </div>
        </FadeUp>

        {/* Answers */}
        <div className="grid gap-3">
          {currentQuestion.answers.map((answer, i) => {
            const isSelected = (answers[currentQuestion.id] || []).includes(answer.id);
            return (
              <FadeUp key={answer.id} delayMs={i * 50}>
                <button
                  type="button"
                  onClick={() => handleAnswer(answer.id)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? "bg-pink-500/20 border-pink-500 scale-[1.02]"
                      : "bg-white/5 border-white/10 hover:border-pink-500/50 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{answer.icon}</span>
                    <span className="text-white font-medium flex-1">{answer.text}</span>
                    {currentQuestion.multiSelect && (
                      <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition ${
                        isSelected ? "bg-pink-500 border-pink-500" : "border-black"
                      }`}>
                        {isSelected && <span className="text-white text-sm">✓</span>}
                      </div>
                    )}
                  </div>
                </button>
              </FadeUp>
            );
          })}
        </div>

        {/* Navigation for multi-select */}
        {currentQuestion.multiSelect && (
          <FadeUp delayMs={300}>
            <div className="flex gap-4 mt-8">
              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition"
                >
                  ← Back
                </button>
              )}
              <button
                type="button"
                onClick={handleNext}
                disabled={(answers[currentQuestion.id] || []).length === 0}
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentStep === questions.length - 1 ? "See My Results →" : "Next →"}
              </button>
            </div>
          </FadeUp>
        )}

        {/* Back button for single-select */}
        {!currentQuestion.multiSelect && currentStep > 0 && (
          <FadeUp delayMs={300}>
            <button
              type="button"
              onClick={handleBack}
              className="mt-8 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition"
            >
              ← Back
            </button>
          </FadeUp>
        )}
      </div>
    </Section>
  );
}
