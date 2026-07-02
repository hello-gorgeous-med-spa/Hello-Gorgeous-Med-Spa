import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Staff Resources | Hello Gorgeous Med Spa',
  robots: 'noindex, nofollow',
};

export default function StaffPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <div className="max-w-md mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">💖</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Hello Gorgeous Staff Hub
          </h1>
          <p className="text-gray-600">
            Your tools & training resources
          </p>
        </div>

        {/* Resource Cards */}
        <div className="space-y-4">
          {/* Pharmacy Selector */}
          <a
            href="/staff/pharmacy-selector.html"
            download="Pharmacy-Selector.html"
            className="block bg-white rounded-2xl p-5 shadow-lg border-2 border-pink-200 hover:border-pink-400 hover:shadow-xl transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="text-4xl">💊</div>
              <div className="flex-1">
                <h2 className="font-bold text-gray-900 text-lg">Pharmacy Selector</h2>
                <p className="text-gray-500 text-sm">Tap to download, then open file</p>
              </div>
              <div className="text-pink-500 text-2xl">↓</div>
            </div>
          </a>

          {/* Install Instructions */}
          <a
            href="/staff/pharmacy-install-card.pdf"
            target="_blank"
            className="block bg-white rounded-2xl p-5 shadow-lg border-2 border-purple-200 hover:border-purple-400 hover:shadow-xl transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="text-4xl">📲</div>
              <div className="flex-1">
                <h2 className="font-bold text-gray-900 text-lg">Install Instructions</h2>
                <p className="text-gray-500 text-sm">Add Pharmacy Selector to home screen</p>
              </div>
              <div className="text-purple-500 text-2xl">→</div>
            </div>
          </a>

          {/* REGEN Study Guide */}
          <a
            href="/staff/regen-study-guide.pdf"
            target="_blank"
            className="block bg-white rounded-2xl p-5 shadow-lg border-2 border-blue-200 hover:border-blue-400 hover:shadow-xl transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="text-4xl">📚</div>
              <div className="flex-1">
                <h2 className="font-bold text-gray-900 text-lg">REGEN Study Guide</h2>
                <p className="text-gray-500 text-sm">Product knowledge & training</p>
              </div>
              <div className="text-blue-500 text-2xl">→</div>
            </div>
          </a>
        </div>

        {/* Footer */}
        <div className="mt-10 text-center">
          <p className="text-gray-400 text-sm">
            Questions? Text Dani 💕
          </p>
        </div>

        {/* Quick tip */}
        <div className="mt-6 bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl p-4 text-center">
          <p className="text-sm text-gray-700">
            <strong>Pro tip:</strong> Bookmark this page or add to your home screen for quick access!
          </p>
        </div>
      </div>
    </div>
  );
}
