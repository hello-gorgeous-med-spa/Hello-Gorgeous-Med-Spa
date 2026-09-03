'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  SUBSCRIPTION_TIERS, 
  SUBSCRIPTION_CATEGORIES,
  calculateMargin,
  calculatePrepayPrice,
  type SubscriptionTier,
} from '@/lib/regen/subscriptions/subscription-tiers';

const BRAND = {
  teal: '#0D9488',
  pink: '#E91E8C',
  dark: '#0a0a0a',
};

export default function PricingPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 3 | 6 | 12>('monthly');

  const categories = Object.entries(SUBSCRIPTION_CATEGORIES);
  
  const filteredTiers = selectedCategory 
    ? SUBSCRIPTION_TIERS.filter(t => t.category === selectedCategory)
    : SUBSCRIPTION_TIERS;

  const handleSubscribe = async (tier: SubscriptionTier) => {
    try {
      const response = await fetch('/api/regen/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tierId: tier.id,
          prepayMonths: billingCycle === 'monthly' ? null : billingCycle,
        }),
      });
      
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Subscription error:', error);
    }
  };

  const getPrice = (tier: SubscriptionTier): { price: number; perMonth: number; savings?: number } => {
    if (billingCycle === 'monthly') {
      return { price: tier.monthlyPriceUsd, perMonth: tier.monthlyPriceUsd };
    }
    
    const prepayTotal = calculatePrepayPrice(tier, billingCycle);
    const originalTotal = tier.monthlyPriceUsd * billingCycle;
    const savings = originalTotal - prepayTotal;
    
    return {
      price: prepayTotal,
      perMonth: Math.round(prepayTotal / billingCycle),
      savings,
    };
  };

  return (
    <div style={{ backgroundColor: BRAND.dark, minHeight: '100vh', color: '#fff' }}>
      {/* Hero */}
      <section style={{ 
        padding: '80px 24px 40px',
        textAlign: 'center',
        background: `linear-gradient(135deg, ${BRAND.dark} 0%, #1a1a2e 50%, ${BRAND.dark} 100%)`,
      }}>
        <Link href="/" style={{ 
          display: 'inline-block',
          marginBottom: 24,
          padding: '8px 16px',
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderRadius: 999,
          fontSize: 12,
          color: BRAND.teal,
          textDecoration: 'none',
        }}>
          ← Back to Home
        </Link>
        
        <h1 style={{ 
          fontSize: 'clamp(32px, 6vw, 56px)', 
          fontWeight: 800,
          marginBottom: 16,
          background: `linear-gradient(135deg, #fff 0%, ${BRAND.teal} 50%, ${BRAND.pink} 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Simple, Transparent Pricing
        </h1>
        <p style={{ fontSize: 18, color: '#888', maxWidth: 600, margin: '0 auto 32px' }}>
          All subscriptions include provider oversight, free shipping, and easy pause/cancel anytime.
        </p>

        {/* Billing Toggle */}
        <div style={{ 
          display: 'inline-flex',
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderRadius: 12,
          padding: 4,
          gap: 4,
        }}>
          {[
            { value: 'monthly' as const, label: 'Monthly' },
            { value: 3 as const, label: '3 Months', discount: '10% off' },
            { value: 6 as const, label: '6 Months', discount: '15% off' },
            { value: 12 as const, label: '12 Months', discount: '20% off' },
          ].map(option => (
            <button
              key={option.value}
              onClick={() => setBillingCycle(option.value)}
              style={{
                padding: '10px 16px',
                borderRadius: 8,
                border: 'none',
                backgroundColor: billingCycle === option.value ? BRAND.teal : 'transparent',
                color: billingCycle === option.value ? '#fff' : '#888',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 600,
                transition: 'all 0.2s',
              }}
            >
              {option.label}
              {option.discount && billingCycle === option.value && (
                <span style={{ 
                  display: 'block', 
                  fontSize: 10, 
                  color: '#fff',
                  opacity: 0.8,
                }}>
                  {option.discount}
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Category Filter */}
      <section style={{ padding: '0 24px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 8, 
          justifyContent: 'center',
        }}>
          <button
            onClick={() => setSelectedCategory(null)}
            style={{
              padding: '8px 16px',
              borderRadius: 999,
              border: `2px solid ${selectedCategory === null ? BRAND.pink : '#333'}`,
              backgroundColor: selectedCategory === null ? `${BRAND.pink}20` : 'transparent',
              color: selectedCategory === null ? BRAND.pink : '#888',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            All Programs
          </button>
          {categories.map(([key, cat]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              style={{
                padding: '8px 16px',
                borderRadius: 999,
                border: `2px solid ${selectedCategory === key ? cat.color : '#333'}`,
                backgroundColor: selectedCategory === key ? `${cat.color}20` : 'transparent',
                color: selectedCategory === key ? cat.color : '#888',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* Pricing Cards */}
      <section style={{ padding: '0 24px 80px', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 24,
        }}>
          {filteredTiers.map(tier => {
            const category = SUBSCRIPTION_CATEGORIES[tier.category];
            const { price, perMonth, savings } = getPrice(tier);
            
            return (
              <div
                key={tier.id}
                style={{
                  backgroundColor: '#1a1a1a',
                  borderRadius: 16,
                  padding: 24,
                  border: tier.popular ? `2px solid ${BRAND.pink}` : '1px solid #333',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Badge */}
                {tier.badge && (
                  <div style={{
                    position: 'absolute',
                    top: -12,
                    right: 16,
                    backgroundColor: tier.popular ? BRAND.pink : BRAND.teal,
                    color: '#fff',
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '4px 12px',
                    borderRadius: 999,
                    textTransform: 'uppercase',
                  }}>
                    {tier.badge}
                  </div>
                )}

                {/* Category Tag */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 12,
                  color: category.color,
                  marginBottom: 8,
                }}>
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </div>

                {/* Name & Description */}
                <h3 style={{ 
                  fontSize: 20, 
                  fontWeight: 700, 
                  marginBottom: 4,
                  color: '#fff',
                }}>
                  {tier.name}
                </h3>
                <p style={{ 
                  fontSize: 14, 
                  color: '#888', 
                  marginBottom: 16,
                  flex: 1,
                }}>
                  {tier.description}
                </p>

                {/* Price */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <span style={{ 
                      fontSize: 36, 
                      fontWeight: 800, 
                      color: BRAND.pink,
                    }}>
                      ${billingCycle === 'monthly' ? price : perMonth}
                    </span>
                    <span style={{ color: '#666', fontSize: 14 }}>/month</span>
                  </div>
                  
                  {billingCycle !== 'monthly' && (
                    <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>
                      <span style={{ color: BRAND.teal }}>
                        ${price} total
                      </span>
                      {savings && savings > 0 && (
                        <span style={{ color: '#22C55E', marginLeft: 8 }}>
                          Save ${savings}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Includes */}
                <ul style={{ 
                  listStyle: 'none', 
                  padding: 0, 
                  margin: '0 0 20px 0',
                  fontSize: 13,
                }}>
                  {tier.includes.map((item, i) => (
                    <li key={i} style={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      gap: 8,
                      marginBottom: 8,
                      color: '#ccc',
                    }}>
                      <span style={{ color: BRAND.teal }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => handleSubscribe(tier)}
                  style={{
                    width: '100%',
                    padding: '14px 24px',
                    borderRadius: 12,
                    border: 'none',
                    backgroundColor: tier.popular ? BRAND.pink : BRAND.teal,
                    color: '#fff',
                    fontSize: 16,
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.boxShadow = `0 8px 30px ${tier.popular ? BRAND.pink : BRAND.teal}40`;
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Get Started
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ 
        padding: '60px 24px', 
        maxWidth: 800, 
        margin: '0 auto',
        borderTop: '1px solid #222',
      }}>
        <h2 style={{ 
          fontSize: 28, 
          fontWeight: 700, 
          textAlign: 'center',
          marginBottom: 40,
        }}>
          Frequently Asked Questions
        </h2>

        {[
          {
            q: 'Can I pause or cancel anytime?',
            a: 'Yes! You can pause your subscription for up to 3 months or cancel anytime. No long-term contracts or cancellation fees.',
          },
          {
            q: 'Is there a consultation fee?',
            a: 'Your first month includes a provider consultation at no extra charge. We review your health history and create a personalized treatment plan.',
          },
          {
            q: 'How does shipping work?',
            a: 'All subscriptions include free shipping. Medications are shipped discreetly from our partner pharmacy directly to your door.',
          },
          {
            q: 'What if I need to change my dose?',
            a: 'Your provider can adjust your prescription at any time. Dose changes may affect your monthly price, and we\'ll always notify you before charging.',
          },
          {
            q: 'Do you accept insurance?',
            a: 'We\'re a cash-pay telehealth service, which allows us to offer lower prices than traditional pharmacy costs. HSA/FSA cards are accepted.',
          },
        ].map((faq, i) => (
          <div key={i} style={{ marginBottom: 24 }}>
            <h4 style={{ 
              fontSize: 16, 
              fontWeight: 600, 
              color: BRAND.teal,
              marginBottom: 8,
            }}>
              {faq.q}
            </h4>
            <p style={{ fontSize: 14, color: '#888', lineHeight: 1.6 }}>
              {faq.a}
            </p>
          </div>
        ))}
      </section>

      {/* Footer CTA */}
      <section style={{ 
        padding: '60px 24px',
        textAlign: 'center',
        background: `linear-gradient(135deg, ${BRAND.teal}20 0%, ${BRAND.pink}20 100%)`,
      }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>
          Ready to get started?
        </h2>
        <p style={{ color: '#888', marginBottom: 24 }}>
          Take our quick health assessment and get matched with the right treatment.
        </p>
        <Link
          href="/start"
          style={{
            display: 'inline-block',
            padding: '16px 32px',
            backgroundColor: BRAND.pink,
            color: '#fff',
            fontSize: 16,
            fontWeight: 700,
            borderRadius: 12,
            textDecoration: 'none',
          }}
        >
          Start Your Assessment
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ 
        padding: '40px 24px',
        textAlign: 'center',
        borderTop: '1px solid #222',
      }}>
        <div style={{ fontSize: 12, color: '#666' }}>
          <p>REGEN RX · tryregenrx.com · 630-636-6193</p>
          <p style={{ marginTop: 8 }}>
            <Link href="/terms" style={{ color: '#888', marginRight: 16 }}>Terms</Link>
            <Link href="/privacy" style={{ color: '#888' }}>Privacy</Link>
          </p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
