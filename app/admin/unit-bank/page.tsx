'use client';

// ═══════════════════════════════════════════════════════════════
// HG REWARDS — Staff Screen
// Credit & redeem points for clients at checkout
// Earn: $1 spent = 5 pts (Bronze) / 7 pts (Gold) / 10 pts (Platinum)
// Redeem: 100 pts = $1 off any service (except memberships)
// hellogorgeousmedspa.com/admin/unit-bank
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface Client {
  id: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  email: string | null;
  total_visits: number;
}

interface UnitTransaction {
  id: string;
  type: 'earned' | 'redeemed' | 'bonus' | 'adjusted';
  units: number;
  balance_after: number;
  note: string | null;
  toxin: string | null;
  units_purchased: number | null;
  created_at: string;
  created_by: string | null;
}

interface UnitBalance {
  balance: number;
  total_earned: number;
  total_redeemed: number;
  history: UnitTransaction[];
}

const TOXINS = [
  { id: 'botox',    label: 'Botox',           emoji: '💉' },
  { id: 'dysport',  label: 'Dysport',          emoji: '⚡' },
  { id: 'jeuveau',  label: 'Jeuveau #Newtox',  emoji: '✨' },
  { id: 'xeomin',   label: 'Xeomin',           emoji: '🧬' },
  { id: 'daxxify',  label: 'Daxxify',          emoji: '👑' },
];

// Points per dollar spent by tier
const EARN_RATES: Record<string, number> = {
  bronze: 5, gold: 7, platinum: 10,
};
const POINTS_PER_DOLLAR_REDEMPTION = 100; // 100 pts = $1

function getTierFromVisits(visits: number): 'bronze' | 'gold' | 'platinum' {
  if (visits >= 20) return 'platinum';
  if (visits >= 10) return 'gold';
  return 'bronze';
}

function getTierLabel(tier: string) {
  return { bronze: '🥉 Bronze', gold: '🥇 Gold', platinum: '💎 Platinum' }[tier] ?? '🥉 Bronze';
}

function calcPointsEarned(dollarsSpent: number, tier: string): number {
  return Math.floor(dollarsSpent * (EARN_RATES[tier] ?? 5));
}

function pointsToDollars(pts: number): string {
  return (pts / POINTS_PER_DOLLAR_REDEMPTION).toFixed(2);
}

