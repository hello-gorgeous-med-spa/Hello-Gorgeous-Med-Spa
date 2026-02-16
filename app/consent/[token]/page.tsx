'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ConsentFormsWizard } from '@/components/ConsentFormSigner';
import { ConsentForm, ConsentFormType, SignedConsent } from '@/lib/hgos/consent-forms';

interface ConsentRequestData {
  consentRequest: {
    id: string;
    client_id: string;
    form_types: ConsentFormType[];
    expires_at: string;
    completed_at: string | null;
  };
  forms: ConsentForm[];
  client: {
    id: string;
    users: {
      first_name: string;
      last_name: string;
      email: string;
    };
  };
}

export default function ConsentSigningPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ConsentRequestData | null>(null);
  const [completed, setCompleted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchConsentRequest() {
      try {
        const response = await fetch(`/api/consents/request?token=${token}`);
        const result = await response.json();

        if (!response.ok) {
          setError(result.error || 'Failed to load consent forms');
          return;
        }

        setData(result);
      } catch (err) {
        setError('Failed to load consent forms. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      fetchConsentRequest();
    }
  }, [token]);

  const handleComplete = async (signedConsents: Omit<SignedConsent, 'id' | 'clientId'>[]) => {
    if (!data) return;
    
    setSubmitting(true);

    try {
      // Sign each consent form
      for (const consent of signedConsents) {
        const response = await fetch('/api/consents/sign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            clientId: data.client.id,
            formType: consent.formType,
            signatureData: consent.signatureData,
            signatureType: consent.signatureType,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to save signature');
        }
      }

      // Mark consent request as completed
      // This would ideally be a separate API endpoint
      setCompleted(true);

    } catch (err) {
      setError('Failed to save signatures. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-black">Loading consent forms...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h1 className="text-xl font-bold text-black mb-2">Unable to Load Forms</h1>
          <p className="text-black mb-6">{error}</p>
          <p className="text-sm text-black">
            If you believe this is an error, please contact us at{' '}
            <a href="tel:630-636-6193" className="text-pink-600 hover:underline">
              (630) 636-6193
            </a>
          </p>
        </div>
      </div>
    );
  }

  // Completed state
  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">✅</span>
          </div>
          <h1 className="text-2xl font-bold text-black mb-2">All Done!</h1>
          <p className="text-black mb-6">
            Thank you, {data?.client.users.first_name}! All consent forms have been signed successfully.
          </p>
          <div className="bg-pink-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-pink-800">
              A copy of your signed documents has been saved to your client profile. 
              You can view them anytime through your client portal.
            </p>
          </div>
          <p className="text-sm text-black">
            You may close this window or{' '}
            <a href="/" className="text-pink-600 hover:underline">
              visit our website
            </a>
          </p>
        </div>
      </div>
    );
  }

  // No data
  if (!data) {
    return null;
  }

  // Consent wizard
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💎</span>
            <div>
              <h1 className="font-bold text-black">Hello Gorgeous Med Spa</h1>
              <p className="text-sm text-black">Consent Forms</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-black">
              {data.client.users.first_name} {data.client.users.last_name}
            </p>
            <p className="text-xs text-black">{data.client.users.email}</p>
          </div>
        </div>
      </header>

      {/* Intro */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-black mb-2">
            Welcome, {data.client.users.first_name}! 👋
          </h2>
          <p className="text-black">
            Please review and sign the following consent forms before your appointment. 
            These forms are required to ensure your safety and help us provide you with 
            the best possible care.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {data.forms.map(form => (
              <span 
                key={form.id}
                className="inline-flex items-center gap-1 px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm"
              >
                📄 {form.shortName}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Consent Wizard */}
      {submitting ? (
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-black">Saving your signatures...</p>
        </div>
      ) : (
        <ConsentFormsWizard
          forms={data.forms}
          onComplete={handleComplete}
          clientName={`${data.client.users.first_name} ${data.client.users.last_name}`}
        />
      )}

      {/* Footer */}
      <footer className="bg-white border-t mt-12 py-6">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-black">
          <p>Hello Gorgeous Med Spa • 74 W. Washington St, Oswego, IL 60543</p>
          <p className="mt-1">
            Questions? Call us at{' '}
            <a href="tel:630-636-6193" className="text-pink-600 hover:underline">
              (630) 636-6193
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
