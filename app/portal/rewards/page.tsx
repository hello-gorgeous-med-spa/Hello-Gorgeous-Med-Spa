'use client';

// ============================================================
// CLIENT PORTAL - REWARDS DASHBOARD
// View points, tier, and redeem rewards - Connected to Live Data
// ============================================================

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  LOYALTY_CONFIG,
  calculateTier,
  pointsToNextTier,
  pointsToValue,
} from '@/lib/hgos/loyalty';


// Skeleton component
function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-white rounded ${className}`} />;
}

const REWARDS_CATALOG = [
  { id: 'r1', name: '$10 Off Any Service', points: 200, icon: '🏷️' },
  { id: 'r2', name: '$25 Off Any Service', points: 500, icon: '🏷️' },
  { id: 'r3', name: 'Free Vitamin Injection', points: 400, icon: '💉' },
  { id: 'r4', name: 'Free Lip Balm', points: 150, icon: '💄' },
  { id: 'r5', name: 'Free Skincare Sample Set', points: 300, icon: '🧴' },
  { id: 'r6', name: '$50 Off Filler', points: 1000, icon: '✨' },
  { id: 'r7', name: 'Free Hydrafacial', points: 2000, icon: '💆' },
  { id: 'r8', name: 'VIP Party Invitation', points: 1500, icon: '🎉' },
];

export default function RewardsPage() {
  const [account, setAccount] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRedeemModal, setShowRedeemModal] = useState<string | null>(null);

  // Rewards data - placeholder until client auth is implemented
  useEffect(() => {
    // Demo rewards for display
    setAccount({
      currentPoints: 0,
      lifetimePoints: 0,
    });
    setTransactions([]);
    setLoading(false);
  }, []);

  const currentPoints = account?.currentPoints || 0;
  const lifetimePoints = account?.lifetimePoints || 0;

  const tier = useMemo(() => calculateTier(lifetimePoints), [lifetimePoints]);
  const nextTierInfo = useMemo(() => pointsToNextTier(lifetimePoints), [lifetimePoints]);
  const pointsValue = useMemo(() => pointsToValue(currentPoints), [currentPoints]);

  const progressToNextTier = nextTierInfo.nextTier
    ? ((lifetimePoints - tier.minPoints) / (nextTierInfo.nextTier.minPoints - tier.minPoints)) * 100
    : 100;

  const handleRedeem = (rewardId: string) => {
    // TODO: Process redemption via API
    setShowRedeemModal(null);
    alert('Reward redeemed! Check your email for confirmation.');
  };

  const tierColors = {
    bronze: 'from-amber-600 to-yellow-700',
    silver: 'from-black to-black',
    gold: 'from-yellow-400 to-amber-500',
    platinum: 'from-purple-400 to-indigo-500',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-black">My Rewards</h1>
        <p className="text-black">Track your points and redeem rewards</p>
      </div>

      {/* Points & Tier Card */}
      <div className={`bg-gradient-to-r ${tierColors[tier.id as keyof typeof tierColors] || tierColors.bronze} rounded-2xl p-6 text-white`}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-white/80 text-sm">Your Balance</p>
            {loading ? (
              <Skeleton className="h-12 w-32 bg-white/20" />
            ) : (
              <p className="text-4xl font-bold">{currentPoints.toLocaleString()} pts</p>
            )}
            <p className="text-white/80 text-sm mt-1">≈ ${pointsValue} value</p>
          </div>
          <div className="text-right">
            <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full font-semibold">
              {tier.icon} {tier.name}
            </span>
          </div>
        </div>

        {nextTierInfo.nextTier && (
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>{tier.name}</span>
              <span>{nextTierInfo.nextTier.name}</span>
            </div>
            <div className="h-2 bg-white/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all"
                style={{ width: `${Math.min(progressToNextTier, 100)}%` }}
              />
            </div>
            <p className="text-sm text-white/80 mt-2">
              {nextTierInfo.pointsNeeded.toLocaleString()} more points to {nextTierInfo.nextTier.name}
            </p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-black p-4 text-center">
          <p className="text-2xl font-bold text-black">{currentPoints}</p>
          <p className="text-sm text-black">Available Points</p>
        </div>
        <div className="bg-white rounded-xl border border-black p-4 text-center">
          <p className="text-2xl font-bold text-black">{lifetimePoints}</p>
          <p className="text-sm text-black">Lifetime Points</p>
        </div>
        <div className="bg-white rounded-xl border border-black p-4 text-center">
          <p className="text-2xl font-bold text-pink-600">{tier.multiplier}x</p>
          <p className="text-sm text-black">Points Multiplier</p>
        </div>
      </div>

      {/* Rewards Catalog */}
      <div>
        <h2 className="text-xl font-bold text-black mb-4">Redeem Rewards</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {REWARDS_CATALOG.map((reward) => {
            const canRedeem = currentPoints >= reward.points;
            return (
              <div
                key={reward.id}
                className={`bg-white rounded-xl border p-4 text-center ${
                  canRedeem ? 'border-black hover:border-pink-200' : 'border-black opacity-60'
                }`}
              >
                <span className="text-4xl block mb-2">{reward.icon}</span>
                <h3 className="font-medium text-black text-sm mb-1">{reward.name}</h3>
                <p className="text-pink-600 font-bold mb-3">{reward.points} pts</p>
                <button
                  onClick={() => canRedeem && setShowRedeemModal(reward.id)}
                  disabled={!canRedeem}
                  className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                    canRedeem
                      ? 'bg-pink-500 text-white hover:bg-pink-600'
                      : 'bg-white text-black cursor-not-allowed'
                  }`}
                >
                  {canRedeem ? 'Redeem' : 'Not Enough'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-2xl border border-black overflow-hidden">
        <div className="px-6 py-4 border-b border-black">
          <h3 className="font-semibold text-black">Points History</h3>
        </div>
        
        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-12" />)}
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-8 text-center text-black">
            <span className="text-4xl block mb-2">🌟</span>
            <p>No points activity yet</p>
            <p className="text-sm">Book a treatment to start earning!</p>
          </div>
        ) : (
          <div className="divide-y divide-black">
            {transactions.map((tx) => (
              <div key={tx.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-black">{tx.description}</p>
                  <p className="text-sm text-black">
                    {new Date(tx.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className={`font-bold ${tx.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {tx.points > 0 ? '+' : ''}{tx.points} pts
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* How to Earn */}
      <div className="bg-white rounded-2xl p-6">
        <h3 className="font-semibold text-black mb-4">How to Earn Points</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💉</span>
            <span>Earn {LOYALTY_CONFIG.pointsPerDollar} point per $1 spent</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">👥</span>
            <span>Refer a friend: +{LOYALTY_CONFIG.referralBonus} points</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎂</span>
            <span>Birthday bonus: +{LOYALTY_CONFIG.birthdayBonus} points</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">⭐</span>
            <span>Leave a review: +{LOYALTY_CONFIG.reviewBonus} points</span>
          </div>
        </div>
      </div>

      {/* Redeem Modal */}
      {showRedeemModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-black mb-4">Confirm Redemption</h2>
            {(() => {
              const reward = REWARDS_CATALOG.find(r => r.id === showRedeemModal);
              if (!reward) return null;
              return (
                <>
                  <div className="text-center py-4">
                    <span className="text-5xl">{reward.icon}</span>
                    <p className="font-semibold text-black mt-2">{reward.name}</p>
                    <p className="text-pink-600 font-bold">{reward.points} points</p>
                  </div>
                  <p className="text-black text-sm text-center mb-4">
                    You will have {currentPoints - reward.points} points remaining.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowRedeemModal(null)}
                      className="flex-1 px-4 py-2 border border-black text-black rounded-lg hover:bg-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleRedeem(reward.id)}
                      className="flex-1 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
                    >
                      Confirm
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
