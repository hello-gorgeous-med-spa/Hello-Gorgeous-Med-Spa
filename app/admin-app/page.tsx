// ============================================================
// ADMIN GET APP PAGE
// Install page for providers to add admin dashboard to home screen
// ============================================================

import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Get Admin App | Hello Gorgeous Med Spa',
  description: 'Install the Hello Gorgeous Admin app for quick access to your dashboard, appointments, and POS terminal.',
  manifest: '/admin-manifest.json',
};

export default function AdminGetAppPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="text-2xl">💗</span>
            <span className="font-semibold text-white">HG Admin</span>
          </Link>
          <Link
            href="/admin"
            className="px-4 py-2 bg-pink-500 text-white rounded-full text-sm font-medium hover:bg-pink-600"
          >
            Open Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-pink-500/20 text-pink-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span>👩‍⚕️</span>
            <span>Provider Access</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Get the <span className="text-pink-400">Admin App</span>
          </h1>
          
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Quick access to your dashboard, calendar, clients, and POS - right from your home screen.
          </p>
        </div>

        {/* App Preview */}
        <div className="bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 rounded-3xl p-8 md:p-12 text-white mb-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Your Practice at Your Fingertips
              </h2>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">📊</span>
                  <span>Full dashboard access</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">📅</span>
                  <span>View & manage calendar</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">👥</span>
                  <span>Client records & charts</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">💳</span>
                  <span>POS terminal for payments</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">📱</span>
                  <span>SMS marketing campaigns</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">📋</span>
                  <span>Compliance & consent forms</span>
                </li>
              </ul>
            </div>
            <div className="text-center">
              <div className="text-8xl mb-4">🏥</div>
              <p className="text-pink-100">Works like a native app - no app store!</p>
            </div>
          </div>
        </div>

        {/* Installation Instructions */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* iPhone Instructions */}
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🍎</span>
              <h3 className="text-xl font-bold text-white">iPhone / iPad</h3>
            </div>
            <ol className="space-y-4 text-slate-300">
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-pink-500/30 text-pink-400 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                <span>Open this page in <strong className="text-white">Safari</strong></span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-pink-500/30 text-pink-400 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                <span>Tap the <strong className="text-white">Share button</strong> (square with arrow)</span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-pink-500/30 text-pink-400 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
                <span>Scroll down, tap <strong className="text-white">"Add to Home Screen"</strong></span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-pink-500/30 text-pink-400 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</span>
                <span>Tap <strong className="text-white">"Add"</strong> - Done! 🎉</span>
              </li>
            </ol>
          </div>

          {/* Android Instructions */}
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🤖</span>
              <h3 className="text-xl font-bold text-white">Android</h3>
            </div>
            <ol className="space-y-4 text-slate-300">
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-pink-500/30 text-pink-400 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                <span>Open this page in <strong className="text-white">Chrome</strong></span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-pink-500/30 text-pink-400 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                <span>Tap the <strong className="text-white">menu</strong> (three dots)</span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-pink-500/30 text-pink-400 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
                <span>Tap <strong className="text-white">"Install App"</strong> or <strong className="text-white">"Add to Home Screen"</strong></span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-pink-500/30 text-pink-400 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</span>
                <span>Tap <strong className="text-white">"Install"</strong> - Done! 🎉</span>
              </li>
            </ol>
          </div>
        </div>

        {/* Desktop Instructions */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">💻</span>
            <h3 className="text-xl font-bold text-white">Desktop (Mac / Windows)</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-white mb-3">Chrome</h4>
              <ol className="space-y-2 text-slate-300 text-sm">
                <li className="flex gap-2">
                  <span className="text-pink-400">1.</span>
                  <span>Click the <strong className="text-white">install icon</strong> in the address bar (or menu → "Install Hello Gorgeous Admin")</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-pink-400">2.</span>
                  <span>Click <strong className="text-white">"Install"</strong></span>
                </li>
              </ol>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Safari (Mac)</h4>
              <ol className="space-y-2 text-slate-300 text-sm">
                <li className="flex gap-2">
                  <span className="text-pink-400">1.</span>
                  <span>Click <strong className="text-white">File → Add to Dock</strong></span>
                </li>
                <li className="flex gap-2">
                  <span className="text-pink-400">2.</span>
                  <span>App will appear in your Dock</span>
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6 mb-12">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link href="/admin" className="p-4 bg-slate-700/50 rounded-xl text-center hover:bg-slate-700 transition-colors">
              <span className="text-2xl block mb-1">📊</span>
              <span className="text-sm text-slate-300">Dashboard</span>
            </Link>
            <Link href="/admin/calendar" className="p-4 bg-slate-700/50 rounded-xl text-center hover:bg-slate-700 transition-colors">
              <span className="text-2xl block mb-1">📅</span>
              <span className="text-sm text-slate-300">Calendar</span>
            </Link>
            <Link href="/pos" className="p-4 bg-slate-700/50 rounded-xl text-center hover:bg-slate-700 transition-colors">
              <span className="text-2xl block mb-1">💳</span>
              <span className="text-sm text-slate-300">POS Terminal</span>
            </Link>
            <Link href="/admin/clients" className="p-4 bg-slate-700/50 rounded-xl text-center hover:bg-slate-700 transition-colors">
              <span className="text-2xl block mb-1">👥</span>
              <span className="text-sm text-slate-300">Clients</span>
            </Link>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl hover:scale-105 transition-all"
          >
            <span>🏥</span>
            Open Dashboard
          </Link>
          <p className="mt-4 text-slate-500 text-sm">
            Need help? Contact <a href="mailto:support@hellogorgeousmedspa.com" className="text-pink-400">support</a>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-6 mb-4">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>🔒</span>
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>🛡️</span>
              <span>256-bit SSL</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>✓</span>
              <span>Secure</span>
            </div>
          </div>
          <p className="text-slate-600 text-sm">
            © 2026 Hello Gorgeous Med Spa | Admin Portal
          </p>
        </div>
      </footer>
    </div>
  );
}
