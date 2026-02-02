'use client';

// ============================================================
// PROVIDER PHOTOS - Before/After Photo Management
// HIPAA-compliant photo capture and storage
// ============================================================

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface Photo {
  id: string;
  client_id: string;
  appointment_id?: string;
  type: 'before' | 'after';
  url: string;
  thumbnail_url?: string;
  taken_at: string;
  taken_by: string;
  notes?: string;
  treatment_area?: string;
}

interface Client {
  id: string;
  first_name: string;
  last_name: string;
}

function PhotosContent() {
  const searchParams = useSearchParams();
  const clientId = searchParams.get('client');
  const appointmentId = searchParams.get('appointment');
  
  const [mode, setMode] = useState<'search' | 'capture' | 'gallery'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [photoType, setPhotoType] = useState<'before' | 'after'>('before');
  const [treatmentArea, setTreatmentArea] = useState('');
  const [photoNotes, setPhotoNotes] = useState('');
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const TREATMENT_AREAS = [
    'Full Face', 'Forehead', 'Glabella', 'Crow\'s Feet', 'Under Eyes',
    'Cheeks', 'Nasolabial', 'Lips', 'Marionette Lines', 'Jawline',
    'Chin', 'Neck', 'Decolletage', 'Hands', 'Other'
  ];

  // Search clients
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const search = async () => {
      try {
        const res = await fetch(`/api/clients?search=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        if (data.clients) {
          setSearchResults(data.clients);
        }
      } catch (error) {
        console.error('Search error:', error);
      }
    };

    const timeout = setTimeout(search, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  // Load photos for selected client
  useEffect(() => {
    if (selectedClient) {
      loadPhotos(selectedClient.id);
    }
  }, [selectedClient]);

  // Load client if ID provided
  useEffect(() => {
    if (clientId) {
      loadClientById(clientId);
    }
  }, [clientId]);

  const loadClientById = async (id: string) => {
    try {
      const res = await fetch(`/api/clients?id=${id}`);
      const data = await res.json();
      if (data.clients?.[0]) {
        setSelectedClient(data.clients[0]);
        setMode('gallery');
      }
    } catch (error) {
      console.error('Error loading client:', error);
    }
  };

  const loadPhotos = async (cId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/photos?clientId=${cId}`);
      const data = await res.json();
      setPhotos(data.photos || []);
    } catch (error) {
      console.error('Error loading photos:', error);
      // Demo data
      setPhotos([]);
    } finally {
      setLoading(false);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        } 
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCapturing(true);
    } catch (error) {
      console.error('Camera error:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setCapturing(false);
    setCapturedImage(null);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedImage(imageData);
      }
    }
  };

  const savePhoto = async () => {
    if (!capturedImage || !selectedClient) return;

    setLoading(true);
    try {
      const res = await fetch('/api/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: selectedClient.id,
          appointment_id: appointmentId || null,
          type: photoType,
          image_data: capturedImage,
          treatment_area: treatmentArea,
          notes: photoNotes,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setPhotos(prev => [data.photo, ...prev]);
        setCapturedImage(null);
        setPhotoNotes('');
        setTreatmentArea('');
        alert('Photo saved successfully!');
      } else {
        throw new Error('Failed to save photo');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save photo. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedClient) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const imageData = reader.result as string;
      setCapturedImage(imageData);
      setMode('capture');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patient Photos</h1>
          <p className="text-gray-500">Capture and manage before/after documentation</p>
        </div>
        {selectedClient && (
          <button
            onClick={() => {
              setSelectedClient(null);
              setPhotos([]);
              setMode('search');
            }}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Change Patient
          </button>
        )}
      </div>

      {/* HIPAA Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <span className="text-xl">🔒</span>
          <div>
            <p className="font-medium text-blue-800">HIPAA Compliant Storage</p>
            <p className="text-sm text-blue-700">
              Photos are encrypted and linked to patient records. Never share outside the EHR system.
            </p>
          </div>
        </div>
      </div>

      {/* Search Mode */}
      {mode === 'search' && !selectedClient && (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Select Patient</h2>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Search by name, phone, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500"
              autoFocus
            />
          </div>

          {searchResults.length > 0 && (
            <div className="mt-4 border border-gray-200 rounded-xl overflow-hidden">
              {searchResults.map((client) => (
                <button
                  key={client.id}
                  onClick={() => {
                    setSelectedClient(client);
                    setMode('gallery');
                    setSearchQuery('');
                  }}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 border-b border-gray-100 last:border-0 text-left"
                >
                  <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold">
                    {client.first_name?.[0]}{client.last_name?.[0]}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {client.first_name} {client.last_name}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Gallery Mode */}
      {mode === 'gallery' && selectedClient && (
        <>
          {/* Client Header */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold text-xl">
                  {selectedClient.first_name?.[0]}{selectedClient.last_name?.[0]}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedClient.first_name} {selectedClient.last_name}
                  </h2>
                  <p className="text-gray-500">{photos.length} photos on file</p>
                </div>
              </div>
              <div className="flex gap-2">
                <label className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer font-medium">
                  📁 Upload
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <button
                  onClick={() => {
                    startCamera();
                    setMode('capture');
                  }}
                  className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 font-medium flex items-center gap-2"
                >
                  📷 Take Photo
                </button>
              </div>
            </div>
          </div>

          {/* Photo Gallery */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Photo History</h3>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-lg font-medium">
                  Before
                </button>
                <button className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-lg font-medium">
                  After
                </button>
              </div>
            </div>

            {photos.length === 0 ? (
              <div className="p-12 text-center">
                <span className="text-5xl block mb-3">📷</span>
                <p className="text-gray-500 mb-4">No photos yet for this patient</p>
                <button
                  onClick={() => {
                    startCamera();
                    setMode('capture');
                  }}
                  className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
                >
                  Take First Photo
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-5">
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="relative group rounded-xl overflow-hidden border border-gray-200"
                  >
                    <img
                      src={photo.url || photo.thumbnail_url}
                      alt={`${photo.type} photo`}
                      className="w-full aspect-square object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <span className={`px-2 py-1 text-xs font-bold rounded ${
                        photo.type === 'before' 
                          ? 'bg-green-500 text-white' 
                          : 'bg-blue-500 text-white'
                      }`}>
                        {photo.type.toUpperCase()}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="text-center text-white">
                        <p className="text-sm font-medium">{photo.treatment_area || 'General'}</p>
                        <p className="text-xs opacity-80">
                          {new Date(photo.taken_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Capture Mode */}
      {mode === 'capture' && selectedClient && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">
              {capturedImage ? 'Review Photo' : 'Capture Photo'}
            </h3>
            <button
              onClick={() => {
                stopCamera();
                setMode('gallery');
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕ Cancel
            </button>
          </div>

          <div className="p-5">
            {/* Photo Type Selection */}
            <div className="flex gap-4 mb-4">
              <button
                onClick={() => setPhotoType('before')}
                className={`flex-1 py-3 rounded-xl font-semibold text-lg ${
                  photoType === 'before'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                📸 BEFORE
              </button>
              <button
                onClick={() => setPhotoType('after')}
                className={`flex-1 py-3 rounded-xl font-semibold text-lg ${
                  photoType === 'after'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                ✨ AFTER
              </button>
            </div>

            {/* Camera/Preview */}
            <div className="relative bg-black rounded-xl overflow-hidden mb-4">
              {capturing && !capturedImage && (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full aspect-[4/3] object-cover"
                />
              )}
              {capturedImage && (
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="w-full aspect-[4/3] object-cover"
                />
              )}
              <canvas ref={canvasRef} className="hidden" />
            </div>

            {/* Controls */}
            {capturing && !capturedImage && (
              <button
                onClick={capturePhoto}
                className="w-full py-4 bg-pink-500 text-white rounded-xl font-bold text-lg hover:bg-pink-600"
              >
                📷 Capture Photo
              </button>
            )}

            {capturedImage && (
              <>
                {/* Treatment Area */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Treatment Area
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {TREATMENT_AREAS.map((area) => (
                      <button
                        key={area}
                        onClick={() => setTreatmentArea(area)}
                        className={`px-3 py-1.5 rounded-full text-sm ${
                          treatmentArea === area
                            ? 'bg-pink-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {area}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (optional)
                  </label>
                  <textarea
                    value={photoNotes}
                    onChange={(e) => setPhotoNotes(e.target.value)}
                    placeholder="Any observations..."
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    rows={2}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setCapturedImage(null);
                      if (!cameraStream) startCamera();
                    }}
                    className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200"
                  >
                    Retake
                  </button>
                  <button
                    onClick={savePhoto}
                    disabled={loading}
                    className="flex-1 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : '✓ Save Photo'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProviderPhotosPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <PhotosContent />
    </Suspense>
  );
}
