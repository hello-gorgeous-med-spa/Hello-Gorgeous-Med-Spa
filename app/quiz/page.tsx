'use client';

// ============================================================
// TREATMENT RECOMMENDATION QUIZ
// Interactive quiz to help clients find their perfect treatments
// ============================================================

import { useState } from 'react';
import Link from 'next/link';

interface Question {
  id: string;
  question: string;
  type: 'single' | 'multiple';
  options: { id: string; label: string; icon: string; tags: string[] }[];
}

interface Recommendation {
  id: string;
  name: string;
  description: string;
  icon: string;
  matchScore: number;
  price: string;
  duration: string;
  tags: string[];
}

const QUESTIONS: Question[] = [
  {
    id: 'goals',
    question: "What's your #1 beauty goal right now?",
    type: 'single',
    options: [
      { id: 'wrinkles', label: 'Reduce fine lines & wrinkles', icon: '✨', tags: ['anti-aging', 'botox', 'filler'] },
      { id: 'volume', label: 'Add volume (lips, cheeks)', icon: '💋', tags: ['filler', 'lips', 'cheeks'] },
      { id: 'skin', label: 'Improve skin texture & glow', icon: '🌟', tags: ['facial', 'skincare', 'glow'] },
      { id: 'weight', label: 'Lose weight & feel confident', icon: '⚡', tags: ['weight-loss', 'body'] },
      { id: 'wellness', label: 'Boost energy & wellness', icon: '💪', tags: ['wellness', 'iv', 'vitamins'] },
    ],
  },
  {
    id: 'concerns',
    question: 'Select all areas you\'d like to address:',
    type: 'multiple',
    options: [
      { id: 'forehead', label: 'Forehead lines', icon: '🙄', tags: ['botox', 'anti-aging'] },
      { id: 'crows', label: "Crow's feet", icon: '👁️', tags: ['botox', 'anti-aging'] },
      { id: 'lips', label: 'Thin lips', icon: '💋', tags: ['filler', 'lips'] },
      { id: 'cheeks', label: 'Flat cheeks', icon: '😊', tags: ['filler', 'cheeks'] },
      { id: 'jawline', label: 'Undefined jawline', icon: '💪', tags: ['filler', 'jawline'] },
      { id: 'chin', label: 'Double chin', icon: '😶', tags: ['kybella', 'body'] },
      { id: 'acne', label: 'Acne / scarring', icon: '😔', tags: ['facial', 'skincare'] },
      { id: 'dull', label: 'Dull skin', icon: '😴', tags: ['facial', 'glow', 'skincare'] },
    ],
  },
  {
    id: 'experience',
    question: 'Have you had aesthetic treatments before?',
    type: 'single',
    options: [
      { id: 'never', label: "No, I'm new to this!", icon: '🌱', tags: ['new-client', 'gentle'] },
      { id: 'some', label: 'Yes, a few times', icon: '👋', tags: ['experienced'] },
      { id: 'regular', label: "I'm a regular", icon: '⭐', tags: ['vip', 'experienced'] },
    ],
  },
  {
    id: 'timeline',
    question: 'When do you want to see results?',
    type: 'single',
    options: [
      { id: 'asap', label: 'Immediately (event coming up)', icon: '⚡', tags: ['quick-results', 'event'] },
      { id: 'gradual', label: 'Gradual improvement is fine', icon: '🌸', tags: ['gradual', 'natural'] },
      { id: 'longterm', label: 'Building a long-term routine', icon: '📈', tags: ['routine', 'maintenance'] },
    ],
  },
  {
    id: 'budget',
    question: "What's your comfort level for investment?",
    type: 'single',
    options: [
      { id: 'starter', label: 'Just starting out ($100-300)', icon: '🌱', tags: ['budget', 'starter'] },
      { id: 'moderate', label: 'Ready to invest ($300-800)', icon: '💎', tags: ['moderate'] },
      { id: 'premium', label: 'Premium experience ($800+)', icon: '👑', tags: ['premium', 'vip'] },
    ],
  },
];

