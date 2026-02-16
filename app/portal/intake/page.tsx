'use client';

// ============================================================
// CLIENT PORTAL - INTAKE FORMS LIST
// View and complete required intake forms - Connected to Live Data
// ============================================================

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { SITE } from '@/lib/seo';
import { STANDARD_INTAKE_FORMS, getRequiredForms } from '@/lib/hgos/intake-forms';


// Skeleton component
function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-white rounded ${className}`} />;
}

export default function IntakeFormsPage() {
  const [completedForms, setCompletedForms] = useState<any[]>([]);
  const [upcomingAppointment, setUpcomingAppointment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Intake forms data - placeholder until client auth is implemented
  useEffect(() => {
    // Forms will load when logged in
    setCompletedForms([]);
    setUpcomingAppointment(null);
    setLoading(false);
  }, []);

  // Get required forms for upcoming appointment
  const requiredForms = useMemo(() => {
    if (!upcomingAppointment) return [];
    return getRequiredForms(upcomingAppointment.serviceId, completedForms);
  }, [upcomingAppointment, completedForms]);

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

  const pendingCount = allForms.filter(f => f.status === 'required').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-black">Intake Forms</h1>
        <p className="text-black">Complete required forms before your appointment</p>
      </div>

      {/* Status Banner */}
      {loading ? (
        <Skeleton className="h-24" />
      ) : pendingCount > 0 ? (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <span className="text-4xl">📋</span>
            <div>
              <h2 className="font-semibold text-amber-900">
                {pendingCount} Form{pendingCount > 1 ? 's' : ''} Required
              </h2>
              <p className="text-amber-800 text-sm">
                Please complete these forms before your upcoming appointment.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <span className="text-4xl">✅</span>
            <div>
              <h2 className="font-semibold text-green-900">All Forms Complete</h2>
              <p className="text-green-800 text-sm">
                You're all set for your appointment!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Upcoming Appointment */}
      {upcomingAppointment && (
        <div className="bg-white rounded-2xl border border-black p-6">
          <h3 className="font-semibold text-black mb-3">Upcoming Appointment</h3>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center">
              <span className="text-2xl">💆‍♀️</span>
            </div>
            <div>
              <p className="font-medium text-black">{upcomingAppointment.serviceName}</p>
              <p className="text-sm text-black">{upcomingAppointment.date} at {upcomingAppointment.time}</p>
            </div>
          </div>
        </div>
      )}

      {/* Forms List */}
      <div className="space-y-4">
        <h3 className="font-semibold text-black">All Forms</h3>
        
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))
        ) : (
          allForms.map((form) => (
            <div
              key={form.id}
              className={`bg-white rounded-xl border p-4 ${
                form.status === 'required' ? 'border-amber-300 bg-amber-50' : 'border-black'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    form.status === 'completed' ? 'bg-green-100' :
                    form.status === 'required' ? 'bg-amber-100' :
                    'bg-white'
                  }`}>
                    <span className="text-xl">
                      {form.status === 'completed' ? '✓' :
                       form.status === 'required' ? '!' :
                       '📄'}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-black">{form.name}</h4>
                    <p className="text-sm text-black">{form.description}</p>
                    {form.completedAt && (
                      <p className="text-xs text-black mt-1">
                        Completed: {form.completedAt.toLocaleDateString()}
                        {form.expiresAt && ` • Expires: ${form.expiresAt.toLocaleDateString()}`}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  {form.status === 'completed' ? (
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                      Complete
                    </span>
                  ) : form.status === 'required' ? (
                    <Link
                      href={`/portal/intake/${form.id}`}
                      className="px-4 py-2 bg-[#FF2D8E] text-white text-sm font-medium rounded-lg hover:bg-black"
                    >
                      Complete Now
                    </Link>
                  ) : (
                    <Link
                      href={`/portal/intake/${form.id}`}
                      className="px-4 py-2 border border-black text-black text-sm font-medium rounded-lg hover:bg-white"
                    >
                      View
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Help Section */}
      <div className="bg-white rounded-2xl p-6">
        <h3 className="font-semibold text-black mb-2">Need Help?</h3>
        <p className="text-black text-sm mb-4">
          If you have questions about any of these forms, please contact us.
        </p>
        <div className="flex gap-3">
          <a
            href="tel:+16306366193"
            className="px-4 py-2 bg-white border border-black text-black rounded-lg hover:bg-white text-sm font-medium"
          >
            📞 Call Us
          </a>
          <a
            href={`mailto:${SITE.email}`}
            className="px-4 py-2 bg-white border border-black text-black rounded-lg hover:bg-white text-sm font-medium"
          >
            ✉️ Email Us
          </a>
        </div>
      </div>
    </div>
  );
}
