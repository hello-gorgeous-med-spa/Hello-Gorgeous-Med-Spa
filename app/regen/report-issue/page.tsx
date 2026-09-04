'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const BRAND = {
  teal: '#0D9488',
  pink: '#E91E8C',
  dark: '#0a0a0a',
  darkAlt: '#111',
  gray: '#888',
  cream: '#f5f5f5',
};

const SEVERITY_LEVELS = [
  { id: 'mild', label: 'Mild', description: 'Minor discomfort, not affecting daily activities', color: '#22C55E' },
  { id: 'moderate', label: 'Moderate', description: 'Noticeable symptoms affecting daily activities', color: '#F59E0B' },
  { id: 'severe', label: 'Severe', description: 'Significant symptoms requiring medical attention', color: '#EF4444' },
  { id: 'emergency', label: 'Emergency', description: 'Life-threatening - STOP AND CALL 911', color: '#7F1D1D' },
];

const COMMON_SYMPTOMS = [
  'Nausea/Vomiting',
  'Diarrhea',
  'Constipation',
  'Headache',
  'Dizziness',
  'Injection site reaction',
  'Fatigue',
  'Abdominal pain',
  'Skin rash/irritation',
  'Mood changes',
  'Sleep issues',
  'Heart palpitations',
  'Shortness of breath',
  'Swelling',
  'Vision changes',
  'Other',
];

