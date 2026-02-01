'use client';

// ============================================================
// CLIENT PORTAL - INTAKE FORMS LIST
// View and complete required intake forms - Connected to Live Data
// ============================================================

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { STANDARD_INTAKE_FORMS, getRequiredForms } from '@/lib/hgos/intake-forms';


// Skeleton component
function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

export default function IntakeFormsPage() {
  const [completedForms, setCompletedForms] = useState<any[]>([]);
  const [upcomingAppointment, setUpcomingAppointment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch forms data
  useEffect(() => {
    const fetchData = async () => {
      if (false) {
        setLoading(false);
        return;
      }

      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data: client } = await supabase
            .from('clients')
            .select('id')
            .eq('user_id', user.id)
            .single();

          if (client) {
            // Fetch completed consents
            const { data: consents } = await supabase
              .from('client_consents')
              .select('*, consent_form:consent_forms(id, name)')
              .eq('client_id', client.id);

            setCompletedForms((consents || []).map(c => ({
              formId: c.consent_form?.id,
              completedAt: new Date(c.signed_at),
            })));

            // Fetch upcoming appointment
            const { data: appointments } = await supabase
              .from('appointments')
              .select('*, service:services(id, name)')
              .eq('client_id', client.id)
              .gte('scheduled_at', new Date().toISOString())
              .order('scheduled_at', { ascending: true })
              .limit(1);

            if (appointments && appointments.length > 0) {
              const apt = appointments[0];
              setUpcomingAppointment({
                id: apt.id,
                serviceId: apt.service?.id,
                serviceName: apt.service?.name,
                date: new Date(apt.scheduled_at).toLocaleDateString(),
                time: new Date(apt.scheduled_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
              });
            }
          }
        }
      } catch (err) {
        console.error('Error fetching intake forms data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
        <h1 className="text-2xl font-bold text-gray-900">Intake Forms</h1>
        <p className="text-gray-500">Complete required forms before your appointment</p>
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
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Upcoming Appointment</h3>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center">
              <span className="text-2xl">💆‍♀️</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">{upcomingAppointment.serviceName}</p>
              <p className="text-sm text-gray-500">{upcomingAppointment.date} at {upcomingAppointment.time}</p>
            </div>
          </div>
        </div>
      )}

      {/* Forms List */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">All Forms</h3>
        
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))
        ) : (
          allForms.map((form) => (
            <div
              key={form.id}
              className={`bg-white rounded-xl border p-4 ${
                form.status === 'required' ? 'border-amber-300 bg-amber-50' : 'border-gray-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    form.status === 'completed' ? 'bg-green-100' :
                    form.status === 'required' ? 'bg-amber-100' :
                    'bg-gray-100'
                  }`}>
                    <span className="text-xl">
                      {form.status === 'completed' ? '✓' :
                       form.status === 'required' ? '!' :
                       '📄'}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{form.name}</h4>
                    <p className="text-sm text-gray-500">{form.description}</p>
                    {form.completedAt && (
                      <p className="text-xs text-gray-400 mt-1">
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
                      className="px-4 py-2 bg-pink-500 text-white text-sm font-medium rounded-lg hover:bg-pink-600"
                    >
                      Complete Now
                    </Link>
                  ) : (
                    <Link
                      href={`/portal/intake/${form.id}`}
                      className="px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50"
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
      <div className="bg-gray-50 rounded-2xl p-6">
        <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
        <p className="text-gray-600 text-sm mb-4">
          If you have questions about any of these forms, please contact us.
        </p>
        <div className="flex gap-3">
          <a
            href="tel:+16306366193"
            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
          >
            📞 Call Us
          </a>
          <a
            href="mailto:info@hellogorgeousmedspa.com"
            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
          >
            ✉️ Email Us
          </a>
        </div>
      </div>
    </div>
  );
}
