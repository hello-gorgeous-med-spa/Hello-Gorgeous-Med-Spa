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

export default function AboutPage() {
  return (
    <div style={{ backgroundColor: BRAND.dark, minHeight: '100vh', color: '#fff' }}>
      {/* Header */}
      <header style={{ padding: '20px 24px', borderBottom: '1px solid #222' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/">
            <Image src="/images/regen/logo-full.png" alt="REGEN RX" width={120} height={40} style={{ height: 32, width: 'auto' }} />
          </Link>
          <nav style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            <Link href="/providers" style={{ color: '#888', fontSize: 14, textDecoration: 'none' }}>Our Team</Link>
            <Link href="/pricing" style={{ color: '#888', fontSize: 14, textDecoration: 'none' }}>Pricing</Link>
            <Link
              href="/start"
              style={{ padding: '10px 20px', backgroundColor: BRAND.pink, color: '#fff', borderRadius: 999, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section style={{
        padding: '80px 24px 60px',
        background: `linear-gradient(135deg, ${BRAND.dark} 0%, #1a1520 50%, ${BRAND.dark} 100%)`,
        borderBottom: '1px solid #222',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{
            display: 'inline-block',
            padding: '6px 16px',
            backgroundColor: `${BRAND.pink}20`,
            border: `1px solid ${BRAND.pink}`,
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 600,
            color: BRAND.pink,
            marginBottom: 24,
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}>
            Our Story
          </div>
          
          <h1 style={{ fontSize: 'clamp(36px, 6vw, 52px)', fontWeight: 800, marginBottom: 20, lineHeight: 1.2 }}>
            A Letter from the Founder
          </h1>
          
          <p style={{ fontSize: 20, color: BRAND.teal, fontWeight: 500 }}>
            Why I built REGEN RX — and why it&apos;s personal.
          </p>
        </div>
      </section>

      {/* Founder Letter */}
      <section style={{ padding: '60px 24px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{
            backgroundColor: BRAND.darkAlt,
            borderRadius: 24,
            padding: 'clamp(32px, 6vw, 56px)',
            border: `1px solid ${BRAND.teal}20`,
            boxShadow: `0 0 60px ${BRAND.teal}10`,
          }}>
            
            {/* Opening */}
            <p style={{ fontSize: 18, color: '#ccc', lineHeight: 1.9, marginBottom: 28 }}>
              Dear Friend,
            </p>
            
            <p style={{ fontSize: 17, color: '#bbb', lineHeight: 1.9, marginBottom: 28 }}>
              If you&apos;re reading this, you&apos;re probably looking for something more. More energy. 
              More confidence. More years with the people you love. I get it — because that&apos;s 
              exactly why I started REGEN RX.
            </p>

            {/* The Loss */}
            <p style={{ fontSize: 17, color: '#bbb', lineHeight: 1.9, marginBottom: 28 }}>
              In 2025, I lost my best friend — <strong style={{ color: '#fff' }}>my father</strong> — to cardiovascular disease. 
              He was the kind of man who gave everything to everyone else and never took time for himself. 
              By the time he finally went to see a doctor, it was too late. The damage was done. 
              And I was left wondering: <em style={{ color: BRAND.teal }}>what if someone had caught it sooner? 
              What if he&apos;d had access to better care, earlier?</em>
            </p>

            <p style={{ fontSize: 17, color: '#bbb', lineHeight: 1.9, marginBottom: 28 }}>
              That loss changed me. It broke me — and then it rebuilt me with a new purpose.
            </p>

            {/* Hello Gorgeous Success */}
            <p style={{ fontSize: 17, color: '#bbb', lineHeight: 1.9, marginBottom: 28 }}>
              I had already built <strong style={{ color: '#fff' }}>Hello Gorgeous Med Spa</strong> in Oswego, Illinois — 
              a medical aesthetics practice that grew from a dream into a thriving clinic with thousands of 
              loyal patients and over <strong style={{ color: BRAND.teal }}>1,900 five-star reviews</strong>. We helped people 
              look their best on the outside. But after losing my dad, I realized I needed to do more. 
              I needed to help people feel their best on the <em>inside</em>.
            </p>

            {/* The Shift */}
            <p style={{ fontSize: 17, color: '#bbb', lineHeight: 1.9, marginBottom: 28 }}>
              That&apos;s when clinical care became my obsession. Weight management. Hormone optimization. 
              Metabolic health. The things that actually move the needle on longevity — the things that 
              might have saved my father if he&apos;d had access to them earlier.
            </p>

            <p style={{ fontSize: 17, color: '#bbb', lineHeight: 1.9, marginBottom: 28 }}>
              I dove into the research. I trained with the best. I partnered with board-certified physicians 
              and FDA-registered compounding pharmacies. And I built <strong style={{ color: BRAND.pink }}>REGEN RX</strong> — 
              a telehealth platform that brings real, clinical-grade wellness care directly to patients 
              across Illinois, without the barriers that keep so many people from getting help.
            </p>

            {/* The Mission */}
            <div style={{
              backgroundColor: BRAND.dark,
              borderRadius: 16,
              padding: 24,
              marginBottom: 28,
              borderLeft: `4px solid ${BRAND.pink}`,
            }}>
              <p style={{ fontSize: 18, color: BRAND.cream, lineHeight: 1.8, margin: 0, fontStyle: 'italic' }}>
                &ldquo;I don&apos;t want another family to lose someone they love because 
                healthcare felt too complicated, too expensive, or too inaccessible.&rdquo;
              </p>
            </div>

            <p style={{ fontSize: 17, color: '#bbb', lineHeight: 1.9, marginBottom: 28 }}>
              REGEN RX isn&apos;t just a business to me. It&apos;s a mission. Every patient we help lose weight, 
              balance their hormones, or optimize their metabolic health is a life potentially extended. 
              A parent who gets more time with their kids. A spouse who grows old with their partner. 
              That&apos;s what this is about.
            </p>

            {/* The Promise */}
            <p style={{ fontSize: 17, color: '#bbb', lineHeight: 1.9, marginBottom: 28 }}>
              We&apos;re not a faceless online pharmacy. We&apos;re a real medical practice, with real providers 
              who actually care about your outcomes. When you message us at 2 AM because you&apos;re worried 
              about a side effect, someone answers. When you need your dosing adjusted, we make it happen — fast. 
              Because that&apos;s what my dad deserved, and it&apos;s what you deserve too.
            </p>

            {/* Closing */}
            <p style={{ fontSize: 17, color: '#bbb', lineHeight: 1.9, marginBottom: 28 }}>
              If you&apos;re ready to take control of your health — really take control — I&apos;d be honored 
              to be part of your journey. We&apos;re here for you, not just as providers, but as partners 
              in your transformation.
            </p>

            <p style={{ fontSize: 17, color: '#bbb', lineHeight: 1.9, marginBottom: 8 }}>
              To your health, your longevity, and your best years ahead,
            </p>

            {/* Signature */}
            <div style={{ marginTop: 32 }}>
              <p style={{ 
                fontSize: 28, 
                fontFamily: 'Georgia, serif', 
                fontStyle: 'italic',
                color: BRAND.pink,
                marginBottom: 8,
              }}>
                Danielle
              </p>
              <p style={{ fontSize: 14, color: BRAND.gray, marginBottom: 4 }}>
                <strong style={{ color: BRAND.cream }}>Danielle Alcala</strong>
              </p>
              <p style={{ fontSize: 13, color: BRAND.gray }}>
                Founder, REGEN RX & Hello Gorgeous Med Spa
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Numbers */}
      <section style={{ padding: '60px 24px', backgroundColor: BRAND.darkAlt }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>
            What We&apos;ve Built Together
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
            {[
              { stat: '1,900+', label: 'Five-Star Reviews', sub: 'Hello Gorgeous Med Spa' },
              { stat: '7+ Years', label: 'Serving Illinois', sub: 'Since 2019' },
              { stat: '10,000+', label: 'Patients Treated', sub: 'And counting' },
              { stat: '24/7', label: 'Provider Support', sub: 'Real humans, real care' },
            ].map((item) => (
              <div 
                key={item.label}
                style={{
                  backgroundColor: BRAND.dark,
                  borderRadius: 16,
                  padding: 24,
                  textAlign: 'center',
                  border: `1px solid ${BRAND.teal}20`,
                }}
              >
                <div style={{ fontSize: 36, fontWeight: 800, color: BRAND.teal, marginBottom: 4 }}>
                  {item.stat}
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: BRAND.cream, marginBottom: 4 }}>
                  {item.label}
                </div>
                <div style={{ fontSize: 12, color: BRAND.gray }}>
                  {item.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Promise */}
      <section style={{ padding: '60px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, textAlign: 'center', marginBottom: 32 }}>
            The REGEN RX Promise
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { icon: '💊', promise: 'Real prescriptions from licensed providers — not "research chemicals" or gray-market suppliers.' },
              { icon: '👨‍⚕️', promise: 'A provider who knows your name and actually responds when you reach out.' },
              { icon: '📦', promise: 'Medications from FDA-registered pharmacies, shipped directly to your door.' },
              { icon: '❤️', promise: 'Care that goes beyond a transaction — we\'re invested in your results, not just your payment.' },
              { icon: '🔒', promise: 'Complete privacy and HIPAA-compliant telehealth — your health is nobody\'s business but yours.' },
            ].map((item, i) => (
              <div 
                key={i}
                style={{
                  display: 'flex',
                  gap: 16,
                  alignItems: 'flex-start',
                  padding: 20,
                  backgroundColor: BRAND.darkAlt,
                  borderRadius: 12,
                  border: '1px solid #222',
                }}
              >
                <span style={{ fontSize: 24 }}>{item.icon}</span>
                <p style={{ fontSize: 15, color: '#ccc', margin: 0, lineHeight: 1.6 }}>{item.promise}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 24px', backgroundColor: BRAND.pink }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: '#fff', marginBottom: 16 }}>
            Ready to start your journey?
          </h2>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.8)', marginBottom: 32 }}>
            I&apos;d be honored to be part of your transformation.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/start"
              style={{
                display: 'inline-block',
                padding: '18px 36px',
                backgroundColor: '#fff',
                color: BRAND.pink,
                borderRadius: 12,
                fontSize: 18,
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              Start Your Free Visit
            </Link>
            <Link
              href="/consult"
              style={{
                display: 'inline-block',
                padding: '18px 36px',
                backgroundColor: 'transparent',
                color: '#fff',
                borderRadius: 12,
                fontSize: 18,
                fontWeight: 700,
                textDecoration: 'none',
                border: '2px solid rgba(255,255,255,0.5)',
              }}
            >
              Book a Consultation
            </Link>
          </div>
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
            Individual results vary. Not all patients qualify for treatment.
          </p>
          <p style={{ marginTop: 8, color: '#444' }}>
            © {new Date().getFullYear()} Hello Gorgeous PC. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