export default function ReportIssuePage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    medication: '',
    severity: '',
    symptoms: [] as string[],
    description: '',
    startedWhen: '',
    stillOccurring: '',
    actionTaken: '',
    wantsCallback: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSymptomToggle = (symptom: string) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send to API
      await fetch('/api/regen/adverse-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          reportedAt: new Date().toISOString(),
        }),
      });

      setSubmitted(true);
    } catch {
      alert('There was an error submitting your report. Please call us directly at (630) 636-6193.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ backgroundColor: BRAND.dark, minHeight: '100vh', color: '#fff' }}>
        <header style={{ padding: '20px 24px', borderBottom: '1px solid #222' }}>
          <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link href="/">
              <Image src="/images/regen/logo-full.png" alt="REGEN RX" width={120} height={40} style={{ height: 32, width: 'auto' }} />
            </Link>
          </div>
        </header>

        <main style={{ padding: '80px 24px', maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 64, marginBottom: 24 }}>✅</div>
          <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 16 }}>Report Received</h1>
          <p style={{ fontSize: 18, color: BRAND.gray, marginBottom: 32 }}>
            Thank you for reporting this issue. A member of our clinical team will review your report 
            and contact you within 24 hours.
          </p>
          
          <div style={{ 
            backgroundColor: BRAND.darkAlt, 
            borderRadius: 16, 
            padding: 24, 
            marginBottom: 32,
            border: `1px solid ${BRAND.teal}40`,
          }}>
            <h3 style={{ color: BRAND.teal, marginBottom: 12 }}>What Happens Next?</h3>
            <ol style={{ textAlign: 'left', color: BRAND.gray, lineHeight: 1.8 }}>
              <li>1. Your report is flagged for clinical review</li>
              <li>2. A provider will review within 24 hours</li>
              <li>3. We will contact you with guidance</li>
              <li>4. Your medical record will be updated</li>
            </ol>
          </div>

          <div style={{ 
            backgroundColor: '#7f1d1d20', 
            borderRadius: 16, 
            padding: 24, 
            marginBottom: 32,
            border: '1px solid #EF4444',
          }}>
            <p style={{ color: '#EF4444', fontWeight: 600 }}>
              🚨 If your symptoms worsen or become severe, do not wait for our callback.
              <br />Call 911 or go to your nearest emergency room immediately.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/"
              style={{
                padding: '14px 28px',
                backgroundColor: BRAND.teal,
                color: '#fff',
                borderRadius: 12,
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              Return Home
            </Link>
            <a
              href="tel:6306366193"
              style={{
                padding: '14px 28px',
                backgroundColor: '#333',
                color: '#fff',
                borderRadius: 12,
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              Call Us Now
            </a>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: BRAND.dark, minHeight: '100vh', color: '#fff' }}>
      {/* Header */}
      <header style={{ padding: '20px 24px', borderBottom: '1px solid #222' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/">
            <Image src="/images/regen/logo-full.png" alt="REGEN RX" width={120} height={40} style={{ height: 32, width: 'auto' }} />
          </Link>
          <Link href="/" style={{ color: BRAND.gray, fontSize: 14, textDecoration: 'none' }}>
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Emergency Banner */}
      <div style={{ 
        backgroundColor: '#7f1d1d', 
        padding: '16px 24px',
        textAlign: 'center',
      }}>
        <p style={{ color: '#fff', fontSize: 14, fontWeight: 600, margin: 0 }}>
          🚨 MEDICAL EMERGENCY? Call <a href="tel:911" style={{ color: '#fff', textDecoration: 'underline' }}>911</a> immediately. 
          Do NOT use this form for emergencies.
        </p>
      </div>

      {/* Hero */}
      <section style={{
        padding: '60px 24px 40px',
        textAlign: 'center',
        background: `linear-gradient(135deg, ${BRAND.dark} 0%, #1a1a2e 100%)`,
        borderBottom: '1px solid #222',
      }}>
        <h1 style={{ 
          fontSize: 'clamp(28px, 5vw, 40px)', 
          fontWeight: 800,
          marginBottom: 16,
        }}>
          Report a Side Effect or Issue
        </h1>
        <p style={{ fontSize: 16, color: BRAND.gray, maxWidth: 600, margin: '0 auto' }}>
          Your safety is our priority. Use this form to report any adverse reactions, 
          side effects, or concerns about your treatment.
        </p>
      </section>

      {/* Form */}
      <main style={{ padding: '40px 24px 80px', maxWidth: 700, margin: '0 auto' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* Contact Info */}
          <div style={{ 
            backgroundColor: BRAND.darkAlt, 
            borderRadius: 16, 
            padding: 24,
            border: '1px solid #333',
          }}>
            <h3 style={{ marginBottom: 16, color: BRAND.cream }}>Your Information</h3>
            <div style={{ display: 'grid', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 14, color: BRAND.gray, marginBottom: 6 }}>Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: BRAND.dark,
                    border: `1px solid ${BRAND.teal}30`,
                    borderRadius: 8,
                    color: '#fff',
                    fontSize: 16,
                  }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 14, color: BRAND.gray, marginBottom: 6 }}>Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      backgroundColor: BRAND.dark,
                      border: `1px solid ${BRAND.teal}30`,
                      borderRadius: 8,
                      color: '#fff',
                      fontSize: 16,
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 14, color: BRAND.gray, marginBottom: 6 }}>Phone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      backgroundColor: BRAND.dark,
                      border: `1px solid ${BRAND.teal}30`,
                      borderRadius: 8,
                      color: '#fff',
                      fontSize: 16,
                    }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 14, color: BRAND.gray, marginBottom: 6 }}>Medication/Treatment *</label>
                <input
                  type="text"
                  required
                  value={formData.medication}
                  onChange={(e) => setFormData({ ...formData, medication: e.target.value })}
                  placeholder="e.g., Semaglutide 0.5mg"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: BRAND.dark,
                    border: `1px solid ${BRAND.teal}30`,
                    borderRadius: 8,
                    color: '#fff',
                    fontSize: 16,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Severity */}
          <div style={{ 
            backgroundColor: BRAND.darkAlt, 
            borderRadius: 16, 
            padding: 24,
            border: '1px solid #333',
          }}>
            <h3 style={{ marginBottom: 16, color: BRAND.cream }}>Severity Level *</h3>
            <div style={{ display: 'grid', gap: 12 }}>
              {SEVERITY_LEVELS.map((level) => (
                <label
                  key={level.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: 16,
                    backgroundColor: formData.severity === level.id ? `${level.color}20` : BRAND.dark,
                    border: `2px solid ${formData.severity === level.id ? level.color : '#333'}`,
                    borderRadius: 12,
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="radio"
                    name="severity"
                    value={level.id}
                    checked={formData.severity === level.id}
                    onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                    required
                    style={{ width: 20, height: 20, accentColor: level.color }}
                  />
                  <div>
                    <div style={{ fontWeight: 600, color: level.color }}>{level.label}</div>
                    <div style={{ fontSize: 13, color: BRAND.gray }}>{level.description}</div>
                  </div>
                </label>
              ))}
            </div>
            
            {formData.severity === 'emergency' && (
              <div style={{ 
                marginTop: 16, 
                padding: 16, 
                backgroundColor: '#7f1d1d40', 
                borderRadius: 12,
                border: '2px solid #EF4444',
              }}>
                <p style={{ color: '#EF4444', fontWeight: 700, margin: 0 }}>
                  🚨 STOP — If this is an emergency, hang up and call 911 or go to your nearest ER immediately!
                </p>
              </div>
            )}
          </div>

          {/* Symptoms */}
          <div style={{ 
            backgroundColor: BRAND.darkAlt, 
            borderRadius: 16, 
            padding: 24,
            border: '1px solid #333',
          }}>
            <h3 style={{ marginBottom: 16, color: BRAND.cream }}>Symptoms (Select All That Apply) *</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {COMMON_SYMPTOMS.map((symptom) => (
                <button
                  key={symptom}
                  type="button"
                  onClick={() => handleSymptomToggle(symptom)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: formData.symptoms.includes(symptom) ? BRAND.teal : BRAND.dark,
                    border: `1px solid ${formData.symptoms.includes(symptom) ? BRAND.teal : '#333'}`,
                    borderRadius: 999,
                    color: formData.symptoms.includes(symptom) ? '#fff' : BRAND.gray,
                    fontSize: 14,
                    cursor: 'pointer',
                  }}
                >
                  {symptom}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div style={{ 
            backgroundColor: BRAND.darkAlt, 
            borderRadius: 16, 
            padding: 24,
            border: '1px solid #333',
          }}>
            <h3 style={{ marginBottom: 16, color: BRAND.cream }}>Describe What Happened *</h3>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={5}
              placeholder="Please describe your symptoms in detail. Include when they started, how often they occur, and anything that makes them better or worse."
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: BRAND.dark,
                border: `1px solid ${BRAND.teal}30`,
                borderRadius: 8,
                color: '#fff',
                fontSize: 16,
                resize: 'vertical',
              }}
            />
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 14, color: BRAND.gray, marginBottom: 6 }}>When did symptoms start? *</label>
                <input
                  type="text"
                  required
                  value={formData.startedWhen}
                  onChange={(e) => setFormData({ ...formData, startedWhen: e.target.value })}
                  placeholder="e.g., 2 days ago"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: BRAND.dark,
                    border: `1px solid ${BRAND.teal}30`,
                    borderRadius: 8,
                    color: '#fff',
                    fontSize: 16,
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 14, color: BRAND.gray, marginBottom: 6 }}>Still occurring? *</label>
                <select
                  required
                  value={formData.stillOccurring}
                  onChange={(e) => setFormData({ ...formData, stillOccurring: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: BRAND.dark,
                    border: `1px solid ${BRAND.teal}30`,
                    borderRadius: 8,
                    color: '#fff',
                    fontSize: 16,
                  }}
                >
                  <option value="">Select...</option>
                  <option value="yes">Yes, still happening</option>
                  <option value="resolved">No, resolved</option>
                  <option value="intermittent">Comes and goes</option>
                </select>
              </div>
            </div>

            <div style={{ marginTop: 16 }}>
              <label style={{ display: 'block', fontSize: 14, color: BRAND.gray, marginBottom: 6 }}>
                Have you taken any action? (e.g., stopped medication, reduced dose, taken OTC meds)
              </label>
              <input
                type="text"
                value={formData.actionTaken}
                onChange={(e) => setFormData({ ...formData, actionTaken: e.target.value })}
                placeholder="Describe any steps you've already taken"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: BRAND.dark,
                  border: `1px solid ${BRAND.teal}30`,
                  borderRadius: 8,
                  color: '#fff',
                  fontSize: 16,
                }}
              />
            </div>
          </div>

          {/* Callback Request */}
          <label style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: 20,
            backgroundColor: `${BRAND.teal}10`,
            borderRadius: 12,
            border: `1px solid ${BRAND.teal}40`,
            cursor: 'pointer',
          }}>
            <input
              type="checkbox"
              checked={formData.wantsCallback}
              onChange={(e) => setFormData({ ...formData, wantsCallback: e.target.checked })}
              style={{ width: 24, height: 24, accentColor: BRAND.teal }}
            />
            <div>
              <div style={{ fontWeight: 600, color: BRAND.cream }}>Request a callback from our clinical team</div>
              <div style={{ fontSize: 13, color: BRAND.gray }}>We'll call you within 24 hours (business days)</div>
            </div>
          </label>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || formData.symptoms.length === 0}
            style={{
              padding: '18px 32px',
              backgroundColor: BRAND.pink,
              color: '#fff',
              border: 'none',
              borderRadius: 12,
              fontSize: 18,
              fontWeight: 700,
              cursor: loading || formData.symptoms.length === 0 ? 'not-allowed' : 'pointer',
              opacity: loading || formData.symptoms.length === 0 ? 0.5 : 1,
            }}
          >
            {loading ? 'Submitting...' : 'Submit Report'}
          </button>

          <p style={{ fontSize: 12, color: BRAND.gray, textAlign: 'center' }}>
            Your report will be reviewed by our clinical team and added to your medical record.
            <br />For urgent concerns, call us directly: <a href="tel:6306366193" style={{ color: BRAND.teal }}>(630) 636-6193</a>
          </p>
        </form>
      </main>
    </div>
  );
}
