'use client';

// ============================================================
// CLIENT PHOTOS PAGE
// Before/After photo capture tied to visits
// ============================================================

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { BeforeAfterSlider } from '@/components/providers/BeforeAfterSlider';

interface Photo {
  id: string;
  type: 'before' | 'after' | 'progress';
  url: string;
  thumbnail_url?: string;
  visit_id?: string;
  visit_date?: string;
  service_name?: string;
  area?: string;
  notes?: string;
  captured_at: string;
  captured_by?: string;
}

interface PhotoSet {
  date: string;
  visit_id?: string;
  service?: string;
  before?: Photo;
  after?: Photo;
  progress: Photo[];
}

const PHOTO_AREAS = [
  'Full Face',
  'Forehead',
  'Glabella (11 lines)',
  'Crow\'s Feet',
  'Under Eyes',
  'Cheeks',
  'Nasolabial Folds',
  'Lips',
  'Marionette Lines',
  'Chin',
  'Jawline',
  'Neck',
  'Décolletage',
  'Hands',
  'Body - Abdomen',
  'Body - Arms',
  'Body - Thighs',
  'Other',
];

export default function ClientPhotosPage() {
  const params = useParams();
  const clientId = params.id as string;
  
  const [client, setClient] = useState<any>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCapture, setShowCapture] = useState(false);
  const [captureType, setCaptureType] = useState<'before' | 'after' | 'progress'>('before');
  const [selectedArea, setSelectedArea] = useState('Full Face');
  const [notes, setNotes] = useState('');
  const [capturing, setCapturing] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [comparePhotos, setComparePhotos] = useState<[Photo | null, Photo | null]>([null, null]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [useCameraMode, setUseCameraMode] = useState(false);

  // Fetch client and photos
  useEffect(() => {
    async function fetchData() {
      try {
        const clientRes = await fetch(`/api/clients/${clientId}`);
        if (clientRes.ok) {
          const data = await clientRes.json();
          setClient(data.client);
        }

        const photosRes = await fetch(`/api/clients/${clientId}/photos`);
        if (photosRes.ok) {
          const data = await photosRes.json();
          setPhotos(data.photos || []);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [clientId]);

  // Start camera
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setUseCameraMode(true);
    } catch (err) {
      console.error('Camera error:', err);
      alert('Could not access camera. Please upload a photo instead.');
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setUseCameraMode(false);
  };

  // Capture from camera
  const captureFromCamera = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      savePhoto(dataUrl);
    }
    
    stopCamera();
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      savePhoto(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  // Save photo
  const savePhoto = async (dataUrl: string) => {
    setCapturing(true);
    try {
      const res = await fetch(`/api/clients/${clientId}/photos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: captureType,
          image_data: dataUrl,
          area: selectedArea,
          notes: notes,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setPhotos(prev => [data.photo, ...prev]);
        setShowCapture(false);
        setNotes('');
      }
    } catch (err) {
      console.error('Save photo error:', err);
    }
    setCapturing(false);
  };

  // Delete photo
  const handleDelete = async (photoId: string) => {
    if (!confirm('Delete this photo?')) return;
    
    try {
      await fetch(`/api/clients/${clientId}/photos?id=${photoId}`, {
        method: 'DELETE',
      });
      setPhotos(prev => prev.filter(p => p.id !== photoId));
      setSelectedPhoto(null);
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  // Group photos by date
  const groupedPhotos = photos.reduce((acc, photo) => {
    const date = photo.captured_at.split('T')[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(photo);
    return acc;
  }, {} as Record<string, Photo[]>);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <Link href={`/admin/clients/${clientId}`} className="hover:text-pink-600">
              ← Back to {client?.first_name} {client?.last_name}
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Photos</h1>
          <p className="text-gray-500">Before/after documentation for treatments</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setCompareMode(!compareMode)}
            className={`px-4 py-2 font-medium rounded-lg ${
              compareMode 
                ? 'bg-purple-500 text-white' 
                : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {compareMode ? '✓ Compare Mode' : '↔️ Compare'}
          </button>
          <button
            onClick={() => setShowCapture(true)}
            className="px-4 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600"
          >
            📸 New Photo
          </button>
        </div>
      </div>

      {/* Compare Mode Instructions */}
      {compareMode && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <p className="text-purple-800">
            <strong>Compare Mode:</strong> Click two photos to compare them side-by-side.
          </p>
          {comparePhotos[0] && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-sm text-pink-600">Selected: {comparePhotos[0].type} - {comparePhotos[0].area}</span>
              <button
                onClick={() => setComparePhotos([null, null])}
                className="text-xs text-pink-600 hover:text-purple-800"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      )}

      {/* Photo Grid */}
      {Object.keys(groupedPhotos).length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <span className="text-6xl block mb-4">📷</span>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No photos yet</h3>
          <p className="text-gray-500 mb-4">Capture before/after photos to document treatments</p>
          <button
            onClick={() => setShowCapture(true)}
            className="px-6 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600"
          >
            Take First Photo
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedPhotos)
            .sort(([a], [b]) => b.localeCompare(a))
            .map(([date, datePhotos]) => (
              <div key={date} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900">
                    {new Date(date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h3>
                  <p className="text-sm text-gray-500">{datePhotos.length} photo(s)</p>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {datePhotos.map(photo => (
                      <div
                        key={photo.id}
                        onClick={() => {
                          if (compareMode) {
                            if (!comparePhotos[0]) {
                              setComparePhotos([photo, null]);
                            } else if (!comparePhotos[1]) {
                              setComparePhotos([comparePhotos[0], photo]);
                            }
                          } else {
                            setSelectedPhoto(photo);
                          }
                        }}
                        className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                          comparePhotos.includes(photo)
                            ? 'border-purple-500 ring-2 ring-purple-300'
                            : 'border-transparent hover:border-pink-300'
                        }`}
                      >
                        <img
                          src={photo.url}
                          alt={`${photo.type} - ${photo.area}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                            photo.type === 'before' ? 'bg-blue-500 text-white' :
                            photo.type === 'after' ? 'bg-green-500 text-white' :
                            'bg-yellow-500 text-white'
                          }`}>
                            {photo.type.toUpperCase()}
                          </span>
                          <p className="text-white text-xs mt-1 truncate">{photo.area}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Capture Modal */}
      {showCapture && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Capture Photo</h2>
            </div>
            <div className="p-6 space-y-4">
              {/* Photo Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Photo Type</label>
                <div className="flex gap-2">
                  {(['before', 'after', 'progress'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => setCaptureType(type)}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium capitalize ${
                        captureType === type
                          ? type === 'before' ? 'bg-blue-500 text-white' :
                            type === 'after' ? 'bg-green-500 text-white' :
                            'bg-yellow-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Area */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Treatment Area</label>
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                >
                  {PHOTO_AREAS.map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  rows={2}
                  placeholder="Any relevant notes..."
                />
              </div>

              {/* Camera/Upload */}
              {useCameraMode ? (
                <div className="space-y-4">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full rounded-lg bg-black"
                  />
                  <canvas ref={canvasRef} className="hidden" />
                  <div className="flex gap-3">
                    <button
                      onClick={captureFromCamera}
                      disabled={capturing}
                      className="flex-1 py-3 bg-pink-500 text-white font-bold rounded-lg hover:bg-pink-600"
                    >
                      📸 Capture
                    </button>
                    <button
                      onClick={stopCamera}
                      className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={startCamera}
                    className="flex-1 py-4 bg-pink-500 text-white font-bold rounded-lg hover:bg-pink-600"
                  >
                    📷 Use Camera
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 py-4 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200"
                  >
                    📁 Upload File
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-100">
              <button
                onClick={() => {
                  setShowCapture(false);
                  stopCamera();
                }}
                className="w-full py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Photo Detail Modal */}
      {selectedPhoto && !compareMode && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="max-w-4xl w-full">
            <div className="flex items-center justify-between mb-4">
              <div className="text-white">
                <span className={`text-sm font-medium px-3 py-1 rounded ${
                  selectedPhoto.type === 'before' ? 'bg-blue-500' :
                  selectedPhoto.type === 'after' ? 'bg-green-500' :
                  'bg-yellow-500'
                }`}>
                  {selectedPhoto.type.toUpperCase()}
                </span>
                <h3 className="text-xl font-bold mt-2">{selectedPhoto.area}</h3>
                <p className="text-gray-400">
                  {new Date(selectedPhoto.captured_at).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleDelete(selectedPhoto.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100"
                >
                  Close
                </button>
              </div>
            </div>
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.area}
              className="w-full rounded-lg"
            />
            {selectedPhoto.notes && (
              <p className="mt-4 text-gray-300">{selectedPhoto.notes}</p>
            )}
          </div>
        </div>
      )}

      {/* Compare Modal - Slider */}
      {compareMode && comparePhotos[0] && comparePhotos[1] && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="max-w-2xl w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Before & After Comparison</h3>
              <button
                onClick={() => setComparePhotos([null, null])}
                className="px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100"
              >
                Close
              </button>
            </div>
            <div className="bg-white rounded-xl p-4">
              <BeforeAfterSlider
                beforeUrl={comparePhotos[0].url}
                afterUrl={comparePhotos[1].url}
                alt={`${comparePhotos[0].area} → ${comparePhotos[1].area}`}
                aspectRatio="square"
              />
            </div>
            <p className="text-gray-400 mt-3 text-sm text-center">
              {comparePhotos[0].area} vs {comparePhotos[1].area}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
