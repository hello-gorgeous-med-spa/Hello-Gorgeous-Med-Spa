'use client';

// ============================================================
// KIOSK CONSENT SIGNING
// Full-screen iPad-optimized consent signing
// No navigation to other client info
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';

// Inline SignaturePad for kiosk (larger for iPad)
function KioskSignaturePad({
  onSignature,
  existingSignature,
}: {
  onSignature: (dataUrl: string) => void;
  existingSignature?: string;
}) {
  const canvasRef = require('react').useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = 600 * dpr;
    canvas.height = 200 * dpr;
    canvas.style.width = '600px';
    canvas.style.height = '200px';
    ctx.scale(dpr, dpr);

    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (existingSignature) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, 600, 200);
        setHasSignature(true);
      };
      img.src = existingSignature;
    }
  }, [existingSignature]);

  const getPosition = useCallback((e: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    if (e.touches) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }, []);

  const handleStart = useCallback((e: any) => {
    e.preventDefault();
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const { x, y } = getPosition(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  }, [getPosition]);

  const handleMove = useCallback((e: any) => {
    if (!isDrawing) return;
    e.preventDefault();

    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    const { x, y } = getPosition(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  }, [isDrawing, getPosition]);

  const handleEnd = useCallback(() => {
    if (!isDrawing) return;
    setIsDrawing(false);

    const canvas = canvasRef.current;
    if (canvas && hasSignature) {
      onSignature(canvas.toDataURL('image/png'));
    }
  }, [isDrawing, hasSignature, onSignature]);

  const handleClear = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    onSignature('');
  }, [onSignature]);

  return (
    <div className="space-y-3">
      <div className="relative border-4 border-dashed border-black rounded-xl overflow-hidden bg-white mx-auto" style={{ width: 600, height: 200 }}>
        <canvas
          ref={canvasRef}
          className="touch-none cursor-crosshair"
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        />
        <div className="absolute bottom-6 left-6 right-6 border-b-2 border-black" />
        {!hasSignature && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-black text-xl">Sign here with your finger</p>
          </div>
        )}
      </div>
      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleClear}
          className="px-6 py-2 text-black hover:text-black text-lg"
        >
          Clear Signature
        </button>
      </div>
    </div>
  );
}

interface ConsentPacket {
  id: string;
  template_name: string;
  template_content: any;
  status: string;
}

export default function KioskConsentPage() {
  const params = useParams();
  const token = params.token as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [packets, setPackets] = useState<ConsentPacket[]>([]);
  const [clientName, setClientName] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [signatures, setSignatures] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);

  // Fetch kiosk data
  useEffect(() => {
    async function fetchKiosk() {
      try {
        const res = await fetch(`/api/consents/kiosk/${token}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || 'Failed to load');
          return;
        }

        if (!data.valid) {
          setError(data.expired ? 'This kiosk session has expired' : 'Invalid session');
          return;
        }

        setPackets(data.packets);
        setClientName(data.client_name);
      } catch (err) {
        setError('Failed to load consent forms');
      } finally {
        setLoading(false);
      }
    }

    if (token) fetchKiosk();
  }, [token]);

  const handleSignature = useCallback((packetId: string, data: string) => {
    setSignatures(prev => ({ ...prev, [packetId]: data }));
  }, []);

  const handleSubmit = async () => {
    const packet = packets[currentIndex];
    const signature = signatures[packet.id];

    if (!signature) {
      alert('Please sign the consent form');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`/api/consents/kiosk/${token}/sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packet_id: packet.id,
          signature_image: signature,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Failed to submit');
        return;
      }

      // Update local state
      setPackets(prev => {
        const updated = [...prev];
        updated[currentIndex] = { ...updated[currentIndex], status: 'signed' };
        return updated;
      });

      // Move to next or complete
      if (currentIndex < packets.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setCompleted(true);
      }
    } catch (err) {
      alert('Failed to submit signature');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-[#FF2D8E] border-t-transparent rounded-full mx-auto mb-6" />
          <p className="text-xl text-black">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-8">
        <div className="text-center max-w-lg">
          <div className="text-6xl mb-6">⚠️</div>
          <h1 className="text-3xl font-bold text-black mb-4">Session Error</h1>
          <p className="text-xl text-black mb-8">{error}</p>
          <p className="text-black">Please ask staff for assistance.</p>
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center p-8">
        <div className="text-center max-w-lg">
          <div className="text-8xl mb-6">✅</div>
          <h1 className="text-4xl font-bold text-black mb-4">All Done!</h1>
          <p className="text-2xl text-black mb-8">
            Thank you, {clientName}!<br />
            All consent forms have been signed.
          </p>
          <p className="text-xl text-black">
            Please return the iPad to staff.
          </p>
        </div>
      </div>
    );
  }

  const currentPacket = packets[currentIndex];
  const signedCount = packets.filter(p => p.status === 'signed').length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-white flex flex-col">
      {/* Header - minimal for kiosk */}
      <div className="bg-white border-b-2 border-pink-200 px-8 py-6">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold text-pink-600">
              Hello Gorgeous Med Spa
            </h1>
            <p className="text-black">Consent Forms - {clientName}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-black">
              {signedCount + 1} of {packets.length}
            </p>
            <div className="w-32 h-3 bg-white rounded-full mt-1">
              <div
                className="h-full bg-[#FF2D8E] rounded-full transition-all"
                style={{ width: `${((signedCount + 1) / packets.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 max-w-4xl mx-auto w-full">
        {/* Consent Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-black">
            {currentPacket.template_name}
          </h2>
        </div>

        {/* Consent Content - Scrollable */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 max-h-[40vh] overflow-y-auto">
          {currentPacket.template_content?.content ? (
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: currentPacket.template_content.content }}
            />
          ) : (
            <p className="text-lg text-black leading-relaxed">
              By signing below, I acknowledge that I have been informed of the
              risks, benefits, and alternatives to the proposed treatment. I
              have had the opportunity to ask questions and all my questions
              have been answered to my satisfaction. I consent to the treatment
              and authorize Hello Gorgeous Med Spa to perform the procedure.
            </p>
          )}
        </div>

        {/* Signature Area */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-xl font-semibold text-black text-center mb-6">
            Please Sign Below
          </h3>
          
          <KioskSignaturePad
            onSignature={(data) => handleSignature(currentPacket.id, data)}
            existingSignature={signatures[currentPacket.id]}
          />

          <button
            onClick={handleSubmit}
            disabled={submitting || !signatures[currentPacket.id]}
            className="w-full mt-8 py-6 bg-[#FF2D8E] text-white text-2xl font-bold rounded-2xl hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-3">
                <span className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full" />
                Saving...
              </span>
            ) : currentIndex < packets.length - 1 ? (
              'Sign & Continue →'
            ) : (
              'Sign & Complete ✓'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
