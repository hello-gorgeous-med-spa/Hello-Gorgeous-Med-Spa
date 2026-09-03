import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Terms of Service | REGEN RX',
  description: 'Terms of Service for REGEN RX telehealth platform. Review our terms and conditions for using our prescription medication services.',
  openGraph: {
    title: 'Terms of Service | REGEN RX',
    description: 'Terms of Service for REGEN RX telehealth platform.',
    url: 'https://tryregenrx.com/terms',
    siteName: 'REGEN RX',
    images: [
      {
        url: 'https://tryregenrx.com/images/regen/regen-og-terms.png',
        width: 1200,
        height: 630,
        alt: 'REGEN RX Terms of Service',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Service | REGEN RX',
    description: 'Terms of Service for REGEN RX telehealth platform.',
    images: ['https://tryregenrx.com/images/regen/regen-og-terms.png'],
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

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="text-lg" style={{ color: BRAND.gray }}>
            Last Updated: September 3, 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto prose prose-invert prose-lg" style={{ color: BRAND.gray }}>
          
          <div className="p-6 rounded-xl mb-8" style={{ backgroundColor: BRAND.darkAlt, border: `1px solid ${BRAND.pink}40` }}>
            <p className="text-sm m-0" style={{ color: BRAND.pink }}>
              <strong>MEDICAL EMERGENCY:</strong> If you have a medical emergency, immediately call your doctor or dial 911. 
              REGEN RX is not appropriate for emergency medical situations.
            </p>
          </div>

          <h2 style={{ color: BRAND.cream }}>Introduction</h2>
          <p>
            REGEN RX is a telehealth platform operated by Hello Gorgeous Med Spa LLC ("REGEN RX," "we," "us," or "our"). 
            We operate the website located at tryregenrx.com (the "Platform"). Your access to and use of the Platform, 
            including its content, products, and services (collectively, the "Service"), are governed by these Terms of Service 
            ("Terms" or "Agreement").
          </p>
          <p>
            Please read this Agreement carefully before using the Service. By accessing or using the Service, you agree to be 
            bound by these Terms. If you do not agree to these Terms, you may not access or use the Service.
          </p>

          <h2 style={{ color: BRAND.cream }}>Acceptance of Terms</h2>
          <p>
            By visiting, accessing, registering with, or using the Service, you are (a) representing and warranting that you 
            meet all eligibility requirements, (b) agreeing to comply with all applicable laws, and (c) agreeing that you will 
            only use the Service for lawful purposes. We reserve the right to modify these Terms at any time. Changes are 
            effective upon posting to the Platform. Your continued use of the Service after changes are posted constitutes 
            acceptance of the modified Terms.
          </p>

          <h2 style={{ color: BRAND.cream }}>Your Relationship with Us</h2>
          <p>
            REGEN RX is a technology platform that connects you with licensed healthcare providers ("Providers") who may 
            prescribe medications and compounding pharmacies ("Pharmacies") that fulfill prescriptions. We are not a medical 
            practice and do not provide medical advice, diagnosis, or treatment.
          </p>
          <p>
            <strong style={{ color: BRAND.cream }}>Important:</strong> By using the Service, you are not establishing a 
            doctor-patient relationship with REGEN RX or Hello Gorgeous Med Spa LLC. Any doctor-patient relationship is 
            established directly between you and the Provider who evaluates and treats you through the Platform.
          </p>
          <p>
            The Providers who offer services through our Platform are independent healthcare professionals. We do not control 
            or influence their medical decisions. Each Provider is solely responsible for the care and treatment they provide to you.
          </p>

          <h2 style={{ color: BRAND.cream }}>Eligibility</h2>
          <p>The Service is available only to individuals who:</p>
          <ul style={{ color: BRAND.gray }}>
            <li>Are located in the State of Illinois</li>
            <li>Are at least eighteen (18) years of age</li>
            <li>Have accepted this Agreement</li>
            <li>Provide truthful, accurate, and complete information</li>
          </ul>
          <p>
            Certain products may have additional eligibility requirements. Not all products or services are available to all users. 
            A Provider will determine whether treatment is appropriate for you based on your health history and current condition.
          </p>

          <h2 style={{ color: BRAND.cream }}>Telehealth Services</h2>
          <p>
            Telehealth involves the delivery of healthcare services using electronic communications and technology. While 
            telehealth offers certain benefits, including convenience and accessibility, there are also limitations. Telehealth 
            services are not a substitute for in-person medical care in all cases.
          </p>
          <p>
            By using the Service, you consent to receiving telehealth services and understand that:
          </p>
          <ul style={{ color: BRAND.gray }}>
            <li>Some conditions may require in-person evaluation and cannot be treated via telehealth</li>
            <li>Technical failures may interrupt or delay services</li>
            <li>Electronic communications may be intercepted despite security measures</li>
            <li>A Provider may determine that telehealth is not appropriate for your condition</li>
          </ul>

          <h2 style={{ color: BRAND.cream }}>Prescription Products</h2>
          <p>
            Certain products available through the Platform require a valid prescription from a licensed healthcare provider. 
            You cannot obtain a prescription product unless:
          </p>
          <ul style={{ color: BRAND.gray }}>
            <li>You have completed a health assessment through the Platform</li>
            <li>A Provider has reviewed your information and determined the product is appropriate for you</li>
            <li>The Provider has written a prescription</li>
          </ul>
          <p>
            <strong style={{ color: BRAND.cream }}>Compounded Medications:</strong> Many products available through REGEN RX 
            are compounded medications prepared by 503A-registered pharmacies. Compounded medications are not FDA-approved. 
            They are prepared based on a Provider's prescription to meet your individual needs.
          </p>

          <h2 style={{ color: BRAND.cream }}>Financial Responsibility</h2>
          <p>
            REGEN RX and our Providers are not enrolled with Medicare, Medicaid, or private insurance plans for the services 
            provided through the Platform. By using the Service, you acknowledge that:
          </p>
          <ul style={{ color: BRAND.gray }}>
            <li>You are choosing to obtain services on a cash-pay basis</li>
            <li>You are solely responsible for all costs associated with services and products</li>
            <li>We will not submit claims to insurance on your behalf</li>
            <li>HSA and FSA payments may be accepted where applicable</li>
          </ul>

          <h2 style={{ color: BRAND.cream }}>Subscription and Payment</h2>
          <p>
            Certain products may be offered on a subscription basis. For subscription products:
          </p>
          <ul style={{ color: BRAND.gray }}>
            <li>Your payment method will be charged automatically at regular intervals</li>
            <li>You may cancel at any time by contacting us</li>
            <li>Cancellations take effect at the end of your current billing period</li>
            <li>No refunds are provided for partial subscription periods</li>
          </ul>
          <p>
            All prices are subject to change. We reserve the right to modify pricing at any time, but changes will not affect 
            orders you have already placed.
          </p>

          <h2 style={{ color: BRAND.cream }}>User Accounts</h2>
          <p>
            You are required to create an account to use certain features of the Service. You agree to:
          </p>
          <ul style={{ color: BRAND.gray }}>
            <li>Provide accurate and complete information</li>
            <li>Keep your login credentials confidential</li>
            <li>Notify us immediately of any unauthorized use of your account</li>
            <li>Accept responsibility for all activities under your account</li>
          </ul>

          <h2 style={{ color: BRAND.cream }}>Privacy</h2>
          <p>
            Your privacy is important to us. Please review our <Link href="/privacy" style={{ color: BRAND.teal }}>Privacy Policy</Link> for 
            information about how we collect, use, and disclose your personal information, including health information.
          </p>

          <h2 style={{ color: BRAND.cream }}>Prohibited Conduct</h2>
          <p>You agree not to:</p>
          <ul style={{ color: BRAND.gray }}>
            <li>Use the Service for any unlawful purpose</li>
            <li>Provide false or misleading information</li>
            <li>Attempt to obtain prescriptions for someone else</li>
            <li>Interfere with or disrupt the Service</li>
            <li>Attempt to access systems or data without authorization</li>
            <li>Use automated tools to access the Service without permission</li>
            <li>Violate any applicable laws or regulations</li>
          </ul>

          <h2 style={{ color: BRAND.cream }}>Disclaimer of Warranties</h2>
          <p>
            THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. 
            TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, 
            FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
          </p>
          <p>
            We do not warrant that the Service will be uninterrupted, error-free, or secure. We do not warrant the accuracy, 
            completeness, or reliability of any content on the Service.
          </p>

          <h2 style={{ color: BRAND.cream }}>Limitation of Liability</h2>
          <p>
            TO THE FULLEST EXTENT PERMITTED BY LAW, REGEN RX, HELLO GORGEOUS MED SPA LLC, AND OUR OFFICERS, DIRECTORS, 
            EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE 
            DAMAGES ARISING OUT OF OR RELATED TO YOUR USE OF THE SERVICE.
          </p>
          <p>
            OUR TOTAL LIABILITY FOR ANY CLAIMS ARISING FROM YOUR USE OF THE SERVICE SHALL NOT EXCEED THE AMOUNT YOU PAID 
            TO US IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.
          </p>

          <h2 style={{ color: BRAND.cream }}>Indemnification</h2>
          <p>
            You agree to indemnify, defend, and hold harmless REGEN RX, Hello Gorgeous Med Spa LLC, and our officers, directors, 
            employees, and agents from any claims, damages, losses, liabilities, and expenses (including attorneys' fees) arising 
            out of or related to your use of the Service or violation of these Terms.
          </p>

          <h2 style={{ color: BRAND.cream }}>Termination</h2>
          <p>
            We may terminate or suspend your access to the Service at any time, for any reason, without notice. Upon termination, 
            your right to use the Service will immediately cease. Provisions of these Terms that by their nature should survive 
            termination shall survive.
          </p>

          <h2 style={{ color: BRAND.cream }}>Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the State of Illinois, without regard 
            to its conflict of law provisions. Any disputes arising from these Terms shall be resolved in the state or federal 
            courts located in Illinois.
          </p>

          <h2 style={{ color: BRAND.cream }}>Contact Information</h2>
          <p>
            If you have any questions about these Terms, please contact us:
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
          <Link href="/privacy" style={{ color: BRAND.gray }} className="hover:underline">Privacy Policy</Link>
          <Link href="/contact" style={{ color: BRAND.gray }} className="hover:underline">Contact</Link>
          <a href="tel:+16306366193" style={{ color: BRAND.gray }}>(630) 636-6193</a>
        </div>
        <p className="mt-4">© 2026 REGEN RX by Hello Gorgeous Med Spa LLC. All rights reserved.</p>
      </footer>
    </div>
  );
}
