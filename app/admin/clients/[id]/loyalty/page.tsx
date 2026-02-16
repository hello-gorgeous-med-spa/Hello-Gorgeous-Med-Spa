'use client';

// ============================================================
// CLIENT LOYALTY & REWARDS PAGE
// Track Allē, Aspire, Evolus rewards for each client
// ============================================================

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface LoyaltyProgram {
  id: string;
  name: string;
  logo: string;
  color: string;
  description: string;
  enrollUrl: string;
  providerPortal: string;
}

interface ClientLoyalty {
  program_id: string;
  member_id: string;
  points_balance?: number;
  tier?: string;
  enrolled_at?: string;
  last_updated?: string;
}

const LOYALTY_PROGRAMS: LoyaltyProgram[] = [
  {
    id: 'alle',
    name: 'Allē (Allergan)',
    logo: '💎',
    color: 'bg-gradient-to-r from-purple-500 to-pink-500',
    description: 'Earn points on Botox, Juvederm, Kybella, Latisse, SkinMedica',
    enrollUrl: 'https://www.alle.com/',
    providerPortal: 'https://provider.alle.com/',
  },
  {
    id: 'aspire',
    name: 'Aspire (Galderma)',
    logo: '✨',
    color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
    description: 'Earn points on Dysport, Restylane, Sculptra',
    enrollUrl: 'https://www.aspirerewardsprogram.com/',
    providerPortal: 'https://portal.galdermausa.com/',
  },
  {
    id: 'evolus',
    name: 'Evolus Rewards',
    logo: '🌟',
    color: 'bg-gradient-to-r from-teal-500 to-green-500',
    description: 'Earn points on Jeuveau treatments',
    enrollUrl: 'https://www.evolus.com/rewards/',
    providerPortal: 'https://providers.evolus.com/',
  },
];

