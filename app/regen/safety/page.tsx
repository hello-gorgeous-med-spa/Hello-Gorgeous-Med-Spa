'use client';

import Link from 'next/link';
import Image from 'next/image';

const BRAND = {
  teal: '#0D9488',
  pink: '#E91E8C',
  dark: '#0a0a0a',
};

export default function SafetyPage() {
  return (
    <div style={{ backgroundColor: BRAND.dark, minHeight: '100vh', color: '#fff' }}>
      {/* Header */}
      <header style={{ 
        padding: '20px 24px',
        borderBottom: '1px solid #222',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/">
            <Image src="/images/regen/logo-full.png" alt="REGEN RX" width={120} height={40} style={{ height: 32, width: 'auto' }} />
          </Link>
          <nav style={{ display: 'flex', gap: 24 }}>
            <Link href="/pricing" style={{ color: '#888', fontSize: 14, textDecoration: 'none' }}>Pricing</Link>
            <Link href="/providers" style={{ color: '#888', fontSize: 14, textDecoration: 'none' }}>About Us</Link>
            <Link href="/contact" style={{ color: '#888', fontSize: 14, textDecoration: 'none' }}>Contact</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section style={{
        padding: '80px 24px 60px',
        textAlign: 'center',
        background: `linear-gradient(135deg, ${BRAND.dark} 0%, #0d1f1d 50%, ${BRAND.dark} 100%)`,
        borderBottom: '1px solid #222',
      }}>
        <div style={{
          display: 'inline-block',
          padding: '6px 16px',
          backgroundColor: `${BRAND.teal}20`,
          border: `1px solid ${BRAND.teal}`,
          borderRadius: 999,
          fontSize: 12,
          fontWeight: 600,
          color: BRAND.teal,
          marginBottom: 24,
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }}>
          Our Commitment
        </div>
        
        <h1 style={{ 
          fontSize: 'clamp(36px, 6vw, 56px)', 
          fontWeight: 800,
          marginBottom: 20,
          background: `linear-gradient(135deg, #fff 0%, ${BRAND.teal} 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Sourcing & Safety
        </h1>
        
        <p style={{ 
          fontSize: 20, 
          color: '#aaa', 
          maxWidth: 700, 
          margin: '0 auto',
          lineHeight: 1.6,
        }}>
          Clear information. Licensed clinical oversight. Individualized care.
        </p>
      </section>

      {/* Main Content */}
      <main style={{ padding: '60px 24px 80px', maxWidth: 900, margin: '0 auto' }}>
        
        {/* Platform Overview */}
        <section style={{ marginBottom: 48 }}>
          <p style={{ fontSize: 17, color: '#ccc', lineHeight: 1.8 }}>
            <strong style={{ color: '#fff' }}>REGEN RX</strong> is a telehealth platform operated by Hello Gorgeous PC. 
            We facilitate consultations with licensed medical providers and coordinate prescriptions with licensed, 
            FDA-registered compounding pharmacies. REGEN RX does not manufacture or compound medications. 
            Treatment decisions are made by licensed clinicians based on each patient's medical history, 
            current medications, health information, and individual needs. Not all patients qualify for treatment, 
            and completing a consultation does not guarantee that a prescription will be issued.
          </p>
        </section>

        {/* Three Pillars */}
        <section style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: 24,
          marginBottom: 60,
        }}>
          {[
            {
              icon: '🏥',
              title: 'FDA-Registered Pharmacies',
              description: 'Our pharmacy partners are FDA-registered 503A and 503B facilities, subject to oversight by state boards of pharmacy and compliance with strict quality and safety standards.',
            },
            {
              icon: '💊',
              title: 'Personalized Medication',
              description: 'Compounded medications are dispensed pursuant to an individual prescription when the prescribing clinician determines that a compounded preparation is appropriate for the patient.',
            },
            {
              icon: '👤',
              title: 'Patient-Centric Approach',
              description: 'With individual prescriptions, our pharmacy partners tailor each formulation to your provider\'s exact protocol to support greater precision and consistency.',
            },
          ].map((pillar, i) => (
            <div 
              key={i}
              style={{
                backgroundColor: '#1a1a1a',
                borderRadius: 16,
                padding: 24,
                border: '1px solid #333',
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 12 }}>{pillar.icon}</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: BRAND.teal }}>
                {pillar.title}
              </h3>
              <p style={{ fontSize: 14, color: '#aaa', lineHeight: 1.6, margin: 0 }}>
                {pillar.description}
              </p>
            </div>
          ))}
        </section>

        {/* Medical Supervision */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ 
            fontSize: 24, 
            fontWeight: 700, 
            marginBottom: 20,
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}>
            <span style={{ color: BRAND.pink }}>⚕️</span>
            Medical Supervision & Prescription Requirement
          </h2>
          <ul style={{ 
            listStyle: 'none', 
            padding: 0, 
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}>
            {[
              'All treatments at REGEN RX require a medical consultation and prescription to determine eligibility and appropriate dosing.',
              'Self-prescribing, sharing medications, or exceeding recommended dosages can be dangerous and is strongly discouraged.',
              'Not all patients qualify for every treatment. A provider will assess your medical history, lab results, and overall health before recommending any therapy.',
              'Our lead provider, Ryan Kent, FNP-BC, has Full Practice Authority in Illinois and over 10 years of clinical experience.',
            ].map((item, i) => (
              <li key={i} style={{ 
                display: 'flex', 
                gap: 12, 
                fontSize: 15, 
                color: '#ccc',
                lineHeight: 1.6,
              }}>
                <span style={{ color: BRAND.teal, flexShrink: 0 }}>✓</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Potential Risks */}
        <section style={{ 
          marginBottom: 48,
          backgroundColor: '#1a1a1a',
          borderRadius: 16,
          padding: 32,
          border: '1px solid #333',
        }}>
          <h2 style={{ 
            fontSize: 24, 
            fontWeight: 700, 
            marginBottom: 20,
            color: '#fff',
          }}>
            Potential Risks & Side Effects
          </h2>
          <p style={{ fontSize: 15, color: '#aaa', marginBottom: 24 }}>
            While our treatments are medically supervised, all therapies carry potential risks. Common side effects may include:
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              {
                category: 'GLP-1 Weight Loss (Semaglutide/Tirzepatide)',
                effects: 'Nausea, vomiting, diarrhea, constipation, injection site reactions, fatigue. Rare: pancreatitis, gallbladder issues.',
              },
              {
                category: 'Peptide Therapy (BPC-157, Sermorelin, etc.)',
                effects: 'Injection site irritation, fatigue, nausea, appetite changes, mild hormonal fluctuations.',
              },
              {
                category: 'HRT/TRT (Hormone Replacement Therapy)',
                effects: 'Fluid retention, mood swings, acne, libido changes, possible cardiovascular risks (assessed by your provider).',
              },
              {
                category: 'Vitamin Injectables (B12, Glutathione, NAD+)',
                effects: 'Injection site discomfort, mild nausea, dizziness, rare allergic reactions.',
              },
              {
                category: 'Sexual Wellness (Sildenafil, Tadalafil, PT-141)',
                effects: 'Headache, flushing, nasal congestion, dizziness, visual changes. Rare: priapism (seek immediate medical care).',
              },
              {
                category: 'Rx Skincare (Tretinoin, Hydroquinone)',
                effects: 'Skin dryness, peeling, redness, increased sun sensitivity.',
              },
            ].map((item, i) => (
              <div key={i} style={{ 
                backgroundColor: BRAND.dark,
                borderRadius: 8,
                padding: 16,
              }}>
                <h4 style={{ fontSize: 14, fontWeight: 600, color: BRAND.pink, marginBottom: 6 }}>
                  {item.category}
                </h4>
                <p style={{ fontSize: 13, color: '#aaa', margin: 0 }}>
                  {item.effects}
                </p>
              </div>
            ))}
          </div>
          
          <p style={{ 
            fontSize: 14, 
            color: BRAND.teal, 
            marginTop: 24,
            padding: 16,
            backgroundColor: `${BRAND.teal}10`,
            borderRadius: 8,
            border: `1px solid ${BRAND.teal}30`,
          }}>
            <strong>If you experience persistent or severe side effects, contact your REGEN RX provider immediately or seek emergency care.</strong>
          </p>
        </section>

        {/* Restrictions */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ 
            fontSize: 24, 
            fontWeight: 700, 
            marginBottom: 20,
            color: '#fff',
          }}>
            Restrictions & Exclusions
          </h2>
          <p style={{ fontSize: 15, color: '#aaa', marginBottom: 16 }}>
            The following conditions may exclude certain patients from receiving peptide therapy, hormone therapy, 
            GLP-1 medications, or other treatments. Your provider will determine if a treatment is right for you 
            based on a personalized medical assessment:
          </p>
          <ul style={{ 
            listStyle: 'none', 
            padding: 0, 
            margin: 0,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 8,
          }}>
            {[
              'Pregnant or breastfeeding individuals',
              'History of hormone-sensitive cancers',
              'Personal or family history of medullary thyroid carcinoma (for GLP-1)',
              'Multiple Endocrine Neoplasia syndrome type 2 (MEN 2)',
              'Uncontrolled cardiovascular disease',
              'Severe kidney or liver disease',
              'History of pancreatitis (for GLP-1)',
              'Autoimmune conditions requiring evaluation',
            ].map((item, i) => (
              <li key={i} style={{ 
                display: 'flex', 
                gap: 8, 
                fontSize: 14, 
                color: '#ccc',
                padding: '8px 0',
              }}>
                <span style={{ color: '#EF4444' }}>•</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Storage & Handling */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ 
            fontSize: 24, 
            fontWeight: 700, 
            marginBottom: 20,
            color: '#fff',
          }}>
            Storage, Handling & Proper Use
          </h2>
          <ul style={{ 
            listStyle: 'none', 
            padding: 0, 
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}>
            {[
              'Injectable medications requiring refrigeration are shipped in temperature-controlled packaging designed to maintain cold-chain integrity. Upon delivery, store medication as directed by the pharmacy and your provider.',
              'Injectable peptides, GLP-1 medications, and HRT should be stored properly (e.g., refrigerated as directed) to maintain potency.',
              'Always use sterile technique when preparing and administering injections.',
              'DO NOT use any expired, contaminated, or improperly stored medications — contact your provider if you have concerns.',
              'Dispose of used needles and syringes in a proper sharps container.',
            ].map((item, i) => (
              <li key={i} style={{ 
                display: 'flex', 
                gap: 12, 
                fontSize: 15, 
                color: '#ccc',
                lineHeight: 1.6,
              }}>
                <span style={{ color: BRAND.teal, flexShrink: 0 }}>✓</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Disclaimers */}
        <section style={{ 
          marginBottom: 48,
          backgroundColor: '#111',
          borderRadius: 16,
          padding: 32,
          border: '1px solid #222',
        }}>
          <h2 style={{ 
            fontSize: 20, 
            fontWeight: 700, 
            marginBottom: 16,
            color: BRAND.teal,
          }}>
            General Disclaimer
          </h2>
          <p style={{ fontSize: 14, color: '#999', lineHeight: 1.7, marginBottom: 24 }}>
            The information on this website is for educational and informational purposes only and is not a substitute 
            for professional medical advice. Always follow your REGEN RX provider's specific instructions and do not 
            self-adjust dosages without consultation. Peptides, HRT, TRT, GLP-1 medications, and other treatments are 
            not FDA-approved for all uses and may be prescribed off-label based on clinical research and practitioner 
            expertise. Individual results may vary, and REGEN RX does not guarantee specific outcomes from any treatment.
          </p>
          
          <h2 style={{ 
            fontSize: 20, 
            fontWeight: 700, 
            marginBottom: 16,
            color: BRAND.teal,
          }}>
            Transparency & Acknowledgement
          </h2>
          <p style={{ fontSize: 14, color: '#999', lineHeight: 1.7 }}>
            REGEN RX is dedicated to transparency, quality, and patient safety in every treatment we offer. We take a 
            science-backed, medical-first approach to ensure our therapies are safe, effective, and tailored to your 
            unique needs. If you have any questions or concerns about your treatment, please consult your REGEN RX 
            provider before making any decisions. By proceeding with any treatment at REGEN RX, you acknowledge that 
            you have reviewed this safety information and understand the potential risks and benefits.
          </p>
        </section>

        {/* CTA */}
        <section style={{ 
          textAlign: 'center',
          padding: 40,
          backgroundColor: `linear-gradient(135deg, ${BRAND.teal}10 0%, ${BRAND.pink}10 100%)`,
          borderRadius: 16,
          border: `1px solid ${BRAND.teal}30`,
        }}>
          <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>
            Questions About Your Treatment?
          </h3>
          <p style={{ fontSize: 16, color: '#888', marginBottom: 24 }}>
            Our team is here to help. Reach out anytime.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/contact"
              style={{
                padding: '14px 28px',
                backgroundColor: BRAND.teal,
                color: '#fff',
                borderRadius: 12,
                textDecoration: 'none',
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              Contact Us
            </Link>
            <a
              href="tel:6306366193"
              style={{
                padding: '14px 28px',
                backgroundColor: '#333',
                color: '#fff',
                borderRadius: 12,
                textDecoration: 'none',
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              Call 630-636-6193
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ 
        padding: '40px 24px',
        borderTop: '1px solid #222',
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto', fontSize: 11, color: '#555', textAlign: 'center' }}>
          <p>REGEN RX · tryregenrx.com · 630-636-6193</p>
          <p style={{ marginTop: 8 }}>
            <Link href="/safety" style={{ color: '#888', marginRight: 16 }}>Safety</Link>
            <Link href="/terms" style={{ color: '#888', marginRight: 16 }}>Terms</Link>
            <Link href="/privacy" style={{ color: '#888', marginRight: 16 }}>Privacy</Link>
            <Link href="/providers" style={{ color: '#888' }}>Our Team</Link>
          </p>
          <p style={{ marginTop: 16, color: '#444', lineHeight: 1.6 }}>
            <strong>DISCLAIMER:</strong> The information on this website is for educational purposes only and is not intended as medical advice. 
            Compounded medications are not FDA-approved but are prepared by FDA-registered pharmacies. 
            Treatments may be prescribed off-label. Individual results vary. Not all patients qualify. 
            Completing an intake does not guarantee a prescription.
          </p>
          <p style={{ marginTop: 8, color: '#444' }}>
            © {new Date().getFullYear()} Hello Gorgeous PC. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