export default function UnitBankStaffPage() {
  const [query, setQuery] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState<Client | null>(null);
  const [balance, setBalance] = useState<UnitBalance | null>(null);
  const [loadingBalance, setLoadingBalance] = useState(false);

  // Earn form
  const [earnUnits, setEarnUnits] = useState('');
  const [earnToxin, setEarnToxin] = useState('botox');
  const [earnNote, setEarnNote] = useState('');
  const [earning, setEarning] = useState(false);
  const [earnResult, setEarnResult] = useState<string | null>(null);

  // Redeem form
  const [redeemUnits, setRedeemUnits] = useState('');
  const [redeeming, setRedeeming] = useState(false);
  const [redeemResult, setRedeemResult] = useState<string | null>(null);

  // Bonus form
  const [bonusUnits, setBonusUnits] = useState('');
  const [bonusNote, setBonusNote] = useState('');
  const [bonusing, setBonusing] = useState(false);

  const [activeTab, setActiveTab] = useState<'earn' | 'redeem' | 'bonus'>('earn');
  const searchRef = useRef<HTMLInputElement>(null);

  // Search clients
  useEffect(() => {
    if (query.length < 2) { setClients([]); return; }
    const t = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`/api/clients?search=${encodeURIComponent(query)}&limit=6`);
        const data = await res.json();
        // /api/clients returns { clients: [...] } or an array directly
        setClients(Array.isArray(data) ? data : (data.clients ?? []));
      } catch { setClients([]); }
      setSearching(false);
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  // Load balance when client selected
  async function selectClient(client: Client) {
    setSelected(client);
    setClients([]);
    setQuery('');
    setEarnResult(null);
    setRedeemResult(null);
    setLoadingBalance(true);
    try {
      const res = await fetch(`/api/app/unit-bank/balance?client_id=${client.id}`);
      const data = await res.json();
      setBalance(data);
    } catch { setBalance(null); }
    setLoadingBalance(false);
  }

  async function handleEarn(e: React.FormEvent) {
    e.preventDefault();
    if (!selected || !earnUnits) return;
    setEarning(true);
    setEarnResult(null);
    const tier = getTierFromVisits(selected.total_visits ?? 0);
    const res = await fetch('/api/app/unit-bank/earn', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: selected.id,
        dollars_spent: Number(earnUnits),
        service: earnToxin,
        tier,
        note: earnNote || `$${earnUnits} spent · ${TOXINS.find(t => t.id === earnToxin)?.label ?? earnToxin}`,
        created_by: 'staff',
      }),
    });
    const data = await res.json();
    setEarnResult(data.message ?? data.error ?? 'Done');
    if (res.ok) {
      setEarnUnits('');
      setEarnNote('');
      // Refresh balance
      const b = await fetch(`/api/app/unit-bank/balance?client_id=${selected.id}`);
      setBalance(await b.json());
    }
    setEarning(false);
  }

  async function handleRedeem(e: React.FormEvent) {
    e.preventDefault();
    if (!selected || !redeemUnits) return;
    setRedeeming(true);
    setRedeemResult(null);
    const res = await fetch('/api/app/unit-bank/redeem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: selected.id,
        points_to_redeem: Number(redeemUnits),
        created_by: 'staff',
      }),
    });
    const data = await res.json();
    setRedeemResult(data.message ?? data.error ?? 'Done');
    if (res.ok) {
      setRedeemUnits('');
      const b = await fetch(`/api/app/unit-bank/balance?client_id=${selected.id}`);
      setBalance(await b.json());
    }
    setRedeeming(false);
  }

  async function handleBonus(e: React.FormEvent) {
    e.preventDefault();
    if (!selected || !bonusUnits) return;
    setBonusing(true);
    const currentBalance = balance?.balance ?? 0;
    const newBalance = currentBalance + Number(bonusUnits);
    const res = await fetch('/api/app/unit-bank/earn', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: selected.id,
        units_purchased: 0,
        toxin: null,
        tier: 'bronze',
        note: bonusNote || 'Bonus points added by staff',
        created_by: 'staff — bonus',
        _override_points: Number(bonusUnits),
      }),
    });
    // Refresh
    const b = await fetch(`/api/app/unit-bank/balance?client_id=${selected.id}`);
    setBalance(await b.json());
    setBonusUnits('');
    setBonusNote('');
    setBonusing(false);
  }

  const tier = selected ? getTierFromVisits(selected.total_visits ?? 0) : 'bronze';
  const previewEarned = earnUnits ? calcPointsEarned(Number(earnUnits), tier) : 0;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 max-w-xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black">🌟 HG Rewards</h1>
          <p className="text-xs text-gray-400 mt-0.5">Credit & redeem points · $1 spent = 5 pts · 100 pts = $1 off</p>
        </div>
        <Link href="/admin" className="text-xs text-gray-500 hover:text-white">← Admin</Link>
      </div>

      {/* Client Search */}
      <div className="relative mb-6">
        <input
          ref={searchRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search client by name, phone, or email…"
          className="w-full rounded-xl bg-gray-800 border border-gray-700 px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pink-500"
        />
        {searching && (
          <p className="absolute right-3 top-3 text-xs text-gray-500">Searching…</p>
        )}
        {clients.length > 0 && (
          <div className="absolute z-20 w-full mt-1 rounded-xl bg-gray-800 border border-gray-700 overflow-hidden shadow-xl">
            {clients.map(c => (
              <button key={c.id} type="button" onClick={() => selectClient(c)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-700 text-left transition">
                <div className="w-9 h-9 rounded-full bg-pink-600 flex items-center justify-center text-sm font-bold shrink-0">
                  {c.first_name?.[0]}{c.last_name?.[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold">{c.first_name} {c.last_name}</p>
                  <p className="text-xs text-gray-400">{c.phone ?? c.email ?? 'No contact'} · {c.total_visits ?? 0} visits</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected Client */}
      {selected && (
        <div className="space-y-4">
          {/* Client Card */}
          <div className="rounded-2xl p-4 flex items-center gap-4"
            style={{ background: 'rgba(255,45,142,0.1)', border: '1px solid rgba(255,45,142,0.3)' }}>
            <div className="w-12 h-12 rounded-full bg-pink-600 flex items-center justify-center text-lg font-black shrink-0">
              {selected.first_name?.[0]}{selected.last_name?.[0]}
            </div>
            <div className="flex-1">
              <p className="font-bold text-lg">{selected.first_name} {selected.last_name}</p>
              <p className="text-xs text-gray-400">{selected.phone ?? selected.email} · {getTierLabel(tier)} · {selected.total_visits ?? 0} visits</p>
            </div>
            <button onClick={() => { setSelected(null); setBalance(null); }}
              className="text-gray-500 hover:text-white text-xl">✕</button>
          </div>

          {/* Balance Card */}
          {loadingBalance ? (
            <div className="rounded-2xl p-6 bg-gray-800 text-center text-gray-400 text-sm">Loading balance…</div>
          ) : balance && (
            <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Points Balance</p>
                  <p className="text-5xl font-black text-white">{balance.balance.toLocaleString()}</p>
                  <p className="text-sm mt-1" style={{ color: balance.balance > 0 ? '#FF2D8E' : 'rgba(255,255,255,0.4)' }}>
                    {balance.balance > 0 ? `$${pointsToDollars(balance.balance)} value · ready to use!` : 'No points yet'}
                  </p>
                </div>
                <div className="text-right text-xs text-gray-500 space-y-1">
                  <p>Total earned: <span className="text-green-400">{balance.total_earned}</span></p>
                  <p>Total redeemed: <span className="text-red-400">{balance.total_redeemed}</span></p>
                </div>
              </div>

              {/* Last 5 transactions */}
              {balance.history.length > 0 && (
                <div className="mt-4 space-y-2 border-t border-white/10 pt-3">
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">Recent activity</p>
                  {balance.history.slice(0, 5).map((tx, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <div>
                        <span className="text-white">
                          {tx.type === 'earned' ? '💰' : tx.type === 'redeemed' ? '✅' : '🎁'}{' '}
                          {tx.note ?? tx.type}
                        </span>
                        <span className="text-gray-500 ml-2">{new Date(tx.created_at).toLocaleDateString()}</span>
                      </div>
                      <span className={tx.units > 0 ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>
                        {tx.units > 0 ? '+' : ''}{tx.units.toLocaleString()} pts
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab Switcher */}
          <div className="grid grid-cols-3 gap-2">
            {(['earn', 'redeem', 'bonus'] as const).map(t => (
              <button key={t} onClick={() => setActiveTab(t)}
                className="rounded-xl py-2 text-sm font-bold capitalize transition"
                style={activeTab === t
                  ? { background: '#FF2D8E', color: 'white' }
                  : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}>
                {t === 'earn' ? '💰 Earn' : t === 'redeem' ? '✅ Redeem' : '🎁 Bonus'}
              </button>
            ))}
          </div>

          {/* EARN FORM */}
          {activeTab === 'earn' && (
            <form onSubmit={handleEarn} className="rounded-2xl p-5 space-y-4"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div>
                <p className="text-sm font-bold mb-1">Amount charged today ($)</p>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                  <input type="number" min="1" max="5000" value={earnUnits}
                    onChange={e => setEarnUnits(e.target.value)}
                    placeholder="e.g. 250"
                    className="w-full rounded-xl bg-gray-800 border border-gray-700 pl-8 pr-4 py-3 text-white text-lg font-bold focus:outline-none focus:border-pink-500" />
                </div>
                {earnUnits && Number(earnUnits) > 0 && (
                  <p className="mt-1 text-xs" style={{ color: '#FF2D8E' }}>
                    {getTierLabel(tier)} → <strong>+{previewEarned.toLocaleString()} points</strong> ({EARN_RATES[tier]} pts/$1)
                    {' '}= <strong>${pointsToDollars(previewEarned)} value</strong>
                  </p>
                )}
              </div>

              <div>
                <p className="text-sm font-bold mb-2">Service / toxin used</p>
                <div className="grid grid-cols-5 gap-2">
                  {TOXINS.map(tx => (
                    <button key={tx.id} type="button" onClick={() => setEarnToxin(tx.id)}
                      className="rounded-xl py-2 text-center text-xs font-bold transition flex flex-col items-center gap-1"
                      style={earnToxin === tx.id
                        ? { background: '#FF2D8E', color: 'white' }
                        : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)' }}>
                      <span className="text-lg">{tx.emoji}</span>
                      <span className="text-[10px]">{tx.label.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-bold mb-1">Note <span className="text-gray-500 font-normal">(optional)</span></p>
                <input type="text" value={earnNote} onChange={e => setEarnNote(e.target.value)}
                  placeholder="e.g. 20u Botox forehead + 11s"
                  className="w-full rounded-xl bg-gray-800 border border-gray-700 px-4 py-2 text-sm text-white focus:outline-none focus:border-pink-500" />
              </div>

              {earnResult && (
                <div className={`rounded-xl px-4 py-3 text-sm font-semibold ${earnResult.includes('error') || earnResult.includes('Error') ? 'bg-red-900/40 text-red-300' : 'bg-green-900/40 text-green-300'}`}>
                  {earnResult}
                </div>
              )}

              <button type="submit" disabled={earning || !earnUnits || previewEarned === 0}
                className="w-full rounded-xl py-3 font-bold text-white transition disabled:opacity-40"
                style={{ background: '#FF2D8E' }}>
                {earning ? 'Crediting…' : previewEarned > 0 ? `✨ Credit ${previewEarned.toLocaleString()} points ($${pointsToDollars(previewEarned)} value)` : 'Enter amount above'}
              </button>
            </form>
          )}

          {/* REDEEM FORM */}
          {activeTab === 'redeem' && (
            <form onSubmit={handleRedeem} className="rounded-2xl p-5 space-y-4"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="rounded-xl p-3 text-sm"
                style={{ background: 'rgba(255,45,142,0.1)', border: '1px solid rgba(255,45,142,0.2)' }}>
                <p className="text-pink-300 font-semibold">
                  Available: <strong className="text-white">{(balance?.balance ?? 0).toLocaleString()} points</strong>
                  {(balance?.balance ?? 0) > 0 && <span className="text-pink-400"> (${pointsToDollars(balance?.balance ?? 0)} off)</span>}
                </p>
              </div>

              <div>
                <p className="text-sm font-bold mb-1">Points to redeem</p>
                <input type="number" min="100" step="100" max={balance?.balance ?? 0} value={redeemUnits}
                  onChange={e => setRedeemUnits(e.target.value)}
                  placeholder={`100–${(balance?.balance ?? 0).toLocaleString()}`}
                  className="w-full rounded-xl bg-gray-800 border border-gray-700 px-4 py-3 text-white text-lg font-bold focus:outline-none focus:border-pink-500" />
                <p className="text-[11px] text-gray-500 mt-1">100 pts = $1 off · enter in multiples of 100</p>
                {redeemUnits && Number(redeemUnits) >= 100 && (
                  <p className="mt-1 text-xs text-green-400">
                    = <strong>${pointsToDollars(Number(redeemUnits))} off</strong> their service today
                  </p>
                )}
              </div>

              {redeemResult && (
                <div className={`rounded-xl px-4 py-3 text-sm font-semibold ${redeemResult.includes('nsufficien') ? 'bg-red-900/40 text-red-300' : 'bg-green-900/40 text-green-300'}`}>
                  {redeemResult}
                </div>
              )}

              <button type="submit" disabled={redeeming || !redeemUnits || Number(redeemUnits) > (balance?.balance ?? 0) || Number(redeemUnits) < 100}
                className="w-full rounded-xl py-3 font-bold text-white transition disabled:opacity-40"
                style={{ background: '#22c55e' }}>
                {redeeming ? 'Processing…' : `✅ Redeem ${redeemUnits ? Number(redeemUnits).toLocaleString() : '?'} pts${redeemUnits && Number(redeemUnits) >= 100 ? ` ($${pointsToDollars(Number(redeemUnits))} off)` : ''}`}
              </button>
            </form>
          )}

          {/* BONUS FORM */}
          {activeTab === 'bonus' && (
            <form onSubmit={handleBonus} className="rounded-2xl p-5 space-y-4"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="text-xs text-gray-400">Add bonus points for special occasions — Google review (500), birthday (500), referral (500), Instagram follow (100), VIP thank you, etc.</p>
              <div>
                <p className="text-sm font-bold mb-1">Bonus points to add</p>
                <input type="number" min="100" step="100" max="5000" value={bonusUnits}
                  onChange={e => setBonusUnits(e.target.value)}
                  placeholder="e.g. 500"
                  className="w-full rounded-xl bg-gray-800 border border-gray-700 px-4 py-3 text-white text-lg font-bold focus:outline-none focus:border-pink-500" />
              </div>
              <div>
                <p className="text-sm font-bold mb-1">Reason</p>
                <input type="text" value={bonusNote} onChange={e => setBonusNote(e.target.value)}
                  placeholder="e.g. Birthday bonus, Referral reward, VIP thank you"
                  className="w-full rounded-xl bg-gray-800 border border-gray-700 px-4 py-2 text-sm text-white focus:outline-none focus:border-pink-500" />
              </div>
              <button type="submit" disabled={bonusing || !bonusUnits}
                className="w-full rounded-xl py-3 font-bold text-white transition disabled:opacity-40"
                style={{ background: 'linear-gradient(90deg, #7B4FFF, #4F9FFF)' }}>
                {bonusing ? 'Adding…' : `🎁 Add ${bonusUnits ? Number(bonusUnits).toLocaleString() : '?'} bonus pts${bonusUnits ? ` ($${pointsToDollars(Number(bonusUnits))})` : ''}`}
              </button>
            </form>
          )}
        </div>
      )}

      {/* Empty state */}
      {!selected && (
        <div className="rounded-2xl p-8 text-center"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="text-4xl mb-3">🌟</p>
          <p className="font-bold text-white mb-1">Search for a client above</p>
          <p className="text-sm text-gray-400">Credit points after service · Redeem at checkout · Add bonus points anytime</p>
          <div className="mt-4 rounded-xl p-3 text-xs text-left space-y-1"
            style={{ background: 'rgba(255,45,142,0.08)', border: '1px solid rgba(255,45,142,0.2)' }}>
            <p className="font-bold text-white mb-2">Earn rates (pts per $1 spent)</p>
            {[
              { tier: '🥉 Bronze', rate: '5 pts/$1', pct: '5% back' },
              { tier: '🥇 Gold', rate: '7 pts/$1', pct: '7% back' },
              { tier: '💎 Platinum', rate: '10 pts/$1', pct: '10% back' },
            ].map(r => (
              <div key={r.tier} className="flex items-center justify-between">
                <span className="text-gray-300">{r.tier}</span>
                <span style={{ color: '#FF2D8E' }}>{r.rate} <span className="text-gray-500">({r.pct})</span></span>
              </div>
            ))}
            <p className="text-gray-500 pt-2 border-t border-white/10">100 pts = $1 off · works on all services except memberships</p>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            {[
              { label: '⭐ Google review', pts: '500 pts = $5' },
              { label: '💜 Referral', pts: '500 pts = $5' },
              { label: '🎂 Birthday', pts: '500 pts = $5' },
              { label: '📲 Instagram follow', pts: '100 pts = $1' },
            ].map(b => (
              <div key={b.label} className="rounded-xl px-3 py-2"
                style={{ background: 'rgba(255,255,255,0.04)' }}>
                <p className="text-gray-300">{b.label}</p>
                <p style={{ color: '#FF2D8E' }}>{b.pts}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
