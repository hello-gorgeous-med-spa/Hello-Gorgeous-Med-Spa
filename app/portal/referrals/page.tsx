'use client';

// ============================================================
// CLIENT PORTAL - REFERRAL PROGRAM
// Share referral code and track referrals
// ============================================================

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  REFERRAL_CONFIG,
  generateReferralLink,
  generateShareMessage,
  type Referral,
} from '@/lib/hgos/referrals';

// Mock data
const MOCK_CLIENT = {
  id: 'c1',
  name: 'Jennifer Martinez',
  referralCode: 'JENN8X4K',
};

const MOCK_REFERRALS: Referral[] = [
  {
    id: 'ref1',
    referrerId: 'c1',
    referrerName: 'Jennifer Martinez',
    refereeId: 'c2',
    refereeName: 'Sarah Johnson',
    refereeEmail: 'sarah@email.com',
    code: 'JENN8X4K',
    status: 'rewarded',
    createdAt: new Date('2025-12-01'),
    convertedAt: new Date('2025-12-15'),
    rewardedAt: new Date('2025-12-15'),
  },
  {
    id: 'ref2',
    referrerId: 'c1',
    referrerName: 'Jennifer Martinez',
    refereeName: 'Michelle Williams',
    refereeEmail: 'michelle@email.com',
    code: 'JENN8X4K',
    status: 'signed_up',
    createdAt: new Date('2026-01-10'),
  },
  {
    id: 'ref3',
    referrerId: 'c1',
    referrerName: 'Jennifer Martinez',
    refereeName: 'Lisa Chen',
    refereeEmail: 'lisa@email.com',
    code: 'JENN8X4K',
    status: 'pending',
    createdAt: new Date('2026-01-25'),
  },
];

