'use client';

// ============================================================
// CONSENT FORM COMPONENT
// Digital consent with e-signature capture
// ============================================================

import { useState } from 'react';
import SignaturePad from './SignaturePad';

interface ConsentFormProps {
  templateId: string;
  templateName: string;
  templateContent: string;
  clientName: string;
  onComplete: (data: {
    signatureData: string;
    signedAt: Date;
    acknowledgedItems: string[];
  }) => void;
  onCancel: () => void;
}

export default function ConsentForm({
  templateId,
  templateName,
  templateContent,
  clientName,
  onComplete,
  onCancel,
}: ConsentFormProps) {
  const [step, setStep] = useState<'read' | 'acknowledge' | 'sign'>('read');
  const [hasReadConsent, setHasReadConsent] = useState(false);
  const [acknowledgedItems, setAcknowledgedItems] = useState<string[]>([]);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Acknowledgment items based on consent type
  const acknowledgmentItems = [
    'I have read and understand this consent form',
    'I have had the opportunity to ask questions',
    'I understand the risks and benefits of the procedure',
    'I consent to the procedure described above',
    'I understand that results may vary',
  ];

  const toggleAcknowledgment = (item: string) => {
    setAcknowledgedItems((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item]
    );
  };

  const allAcknowledged = acknowledgmentItems.every((item) =>
    acknowledgedItems.includes(item)
  );

  const handleSignatureComplete = (data: string) => {
    setSignatureData(data);
  };

  const handleSubmit = async () => {
    if (!signatureData) return;

    setIsSubmitting(true);
    
    // In real implementation, this would save to Supabase
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    onComplete({
      signatureData,
      signedAt: new Date(),
      acknowledgedItems,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-black flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-black">{templateName}</h2>
            <p className="text-sm text-black">Patient: {clientName}</p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-white rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Progress */}
        <div className="px-6 py-3 bg-white border-b border-black">
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                step === 'read'
                  ? 'bg-indigo-100 text-indigo-700 font-medium'
                  : 'text-black'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
                1
              </span>
              Read
            </div>
            <div className="w-8 h-px bg-white" />
            <div
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                step === 'acknowledge'
                  ? 'bg-indigo-100 text-indigo-700 font-medium'
                  : 'text-black'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                  step === 'acknowledge' || step === 'sign'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-white'
                }`}
              >
                2
              </span>
              Acknowledge
            </div>
            <div className="w-8 h-px bg-white" />
            <div
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                step === 'sign'
                  ? 'bg-indigo-100 text-indigo-700 font-medium'
                  : 'text-black'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                  step === 'sign'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-white'
                }`}
              >
                3
              </span>
              Sign
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 1: Read Consent */}
          {step === 'read' && (
            <div className="space-y-6">
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: templateContent.replace(/\n/g, '<br />'),
                }}
              />

              <div className="pt-4 border-t border-black">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasReadConsent}
                    onChange={(e) => setHasReadConsent(e.target.checked)}
                    className="w-5 h-5 mt-0.5 text-indigo-600 border-black rounded focus:ring-indigo-500"
                  />
                  <span className="text-black">
                    I have read the entire consent form above and scrolled through all content.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Step 2: Acknowledge */}
          {step === 'acknowledge' && (
            <div className="space-y-4">
              <p className="text-black mb-6">
                Please confirm each of the following statements by checking the boxes:
              </p>

              {acknowledgmentItems.map((item) => (
                <label
                  key={item}
                  className="flex items-start gap-3 p-4 border border-black rounded-xl cursor-pointer hover:border-indigo-200 hover:bg-indigo-50/50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={acknowledgedItems.includes(item)}
                    onChange={() => toggleAcknowledgment(item)}
                    className="w-5 h-5 mt-0.5 text-indigo-600 border-black rounded focus:ring-indigo-500"
                  />
                  <span className="text-black">{item}</span>
                </label>
              ))}
            </div>
          )}

          {/* Step 3: Sign */}
          {step === 'sign' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <p className="text-black">
                  Please sign below to complete your consent for:
                </p>
                <p className="text-lg font-semibold text-black mt-1">
                  {templateName}
                </p>
              </div>

              <div className="flex justify-center">
                <SignaturePad
                  onComplete={handleSignatureComplete}
                  onClear={() => setSignatureData(null)}
                  width={500}
                  height={200}
                />
              </div>

              {signatureData && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center gap-2 text-green-700">
                    <span className="text-xl">✓</span>
                    <span className="font-medium">Signature captured</span>
                  </div>
                </div>
              )}

              <div className="p-4 bg-white rounded-xl text-sm text-black">
                <p className="font-medium text-black mb-2">Legal Notice:</p>
                <p>
                  By signing this document electronically, I acknowledge that my electronic
                  signature is the legal equivalent of my manual signature. This consent
                  will be stored securely with a timestamp and IP address for verification
                  purposes.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-black flex items-center justify-between bg-white">
          <button
            onClick={step === 'read' ? onCancel : () => setStep(step === 'sign' ? 'acknowledge' : 'read')}
            className="px-4 py-2 text-black hover:text-black font-medium"
          >
            {step === 'read' ? 'Cancel' : '← Back'}
          </button>

          {step === 'read' && (
            <button
              onClick={() => setStep('acknowledge')}
              disabled={!hasReadConsent}
              className="px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue →
            </button>
          )}

          {step === 'acknowledge' && (
            <button
              onClick={() => setStep('sign')}
              disabled={!allAcknowledged}
              className="px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Sign →
            </button>
          )}

          {step === 'sign' && (
            <button
              onClick={handleSubmit}
              disabled={!signatureData || isSubmitting}
              className="px-6 py-2.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : '✓ Submit Signed Consent'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
