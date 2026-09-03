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

export default function AuthorizationFormPage() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ backgroundColor: BRAND.dark, minHeight: '100vh' }}>
      {/* Header - Hidden on print */}
      <header className="print:hidden" style={{ padding: '20px 24px', borderBottom: '1px solid #222' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/">
            <Image src="/images/regen/logo-full.png" alt="REGEN RX" width={160} height={50} className="h-12 w-auto brightness-110" />
          </Link>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <button
              onClick={handlePrint}
              style={{
                padding: '10px 24px',
                backgroundColor: BRAND.teal,
                color: '#fff',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print / Download PDF
            </button>
            <Link href="/hipaa" style={{ color: '#888', fontSize: 14 }}>HIPAA Notice</Link>
          </div>
        </div>
      </header>

      {/* Instructions - Hidden on print */}
      <section className="print:hidden" style={{ padding: '40px 24px', backgroundColor: BRAND.darkAlt }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#fff', marginBottom: 16 }}>
            Authorization for Release of Protected Health Information
          </h1>
          <p style={{ color: '#888', marginBottom: 24 }}>
            Use this form to authorize REGEN RX to release your medical records to a third party 
            (another doctor, insurance company, attorney, family member, etc.)
          </p>
          <div style={{ 
            display: 'inline-flex', 
            gap: 24, 
            padding: '16px 24px', 
            backgroundColor: `${BRAND.teal}15`, 
            borderRadius: 12,
            border: `1px solid ${BRAND.teal}30`,
          }}>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 12, color: BRAND.teal, marginBottom: 4 }}>Step 1</div>
              <div style={{ fontSize: 14, color: '#ccc' }}>Print this form</div>
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 12, color: BRAND.teal, marginBottom: 4 }}>Step 2</div>
              <div style={{ fontSize: 14, color: '#ccc' }}>Fill out completely</div>
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 12, color: BRAND.teal, marginBottom: 4 }}>Step 3</div>
              <div style={{ fontSize: 14, color: '#ccc' }}>Email or mail to us</div>
            </div>
          </div>
        </div>
      </section>

      {/* Printable Form */}
      <section style={{ padding: '40px 24px' }}>
        <div 
          className="print:shadow-none print:p-0"
          style={{ 
            maxWidth: 800, 
            margin: '0 auto', 
            backgroundColor: '#fff', 
            color: '#000',
            padding: 48,
            borderRadius: 8,
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          }}
        >
          {/* Form Header */}
          <div style={{ textAlign: 'center', marginBottom: 32, borderBottom: '2px solid #000', paddingBottom: 24 }}>
            <h1 style={{ fontSize: 14, fontWeight: 700, letterSpacing: '2px', marginBottom: 8 }}>
              REGEN RX — A HELLO GORGEOUS PC TELEHEALTH PLATFORM
            </h1>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
              AUTHORIZATION FOR RELEASE OF
            </h2>
            <h2 style={{ fontSize: 22, fontWeight: 700 }}>
              PROTECTED HEALTH INFORMATION
            </h2>
            <p style={{ fontSize: 11, color: '#666', marginTop: 8 }}>
              HIPAA-Compliant Release Form
            </p>
          </div>

          {/* Section 1: Patient Information */}
          <div style={{ marginBottom: 28 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, backgroundColor: '#f0f0f0', padding: '8px 12px', marginBottom: 16 }}>
              SECTION 1: PATIENT INFORMATION
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>Patient Full Legal Name:</label>
                <div style={{ borderBottom: '1px solid #000', height: 28 }}></div>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>Date of Birth:</label>
                <div style={{ borderBottom: '1px solid #000', height: 28 }}></div>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>Address:</label>
                <div style={{ borderBottom: '1px solid #000', height: 28 }}></div>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>Phone Number:</label>
                <div style={{ borderBottom: '1px solid #000', height: 28 }}></div>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>Email Address:</label>
                <div style={{ borderBottom: '1px solid #000', height: 28 }}></div>
              </div>
            </div>
          </div>

          {/* Section 2: Release TO */}
          <div style={{ marginBottom: 28 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, backgroundColor: '#f0f0f0', padding: '8px 12px', marginBottom: 16 }}>
              SECTION 2: RELEASE INFORMATION TO (RECIPIENT)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>Name / Organization:</label>
                <div style={{ borderBottom: '1px solid #000', height: 28 }}></div>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>Phone / Fax:</label>
                <div style={{ borderBottom: '1px solid #000', height: 28 }}></div>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>Address:</label>
                <div style={{ borderBottom: '1px solid #000', height: 28 }}></div>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>Email (if electronic delivery authorized):</label>
                <div style={{ borderBottom: '1px solid #000', height: 28 }}></div>
              </div>
            </div>
          </div>

          {/* Section 3: Information to Release */}
          <div style={{ marginBottom: 28 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, backgroundColor: '#f0f0f0', padding: '8px 12px', marginBottom: 16 }}>
              SECTION 3: INFORMATION TO BE RELEASED (Check all that apply)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                'Complete Medical Records',
                'Office/Visit Notes',
                'Prescription History',
                'Lab Results',
                'Treatment Plans',
                'Billing Records',
                'Immunization Records',
                'Mental Health Records',
                'Substance Abuse Records',
                'HIV/AIDS-Related Information',
              ].map((item) => (
                <label key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                  <span style={{ width: 14, height: 14, border: '1px solid #000', display: 'inline-block' }}></span>
                  {item}
                </label>
              ))}
            </div>
            <div style={{ marginTop: 16 }}>
              <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>Other (specify):</label>
              <div style={{ borderBottom: '1px solid #000', height: 28 }}></div>
            </div>
            <div style={{ marginTop: 16 }}>
              <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>Date Range of Records (if applicable):</label>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <span style={{ fontSize: 12 }}>From:</span>
                <div style={{ borderBottom: '1px solid #000', width: 150, height: 24 }}></div>
                <span style={{ fontSize: 12 }}>To:</span>
                <div style={{ borderBottom: '1px solid #000', width: 150, height: 24 }}></div>
              </div>
            </div>
          </div>

          {/* Section 4: Purpose */}
          <div style={{ marginBottom: 28 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, backgroundColor: '#f0f0f0', padding: '8px 12px', marginBottom: 16 }}>
              SECTION 4: PURPOSE OF DISCLOSURE
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                'Continuity of Care / Treatment',
                'Insurance / Benefits',
                'Legal Proceedings',
                'Personal Use',
                'Second Opinion',
                'Other (specify below)',
              ].map((item) => (
                <label key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                  <span style={{ width: 14, height: 14, border: '1px solid #000', display: 'inline-block' }}></span>
                  {item}
                </label>
              ))}
            </div>
            <div style={{ marginTop: 12 }}>
              <div style={{ borderBottom: '1px solid #000', height: 28 }}></div>
            </div>
          </div>

          {/* Section 5: Expiration */}
          <div style={{ marginBottom: 28 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, backgroundColor: '#f0f0f0', padding: '8px 12px', marginBottom: 16 }}>
              SECTION 5: EXPIRATION
            </h3>
            <p style={{ fontSize: 11, marginBottom: 12 }}>
              This authorization will expire (check one):
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                <span style={{ width: 14, height: 14, border: '1px solid #000', display: 'inline-block' }}></span>
                On this date: _______________________
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                <span style={{ width: 14, height: 14, border: '1px solid #000', display: 'inline-block' }}></span>
                Upon completion of the purpose stated above
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                <span style={{ width: 14, height: 14, border: '1px solid #000', display: 'inline-block' }}></span>
                One (1) year from the date of signature
              </label>
            </div>
          </div>

          {/* Section 6: Patient Rights */}
          <div style={{ marginBottom: 28 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, backgroundColor: '#f0f0f0', padding: '8px 12px', marginBottom: 16 }}>
              SECTION 6: PATIENT RIGHTS & ACKNOWLEDGMENTS
            </h3>
            <div style={{ fontSize: 11, lineHeight: 1.7 }}>
              <p style={{ marginBottom: 8 }}>By signing this authorization, I understand and agree that:</p>
              <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
                <li>I have the right to revoke this authorization at any time by submitting a written request to REGEN RX, except to the extent that action has already been taken in reliance on this authorization.</li>
                <li>I understand that my treatment, payment, enrollment, or eligibility for benefits will NOT be conditioned on signing this authorization.</li>
                <li>Information disclosed pursuant to this authorization may be re-disclosed by the recipient and may no longer be protected by federal privacy regulations.</li>
                <li>I understand that REGEN RX may charge a reasonable fee for copying and mailing records.</li>
                <li>I am entitled to receive a copy of this authorization upon request.</li>
                <li>This authorization is voluntary and I may refuse to sign it.</li>
              </ul>
            </div>
          </div>

          {/* Section 7: Signatures */}
          <div style={{ marginBottom: 28 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, backgroundColor: '#f0f0f0', padding: '8px 12px', marginBottom: 16 }}>
              SECTION 7: SIGNATURE
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>Patient Signature (or Legal Representative):</label>
                <div style={{ borderBottom: '1px solid #000', height: 40 }}></div>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>Date:</label>
                <div style={{ borderBottom: '1px solid #000', height: 40 }}></div>
              </div>
            </div>
            <div style={{ marginTop: 16 }}>
              <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>
                If signed by Legal Representative, state relationship to patient and authority to act:
              </label>
              <div style={{ borderBottom: '1px solid #000', height: 28 }}></div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ borderTop: '2px solid #000', paddingTop: 16, marginTop: 32, fontSize: 10, color: '#666' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <strong>Submit completed form to:</strong><br />
                REGEN RX / Hello Gorgeous PC<br />
                Email: hello@tryregenrx.com<br />
                Phone: (630) 636-6193<br />
                Fax: (630) 636-6194
              </div>
              <div style={{ textAlign: 'right' }}>
                <strong>Questions?</strong><br />
                Visit: tryregenrx.com/hipaa<br />
                Call: (630) 636-6193
              </div>
            </div>
            <p style={{ marginTop: 16, textAlign: 'center', fontSize: 9 }}>
              REGEN RX — Authorization for Release of PHI — Form Version 2026.09
            </p>
          </div>
        </div>
      </section>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:p-0 {
            padding: 24px !important;
          }
          section {
            padding: 0 !important;
          }
        }
      `}</style>

      {/* Footer - Hidden on print */}
      <footer className="print:hidden" style={{ padding: '40px 24px', borderTop: '1px solid #222' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', fontSize: 11, color: '#555', textAlign: 'center' }}>
          <p>REGEN RX · tryregenrx.com · 630-636-6193</p>
          <p style={{ marginTop: 8 }}>
            <Link href="/hipaa" style={{ color: '#888', marginRight: 16 }}>HIPAA Notice</Link>
            <Link href="/privacy" style={{ color: '#888', marginRight: 16 }}>Privacy</Link>
            <Link href="/terms" style={{ color: '#888' }}>Terms</Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
