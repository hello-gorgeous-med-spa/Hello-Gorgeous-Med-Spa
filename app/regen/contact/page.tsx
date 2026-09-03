'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const BRAND = {
  teal: '#0D9488',
  pink: '#E91E8C',
  dark: '#0A0A0A',
  darkAlt: '#111111',
  cream: '#FAF9F6',
  gray: '#9CA3AF',
};

const TOPICS = [
  { id: 'general', label: 'General Question' },
  { id: 'weight-loss', label: 'Weight Loss / GLP-1' },
  { id: 'peptides', label: 'Peptide Therapy' },
  { id: 'hormones', label: 'Hormone Therapy' },
  { id: 'skincare', label: 'Prescription Skincare' },
  { id: 'hair', label: 'Hair Restoration' },
  { id: 'sexual-health', label: 'Sexual Wellness' },
  { id: 'pricing', label: 'Pricing / Insurance' },
  { id: 'other', label: 'Other' },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    topic: 'general',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/regen/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: BRAND.dark }}>
        <div className="max-w-md text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: `${BRAND.teal}20` }}>
            <svg className="w-10 h-10" style={{ color: BRAND.teal }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4" style={{ color: BRAND.cream }}>Message Sent!</h1>
          <p className="mb-8" style={{ color: BRAND.gray }}>
            Thanks for reaching out. Our team will review your message and get back to you 
            within 24-48 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-6 py-3 font-bold rounded-full"
              style={{ backgroundColor: BRAND.teal, color: 'white' }}
            >
              Back to Home
            </Link>
            <Link
              href="/start"
              className="px-6 py-3 font-bold rounded-full"
              style={{ backgroundColor: BRAND.pink, color: 'white' }}
            >
              Start a Visit
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: BRAND.dark }}>
      {/* Header */}
      <nav className="border-b" style={{ backgroundColor: BRAND.darkAlt, borderColor: `${BRAND.teal}20` }}>
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image src="/images/regen/logo-full.png" alt="REGEN RX" width={120} height={40} className="h-8 w-auto" />
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/learn" className="text-sm font-medium" style={{ color: BRAND.gray }}>Learn</Link>
            <Link href="/start" className="px-5 py-2 text-white text-sm font-bold rounded-full" style={{ backgroundColor: BRAND.pink }}>
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-12 px-6 text-center" style={{ background: `linear-gradient(180deg, ${BRAND.darkAlt} 0%, ${BRAND.dark} 100%)` }}>
        <div className="max-w-2xl mx-auto">
          <span 
            className="inline-block px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase mb-6"
            style={{ backgroundColor: `${BRAND.pink}20`, color: BRAND.pink, border: `1px solid ${BRAND.pink}40` }}
          >
            Contact Us
          </span>
          <h1 className="text-4xl font-black mb-4" style={{ color: BRAND.cream }}>
            Have a question?
          </h1>
          <p className="text-lg" style={{ color: BRAND.gray }}>
            Send us a message and our team will get back to you within 24-48 hours. 
            For urgent matters, call us directly.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Contact Info Sidebar */}
            <div className="md:col-span-1 space-y-6">
              <div className="p-4 rounded-xl" style={{ backgroundColor: BRAND.darkAlt, border: `1px solid ${BRAND.teal}20` }}>
                <p className="text-xs uppercase tracking-wider mb-2" style={{ color: BRAND.teal }}>Phone</p>
                <a href="tel:+16306366193" className="font-bold hover:underline" style={{ color: BRAND.cream }}>
                  (630) 636-6193
                </a>
              </div>
              <div className="p-4 rounded-xl" style={{ backgroundColor: BRAND.darkAlt, border: `1px solid ${BRAND.teal}20` }}>
                <p className="text-xs uppercase tracking-wider mb-2" style={{ color: BRAND.teal }}>Hours</p>
                <p className="text-sm" style={{ color: BRAND.cream }}>Mon-Fri: 9am - 5pm</p>
                <p className="text-sm" style={{ color: BRAND.gray }}>Messages answered within 24-48h</p>
              </div>
              <div className="p-4 rounded-xl" style={{ backgroundColor: BRAND.darkAlt, border: `1px solid ${BRAND.teal}20` }}>
                <p className="text-xs uppercase tracking-wider mb-2" style={{ color: BRAND.teal }}>Location</p>
                <p className="text-sm" style={{ color: BRAND.cream }}>Oswego, Illinois</p>
                <p className="text-sm" style={{ color: BRAND.gray }}>Telehealth available statewide</p>
              </div>
            </div>

            {/* Form */}
            <div className="md:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: BRAND.cream }}>
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border outline-none transition-colors"
                    style={{ 
                      backgroundColor: BRAND.darkAlt, 
                      borderColor: `${BRAND.teal}30`,
                      color: BRAND.cream,
                    }}
                    placeholder="Jane Smith"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: BRAND.cream }}>
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border outline-none transition-colors"
                      style={{ 
                        backgroundColor: BRAND.darkAlt, 
                        borderColor: `${BRAND.teal}30`,
                        color: BRAND.cream,
                      }}
                      placeholder="jane@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: BRAND.cream }}>
                      Phone (optional)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border outline-none transition-colors"
                      style={{ 
                        backgroundColor: BRAND.darkAlt, 
                        borderColor: `${BRAND.teal}30`,
                        color: BRAND.cream,
                      }}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: BRAND.cream }}>
                    Topic
                  </label>
                  <select
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border outline-none transition-colors"
                    style={{ 
                      backgroundColor: BRAND.darkAlt, 
                      borderColor: `${BRAND.teal}30`,
                      color: BRAND.cream,
                    }}
                  >
                    {TOPICS.map((t) => (
                      <option key={t.id} value={t.id}>{t.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: BRAND.cream }}>
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border outline-none transition-colors resize-none"
                    style={{ 
                      backgroundColor: BRAND.darkAlt, 
                      borderColor: `${BRAND.teal}30`,
                      color: BRAND.cream,
                    }}
                    placeholder="How can we help you?"
                  />
                </div>

                {error && (
                  <div className="p-4 rounded-lg" style={{ backgroundColor: `${BRAND.pink}15`, border: `1px solid ${BRAND.pink}40` }}>
                    <p className="text-sm" style={{ color: BRAND.pink }}>{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 font-bold rounded-lg transition-all hover:scale-[1.02] disabled:opacity-50"
                  style={{ backgroundColor: BRAND.pink, color: 'white' }}
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>

                <p className="text-xs text-center" style={{ color: BRAND.gray }}>
                  By submitting, you agree to our{' '}
                  <Link href="/privacy" className="underline" style={{ color: BRAND.teal }}>Privacy Policy</Link>.
                  We&apos;ll never share your information.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 px-6" style={{ backgroundColor: BRAND.darkAlt }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-xl font-bold mb-6" style={{ color: BRAND.cream }}>Looking for something specific?</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/learn" className="px-4 py-2 rounded-full text-sm font-medium border transition-colors hover:bg-white/5" style={{ borderColor: `${BRAND.teal}40`, color: BRAND.teal }}>
              Education Center
            </Link>
            <Link href="/providers" className="px-4 py-2 rounded-full text-sm font-medium border transition-colors hover:bg-white/5" style={{ borderColor: `${BRAND.teal}40`, color: BRAND.teal }}>
              Our Providers
            </Link>
            <Link href="/start" className="px-4 py-2 rounded-full text-sm font-medium border transition-colors hover:bg-white/5" style={{ borderColor: `${BRAND.pink}40`, color: BRAND.pink }}>
              Start a Visit
            </Link>
            <Link href="/account" className="px-4 py-2 rounded-full text-sm font-medium border transition-colors hover:bg-white/5" style={{ borderColor: `${BRAND.teal}40`, color: BRAND.teal }}>
              Patient Portal
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t" style={{ backgroundColor: BRAND.dark, borderColor: `${BRAND.teal}15` }}>
        <div className="max-w-4xl mx-auto text-center">
          <Image src="/images/regen/logo-full.png" alt="REGEN RX" width={100} height={35} className="h-7 w-auto mx-auto mb-4" />
          <p className="text-sm" style={{ color: BRAND.gray }}>
            REGEN RX by Hello Gorgeous Med Spa LLC · Oswego, Illinois
          </p>
        </div>
      </footer>
    </div>
  );
}
