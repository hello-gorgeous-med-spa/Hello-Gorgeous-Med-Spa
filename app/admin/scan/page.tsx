'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

type ClientInfo = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  total_visits: number | null;
  tier: string | null;
};

type Voucher = {
  id: string;
  code: string;
  purchase_amount: number;
  credit_amount: number;
  remaining_balance: number;
  status: string;
  purchased_at: string;
};

type ScanResult = {
  type: 'client' | 'voucher';
  client: ClientInfo | null;
  points_balance: number;
  vouchers: Voucher[];
  voucher?: Voucher; // when scanning a voucher directly
};

type ActionState =
  | { kind: 'idle' }
  | { kind: 'redeem_points' }
  | { kind: 'apply_voucher'; voucher_id: string }
  | { kind: 'success'; message: string };

export default function ScanPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [scanBuffer, setScanBuffer] = useState('');
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [action, setAction] = useState<ActionState>({ kind: 'idle' });
  const [actionAmount, setActionAmount] = useState('');
  const [selectedVoucherId, setSelectedVoucherId] = useState('');
  const [actionNote, setActionNote] = useState('');
  const [staffName, setStaffName] = useState('');
  const [actionBusy, setActionBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [updatedData, setUpdatedData] = useState<{ points?: number; vouchers?: Voucher[] } | null>(null);

  // Keep input focused
  const refocus = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    refocus();
    const interval = setInterval(refocus, 2000);
    return () => clearInterval(interval);
  }, [refocus]);

  const handleScan = useCallback(async (code: string) => {
    const trimmed = code.trim();
    if (!trimmed) return;
    setLoading(true);
    setError(null);
    setScanResult(null);
    setAction({ kind: 'idle' });
    setUpdatedData(null);
    try {
      const res = await fetch(`/api/admin/scan/lookup?code=${encodeURIComponent(trimmed)}`);
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Lookup failed'); return; }
      setScanResult(data as ScanResult);
    } catch {
      setError('Network error. Try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      handleScan(scanBuffer);
      setScanBuffer('');
    }
  }

  function reset() {
    setScanResult(null);
    setError(null);
    setAction({ kind: 'idle' });
    setScanBuffer('');
    setActionAmount('');
    setActionNote('');
    setSelectedVoucherId('');
    setActionError(null);
    setUpdatedData(null);
    setTimeout(refocus, 100);
  }

  async function submitRedeemPoints() {
    if (!scanResult?.client) return;
    const amount = parseInt(actionAmount);
    if (isNaN(amount) || amount <= 0) { setActionError('Enter a valid amount'); return; }
    setActionBusy(true); setActionError(null);
    try {
      // Use unit_bank redeem endpoint
      const res = await fetch('/api/app/unit-bank/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: scanResult.client.id,
          units: amount,
          note: actionNote || `Redeemed by staff${staffName ? ' — ' + staffName : ''}`,
          redeemed_by: staffName || 'staff',
        }),
      });
      const data = await res.json();
      if (!res.ok) { setActionError(data.error || 'Redemption failed'); return; }
      setUpdatedData({ points: data.balance ?? (scanResult.points_balance - amount) });
      setAction({ kind: 'success', message: `✓ ${amount} points redeemed! New balance: ${data.balance ?? '—'} pts` });
    } catch { setActionError('Network error'); }
    finally { setActionBusy(false); }
  }

  async function submitApplyVoucher() {
    const voucherId = selectedVoucherId || action.kind === 'apply_voucher' && (action as { kind: 'apply_voucher'; voucher_id: string }).voucher_id;
    if (!voucherId) { setActionError('Select a voucher'); return; }
    const amount = parseInt(actionAmount);
    if (isNaN(amount) || amount <= 0) { setActionError('Enter a valid amount'); return; }
    setActionBusy(true); setActionError(null);
    try {
      const res = await fetch('/api/app/vouchers/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voucher_id: voucherId,
          amount_to_redeem: amount,
          redeemed_by: staffName || 'staff',
          note: actionNote || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setActionError(data.error || 'Redemption failed'); return; }
      const newVouchers = (scanResult?.vouchers ?? []).map(v =>
        v.id === voucherId ? data.voucher : v
      ).filter(v => v.status === 'active');
      setUpdatedData({ vouchers: newVouchers });
      setAction({ kind: 'success', message: `✓ $${amount} applied! Remaining balance: $${data.voucher.remaining_balance}` });
    } catch { setActionError('Network error'); }
    finally { setActionBusy(false); }
  }

  const displayVouchers = updatedData?.vouchers ?? scanResult?.vouchers ?? [];
  const displayPoints = updatedData?.points ?? scanResult?.points_balance ?? 0;
  const client = scanResult?.client;

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col" onClick={refocus}>
      {/* Hidden scanner input */}
      <input
        ref={inputRef}
        type="text"
        value={scanBuffer}
        onChange={e => setScanBuffer(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => setTimeout(refocus, 150)}
        className="absolute opacity-0 w-0 h-0 pointer-events-none"
        aria-label="Scanner input"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
      />

      {/* Staff name input at top */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-black tracking-tight" style={{ color: '#FF2D8E' }}>Scan Client</h1>
          <p className="text-sm text-white/40 mt-0.5">Point Bluetooth scanner at client QR code or voucher</p>
        </div>
        <div>
          <input
            type="text"
            placeholder="Your name (optional)"
            value={staffName}
            onChange={e => setStaffName(e.target.value)}
            className="rounded-xl px-3 py-2 text-sm bg-white/10 border border-white/15 text-white placeholder-white/30 focus:outline-none focus:border-pink-500"
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        {!scanResult && !loading && !error && (
          <div className="text-center max-w-md">
            <div className="text-8xl mb-6">📷</div>
            <h2 className="text-4xl font-black mb-3 tracking-tight" style={{ color: '#FF2D8E' }}>
              READY TO SCAN
            </h2>
            <p className="text-white/40 text-lg">
              Waiting for scanner input…
            </p>
            {scanBuffer && (
              <p className="mt-4 text-xs text-white/20 font-mono">Buffering: {scanBuffer}</p>
            )}
            {/* Manual entry fallback */}
            <div className="mt-8 flex gap-2">
              <input
                type="text"
                value={scanBuffer}
                onChange={e => setScanBuffer(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Or type code manually + Enter"
                className="flex-1 rounded-xl px-4 py-3 bg-white/10 border border-white/15 text-white placeholder-white/30 focus:outline-none focus:border-pink-500 text-sm"
              />
              <button
                type="button"
                onClick={() => { handleScan(scanBuffer); setScanBuffer(''); }}
                className="rounded-xl px-4 py-3 text-sm font-bold text-white"
                style={{ background: '#FF2D8E' }}
              >
                Go
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center">
            <div className="text-5xl mb-4 animate-pulse">🔍</div>
            <p className="text-xl text-white/60">Looking up client…</p>
          </div>
        )}

        {error && (
          <div className="text-center max-w-sm">
            <div className="text-5xl mb-4">⚠️</div>
            <p className="text-xl font-semibold text-red-400 mb-6">{error}</p>
            <button type="button" onClick={reset} className="rounded-2xl px-8 py-4 text-lg font-bold text-white" style={{ background: '#FF2D8E' }}>
              Scan Next Client
            </button>
          </div>
        )}

        {scanResult && client && (
          <div className="w-full max-w-lg space-y-4">
            {/* Client card */}
            <div className="rounded-3xl p-6" style={{ background: 'rgba(255,45,142,0.1)', border: '1px solid rgba(255,45,142,0.3)' }}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-black text-white">
                    {client.first_name} {client.last_name}
                  </h2>
                  <p className="text-white/40 text-sm mt-0.5">{client.email} · {client.phone}</p>
                </div>
                <div className="text-right">
                  <span className="inline-block rounded-full px-3 py-1 text-xs font-bold uppercase"
                    style={{ background: 'rgba(255,45,142,0.2)', color: '#FF2D8E', border: '1px solid rgba(255,45,142,0.3)' }}>
                    {client.tier ?? 'Bronze'}
                  </span>
                  <p className="text-white/40 text-xs mt-1">{client.total_visits ?? 0} visits</p>
                </div>
              </div>

              {/* Points balance */}
              <div className="rounded-2xl p-4 mb-3" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🌟</span>
                    <div>
                      <p className="text-xs text-white/40 uppercase tracking-wider font-bold">HG Rewards Points</p>
                      <p className="text-2xl font-black text-white">{displayPoints.toLocaleString()} pts</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold" style={{ color: '#FF2D8E' }}>${(displayPoints / 100).toFixed(2)}</p>
                    <p className="text-xs text-white/30">value</p>
                  </div>
                </div>
              </div>

              {/* Vouchers */}
              {displayVouchers.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-white/40 uppercase tracking-wider font-bold px-1">Active Vouchers</p>
                  {displayVouchers.map(v => (
                    <div key={v.id} className="rounded-xl p-3 flex items-center justify-between"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <div>
                        <p className="text-sm font-bold text-white font-mono">{v.code}</p>
                        <p className="text-xs text-white/40">Purchased ${v.purchase_amount} → ${v.credit_amount} credit</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-black" style={{ color: '#4ade80' }}>${v.remaining_balance}</p>
                        <p className="text-xs text-white/30">remaining</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action area */}
            {action.kind === 'idle' && (
              <div className="grid grid-cols-2 gap-3">
                {displayPoints >= 100 && (
                  <button type="button"
                    onClick={() => { setAction({ kind: 'redeem_points' }); setActionAmount(''); setActionError(null); }}
                    className="rounded-2xl py-5 text-lg font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #FF2D8E, #c0185e)' }}>
                    🌟 Redeem Points
                  </button>
                )}
                {displayVouchers.length > 0 && (
                  <button type="button"
                    onClick={() => {
                      const firstVoucherId = displayVouchers[0].id;
                      setAction({ kind: 'apply_voucher', voucher_id: firstVoucherId });
                      setSelectedVoucherId(firstVoucherId);
                      setActionAmount('');
                      setActionError(null);
                    }}
                    className="rounded-2xl py-5 text-lg font-bold text-white col-span-1"
                    style={{ background: 'linear-gradient(135deg, #7B4FFF, #4F9FFF)' }}>
                    💳 Apply Voucher
                  </button>
                )}
              </div>
            )}

            {/* Redeem Points form */}
            {action.kind === 'redeem_points' && (
              <div className="rounded-2xl p-5 space-y-3" style={{ background: 'rgba(255,45,142,0.08)', border: '1px solid rgba(255,45,142,0.25)' }}>
                <h3 className="text-lg font-bold" style={{ color: '#FF2D8E' }}>Redeem Points</h3>
                <p className="text-sm text-white/50">Balance: {displayPoints.toLocaleString()} pts · ${(displayPoints / 100).toFixed(2)}</p>
                <input type="number" placeholder="Points to redeem (e.g. 500)"
                  value={actionAmount} onChange={e => setActionAmount(e.target.value)}
                  className="w-full rounded-xl px-4 py-3 bg-white/10 border border-white/15 text-white text-lg focus:outline-none focus:border-pink-500"
                />
                <input type="text" placeholder="Note (optional)"
                  value={actionNote} onChange={e => setActionNote(e.target.value)}
                  className="w-full rounded-xl px-4 py-3 bg-white/10 border border-white/15 text-white text-sm focus:outline-none focus:border-pink-500"
                />
                {actionAmount && !isNaN(parseInt(actionAmount)) && (
                  <p className="text-sm font-bold text-green-400">= ${(parseInt(actionAmount) / 100).toFixed(2)} off</p>
                )}
                {actionError && <p className="text-sm text-red-400">{actionError}</p>}
                <div className="flex gap-2">
                  <button type="button" onClick={() => void submitRedeemPoints()} disabled={actionBusy}
                    className="flex-1 rounded-xl py-4 font-bold text-white text-lg disabled:opacity-50"
                    style={{ background: '#FF2D8E' }}>
                    {actionBusy ? 'Processing…' : 'Confirm Redemption'}
                  </button>
                  <button type="button" onClick={() => setAction({ kind: 'idle' })}
                    className="rounded-xl px-5 py-4 font-bold text-white/50 text-sm"
                    style={{ background: 'rgba(255,255,255,0.08)' }}>
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Apply Voucher form */}
            {action.kind === 'apply_voucher' && (
              <div className="rounded-2xl p-5 space-y-3" style={{ background: 'rgba(123,79,255,0.08)', border: '1px solid rgba(123,79,255,0.25)' }}>
                <h3 className="text-lg font-bold" style={{ color: '#a78bfa' }}>Apply Voucher</h3>
                {displayVouchers.length > 1 && (
                  <select value={selectedVoucherId} onChange={e => setSelectedVoucherId(e.target.value)}
                    className="w-full rounded-xl px-4 py-3 bg-white/10 border border-white/15 text-white focus:outline-none focus:border-purple-500">
                    {displayVouchers.map(v => (
                      <option key={v.id} value={v.id}>{v.code} — ${v.remaining_balance} remaining</option>
                    ))}
                  </select>
                )}
                {displayVouchers.length === 1 && (
                  <p className="text-sm text-white/50">{displayVouchers[0].code} · ${displayVouchers[0].remaining_balance} remaining</p>
                )}
                <input type="number" placeholder="Amount to apply (dollars)"
                  value={actionAmount} onChange={e => setActionAmount(e.target.value)}
                  className="w-full rounded-xl px-4 py-3 bg-white/10 border border-white/15 text-white text-lg focus:outline-none focus:border-purple-500"
                />
                <input type="text" placeholder="Note (optional)"
                  value={actionNote} onChange={e => setActionNote(e.target.value)}
                  className="w-full rounded-xl px-4 py-3 bg-white/10 border border-white/15 text-white text-sm focus:outline-none focus:border-purple-500"
                />
                {actionError && <p className="text-sm text-red-400">{actionError}</p>}
                <div className="flex gap-2">
                  <button type="button" onClick={() => void submitApplyVoucher()} disabled={actionBusy}
                    className="flex-1 rounded-xl py-4 font-bold text-white text-lg disabled:opacity-50"
                    style={{ background: 'linear-gradient(90deg, #7B4FFF, #4F9FFF)' }}>
                    {actionBusy ? 'Processing…' : 'Apply Voucher'}
                  </button>
                  <button type="button" onClick={() => setAction({ kind: 'idle' })}
                    className="rounded-xl px-5 py-4 font-bold text-white/50 text-sm"
                    style={{ background: 'rgba(255,255,255,0.08)' }}>
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Success */}
            {action.kind === 'success' && (
              <div className="rounded-2xl p-5 text-center" style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)' }}>
                <p className="text-xl font-bold text-green-400">{action.message}</p>
              </div>
            )}

            {/* Scan next */}
            <button type="button" onClick={reset}
              className="w-full rounded-2xl py-5 text-xl font-black text-white mt-2"
              style={{ background: '#FF2D8E' }}>
              Scan Next Client
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
