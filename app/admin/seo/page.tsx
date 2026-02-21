'use client';

// ============================================================
// SEO DASHBOARD - Google Search Console Setup Guide
// ============================================================

import { useState } from 'react';
import Link from 'next/link';

export default function SEODashboardPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">SEO Dashboard</h1>
      <p className="text-gray-600 mb-8">Get your site indexed on Google and track your rankings</p>

      {/* Quick Status */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-green-700 font-medium">✓ Sitemap</p>
          <p className="text-sm text-green-600">Auto-generated</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-green-700 font-medium">✓ Robots.txt</p>
          <p className="text-sm text-green-600">Configured</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-amber-700 font-medium">⚠ Search Console</p>
          <p className="text-sm text-amber-600">Setup needed</p>
        </div>
      </div>

      {/* Google Search Console Setup */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="text-2xl">🔍</span> Google Search Console Setup
        </h2>
        <p className="text-gray-600 mb-6">
          This is <strong>CRITICAL</strong> for showing up in Google search results. Follow these steps:
        </p>

        <div className="space-y-6">
          {/* Step 1 */}
          <div className="border-l-4 border-[#FF2D8E] pl-4">
            <h3 className="font-semibold text-lg">Step 1: Go to Google Search Console</h3>
            <p className="text-gray-600 mt-2 mb-3">Open Google Search Console and sign in with your Google account:</p>
            <a 
              href="https://search.google.com/search-console" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Open Google Search Console →
            </a>
          </div>

          {/* Step 2 */}
          <div className="border-l-4 border-[#FF2D8E] pl-4">
            <h3 className="font-semibold text-lg">Step 2: Add Your Property</h3>
            <p className="text-gray-600 mt-2 mb-3">Click "Add Property" and select "URL Prefix". Enter your website URL:</p>
            <div className="flex items-center gap-2">
              <code className="bg-gray-100 px-4 py-2 rounded-lg text-sm flex-1">
                https://www.hellogorgeousmedspa.com
              </code>
              <button
                onClick={() => copyToClipboard('https://www.hellogorgeousmedspa.com', 'url')}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                {copied === 'url' ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Step 3 */}
          <div className="border-l-4 border-[#FF2D8E] pl-4">
            <h3 className="font-semibold text-lg">Step 3: Verify Ownership</h3>
            <p className="text-gray-600 mt-2 mb-3">
              Choose "HTML tag" verification. Copy the meta tag Google gives you. 
              Then add it to your Vercel environment variables:
            </p>
            <ol className="list-decimal pl-6 text-gray-600 space-y-2">
              <li>Copy the verification code from Google (looks like: <code className="bg-gray-100 px-1">google-site-verification=XXXXX</code>)</li>
              <li>Go to Vercel Dashboard → Settings → Environment Variables</li>
              <li>Add: <code className="bg-gray-100 px-1">GOOGLE_SITE_VERIFICATION=XXXXX</code></li>
              <li>Redeploy the site</li>
              <li>Click "Verify" in Google Search Console</li>
            </ol>
          </div>

          {/* Step 4 */}
          <div className="border-l-4 border-[#FF2D8E] pl-4">
            <h3 className="font-semibold text-lg">Step 4: Submit Your Sitemap</h3>
            <p className="text-gray-600 mt-2 mb-3">
              Once verified, go to "Sitemaps" in the left sidebar and submit your sitemap:
            </p>
            <div className="flex items-center gap-2">
              <code className="bg-gray-100 px-4 py-2 rounded-lg text-sm flex-1">
                https://www.hellogorgeousmedspa.com/sitemap.xml
              </code>
              <button
                onClick={() => copyToClipboard('https://www.hellogorgeousmedspa.com/sitemap.xml', 'sitemap')}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                {copied === 'sitemap' ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Step 5 */}
          <div className="border-l-4 border-[#FF2D8E] pl-4">
            <h3 className="font-semibold text-lg">Step 5: Request Indexing</h3>
            <p className="text-gray-600 mt-2 mb-3">
              Use the URL Inspection tool to request indexing for your most important pages:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li><code className="bg-gray-100 px-1">hellogorgeousmedspa.com/</code> (Homepage)</li>
              <li><code className="bg-gray-100 px-1">hellogorgeousmedspa.com/botox-oswego-il</code> (Botox Near Me)</li>
              <li><code className="bg-gray-100 px-1">hellogorgeousmedspa.com/services</code> (Services)</li>
              <li><code className="bg-gray-100 px-1">hellogorgeousmedspa.com/providers</code> (Providers)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Google Business Profile */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="text-2xl">📍</span> Google Business Profile (Critical!)
        </h2>
        <p className="text-gray-600 mb-4">
          Your Google Business Profile is the #1 factor for "near me" searches. Make sure it's optimized:
        </p>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <span className="text-green-500 text-xl">✓</span>
            <div>
              <p className="font-medium">Claim & Verify Your Profile</p>
              <p className="text-sm text-gray-600">Make sure you've claimed and verified ownership</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-green-500 text-xl">✓</span>
            <div>
              <p className="font-medium">Complete All Information</p>
              <p className="text-sm text-gray-600">Business hours, phone, address, website, services, photos</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-green-500 text-xl">✓</span>
            <div>
              <p className="font-medium">Add Services</p>
              <p className="text-sm text-gray-600">Add "Botox", "Lip Filler", "Weight Loss" etc. as services</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-green-500 text-xl">✓</span>
            <div>
              <p className="font-medium">Get Reviews</p>
              <p className="text-sm text-gray-600">Ask happy clients to leave Google reviews</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-green-500 text-xl">✓</span>
            <div>
              <p className="font-medium">Post Updates</p>
              <p className="text-sm text-gray-600">Post weekly updates, specials, and photos</p>
            </div>
          </div>
        </div>

        <a 
          href="https://business.google.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Open Google Business Profile →
        </a>
      </div>

      {/* Your SEO Pages */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="text-2xl">📄</span> Your SEO Landing Pages
        </h2>
        <p className="text-gray-600 mb-4">
          These pages are optimized for "near me" searches:
        </p>

        <div className="space-y-3">
          {[
            { url: '/botox-oswego-il', label: 'Botox Oswego IL', keyword: 'botox near me, botox oswego' },
            { url: '/botox-naperville-il', label: 'Botox Naperville IL', keyword: 'botox naperville' },
            { url: '/botox-aurora-il', label: 'Botox Aurora IL', keyword: 'botox aurora' },
            { url: '/providers', label: 'Providers', keyword: 'med spa providers' },
            { url: '/services', label: 'All Services', keyword: 'med spa services' },
          ].map((page) => (
            <div key={page.url} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <Link href={page.url} className="font-medium text-[#FF2D8E] hover:underline">
                  {page.label}
                </Link>
                <p className="text-xs text-gray-500">Keywords: {page.keyword}</p>
              </div>
              <a 
                href={`https://www.hellogorgeousmedspa.com${page.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                View Live →
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* SEO Checklist */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <h2 className="text-xl font-bold text-amber-800 mb-4">⚡ Quick SEO Wins</h2>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <input type="checkbox" className="mt-1" />
            <span>Set up Google Search Console (follow steps above)</span>
          </li>
          <li className="flex items-start gap-3">
            <input type="checkbox" className="mt-1" />
            <span>Submit sitemap to Google</span>
          </li>
          <li className="flex items-start gap-3">
            <input type="checkbox" className="mt-1" />
            <span>Optimize Google Business Profile (add all services)</span>
          </li>
          <li className="flex items-start gap-3">
            <input type="checkbox" className="mt-1" />
            <span>Ask 5 happy clients for Google reviews this week</span>
          </li>
          <li className="flex items-start gap-3">
            <input type="checkbox" className="mt-1" />
            <span>Post a Google Business update about Botox specials</span>
          </li>
          <li className="flex items-start gap-3">
            <input type="checkbox" className="mt-1" />
            <span>Share Botox landing page link on Facebook</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
