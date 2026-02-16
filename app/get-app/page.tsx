// ============================================================
// GET THE APP PAGE
// Beautiful landing page for clients to download the portal app
// ============================================================

import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Get the App | Hello Gorgeous Med Spa',
  description: 'Download the Hello Gorgeous app to book appointments, get reminders, earn rewards, and manage your treatments.',
};

export default function GetAppPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-pink-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">💗</span>
            <span className="font-semibold text-black">Hello Gorgeous</span>
          </Link>
          <Link
            href="/portal"
            className="px-4 py-2 bg-[#FF2D8E] text-white rounded-full text-sm font-medium hover:bg-black"
          >
            Open Portal
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span>🔒</span>
            <span>HIPAA Compliant & Secure</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Get the <span className="text-[#FF2D8E]">Hello Gorgeous</span> App
          </h1>
          
          <p className="text-xl text-black max-w-2xl mx-auto">
            Book appointments, get reminders, track your treatments, and earn rewards - all from your phone.
          </p>
        </div>

        {/* App Preview */}
        <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 rounded-3xl p-8 md:p-12 text-white mb-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Your Med Spa in Your Pocket
              </h2>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">📅</span>
                  <span>Book appointments 24/7</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">🔔</span>
                  <span>Get appointment reminders</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">🎁</span>
                  <span>Track rewards & referrals</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">📋</span>
                  <span>View treatment history</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">📝</span>
                  <span>Complete forms digitally</span>
                </li>
              </ul>
            </div>
            <div className="text-center">
              <div className="text-8xl mb-4">📱</div>
              <p className="text-pink-100">No app store needed - installs directly!</p>
            </div>
          </div>
        </div>

        {/* Installation Instructions */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* iPhone Instructions */}
          <div className="bg-white rounded-2xl border border-black p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🍎</span>
              <h3 className="text-xl font-bold text-black">iPhone / iPad</h3>
            </div>
            <ol className="space-y-4 text-black">
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                <span>Open this page in <strong>Safari</strong></span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                <span>Tap the <strong>Share button</strong> (square with arrow)</span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
                <span>Scroll down, tap <strong>"Add to Home Screen"</strong></span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</span>
                <span>Tap <strong>"Add"</strong> - Done! 🎉</span>
              </li>
            </ol>
          </div>

          {/* Android Instructions */}
          <div className="bg-white rounded-2xl border border-black p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🤖</span>
              <h3 className="text-xl font-bold text-black">Android</h3>
            </div>
            <ol className="space-y-4 text-black">
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                <span>Open this page in <strong>Chrome</strong></span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                <span>Tap the <strong>menu</strong> (three dots)</span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
                <span>Tap <strong>"Install App"</strong> or <strong>"Add to Home Screen"</strong></span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</span>
                <span>Tap <strong>"Install"</strong> - Done! 🎉</span>
              </li>
            </ol>
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-black rounded-2xl p-8 text-white mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Your Privacy & Security Matter</h2>
            <p className="text-black">We take protecting your information seriously</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔒</span>
              </div>
              <h3 className="font-semibold mb-2">HIPAA Compliant</h3>
              <p className="text-sm text-black">
                Your health information is protected according to federal healthcare privacy laws
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🛡️</span>
              </div>
              <h3 className="font-semibold mb-2">256-bit Encryption</h3>
              <p className="text-sm text-black">
                Bank-level security protects all data transmitted to and from our servers
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✓</span>
              </div>
              <h3 className="font-semibold mb-2">SOC 2 Certified</h3>
              <p className="text-sm text-black">
                Our systems meet rigorous security and availability standards
              </p>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-black text-center">
            <p className="text-sm text-black">
              Read our full{' '}
              <Link href="/privacy" className="text-[#FF2D8E] hover:underline">Privacy Policy</Link>
              {' '}and{' '}
              <Link href="/terms" className="text-[#FF2D8E] hover:underline">Terms of Service</Link>
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/portal"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl hover:scale-105 transition-all"
          >
            <span>✨</span>
            Open My Portal
          </Link>
          <p className="mt-4 text-black text-sm">
            Questions? Call us at <a href="tel:6306366193" className="text-[#FF2D8E]">(630) 636-6193</a>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-black py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-6 mb-4">
            <div className="flex items-center gap-2 text-sm text-black">
              <span>🔒</span>
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-black">
              <span>🛡️</span>
              <span>256-bit SSL</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-black">
              <span>✓</span>
              <span>Secure</span>
            </div>
          </div>
          <p className="text-black text-sm">
            © 2026 Hello Gorgeous Med Spa | 74 W. Washington St, Oswego, IL 60543
          </p>
        </div>
      </footer>
    </div>
  );
}
