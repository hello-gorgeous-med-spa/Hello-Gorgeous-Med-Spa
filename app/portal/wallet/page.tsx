'use client';

import { useState, useEffect } from 'react';
import { usePortalAuth } from '@/lib/portal/useAuth';

interface Wallet {
  creditBalance: number;
  giftCardBalance: number;
  rewardPoints: number;
  totalSpent: number;
  totalSaved: number;
  membershipTier: string;
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  balanceAfter: number;
  description?: string;
  source?: string;
  date: string;
}

const TIER_COLORS: Record<string, string> = {
  standard: 'bg-gray-100 text-gray-600',
  bronze: 'bg-amber-100 text-amber-700',
  silver: 'bg-slate-200 text-slate-700',
  gold: 'bg-yellow-100 text-yellow-700',
  platinum: 'bg-purple-100 text-purple-700',
  vip: 'bg-[#FF2D8E]/10 text-[#FF2D8E]',
};

export default function WalletPage() {
  const { user, loading: authLoading } = usePortalAuth();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [giftCardCode, setGiftCardCode] = useState('');
  const [redeemError, setRedeemError] = useState('');

  useEffect(() => {
    if (!user) return;
    fetchWallet();
  }, [user]);

  const fetchWallet = async () => {
    try {
      const res = await fetch('/api/portal/wallet');
      const data = await res.json();
      setWallet(data.wallet);
      setTransactions(data.transactions || []);
    } catch (err) {
      console.error('Failed to fetch wallet:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRedeemGiftCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setRedeemError('');
    try {
      const res = await fetch('/api/portal/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ giftCardCode }),
      });
      const data = await res.json();
      if (data.error) {
        setRedeemError(data.error);
      } else {
        setGiftCardCode('');
        fetchWallet();
      }
    } catch {
      setRedeemError('Failed to redeem gift card');
    }
  };

  if (authLoading || loading) {
    return <div className="flex items-center justify-center min-h-[400px]"><div className="animate-spin text-4xl">💗</div></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111]">My Wallet</h1>
        <p className="text-[#111]/70 mt-1">Manage your credits, gift cards, and rewards</p>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-[#FF2D8E] to-pink-600 text-white rounded-2xl p-6">
          <p className="text-white/70 text-sm">Store Credit</p>
          <p className="text-3xl font-bold mt-1">${wallet?.creditBalance?.toFixed(2) || '0.00'}</p>
          <p className="text-white/60 text-xs mt-2">Available for any service</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-2xl p-6">
          <p className="text-white/70 text-sm">Gift Card Balance</p>
          <p className="text-3xl font-bold mt-1">${wallet?.giftCardBalance?.toFixed(2) || '0.00'}</p>
          <p className="text-white/60 text-xs mt-2">From gift cards redeemed</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-2xl p-6">
          <p className="text-white/70 text-sm">Reward Points</p>
          <p className="text-3xl font-bold mt-1">{wallet?.rewardPoints?.toLocaleString() || 0}</p>
          <p className="text-white/60 text-xs mt-2">100 points = $1 credit</p>
        </div>
      </div>

      {/* Membership Tier */}
      <div className="bg-white rounded-2xl border border-[#111]/10 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[#111]/70">Your Status</p>
            <p className="text-xl font-bold text-[#111] mt-1 capitalize">{wallet?.membershipTier || 'Standard'} Member</p>
          </div>
          <span className={`px-4 py-2 rounded-full font-medium ${TIER_COLORS[wallet?.membershipTier || 'standard']}`}>
            {wallet?.membershipTier?.toUpperCase() || 'STANDARD'}
          </span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 pt-4 border-t border-[#111]/10">
          <div>
            <p className="text-sm text-[#111]/50">Total Spent</p>
            <p className="font-semibold text-[#111]">${wallet?.totalSpent?.toFixed(2) || '0.00'}</p>
          </div>
          <div>
            <p className="text-sm text-[#111]/50">Total Saved</p>
            <p className="font-semibold text-green-600">${wallet?.totalSaved?.toFixed(2) || '0.00'}</p>
          </div>
        </div>
      </div>

      {/* Redeem Gift Card */}
      <div className="bg-white rounded-2xl border border-[#111]/10 p-6">
        <h2 className="font-semibold text-[#111] mb-4">Redeem Gift Card</h2>
        <form onSubmit={handleRedeemGiftCard} className="flex gap-3">
          <input
            type="text"
            value={giftCardCode}
            onChange={(e) => setGiftCardCode(e.target.value.toUpperCase())}
            placeholder="Enter gift card code"
            className="flex-1 px-4 py-3 border border-[#111]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF2D8E]/50"
          />
          <button type="submit" className="bg-[#FF2D8E] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#FF2D8E]/90 transition-colors">
            Redeem
          </button>
        </form>
        {redeemError && <p className="text-red-500 text-sm mt-2">{redeemError}</p>}
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-2xl border border-[#111]/10 p-6">
        <h2 className="font-semibold text-[#111] mb-4">Transaction History</h2>
        {transactions.length === 0 ? (
          <p className="text-center py-8 text-[#111]/50">No transactions yet</p>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-3 border-b border-[#111]/5 last:border-0">
                <div>
                  <p className="font-medium text-[#111]">{tx.description || tx.type}</p>
                  <p className="text-sm text-[#111]/50">{new Date(tx.date).toLocaleDateString()}</p>
                </div>
                <span className={`font-semibold ${tx.amount > 0 ? 'text-green-600' : 'text-[#111]'}`}>
                  {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
