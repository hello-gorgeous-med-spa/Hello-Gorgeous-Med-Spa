'use client';

import { useState, useRef, useEffect } from 'react';
import {
  ConsentForm,
  ConsentFormType,
  SignedConsent,
  getConsentForm,
  getRequiredConsentForms,
  getMissingConsents,
  getConsentCompletionStatus,
} from '@/lib/hgos/consent-forms';

// ============================================================
// SIGNATURE PAD COMPONENT
// ============================================================

interface SignaturePadProps {
  onSignatureChange: (data: string | null) => void;
  width?: number;
  height?: number;
}

function SignaturePad({ onSignatureChange, width = 500, height = 200 }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set up canvas
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Clear canvas
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, width, height);
  }, [width, height]);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    
    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const coords = getCoordinates(e);
    if (!coords) return;

    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();

    const coords = getCoordinates(e);
    if (!coords) return;

    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    
    if (hasSignature && canvasRef.current) {
      onSignatureChange(canvasRef.current.toDataURL('image/png'));
    }
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, width, height);
    setHasSignature(false);
    onSignatureChange(null);
  };

  return (
    <div className="space-y-2">
      <div className="border-2 border-black rounded-lg overflow-hidden bg-white">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="touch-none cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-black">Sign above using your mouse or finger</p>
        <button
          type="button"
          onClick={clear}
          className="text-sm text-red-600 hover:text-red-700"
        >
          Clear Signature
        </button>
      </div>
    </div>
  );
}

// ============================================================
// TYPED SIGNATURE COMPONENT
// ============================================================

interface TypedSignatureProps {
  value: string;
  onChange: (value: string) => void;
}

function TypedSignature({ value, onChange }: TypedSignatureProps) {
  return (
    <div className="space-y-2">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your full legal name"
        className="w-full px-4 py-3 text-xl font-signature border-2 border-black rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
        style={{ fontFamily: "'Dancing Script', cursive" }}
      />
      {value && (
        <div className="p-4 bg-white rounded-lg border border-black">
          <p className="text-sm text-black mb-2">Preview:</p>
          <p className="text-2xl" style={{ fontFamily: "'Dancing Script', cursive" }}>
            {value}
          </p>
        </div>
      )}
    </div>
  );
}

// ============================================================
// CONSENT FORM VIEWER
// ============================================================

interface ConsentFormViewerProps {
  form: ConsentForm;
  onSign: (signatureData: string, signatureType: 'drawn' | 'typed') => void;
  onDecline?: () => void;
  loading?: boolean;
}

