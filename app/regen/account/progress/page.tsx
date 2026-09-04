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

interface WeightEntry {
  id: string;
  weight: number;
  date: string;
  notes?: string;
}

export default function ProgressPage() {
  const { user } = useRegenAuth();
  const [entries, setEntries] = useState<WeightEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // New entry form
  const [newWeight, setNewWeight] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [showForm, setShowForm] = useState(false);

  const fetchEntries = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/regen/patient/progress');
      if (res.ok) {
        const data = await res.json();
        setEntries(data.entries || []);
      }
    } catch (error) {
      console.error('Failed to fetch progress:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWeight) return;

    setSaving(true);
    try {
      const res = await fetch('/api/regen/patient/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weight: parseFloat(newWeight),
          notes: newNotes,
        }),
      });

      if (res.ok) {
        setNewWeight('');
        setNewNotes('');
        setShowForm(false);
        fetchEntries();
      }
    } catch (error) {
      console.error('Failed to save entry:', error);
    } finally {
      setSaving(false);
    }
  };

  // Calculate stats
  const stats = {
    current: entries[0]?.weight || 0,
    start: entries[entries.length - 1]?.weight || 0,
    lost: entries.length > 1 ? (entries[entries.length - 1]?.weight || 0) - (entries[0]?.weight || 0) : 0,
    entries: entries.length,
  };

  // Chart data (simple bar representation)
  const maxWeight = Math.max(...entries.map(e => e.weight), 1);
  const minWeight = Math.min(...entries.map(e => e.weight), maxWeight - 10);
  const chartRange = maxWeight - minWeight + 10;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: BRAND.cream }}>Progress Tracker</h1>
          <p style={{ color: BRAND.gray }}>Track your weight loss journey.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
          style={{ backgroundColor: BRAND.pink, color: 'white' }}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Log Weight
        </button>
      </div>

      {/* Stats Cards */}
      {entries.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div 
            className="p-5 rounded-xl text-center"
            style={{ backgroundColor: BRAND.darkCard, border: `1px solid ${BRAND.teal}30` }}
          >
            <p className="text-3xl font-bold" style={{ color: BRAND.cream }}>{stats.current}</p>
            <p className="text-sm" style={{ color: BRAND.gray }}>Current (lbs)</p>
          </div>
          <div 
            className="p-5 rounded-xl text-center"
            style={{ backgroundColor: BRAND.darkCard, border: `1px solid ${BRAND.teal}30` }}
          >
            <p className="text-3xl font-bold" style={{ color: BRAND.cream }}>{stats.start}</p>
            <p className="text-sm" style={{ color: BRAND.gray }}>Starting (lbs)</p>
          </div>
          <div 
            className="p-5 rounded-xl text-center"
            style={{ backgroundColor: stats.lost > 0 ? '#22C55E20' : BRAND.darkCard, border: `1px solid ${stats.lost > 0 ? '#22C55E' : BRAND.teal}30` }}
          >
            <p className="text-3xl font-bold" style={{ color: stats.lost > 0 ? '#22C55E' : BRAND.cream }}>
              {stats.lost > 0 ? `-${stats.lost.toFixed(1)}` : stats.lost.toFixed(1)}
            </p>
            <p className="text-sm" style={{ color: BRAND.gray }}>Lost (lbs)</p>
          </div>
          <div 
            className="p-5 rounded-xl text-center"
            style={{ backgroundColor: BRAND.darkCard, border: `1px solid ${BRAND.teal}30` }}
          >
            <p className="text-3xl font-bold" style={{ color: BRAND.cream }}>{stats.entries}</p>
            <p className="text-sm" style={{ color: BRAND.gray }}>Entries</p>
          </div>
        </div>
      )}

      {/* Chart */}
      {entries.length > 1 && (
        <div 
          className="p-6 rounded-xl"
          style={{ backgroundColor: BRAND.darkCard, border: `1px solid ${BRAND.teal}20` }}
        >
          <h2 className="text-lg font-semibold mb-6" style={{ color: BRAND.cream }}>Weight Over Time</h2>
          <div className="relative h-48">
            <div className="absolute inset-0 flex items-end justify-between gap-1">
              {entries.slice().reverse().slice(-14).map((entry, idx) => {
                const height = ((entry.weight - minWeight + 5) / chartRange) * 100;
                return (
                  <div key={entry.id} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs" style={{ color: BRAND.gray }}>{entry.weight}</span>
                    <div 
                      className="w-full rounded-t transition-all"
                      style={{ 
                        height: `${Math.max(height, 10)}%`,
                        backgroundColor: idx === entries.length - 1 ? BRAND.pink : BRAND.teal,
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs" style={{ color: BRAND.gray }}>
              {new Date(entries[entries.length - 1]?.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
            <span className="text-xs" style={{ color: BRAND.gray }}>
              {new Date(entries[0]?.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>
      )}

      {/* Entry History */}
      <div 
        className="rounded-xl overflow-hidden"
        style={{ backgroundColor: BRAND.darkCard, border: `1px solid ${BRAND.teal}20` }}
      >
        <div className="p-4 border-b" style={{ borderColor: `${BRAND.teal}20` }}>
          <h2 className="font-semibold" style={{ color: BRAND.cream }}>History</h2>
        </div>
        
        {loading && (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full mx-auto" />
          </div>
        )}

        {!loading && entries.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-4xl mb-4">📊</p>
            <p style={{ color: BRAND.gray }}>No entries yet. Log your first weight!</p>
          </div>
        )}

        {!loading && entries.length > 0 && (
          <div className="divide-y" style={{ borderColor: `${BRAND.teal}10` }}>
            {entries.map((entry, idx) => {
              const prevEntry = entries[idx + 1];
              const change = prevEntry ? entry.weight - prevEntry.weight : 0;
              
              return (
                <div key={entry.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-lg" style={{ color: BRAND.cream }}>{entry.weight} lbs</p>
                    <p className="text-sm" style={{ color: BRAND.gray }}>
                      {new Date(entry.date).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                    {entry.notes && (
                      <p className="text-sm mt-1" style={{ color: BRAND.gray }}>{entry.notes}</p>
                    )}
                  </div>
                  {change !== 0 && (
                    <span 
                      className="px-3 py-1 rounded-full text-sm font-medium"
                      style={{ 
                        backgroundColor: change < 0 ? '#22C55E20' : '#EF444420',
                        color: change < 0 ? '#22C55E' : '#EF4444',
                      }}
                    >
                      {change > 0 ? '+' : ''}{change.toFixed(1)} lbs
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Log Weight Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div 
            className="w-full max-w-md rounded-2xl overflow-hidden"
            style={{ backgroundColor: '#111111', border: `1px solid ${BRAND.teal}30` }}
          >
            <div className="p-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${BRAND.teal}20` }}>
              <h2 className="text-lg font-bold" style={{ color: BRAND.cream }}>Log Weight</h2>
              <button onClick={() => setShowForm(false)} className="text-2xl" style={{ color: BRAND.gray }}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: BRAND.gray }}>Weight (lbs)</label>
                <input
                  type="number"
                  step="0.1"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  placeholder="185.5"
                  className="w-full px-4 py-3 rounded-lg text-2xl font-bold text-center focus:outline-none focus:ring-2"
                  style={{ backgroundColor: BRAND.darkCard, border: `1px solid ${BRAND.teal}30`, color: BRAND.cream }}
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: BRAND.gray }}>Notes (optional)</label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="How are you feeling?"
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
                  style={{ backgroundColor: BRAND.darkCard, border: `1px solid ${BRAND.teal}30`, color: BRAND.cream }}
                />
              </div>
              <button
                type="submit"
                disabled={!newWeight || saving}
                className="w-full px-4 py-3 rounded-lg font-semibold disabled:opacity-50"
                style={{ backgroundColor: BRAND.teal, color: 'white' }}
              >
                {saving ? 'Saving...' : 'Save Entry'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
