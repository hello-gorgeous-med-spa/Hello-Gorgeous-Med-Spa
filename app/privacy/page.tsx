import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | Hello Gorgeous Med Spa',
  description: 'Privacy policy and HIPAA notice for Hello Gorgeous Med Spa',
};

export default function PrivacyPolicyPage() {
  const lastUpdated = 'January 30, 2026';

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-pink-500 to-rose-500 text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/" className="text-pink-100 hover:text-white mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold">Privacy Policy</h1>
          <p className="text-pink-100 mt-2">Last Updated: {lastUpdated}</p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-12 prose prose-pink max-w-none">
        
        {/* HIPAA Notice Banner */}
        <div id="hipaa" className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8 not-prose scroll-mt-24">
          <h3 className="text-blue-900 font-bold text-lg mb-2">📋 HIPAA Notice</h3>
          <p className="text-blue-800 text-sm mb-0">
            Hello Gorgeous Med Spa is a covered entity under the Health Insurance Portability and 
            Accountability Act (HIPAA). We are committed to protecting your Protected Health Information (PHI) 
            in accordance with federal and state law.
          </p>
        </div>

        <section className="mb-8">
          <h2>1. Introduction</h2>
          <p>
            Hello Gorgeous Med Spa ("Company," "we," "us," or "our") respects your privacy and is committed 
            to protecting your personal information. This Privacy Policy explains how we collect, use, 
            disclose, and safeguard your information when you visit our website, use our services, or 
            interact with us.
          </p>
        </section>

        <section className="mb-8">
          <h2>2. Information We Collect</h2>
          
          <h3>Personal Information</h3>
          <p>We may collect the following types of personal information:</p>
          <ul>
            <li>Name, address, phone number, and email address</li>
            <li>Date of birth and gender</li>
            <li>Payment information (credit card numbers are not stored on our servers)</li>
            <li>Emergency contact information</li>
          </ul>

          <h3>Protected Health Information (PHI)</h3>
          <p>As a medical provider, we collect health-related information including:</p>
          <ul>
            <li>Medical history and current health conditions</li>
            <li>Medications and allergies</li>
            <li>Treatment records and clinical notes</li>
            <li>Before and after photographs</li>
            <li>Lab results and diagnostic information</li>
            <li>Insurance information (if applicable)</li>
          </ul>

          <h3>Automatically Collected Information</h3>
          <p>When you visit our website, we may automatically collect:</p>
          <ul>
            <li>IP address and browser type</li>
            <li>Device information</li>
            <li>Pages visited and time spent</li>
            <li>Referring website</li>
            <li>Cookies and similar technologies</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2>3. How We Use Your Information</h2>
          <p>We use your information for the following purposes:</p>
          
          <h3>Treatment Purposes</h3>
          <ul>
            <li>Providing medical aesthetic services</li>
            <li>Creating and maintaining your medical record</li>
            <li>Communicating with you about your care</li>
            <li>Scheduling appointments and sending reminders</li>
            <li>Following up on treatment outcomes</li>
          </ul>

          <h3>Payment and Operations</h3>
          <ul>
            <li>Processing payments and invoicing</li>
            <li>Managing your account</li>
            <li>Verifying insurance coverage (if applicable)</li>
            <li>Internal quality improvement</li>
          </ul>

          <h3>Communication</h3>
          <ul>
            <li>Sending appointment reminders</li>
            <li>Providing treatment information</li>
            <li>Sending promotional offers (with your consent)</li>
            <li>Responding to inquiries</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2>4. How We Share Your Information</h2>
          <p>We may share your information in the following circumstances:</p>

          <h3>With Your Consent</h3>
          <ul>
            <li>When you authorize us to share information with other providers</li>
            <li>For marketing purposes (only with explicit consent)</li>
            <li>For before/after photos (only with signed photo release)</li>
          </ul>

          <h3>Without Your Consent (as permitted by law)</h3>
          <ul>
            <li>For treatment, payment, and healthcare operations</li>
            <li>To comply with legal requirements</li>
            <li>To prevent serious threats to health or safety</li>
            <li>For public health activities</li>
            <li>To health oversight agencies</li>
            <li>In response to lawful court orders</li>
          </ul>

          <h3>Service Providers</h3>
          <p>
            We may share information with third-party service providers who assist us in operating our 
            business (e.g., payment processors, scheduling software, email services). All service providers 
            are required to sign Business Associate Agreements (BAAs) and maintain HIPAA compliance.
          </p>
        </section>

        <section className="mb-8">
          <h2>5. Your Rights Under HIPAA</h2>
          <p>You have the following rights regarding your health information:</p>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h4 className="font-bold">Right to Access</h4>
            <p className="text-sm mb-0">You may request copies of your medical records. We may charge a reasonable fee for copies.</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h4 className="font-bold">Right to Amend</h4>
            <p className="text-sm mb-0">You may request corrections to your medical record if you believe information is incorrect.</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h4 className="font-bold">Right to Accounting of Disclosures</h4>
            <p className="text-sm mb-0">You may request a list of certain disclosures we have made of your information.</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h4 className="font-bold">Right to Request Restrictions</h4>
            <p className="text-sm mb-0">You may request restrictions on how we use or share your information, though we are not always required to agree.</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h4 className="font-bold">Right to Confidential Communications</h4>
            <p className="text-sm mb-0">You may request that we communicate with you in a specific way or at a specific location.</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-bold">Right to a Paper Copy</h4>
            <p className="text-sm mb-0">You may request a paper copy of this Privacy Policy at any time.</p>
          </div>
        </section>

        <section className="mb-8">
          <h2>6. Data Security</h2>
          <p>We implement appropriate technical and organizational measures to protect your information:</p>
          <ul>
            <li>Encrypted data transmission (SSL/TLS)</li>
            <li>Encrypted data storage</li>
            <li>Access controls and authentication</li>
            <li>Regular security assessments</li>
            <li>Staff training on privacy and security</li>
            <li>Physical security of records</li>
          </ul>
          <p>
            While we strive to protect your information, no method of transmission over the Internet 
            or electronic storage is 100% secure. If you have reason to believe your information has 
            been compromised, please contact us immediately.
          </p>
        </section>

        <section className="mb-8">
          <h2>7. Data Retention</h2>
          <p>We retain your information as follows:</p>
          <ul>
            <li><strong>Medical Records:</strong> Minimum 10 years after last treatment (as required by Illinois law)</li>
            <li><strong>Minor Patient Records:</strong> Until patient reaches age 23 or 10 years after last treatment, whichever is later</li>
            <li><strong>Billing Records:</strong> 7 years</li>
            <li><strong>Marketing Data:</strong> Until you unsubscribe or request deletion</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2>8. Cookies and Tracking</h2>
          <p>Our website uses cookies and similar technologies to:</p>
          <ul>
            <li>Remember your preferences</li>
            <li>Analyze website traffic</li>
            <li>Improve user experience</li>
            <li>Deliver targeted advertising (with consent)</li>
          </ul>
          <p>
            You can control cookies through your browser settings. Note that disabling cookies may 
            affect website functionality.
          </p>
        </section>

        <section className="mb-8">
          <h2>9. Third-Party Links</h2>
          <p>
            Our website may contain links to third-party websites. We are not responsible for the 
            privacy practices of these sites. We encourage you to review the privacy policies of 
            any site you visit.
          </p>
        </section>

        <section className="mb-8">
          <h2>10. Children's Privacy</h2>
          <p>
            Our services are not intended for individuals under 18 years of age without parental/guardian 
            consent. We do not knowingly collect information from children under 13. If you believe we 
            have collected information from a child, please contact us.
          </p>
        </section>

        <section className="mb-8">
          <h2>11. Breach Notification</h2>
          <p>
            In the event of a data breach affecting your Protected Health Information, we will notify 
            you in accordance with HIPAA requirements (within 60 days of discovery) and take appropriate 
            steps to mitigate harm.
          </p>
        </section>

        <section className="mb-8">
          <h2>12. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any material 
            changes by posting the new policy on this page and updating the "Last Updated" date. Your 
            continued use of our services constitutes acceptance of any changes.
          </p>
        </section>

        <section className="mb-8">
          <h2>13. How to File a Complaint</h2>
          <p>
            If you believe your privacy rights have been violated, you may:
          </p>
          <ol>
            <li>Contact our Privacy Officer (see below)</li>
            <li>File a complaint with the U.S. Department of Health and Human Services Office for Civil Rights</li>
          </ol>
          <p>
            <strong>We will not retaliate against you for filing a complaint.</strong>
          </p>
        </section>

        <section className="mb-8 p-6 bg-pink-50 rounded-xl">
          <h2 className="mt-0">14. Contact Information</h2>
          <p>For questions about this Privacy Policy or to exercise your rights, contact:</p>
          <address className="not-italic">
            <strong>Privacy Officer</strong><br />
            Hello Gorgeous Med Spa<br />
            74 W. Washington St<br />
            Oswego, IL 60543<br />
            Phone: (630) 636-6193<br />
            Email: hello.gorgeous@hellogorgeousmedspa.com
          </address>
          <p className="mb-0 mt-4 text-sm">
            <strong>HHS Office for Civil Rights:</strong><br />
            200 Independence Avenue, S.W.<br />
            Washington, D.C. 20201<br />
            Toll-free: 1-877-696-6775<br />
            <a href="https://www.hhs.gov/hipaa/filing-a-complaint/index.html" className="text-pink-600" target="_blank" rel="noopener noreferrer">
              www.hhs.gov/hipaa/filing-a-complaint
            </a>
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Hello Gorgeous Med Spa. All rights reserved.
          </p>
          <div className="flex justify-center gap-6 mt-4 text-sm">
            <Link href="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link>
            <Link href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link>
            <Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
