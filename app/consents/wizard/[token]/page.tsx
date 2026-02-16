'use client';

// ============================================================
// CONSENT SIGNING WIZARD
// Public page for clients to view and sign consent forms
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import SignaturePad from './SignaturePad';

interface ConsentPacket {
  id: string;
  template_name: string;
  template_content: any;
  status: string;
  viewed_at: string | null;
  signed_at: string | null;
}

interface WizardData {
  valid: boolean;
  expired: boolean;
  client_name: string;
  appointment_date: string;
  service_name: string;
  packets: ConsentPacket[];
}

export default function ConsentWizardPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wizardData, setWizardData] = useState<WizardData | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [signatures, setSignatures] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);

  // Fetch wizard data
  useEffect(() => {
    async function fetchWizard() {
      try {
        const res = await fetch(`/api/consents/wizard/${token}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || 'Failed to load consent forms');
          return;
        }

        if (!data.valid) {
          setError(data.expired ? 'This link has expired' : 'Invalid consent link');
          return;
        }

        setWizardData(data);

        // Find first unsigned packet
        const firstUnsigned = data.packets.findIndex(
          (p: ConsentPacket) => p.status !== 'signed'
        );
        if (firstUnsigned >= 0) {
          setCurrentIndex(firstUnsigned);
        }
      } catch (err) {
        console.error('Wizard fetch error:', err);
        setError('Failed to load consent forms');
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      fetchWizard();
    }
  }, [token]);

  // Mark current packet as viewed
  useEffect(() => {
    if (!wizardData || currentIndex >= wizardData.packets.length) return;

    const packet = wizardData.packets[currentIndex];
    if (packet.status !== 'viewed' && packet.status !== 'signed') {
      // Mark as viewed
      fetch(`/api/consents/wizard/${token}/view`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packet_id: packet.id }),
      }).catch(console.error);
    }
  }, [token, wizardData, currentIndex]);

  // Handle signature
  const handleSignature = useCallback((packetId: string, signatureData: string) => {
    setSignatures(prev => ({ ...prev, [packetId]: signatureData }));
  }, []);

  // Submit current consent
  const handleSubmitConsent = async () => {
    if (!wizardData) return;

    const packet = wizardData.packets[currentIndex];
    const signature = signatures[packet.id];

    if (!signature) {
      alert('Please sign the consent form');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`/api/consents/wizard/${token}/sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packet_id: packet.id,
          signature_image: signature,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Failed to submit signature');
        return;
      }

      // Update local state
      setWizardData(prev => {
        if (!prev) return prev;
        const updatedPackets = [...prev.packets];
        updatedPackets[currentIndex] = {
          ...updatedPackets[currentIndex],
          status: 'signed',
          signed_at: new Date().toISOString(),
        };
        return { ...prev, packets: updatedPackets };
      });

      // Move to next or complete
      const nextUnsigned = wizardData.packets.findIndex(
        (p, i) => i > currentIndex && p.status !== 'signed'
      );

      if (nextUnsigned >= 0) {
        setCurrentIndex(nextUnsigned);
      } else {
        setCompleted(true);
      }
    } catch (err) {
      console.error('Submit error:', err);
      alert('Failed to submit signature');
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-[#FF2D8E] border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-black">Loading consent forms...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <div className="text-5xl mb-4">😔</div>
          <h1 className="text-2xl font-bold text-black mb-2">Unable to Load</h1>
          <p className="text-black mb-6">{error}</p>
          <p className="text-sm text-black">
            Please contact Hello Gorgeous Med Spa for assistance.
          </p>
        </div>
      </div>
    );
  }

  // Completed state
  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-black mb-2">All Done!</h1>
          <p className="text-black mb-6">
            Thank you for completing your consent forms, {wizardData?.client_name}!
          </p>
          <p className="text-sm text-black mb-4">
            We look forward to seeing you at your appointment.
          </p>
          <div className="bg-pink-50 rounded-lg p-4">
            <p className="text-pink-800 font-medium">{wizardData?.service_name}</p>
            <p className="text-pink-600 text-sm">{wizardData?.appointment_date}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!wizardData) return null;

  const currentPacket = wizardData.packets[currentIndex];
  const signedCount = wizardData.packets.filter(p => p.status === 'signed').length;
  const totalCount = wizardData.packets.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-black sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-black">
                Hello Gorgeous Med Spa
              </h1>
              <p className="text-sm text-black">
                Consent Forms for {wizardData.client_name}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-black">
                {signedCount} of {totalCount} signed
              </p>
              <div className="w-24 h-2 bg-white rounded-full mt-1">
                <div
                  className="h-full bg-[#FF2D8E] rounded-full transition-all"
                  style={{ width: `${(signedCount / totalCount) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {wizardData.packets.map((packet, index) => (
            <button
              key={packet.id}
              onClick={() => setCurrentIndex(index)}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                packet.status === 'signed'
                  ? 'bg-green-500 text-white'
                  : index === currentIndex
                  ? 'bg-[#FF2D8E] text-white'
                  : 'bg-white text-black'
              }`}
            >
              {packet.status === 'signed' ? '✓' : index + 1}
            </button>
          ))}
        </div>

        {/* Current Consent */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Consent Header */}
          <div className="bg-[#FF2D8E] text-white px-6 py-4">
            <h2 className="text-xl font-bold">{currentPacket.template_name}</h2>
            <p className="text-pink-100 text-sm">
              Please read carefully and sign below
            </p>
          </div>

          {/* Consent Content */}
          <div className="p-6">
            <div className="prose prose-sm max-w-none mb-6 max-h-64 overflow-y-auto border border-black rounded-lg p-4 bg-white">
              {currentPacket.template_content?.content ? (
                <div dangerouslySetInnerHTML={{ 
                  __html: currentPacket.template_content.content 
                }} />
              ) : currentPacket.template_content?.sections ? (
                currentPacket.template_content.sections.map((section: any, i: number) => (
                  <div key={i} className="mb-4">
                    {section.title && (
                      <h3 className="font-bold text-black">{section.title}</h3>
                    )}
                    <p className="text-black">{section.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-black">
                  By signing below, I acknowledge that I have been informed of the
                  risks, benefits, and alternatives to the proposed treatment. I
                  consent to the treatment and authorize Hello Gorgeous Med Spa to
                  perform the procedure.
                </p>
              )}
            </div>

            {/* Acknowledgment */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  className="mt-1 w-5 h-5 text-[#FF2D8E] rounded"
                  defaultChecked
                />
                <span className="text-sm text-yellow-800">
                  I have read and understand this consent form. I agree to the terms
                  and conditions stated above.
                </span>
              </label>
            </div>

            {/* Signature Pad */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-black mb-2">
                Your Signature
              </label>
              <SignaturePad
                onSignature={(data) => handleSignature(currentPacket.id, data)}
                existingSignature={signatures[currentPacket.id]}
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmitConsent}
              disabled={submitting || !signatures[currentPacket.id]}
              className="w-full py-4 bg-[#FF2D8E] text-white font-bold rounded-xl hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                  Submitting...
                </span>
              ) : currentIndex < totalCount - 1 ? (
                'Sign & Continue'
              ) : (
                'Sign & Complete'
              )}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-4">
          <button
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="px-4 py-2 text-black hover:text-black disabled:opacity-50"
          >
            ← Previous
          </button>
          <button
            onClick={() => setCurrentIndex(Math.min(totalCount - 1, currentIndex + 1))}
            disabled={currentIndex === totalCount - 1}
            className="px-4 py-2 text-black hover:text-black disabled:opacity-50"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-8 text-sm text-black">
        <p>Hello Gorgeous Med Spa</p>
        <p>Questions? Call us at (630) 793-7546</p>
      </div>
    </div>
  );
}
