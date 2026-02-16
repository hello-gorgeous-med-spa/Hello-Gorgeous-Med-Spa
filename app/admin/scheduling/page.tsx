// ============================================================
// ADMIN: SMART SCHEDULING SETTINGS
// Aesthetic Record-style scheduling configuration
// ============================================================

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface SchedulingSettings {
  // Lead Time
  lead_time_hours: number;
  max_advance_booking_days: number;
  booking_increment_minutes: number;
  buffer_between_appointments: number;

  // Cancellation Policy
  cancellation_hours: number;
  cancellation_fee_percent: number;
  require_card_for_booking: boolean;

  // Service Deposits
  default_deposit_percent: number;
  deposits_enabled: boolean;

  // Online Booking
  online_booking_enabled: boolean;
  allow_same_day_booking: boolean;
  new_client_deposit_required: boolean;
}

const DEFAULT_SETTINGS: SchedulingSettings = {
  lead_time_hours: 2,
  max_advance_booking_days: 90,
  booking_increment_minutes: 15,
  buffer_between_appointments: 0,
  cancellation_hours: 24,
  cancellation_fee_percent: 50,
  require_card_for_booking: false,
  default_deposit_percent: 25,
  deposits_enabled: false,
  online_booking_enabled: true,
  allow_same_day_booking: true,
  new_client_deposit_required: false,
};

