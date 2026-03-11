'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NewCampaignPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [channel, setChannel] = useState('sms');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/marketing/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), channel, status: 'draft' }),
      });
      if (!res.ok) throw new Error('Failed to create');
      router.push('/admin/marketing?tab=campaigns');
    } catch {
      setError('Failed to create campaign');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/marketing" className="text-black hover:underline">← Marketing</Link>
        <span className="text-black">/</span>
        <span className="font-semibold text-black">New campaign</span>
      </div>
      <h1 className="text-xl font-bold text-black mb-4">New campaign</h1>
      <p className="text-black text-sm mb-4">
        This creates a draft campaign. To <strong>send SMS live via Twilio</strong>, use{' '}
        <Link href="/admin/sms" className="text-[#2D63A4] font-medium underline">SMS Campaigns</Link>.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="p-2 bg-red-50 border border-red-200 rounded text-red-800 text-sm">{error}</div>}
        <div>
          <label className="block text-sm font-medium text-black mb-1">Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border border-black rounded-lg text-black" placeholder="e.g. Spring Botox Promo" />
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-1">Channel</label>
          <select value={channel} onChange={(e) => setChannel(e.target.value)} className="w-full px-3 py-2 border border-black rounded-lg text-black bg-white">
            <option value="sms">SMS</option>
            <option value="email">Email</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button type="submit" disabled={saving} className="px-4 py-2 bg-[#2D63A4] text-white font-medium rounded-lg disabled:opacity-50">{saving ? 'Creating…' : 'Create'}</button>
          <Link href="/admin/marketing" className="px-4 py-2 border border-black text-black font-medium rounded-lg hover:bg-gray-50">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
