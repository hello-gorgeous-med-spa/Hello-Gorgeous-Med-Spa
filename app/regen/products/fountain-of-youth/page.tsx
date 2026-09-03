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

const BENEFITS = [
  'Supports cellular longevity through telomerase activation',
  'Stimulates collagen and elastin production for firmer, more hydrated skin',
  'Promotes deeper, more restorative sleep via melatonin regulation',
  'Strengthens DNA repair at the cellular level',
  'Supports wound healing with antioxidant and anti-inflammatory effects',
  'Improved immune function and stress response',
  'Regulates pineal gland function and circadian rhythm',
  'Promotes tissue regeneration and repair',
];

const FAQS = [
  {
    q: 'What is Fountain of Youth?',
    a: 'Fountain of Youth is a physician-prescribed anti-aging peptide protocol combining Epitalon and GHK-Cu. Epitalon targets cellular longevity through telomerase activation and pineal gland regulation; GHK-Cu drives skin regeneration, collagen synthesis, and tissue-level repair. The protocol is administered as subcutaneous injections over a 5 or 10-week program.',
  },
  {
    q: 'How does Epitalon support anti-aging?',
    a: 'Epitalon activates telomerase, the enzyme that maintains telomere length at the ends of chromosomes. Telomeres shorten with each cell division — their erosion is one of the primary mechanisms underlying cellular aging. By supporting telomerase activity, Epitalon helps preserve the cell\'s replicative capacity. It also regulates melatonin production, supporting circadian rhythm and antioxidant protection.',
  },
  {
    q: 'What makes GHK-Cu effective for skin rejuvenation?',
    a: 'GHK-Cu is a naturally occurring copper peptide that signals tissue repair. It stimulates production of collagen, elastin, and glycosaminoglycans — the structural proteins that give skin firmness, elasticity, and hydration. It also activates immune cells, promotes blood vessel growth for healing, and provides antioxidant protection against UV damage and environmental stress.',
  },
  {
    q: 'What results can I expect and when?',
    a: 'Sleep quality and circadian improvements from Epitalon are often noticed within 2-4 weeks. Skin changes from GHK-Cu\'s collagen stimulation are more gradual — most patients see improvements in texture, hydration, and firmness between weeks 4-8. The most comprehensive results are typically observed at completion of a 10-week program, with continued improvements as collagen synthesis builds.',
  },
  {
    q: 'How is it administered?',
    a: 'Fountain of Youth is administered as a subcutaneous (SubQ) injection using a 30G or 31G insulin syringe. The standard protocol is 5 mornings per week (Monday-Friday). Your REGEN RX provider will determine your optimal dosing based on your goals and response.',
  },
  {
    q: 'Is this safe?',
    a: 'Peptides like Epitalon and GHK-Cu have been studied for decades with generally favorable safety profiles. Common side effects may include mild injection site irritation or fatigue. As with any treatment, your provider will review your medical history and monitor your response. These compounds are not FDA-approved medications but are prepared by FDA-registered compounding pharmacies.',
  },
];