const TREATMENTS: Recommendation[] = [
  {
    id: 'botox',
    name: 'Botox/Dysport',
    description: 'Smooth fine lines and prevent new wrinkles. Quick, natural-looking results.',
    icon: '💉',
    matchScore: 0,
    price: 'From $12/unit',
    duration: '15-30 min',
    tags: ['anti-aging', 'botox', 'forehead', 'crows', 'quick-results', 'experienced', 'moderate', 'premium'],
  },
  {
    id: 'lip-filler',
    name: 'Lip Enhancement',
    description: 'Add natural volume and definition to your lips with premium hyaluronic fillers.',
    icon: '💋',
    matchScore: 0,
    price: 'From $650',
    duration: '30-45 min',
    tags: ['filler', 'lips', 'volume', 'moderate', 'premium', 'quick-results'],
  },
  {
    id: 'cheek-filler',
    name: 'Cheek Sculpting',
    description: 'Restore youthful volume and create beautiful contours.',
    icon: '✨',
    matchScore: 0,
    price: 'From $750',
    duration: '30-45 min',
    tags: ['filler', 'cheeks', 'volume', 'anti-aging', 'premium'],
  },
  {
    id: 'hydrafacial',
    name: 'HydraFacial',
    description: 'Deep cleansing, exfoliation, and hydration for instant glow.',
    icon: '💆',
    matchScore: 0,
    price: '$175',
    duration: '45 min',
    tags: ['facial', 'skincare', 'glow', 'dull', 'starter', 'moderate', 'new-client', 'gentle', 'quick-results'],
  },
  {
    id: 'weight-loss',
    name: 'Medical Weight Loss',
    description: 'Semaglutide or Tirzepatide to help you reach your goals with medical support.',
    icon: '⚡',
    matchScore: 0,
    price: 'From $299/mo',
    duration: 'Ongoing',
    tags: ['weight-loss', 'body', 'gradual', 'routine', 'moderate', 'premium'],
  },
  {
    id: 'iv-therapy',
    name: 'IV Vitamin Therapy',
    description: 'Instant hydration and energy boost with customized vitamin blends.',
    icon: '💧',
    matchScore: 0,
    price: 'From $150',
    duration: '45 min',
    tags: ['wellness', 'iv', 'vitamins', 'energy', 'starter', 'moderate', 'quick-results', 'new-client'],
  },
  {
    id: 'kybella',
    name: 'Kybella',
    description: 'Permanently eliminate double chin fat with injectable treatment.',
    icon: '💪',
    matchScore: 0,
    price: 'From $600',
    duration: '30 min',
    tags: ['kybella', 'body', 'chin', 'gradual', 'moderate', 'premium'],
  },
  {
    id: 'consult',
    name: 'Free Consultation',
    description: 'Not sure where to start? Meet with our experts for personalized recommendations.',
    icon: '🗓️',
    matchScore: 0,
    price: 'FREE',
    duration: '30 min',
    tags: ['new-client', 'gentle', 'starter', 'budget'],
  },
];

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [showResults, setShowResults] = useState(false);
  const [email, setEmail] = useState('');
  const [showEmailCapture, setShowEmailCapture] = useState(false);

  const question = QUESTIONS[currentQuestion];
  const progress = ((currentQuestion) / QUESTIONS.length) * 100;

  const handleSelect = (optionId: string) => {
    const questionId = question.id;
    
    if (question.type === 'single') {
      setAnswers({ ...answers, [questionId]: [optionId] });
      // Auto-advance for single select
      setTimeout(() => {
        if (currentQuestion < QUESTIONS.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
        } else {
          setShowEmailCapture(true);
        }
      }, 300);
    } else {
      // Toggle for multiple select
      const current = answers[questionId] || [];
      const newAnswers = current.includes(optionId)
        ? current.filter(id => id !== optionId)
        : [...current, optionId];
      setAnswers({ ...answers, [questionId]: newAnswers });
    }
  };

  const handleNext = () => {
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowEmailCapture(true);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const getRecommendations = (): Recommendation[] => {
    // Collect all tags from answers
    const selectedTags: string[] = [];
    Object.entries(answers).forEach(([questionId, selectedOptions]) => {
      const question = QUESTIONS.find(q => q.id === questionId);
      if (question) {
        selectedOptions.forEach(optionId => {
          const option = question.options.find(o => o.id === optionId);
          if (option) {
            selectedTags.push(...option.tags);
          }
        });
      }
    });

    // Score treatments based on tag matches
    const scored = TREATMENTS.map(treatment => ({
      ...treatment,
      matchScore: treatment.tags.filter(tag => selectedTags.includes(tag)).length,
    }));

    // Sort by score and return top 4
    return scored
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 4);
  };

  const handleSubmitEmail = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Save email to database
    setShowResults(true);
  };

  const handleSkipEmail = () => {
    setShowResults(true);
  };

  if (showResults) {
    const recommendations = getRecommendations();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-6xl mb-4 block">🎉</span>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Your Personalized Recommendations
            </h1>
            <p className="text-gray-600">
              Based on your answers, here are the perfect treatments for you:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {recommendations.map((rec, index) => (
              <div
                key={rec.id}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden ${
                  index === 0 ? 'md:col-span-2 ring-2 ring-pink-500' : ''
                }`}
              >
                {index === 0 && (
                  <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-center py-2 text-sm font-medium">
                    ⭐ Best Match for You
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <span className="text-4xl">{rec.icon}</span>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900">{rec.name}</h3>
                      <p className="text-gray-600 mb-4">{rec.description}</p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <span className="text-pink-600 font-medium">{rec.price}</span>
                        <span className="text-gray-500">⏱️ {rec.duration}</span>
                      </div>
                    </div>
                  </div>
                  <Link
                    href="/book"
                    className={`block w-full mt-4 py-3 text-center font-medium rounded-lg ${
                      index === 0
                        ? 'bg-pink-500 text-white hover:bg-pink-600'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    Book {rec.name}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-pink-100 mb-6">
              Book a free consultation and our experts will create your personalized treatment plan.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/book"
                className="px-8 py-3 bg-white text-pink-600 font-medium rounded-lg hover:bg-pink-50"
              >
                Book Free Consultation
              </Link>
              <a
                href="tel:6306366193"
                className="px-8 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white/10"
              >
                Call (630) 636-6193
              </a>
            </div>
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => {
                setCurrentQuestion(0);
                setAnswers({});
                setShowResults(false);
                setShowEmailCapture(false);
              }}
              className="text-pink-500 hover:text-pink-600 font-medium"
            >
              ← Retake Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showEmailCapture) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-6">
            <span className="text-5xl mb-4 block">📧</span>
            <h2 className="text-2xl font-bold text-gray-900">Almost Done!</h2>
            <p className="text-gray-600 mt-2">
              Enter your email to get your personalized recommendations and 
              exclusive offers.
            </p>
          </div>

          <form onSubmit={handleSubmitEmail} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-pink-500"
            />
            <button
              type="submit"
              className="w-full py-3 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600"
            >
              See My Results
            </button>
          </form>

          <button
            onClick={handleSkipEmail}
            className="w-full py-3 text-gray-500 font-medium mt-2 hover:text-gray-700"
          >
            Skip for now
          </button>

          <p className="text-xs text-gray-400 text-center mt-4">
            We'll send your results and exclusive first-time client offers. No spam, ever.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Question {currentQuestion + 1} of {QUESTIONS.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {question.question}
          </h2>

          {question.type === 'multiple' && (
            <p className="text-gray-500 text-center mb-6">Select all that apply</p>
          )}

          <div className="grid grid-cols-1 gap-3">
            {question.options.map((option) => {
              const isSelected = (answers[question.id] || []).includes(option.id);
              return (
                <button
                  key={option.id}
                  onClick={() => handleSelect(option.id)}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                    isSelected
                      ? 'border-pink-500 bg-pink-50'
                      : 'border-gray-200 hover:border-pink-300'
                  }`}
                >
                  <span className="text-3xl">{option.icon}</span>
                  <span className={`font-medium ${isSelected ? 'text-pink-700' : 'text-gray-700'}`}>
                    {option.label}
                  </span>
                  {isSelected && (
                    <span className="ml-auto text-pink-500">✓</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handleBack}
              disabled={currentQuestion === 0}
              className={`px-6 py-2 rounded-lg font-medium ${
                currentQuestion === 0
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              ← Back
            </button>

            {question.type === 'multiple' && (
              <button
                onClick={handleNext}
                disabled={!(answers[question.id]?.length > 0)}
                className={`px-6 py-2 rounded-lg font-medium ${
                  answers[question.id]?.length > 0
                    ? 'bg-pink-500 text-white hover:bg-pink-600'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Next →
              </button>
            )}
          </div>
        </div>

        {/* Trust indicators + Need help */}
        <div className="mt-8 text-center space-y-2">
          <p className="text-gray-500 text-sm">
            🔒 Your answers are confidential and help us recommend the best treatments for you
          </p>
          <p className="text-gray-500 text-sm">
            Prefer to skip?{" "}
            <Link href="/book" className="text-pink-500 hover:text-pink-600 font-medium">
              Book directly
            </Link>
            {" · "}
            <a href="tel:630-636-6193" className="text-pink-500 hover:text-pink-600 font-medium">
              Call (630) 636-6193
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
