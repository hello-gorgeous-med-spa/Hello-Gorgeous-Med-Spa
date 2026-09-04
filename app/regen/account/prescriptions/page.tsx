'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRegenAuth } from '@/components/regen/RegenAuthProvider';

const BRAND = {
  teal: '#0D9488',
  pink: '#E91E8C',
  darkCard: '#1A1A1A',
  cream: '#FAF9F6',
  gray: '#9CA3AF',
};

type RxStatus = 'pending' | 'under_review' | 'approved' | 'needs_labs' | 'needs_video' | 'declined';

interface Prescription {
  id: string;
  goal: string;
  status: RxStatus;
  medical_history: Record<string, unknown>;
  created_at: string;
  reviewed_at?: string;
  review_notes?: string;
}

const STATUS_CONFIG: Record<RxStatus, { label: string; color: string; icon: string; desc: string }> = {
  pending: { 
    label: 'Pending Review', 
    color: '#F59E0B', 
    icon: '⏳',
    desc: 'Your provider will review within 24-48 hours.',
  },
  under_review: { 
    label: 'Under Review', 
    color: BRAND.teal, 
    icon: '👨‍⚕️',
    desc: 'A provider is currently reviewing your information.',
  },
  approved: { 
    label: 'Approved', 
    color: '#22C55E', 
    icon: '✓',
    desc: 'Your prescription has been approved and sent to the pharmacy.',
  },
  needs_labs: { 
    label: 'Labs Needed', 
    color: '#8B5CF6', 
    icon: '🧪',
    desc: 'Please complete lab work before we can proceed.',
  },
  needs_video: { 
    label: 'Video Visit Required', 
    color: '#3B82F6', 
    icon: '📹',
    desc: 'Please schedule a video consultation with your provider.',
  },
  declined: { 
    label: 'Not Approved', 
    color: '#EF4444', 
    icon: '✕',
    desc: 'This treatment is not recommended at this time. See notes below.',
  },
};