export function ConsentFormViewer({ form, onSign, onDecline, loading }: ConsentFormViewerProps) {
  const [signatureType, setSignatureType] = useState<'drawn' | 'typed'>('typed');
  const [drawnSignature, setDrawnSignature] = useState<string | null>(null);
  const [typedSignature, setTypedSignature] = useState('');
  const [hasReadForm, setHasReadForm] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!contentRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
    // User has scrolled to near the bottom
    if (scrollTop + clientHeight >= scrollHeight - 50) {
      setHasReadForm(true);
    }
  };

  const canSign = agreedToTerms && hasReadForm && 
    (signatureType === 'drawn' ? drawnSignature : typedSignature.length >= 2);

  const handleSign = () => {
    const signature = signatureType === 'drawn' ? drawnSignature! : typedSignature;
    onSign(signature, signatureType);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-4">
        <h2 className="text-xl font-bold text-white">{form.name}</h2>
        <p className="text-pink-100 text-sm">Version {form.version} • Last Updated {form.lastUpdated}</p>
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        onScroll={handleScroll}
        className="p-6 max-h-96 overflow-y-auto prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: form.content }}
      />

      {/* Scroll indicator */}
      {!hasReadForm && (
        <div className="bg-amber-50 border-t border-amber-200 px-6 py-3 text-center">
          <p className="text-sm text-amber-700">
            ⬇️ Please scroll down to read the entire document before signing
          </p>
        </div>
      )}

      {/* Signature Section */}
      <div className="border-t bg-white px-6 py-6">
        <h3 className="font-semibold text-black mb-4">Signature</h3>

        {/* Signature Type Toggle */}
        <div className="flex gap-4 mb-4">
          <button
            type="button"
            onClick={() => setSignatureType('typed')}
            className={`flex-1 py-2 px-4 rounded-lg border-2 transition-colors ${
              signatureType === 'typed'
                ? 'border-pink-500 bg-pink-50 text-pink-700'
                : 'border-black bg-white text-black hover:border-black'
            }`}
          >
            ✏️ Type Signature
          </button>
          <button
            type="button"
            onClick={() => setSignatureType('drawn')}
            className={`flex-1 py-2 px-4 rounded-lg border-2 transition-colors ${
              signatureType === 'drawn'
                ? 'border-pink-500 bg-pink-50 text-pink-700'
                : 'border-black bg-white text-black hover:border-black'
            }`}
          >
            🖊️ Draw Signature
          </button>
        </div>

        {/* Signature Input */}
        {signatureType === 'typed' ? (
          <TypedSignature value={typedSignature} onChange={setTypedSignature} />
        ) : (
          <SignaturePad onSignatureChange={setDrawnSignature} />
        )}

        {/* Agreement Checkbox */}
        <div className="mt-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 w-5 h-5 text-pink-600 border-black rounded focus:ring-pink-500"
            />
            <span className="text-sm text-black">
              I have read and understand this document. I agree to be bound by its terms. 
              I am signing this document voluntarily and of my own free will.
            </span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          {onDecline && (
            <button
              type="button"
              onClick={onDecline}
              disabled={loading}
              className="flex-1 py-3 px-4 border border-black text-black rounded-lg hover:bg-white transition-colors disabled:opacity-50"
            >
              Decline
            </button>
          )}
          <button
            type="button"
            onClick={handleSign}
            disabled={!canSign || loading}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-lg hover:from-pink-600 hover:to-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing...' : 'Sign Document'}
          </button>
        </div>

        {!hasReadForm && (
          <p className="text-xs text-amber-600 mt-2 text-center">
            You must scroll through the entire document before signing
          </p>
        )}
      </div>
    </div>
  );
}

// ============================================================
// CONSENT FORMS WIZARD (Multiple Forms)
// ============================================================

interface ConsentFormsWizardProps {
  forms: ConsentForm[];
  onComplete: (signedConsents: Omit<SignedConsent, 'id' | 'clientId'>[]) => void;
  onCancel?: () => void;
  clientName?: string;
}