export default function SchedulingSettingsPage() {
  const [settings, setSettings] = useState<SchedulingSettings>(DEFAULT_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.settings) {
        setSettings(prev => ({ ...prev, ...data.settings }));
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      });
      
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-white rounded w-1/3" />
          <div className="h-64 bg-white rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-black flex items-center gap-3">
            <span className="text-3xl">📅</span>
            Smart Scheduling
          </h1>
          <p className="text-black mt-1">Configure booking rules, cancellation policy, and deposits</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`px-6 py-2.5 rounded-xl font-medium transition-all ${
            saved 
              ? 'bg-green-500 text-white' 
              : 'bg-[#FF2D8E] text-white hover:bg-black'
          }`}
        >
          {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-6">
        {/* Online Booking Settings */}
        <div className="bg-white rounded-xl border border-black overflow-hidden">
          <div className="p-5 border-b border-black bg-gradient-to-r from-blue-50 to-white">
            <h2 className="font-semibold text-black flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white">🌐</span>
              Online Booking
            </h2>
            <p className="text-sm text-black mt-1">Control who can book and when</p>
          </div>
          <div className="p-5 space-y-4">
            <label className="flex items-center justify-between p-3 bg-white rounded-lg">
              <div>
                <p className="font-medium text-black">Enable Online Booking</p>
                <p className="text-sm text-black">Allow patients to book appointments online</p>
              </div>
              <input
                type="checkbox"
                checked={settings.online_booking_enabled}
                onChange={(e) => setSettings({ ...settings, online_booking_enabled: e.target.checked })}
                className="w-5 h-5 rounded border-black text-[#FF2D8E] focus:ring-pink-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-white rounded-lg">
              <div>
                <p className="font-medium text-black">Allow Same-Day Booking</p>
                <p className="text-sm text-black">Patients can book appointments for today</p>
              </div>
              <input
                type="checkbox"
                checked={settings.allow_same_day_booking}
                onChange={(e) => setSettings({ ...settings, allow_same_day_booking: e.target.checked })}
                className="w-5 h-5 rounded border-black text-[#FF2D8E] focus:ring-pink-500"
              />
            </label>
          </div>
        </div>

        {/* Lead Time & Increments */}
        <div className="bg-white rounded-xl border border-black overflow-hidden">
          <div className="p-5 border-b border-black bg-gradient-to-r from-purple-50 to-white">
            <h2 className="font-semibold text-black flex items-center gap-2">
              <span className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-white">⏱️</span>
              Scheduling Rules
            </h2>
            <p className="text-sm text-black mt-1">Set lead time and booking increments</p>
          </div>
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Minimum Lead Time (hours)
              </label>
              <input
                type="number"
                value={settings.lead_time_hours}
                onChange={(e) => setSettings({ ...settings, lead_time_hours: parseInt(e.target.value) || 0 })}
                min={0}
                max={72}
                className="w-full px-4 py-2 border border-black rounded-xl focus:ring-2 focus:ring-pink-500"
              />
              <p className="text-xs text-black mt-1">How far in advance patients must book</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Max Advance Booking (days)
              </label>
              <input
                type="number"
                value={settings.max_advance_booking_days}
                onChange={(e) => setSettings({ ...settings, max_advance_booking_days: parseInt(e.target.value) || 30 })}
                min={7}
                max={365}
                className="w-full px-4 py-2 border border-black rounded-xl focus:ring-2 focus:ring-pink-500"
              />
              <p className="text-xs text-black mt-1">How far in advance patients can book</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Booking Increment (minutes)
              </label>
              <select
                value={settings.booking_increment_minutes}
                onChange={(e) => setSettings({ ...settings, booking_increment_minutes: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-black rounded-xl focus:ring-2 focus:ring-pink-500"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>60 minutes</option>
              </select>
              <p className="text-xs text-black mt-1">Time slot intervals shown to patients</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Buffer Between Appointments (min)
              </label>
              <input
                type="number"
                value={settings.buffer_between_appointments}
                onChange={(e) => setSettings({ ...settings, buffer_between_appointments: parseInt(e.target.value) || 0 })}
                min={0}
                max={60}
                className="w-full px-4 py-2 border border-black rounded-xl focus:ring-2 focus:ring-pink-500"
              />
              <p className="text-xs text-black mt-1">Extra time between appointments</p>
            </div>
          </div>
        </div>

        {/* Cancellation Policy */}
        <div className="bg-white rounded-xl border border-black overflow-hidden">
          <div className="p-5 border-b border-black bg-gradient-to-r from-red-50 to-white">
            <h2 className="font-semibold text-black flex items-center gap-2">
              <span className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center text-white">🚫</span>
              Cancellation Policy
            </h2>
            <p className="text-sm text-black mt-1">Protect provider time with cancellation fees</p>
          </div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Free Cancellation Window (hours)
                </label>
                <input
                  type="number"
                  value={settings.cancellation_hours}
                  onChange={(e) => setSettings({ ...settings, cancellation_hours: parseInt(e.target.value) || 24 })}
                  min={0}
                  max={168}
                  className="w-full px-4 py-2 border border-black rounded-xl focus:ring-2 focus:ring-pink-500"
                />
                <p className="text-xs text-black mt-1">Hours before appointment for free cancellation</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Late Cancellation Fee (%)
                </label>
                <input
                  type="number"
                  value={settings.cancellation_fee_percent}
                  onChange={(e) => setSettings({ ...settings, cancellation_fee_percent: parseInt(e.target.value) || 0 })}
                  min={0}
                  max={100}
                  className="w-full px-4 py-2 border border-black rounded-xl focus:ring-2 focus:ring-pink-500"
                />
                <p className="text-xs text-black mt-1">Percentage of service price charged</p>
              </div>
            </div>

            <label className="flex items-center justify-between p-3 bg-white rounded-lg">
              <div>
                <p className="font-medium text-black">Require Card on File</p>
                <p className="text-sm text-black">Collect card details at booking to enforce policy</p>
              </div>
              <input
                type="checkbox"
                checked={settings.require_card_for_booking}
                onChange={(e) => setSettings({ ...settings, require_card_for_booking: e.target.checked })}
                className="w-5 h-5 rounded border-black text-[#FF2D8E] focus:ring-pink-500"
              />
            </label>

            {/* Policy Preview */}
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="font-medium text-amber-900 mb-2">Policy Preview</p>
              <p className="text-sm text-amber-800">
                "Cancellations made less than {settings.cancellation_hours} hours before your appointment 
                will incur a {settings.cancellation_fee_percent}% cancellation fee."
              </p>
            </div>
          </div>
        </div>

        {/* Service Deposits */}
        <div className="bg-white rounded-xl border border-black overflow-hidden">
          <div className="p-5 border-b border-black bg-gradient-to-r from-green-50 to-white">
            <h2 className="font-semibold text-black flex items-center gap-2">
              <span className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white">💳</span>
              Service Deposits
            </h2>
            <p className="text-sm text-black mt-1">Collect deposits at booking to reduce no-shows</p>
          </div>
          <div className="p-5 space-y-4">
            <label className="flex items-center justify-between p-3 bg-white rounded-lg">
              <div>
                <p className="font-medium text-black">Enable Service Deposits</p>
                <p className="text-sm text-black">Collect partial payment at booking</p>
              </div>
              <input
                type="checkbox"
                checked={settings.deposits_enabled}
                onChange={(e) => setSettings({ ...settings, deposits_enabled: e.target.checked })}
                className="w-5 h-5 rounded border-black text-[#FF2D8E] focus:ring-pink-500"
              />
            </label>

            {settings.deposits_enabled && (
              <>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Default Deposit Percentage
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={settings.default_deposit_percent}
                      onChange={(e) => setSettings({ ...settings, default_deposit_percent: parseInt(e.target.value) || 0 })}
                      min={0}
                      max={100}
                      className="w-24 px-4 py-2 border border-black rounded-xl focus:ring-2 focus:ring-pink-500"
                    />
                    <span className="text-black">%</span>
                  </div>
                  <p className="text-xs text-black mt-1">Can be overridden per service</p>
                </div>

                <label className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div>
                    <p className="font-medium text-black">Require Deposit for New Clients</p>
                    <p className="text-sm text-black">First-time patients must pay deposit</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.new_client_deposit_required}
                    onChange={(e) => setSettings({ ...settings, new_client_deposit_required: e.target.checked })}
                    className="w-5 h-5 rounded border-black text-[#FF2D8E] focus:ring-pink-500"
                  />
                </label>

                <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                  <p className="font-medium text-green-900 mb-2">How Deposits Work</p>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Patient pays {settings.default_deposit_percent}% at booking via Square</li>
                    <li>• Deposit is stored in their Patient Wallet</li>
                    <li>• Applied automatically at checkout</li>
                    <li>• Non-refundable if they no-show or late cancel</li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/staff/schedule"
            className="p-5 bg-white rounded-xl border border-black hover:border-pink-200 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                👤
              </div>
              <div>
                <h3 className="font-semibold text-black">Provider Schedules</h3>
                <p className="text-sm text-black">Set working hours & availability</p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/waitlist"
            className="p-5 bg-white rounded-xl border border-black hover:border-pink-200 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                📋
              </div>
              <div>
                <h3 className="font-semibold text-black">Waitlist</h3>
                <p className="text-sm text-black">Manage patient waitlist</p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/calendar"
            className="p-5 bg-white rounded-xl border border-black hover:border-pink-200 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                📅
              </div>
              <div>
                <h3 className="font-semibold text-black">Calendar</h3>
                <p className="text-sm text-black">View & manage appointments</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