const GOAL_INFO: Record<string, { icon: string; name: string }> = {
  'Weight Loss': { icon: '⚖️', name: 'Weight Loss Program' },
  'Hormones': { icon: '🧬', name: 'Hormone Therapy' },
  'Peptides': { icon: '💉', name: 'Peptide Therapy' },
  'Sexual Health': { icon: '❤️', name: 'Sexual Wellness' },
  'Hair': { icon: '💇', name: 'Hair Restoration' },
  'Skincare': { icon: '✨', name: 'Prescription Skincare' },
  'Vitamins': { icon: '💊', name: 'Vitamin Injectables' },
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function PrescriptionsPage() {
  const { user } = useRegenAuth();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPrescriptions = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/regen/patient/dashboard');
      if (res.ok) {
        const data = await res.json();
        setPrescriptions(data.prescriptions || []);
      }
    } catch (error) {
      console.error('Failed to fetch prescriptions:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPrescriptions();
  }, [fetchPrescriptions]);

  const activeRx = prescriptions.filter(p => p.status === 'approved');
  const pendingRx = prescriptions.filter(p => ['pending', 'under_review', 'needs_labs', 'needs_video'].includes(p.status));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: BRAND.cream }}>Prescriptions</h1>
          <p style={{ color: BRAND.gray }}>Track your prescriptions and visit status.</p>
        </div>
        <Link
          href="/start"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
          style={{ backgroundColor: BRAND.pink, color: 'white' }}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Visit
        </Link>
      </div>

      {/* Loading */}
      {loading && (
        <div className="p-12 rounded-xl text-center" style={{ backgroundColor: BRAND.darkCard }}>
          <div className="animate-spin w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full mx-auto" />
        </div>
      )}

      {/* Active Prescriptions */}
      {!loading && activeRx.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: BRAND.cream }}>
            <span className="text-green-400">●</span> Active Prescriptions
          </h2>
          <div className="space-y-4">
            {activeRx.map((rx) => {
              const goalInfo = GOAL_INFO[rx.goal] || { icon: '💊', name: rx.goal };
              const statusInfo = STATUS_CONFIG[rx.status];
              
              return (
                <div
                  key={rx.id}
                  className="rounded-xl overflow-hidden"
                  style={{ backgroundColor: BRAND.darkCard, border: `1px solid #22C55E40` }}
                >
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      <div 
                        className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                        style={{ backgroundColor: `${BRAND.teal}20` }}
                      >
                        {goalInfo.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-1">
                          <h3 className="font-bold text-lg" style={{ color: BRAND.cream }}>
                            {goalInfo.name}
                          </h3>
                          <span 
                            className="px-2 py-1 rounded-full text-xs font-medium"
                            style={{ backgroundColor: `${statusInfo.color}20`, color: statusInfo.color }}
                          >
                            {statusInfo.icon} {statusInfo.label}
                          </span>
                        </div>
                        <p className="text-sm mb-2" style={{ color: BRAND.gray }}>
                          Approved {rx.reviewed_at ? formatDate(rx.reviewed_at) : formatDate(rx.created_at)}
                        </p>
                        <p className="text-sm" style={{ color: '#22C55E' }}>
                          {statusInfo.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div 
                    className="px-5 py-3 flex items-center justify-between"
                    style={{ backgroundColor: `${BRAND.teal}10`, borderTop: `1px solid ${BRAND.teal}20` }}
                  >
                    <span className="text-sm" style={{ color: BRAND.gray }}>Need a refill?</span>
                    <Link
                      href="/start"
                      className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105"
                      style={{ backgroundColor: BRAND.teal, color: 'white' }}
                    >
                      Request Refill
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Pending / In Progress */}
      {!loading && pendingRx.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: BRAND.cream }}>
            <span className="text-amber-400">●</span> In Progress
          </h2>
          <div className="space-y-4">
            {pendingRx.map((rx) => {
              const goalInfo = GOAL_INFO[rx.goal] || { icon: '💊', name: rx.goal };
              const statusInfo = STATUS_CONFIG[rx.status];
              
              return (
                <div
                  key={rx.id}
                  className="rounded-xl p-5"
                  style={{ backgroundColor: BRAND.darkCard, border: `1px solid ${statusInfo.color}40` }}
                >
                  <div className="flex items-start gap-4">
                    <div 
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                      style={{ backgroundColor: `${statusInfo.color}20` }}
                    >
                      {goalInfo.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-1">
                        <h3 className="font-bold text-lg" style={{ color: BRAND.cream }}>
                          {goalInfo.name}
                        </h3>
                        <span 
                          className="px-2 py-1 rounded-full text-xs font-medium"
                          style={{ backgroundColor: `${statusInfo.color}20`, color: statusInfo.color }}
                        >
                          {statusInfo.icon} {statusInfo.label}
                        </span>
                      </div>
                      <p className="text-sm mb-2" style={{ color: BRAND.gray }}>
                        Submitted {formatDate(rx.created_at)}
                      </p>
                      <p className="text-sm" style={{ color: statusInfo.color }}>
                        {statusInfo.desc}
                      </p>
                      
                      {/* Action buttons for specific statuses */}
                      {rx.status === 'needs_video' && (
                        <a
                          href="https://doxy.me/ryankent"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105"
                          style={{ backgroundColor: '#3B82F6', color: 'white' }}
                        >
                          📹 Join Video Visit
                        </a>
                      )}
                      
                      {rx.status === 'needs_labs' && (
                        <Link
                          href="/account/messages"
                          className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105"
                          style={{ backgroundColor: '#8B5CF6', color: 'white' }}
                        >
                          💬 Message About Labs
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && prescriptions.length === 0 && (
        <div 
          className="p-12 rounded-xl text-center"
          style={{ backgroundColor: BRAND.darkCard, border: `1px solid ${BRAND.teal}20` }}
        >
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl"
            style={{ backgroundColor: `${BRAND.teal}10` }}
          >
            💊
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ color: BRAND.cream }}>No prescriptions yet</h2>
          <p className="mb-6 max-w-md mx-auto" style={{ color: BRAND.gray }}>
            Complete an online visit to get started. Our providers review within 24-48 hours.
          </p>
          <Link
            href="/start"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-bold transition-all hover:scale-105"
            style={{ backgroundColor: BRAND.pink, color: 'white' }}
          >
            Start Your Visit
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      )}

      {/* How it works */}
      <div 
        className="p-6 rounded-xl"
        style={{ backgroundColor: BRAND.darkCard, border: `1px solid ${BRAND.teal}20` }}
      >
        <h3 className="font-semibold mb-4" style={{ color: BRAND.cream }}>How prescriptions work</h3>
        <div className="grid sm:grid-cols-4 gap-4">
          {[
            { step: '1', title: 'Submit Visit', desc: 'Complete online intake' },
            { step: '2', title: 'Provider Review', desc: '24-48 hour review' },
            { step: '3', title: 'Prescription Sent', desc: 'To our pharmacy' },
            { step: '4', title: 'Delivered', desc: 'Free shipping to you' },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 font-bold"
                style={{ backgroundColor: `${BRAND.teal}20`, color: BRAND.teal }}
              >
                {item.step}
              </div>
              <h4 className="font-medium text-sm mb-1" style={{ color: BRAND.cream }}>{item.title}</h4>
              <p className="text-xs" style={{ color: BRAND.gray }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
