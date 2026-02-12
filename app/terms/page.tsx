import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service | Hello Gorgeous Med Spa',
  description: 'Terms and conditions for Hello Gorgeous Med Spa services',
};

export default function TermsOfServicePage() {
  const lastUpdated = 'January 30, 2026';

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-pink-500 to-rose-500 text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/" className="text-pink-100 hover:text-white mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold">Terms of Service</h1>
          <p className="text-pink-100 mt-2">Last Updated: {lastUpdated}</p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-12 prose prose-pink max-w-none">
        <section className="mb-8">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using the services of Hello Gorgeous Med Spa ("Company," "we," "us," or "our"), 
            located at 74 W. Washington St, Oswego, IL 60543, you ("Client," "you," or "your") agree to be 
            bound by these Terms of Service, all applicable laws and regulations, and agree that you are 
            responsible for compliance with any applicable local laws.
          </p>
        </section>

        <section className="mb-8">
          <h2>2. Services</h2>
          <p>
            Hello Gorgeous Med Spa provides medical aesthetic services including, but not limited to:
          </p>
          <ul>
            <li>Injectable treatments (Botox, dermal fillers, Kybella)</li>
            <li>Laser treatments (hair removal, IPL, skin resurfacing)</li>
            <li>Skincare treatments (facials, chemical peels, microneedling)</li>
            <li>Weight management programs (GLP-1 medications)</li>
            <li>Other medical aesthetic procedures</li>
          </ul>
          <p>
            All medical procedures are performed by licensed healthcare providers under the supervision of 
            our Medical Director in accordance with Illinois state law.
          </p>
        </section>

        <section className="mb-8">
          <h2>3. Eligibility</h2>
          <p>
            To receive services, you must:
          </p>
          <ul>
            <li>Be at least 18 years of age (or have parental/guardian consent)</li>
            <li>Provide accurate and complete health history information</li>
            <li>Disclose all medications, allergies, and medical conditions</li>
            <li>Sign all required consent forms before treatment</li>
            <li>Follow all pre-treatment and post-treatment instructions</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2>4. Medical Disclaimer</h2>
          <p>
            <strong>IMPORTANT:</strong> The services provided by Hello Gorgeous Med Spa are medical procedures 
            that carry inherent risks. By receiving treatment, you acknowledge that:
          </p>
          <ul>
            <li>No medical procedure is 100% risk-free</li>
            <li>Results vary by individual and are not guaranteed</li>
            <li>You have been informed of the risks, benefits, and alternatives</li>
            <li>You are voluntarily choosing to receive treatment</li>
            <li>Our providers will use their professional judgment in your care</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2>5. Appointments and Cancellations</h2>
          <h3>Booking</h3>
          <p>
            Appointments may be booked online, by phone, or in person. Some services may require a deposit 
            at the time of booking.
          </p>
          
          <h3>Cancellation Policy</h3>
          <ul>
            <li>Cancellations must be made at least 24 hours in advance</li>
            <li>Late cancellations (less than 24 hours) may incur a fee of 50% of the scheduled service</li>
            <li>No-shows may be charged the full service price</li>
            <li>Deposits are non-refundable for late cancellations or no-shows</li>
            <li>Repeated no-shows may result in prepayment requirements or discharge from practice</li>
          </ul>
          
          <h3>Late Arrivals</h3>
          <p>
            Arriving more than 15 minutes late may result in rescheduling or modified treatment time.
          </p>
        </section>

        <section className="mb-8">
          <h2>6. Payment Terms</h2>
          <ul>
            <li>Payment is due at the time of service unless other arrangements are made</li>
            <li>We accept cash, credit cards, FSA/HSA, and approved financing options</li>
            <li>Package prices are valid only when paid in full at time of purchase</li>
            <li>Package services are non-transferable and non-refundable</li>
            <li>Gift cards do not expire and are non-refundable</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2>7. Refund Policy</h2>
          <p>
            Due to the nature of medical services:
          </p>
          <ul>
            <li>Services rendered are generally non-refundable</li>
            <li>Unused product (injectables) cannot be refunded once opened</li>
            <li>Dissatisfaction with results does not guarantee a refund</li>
            <li>Touch-up policies vary by treatment - ask your provider</li>
            <li>Product returns follow manufacturer guidelines</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2>8. Dispute Resolution</h2>
          <p>
            <strong>Arbitration Agreement:</strong> By receiving services, you agree that any disputes 
            arising from your treatment will be resolved through binding arbitration rather than court 
            litigation. You will be asked to sign a separate Arbitration Agreement.
          </p>
          <p>
            This does not prevent you from filing complaints with relevant licensing boards if you 
            believe there has been professional misconduct.
          </p>
        </section>

        <section className="mb-8">
          <h2>9. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, Hello Gorgeous Med Spa and its owners, employees, 
            and affiliates shall not be liable for any indirect, incidental, special, consequential, 
            or punitive damages arising from your use of our services, except in cases of gross 
            negligence or willful misconduct.
          </p>
        </section>

        <section className="mb-8">
          <h2>10. Intellectual Property</h2>
          <p>
            All content on our website, including text, graphics, logos, and images, is the property 
            of Hello Gorgeous Med Spa and protected by copyright laws. You may not reproduce, distribute, 
            or create derivative works without written permission.
          </p>
        </section>

        <section id="sms-program" className="mb-8 scroll-mt-24">
          <h2>11. SMS and Text Messaging Program</h2>
          <p>
            By opting in to receive text messages from Hello Gorgeous Med Spa, you agree to these program terms:
          </p>
          <ul>
            <li><strong>Consent:</strong> You consent to receive promotional and transactional text messages at the phone number you provided.</li>
            <li><strong>Frequency:</strong> Message frequency varies. You may receive appointment reminders, treatment updates, and occasional promotional offers.</li>
            <li><strong>Opt-out:</strong> Reply STOP to any message to unsubscribe at any time. Message and data rates may apply.</li>
            <li><strong>Support:</strong> Reply HELP for assistance. For questions, contact us at (630) 636-6193 or hello.gorgeous@hellogorgeousmedspa.com.</li>
            <li><strong>Carriers:</strong> Supported carriers include AT&amp;T, T-Mobile, Verizon, and others. Delivery is not guaranteed.</li>
          </ul>
          <p className="mb-0">
            Our <Link href="/privacy#sms-mobile" className="text-pink-600 underline">Privacy Policy</Link> explains how we use your mobile information. Your mobile information will not be sold or shared with third parties for promotional or marketing purposes.
          </p>
        </section>

        <section className="mb-8">
          <h2>12. Privacy</h2>
          <p>
            Your privacy is important to us. Please review our <Link href="/privacy" className="text-pink-600 hover:underline">Privacy Policy</Link> for 
            information on how we collect, use, and protect your personal and health information.
          </p>
        </section>

        <section className="mb-8">
          <h2>13. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Changes will be posted on this page 
            with an updated revision date. Your continued use of our services constitutes acceptance of 
            any changes.
          </p>
        </section>

        <section className="mb-8">
          <h2>14. Contact Information</h2>
          <p>
            If you have questions about these Terms of Service, please contact us:
          </p>
          <address className="not-italic">
            <strong>Hello Gorgeous Med Spa</strong><br />
            74 W. Washington St<br />
            Oswego, IL 60543<br />
            Phone: (630) 636-6193<br />
            Email: hello.gorgeous@hellogorgeousmedspa.com
          </address>
        </section>

        <section className="mb-8 p-6 bg-gray-100 rounded-xl">
          <h2 className="mt-0">15. Governing Law</h2>
          <p className="mb-0">
            These Terms of Service shall be governed by and construed in accordance with the laws of 
            the State of Illinois, without regard to its conflict of law provisions. Any legal action 
            arising from these terms shall be filed in Kendall County, Illinois.
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
