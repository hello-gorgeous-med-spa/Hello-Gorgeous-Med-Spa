'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function PortalLoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [devLink, setDevLink] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/portal/auth/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setSent(true);
        if (data._dev_link) setDevLink(data._dev_link);
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch {
      setError('Failed to send login link');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <span className="text-5xl">💗</span>
          <h1 className="text-2xl font-bold text-white mt-4">Check Your Email</h1>
          <p className="text-white/70 mt-2">We sent a secure login link to <strong className="text-[#FF2D8E]">{email}</strong></p>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mt-6">
            <p className="text-white/70 text-sm mb-4">Click the link in your email to sign in. The link expires in 15 minutes.</p>
            <button onClick={() => { setSent(false); setDevLink(''); }} className="text-[#FF2D8E] hover:underline text-sm">Try again</button>
            {devLink && (
              <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <p className="text-yellow-400 text-xs mb-2">DEV MODE - Click to login:</p>
                <Link href={devLink.replace('https://www.hellogorgeousmedspa.com', '')} className="text-[#FF2D8E] text-sm break-all hover:underline">{devLink}</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <span className="text-5xl">💗</span>
          <h1 className="text-2xl font-bold text-white mt-4">Welcome Back</h1>
          <p className="text-white/70 mt-2">Sign in to your Hello Gorgeous patient portal</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">Email Address</label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="your@email.com" className="w-full px-4 py-3 bg-black border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#FF2D8E]/50 focus:border-[#FF2D8E]" />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button type="submit" disabled={loading} className="w-full bg-[#FF2D8E] text-white py-3 px-4 rounded-xl font-semibold hover:bg-[#FF2D8E]/90 disabled:opacity-50 transition-all">
              {loading ? 'Sending...' : 'Send Login Link'}
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-white/50 text-sm">No password needed. We will send you a secure magic link.</p>
          </div>
          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-white/70 text-sm">New patient? <Link href="/book" className="text-[#FF2D8E] hover:underline">Book your first appointment</Link></p>
          </div>
        </div>
        <div className="mt-8 flex items-center justify-center gap-4 text-xs text-white/50">
          <span>🔒 HIPAA Compliant</span>
          <span>🛡️ 256-bit Encryption</span>
        </div>
      </div>
    </div>
  );
}
