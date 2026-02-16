'use client';

// ============================================================
// ADMIN SETTINGS - POLICIES
// Configure cancellation, booking, and operational rules
// ============================================================

import { useState } from 'react';
import Link from 'next/link';
import { 
  DEFAULT_CANCELLATION_POLICY, 
  DEFAULT_BOOKING_POLICY,
  type CancellationPolicy,
  type BookingPolicy,
} from '@/lib/hgos/policies';

export default function PoliciesSettingsPage() {
  const [cancellationPolicy, setCancellationPolicy] = useState<CancellationPolicy>(DEFAULT_CANCELLATION_POLICY);
  const [bookingPolicy, setBookingPolicy] = useState<BookingPolicy>(DEFAULT_BOOKING_POLICY);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // TODO: Save to Supabase
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/settings" className="text-sm text-black hover:text-black mb-1 inline-block">
            ← Back to Settings
          </Link>
          <h1 className="text-2xl font-bold text-black">Business Policies</h1>
          <p className="text-black">Configure cancellation, booking, and payment rules</p>
        </div>
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600"
        >
          {saved ? '✓ Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Cancellation Policy */}
      <div className="bg-white rounded-xl border border-black shadow-sm">
        <div className="px-6 py-4 border-b border-black">
          <h2 className="font-semibold text-black">Cancellation Policy</h2>
          <p className="text-sm text-black">Rules for client cancellations and no-shows</p>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Free Cancellation Window
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={cancellationPolicy.freeCancellationHours}
                  onChange={(e) => setCancellationPolicy({
                    ...cancellationPolicy,
                    freeCancellationHours: parseInt(e.target.value) || 0,
                  })}
                  className="w-24 px-4 py-2 border border-black rounded-lg"
                />
                <span className="text-black">hours before appointment</span>
              </div>
              <p className="text-xs text-black mt-1">
                Clients can cancel free of charge if they give this much notice
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Late Cancellation Fee
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={cancellationPolicy.lateCancellationFeePercent}
                  onChange={(e) => setCancellationPolicy({
                    ...cancellationPolicy,
                    lateCancellationFeePercent: parseInt(e.target.value) || 0,
                  })}
                  className="w-24 px-4 py-2 border border-black rounded-lg"
                />
                <span className="text-black">% of service price</span>
              </div>
              <p className="text-xs text-black mt-1">
                Fee charged when cancelling with less than {cancellationPolicy.freeCancellationHours} hours notice
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Reschedule Blocked Window
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={cancellationPolicy.rescheduleBlockedHours}
                  onChange={(e) => setCancellationPolicy({
                    ...cancellationPolicy,
                    rescheduleBlockedHours: parseInt(e.target.value) || 0,
                  })}
                  className="w-24 px-4 py-2 border border-black rounded-lg"
                />
                <span className="text-black">hours before appointment</span>
              </div>
              <p className="text-xs text-black mt-1">
                Online rescheduling blocked within this window (must call)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Max No-Shows Before Flag
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={cancellationPolicy.maxNoShows}
                  onChange={(e) => setCancellationPolicy({
                    ...cancellationPolicy,
                    maxNoShows: parseInt(e.target.value) || 0,
                  })}
                  className="w-24 px-4 py-2 border border-black rounded-lg"
                />
                <span className="text-black">no-shows</span>
              </div>
              <p className="text-xs text-black mt-1">
                Client account flagged after this many no-shows
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Policy Message (shown to clients)
            </label>
            <textarea
              value={cancellationPolicy.clientMessage}
              onChange={(e) => setCancellationPolicy({
                ...cancellationPolicy,
                clientMessage: e.target.value,
              })}
              rows={4}
              className="w-full px-4 py-2 border border-black rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Booking Policy */}
      <div className="bg-white rounded-xl border border-black shadow-sm">
        <div className="px-6 py-4 border-b border-black">
          <h2 className="font-semibold text-black">Booking Policy</h2>
          <p className="text-sm text-black">Rules for appointment scheduling</p>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Max Advance Booking
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={bookingPolicy.maxAdvanceBookingDays}
                  onChange={(e) => setBookingPolicy({
                    ...bookingPolicy,
                    maxAdvanceBookingDays: parseInt(e.target.value) || 0,
                  })}
                  className="w-24 px-4 py-2 border border-black rounded-lg"
                />
                <span className="text-black">days in advance</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Minimum Notice Required
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={bookingPolicy.minNoticeHours}
                  onChange={(e) => setBookingPolicy({
                    ...bookingPolicy,
                    minNoticeHours: parseInt(e.target.value) || 0,
                  })}
                  className="w-24 px-4 py-2 border border-black rounded-lg"
                />
                <span className="text-black">hours minimum</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Deposit Amount
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={bookingPolicy.depositPercent}
                  onChange={(e) => setBookingPolicy({
                    ...bookingPolicy,
                    depositPercent: parseInt(e.target.value) || 0,
                  })}
                  className="w-24 px-4 py-2 border border-black rounded-lg"
                />
                <span className="text-black">% of service price</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Deposit Required When Service Over
              </label>
              <div className="flex items-center gap-2">
                <span className="text-black">$</span>
                <input
                  type="number"
                  value={bookingPolicy.depositThresholdAmount}
                  onChange={(e) => setBookingPolicy({
                    ...bookingPolicy,
                    depositThresholdAmount: parseInt(e.target.value) || 0,
                  })}
                  className="w-32 px-4 py-2 border border-black rounded-lg"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={bookingPolicy.allowNewClientOnlineBooking}
                onChange={(e) => setBookingPolicy({
                  ...bookingPolicy,
                  allowNewClientOnlineBooking: e.target.checked,
                })}
                className="rounded border-black"
              />
              <span className="text-black">Allow new clients to book online</span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={bookingPolicy.requireFirstTimeConsultation}
                onChange={(e) => setBookingPolicy({
                  ...bookingPolicy,
                  requireFirstTimeConsultation: e.target.checked,
                })}
                className="rounded border-black"
              />
              <span className="text-black">Require consultation for first-time clients</span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={bookingPolicy.requireDepositNewClients}
                onChange={(e) => setBookingPolicy({
                  ...bookingPolicy,
                  requireDepositNewClients: e.target.checked,
                })}
                className="rounded border-black"
              />
              <span className="text-black">Require deposit from new clients</span>
            </label>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl border border-pink-100 p-6">
        <h3 className="font-semibold text-black mb-3">📋 Policy Preview (What Clients See)</h3>
        <div className="bg-white rounded-lg p-4 text-sm text-black">
          <p>{cancellationPolicy.clientMessage}</p>
        </div>
      </div>
    </div>
  );
}
