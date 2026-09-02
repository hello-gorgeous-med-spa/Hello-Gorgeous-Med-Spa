import Link from 'next/link';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

export const metadata = {
  title: 'Welcome to RE GEN',
  description: 'Your prescription wellness journey begins now.',
};

const BRAND = {
  teal: '#0D5C63',
  gold: '#F59E0B',
  cream: '#FFFBF5',
  charcoal: '#1F2937',
};

export default function RegenSuccessPage() {
  return (
    <div className="min-h-screen" style={{ background: `linear-gradient(to bottom, ${BRAND.teal}10, ${BRAND.cream})` }}>
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <Link href="/" className="text-xl font-bold" style={{ color: BRAND.charcoal }}>
            RE<span style={{ color: BRAND.teal }}>GEN</span>
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-16 text-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <CheckCircleIcon className="w-20 h-20 mx-auto mb-6" style={{ color: BRAND.teal }} />
          
          <h1 className="text-3xl font-bold mb-4" style={{ color: BRAND.charcoal }}>
            You&apos;re In!
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Thank you for starting your wellness journey with RE GEN.
          </p>

          <div className="rounded-xl p-6 mb-8 text-left" style={{ backgroundColor: `${BRAND.teal}10` }}>
            <h2 className="font-semibold mb-4" style={{ color: BRAND.charcoal }}>What happens next:</h2>
            <ol className="space-y-3 text-gray-700">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 text-white rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: BRAND.teal }}>1</span>
                <span><strong>Check your email</strong> — You&apos;ll receive a confirmation and intake form link within minutes.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 text-white rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: BRAND.teal }}>2</span>
                <span><strong>Complete your health history</strong> — Our secure form takes about 5 minutes.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 text-white rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: BRAND.teal }}>3</span>
                <span><strong>Provider review</strong> — A licensed provider will review your information within 24-48 hours.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 text-white rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: BRAND.teal }}>4</span>
                <span><strong>Prescription shipped</strong> — If approved, your medication ships directly to your door.</span>
              </li>
            </ol>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-6 py-3 text-white font-semibold rounded-lg transition-all hover:scale-105"
              style={{ backgroundColor: BRAND.teal }}
            >
              Back to Home
            </Link>
            <a
              href="tel:+16302342473"
              className="px-6 py-3 border-2 font-semibold rounded-lg transition-colors"
              style={{ borderColor: BRAND.teal, color: BRAND.teal }}
            >
              Questions? Call Us
            </a>
          </div>
        </div>

        <p className="mt-8 text-sm text-gray-500">
          Questions? Email <a href="mailto:hello@tryregenrx.com" className="hover:underline" style={{ color: BRAND.teal }}>hello@tryregenrx.com</a> or call <a href="tel:+16302342473" className="hover:underline" style={{ color: BRAND.teal }}>(630) 234-2473</a>
        </p>
      </main>
    </div>
  );
}
