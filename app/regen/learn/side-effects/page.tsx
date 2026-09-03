'use client';

import Link from 'next/link';
import Image from 'next/image';

const BRAND = {
  teal: '#0D9488',
  pink: '#E91E8C',
  dark: '#0a0a0a',
  darkAlt: '#111',
  gray: '#888',
  cream: '#f5f5f5',
};

const COMMON_SIDE_EFFECTS = [
  {
    name: 'Nausea',
    frequency: 'Very Common (40-50%)',
    description: 'The most reported side effect, especially during dose titration. Usually mild to moderate and improves over time.',
    tips: [
      'Eat smaller, more frequent meals',
      'Avoid fatty, greasy, or fried foods',
      'Stay hydrated — sip water throughout the day',
      'Take your injection after a light meal',
      'Ginger tea or ginger candies may help',
    ],
    severity: 'mild',
    duration: 'Usually improves after 2-4 weeks',
  },
  {
    name: 'Constipation',
    frequency: 'Common (20-30%)',
    description: 'GLP-1s slow digestion, which can lead to less frequent bowel movements.',
    tips: [
      'Increase fiber intake (fruits, vegetables, whole grains)',
      'Drink at least 64 oz of water daily',
      'Stay physically active',
      'Consider a fiber supplement (psyllium husk)',
      'Over-the-counter stool softeners if needed',
    ],
    severity: 'mild',
    duration: 'Often improves with diet changes',
  },
  {
    name: 'Diarrhea',
    frequency: 'Common (15-25%)',
    description: 'Some patients experience loose stools, especially early in treatment.',
    tips: [
      'Avoid high-fat and spicy foods',
      'Stay hydrated with water and electrolytes',
      'Eat bland foods (BRAT: bananas, rice, applesauce, toast)',
      'Avoid caffeine and alcohol',
    ],
    severity: 'mild',
    duration: 'Usually resolves within 1-2 weeks',
  },
  {
    name: 'Vomiting',
    frequency: 'Less Common (10-20%)',
    description: 'May occur if eating too quickly or too much. Usually happens during dose increases.',
    tips: [
      'Eat slowly and stop when you feel satisfied',
      'Avoid lying down immediately after eating',
      'Smaller portions are key',
      'Contact your provider if vomiting is persistent',
    ],
    severity: 'moderate',
    duration: 'Usually improves with eating adjustments',
  },
  {
    name: 'Fatigue',
    frequency: 'Common (10-15%)',
    description: 'Some patients feel tired, especially early in treatment as the body adjusts to lower caloric intake.',
    tips: [
      'Ensure adequate protein intake (0.7-1g per lb body weight)',
      'Get 7-9 hours of sleep',
      'Stay hydrated',
      'Light exercise can actually boost energy',
      'B12 supplementation may help',
    ],
    severity: 'mild',
    duration: 'Usually temporary',
  },
  {
    name: 'Injection Site Reactions',
    frequency: 'Common (5-15%)',
    description: 'Redness, itching, or bruising at the injection site.',
    tips: [
      'Rotate injection sites (abdomen, thigh, upper arm)',
      'Let alcohol dry before injecting',
      'Apply ice before/after if needed',
      'Don\'t inject into bruised or tender areas',
    ],
    severity: 'mild',
    duration: 'Resolves within a few days',
  },
];

const SERIOUS_SIDE_EFFECTS = [
  {
    name: 'Pancreatitis',
    symptoms: 'Severe abdominal pain radiating to back, nausea, vomiting',
    action: 'Stop medication immediately and seek emergency care',
    rarity: 'Rare (<1%)',
  },
  {
    name: 'Gallbladder Issues',
    symptoms: 'Severe upper right abdominal pain, especially after eating fatty foods',
    action: 'Contact your provider — may need ultrasound evaluation',
    rarity: 'Uncommon (1-3%)',
  },
  {
    name: 'Severe Allergic Reaction',
    symptoms: 'Swelling of face/throat, difficulty breathing, severe rash',
    action: 'Call 911 immediately',
    rarity: 'Very Rare',
  },
  {
    name: 'Hypoglycemia (Low Blood Sugar)',
    symptoms: 'Shakiness, sweating, confusion, rapid heartbeat (more common if on diabetes meds)',
    action: 'Eat fast-acting carbs (juice, glucose tablets); contact provider',
    rarity: 'Rare unless on other diabetes medications',
  },
];

