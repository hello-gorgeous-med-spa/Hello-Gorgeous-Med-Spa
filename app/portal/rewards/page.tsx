'use client';

// ============================================================
// CLIENT PORTAL - REWARDS DASHBOARD
// View points, tier, and redeem rewards
// ============================================================

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  LOYALTY_CONFIG,
  calculateTier,
  pointsToNextTier,
  pointsToValue,
  type LoyaltyTransaction,
} from '@/lib/hgos/loyalty';

// Mock data - would come from Supabase
const MOCK_LOYALTY_ACCOUNT = {
  clientId: 'c1',
  currentPoints: 1850,
  lifetimePoints: 2850,
  transactions: [
    { id: 't1', type: 'earned' as const, points: 150, description: 'Botox Treatment', createdAt: new Date('2026-01-15') },
    { id: 't2', type: 'bonus' as const, points: 100, description: 'Birthday Bonus', createdAt: new Date('2026-01-10') },
    { id: 't3', type: 'redeemed' as const, points: -200, description: 'Redeemed for $10 off', createdAt: new Date('2026-01-05') },
    { id: 't4', type: 'earned' as const, points: 275, description: 'Filler Treatment', createdAt: new Date('2025-12-20') },
    { id: 't5', type: 'bonus' as const, points: 500, description: 'Referral Bonus - Sarah J.', createdAt: new Date('2025-12-15') },
    { id: 't6', type: 'earned' as const, points: 125, description: 'Facial Treatment', createdAt: new Date('2025-12-01') },
  ],
};

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
  const [account] = useState(MOCK_LOYALTY_ACCOUNT);
  const [showRedeemModal, setShowRedeemModal] = useState<string | null>(null);

  const tier = useMemo(() => calculateTier(account.lifetimePoints), [account.lifetimePoints]);
  const nextTierInfo = useMemo(() => pointsToNextTier(account.lifetimePoints), [account.lifetimePoints]);
  const pointsValue = useMemo(() => pointsToValue(account.currentPoints), [account.currentPoints]);

  const progressToNextTier = nextTierInfo.nextTier
    ? ((account.lifetimePoints - tier.minPoints) / (nextTierInfo.nextTier.minPoints - tier.minPoints)) * 100
    : 100;

  const handleRedeem = (rewardId: string) => {
    // TODO: Process redemption via API
    setShowRedeemModal(null);
    alert('Reward redeemed! Check your email for confirmation.');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/portal" className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-block">
          ← Back to Portal
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">{LOYALTY_CONFIG.programName}</h1>
        <p className="text-gray-500">Earn points on every visit, unlock exclusive rewards</p>
      </div>

      {/* Points Summary Card */}
      <div className="bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 rounded-2xl p-6 text-white mb-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-pink-100 text-sm">Available Points</p>
            <p className="text-4xl font-bold">{account.currentPoints.toLocaleString()}</p>
            <p className="text-pink-200 text-sm mt-1">Worth ${pointsValue.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 justify-end">
              <span className="text-2xl">{tier.icon}</span>
              <span className="font-semibold text-lg">{tier.name}</span>
            </div>
            <p className="text-pink-200 text-sm">{tier.multiplier}x points earning</p>
          </div>
        </div>

        {/* Progress to Next Tier */}
        {nextTierInfo.nextTier && (
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-pink-200">Progress to {nextTierInfo.nextTier.name}</span>
              <span className="text-white font-medium">{nextTierInfo.pointsNeeded.toLocaleString()} points to go</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all"
                style={{ width: `${progressToNextTier}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Tier Benefits */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Your {tier.name} Benefits</h2>
        <ul className="space-y-2">
          {tier.benefits.map((benefit, i) => (
            <li key={i} className="flex items-center gap-3 text-gray-700">
              <span className="text-green-500">✓</span>
              {benefit}
            </li>
          ))}
        </ul>
      </div>

      {/* Ways to Earn */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Ways to Earn Points</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-pink-50 rounded-lg">
            <span className="text-2xl mb-2 block">💳</span>
            <p className="font-medium text-gray-900">{LOYALTY_CONFIG.pointsPerDollar} pt/$1</p>
            <p className="text-xs text-gray-500">On every purchase</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <span className="text-2xl mb-2 block">🎂</span>
            <p className="font-medium text-gray-900">{LOYALTY_CONFIG.birthdayBonus} pts</p>
            <p className="text-xs text-gray-500">Birthday bonus</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <span className="text-2xl mb-2 block">👥</span>
            <p className="font-medium text-gray-900">{LOYALTY_CONFIG.referralBonus} pts</p>
            <p className="text-xs text-gray-500">Per referral</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <span className="text-2xl mb-2 block">⭐</span>
            <p className="font-medium text-gray-900">{LOYALTY_CONFIG.reviewBonus} pts</p>
            <p className="text-xs text-gray-500">Leave a review</p>
          </div>
        </div>
      </div>

      {/* Rewards Catalog */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Redeem Your Points</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {REWARDS_CATALOG.map((reward) => {
            const canRedeem = account.currentPoints >= reward.points;
            return (
              <div
                key={reward.id}
                className={`border rounded-lg p-4 flex items-center justify-between ${
                  canRedeem ? 'border-gray-200' : 'border-gray-100 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{reward.icon}</span>
                  <div>
                    <p className="font-medium text-gray-900">{reward.name}</p>
                    <p className="text-sm text-gray-500">{reward.points.toLocaleString()} points</p>
                  </div>
                </div>
                <button
                  onClick={() => canRedeem && setShowRedeemModal(reward.id)}
                  disabled={!canRedeem}
                  className={`px-4 py-2 rounded-lg font-medium text-sm ${
                    canRedeem
                      ? 'bg-pink-500 text-white hover:bg-pink-600'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Redeem
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Points History</h2>
        <div className="space-y-3">
          {account.transactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div className="flex items-center gap-3">
                <span className="text-xl">
                  {tx.type === 'earned' && '💰'}
                  {tx.type === 'bonus' && '🎁'}
                  {tx.type === 'redeemed' && '🎫'}
                  {tx.type === 'expired' && '⏰'}
                </span>
                <div>
                  <p className="font-medium text-gray-900">{tx.description}</p>
                  <p className="text-xs text-gray-500">{new Date(tx.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <span className={`font-semibold ${tx.points >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {tx.points >= 0 ? '+' : ''}{tx.points.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* All Tiers Preview */}
      <div className="mt-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Membership Tiers</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {LOYALTY_CONFIG.tiers.map((t) => (
            <div
              key={t.id}
              className={`rounded-lg p-4 ${
                t.id === tier.id ? 'bg-white shadow-lg ring-2 ring-pink-500' : 'bg-white/50'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{t.icon}</span>
                <span className="font-semibold text-gray-900">{t.name}</span>
              </div>
              <p className="text-xs text-gray-500">{t.minPoints.toLocaleString()}+ lifetime pts</p>
              <p className="text-sm font-medium text-pink-600 mt-1">{t.multiplier}x points</p>
            </div>
          ))}
        </div>
      </div>

      {/* Redeem Modal */}
      {showRedeemModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            {(() => {
              const reward = REWARDS_CATALOG.find(r => r.id === showRedeemModal)!;
              return (
                <>
                  <div className="text-center mb-6">
                    <span className="text-5xl mb-4 block">{reward.icon}</span>
                    <h2 className="text-xl font-bold text-gray-900">{reward.name}</h2>
                    <p className="text-gray-500">{reward.points.toLocaleString()} points</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Your points</span>
                      <span className="font-medium">{account.currentPoints.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-600">After redemption</span>
                      <span className="font-bold text-gray-900">{(account.currentPoints - reward.points).toLocaleString()}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRedeem(showRedeemModal)}
                    className="w-full py-3 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600"
                  >
                    Confirm Redemption
                  </button>
                  <button
                    onClick={() => setShowRedeemModal(null)}
                    className="w-full py-3 text-gray-600 font-medium mt-2"
                  >
                    Cancel
                  </button>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
