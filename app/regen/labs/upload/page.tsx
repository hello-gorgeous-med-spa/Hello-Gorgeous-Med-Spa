'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const BRAND = {
  teal: '#0D9488',
  pink: '#E91E8C',
  dark: '#0A0A0A',
  darkAlt: '#111111',
  cream: '#FAF9F6',
  gray: '#9CA3AF',
};

export default function LabUploadPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    labDate: '',
    labProvider: '',
    treatmentGoal: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(selectedFile.type)) {
        alert('Please upload a PDF or image file (JPG, PNG)');
        return;
      }
      // Validate file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      alert('Please upload your lab results');
      return;
    }

    setUploading(true);

    try {
      // Create form data for file upload
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('patient', JSON.stringify(formData));

      const res = await fetch('/api/regen/labs/upload', {
        method: 'POST',
        body: uploadData,
      });

      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to upload labs');
    } finally {
      setUploading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: BRAND.dark }}>
        <header style={{ backgroundColor: BRAND.darkAlt, borderBottom: `1px solid ${BRAND.teal}20` }}>
          <div className="max-w-3xl mx-auto px-6 py-4">
            <Link href="/">
              <Image src="/images/regen/logo-full.png" alt="REGEN RX" width={140} height={45} className="h-10 w-auto brightness-110" />
            </Link>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-6 py-16 text-center">
          <div className="mb-8">
            <div 
              className="w-24 h-24 rounded-full flex items-center justify-center mx-auto"
              style={{ backgroundColor: `${BRAND.teal}20`, border: `3px solid ${BRAND.teal}` }}
            >
              <svg className="w-12 h-12" style={{ color: BRAND.teal }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-4" style={{ color: BRAND.cream }}>
            Labs Uploaded! 📄
          </h1>
          
          <p className="text-lg mb-8" style={{ color: BRAND.gray }}>
            Our provider will review your lab results within 24-48 hours.
          </p>

          <div className="rounded-2xl p-6 mb-8 text-left" style={{ backgroundColor: BRAND.darkAlt, border: `1px solid ${BRAND.teal}40` }}>
            <h2 className="font-bold text-lg mb-4" style={{ color: BRAND.teal }}>
              📋 What Happens Next
            </h2>
            <ol className="space-y-3" style={{ color: BRAND.gray }}>
              <li className="flex gap-3">
                <span style={{ color: BRAND.teal }}>1.</span>
                <span>Our provider reviews your lab results</span>
              </li>
              <li className="flex gap-3">
                <span style={{ color: BRAND.teal }}>2.</span>
                <span>We&apos;ll email you once review is complete</span>
              </li>
              <li className="flex gap-3">
                <span style={{ color: BRAND.teal }}>3.</span>
                <span>If approved, you can proceed with your treatment order</span>
              </li>
            </ol>
          </div>

          <div className="space-y-4">
            <Link
              href="/start"
              className="inline-block px-8 py-4 rounded-xl font-bold transition-all hover:scale-105"
              style={{ backgroundColor: BRAND.pink, color: 'white' }}
            >
              Continue Your Intake →
            </Link>
            <p className="text-sm" style={{ color: BRAND.gray }}>
              Complete your health questionnaire while we review your labs.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: BRAND.dark }}>
      {/* Header */}
      <header style={{ backgroundColor: BRAND.darkAlt, borderBottom: `1px solid ${BRAND.teal}20` }}>
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <Image src="/images/regen/logo-full.png" alt="REGEN RX" width={140} height={45} className="h-10 w-auto brightness-110" />
          </Link>
          <Link href="/labs" className="text-sm hover:underline" style={{ color: BRAND.gray }}>
            ← Back to Labs
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-10 px-6 text-center" style={{ background: `linear-gradient(135deg, ${BRAND.dark} 0%, ${BRAND.teal}20 100%)` }}>
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-3" style={{ color: BRAND.cream }}>
            Upload Your Lab Results
          </h1>
          <p style={{ color: BRAND.gray }}>
            Already have recent labs from your doctor? Upload them here for provider review.
          </p>
        </div>
      </section>

      <main className="max-w-2xl mx-auto px-6 py-10">
        {/* Requirements */}
        <div className="mb-8 p-4 rounded-xl" style={{ backgroundColor: `${BRAND.teal}10`, border: `1px solid ${BRAND.teal}30` }}>
          <h3 className="font-semibold mb-2" style={{ color: BRAND.teal }}>📋 Lab Requirements</h3>
          <ul className="text-sm space-y-1" style={{ color: BRAND.gray }}>
            <li>• Labs must be from within the <strong>last 6 months</strong></li>
            <li>• Must include patient name and date of service</li>
            <li>• Accepted formats: PDF, JPG, PNG (max 10MB)</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Info */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: BRAND.gray }}>First Name *</label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-4 py-3 rounded-lg"
                style={{ backgroundColor: BRAND.darkAlt, border: `1px solid ${BRAND.teal}30`, color: BRAND.cream }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: BRAND.gray }}>Last Name *</label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-4 py-3 rounded-lg"
                style={{ backgroundColor: BRAND.darkAlt, border: `1px solid ${BRAND.teal}30`, color: BRAND.cream }}
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: BRAND.gray }}>Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-lg"
                style={{ backgroundColor: BRAND.darkAlt, border: `1px solid ${BRAND.teal}30`, color: BRAND.cream }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: BRAND.gray }}>Phone *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-lg"
                style={{ backgroundColor: BRAND.darkAlt, border: `1px solid ${BRAND.teal}30`, color: BRAND.cream }}
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: BRAND.gray }}>Date of Birth *</label>
              <input
                type="date"
                required
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                className="w-full px-4 py-3 rounded-lg"
                style={{ backgroundColor: BRAND.darkAlt, border: `1px solid ${BRAND.teal}30`, color: BRAND.cream }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: BRAND.gray }}>Lab Date *</label>
              <input
                type="date"
                required
                value={formData.labDate}
                onChange={(e) => setFormData({ ...formData, labDate: e.target.value })}
                className="w-full px-4 py-3 rounded-lg"
                style={{ backgroundColor: BRAND.darkAlt, border: `1px solid ${BRAND.teal}30`, color: BRAND.cream }}
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: BRAND.gray }}>Lab Provider</label>
              <input
                type="text"
                placeholder="e.g. Quest, Labcorp, My PCP"
                value={formData.labProvider}
                onChange={(e) => setFormData({ ...formData, labProvider: e.target.value })}
                className="w-full px-4 py-3 rounded-lg"
                style={{ backgroundColor: BRAND.darkAlt, border: `1px solid ${BRAND.teal}30`, color: BRAND.cream }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: BRAND.gray }}>Treatment Goal *</label>
              <select
                required
                value={formData.treatmentGoal}
                onChange={(e) => setFormData({ ...formData, treatmentGoal: e.target.value })}
                className="w-full px-4 py-3 rounded-lg"
                style={{ backgroundColor: BRAND.darkAlt, border: `1px solid ${BRAND.teal}30`, color: BRAND.cream }}
              >
                <option value="">Select...</option>
                <option value="weight-loss">Weight Loss (GLP-1)</option>
                <option value="hormones-women">Hormone Therapy (Women)</option>
                <option value="hormones-men">Hormone Therapy / TRT (Men)</option>
                <option value="peptides">Peptide Therapy</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: BRAND.gray }}>
              Upload Lab Results *
            </label>
            <div
              className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all hover:border-solid"
              style={{ 
                borderColor: file ? BRAND.teal : `${BRAND.gray}50`,
                backgroundColor: file ? `${BRAND.teal}10` : BRAND.darkAlt,
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="hidden"
              />
              {file ? (
                <div>
                  <span className="text-4xl mb-2 block">📄</span>
                  <p className="font-medium" style={{ color: BRAND.cream }}>{file.name}</p>
                  <p className="text-sm mt-1" style={{ color: BRAND.teal }}>
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    className="mt-3 text-sm underline"
                    style={{ color: BRAND.pink }}
                  >
                    Remove & Choose Different File
                  </button>
                </div>
              ) : (
                <div>
                  <span className="text-4xl mb-2 block">📤</span>
                  <p style={{ color: BRAND.cream }}>Click to upload or drag and drop</p>
                  <p className="text-sm mt-1" style={{ color: BRAND.gray }}>
                    PDF, JPG, or PNG (max 10MB)
                  </p>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading || !file}
            className="w-full py-4 text-white font-bold rounded-xl transition-all hover:scale-[1.02] disabled:opacity-50"
            style={{ backgroundColor: BRAND.pink }}
          >
            {uploading ? 'Uploading...' : 'Submit Lab Results'}
          </button>
        </form>

        {/* Help */}
        <div className="mt-8 text-center">
          <p className="text-sm" style={{ color: BRAND.gray }}>
            Don&apos;t have recent labs?{' '}
            <Link href="/labs" style={{ color: BRAND.teal }} className="underline">
              Order a lab panel here
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
