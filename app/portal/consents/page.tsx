'use client';

import { useState, useEffect, useRef } from 'react';
import { usePortalAuth } from '@/lib/portal/useAuth';

interface Consent {
  id: string;
  formType: string;
  status: string;
  signedAt?: string;
  expiresAt?: string;
  pdfUrl?: string;
}

interface ConsentTemplate {
  id: string;
  name: string;
  type: string;
  description?: string;
  is_required: boolean;
}

const FORM_CONTENT: Record<string, { title: string; content: string[] }> = {
  hipaa: {
    title: 'HIPAA Privacy Notice',
    content: [
      'Hello Gorgeous Med Spa is committed to protecting your health information.',
      'We will use your information for treatment, payment, and healthcare operations.',
      'You have the right to access your records, request amendments, and receive an accounting of disclosures.',
      'We will not use or disclose your information for marketing purposes without your consent.',
    ],
  },
  botox_consent: {
    title: 'Botox Treatment Consent',
    content: [
      'I understand that Botox is an injectable treatment used to temporarily improve the appearance of wrinkles.',
      'Common side effects include temporary bruising, swelling, and headache.',
      'Results typically last 3-4 months and may vary by individual.',
      'I confirm I am not pregnant, breastfeeding, or allergic to botulinum toxin.',
    ],
  },
  filler_consent: {
    title: 'Dermal Filler Consent',
    content: [
      'I understand that dermal fillers are injectable treatments used to add volume and reduce wrinkles.',
      'Common side effects include swelling, bruising, and temporary asymmetry.',
      'Rare but serious risks include vascular occlusion.',
      'I will follow all aftercare instructions provided.',
    ],
  },
  general_consent: {
    title: 'General Treatment Consent',
    content: [
      'I consent to receive treatment at Hello Gorgeous Med Spa.',
      'I have provided accurate medical history information.',
      'I understand results may vary and are not guaranteed.',
      'I agree to the financial policies and payment terms.',
    ],
  },
};

