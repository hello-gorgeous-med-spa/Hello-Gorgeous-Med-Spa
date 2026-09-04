'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRegenAuth } from '@/components/regen/RegenAuthProvider';

const BRAND = {
  teal: '#0D9488',
  pink: '#E91E8C',
  darkCard: '#1A1A1A',
  cream: '#FAF9F6',
  gray: '#9CA3AF',
};

interface PatientProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
}

export default function SettingsPage() {
  const { user, signOut } = useRegenAuth();
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('IL');
  const [zip, setZip] = useState('');

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/regen/patient/dashboard');
      if (res.ok) {
        const data = await res.json();
        if (data.patient) {
          setProfile(data.patient);
          setName(data.patient.name || '');
          setPhone(data.patient.phone || '');
          setDob(data.patient.date_of_birth || '');
          if (data.patient.address) {
            setStreet(data.patient.address.street || '');
            setCity(data.patient.address.city || '');
            setState(data.patient.address.state || 'IL');
            setZip(data.patient.address.zip || '');
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/regen/patient/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          date_of_birth: dob,
          address: { street, city, state, zip },
        }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        fetchProfile();
      } else {
        setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
      }
    } catch (error) {
      console.error('Failed to save profile:', error);
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="p-12 rounded-xl text-center" style={{ backgroundColor: BRAND.darkCard }}>
        <div className="animate-spin w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full mx-auto" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold" style={{ color: BRAND.cream }}>Settings</h1>
        <p style={{ color: BRAND.gray }}>Manage your account and personal information.</p>
      </div>

      {/* Message */}
      {message && (
        <div 
          className="p-4 rounded-lg"
          style={{ 
            backgroundColor: message.type === 'success' ? '#22C55E20' : '#EF444420',
            border: `1px solid ${message.type === 'success' ? '#22C55E' : '#EF4444'}40`,
            color: message.type === 'success' ? '#22C55E' : '#EF4444',
          }}
        >
          {message.text}
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleSave} className="space-y-6">
        <div 
          className="rounded-xl p-6"
          style={{ backgroundColor: BRAND.darkCard, border: `1px solid ${BRAND.teal}20` }}
        >
          <h2 className="text-lg font-semibold mb-4" style={{ color: BRAND.cream }}>Personal Information</h2>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: BRAND.gray }}>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
                style={{ 
                  backgroundColor: '#0A0A0A', 
                  border: `1px solid ${BRAND.teal}30`,
                  color: BRAND.cream,
                }}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: BRAND.gray }}>Email</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-3 rounded-lg opacity-60 cursor-not-allowed"
                style={{ 
                  backgroundColor: '#0A0A0A', 
                  border: `1px solid ${BRAND.gray}30`,
                  color: BRAND.gray,
                }}
              />
              <p className="text-xs mt-1" style={{ color: BRAND.gray }}>Contact support to change email</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: BRAND.gray }}>Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(555) 555-5555"
                className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
                style={{ 
                  backgroundColor: '#0A0A0A', 
                  border: `1px solid ${BRAND.teal}30`,
                  color: BRAND.cream,
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: BRAND.gray }}>Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
                style={{ 
                  backgroundColor: '#0A0A0A', 
                  border: `1px solid ${BRAND.teal}30`,
                  color: BRAND.cream,
                }}
              />
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div 
          className="rounded-xl p-6"
          style={{ backgroundColor: BRAND.darkCard, border: `1px solid ${BRAND.teal}20` }}
        >
          <h2 className="text-lg font-semibold mb-4" style={{ color: BRAND.cream }}>Shipping Address</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: BRAND.gray }}>Street Address</label>
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="123 Main St"
                className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
                style={{ 
                  backgroundColor: '#0A0A0A', 
                  border: `1px solid ${BRAND.teal}30`,
                  color: BRAND.cream,
                }}
              />
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: BRAND.gray }}>City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
                  style={{ 
                    backgroundColor: '#0A0A0A', 
                    border: `1px solid ${BRAND.teal}30`,
                    color: BRAND.cream,
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: BRAND.gray }}>State</label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
                  style={{ 
                    backgroundColor: '#0A0A0A', 
                    border: `1px solid ${BRAND.teal}30`,
                    color: BRAND.cream,
                  }}
                >
                  <option value="IL">Illinois</option>
                </select>
                <p className="text-xs mt-1" style={{ color: BRAND.gray }}>IL residents only</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: BRAND.gray }}>ZIP Code</label>
                <input
                  type="text"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  placeholder="60543"
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
                  style={{ 
                    backgroundColor: '#0A0A0A', 
                    border: `1px solid ${BRAND.teal}30`,
                    color: BRAND.cream,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          disabled={saving}
          className="w-full px-6 py-4 rounded-lg font-bold transition-all hover:scale-[1.02] disabled:opacity-50"
          style={{ backgroundColor: BRAND.teal, color: 'white' }}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      {/* Danger Zone */}
      <div 
        className="rounded-xl p-6"
        style={{ backgroundColor: '#1A0A0A', border: '1px solid #EF444430' }}
      >
        <h2 className="text-lg font-semibold mb-4" style={{ color: '#EF4444' }}>Account</h2>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="font-medium" style={{ color: BRAND.cream }}>Sign out of your account</p>
            <p className="text-sm" style={{ color: BRAND.gray }}>You'll need to sign in again to access your portal.</p>
          </div>
          <button
            onClick={handleSignOut}
            className="px-6 py-3 rounded-lg font-medium transition-all hover:scale-105"
            style={{ backgroundColor: '#EF444420', color: '#EF4444', border: '1px solid #EF444440' }}
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Support */}
      <div 
        className="rounded-xl p-6"
        style={{ backgroundColor: BRAND.darkCard, border: `1px solid ${BRAND.teal}20` }}
      >
        <h2 className="text-lg font-semibold mb-4" style={{ color: BRAND.cream }}>Need Help?</h2>
        <div className="flex flex-wrap gap-4">
          <a
            href="tel:+16306366193"
            className="flex items-center gap-2 px-4 py-3 rounded-lg transition-all hover:scale-105"
            style={{ backgroundColor: `${BRAND.teal}20`, color: BRAND.teal }}
          >
            📞 (630) 636-6193
          </a>
          <a
            href="mailto:hello@tryregenrx.com"
            className="flex items-center gap-2 px-4 py-3 rounded-lg transition-all hover:scale-105"
            style={{ backgroundColor: `${BRAND.teal}20`, color: BRAND.teal }}
          >
            ✉️ hello@tryregenrx.com
          </a>
        </div>
      </div>
    </div>
  );
}
