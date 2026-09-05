import Link from 'next/link';

const BRAND = {
  teal: '#0D9488',
  pink: '#E91E8C',
  dark: '#0A0A0A',
  darkAlt: '#111111',
  cream: '#FAF9F6',
  gray: '#9CA3AF',
};

export default function RegenSuccessPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: BRAND.dark }}>
      <header style={{ backgroundColor: BRAND.darkAlt, borderBottom: `1px solid ${BRAND.teal}20` }}>
        <div className="max-w-3xl mx-auto px-6 py-4">
          <Link href="/" className="text-xl font-bold text-white">
            REGEN<span style={{ color: BRAND.pink }}>RX</span>
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-16 text-center">
        <div className="rounded-2xl p-8 md:p-12" style={{ backgroundColor: BRAND.darkAlt, border: `1px solid ${BRAND.teal}30` }}>
          <svg className="w-20 h-20 mx-auto mb-6" style={{ color: BRAND.teal }} fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
          </svg>
          
          <h1 className="text-3xl font-bold mb-4" style={{ color: BRAND.cream }}>
            You&apos;re In!
          </h1>
          
          <p className="text-lg mb-8" style={{ color: BRAND.gray }}>
            Thank you for starting your wellness journey with REGEN RX.
          </p>

          <div className="rounded-xl p-6 mb-8 text-left" style={{ backgroundColor: BRAND.dark, border: `1px solid ${BRAND.teal}20` }}>
            <h2 className="font-semibold mb-4" style={{ color: BRAND.cream }}>What happens next:</h2>
            <ol className="space-y-3" style={{ color: BRAND.gray }}>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 text-white rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: BRAND.teal }}>1</span>
                <span><strong style={{ color: BRAND.cream }}>Check your email</strong> — Confirmation is sent immediately from REGEN RX.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 text-white rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: BRAND.teal }}>2</span>
                <span><strong style={{ color: BRAND.cream }}>Your intake is already in our queue</strong> — No extra form to fill unless we request labs.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 text-white rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: BRAND.pink }}>3</span>
                <span><strong style={{ color: BRAND.cream }}>Provider review</strong> — A licensed provider will review your information within 24-48 hours.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 text-white rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: BRAND.pink }}>4</span>
                <span><strong style={{ color: BRAND.cream }}>Prescription shipped</strong> — If approved, your medication ships directly to your door.</span>
              </li>
            </ol>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-6 py-3 text-white font-semibold rounded-lg transition-all hover:scale-105"
              style={{ backgroundColor: BRAND.pink }}
            >
              Back to Home
            </Link>
            <a
              href="tel:+16306366193"
              className="px-6 py-3 border-2 font-semibold rounded-lg transition-colors"
              style={{ borderColor: BRAND.teal, color: BRAND.teal }}
            >
              Questions? Call Us
            </a>
          </div>
        </div>

        <p className="mt-8 text-sm" style={{ color: BRAND.gray }}>
          Questions? Email <a href="mailto:provider@hellogorgeousmedspa.com" className="hover:underline" style={{ color: BRAND.teal }}>provider@hellogorgeousmedspa.com</a> or call <a href="tel:+16306366193" className="hover:underline" style={{ color: BRAND.teal }}>(630) 636-6193</a>
        </p>
      </main>
    </div>
  );
}