export default function ReferralsPage() {
  const [referrals] = useState(MOCK_REFERRALS);
  const [copied, setCopied] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteData, setInviteData] = useState({ name: '', email: '', phone: '' });

  const referralLink = useMemo(
    () => generateReferralLink(MOCK_CLIENT.referralCode),
    []
  );

  const shareMessages = useMemo(
    () => generateShareMessage(MOCK_CLIENT.name, MOCK_CLIENT.referralCode),
    []
  );

  const stats = useMemo(() => ({
    total: referrals.length,
    pending: referrals.filter(r => r.status === 'pending').length,
    signedUp: referrals.filter(r => r.status === 'signed_up').length,
    converted: referrals.filter(r => r.status === 'converted' || r.status === 'rewarded').length,
    earned: referrals.filter(r => r.status === 'rewarded').length * REFERRAL_CONFIG.referrerReward.value,
  }), [referrals]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(MOCK_CLIENT.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareSMS = () => {
    window.open(`sms:?body=${encodeURIComponent(shareMessages.sms)}`);
  };

  const handleShareEmail = () => {
    window.open(`mailto:?subject=${encodeURIComponent(shareMessages.email.subject)}&body=${encodeURIComponent(shareMessages.email.body)}`);
  };

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Send invite via API
    alert(`Invitation sent to ${inviteData.name}!`);
    setShowInviteModal(false);
    setInviteData({ name: '', email: '', phone: '' });
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-gray-100 text-gray-600',
    signed_up: 'bg-blue-100 text-blue-700',
    converted: 'bg-green-100 text-green-700',
    rewarded: 'bg-purple-100 text-purple-700',
    expired: 'bg-red-100 text-red-600',
  };

  const statusLabels: Record<string, string> = {
    pending: 'Invite Sent',
    signed_up: 'Signed Up',
    converted: 'Made Purchase',
    rewarded: 'Reward Earned!',
    expired: 'Expired',
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/portal" className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-block">
          ← Back to Portal
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">{REFERRAL_CONFIG.programName}</h1>
        <p className="text-gray-500">Share the love, earn rewards together</p>
      </div>

      {/* Hero Card */}
      <div className="bg-gradient-to-br from-pink-500 via-rose-500 to-orange-400 rounded-2xl p-8 text-white mb-6">
        <div className="max-w-lg">
          <h2 className="text-2xl font-bold mb-2">Give $25, Get $50</h2>
          <p className="text-pink-100 mb-6">
            Share your personal code with friends. When they book their first treatment, 
            they get {REFERRAL_CONFIG.refereeReward.description} and you get{' '}
            {REFERRAL_CONFIG.referrerReward.description}!
          </p>

          {/* Referral Code */}
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-4">
            <p className="text-pink-100 text-sm mb-2">Your referral code</p>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold tracking-wider">{MOCK_CLIENT.referralCode}</span>
              <button
                onClick={handleCopyCode}
                className="px-4 py-2 bg-white text-pink-600 font-medium rounded-lg hover:bg-pink-50 transition-colors"
              >
                {copied ? '✓ Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleShareSMS}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              <span>💬</span> Text
            </button>
            <button
              onClick={handleShareEmail}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              <span>✉️</span> Email
            </button>
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              <span>🔗</span> Copy Link
            </button>
            <button
              onClick={() => setShowInviteModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white text-pink-600 font-medium rounded-lg hover:bg-pink-50 transition-colors"
            >
              <span>➕</span> Send Invite
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-sm text-gray-500">Total Referrals</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{stats.signedUp}</p>
          <p className="text-sm text-gray-500">Signed Up</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{stats.converted}</p>
          <p className="text-sm text-gray-500">Converted</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">${stats.earned}</p>
          <p className="text-sm text-gray-500">Total Earned</p>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">1️⃣</span>
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Share Your Code</h3>
            <p className="text-sm text-gray-500">Send your unique code to friends and family</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">2️⃣</span>
            </div>
            <h3 className="font-medium text-gray-900 mb-1">They Book & Save</h3>
            <p className="text-sm text-gray-500">They get {REFERRAL_CONFIG.refereeReward.description}</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">3️⃣</span>
            </div>
            <h3 className="font-medium text-gray-900 mb-1">You Earn Rewards</h3>
            <p className="text-sm text-gray-500">Get {REFERRAL_CONFIG.referrerReward.description} after their visit</p>
          </div>
        </div>
      </div>

      {/* Referral History */}
      <div className="bg-white rounded-xl border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Your Referrals</h2>
        </div>
        {referrals.length === 0 ? (
          <div className="p-8 text-center">
            <span className="text-4xl mb-4 block">👥</span>
            <p className="text-gray-500">No referrals yet. Share your code to get started!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {referrals.map((referral) => (
              <div key={referral.id} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                    {referral.refereeName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{referral.refereeName}</p>
                    <p className="text-sm text-gray-500">
                      Referred {new Date(referral.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {referral.status === 'rewarded' && (
                    <span className="text-green-600 font-medium">+${REFERRAL_CONFIG.referrerReward.value}</span>
                  )}
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[referral.status]}`}>
                    {statusLabels[referral.status]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fine Print */}
      <p className="text-xs text-gray-400 mt-6 text-center">
        Rewards are credited after referral completes their first paid treatment of ${REFERRAL_CONFIG.minPurchaseAmount}+. 
        Maximum {REFERRAL_CONFIG.maxReferralsPerMonth} referrals per month. Terms apply.
      </p>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Send Personal Invite</h2>
            <p className="text-gray-500 mb-6">We'll send them an invitation with your referral code</p>

            <form onSubmit={handleSendInvite} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Friend's Name</label>
                <input
                  type="text"
                  required
                  value={inviteData.name}
                  onChange={(e) => setInviteData({ ...inviteData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  placeholder="Sarah"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={inviteData.email}
                  onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  placeholder="sarah@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone (optional)</label>
                <input
                  type="tel"
                  value={inviteData.phone}
                  onChange={(e) => setInviteData({ ...inviteData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  placeholder="(630) 555-1234"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600"
              >
                Send Invitation
              </button>
              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                className="w-full py-3 text-gray-600 font-medium"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
