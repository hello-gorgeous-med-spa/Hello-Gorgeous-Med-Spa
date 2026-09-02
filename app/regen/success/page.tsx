import Link from 'next/link';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

export const metadata = {
  title: 'Welcome to RE GEN',
  description: 'Your prescription wellness journey begins now.',
};

export default function RegenSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <Link href="/" className="text-xl font-bold text-gray-900">
            RE<span className="text-emerald-600">GEN</span>
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-16 text-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <CheckCircleIcon className="w-20 h-20 text-emerald-500 mx-auto mb-6" />
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            You&apos;re In!
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Thank you for starting your wellness journey with RE GEN.
          </p>

          <div className="bg-emerald-50 rounded-xl p-6 mb-8 text-left">
            <h2 className="font-semibold text-gray-900 mb-4">What happens next:</h2>
            <ol className="space-y-3 text-gray-700">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                <span><strong>Check your email</strong> — You&apos;ll receive a confirmation and intake form link within minutes.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                <span><strong>Complete your health history</strong> — Our secure form takes about 5 minutes.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                <span><strong>Provider review</strong> — A licensed provider will review your information within 24-48 hours.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                <span><strong>Prescription shipped</strong> — If approved, your medication ships directly to your door.</span>
              </li>
            </ol>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors"
            >
              Back to Home
            </Link>
            <a
              href="tel:+16302342473"
              className="px-6 py-3 border-2 border-gray-300 hover:border-emerald-600 text-gray-700 hover:text-emerald-600 font-semibold rounded-lg transition-colors"
            >
              Questions? Call Us
            </a>
          </div>
        </div>

        <p className="mt-8 text-sm text-gray-500">
          Questions? Email <a href="mailto:hello@tryregenrx.com" className="text-emerald-600 hover:underline">hello@tryregenrx.com</a> or call <a href="tel:+16302342473" className="text-emerald-600 hover:underline">(630) 234-2473</a>
        </p>
      </main>
    </div>
  );
}
