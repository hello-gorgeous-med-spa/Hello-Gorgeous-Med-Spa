'use client';

// ============================================================
// SIGNATURE PAD COMPONENT
// Canvas-based signature capture
// ============================================================

import { useRef, useEffect, useState, useCallback } from 'react';

interface SignaturePadProps {
  onSignature: (dataUrl: string) => void;
  existingSignature?: string;
  width?: number;
  height?: number;
}

export default function SignaturePad({
  onSignature,
  existingSignature,
  width = 400,
  height = 150,
}: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size for retina displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    // Set drawing style
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Load existing signature if any
    if (existingSignature) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, width, height);
        setHasSignature(true);
      };
      img.src = existingSignature;
    }
  }, [width, height, existingSignature]);

  // Get position from mouse/touch event
  const getPosition = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

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
  }, []);

  // Start drawing
  const handleStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const { x, y } = getPosition(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  }, [getPosition]);

  // Draw
  const handleMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    const { x, y } = getPosition(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  }, [isDrawing, getPosition]);

  // Stop drawing
  const handleEnd = useCallback(() => {
    if (!isDrawing) return;
    setIsDrawing(false);

    const canvas = canvasRef.current;
    if (canvas && hasSignature) {
      const dataUrl = canvas.toDataURL('image/png');
      onSignature(dataUrl);
    }
  }, [isDrawing, hasSignature, onSignature]);

  // Clear signature
  const handleClear = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    onSignature('');
  }, [onSignature]);

  return (
    <div className="space-y-2">
      <div className="relative border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-white">
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
        
        {/* Signature line */}
        <div className="absolute bottom-4 left-4 right-4 border-b border-gray-400" />
        
        {/* Placeholder text */}
        {!hasSignature && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-gray-400 text-sm">Sign here</p>
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-center">
        <p className="text-xs text-gray-500">
          Draw your signature using your finger or mouse
        </p>
        <button
          type="button"
          onClick={handleClear}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
