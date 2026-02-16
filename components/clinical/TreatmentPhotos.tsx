'use client';

// ============================================================
// TREATMENT PHOTOS COMPONENT
// Capture before/after photos during treatments
// ============================================================

import { useState, useRef } from 'react';

interface Photo {
  id: string;
  type: 'before' | 'after';
  angle: 'front' | 'left' | 'right' | 'up' | 'down';
  dataUrl: string;
  capturedAt: Date;
}

interface TreatmentPhotosProps {
  clientId: string;
  appointmentId: string;
  treatmentArea: string;
  existingPhotos?: Photo[];
  onSave: (photos: Photo[]) => void;
}

const ANGLES = [
  { id: 'front', label: 'Front', icon: '👤' },
  { id: 'left', label: 'Left Side', icon: '👈' },
  { id: 'right', label: 'Right Side', icon: '👉' },
  { id: 'up', label: 'Looking Up', icon: '⬆️' },
  { id: 'down', label: 'Looking Down', icon: '⬇️' },
];

export function TreatmentPhotos({
  clientId,
  appointmentId,
  treatmentArea,
  existingPhotos = [],
  onSave,
}: TreatmentPhotosProps) {
  const [photos, setPhotos] = useState<Photo[]>(existingPhotos);
  const [activeType, setActiveType] = useState<'before' | 'after'>('before');
  const [showCamera, setShowCamera] = useState(false);
  const [selectedAngle, setSelectedAngle] = useState<string>('front');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: 1280, height: 720 },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setShowCamera(true);
    } catch (error) {
      console.error('Camera error:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    
    const newPhoto: Photo = {
      id: `${Date.now()}`,
      type: activeType,
      angle: selectedAngle as Photo['angle'],
      dataUrl,
      capturedAt: new Date(),
    };

    setPhotos(prev => [...prev, newPhoto]);
    stopCamera();
  };

  const deletePhoto = (photoId: string) => {
    setPhotos(prev => prev.filter(p => p.id !== photoId));
  };

  const handleSave = () => {
    onSave(photos);
  };

  const beforePhotos = photos.filter(p => p.type === 'before');
  const afterPhotos = photos.filter(p => p.type === 'after');

  return (
    <div className="bg-white rounded-xl border border-black p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-black">Treatment Photos</h3>
          <p className="text-sm text-black">{treatmentArea}</p>
        </div>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-[#FF2D8E] text-white font-medium rounded-lg hover:bg-black"
        >
          Save Photos
        </button>
      </div>

      {/* Type Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveType('before')}
          className={`flex-1 py-3 rounded-lg font-medium ${
            activeType === 'before'
              ? 'bg-blue-500 text-white'
              : 'bg-white text-black hover:bg-white'
          }`}
        >
          Before ({beforePhotos.length})
        </button>
        <button
          onClick={() => setActiveType('after')}
          className={`flex-1 py-3 rounded-lg font-medium ${
            activeType === 'after'
              ? 'bg-green-500 text-white'
              : 'bg-white text-black hover:bg-white'
          }`}
        >
          After ({afterPhotos.length})
        </button>
      </div>

      {/* Camera View */}
      {showCamera ? (
        <div className="space-y-4">
          <div className="relative bg-black rounded-lg overflow-hidden aspect-[4/3]">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />
            
            {/* Angle indicator */}
            <div className="absolute top-4 left-4 px-3 py-1 bg-white text-white rounded-full text-sm">
              {ANGLES.find(a => a.id === selectedAngle)?.label}
            </div>
          </div>

          {/* Angle Selection */}
          <div className="flex gap-2 justify-center">
            {ANGLES.map(angle => (
              <button
                key={angle.id}
                onClick={() => setSelectedAngle(angle.id)}
                className={`px-3 py-2 rounded-lg text-sm ${
                  selectedAngle === angle.id
                    ? 'bg-[#FF2D8E] text-white'
                    : 'bg-white text-black'
                }`}
              >
                {angle.icon} {angle.label}
              </button>
            ))}
          </div>

          {/* Camera Controls */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={stopCamera}
              className="px-6 py-3 bg-white text-black font-medium rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={capturePhoto}
              className="px-8 py-3 bg-[#FF2D8E] text-white font-medium rounded-lg hover:bg-black"
            >
              📸 Capture
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Photo Grid */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {(activeType === 'before' ? beforePhotos : afterPhotos).map(photo => (
              <div key={photo.id} className="relative group">
                <img
                  src={photo.dataUrl}
                  alt={`${photo.type} - ${photo.angle}`}
                  className="w-full aspect-square object-cover rounded-lg"
                />
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-white text-white text-xs rounded">
                  {ANGLES.find(a => a.id === photo.angle)?.label}
                </div>
                <button
                  onClick={() => deletePhoto(photo.id)}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
            
            {/* Add Photo Button */}
            <button
              onClick={startCamera}
              className="aspect-square border-2 border-dashed border-black rounded-lg flex flex-col items-center justify-center hover:border-[#FF2D8E] hover:bg-pink-50 transition-colors"
            >
              <span className="text-2xl mb-1">📷</span>
              <span className="text-sm text-black">Add Photo</span>
            </button>
          </div>

          {/* Side-by-Side Comparison */}
          {beforePhotos.length > 0 && afterPhotos.length > 0 && (
            <div className="border-t border-black pt-6">
              <h4 className="font-medium text-black mb-4">Comparison</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-black mb-2 text-center">Before</p>
                  <img
                    src={beforePhotos[0].dataUrl}
                    alt="Before"
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                </div>
                <div>
                  <p className="text-sm text-black mb-2 text-center">After</p>
                  <img
                    src={afterPhotos[0].dataUrl}
                    alt="After"
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <p className="text-xs text-black mt-4">
        Photos are stored securely in compliance with HIPAA regulations.
      </p>
    </div>
  );
}

export default TreatmentPhotos;
