'use client';

// ============================================================
// JOIN WAITLIST PAGE
// Public page for clients to join waitlist
// ============================================================

import { useState } from 'react';
import Link from 'next/link';

export default function WaitlistPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    serviceId: '',
    providerId: '',
    preferredDate: '',
    preferredTimeRange: 'any' as 'morning' | 'afternoon' | 'any',
    flexibleDates: true,
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Mock services - would come from Supabase
  const services = [
    { id: 'botox', name: 'Botox/Dysport' },
    { id: 'filler', name: 'Dermal Fillers' },
    { id: 'weight-loss', name: 'Weight Loss (Semaglutide/Tirzepatide)' },
    { id: 'facial', name: 'Signature Facial' },
    { id: 'iv-therapy', name: 'IV Therapy' },
  ];

  const providers = [
    { id: '', name: 'Any Provider' },
    { id: 'p1', name: 'Ryan Kent, APRN' },
    { id: 'p2', name: 'Danielle Glazier-Alcala' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Save to Supabase
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsComplete(true);
    } catch (error) {
      console.error('Error joining waitlist:', error);
      alert('There was an error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <span className="text-5xl mb-4 block">🎉</span>
          <h1 className="text-2xl font-bold text-black mb-2">You're on the Waitlist!</h1>
          <p className="text-black mb-6">
            We'll notify you as soon as a spot opens up for your preferred service. 
            You'll have 30 minutes to confirm your booking once notified.
          </p>
          <div className="space-y-3">
            <Link
              href="/book"
              className="block w-full px-6 py-3 bg-[#FF2D8E] text-white font-medium rounded-lg hover:bg-black"
            >
              Browse Available Times
            </Link>
            <Link
              href="/"
              className="block w-full px-6 py-3 border border-black text-black font-medium rounded-lg hover:bg-white"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-12 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Join the Waitlist</h1>
          <p className="text-black">
            Can't find your preferred time? Join our waitlist and we'll notify you 
            when a spot opens up.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-black mb-1">First Name *</label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-4 py-2 border border-black rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">Last Name *</label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-4 py-2 border border-black rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">Email *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-black rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">Phone *</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 border border-black rounded-lg"
              placeholder="(630) 555-1234"
            />
          </div>

          {/* Service Selection */}
          <div>
            <label className="block text-sm font-medium text-black mb-1">Service *</label>
            <select
              required
              value={formData.serviceId}
              onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
              className="w-full px-4 py-2 border border-black rounded-lg"
            >
              <option value="">Select a service...</option>
              {services.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">Provider Preference</label>
            <select
              value={formData.providerId}
              onChange={(e) => setFormData({ ...formData, providerId: e.target.value })}
              className="w-full px-4 py-2 border border-black rounded-lg"
            >
              {providers.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Date Preferences */}
          <div>
            <label className="block text-sm font-medium text-black mb-1">Preferred Date</label>
            <input
              type="date"
              value={formData.preferredDate}
              onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2 border border-black rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">Preferred Time</label>
            <select
              value={formData.preferredTimeRange}
              onChange={(e) => setFormData({ ...formData, preferredTimeRange: e.target.value as any })}
              className="w-full px-4 py-2 border border-black rounded-lg"
            >
              <option value="any">Any time</option>
              <option value="morning">Morning (before 12pm)</option>
              <option value="afternoon">Afternoon (12pm or later)</option>
            </select>
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.flexibleDates}
              onChange={(e) => setFormData({ ...formData, flexibleDates: e.target.checked })}
              className="rounded text-[#FF2D8E]"
            />
            <span className="text-sm text-black">I'm flexible on dates (notify me of any openings)</span>
          </label>

          <div>
            <label className="block text-sm font-medium text-black mb-1">Notes (optional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2 border border-black rounded-lg"
              rows={2}
              placeholder="Any special requests or notes..."
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-3 bg-[#FF2D8E] text-white font-medium rounded-lg hover:bg-black disabled:opacity-50"
          >
            {isSubmitting ? 'Joining...' : 'Join Waitlist'}
          </button>

          <p className="text-xs text-black text-center">
            When a spot opens up, you'll receive an email and text. 
            You'll have 30 minutes to confirm before we notify the next person.
          </p>
        </form>

        <div className="mt-6 text-center">
          <Link href="/book" className="text-[#FF2D8E] hover:underline">
            ← Back to booking
          </Link>
        </div>
      </div>
    </div>
  );
}