const WHEN_TO_CONTACT = [
  'Nausea or vomiting that prevents you from eating or drinking for more than 24 hours',
  'Severe or persistent abdominal pain',
  'Signs of dehydration (dark urine, dizziness, extreme thirst)',
  'Significant changes in mood or mental health',
  'Symptoms that don\'t improve after 2-3 weeks',
  'Any symptom that concerns you — we\'re here to help',
];

export default function SideEffectsPage() {
  return (
    <div style={{ backgroundColor: BRAND.dark, minHeight: '100vh', color: '#fff' }}>
      {/* Header */}
      <header style={{ padding: '20px 24px', borderBottom: '1px solid #222' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/">
            <Image src="/images/regen/logo-full.png" alt="REGEN RX" width={120} height={40} style={{ height: 32, width: 'auto' }} />
          </Link>
          <nav style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            <Link href="/learn" style={{ color: '#888', fontSize: 14, textDecoration: 'none' }}>← Back to Learn</Link>
            <Link
              href="/start?goal=weight-loss"
              style={{ padding: '10px 20px', backgroundColor: BRAND.pink, color: '#fff', borderRadius: 999, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section style={{
        padding: '60px 24px',
        background: `linear-gradient(135deg, ${BRAND.dark} 0%, #1a1520 100%)`,
        borderBottom: '1px solid #222',
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            display: 'inline-block',
            padding: '6px 16px',
            backgroundColor: `${BRAND.teal}20`,
            border: `1px solid ${BRAND.teal}`,
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 600,
            color: BRAND.teal,
            marginBottom: 20,
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}>
            Patient Support
          </div>
          
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, marginBottom: 16 }}>
            Managing GLP-1 Side Effects
          </h1>
          
          <p style={{ fontSize: 18, color: '#aaa', maxWidth: 600, margin: '0 auto', lineHeight: 1.6 }}>
            Most side effects are mild and temporary. Here&apos;s what to expect and how to manage them — 
            plus when to contact your provider.
          </p>
        </div>
      </section>

      {/* Key Message */}
      <section style={{ padding: '40px 24px', backgroundColor: BRAND.darkAlt }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{
            padding: 24,
            borderRadius: 16,
            backgroundColor: `${BRAND.teal}10`,
            border: `1px solid ${BRAND.teal}30`,
          }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: BRAND.teal, marginBottom: 12 }}>
              💡 The Good News
            </h2>
            <p style={{ fontSize: 15, color: '#ccc', lineHeight: 1.7, margin: 0 }}>
              <strong style={{ color: '#fff' }}>Side effects usually improve significantly after the first 2-4 weeks</strong> as your body 
              adjusts to the medication. Starting at a low dose and titrating slowly helps minimize side effects — 
              that&apos;s why we don&apos;t rush the dosing schedule. Most patients find side effects are manageable 
              and worth the results.
            </p>
          </div>
        </div>
      </section>

      {/* Common Side Effects */}
      <section style={{ padding: '60px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 32, textAlign: 'center' }}>
            Common Side Effects & How to Manage Them
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {COMMON_SIDE_EFFECTS.map((effect) => (
              <div 
                key={effect.name}
                style={{
                  backgroundColor: BRAND.darkAlt,
                  borderRadius: 16,
                  padding: 24,
                  border: '1px solid #222',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <h3 style={{ fontSize: 22, fontWeight: 700, color: BRAND.cream, marginBottom: 4 }}>
                      {effect.name}
                    </h3>
                    <span style={{ fontSize: 13, color: BRAND.teal }}>{effect.frequency}</span>
                  </div>
                  <span 
                    style={{ 
                      padding: '4px 12px', 
                      borderRadius: 999, 
                      fontSize: 12, 
                      fontWeight: 600,
                      backgroundColor: effect.severity === 'mild' ? '#22c55e20' : '#f59e0b20',
                      color: effect.severity === 'mild' ? '#22c55e' : '#f59e0b',
                    }}
                  >
                    {effect.severity === 'mild' ? 'Usually Mild' : 'Moderate'}
                  </span>
                </div>
                
                <p style={{ fontSize: 15, color: '#aaa', marginBottom: 16 }}>{effect.description}</p>
                
                <div style={{ marginBottom: 16 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 600, color: BRAND.pink, marginBottom: 8 }}>
                    Tips to Manage:
                  </h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {effect.tips.map((tip, i) => (
                      <li key={i} style={{ display: 'flex', gap: 8, fontSize: 14, color: '#ccc' }}>
                        <span style={{ color: BRAND.teal }}>✓</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <p style={{ fontSize: 13, color: '#666', margin: 0 }}>
                  ⏱️ {effect.duration}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Serious Side Effects */}
      <section style={{ padding: '60px 24px', backgroundColor: BRAND.darkAlt }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16, textAlign: 'center', color: '#EF4444' }}>
            ⚠️ Serious Side Effects (Rare)
          </h2>
          <p style={{ fontSize: 15, color: '#aaa', textAlign: 'center', marginBottom: 32 }}>
            These are uncommon but important to recognize. Seek medical attention if you experience any of these.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {SERIOUS_SIDE_EFFECTS.map((effect) => (
              <div 
                key={effect.name}
                style={{
                  backgroundColor: BRAND.dark,
                  borderRadius: 12,
                  padding: 20,
                  border: '1px solid #EF444430',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: BRAND.cream }}>{effect.name}</h3>
                  <span style={{ fontSize: 12, color: '#666' }}>{effect.rarity}</span>
                </div>
                <p style={{ fontSize: 14, color: '#aaa', marginBottom: 8 }}>
                  <strong style={{ color: '#ccc' }}>Symptoms:</strong> {effect.symptoms}
                </p>
                <p style={{ fontSize: 14, color: '#EF4444', margin: 0 }}>
                  <strong>Action:</strong> {effect.action}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* When to Contact */}
      <section style={{ padding: '60px 24px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24, textAlign: 'center' }}>
            When to Contact Your Provider
          </h2>
          
          <div style={{
            backgroundColor: BRAND.darkAlt,
            borderRadius: 16,
            padding: 32,
            border: `2px solid ${BRAND.teal}30`,
          }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {WHEN_TO_CONTACT.map((item, i) => (
                <li key={i} style={{ display: 'flex', gap: 12, fontSize: 15, color: '#ccc' }}>
                  <span style={{ color: BRAND.pink, fontSize: 18 }}>→</span>
                  {item}
                </li>
              ))}
            </ul>
            
            <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid #333' }}>
              <p style={{ fontSize: 16, fontWeight: 600, color: BRAND.teal, marginBottom: 8 }}>
                REGEN RX patients get 24/7 messaging support
              </p>
              <p style={{ fontSize: 14, color: '#888' }}>
                Don&apos;t hesitate to reach out. We&apos;re here to help you navigate any concerns 
                and adjust your treatment plan as needed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '60px 24px', backgroundColor: BRAND.pink }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 16 }}>
            Ready to start your weight loss journey?
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', marginBottom: 32 }}>
            Our providers will guide you through the process with personalized support.
          </p>
          <Link
            href="/start?goal=weight-loss"
            style={{
              display: 'inline-block',
              padding: '16px 32px',
              backgroundColor: '#fff',
              color: BRAND.pink,
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            Get Started — Free Consultation
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '40px 24px', borderTop: '1px solid #222' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', fontSize: 11, color: '#555', textAlign: 'center' }}>
          <p>REGEN RX · tryregenrx.com · 630-636-6193</p>
          <p style={{ marginTop: 8 }}>
            <Link href="/safety" style={{ color: '#888', marginRight: 16 }}>Safety</Link>
            <Link href="/terms" style={{ color: '#888', marginRight: 16 }}>Terms</Link>
            <Link href="/privacy" style={{ color: '#888' }}>Privacy</Link>
          </p>
          <p style={{ marginTop: 16, color: '#444', lineHeight: 1.6 }}>
            <strong>DISCLAIMER:</strong> Information provided is for educational purposes only and is not medical advice. 
            Individual results vary. Always follow your provider&apos;s specific instructions.
          </p>
        </div>
      </footer>
    </div>
  );
}
