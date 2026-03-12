'use client';

// ============================================================
// PUBLIC CONSENT FORM PAGE
// Clients view and digitally sign consent forms
// ============================================================

import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { CONSENT_FORMS } from '@/lib/hgos/consent-forms';

export default function ConsentFormPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const token = params.token as string;
  const formType = searchParams.get('form') || '';
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<typeof CONSENT_FORMS[0] | null>(null);
  const [signed, setSigned] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Signature state
  const [signatureName, setSignatureName] = useState('');
  const [signatureDate, setSignatureDate] = useState(new Date().toISOString().split('T')[0]);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [canvasSignature, setCanvasSignature] = useState<string | null>(null);
  
  // Canvas for signature
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Find the form
    const foundForm = CONSENT_FORMS.find(f => f.id === formType);
    if (foundForm) {
      setForm(foundForm);
      setLoading(false);
    } else {
      setError('Consent form not found');
      setLoading(false);
    }
  }, [formType]);

  // Canvas drawing functions
  const getCanvasCoords = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    if ('touches' in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    const pos = getCanvasCoords(e);
    setLastPos(pos);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const pos = getCanvasCoords(e);
    
    ctx.beginPath();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    
    setLastPos(pos);
  };

  const stopDrawing = () => {
    if (isDrawing && canvasRef.current) {
      setCanvasSignature(canvasRef.current.toDataURL());
    }
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setCanvasSignature(null);
    }
  };

  const handleSubmit = async () => {
    if (!signatureName.trim()) {
      alert('Please enter your full name');
      return;
    }
    if (!agreedToTerms) {
      alert('Please acknowledge that you have read and understand the form');
      return;
    }

    setSubmitting(true);
    
    try {
      const response = await fetch('/api/consents/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          formType,
          signatureName,
          signatureDate,
          signatureImage: canvasSignature,
          agreedToTerms,
          signedAt: new Date().toISOString(),
          userAgent: navigator.userAgent,
        }),
      });

      if (response.ok) {
        setSigned(true);
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to submit consent form');
      }
    } catch (err) {
      alert('Failed to submit consent form');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">Form Not Found</h1>
          <p className="text-gray-600">{error || 'This consent form link is invalid or has expired.'}</p>
        </div>
      </div>
    );
  }

  if (signed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <div className="text-green-500 text-5xl mb-4">✓</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h1>
          <p className="text-gray-600 mb-4">
            Your consent form has been successfully submitted and signed.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left">
            <p className="text-sm text-green-800">
              <strong>Form:</strong> {form.name}<br />
              <strong>Signed by:</strong> {signatureName}<br />
              <strong>Date:</strong> {new Date(signatureDate).toLocaleDateString()}
            </p>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            A copy has been saved to your client record at Hello Gorgeous Med Spa.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Hello Gorgeous Med Spa</h1>
            <p className="text-sm text-gray-600">Consent Form</p>
          </div>
          <div className="text-right">
            <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full">
              v{form.version}
            </span>
          </div>
        </div>
      </header>

      {/* Form Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Form Title */}
          <div className="bg-gradient-to-r from-pink-600 to-pink-500 text-white p-6">
            <h2 className="text-2xl font-bold">{form.name}</h2>
            <p className="text-pink-100 mt-1">{form.description}</p>
          </div>

          {/* Form Body */}
          <div 
            className="p-6 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: form.content }}
          />

          {/* Signature Section */}
          <div className="border-t bg-gray-50 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Digital Signature</h3>
            
            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Legal Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={signatureName}
                  onChange={(e) => setSignatureName(e.target.value)}
                  placeholder="Enter your full legal name"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={signatureDate}
                  onChange={(e) => setSignatureDate(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Canvas Signature */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Signature (Optional - draw below)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 bg-white">
                  <canvas
                    ref={canvasRef}
                    width={500}
                    height={150}
                    className="w-full touch-none cursor-crosshair"
                    style={{ maxWidth: '100%', height: 'auto', aspectRatio: '500/150' }}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                  />
                </div>
                <button
                  type="button"
                  onClick={clearSignature}
                  className="mt-2 text-sm text-gray-600 hover:text-gray-800 underline"
                >
                  Clear signature
                </button>
              </div>

              {/* Agreement Checkbox */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="w-5 h-5 mt-0.5 text-pink-600 rounded"
                  />
                  <span className="text-sm text-gray-700">
                    <strong>I acknowledge that I have read and understand this consent form in its entirety.</strong> I have had the opportunity to ask questions and all my questions have been answered to my satisfaction. I voluntarily consent to the treatment(s) described above and understand the risks involved.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={submitting || !signatureName.trim() || !agreedToTerms}
                className="w-full py-4 bg-gradient-to-r from-pink-600 to-pink-500 text-white font-semibold rounded-lg hover:from-pink-700 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'Sign & Submit Consent Form'
                )}
              </button>

              <p className="text-xs text-gray-500 text-center">
                By clicking "Sign & Submit", you are providing your electronic signature, which has the same legal effect as a handwritten signature.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Hello Gorgeous Med Spa</p>
          <p>4153 Weaver Pkwy, Warrenville, IL 60555</p>
          <p className="mt-2">
            Questions? Call us at{' '}
            <a href="tel:+16302503066" className="text-pink-600 hover:underline">
              (630) 250-3066
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