export function ConsentFormsWizard({ forms, onComplete, onCancel, clientName }: ConsentFormsWizardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [signedConsents, setSignedConsents] = useState<Omit<SignedConsent, 'id' | 'clientId'>[]>([]);
  const [loading, setLoading] = useState(false);

  const currentForm = forms[currentIndex];
  const progress = ((currentIndex + 1) / forms.length) * 100;

  const handleSign = async (signatureData: string, signatureType: 'drawn' | 'typed') => {
    setLoading(true);

    const consent: Omit<SignedConsent, 'id' | 'clientId'> = {
      formType: currentForm.id,
      formVersion: currentForm.version,
      signedAt: new Date().toISOString(),
      signatureData,
      signatureType,
      status: 'signed',
    };

    // Calculate expiration if applicable
    if (currentForm.expiresAfterDays) {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + currentForm.expiresAfterDays);
      consent.expiresAt = expiresAt.toISOString();
    }

    const newSignedConsents = [...signedConsents, consent];
    setSignedConsents(newSignedConsents);

    // Move to next form or complete
    if (currentIndex < forms.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete(newSignedConsents);
    }

    setLoading(false);
  };

  const handleDecline = () => {
    // For optional forms, skip to next
    if (!currentForm.isRequired && currentIndex < forms.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Header */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-black">
              {clientName && <span className="font-medium">{clientName} • </span>}
              Document {currentIndex + 1} of {forms.length}
            </span>
            <span className="text-sm font-medium text-pink-600">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="w-full bg-white rounded-full h-2">
            <div
              className="bg-gradient-to-r from-pink-500 to-rose-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {/* Form indicators */}
          <div className="flex gap-2 mt-3">
            {forms.map((form, index) => (
              <div
                key={form.id}
                className={`flex-1 h-1 rounded-full ${
                  index < currentIndex
                    ? 'bg-green-500'
                    : index === currentIndex
                    ? 'bg-pink-500'
                    : 'bg-white'
                }`}
                title={form.shortName}
              />
            ))}
          </div>
        </div>

        {/* Current Form */}
        <ConsentFormViewer
          form={currentForm}
          onSign={handleSign}
          onDecline={!currentForm.isRequired ? handleDecline : undefined}
          loading={loading}
        />

        {/* Cancel Button */}
        {onCancel && (
          <div className="text-center mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="text-black hover:text-black text-sm"
            >
              Cancel and return later
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// CONSENT STATUS BADGE
// ============================================================

interface ConsentStatusBadgeProps {
  status: 'signed' | 'pending' | 'expired' | 'missing';
  expiresAt?: string;
}

export function ConsentStatusBadge({ status, expiresAt }: ConsentStatusBadgeProps) {
  const statusConfig = {
    signed: { icon: '✅', label: 'Signed', color: 'bg-green-100 text-green-800' },
    pending: { icon: '⏳', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    expired: { icon: '⚠️', label: 'Expired', color: 'bg-red-100 text-red-800' },
    missing: { icon: '❌', label: 'Missing', color: 'bg-white text-black' },
  };

  const config = statusConfig[status];

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      <span>{config.icon}</span>
      <span>{config.label}</span>
      {status === 'signed' && expiresAt && (
        <span className="text-black">
          (expires {new Date(expiresAt).toLocaleDateString()})
        </span>
      )}
    </span>
  );
}

// ============================================================
// CLIENT CONSENT SUMMARY
// ============================================================

interface ClientConsentSummaryProps {
  signedConsents: SignedConsent[];
  onRequestSignature?: (formIds: ConsentFormType[]) => void;
}

export function ClientConsentSummary({ signedConsents, onRequestSignature }: ClientConsentSummaryProps) {
  const requiredForms = getRequiredConsentForms();
  const { completed, total, percent } = getConsentCompletionStatus(signedConsents);
  const missingForms = getMissingConsents(signedConsents);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-black overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b bg-white">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-black">Consent Forms</h3>
          <span className={`text-sm font-medium ${percent === 100 ? 'text-green-600' : 'text-amber-600'}`}>
            {completed}/{total} Complete ({percent}%)
          </span>
        </div>
        <div className="w-full bg-white rounded-full h-2 mt-2">
          <div
            className={`h-2 rounded-full transition-all ${percent === 100 ? 'bg-green-500' : 'bg-amber-500'}`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Form List */}
      <div className="divide-y">
        {requiredForms.map((form) => {
          const signed = signedConsents.find(s => s.formType === form.id);
          let status: 'signed' | 'pending' | 'expired' | 'missing' = 'missing';
          
          if (signed) {
            if (signed.status === 'signed') {
              // Check expiration
              if (signed.expiresAt && new Date(signed.expiresAt) < new Date()) {
                status = 'expired';
              } else {
                status = 'signed';
              }
            } else {
              status = 'pending';
            }
          }

          return (
            <div key={form.id} className="px-6 py-3 flex items-center justify-between">
              <div>
                <p className="font-medium text-black">{form.shortName}</p>
                <p className="text-sm text-black">
                  {signed?.signedAt && `Signed ${new Date(signed.signedAt).toLocaleDateString()}`}
                </p>
              </div>
              <ConsentStatusBadge status={status} expiresAt={signed?.expiresAt} />
            </div>
          );
        })}
      </div>

      {/* Actions */}
      {missingForms.length > 0 && onRequestSignature && (
        <div className="px-6 py-4 border-t bg-white">
          <button
            type="button"
            onClick={() => onRequestSignature(missingForms.map(f => f.id))}
            className="w-full py-2 px-4 bg-pink-600 text-white font-medium rounded-lg hover:bg-pink-700 transition-colors"
          >
            Request Missing Signatures ({missingForms.length})
          </button>
        </div>
      )}
    </div>
  );
}
