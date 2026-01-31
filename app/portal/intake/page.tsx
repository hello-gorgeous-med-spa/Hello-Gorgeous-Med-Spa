'use client';

// ============================================================
// CLIENT PORTAL - INTAKE FORMS LIST
// View and complete required intake forms
// ============================================================

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { STANDARD_INTAKE_FORMS, getRequiredForms } from '@/lib/hgos/intake-forms';

// Mock completed forms - would come from Supabase
const MOCK_COMPLETED_FORMS = [
  { formId: 'hipaa-consent', completedAt: new Date('2025-06-15') },
];

// Mock upcoming appointment - would come from Supabase
const MOCK_UPCOMING_APPOINTMENT = {
  id: 'apt-1',
  serviceId: 'botox',
  serviceName: 'Botox - Full Face',
  date: '2026-02-05',
  time: '10:00 AM',
};

export default function IntakeFormsPage() {
  const [completedForms] = useState(MOCK_COMPLETED_FORMS);

  // Get required forms for upcoming appointment
  const requiredForms = useMemo(() => {
    if (!MOCK_UPCOMING_APPOINTMENT) return [];
    return getRequiredForms(MOCK_UPCOMING_APPOINTMENT.serviceId, completedForms);
  }, [completedForms]);

  // All forms status
  const allForms = useMemo(() => {
    return STANDARD_INTAKE_FORMS.map(form => {
      const completed = completedForms.find(cf => cf.formId === form.id);
      let status: 'completed' | 'required' | 'optional' = 'optional';
      let expiresAt: Date | null = null;

      if (completed) {
        status = 'completed';
        if (form.expiresInDays) {
          expiresAt = new Date(completed.completedAt);
          expiresAt.setDate(expiresAt.getDate() + form.expiresInDays);
          if (new Date() > expiresAt) {
            status = 'required';
          }
        }
      } else if (requiredForms.find(rf => rf.id === form.id)) {
        status = 'required';
      }

      return {
        ...form,
        status,
        completedAt: completed?.completedAt,
        expiresAt,
      };
    });
  }, [completedForms, requiredForms]);

  const statusColors = {
    completed: 'bg-green-100 text-green-700',
    required: 'bg-red-100 text-red-700',
    optional: 'bg-gray-100 text-gray-600',
  };

  const statusLabels = {
    completed: '✓ Completed',
    required: '⚠ Required',
    optional: 'Optional',
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/portal" className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-block">
          ← Back to Portal
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Intake Forms</h1>
        <p className="text-gray-500">Complete required forms before your appointment</p>
      </div>

      {/* Upcoming Appointment Notice */}
      {MOCK_UPCOMING_APPOINTMENT && requiredForms.length > 0 && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="font-medium text-amber-800">
            📋 Forms needed before your {MOCK_UPCOMING_APPOINTMENT.serviceName} appointment
          </p>
          <p className="text-sm text-amber-700 mt-1">
            Please complete {requiredForms.length} form(s) before{' '}
            {new Date(MOCK_UPCOMING_APPOINTMENT.date).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      )}

      {/* Forms List */}
      <div className="space-y-4">
        {allForms.map((form) => (
          <div
            key={form.id}
            className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-gray-900">{form.name}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[form.status]}`}>
                    {statusLabels[form.status]}
                  </span>
                </div>
                <p className="text-gray-500 text-sm mt-1">{form.description}</p>
                
                {form.status === 'completed' && form.completedAt && (
                  <p className="text-xs text-gray-400 mt-2">
                    Completed on {new Date(form.completedAt).toLocaleDateString()}
                    {form.expiresAt && (
                      <> • Expires {new Date(form.expiresAt).toLocaleDateString()}</>
                    )}
                  </p>
                )}
              </div>

              <div className="ml-4">
                {form.status === 'completed' ? (
                  <Link
                    href={`/portal/intake/${form.id}`}
                    className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg inline-block"
                  >
                    Update
                  </Link>
                ) : (
                  <Link
                    href={`/portal/intake/${form.id}`}
                    className={`px-4 py-2 font-medium rounded-lg inline-block ${
                      form.status === 'required'
                        ? 'bg-pink-500 text-white hover:bg-pink-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Complete
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-xl">
        <h4 className="font-medium text-blue-900">📝 Why do I need to complete these forms?</h4>
        <p className="text-sm text-blue-700 mt-1">
          Intake forms help us provide you with safe, effective treatments. Your medical history 
          helps us identify any contraindications, and consent forms ensure you understand the 
          treatment process and potential risks.
        </p>
      </div>

      {/* HIPAA Notice */}
      <p className="text-xs text-gray-400 mt-4 text-center">
        Your information is protected under HIPAA and stored securely. 
        We never share your data without your explicit consent.
      </p>
    </div>
  );
}