export default function ClientLoyaltyPage() {
  const params = useParams();
  const clientId = params.id as string;
  
  const [client, setClient] = useState<any>(null);
  const [loyaltyData, setLoyaltyData] = useState<ClientLoyalty[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Form state for adding/editing
  const [editingProgram, setEditingProgram] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    member_id: '',
    points_balance: '',
    tier: '',
  });

  // Fetch client and loyalty data
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch client
        const clientRes = await fetch(`/api/clients/${clientId}`);
        if (clientRes.ok) {
          const data = await clientRes.json();
          setClient(data.client);
        }

        // Fetch loyalty data
        const loyaltyRes = await fetch(`/api/clients/${clientId}/loyalty`);
        if (loyaltyRes.ok) {
          const data = await loyaltyRes.json();
          setLoyaltyData(data.loyalty || []);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [clientId]);

  // Save loyalty info
  const handleSave = async (programId: string) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/clients/${clientId}/loyalty`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          program_id: programId,
          member_id: formData.member_id,
          points_balance: formData.points_balance ? parseInt(formData.points_balance) : null,
          tier: formData.tier || null,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setLoyaltyData(prev => {
          const existing = prev.findIndex(l => l.program_id === programId);
          if (existing >= 0) {
            const updated = [...prev];
            updated[existing] = data.loyalty;
            return updated;
          }
          return [...prev, data.loyalty];
        });
        setMessage({ type: 'success', text: 'Loyalty info saved!' });
        setEditingProgram(null);
        setFormData({ member_id: '', points_balance: '', tier: '' });
      } else {
        setMessage({ type: 'error', text: 'Failed to save' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save' });
    }
    setSaving(false);
    setTimeout(() => setMessage(null), 3000);
  };

  // Start editing
  const startEdit = (program: LoyaltyProgram) => {
    const existing = loyaltyData.find(l => l.program_id === program.id);
    setEditingProgram(program.id);
    setFormData({
      member_id: existing?.member_id || '',
      points_balance: existing?.points_balance?.toString() || '',
      tier: existing?.tier || '',
    });
  };

  // Remove loyalty entry
  const handleRemove = async (programId: string) => {
    if (!confirm('Remove this loyalty program from client?')) return;
    
    try {
      const res = await fetch(`/api/clients/${clientId}/loyalty?program_id=${programId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setLoyaltyData(prev => prev.filter(l => l.program_id !== programId));
        setMessage({ type: 'success', text: 'Removed' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to remove' });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF2D8E]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-black mb-1">
            <Link href={`/admin/clients/${clientId}`} className="hover:text-pink-600">
              ← Back to {client?.first_name} {client?.last_name}
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-black">Loyalty & Rewards</h1>
          <p className="text-black">Track manufacturer reward programs for this client</p>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 
          'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Loyalty Programs */}
      <div className="space-y-4">
        {LOYALTY_PROGRAMS.map(program => {
          const enrolled = loyaltyData.find(l => l.program_id === program.id);
          const isEditing = editingProgram === program.id;

          return (
            <div key={program.id} className="bg-white rounded-xl border border-black overflow-hidden">
              {/* Header */}
              <div className={`${program.color} px-6 py-4 text-white`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{program.logo}</span>
                    <div>
                      <h3 className="font-bold text-lg">{program.name}</h3>
                      <p className="text-sm opacity-90">{program.description}</p>
                    </div>
                  </div>
                  {enrolled && !isEditing && (
                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                      ✓ Enrolled
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">
                        Member ID / Account Number *
                      </label>
                      <input
                        type="text"
                        value={formData.member_id}
                        onChange={(e) => setFormData({ ...formData, member_id: e.target.value })}
                        className="w-full px-4 py-2 border border-black rounded-lg"
                        placeholder="Enter member ID"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">
                          Points Balance (optional)
                        </label>
                        <input
                          type="number"
                          value={formData.points_balance}
                          onChange={(e) => setFormData({ ...formData, points_balance: e.target.value })}
                          className="w-full px-4 py-2 border border-black rounded-lg"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">
                          Tier (optional)
                        </label>
                        <input
                          type="text"
                          value={formData.tier}
                          onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                          className="w-full px-4 py-2 border border-black rounded-lg"
                          placeholder="e.g., Gold, Platinum"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => handleSave(program.id)}
                        disabled={!formData.member_id || saving}
                        className="px-4 py-2 bg-[#FF2D8E] text-white font-medium rounded-lg hover:bg-black disabled:opacity-50"
                      >
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={() => {
                          setEditingProgram(null);
                          setFormData({ member_id: '', points_balance: '', tier: '' });
                        }}
                        className="px-4 py-2 text-black font-medium hover:bg-white rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : enrolled ? (
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-black">Member ID</p>
                      <p className="font-mono font-medium text-black">{enrolled.member_id}</p>
                      {enrolled.points_balance !== undefined && (
                        <p className="text-sm text-black">
                          Points: <span className="font-semibold text-green-600">{enrolled.points_balance.toLocaleString()}</span>
                        </p>
                      )}
                      {enrolled.tier && (
                        <p className="text-sm text-black">
                          Tier: <span className="font-semibold">{enrolled.tier}</span>
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(program)}
                        className="px-3 py-1.5 text-sm text-black hover:text-pink-600 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleRemove(program.id)}
                        className="px-3 py-1.5 text-sm text-red-600 hover:text-red-700 font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="text-black">Not enrolled yet</p>
                    <div className="flex gap-3">
                      <a
                        href={program.enrollUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 text-sm text-black border border-black rounded-lg hover:bg-white"
                      >
                        Patient Signup ↗
                      </a>
                      <button
                        onClick={() => startEdit(program)}
                        className="px-4 py-2 text-sm bg-[#FF2D8E] text-white font-medium rounded-lg hover:bg-black"
                      >
                        + Add Member ID
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Provider Portals */}
      <div className="bg-white rounded-xl p-6 border border-black">
        <h3 className="font-semibold text-black mb-3">Provider Portals</h3>
        <p className="text-sm text-black mb-4">
          Access manufacturer portals to verify points, submit treatments, and manage your practice account.
        </p>
        <div className="flex flex-wrap gap-3">
          {LOYALTY_PROGRAMS.map(program => (
            <a
              key={program.id}
              href={program.providerPortal}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-white border border-black rounded-lg hover:bg-white text-sm font-medium"
            >
              {program.logo} {program.name} Portal ↗
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
