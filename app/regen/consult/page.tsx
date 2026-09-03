'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const BRAND = {
  teal: '#0D9488',
  pink: '#E91E8C',
  dark: '#0a0a0a',
};

const CONSULTATION_PRICE = 99;

const TIME_SLOTS = [
  { day: 'Monday', times: ['10:00 AM', '2:00 PM', '4:00 PM'] },
  { day: 'Tuesday', times: ['10:00 AM', '11:00 AM', '3:00 PM'] },
  { day: 'Wednesday', times: ['9:00 AM', '1:00 PM', '4:00 PM'] },
  { day: 'Thursday', times: ['10:00 AM', '2:00 PM', '5:00 PM'] },
  { day: 'Friday', times: ['9:00 AM', '11:00 AM', '2:00 PM'] },
];

export default function ConsultPage() {
  const [step, setStep] = useState<'info' | 'time' | 'payment'>('info');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    goal: '',
    questions: '',
    selectedDay: '',
    selectedTime: '',
  });

  const goals = [
    'Weight Loss (GLP-1)',
    'Hormone Therapy',
    'Peptide Therapy',
    'Vitamin Injectables',
    'Skincare',
    'Hair Restoration',
    'Sexual Wellness',
    'Not sure — need guidance',
  ];

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/regen/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to book consultation');
    } finally {
      setLoading(false);
    }
  };

  const canProceedToTime = formData.firstName && formData.lastName && formData.email && formData.phone && formData.goal;
  const canProceedToPayment = formData.selectedDay && formData.selectedTime;

  return (
    <div style={{ backgroundColor: BRAND.dark, minHeight: '100vh', color: '#fff' }}>
      {/* Header */}
      <header style={{ 
        padding: '20px 24px',
        borderBottom: '1px solid #222',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/">
            <Image src="/images/regen/logo-full.png" alt="REGEN RX" width={120} height={40} style={{ height: 32, width: 'auto' }} />
          </Link>
          <Link href="/pricing" style={{ color: '#888', fontSize: 14, textDecoration: 'none' }}>
            ← Back to Pricing
          </Link>
        </div>
      </header>

      <main style={{ padding: '40px 24px 80px', maxWidth: 900, margin: '0 auto' }}>
        {/* Progress Steps */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: 8,
          marginBottom: 48,
        }}>
          {['Your Info', 'Pick a Time', 'Confirm & Pay'].map((label, i) => {
            const stepNum = i + 1;
            const isActive = (step === 'info' && i === 0) || (step === 'time' && i === 1) || (step === 'payment' && i === 2);
            const isComplete = (step === 'time' && i === 0) || (step === 'payment' && i <= 1);
            
            return (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  fontWeight: 600,
                  backgroundColor: isComplete ? BRAND.teal : isActive ? BRAND.pink : '#333',
                  color: '#fff',
                }}>
                  {isComplete ? '✓' : stepNum}
                </div>
                <span style={{ 
                  fontSize: 14, 
                  color: isActive ? '#fff' : '#666',
                  display: i < 2 ? 'none' : 'inline',
                }}>
                  {label}
                </span>
                {i < 2 && (
                  <div style={{ width: 40, height: 2, backgroundColor: isComplete ? BRAND.teal : '#333' }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Provider Card */}
        <div style={{
          display: 'flex',
          gap: 24,
          alignItems: 'center',
          padding: 24,
          backgroundColor: '#1a1a1a',
          borderRadius: 16,
          marginBottom: 32,
          flexWrap: 'wrap',
        }}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            backgroundColor: BRAND.teal,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 32,
            flexShrink: 0,
          }}>
            👨‍⚕️
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>
              Ryan Kent, FNP-BC
            </h2>
            <p style={{ fontSize: 14, color: '#888', marginBottom: 8 }}>
              Board-Certified Family Nurse Practitioner
            </p>
            <p style={{ fontSize: 13, color: '#aaa', lineHeight: 1.5 }}>
              10+ years in functional medicine, hormone optimization, and regenerative therapies. 
              Full Practice Authority in Illinois.
            </p>
          </div>
          <div style={{ 
            textAlign: 'center',
            padding: '16px 24px',
            backgroundColor: BRAND.dark,
            borderRadius: 12,
          }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: BRAND.pink }}>$99</div>
            <div style={{ fontSize: 12, color: '#666' }}>30-min video call</div>
            <div style={{ fontSize: 11, color: BRAND.teal, marginTop: 4 }}>
              Credited to first order
            </div>
          </div>
        </div>

        {/* Step 1: Info */}
        {step === 'info' && (
          <div style={{
            backgroundColor: '#1a1a1a',
            borderRadius: 16,
            padding: 32,
          }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24 }}>
              Tell us about yourself
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: '#888', marginBottom: 6 }}>First Name *</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={e => setFormData(f => ({ ...f, firstName: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: '#111',
                    border: '1px solid #333',
                    borderRadius: 8,
                    color: '#fff',
                    fontSize: 16,
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: '#888', marginBottom: 6 }}>Last Name *</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={e => setFormData(f => ({ ...f, lastName: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: '#111',
                    border: '1px solid #333',
                    borderRadius: 8,
                    color: '#fff',
                    fontSize: 16,
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: '#888', marginBottom: 6 }}>Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData(f => ({ ...f, email: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: '#111',
                    border: '1px solid #333',
                    borderRadius: 8,
                    color: '#fff',
                    fontSize: 16,
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: '#888', marginBottom: 6 }}>Phone *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={e => setFormData(f => ({ ...f, phone: e.target.value }))}
                  placeholder="(630) 636-6193"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: '#111',
                    border: '1px solid #333',
                    borderRadius: 8,
                    color: '#fff',
                    fontSize: 16,
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 13, color: '#888', marginBottom: 6 }}>What are you interested in? *</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {goals.map(goal => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => setFormData(f => ({ ...f, goal }))}
                    style={{
                      padding: '10px 16px',
                      borderRadius: 999,
                      border: `2px solid ${formData.goal === goal ? BRAND.pink : '#333'}`,
                      backgroundColor: formData.goal === goal ? `${BRAND.pink}20` : 'transparent',
                      color: formData.goal === goal ? BRAND.pink : '#888',
                      fontSize: 13,
                      cursor: 'pointer',
                    }}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 32 }}>
              <label style={{ display: 'block', fontSize: 13, color: '#888', marginBottom: 6 }}>
                Any specific questions for Ryan? (optional)
              </label>
              <textarea
                value={formData.questions}
                onChange={e => setFormData(f => ({ ...f, questions: e.target.value }))}
                placeholder="E.g., I've tried other weight loss programs without success, wondering if GLP-1 is right for me..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: '#111',
                  border: '1px solid #333',
                  borderRadius: 8,
                  color: '#fff',
                  fontSize: 14,
                  resize: 'vertical',
                }}
              />
            </div>

            <button
              onClick={() => setStep('time')}
              disabled={!canProceedToTime}
              style={{
                width: '100%',
                padding: '16px 32px',
                backgroundColor: canProceedToTime ? BRAND.pink : '#333',
                color: canProceedToTime ? '#fff' : '#666',
                border: 'none',
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 700,
                cursor: canProceedToTime ? 'pointer' : 'not-allowed',
              }}
            >
              Continue to Pick a Time →
            </button>
          </div>
        )}

        {/* Step 2: Time Selection */}
        {step === 'time' && (
          <div style={{
            backgroundColor: '#1a1a1a',
            borderRadius: 16,
            padding: 32,
          }}>
            <button
              onClick={() => setStep('info')}
              style={{
                background: 'none',
                border: 'none',
                color: '#888',
                fontSize: 14,
                cursor: 'pointer',
                marginBottom: 16,
              }}
            >
              ← Back to your info
            </button>
            
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
              Pick a time that works
            </h3>
            <p style={{ fontSize: 14, color: '#888', marginBottom: 24 }}>
              All times are Central Time (CT). Video call link will be sent to your email.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {TIME_SLOTS.map(({ day, times }) => (
                <div key={day}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: BRAND.teal, marginBottom: 8 }}>
                    {day}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {times.map(time => {
                      const isSelected = formData.selectedDay === day && formData.selectedTime === time;
                      return (
                        <button
                          key={`${day}-${time}`}
                          onClick={() => setFormData(f => ({ ...f, selectedDay: day, selectedTime: time }))}
                          style={{
                            padding: '10px 20px',
                            borderRadius: 8,
                            border: `2px solid ${isSelected ? BRAND.pink : '#333'}`,
                            backgroundColor: isSelected ? `${BRAND.pink}20` : '#111',
                            color: isSelected ? '#fff' : '#aaa',
                            fontSize: 14,
                            cursor: 'pointer',
                          }}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {formData.selectedDay && formData.selectedTime && (
              <div style={{
                marginTop: 24,
                padding: 16,
                backgroundColor: `${BRAND.teal}15`,
                borderRadius: 12,
                border: `1px solid ${BRAND.teal}30`,
              }}>
                <p style={{ fontSize: 14, color: '#fff' }}>
                  ✓ Selected: <strong>{formData.selectedDay} at {formData.selectedTime}</strong> (CT)
                </p>
              </div>
            )}

            <button
              onClick={() => setStep('payment')}
              disabled={!canProceedToPayment}
              style={{
                width: '100%',
                marginTop: 24,
                padding: '16px 32px',
                backgroundColor: canProceedToPayment ? BRAND.pink : '#333',
                color: canProceedToPayment ? '#fff' : '#666',
                border: 'none',
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 700,
                cursor: canProceedToPayment ? 'pointer' : 'not-allowed',
              }}
            >
              Continue to Payment →
            </button>
          </div>
        )}

        {/* Step 3: Confirm & Pay */}
        {step === 'payment' && (
          <div style={{
            backgroundColor: '#1a1a1a',
            borderRadius: 16,
            padding: 32,
          }}>
            <button
              onClick={() => setStep('time')}
              style={{
                background: 'none',
                border: 'none',
                color: '#888',
                fontSize: 14,
                cursor: 'pointer',
                marginBottom: 16,
              }}
            >
              ← Back to time selection
            </button>
            
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24 }}>
              Confirm your consultation
            </h3>

            <div style={{ 
              backgroundColor: '#111',
              borderRadius: 12,
              padding: 20,
              marginBottom: 24,
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, fontSize: 14 }}>
                <div>
                  <div style={{ color: '#666', marginBottom: 4 }}>Name</div>
                  <div style={{ color: '#fff' }}>{formData.firstName} {formData.lastName}</div>
                </div>
                <div>
                  <div style={{ color: '#666', marginBottom: 4 }}>Email</div>
                  <div style={{ color: '#fff' }}>{formData.email}</div>
                </div>
                <div>
                  <div style={{ color: '#666', marginBottom: 4 }}>Phone</div>
                  <div style={{ color: '#fff' }}>{formData.phone}</div>
                </div>
                <div>
                  <div style={{ color: '#666', marginBottom: 4 }}>Interest</div>
                  <div style={{ color: BRAND.pink }}>{formData.goal}</div>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <div style={{ color: '#666', marginBottom: 4 }}>Appointment</div>
                  <div style={{ color: BRAND.teal, fontWeight: 600 }}>
                    {formData.selectedDay} at {formData.selectedTime} (CT)
                  </div>
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 20,
              backgroundColor: `${BRAND.pink}10`,
              borderRadius: 12,
              marginBottom: 24,
            }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>Expert Consultation</div>
                <div style={{ fontSize: 13, color: '#888' }}>30-min video call with Ryan Kent, FNP-BC</div>
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: BRAND.pink }}>$99</div>
            </div>

            <div style={{ 
              fontSize: 13, 
              color: '#888', 
              marginBottom: 24,
              padding: 16,
              backgroundColor: '#111',
              borderRadius: 8,
            }}>
              <p style={{ marginBottom: 8 }}>
                ✓ <strong style={{ color: '#fff' }}>$99 credit</strong> applied to your first prescription order
              </p>
              <p style={{ margin: 0 }}>
                ✓ Video call link sent to your email after payment
              </p>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px 32px',
                background: `linear-gradient(135deg, ${BRAND.pink} 0%, #c4157a 100%)`,
                color: '#fff',
                border: 'none',
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 700,
                cursor: loading ? 'wait' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Redirecting to payment...' : 'Pay $99 & Confirm Booking'}
            </button>

            <p style={{ textAlign: 'center', fontSize: 12, color: '#666', marginTop: 16 }}>
              Secure payment powered by Stripe
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
