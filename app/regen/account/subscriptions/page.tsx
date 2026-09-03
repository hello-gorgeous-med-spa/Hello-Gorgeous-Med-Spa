'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRegenAuth } from '@/components/regen/RegenAuthProvider';
import { SUBSCRIPTION_TIERS, SUBSCRIPTION_CATEGORIES } from '@/lib/regen/subscriptions/subscription-tiers';

const BRAND = {
  teal: '#0D9488',
  pink: '#E91E8C',
  dark: '#0a0a0a',
};

interface Subscription {
  id: string;
  status: string;
  currentPeriodEnd: number;
  cancelAtPeriodEnd: boolean;
  tier: string;
  items: Array<{
    priceId: string;
    productId: string;
    productName: string;
  }>;
}

export default function SubscriptionsPage() {
  const { user } = useRegenAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    // In a real app, we'd fetch the customer ID from Supabase
    // For now, show empty state
    setLoading(false);
  }, [user]);

  const handleManageAction = async (action: string, subscriptionId: string) => {
    setActionLoading(subscriptionId);
    try {
      const response = await fetch('/api/regen/subscription/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, subscriptionId }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Refresh subscriptions
        window.location.reload();
      } else {
        alert(data.error || 'Something went wrong');
      }
    } catch (error) {
      console.error('Action error:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string, cancelAtPeriodEnd: boolean) => {
    if (cancelAtPeriodEnd) {
      return { label: 'Canceling', color: '#F59E0B' };
    }
    switch (status) {
      case 'active':
        return { label: 'Active', color: '#22C55E' };
      case 'paused':
        return { label: 'Paused', color: '#F59E0B' };
      case 'canceled':
        return { label: 'Canceled', color: '#EF4444' };
      case 'past_due':
        return { label: 'Past Due', color: '#EF4444' };
      default:
        return { label: status, color: '#888' };
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
          My Subscriptions
        </h1>
        <p style={{ color: '#888' }}>
          Manage your monthly treatment plans
        </p>
      </div>

      {loading ? (
        <div style={{ 
          padding: 40, 
          textAlign: 'center', 
          color: '#888',
        }}>
          Loading subscriptions...
        </div>
      ) : subscriptions.length === 0 ? (
        /* Empty State */
        <div style={{ 
          backgroundColor: '#1a1a1a', 
          borderRadius: 16, 
          padding: 40,
          textAlign: 'center',
          border: '1px solid #333',
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
            No Active Subscriptions
          </h3>
          <p style={{ color: '#888', marginBottom: 24, maxWidth: 400, margin: '0 auto 24px' }}>
            Start a subscription to get your treatments delivered monthly with savings on every order.
          </p>
          <Link
            href="/pricing"
            style={{
              display: 'inline-block',
              padding: '14px 28px',
              backgroundColor: BRAND.pink,
              color: '#fff',
              fontSize: 16,
              fontWeight: 700,
              borderRadius: 12,
              textDecoration: 'none',
            }}
          >
            Browse Plans
          </Link>
        </div>
      ) : (
        /* Active Subscriptions */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {subscriptions.map(sub => {
            const tier = SUBSCRIPTION_TIERS.find(t => t.id === sub.tier);
            const category = tier ? SUBSCRIPTION_CATEGORIES[tier.category] : null;
            const status = getStatusBadge(sub.status, sub.cancelAtPeriodEnd);
            const renewDate = new Date(sub.currentPeriodEnd * 1000);
            
            return (
              <div
                key={sub.id}
                style={{
                  backgroundColor: '#1a1a1a',
                  borderRadius: 16,
                  padding: 24,
                  border: '1px solid #333',
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: 16,
                }}>
                  <div>
                    {category && (
                      <div style={{ 
                        fontSize: 12, 
                        color: category.color,
                        marginBottom: 4,
                      }}>
                        {category.icon} {category.name}
                      </div>
                    )}
                    <h3 style={{ fontSize: 18, fontWeight: 700 }}>
                      {tier?.name || sub.items[0]?.productName || 'Subscription'}
                    </h3>
                  </div>
                  <div style={{
                    padding: '4px 12px',
                    borderRadius: 999,
                    backgroundColor: `${status.color}20`,
                    color: status.color,
                    fontSize: 12,
                    fontWeight: 600,
                  }}>
                    {status.label}
                  </div>
                </div>

                <div style={{ 
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: 16,
                  marginBottom: 20,
                }}>
                  <div>
                    <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
                      {sub.cancelAtPeriodEnd ? 'Ends on' : 'Next renewal'}
                    </div>
                    <div style={{ fontWeight: 600 }}>
                      {renewDate.toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                  {tier && (
                    <div>
                      <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
                        Monthly price
                      </div>
                      <div style={{ fontWeight: 600, color: BRAND.pink }}>
                        ${tier.monthlyPriceUsd}/mo
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {sub.status === 'active' && !sub.cancelAtPeriodEnd && (
                    <>
                      <button
                        onClick={() => handleManageAction('pause', sub.id)}
                        disabled={actionLoading === sub.id}
                        style={{
                          padding: '10px 20px',
                          borderRadius: 8,
                          border: '1px solid #444',
                          backgroundColor: 'transparent',
                          color: '#fff',
                          fontSize: 14,
                          cursor: 'pointer',
                        }}
                      >
                        Pause
                      </button>
                      <button
                        onClick={() => handleManageAction('cancel', sub.id)}
                        disabled={actionLoading === sub.id}
                        style={{
                          padding: '10px 20px',
                          borderRadius: 8,
                          border: '1px solid #EF4444',
                          backgroundColor: 'transparent',
                          color: '#EF4444',
                          fontSize: 14,
                          cursor: 'pointer',
                        }}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  
                  {sub.cancelAtPeriodEnd && (
                    <button
                      onClick={() => handleManageAction('resume', sub.id)}
                      disabled={actionLoading === sub.id}
                      style={{
                        padding: '10px 20px',
                        borderRadius: 8,
                        border: 'none',
                        backgroundColor: BRAND.teal,
                        color: '#fff',
                        fontSize: 14,
                        cursor: 'pointer',
                      }}
                    >
                      Resume Subscription
                    </button>
                  )}
                  
                  {sub.status === 'paused' && (
                    <button
                      onClick={() => handleManageAction('unpause', sub.id)}
                      disabled={actionLoading === sub.id}
                      style={{
                        padding: '10px 20px',
                        borderRadius: 8,
                        border: 'none',
                        backgroundColor: BRAND.teal,
                        color: '#fff',
                        fontSize: 14,
                        cursor: 'pointer',
                      }}
                    >
                      Resume
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Browse More */}
      {subscriptions.length > 0 && (
        <div style={{ 
          marginTop: 32, 
          padding: 24,
          backgroundColor: '#1a1a1a',
          borderRadius: 16,
          border: '1px solid #333',
          textAlign: 'center',
        }}>
          <p style={{ color: '#888', marginBottom: 16 }}>
            Looking to add another treatment?
          </p>
          <Link
            href="/pricing"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: BRAND.teal,
              color: '#fff',
              fontSize: 14,
              fontWeight: 600,
              borderRadius: 8,
              textDecoration: 'none',
            }}
          >
            Browse All Plans
          </Link>
        </div>
      )}
    </div>
  );
}