export default function FountainOfYouthPage() {
  return (
    <div style={{ backgroundColor: BRAND.dark, minHeight: '100vh', color: '#fff' }}>
      {/* Header */}
      <header style={{ padding: '20px 24px', borderBottom: '1px solid #222' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/">
            <Image src="/images/regen/logo-full.png" alt="REGEN RX" width={120} height={40} style={{ height: 32, width: 'auto' }} />
          </Link>
          <nav style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            <Link href="/products" style={{ color: '#888', fontSize: 14, textDecoration: 'none' }}>Products</Link>
            <Link href="/pricing" style={{ color: '#888', fontSize: 14, textDecoration: 'none' }}>Pricing</Link>
            <Link href="/learn" style={{ color: '#888', fontSize: 14, textDecoration: 'none' }}>Learn</Link>
            <Link
              href="/start?goal=skincare"
              style={{ padding: '10px 20px', backgroundColor: BRAND.pink, color: '#fff', borderRadius: 999, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section style={{
        padding: '80px 24px',
        background: `linear-gradient(135deg, ${BRAND.dark} 0%, #0d1f1d 50%, ${BRAND.dark} 100%)`,
        borderBottom: '1px solid #222',
      }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Link href="/products" style={{ color: BRAND.gray, fontSize: 14, textDecoration: 'none' }}>Products</Link>
            <span style={{ color: '#444' }}>/</span>
            <span style={{ color: BRAND.teal, fontSize: 14 }}>Anti-Aging</span>
          </div>
          
          <div style={{
            display: 'inline-block',
            padding: '6px 16px',
            backgroundColor: `${BRAND.pink}20`,
            border: `1px solid ${BRAND.pink}`,
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 600,
            color: BRAND.pink,
            marginBottom: 20,
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}>
            Peptide Protocol
          </div>
          
          <h1 style={{ 
            fontSize: 'clamp(40px, 7vw, 64px)', 
            fontWeight: 800,
            marginBottom: 16,
            lineHeight: 1.1,
          }}>
            Fountain of Youth
          </h1>
          
          <p style={{ 
            fontSize: 24, 
            fontWeight: 500,
            color: BRAND.teal,
            marginBottom: 24,
          }}>
            Rejuvenate youth & renew skin health
          </p>
          
          <p style={{ 
            fontSize: 18, 
            color: '#aaa', 
            maxWidth: 700, 
            lineHeight: 1.7,
            marginBottom: 32,
          }}>
            An advanced blend of <strong style={{ color: '#fff' }}>Epitalon</strong> and <strong style={{ color: '#fff' }}>GHK-Cu</strong> — 
            two peptides that address longevity and skin regeneration through complementary biological mechanisms. 
            Epitalon supports cellular longevity through telomerase activation while GHK-Cu drives collagen synthesis, 
            wound healing, and antioxidant protection.
          </p>

          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 40 }}>
            <Link
              href="/start?goal=skincare&program=fountain-of-youth"
              style={{
                padding: '16px 32px',
                backgroundColor: BRAND.pink,
                color: '#fff',
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              Start Your Protocol
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/consult"
              style={{
                padding: '16px 32px',
                backgroundColor: 'transparent',
                color: BRAND.teal,
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 600,
                textDecoration: 'none',
                border: `2px solid ${BRAND.teal}`,
              }}
            >
              Speak with a Provider
            </Link>
          </div>

          {/* Quick Stats */}
          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
            {[
              { label: 'Protocol', value: '5-10 weeks' },
              { label: 'Frequency', value: '5x per week' },
              { label: 'Administration', value: 'SubQ injection' },
              { label: 'Starting at', value: '$349/mo' },
            ].map((stat) => (
              <div key={stat.label}>
                <div style={{ fontSize: 12, color: '#666', textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: BRAND.cream }}>{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits & Ingredients Grid */}
      <section style={{ padding: '80px 24px', backgroundColor: BRAND.darkAlt }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40 }}>
          
          {/* Benefits */}
          <div>
            <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24, color: BRAND.cream }}>
              Benefits
            </h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {BENEFITS.map((benefit, i) => (
                <li key={i} style={{ 
                  display: 'flex', 
                  gap: 12, 
                  padding: '12px 0',
                  borderBottom: '1px solid #222',
                  fontSize: 15,
                  color: '#ccc',
                }}>
                  <span style={{ color: BRAND.teal, flexShrink: 0 }}>✓</span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          {/* Ingredients & Regimen */}
          <div>
            <div style={{ 
              backgroundColor: BRAND.dark, 
              borderRadius: 16, 
              padding: 24,
              border: `1px solid ${BRAND.teal}30`,
              marginBottom: 24,
            }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: BRAND.teal }}>
                Ingredients
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ 
                  padding: 16, 
                  backgroundColor: '#1a1a1a', 
                  borderRadius: 8,
                }}>
                  <div style={{ fontWeight: 600, color: '#fff', marginBottom: 4 }}>Epitalon</div>
                  <div style={{ fontSize: 13, color: '#888' }}>Telomerase-activating tetrapeptide for cellular longevity</div>
                </div>
                <div style={{ 
                  padding: 16, 
                  backgroundColor: '#1a1a1a', 
                  borderRadius: 8,
                }}>
                  <div style={{ fontWeight: 600, color: '#fff', marginBottom: 4 }}>GHK-Cu</div>
                  <div style={{ fontSize: 13, color: '#888' }}>Copper tripeptide for collagen synthesis & skin repair</div>
                </div>
              </div>
            </div>

            <div style={{ 
              backgroundColor: BRAND.dark, 
              borderRadius: 16, 
              padding: 24,
              border: `1px solid ${BRAND.pink}30`,
            }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: BRAND.pink }}>
                Regimen
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 15, color: '#ccc' }}>
                <li style={{ padding: '8px 0', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Administration</span>
                  <span style={{ color: '#fff', fontWeight: 500 }}>SubQ injection</span>
                </li>
                <li style={{ padding: '8px 0', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #222' }}>
                  <span>Frequency</span>
                  <span style={{ color: '#fff', fontWeight: 500 }}>Mon–Fri (AM)</span>
                </li>
                <li style={{ padding: '8px 0', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #222' }}>
                  <span>Duration</span>
                  <span style={{ color: '#fff', fontWeight: 500 }}>5 or 10 weeks</span>
                </li>
                <li style={{ padding: '8px 0', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #222' }}>
                  <span>Needle</span>
                  <span style={{ color: '#fff', fontWeight: 500 }}>30G/31G syringe</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '80px 24px', backgroundColor: BRAND.dark }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 32, textAlign: 'center' }}>
            How Fountain of Youth Works
          </h2>
          
          <div style={{ fontSize: 16, color: '#bbb', lineHeight: 1.8 }}>
            <p style={{ marginBottom: 24 }}>
              Fountain of Youth targets the biology of aging from two distinct directions: 
              <strong style={{ color: '#fff' }}> Epitalon</strong> works at the chromosomal and pineal level to support 
              the mechanisms governing how cells age, while <strong style={{ color: '#fff' }}>GHK-Cu</strong> works at 
              the tissue level to stimulate repair, regeneration, and structural renewal in skin and connective tissue.
            </p>
            
            <div style={{ 
              backgroundColor: BRAND.darkAlt, 
              borderRadius: 16, 
              padding: 24, 
              marginBottom: 24,
              borderLeft: `4px solid ${BRAND.teal}`,
            }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: BRAND.teal, marginBottom: 12 }}>Epitalon</h3>
              <p style={{ margin: 0 }}>
                A synthetic tetrapeptide derived from the pineal gland. Its primary mechanism centers on 
                <strong style={{ color: '#fff' }}> telomerase activation</strong>. Telomeres are the protective caps 
                at the ends of chromosomes that shorten with each cell division; as they erode, cellular function 
                declines and visible signs of aging accumulate. Epitalon activates telomerase — the enzyme responsible 
                for maintaining telomere length — supporting the cell's ability to replicate accurately and sustain 
                function over time. It also regulates the pineal gland's production of melatonin, supporting circadian 
                rhythm, sleep quality, and antioxidant defense.
              </p>
            </div>
            
            <div style={{ 
              backgroundColor: BRAND.darkAlt, 
              borderRadius: 16, 
              padding: 24,
              borderLeft: `4px solid ${BRAND.pink}`,
            }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: BRAND.pink, marginBottom: 12 }}>GHK-Cu</h3>
              <p style={{ margin: 0 }}>
                A naturally occurring copper peptide present in human plasma that plays a central role in wound healing 
                and skin regeneration. It stimulates production of <strong style={{ color: '#fff' }}>collagen, elastin, 
                and glycosaminoglycans</strong> — the structural proteins and compounds that give skin its firmness, 
                elasticity, and hydration. GHK-Cu also activates immune cells at wound sites, promotes new blood vessel 
                growth (angiogenesis), and provides antioxidant and anti-inflammatory activity that protects skin cells 
                from UV damage and environmental oxidative stress. It also supports DNA repair processes in skin cells.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What This Means For You */}
      <section style={{ padding: '80px 24px', backgroundColor: BRAND.teal }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#fff', marginBottom: 32 }}>
            What This Means For You
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: 16,
          }}>
            {[
              'Activates telomerase to support cellular longevity',
              'Stimulates collagen & elastin for firmer skin',
              'Regulates circadian rhythm for better sleep',
              'Promotes wound healing & tissue repair',
              'Antioxidant protection for skin cells',
              'Strengthens DNA repair mechanisms',
              'Bolsters immune function',
              'Deeper, more restorative rest',
            ].map((item, i) => (
              <div 
                key={i}
                style={{
                  padding: '16px 20px',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 500,
                  color: '#fff',
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section style={{ padding: '80px 24px', backgroundColor: BRAND.dark }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 40, textAlign: 'center' }}>
            Frequently Asked Questions
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {FAQS.map((faq, i) => (
              <div 
                key={i}
                style={{
                  backgroundColor: BRAND.darkAlt,
                  borderRadius: 12,
                  padding: 24,
                  border: '1px solid #222',
                }}
              >
                <h3 style={{ fontSize: 17, fontWeight: 600, color: BRAND.teal, marginBottom: 12 }}>
                  {faq.q}
                </h3>
                <p style={{ fontSize: 15, color: '#aaa', lineHeight: 1.7, margin: 0 }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How To Get Started */}
      <section style={{ padding: '80px 24px', backgroundColor: BRAND.darkAlt }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 40 }}>
            How to Get Started
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24 }}>
            {[
              {
                step: '1',
                title: 'Online Consultation',
                desc: 'Complete a quick online visit to explore your goals and medical history.',
              },
              {
                step: '2',
                title: 'Provider Evaluation',
                desc: 'A licensed provider reviews your information and creates a personalized protocol.',
              },
              {
                step: '3',
                title: 'Delivered to You',
                desc: 'Your prescription is sent to an FDA-registered pharmacy and shipped directly to your door.',
              },
            ].map((item) => (
              <div key={item.step} style={{ textAlign: 'center' }}>
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  backgroundColor: BRAND.pink,
                  color: '#fff',
                  fontSize: 24,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}>
                  {item.step}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>{item.title}</h3>
                <p style={{ fontSize: 14, color: '#888', margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 24px', backgroundColor: BRAND.pink }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: '#fff', marginBottom: 16 }}>
            Ready to turn back the clock?
          </h2>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.8)', marginBottom: 32 }}>
            Start your free online visit today. Our providers will determine if Fountain of Youth is right for you.
          </p>
          <Link
            href="/start?goal=skincare&program=fountain-of-youth"
            style={{
              display: 'inline-block',
              padding: '18px 40px',
              backgroundColor: '#fff',
              color: BRAND.pink,
              borderRadius: 12,
              fontSize: 18,
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
            <Link href="/products" style={{ color: '#888', marginRight: 16 }}>Products</Link>
            <Link href="/safety" style={{ color: '#888', marginRight: 16 }}>Safety</Link>
            <Link href="/terms" style={{ color: '#888', marginRight: 16 }}>Terms</Link>
            <Link href="/privacy" style={{ color: '#888' }}>Privacy</Link>
          </p>
          <p style={{ marginTop: 16, color: '#444', lineHeight: 1.6 }}>
            <strong>DISCLAIMER:</strong> The information on this website is for educational purposes only and is not intended as medical advice. 
            Compounded medications are not FDA-approved but are prepared by FDA-registered pharmacies. 
            Treatments may be prescribed off-label. Individual results vary. Not all patients qualify.
          </p>
          <p style={{ marginTop: 8, color: '#444' }}>
            © {new Date().getFullYear()} Hello Gorgeous PC. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
