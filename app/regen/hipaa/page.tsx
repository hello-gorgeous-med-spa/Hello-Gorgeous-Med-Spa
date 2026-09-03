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

export default function HipaaPage() {
  return (
    <div style={{ backgroundColor: BRAND.dark, minHeight: '100vh', color: '#ccc' }}>
      {/* Header */}
      <header style={{ padding: '20px 24px', borderBottom: '1px solid #222' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/">
            <Image src="/images/regen/logo-full.png" alt="REGEN RX" width={160} height={50} className="h-12 w-auto brightness-110" />
          </Link>
          <nav style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            <Link href="/privacy" style={{ color: '#888', fontSize: 14, textDecoration: 'none' }}>Privacy Policy</Link>
            <Link href="/terms" style={{ color: '#888', fontSize: 14, textDecoration: 'none' }}>Terms</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section style={{
        padding: '60px 24px',
        background: `linear-gradient(135deg, ${BRAND.dark} 0%, #1a1a2e 100%)`,
        borderBottom: '1px solid #222',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 20px',
            backgroundColor: `${BRAND.teal}20`,
            border: `1px solid ${BRAND.teal}`,
            borderRadius: 999,
            fontSize: 14,
            fontWeight: 600,
            color: BRAND.teal,
            marginBottom: 24,
          }}>
            🔒 Privacy & Compliance
          </div>
          
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, marginBottom: 16, color: '#fff' }}>
            Notice of Privacy Practices
          </h1>
          
          <p style={{ fontSize: 16, color: '#888' }}>
            <strong>Effective Date:</strong> September 1, 2026 &nbsp;|&nbsp; <strong>Last Updated:</strong> September 3, 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section style={{ padding: '60px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', fontSize: 15, lineHeight: 1.8 }}>
          
          {/* Important Notice Box */}
          <div style={{
            backgroundColor: `${BRAND.pink}15`,
            border: `2px solid ${BRAND.pink}`,
            borderRadius: 16,
            padding: 24,
            marginBottom: 40,
          }}>
            <h2 style={{ color: BRAND.pink, fontSize: 18, fontWeight: 700, marginBottom: 12 }}>
              ⚠️ Important Notice
            </h2>
            <p style={{ margin: 0, color: '#ccc' }}>
              THIS NOTICE DESCRIBES HOW MEDICAL INFORMATION ABOUT YOU MAY BE USED AND DISCLOSED AND HOW YOU CAN GET ACCESS TO THIS INFORMATION. PLEASE REVIEW IT CAREFULLY.
            </p>
          </div>

          {/* Section 1 */}
          <h2 style={{ color: BRAND.cream, fontSize: 22, fontWeight: 700, marginBottom: 16, marginTop: 40 }}>
            1. Who We Are
          </h2>
          <p>
            REGEN RX is a telehealth platform operated by <strong style={{ color: '#fff' }}>Hello Gorgeous PC</strong>, 
            a professional corporation providing healthcare services in the State of Illinois. Our services are provided 
            by licensed healthcare providers, including nurse practitioners with Full Practice Authority (FPA) and 
            collaborating physicians.
          </p>
          <div style={{ backgroundColor: BRAND.darkAlt, borderRadius: 12, padding: 20, marginTop: 16 }}>
            <p style={{ margin: 0 }}>
              <strong style={{ color: BRAND.teal }}>Privacy Officer Contact:</strong><br />
              Hello Gorgeous PC<br />
              Oswego, Illinois<br />
              Phone: (630) 636-6193<br />
              Email: hello@tryregenrx.com
            </p>
          </div>

          {/* Section 2 */}
          <h2 style={{ color: BRAND.cream, fontSize: 22, fontWeight: 700, marginBottom: 16, marginTop: 40 }}>
            2. Protected Health Information (PHI) We Collect
          </h2>
          <p>We collect the following types of health information:</p>
          <ul style={{ paddingLeft: 24 }}>
            <li><strong style={{ color: '#fff' }}>Identifying Information:</strong> Name, date of birth, address, phone number, email</li>
            <li><strong style={{ color: '#fff' }}>Medical History:</strong> Current medications, allergies, past diagnoses, surgical history</li>
            <li><strong style={{ color: '#fff' }}>Health Questionnaire Responses:</strong> Screening questions for treatment eligibility</li>
            <li><strong style={{ color: '#fff' }}>Treatment Records:</strong> Prescriptions, provider notes, lab results (if applicable)</li>
            <li><strong style={{ color: '#fff' }}>Communication Records:</strong> Messages between you and your care team</li>
            <li><strong style={{ color: '#fff' }}>Payment Information:</strong> Billing records (credit card numbers are processed securely by Stripe and not stored by us)</li>
          </ul>

          {/* Section 3 */}
          <h2 style={{ color: BRAND.cream, fontSize: 22, fontWeight: 700, marginBottom: 16, marginTop: 40 }}>
            3. How We Use and Disclose Your PHI
          </h2>
          <p>We may use and disclose your health information for the following purposes:</p>
          
          <h3 style={{ color: BRAND.teal, fontSize: 17, fontWeight: 600, marginTop: 24 }}>Treatment</h3>
          <p>
            To provide, coordinate, and manage your healthcare. This includes sharing information with pharmacies 
            to fill your prescriptions, consulting with other healthcare providers involved in your care, and 
            communicating with you about your treatment.
          </p>
          
          <h3 style={{ color: BRAND.teal, fontSize: 17, fontWeight: 600, marginTop: 24 }}>Payment</h3>
          <p>
            To obtain payment for services provided to you. This includes billing, claims management, and 
            collection activities.
          </p>
          
          <h3 style={{ color: BRAND.teal, fontSize: 17, fontWeight: 600, marginTop: 24 }}>Healthcare Operations</h3>
          <p>
            To support our business activities, including quality assessment, staff training, compliance programs, 
            audits, and business planning.
          </p>
          
          <h3 style={{ color: BRAND.teal, fontSize: 17, fontWeight: 600, marginTop: 24 }}>As Required by Law</h3>
          <p>
            We will disclose your PHI when required by federal, state, or local law. This includes:
          </p>
          <ul style={{ paddingLeft: 24 }}>
            <li>Court orders and subpoenas</li>
            <li>Public health reporting (communicable diseases, adverse drug events)</li>
            <li>Reports to law enforcement in certain circumstances</li>
            <li>Reports of abuse, neglect, or domestic violence</li>
            <li>Health oversight activities</li>
          </ul>

          <h3 style={{ color: BRAND.teal, fontSize: 17, fontWeight: 600, marginTop: 24 }}>With Your Authorization</h3>
          <p>
            Other uses and disclosures not described in this notice will only be made with your written 
            authorization. You may revoke an authorization at any time by submitting a written request.
          </p>

          {/* Section 4 */}
          <h2 style={{ color: BRAND.cream, fontSize: 22, fontWeight: 700, marginBottom: 16, marginTop: 40 }}>
            4. Your Rights Regarding Your PHI
          </h2>
          <p>You have the following rights concerning your health information:</p>
          
          {/* Authorization Form Link */}
          <div style={{
            backgroundColor: `${BRAND.teal}15`,
            border: `1px solid ${BRAND.teal}30`,
            borderRadius: 12,
            padding: 16,
            marginTop: 16,
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
          }}>
            <div>
              <p style={{ margin: 0, fontWeight: 600, color: BRAND.cream }}>Need to release your records?</p>
              <p style={{ margin: 0, fontSize: 13, color: '#888' }}>Download our HIPAA Authorization Form</p>
            </div>
            <Link 
              href="/forms/authorization"
              style={{
                padding: '10px 20px',
                backgroundColor: BRAND.teal,
                color: '#fff',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Get Form →
            </Link>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
            {[
              { right: 'Right to Access', desc: 'You may request copies of your medical records. We will provide them within 30 days of your request. A reasonable fee may apply.' },
              { right: 'Right to Amend', desc: 'If you believe information in your record is incorrect or incomplete, you may request an amendment. We may deny the request in certain circumstances but will explain why.' },
              { right: 'Right to Restrict', desc: 'You may request restrictions on how we use or disclose your PHI. We are not required to agree to all restrictions, but we will honor your request to restrict disclosure to a health plan if you pay out of pocket in full.' },
              { right: 'Right to Confidential Communications', desc: 'You may request that we communicate with you in a specific way or at a specific location (e.g., a different phone number or address).' },
              { right: 'Right to Accounting of Disclosures', desc: 'You may request a list of certain disclosures we have made of your PHI in the past six years.' },
              { right: 'Right to a Paper Copy', desc: 'You have the right to obtain a paper copy of this Notice upon request.' },
            ].map((item) => (
              <div key={item.right} style={{ backgroundColor: BRAND.darkAlt, borderRadius: 12, padding: 16 }}>
                <h4 style={{ color: BRAND.pink, fontSize: 15, fontWeight: 600, marginBottom: 8 }}>{item.right}</h4>
                <p style={{ margin: 0, fontSize: 14 }}>{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Section 5 */}
          <h2 style={{ color: BRAND.cream, fontSize: 22, fontWeight: 700, marginBottom: 16, marginTop: 40 }}>
            5. Our Responsibilities
          </h2>
          <ul style={{ paddingLeft: 24 }}>
            <li>We are required by law to maintain the privacy and security of your PHI</li>
            <li>We will notify you promptly if a breach occurs that may have compromised your PHI</li>
            <li>We will not use or share your information other than as described here unless you give us written permission</li>
            <li>We will follow the duties and privacy practices described in this notice</li>
          </ul>

          {/* Section 6 */}
          <h2 style={{ color: BRAND.cream, fontSize: 22, fontWeight: 700, marginBottom: 16, marginTop: 40 }}>
            6. How We Protect Your Information
          </h2>
          <p>We implement the following safeguards to protect your PHI:</p>
          <ul style={{ paddingLeft: 24 }}>
            <li><strong style={{ color: '#fff' }}>Administrative Safeguards:</strong> Staff training, access policies, risk assessments</li>
            <li><strong style={{ color: '#fff' }}>Physical Safeguards:</strong> Secure facilities, workstation security</li>
            <li><strong style={{ color: '#fff' }}>Technical Safeguards:</strong> Encryption (TLS 1.3), access controls, audit logs, secure authentication</li>
          </ul>
          <p style={{ marginTop: 16 }}>
            Our telehealth platform uses industry-standard encryption. Patient communications are transmitted 
            securely. We use HIPAA-compliant infrastructure providers including Supabase (database), Vercel (hosting), 
            and Stripe (payments).
          </p>

          {/* Section 7 */}
          <h2 style={{ color: BRAND.cream, fontSize: 22, fontWeight: 700, marginBottom: 16, marginTop: 40 }}>
            7. Business Associates
          </h2>
          <p>
            We work with third-party service providers (&quot;Business Associates&quot;) who may have access to your PHI. 
            These include:
          </p>
          <ul style={{ paddingLeft: 24 }}>
            <li><strong style={{ color: '#fff' }}>Compounding Pharmacy:</strong> To fill your prescriptions (Formulation Rx — our exclusive pharmacy partner)</li>
            <li><strong style={{ color: '#fff' }}>Payment Processors:</strong> To process payments securely (Stripe)</li>
            <li><strong style={{ color: '#fff' }}>Communication Platforms:</strong> For secure messaging and video consultations (Doxy.me)</li>
            <li><strong style={{ color: '#fff' }}>Cloud Service Providers:</strong> For secure data storage</li>
          </ul>
          <p style={{ marginTop: 16 }}>
            We require all Business Associates to sign agreements that obligate them to protect your PHI 
            in accordance with HIPAA requirements.
          </p>

          {/* Section 8 - Data Retention */}
          <h2 style={{ color: BRAND.cream, fontSize: 22, fontWeight: 700, marginBottom: 16, marginTop: 40 }}>
            8. Data Retention
          </h2>
          <p>
            We retain your Protected Health Information for the following periods:
          </p>
          <ul style={{ paddingLeft: 24 }}>
            <li><strong style={{ color: '#fff' }}>Medical Records:</strong> Minimum of 10 years from the date of last treatment, or as required by Illinois law</li>
            <li><strong style={{ color: '#fff' }}>Prescription Records:</strong> Minimum of 5 years as required by pharmacy regulations</li>
            <li><strong style={{ color: '#fff' }}>Billing Records:</strong> 7 years for tax and audit purposes</li>
            <li><strong style={{ color: '#fff' }}>Communication Records:</strong> Duration of treatment relationship plus 6 years</li>
          </ul>
          <p style={{ marginTop: 16 }}>
            After the retention period expires, records are securely destroyed using industry-standard methods 
            (digital shredding, secure deletion). You may request earlier deletion of non-required records, 
            though we may retain information necessary for legal compliance, dispute resolution, or ongoing care.
          </p>

          {/* Section 9 */}
          <h2 style={{ color: BRAND.cream, fontSize: 22, fontWeight: 700, marginBottom: 16, marginTop: 40 }}>
            9. Changes to This Notice
          </h2>
          <p>
            We reserve the right to change this notice and make the new provisions effective for all PHI we 
            maintain. If we make material changes, we will post the revised notice on our website and update 
            the effective date. The current notice is always available at tryregenrx.com/hipaa.
          </p>

          {/* Section 10 */}
          <h2 style={{ color: BRAND.cream, fontSize: 22, fontWeight: 700, marginBottom: 16, marginTop: 40 }}>
            10. Complaints
          </h2>
          <p>
            If you believe your privacy rights have been violated, you may file a complaint with us or with the 
            U.S. Department of Health and Human Services. <strong style={{ color: '#fff' }}>You will not be retaliated 
            against for filing a complaint.</strong>
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16, marginTop: 16 }}>
            <div style={{ backgroundColor: BRAND.darkAlt, borderRadius: 12, padding: 20 }}>
              <h4 style={{ color: BRAND.teal, marginBottom: 8 }}>File with Us:</h4>
              <p style={{ margin: 0, fontSize: 14 }}>
                Privacy Officer<br />
                Hello Gorgeous PC<br />
                Phone: (630) 636-6193<br />
                Email: hello@tryregenrx.com
              </p>
            </div>
            <div style={{ backgroundColor: BRAND.darkAlt, borderRadius: 12, padding: 20 }}>
              <h4 style={{ color: BRAND.teal, marginBottom: 8 }}>File with HHS:</h4>
              <p style={{ margin: 0, fontSize: 14 }}>
                Office for Civil Rights<br />
                U.S. Dept. of Health &amp; Human Services<br />
                <a href="https://www.hhs.gov/hipaa/filing-a-complaint" target="_blank" rel="noopener noreferrer" style={{ color: BRAND.pink }}>
                  hhs.gov/hipaa/filing-a-complaint
                </a>
              </p>
            </div>
          </div>

          {/* Acknowledgment */}
          <div style={{
            backgroundColor: `${BRAND.teal}15`,
            border: `2px solid ${BRAND.teal}`,
            borderRadius: 16,
            padding: 24,
            marginTop: 48,
          }}>
            <h2 style={{ color: BRAND.teal, fontSize: 18, fontWeight: 700, marginBottom: 12 }}>
              Acknowledgment of Receipt
            </h2>
            <p style={{ margin: 0 }}>
              By using REGEN RX services, you acknowledge that you have been provided access to this Notice of 
              Privacy Practices. A copy of this notice is available at any time at{' '}
              <strong style={{ color: '#fff' }}>tryregenrx.com/hipaa</strong> or by calling (630) 636-6193.
            </p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '40px 24px', borderTop: '1px solid #222' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', fontSize: 11, color: '#555', textAlign: 'center' }}>
          <p>REGEN RX · tryregenrx.com · 630-636-6193</p>
          <p style={{ marginTop: 8 }}>
            <Link href="/privacy" style={{ color: '#888', marginRight: 16 }}>Privacy Policy</Link>
            <Link href="/terms" style={{ color: '#888', marginRight: 16 }}>Terms</Link>
            <Link href="/safety" style={{ color: '#888' }}>Safety</Link>
          </p>
          <p style={{ marginTop: 8, color: '#444' }}>
            © {new Date().getFullYear()} Hello Gorgeous PC. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