export default function ConsentsPage() {
  const { user, loading: authLoading } = usePortalAuth();
  const [consents, setConsents] = useState<Consent[]>([]);
  const [templates, setTemplates] = useState<ConsentTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeForm, setActiveForm] = useState<string | null>(null);
  const [signatureMode, setSignatureMode] = useState<'draw' | 'type'>('type');
  const [typedSignature, setTypedSignature] = useState('');
  const [signing, setSigning] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchConsents();
  }, [user]);

  const fetchConsents = async () => {
    try {
      const res = await fetch('/api/portal/consents');
      const data = await res.json();
      setConsents(data.consents || []);
      setTemplates(data.templates || []);
    } catch (err) {
      console.error('Failed to fetch consents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSign = async (formType: string) => {
    if (signatureMode === 'type' && !typedSignature.trim()) return;
    setSigning(true);
    try {
      const signatureData = signatureMode === 'draw'
        ? canvasRef.current?.toDataURL()
        : null;
      
      const res = await fetch('/api/portal/consents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formType,
          signatureData,
          signatureTyped: signatureMode === 'type' ? typedSignature : null,
          formData: { agreedAt: new Date().toISOString() },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActiveForm(null);
        setTypedSignature('');
        fetchConsents();
      }
    } catch (err) {
      console.error('Signing failed:', err);
    } finally {
      setSigning(false);
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.strokeStyle = '#E6007E';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  if (authLoading || loading) {
    return <div className="flex items-center justify-center min-h-[400px]"><div className="animate-spin text-4xl">💗</div></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111]">Consent Forms</h1>
        <p className="text-[#111]/70 mt-1">Review and sign required consent forms</p>
      </div>

      {/* Pending Forms */}
      <div className="bg-white rounded-2xl border border-[#111]/10 p-6">
        <h2 className="font-semibold text-[#111] mb-4 flex items-center gap-2">
          <span className="text-amber-500">⚠️</span> Forms to Complete
        </h2>
        <div className="space-y-3">
          {['hipaa', 'general_consent', 'botox_consent', 'filler_consent'].map((formType) => {
            const signed = consents.find(c => c.formType === formType && c.status === 'signed');
            if (signed) return null;
            const form = FORM_CONTENT[formType];
            return (
              <div key={formType} className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <div>
                  <p className="font-medium text-[#111]">{form?.title || formType}</p>
                  <p className="text-sm text-[#111]/50">Required before treatment</p>
                </div>
                <button
                  onClick={() => setActiveForm(formType)}
                  className="bg-[#E6007E] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#E6007E]/90 transition-colors"
                >
                  Sign Now
                </button>
              </div>
            );
          })}
          {consents.filter(c => c.status !== 'signed').length === 0 && (
            <p className="text-center py-4 text-green-600">All forms signed! You are all set.</p>
          )}
        </div>
      </div>

      {/* Signed Forms */}
      <div className="bg-white rounded-2xl border border-[#111]/10 p-6">
        <h2 className="font-semibold text-[#111] mb-4 flex items-center gap-2">
          <span className="text-green-500">✓</span> Signed Forms
        </h2>
        {consents.filter(c => c.status === 'signed').length === 0 ? (
          <p className="text-center py-4 text-[#111]/50">No signed forms yet</p>
        ) : (
          <div className="space-y-3">
            {consents.filter(c => c.status === 'signed').map((consent) => (
              <div key={consent.id} className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
                <div>
                  <p className="font-medium text-[#111]">{FORM_CONTENT[consent.formType]?.title || consent.formType}</p>
                  <p className="text-sm text-green-600">Signed {consent.signedAt ? new Date(consent.signedAt).toLocaleDateString() : ''}</p>
                </div>
                <button className="text-[#111]/50 hover:text-[#111] text-sm">View PDF</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Signing Modal */}
      {activeForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#111]/10">
              <h2 className="text-xl font-bold text-[#111]">{FORM_CONTENT[activeForm]?.title}</h2>
            </div>
            
            <div className="p-6 space-y-4 max-h-[40vh] overflow-y-auto bg-gray-50">
              {FORM_CONTENT[activeForm]?.content.map((para, idx) => (
                <p key={idx} className="text-[#111]/70">{para}</p>
              ))}
            </div>

            <div className="p-6 border-t border-[#111]/10">
              <p className="text-sm text-[#111]/70 mb-4">By signing below, I acknowledge that I have read and understood this document.</p>
              
              {/* Signature Type Toggle */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setSignatureMode('type')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    signatureMode === 'type' ? 'bg-[#E6007E] text-white' : 'bg-gray-100 text-[#111]/70'
                  }`}
                >
                  Type Signature
                </button>
                <button
                  onClick={() => setSignatureMode('draw')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    signatureMode === 'draw' ? 'bg-[#E6007E] text-white' : 'bg-gray-100 text-[#111]/70'
                  }`}
                >
                  Draw Signature
                </button>
              </div>

              {signatureMode === 'type' ? (
                <input
                  type="text"
                  value={typedSignature}
                  onChange={(e) => setTypedSignature(e.target.value)}
                  placeholder="Type your full legal name"
                  className="w-full px-4 py-3 border border-[#111]/20 rounded-xl text-lg italic focus:outline-none focus:ring-2 focus:ring-[#E6007E]/50"
                />
              ) : (
                <div className="relative">
                  <canvas
                    ref={canvasRef}
                    width={500}
                    height={150}
                    className="w-full border border-[#111]/20 rounded-xl bg-white cursor-crosshair"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={() => setIsDrawing(false)}
                    onMouseLeave={() => setIsDrawing(false)}
                  />
                  <button
                    onClick={clearCanvas}
                    className="absolute top-2 right-2 text-xs text-[#111]/50 hover:text-[#111]"
                  >
                    Clear
                  </button>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => { setActiveForm(null); setTypedSignature(''); }}
                  className="flex-1 py-3 border border-[#111]/20 rounded-xl font-medium text-[#111]/70 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSign(activeForm)}
                  disabled={signing || (signatureMode === 'type' && !typedSignature.trim())}
                  className="flex-1 py-3 bg-[#E6007E] text-white rounded-xl font-medium hover:bg-[#E6007E]/90 disabled:opacity-50 transition-colors"
                >
                  {signing ? 'Signing...' : 'Sign & Submit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
