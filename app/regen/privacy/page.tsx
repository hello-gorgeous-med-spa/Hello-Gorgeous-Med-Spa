import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Privacy Policy | REGEN RX',
  description: 'Privacy Policy for REGEN RX telehealth platform. Learn how we collect, use, and protect your personal and health information.',
  openGraph: {
    title: 'Privacy Policy | REGEN RX',
    description: 'Privacy Policy for REGEN RX telehealth platform.',
    url: 'https://tryregenrx.com/privacy',
    siteName: 'REGEN RX',
    images: [
      {
        url: 'https://tryregenrx.com/images/regen/regen-og-privacy.png',
        width: 1200,
        height: 630,
        alt: 'REGEN RX Privacy Policy',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy | REGEN RX',
    description: 'Privacy Policy for REGEN RX telehealth platform.',
    images: ['https://tryregenrx.com/images/regen/regen-og-privacy.png'],
  },
};

const BRAND = {
  teal: '#0D9488',
  tealDark: '#0D5C63',
  pink: '#E91E8C',
  dark: '#0A0A0A',
  darkAlt: '#111111',
  cream: '#FAF9F6',
  gray: '#9CA3AF',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: BRAND.dark }}>
      {/* Navigation */}
      <nav className="border-b px-6 py-4" style={{ borderColor: `${BRAND.teal}20` }}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/regen/logo-full.png" alt="REGEN RX" width={120} height={40} className="h-8 w-auto" />
          </Link>
          <Link href="/" className="text-sm hover:underline" style={{ color: BRAND.gray }}>
            ← Back to Home
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-16 px-6" style={{ background: `linear-gradient(135deg, ${BRAND.dark} 0%, ${BRAND.tealDark} 100%)` }}>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-4" style={{ color: BRAND.cream }}>
            Privacy Policy
          </h1>
          <p className="text-lg" style={{ color: BRAND.gray }}>
            Last Updated: September 3, 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto prose prose-invert prose-lg" style={{ color: BRAND.gray }}>

          <h2 style={{ color: BRAND.cream }}>Introduction</h2>
          <p>
            REGEN RX, operated by Hello Gorgeous Med Spa LLC ("we," "us," or "our"), is committed to protecting your privacy. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our 
            telehealth platform at tryregenrx.com (the "Service").
          </p>
          <p>
            By using the Service, you consent to the practices described in this Privacy Policy. If you do not agree with 
            this policy, please do not use the Service.
          </p>

          <h2 style={{ color: BRAND.cream }}>Information We Collect</h2>
          
          <h3 style={{ color: BRAND.teal }}>Personal Information</h3>
          <p>We may collect the following types of personal information:</p>
          <ul style={{ color: BRAND.gray }}>
            <li><strong>Contact Information:</strong> Name, email address, phone number, mailing address</li>
            <li><strong>Account Information:</strong> Username, password, account preferences</li>
            <li><strong>Payment Information:</strong> Credit card details, billing address (processed securely through Stripe)</li>
            <li><strong>Identification:</strong> Date of birth, government ID (when required for verification)</li>
          </ul>

          <h3 style={{ color: BRAND.teal }}>Health Information</h3>
          <p>To provide telehealth services, we collect health-related information including:</p>
          <ul style={{ color: BRAND.gray }}>
            <li>Medical history and current health conditions</li>
            <li>Current medications and allergies</li>
            <li>Symptoms and health concerns</li>
            <li>Lab results and vital signs</li>
            <li>Information provided during consultations with Providers</li>
          </ul>

          <h3 style={{ color: BRAND.teal }}>Automatically Collected Information</h3>
          <p>When you use our Service, we automatically collect:</p>
          <ul style={{ color: BRAND.gray }}>
            <li>Device information (browser type, operating system)</li>
            <li>IP address and general location</li>
            <li>Usage data (pages visited, time spent, interactions)</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>

          <h2 style={{ color: BRAND.cream }}>How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul style={{ color: BRAND.gray }}>
            <li>Provide and improve our telehealth services</li>
            <li>Connect you with licensed healthcare providers</li>
            <li>Process prescriptions and coordinate with pharmacies</li>
            <li>Process payments and manage subscriptions</li>
            <li>Communicate with you about your care and orders</li>
            <li>Send service-related notifications and updates</li>
            <li>Comply with legal and regulatory requirements</li>
            <li>Protect against fraud and unauthorized access</li>
            <li>Analyze and improve our Service</li>
          </ul>

          <h2 style={{ color: BRAND.cream }}>How We Share Your Information</h2>
          <p>We may share your information with:</p>
          
          <h3 style={{ color: BRAND.teal }}>Healthcare Providers</h3>
          <p>
            We share your health information with the licensed healthcare providers who evaluate and treat you through our 
            platform. This is necessary for them to provide medical care.
          </p>

          <h3 style={{ color: BRAND.teal }}>Pharmacies</h3>
          <p>
            When a prescription is written for you, we share necessary information with our partner pharmacies to fulfill 
            your prescription and ship medications to you.
          </p>

          <h3 style={{ color: BRAND.teal }}>Service Providers</h3>
          <p>
            We work with third-party companies that help us operate our business, including:
          </p>
          <ul style={{ color: BRAND.gray }}>
            <li>Payment processors (Stripe)</li>
            <li>Email and communication providers</li>
            <li>Cloud hosting services</li>
            <li>Analytics providers</li>
          </ul>

          <h3 style={{ color: BRAND.teal }}>Legal Requirements</h3>
          <p>
            We may disclose your information when required by law, court order, or government regulation, or when we believe 
            disclosure is necessary to protect our rights, your safety, or the safety of others.
          </p>

          <h2 style={{ color: BRAND.cream }}>Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your information, including:
          </p>
          <ul style={{ color: BRAND.gray }}>
            <li>Encryption of data in transit and at rest</li>
            <li>Secure authentication and access controls</li>
            <li>Regular security assessments</li>
            <li>Employee training on data protection</li>
          </ul>
          <p>
            However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to 
            protect your information, we cannot guarantee absolute security.
          </p>

          <h2 style={{ color: BRAND.cream }}>Your Rights and Choices</h2>
          <p>You have the right to:</p>
          <ul style={{ color: BRAND.gray }}>
            <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
            <li><strong>Correction:</strong> Request correction of inaccurate information</li>
            <li><strong>Deletion:</strong> Request deletion of your information (subject to legal retention requirements)</li>
            <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
            <li><strong>Data Portability:</strong> Request your data in a portable format</li>
          </ul>
          <p>
            To exercise these rights, please contact us at <a href="mailto:hello@tryregenrx.com" style={{ color: BRAND.teal }}>hello@tryregenrx.com</a>.
          </p>

          <h2 style={{ color: BRAND.cream }}>Cookies and Tracking</h2>
          <p>
            We use cookies and similar technologies to enhance your experience, analyze usage, and deliver personalized content. 
            You can control cookies through your browser settings, though disabling cookies may affect Service functionality.
          </p>

          <h2 style={{ color: BRAND.cream }}>Data Retention</h2>
          <p>
            We retain your information for as long as necessary to provide our services, comply with legal obligations, resolve 
            disputes, and enforce our agreements. Medical records are retained in accordance with applicable healthcare regulations.
          </p>

          <h2 style={{ color: BRAND.cream }}>Children's Privacy</h2>
          <p>
            Our Service is not intended for individuals under 18 years of age. We do not knowingly collect personal information 
            from children. If we become aware that we have collected information from a child, we will take steps to delete it.
          </p>

          <h2 style={{ color: BRAND.cream }}>HIPAA Notice</h2>
          <p>
            REGEN RX is operated by Hello Gorgeous Med Spa LLC, which is not a "covered entity" under HIPAA. However, the 
            healthcare providers and pharmacies you interact with through our platform may be covered entities subject to HIPAA. 
            We take the privacy and security of your health information seriously and implement safeguards consistent with 
            industry best practices.
          </p>

          <h2 style={{ color: BRAND.cream }}>Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated "Last 
            Updated" date. Your continued use of the Service after changes are posted constitutes acceptance of the updated policy.
          </p>

          <h2 style={{ color: BRAND.cream }}>Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy or our data practices, please contact us:
          </p>
          <div className="p-6 rounded-xl" style={{ backgroundColor: BRAND.darkAlt }}>
            <p className="m-0" style={{ color: BRAND.cream }}>
              <strong>REGEN RX</strong><br />
              Hello Gorgeous Med Spa LLC<br />
              Oswego, Illinois<br />
              Phone: <a href="tel:+16306366193" style={{ color: BRAND.teal }}>(630) 636-6193</a><br />
              Email: <a href="mailto:hello@tryregenrx.com" style={{ color: BRAND.teal }}>hello@tryregenrx.com</a>
            </p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center text-sm border-t" style={{ backgroundColor: BRAND.dark, borderColor: `${BRAND.teal}20`, color: BRAND.gray }}>
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-6">
          <Link href="/" style={{ color: BRAND.gray }} className="hover:underline">Home</Link>
          <Link href="/terms" style={{ color: BRAND.gray }} className="hover:underline">Terms of Service</Link>
          <Link href="/contact" style={{ color: BRAND.gray }} className="hover:underline">Contact</Link>
          <a href="tel:+16306366193" style={{ color: BRAND.gray }}>(630) 636-6193</a>
        </div>
        <p className="mt-4">© 2026 REGEN RX by Hello Gorgeous Med Spa LLC. All rights reserved.</p>
      </footer>
    </div>
  );
}
