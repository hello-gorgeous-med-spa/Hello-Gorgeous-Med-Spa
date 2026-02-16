'use client';

// ============================================================
// CLIENT PORTAL - REFERRAL PROGRAM
// Share referral code and track referrals - Connected to Live Data
// ============================================================

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  REFERRAL_CONFIG,
  generateReferralLink,
  generateShareMessage,
  type Referral,
} from '@/lib/hgos/referrals';


// Skeleton component
function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-white rounded ${className}`} />;
}

export default function ReferralsPage() {
  const [client, setClient] = useState<any>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Referral program - demo code until client auth is implemented
  useEffect(() => {
    // Set a demo referral code for display
    setClient({
      id: 'demo',
      name: 'Guest',
      referralCode: 'HGFRIEND25',
    });
    setReferrals([]);
    setLoading(false);
  }, []);

  const generateCode = (name: string) => {
    const prefix = name.substring(0, 4).toUpperCase();
    const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}${suffix}`;
  };

  const referralCode = client?.referralCode || 'LOADING';
  const referralLink = generateReferralLink(referralCode);
  const shareMessage = generateShareMessage(client?.name || 'Friend', referralCode);

  const stats = {
    totalReferrals: referrals.length,
    converted: referrals.filter(r => r.status === 'rewarded').length,
    pending: referrals.filter(r => r.status === 'pending' || r.status === 'signed_up').length,
    totalEarned: referrals.filter(r => r.status === 'rewarded').length * REFERRAL_CONFIG.referrerReward.value,
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: 'Hello Gorgeous Med Spa Referral',
        text: shareMessage,
        url: referralLink,
      });
    } else {
      handleCopy(shareMessage);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'rewarded':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Rewarded</span>;
      case 'converted':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">Booked</span>;
      case 'signed_up':
        return <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">Signed Up</span>;
      default:
        return <span className="px-2 py-1 bg-white text-black rounded-full text-xs">Pending</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-black">Referral Program</h1>
        <p className="text-black">Share the love and earn rewards!</p>
      </div>

      {/* Program Info */}
      <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-4">
          <span className="text-5xl">🎁</span>
          <div>
            <h2 className="text-2xl font-bold">Give ${REFERRAL_CONFIG.refereeReward.value}, Get ${REFERRAL_CONFIG.referrerReward.value}</h2>
            <p className="text-amber-100">
              Share your code with friends. They get ${REFERRAL_CONFIG.refereeReward.value} off their first treatment, 
              and you get ${REFERRAL_CONFIG.referrerReward.value} when they book!
            </p>
          </div>
        </div>
      </div>

      {/* Your Code */}
      <div className="bg-white rounded-2xl border border-black p-6">
        <h3 className="font-semibold text-black mb-4">Your Referral Code</h3>
        
        {loading ? (
          <Skeleton className="h-16 w-full" />
        ) : (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 bg-white rounded-lg px-6 py-4 text-center">
                <span className="text-3xl font-bold tracking-widest text-pink-600">{referralCode}</span>
              </div>
              <button
                onClick={() => handleCopy(referralCode)}
                className="px-4 py-4 bg-pink-100 text-pink-600 rounded-lg hover:bg-pink-200 transition-colors"
              >
                {copied ? '✓' : '📋'}
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleShare}
                className="flex-1 px-4 py-3 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 transition-colors"
              >
                Share Code
              </button>
              <button
                onClick={() => handleCopy(referralLink)}
                className="px-4 py-3 border border-black text-black rounded-lg hover:bg-white transition-colors"
              >
                Copy Link
              </button>
            </div>
          </>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-black p-4 text-center">
          <p className="text-2xl font-bold text-black">{stats.totalReferrals}</p>
          <p className="text-sm text-black">Total Referrals</p>
        </div>
        <div className="bg-white rounded-xl border border-black p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{stats.converted}</p>
          <p className="text-sm text-black">Converted</p>
        </div>
        <div className="bg-white rounded-xl border border-black p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
          <p className="text-sm text-black">Pending</p>
        </div>
        <div className="bg-white rounded-xl border border-black p-4 text-center">
          <p className="text-2xl font-bold text-pink-600">${stats.totalEarned}</p>
          <p className="text-sm text-black">Earned</p>
        </div>
      </div>

      {/* Referral History */}
      <div className="bg-white rounded-2xl border border-black overflow-hidden">
        <div className="px-6 py-4 border-b border-black">
          <h3 className="font-semibold text-black">Referral History</h3>
        </div>
        
        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-16" />)}
          </div>
        ) : referrals.length === 0 ? (
          <div className="p-8 text-center text-black">
            <span className="text-4xl block mb-2">👥</span>
            <p>No referrals yet</p>
            <p className="text-sm">Share your code to start earning!</p>
          </div>
        ) : (
          <div className="divide-y divide-black">
            {referrals.map((referral) => (
              <div key={referral.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-black">{referral.refereeName}</p>
                  <p className="text-sm text-black">
                    {referral.createdAt.toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(referral.status)}
                  {referral.status === 'rewarded' && (
                    <span className="text-green-600 font-medium">+${REFERRAL_CONFIG.referrerReward.value}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* How It Works */}
      <div className="bg-white rounded-2xl p-6">
        <h3 className="font-semibold text-black mb-4">How It Works</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
            <div>
              <p className="font-medium text-black">Share Your Code</p>
              <p className="text-sm text-black">Send your unique code to friends</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
            <div>
              <p className="font-medium text-black">They Book</p>
              <p className="text-sm text-black">They get ${REFERRAL_CONFIG.refereeReward.value} off their first visit</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
            <div>
              <p className="font-medium text-black">You Earn</p>
              <p className="text-sm text-black">Get ${REFERRAL_CONFIG.referrerReward.value} credited to your account</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
