'use client';

import { useState, useEffect } from 'react';
import { usePortalAuth } from '@/lib/portal/useAuth';

interface Photo {
  id: string;
  type: 'before' | 'after' | 'progress';
  url: string;
  thumbnail?: string;
  treatmentArea?: string;
  treatmentType?: string;
  notes?: string;
  takenAt: string;
  daysPostTreatment?: number;
}

const TREATMENT_FILTERS = [
  { id: 'all', label: 'All', icon: '📸' },
  { id: 'botox', label: 'Botox', icon: '💉' },
  { id: 'filler', label: 'Fillers', icon: '💋' },
  { id: 'laser', label: 'Laser', icon: '✨' },
  { id: 'weight_loss', label: 'Weight Loss', icon: '⚖️' },
  { id: 'microneedling', label: 'Microneedling', icon: '🪡' },
];

export default function TimelinePage() {
  const { user, loading: authLoading } = usePortalAuth();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [comparePhotos, setComparePhotos] = useState<Photo[]>([]);

  useEffect(() => {
    if (!user) return;
    fetchPhotos();
  }, [user, activeFilter]);

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const params = activeFilter !== 'all' ? `?treatment=${activeFilter}` : '';
      const res = await fetch(`/api/portal/photos${params}`);
      const data = await res.json();
      setPhotos(data.photos || []);
    } catch (err) {
      console.error('Failed to fetch photos:', err);
    } finally {
      setLoading(false);
    }
  };

  const beforePhotos = photos.filter(p => p.type === 'before');
  const afterPhotos = photos.filter(p => p.type === 'after');

  const toggleComparePhoto = (photo: Photo) => {
    if (comparePhotos.find(p => p.id === photo.id)) {
      setComparePhotos(comparePhotos.filter(p => p.id !== photo.id));
    } else if (comparePhotos.length < 2) {
      setComparePhotos([...comparePhotos, photo]);
    }
  };

  if (authLoading) {
    return <div className="flex items-center justify-center min-h-[400px]"><div className="animate-spin text-4xl">💗</div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#000000]">My Transformation</h1>
          <p className="text-[#000000]/70 mt-1">Track your journey and see your progress</p>
        </div>
        <button
          onClick={() => { setCompareMode(!compareMode); setComparePhotos([]); }}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            compareMode ? 'bg-[#FF2D8E] text-white' : 'border border-[#000000]/20 text-[#000000]/70 hover:border-[#FF2D8E]'
          }`}
        >
          {compareMode ? 'Exit Compare' : '🔄 Compare'}
        </button>
      </div>

      {/* Treatment Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {TREATMENT_FILTERS.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeFilter === filter.id
                ? 'bg-[#FF2D8E] text-white'
                : 'bg-white border border-[#000000]/10 text-[#000000]/70 hover:border-[#FF2D8E]/50'
            }`}
          >
            <span>{filter.icon}</span>
            {filter.label}
          </button>
        ))}
      </div>

      {/* Compare Mode */}
      {compareMode && (
        <div className="bg-white rounded-2xl border border-[#000000]/10 p-6">
          <p className="text-sm text-[#000000]/70 mb-4">Select 2 photos to compare side by side</p>
          <div className="flex gap-4">
            {[0, 1].map((idx) => (
              <div key={idx} className="flex-1 aspect-[3/4] bg-white rounded-xl flex items-center justify-center">
                {comparePhotos[idx] ? (
                  <img
                    src={comparePhotos[idx].url}
                    alt="Compare"
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <p className="text-[#000000]/40 text-sm">Select photo {idx + 1}</p>
                )}
              </div>
            ))}
          </div>
          {comparePhotos.length === 2 && (
            <div className="mt-4 text-center">
              <p className="text-sm text-[#000000]/70">
                {comparePhotos[0].takenAt} → {comparePhotos[1].takenAt}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Before/After Section */}
      {!compareMode && beforePhotos.length > 0 && afterPhotos.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#000000]/10 p-6">
          <h2 className="font-semibold text-[#000000] mb-4">Before & After</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-[#000000]/50 mb-2 text-center">Before</p>
              <div className="aspect-[3/4] bg-white rounded-xl overflow-hidden">
                <img
                  src={beforePhotos[0]?.url}
                  alt="Before"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div>
              <p className="text-sm text-[#000000]/50 mb-2 text-center">After</p>
              <div className="aspect-[3/4] bg-white rounded-xl overflow-hidden">
                <img
                  src={afterPhotos[afterPhotos.length - 1]?.url}
                  alt="After"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All Photos Grid */}
      <div className="bg-white rounded-2xl border border-[#000000]/10 p-6">
        <h2 className="font-semibold text-[#000000] mb-4">All Photos</h2>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-white rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-4xl">📷</span>
            <p className="mt-4 text-[#000000]/70">No photos yet</p>
            <p className="text-sm text-[#000000]/50 mt-1">Photos will appear here after your treatments</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div
                key={photo.id}
                onClick={() => compareMode ? toggleComparePhoto(photo) : setSelectedPhoto(photo)}
                className={`relative aspect-square bg-white rounded-xl overflow-hidden cursor-pointer group ${
                  compareMode && comparePhotos.find(p => p.id === photo.id) ? 'ring-4 ring-[#FF2D8E]' : ''
                }`}
              >
                <img
                  src={photo.thumbnail || photo.url}
                  alt={photo.treatmentType || 'Treatment'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-white text-xs">{new Date(photo.takenAt).toLocaleDateString()}</p>
                    <p className="text-black text-xs capitalize">{photo.type}</p>
                  </div>
                </div>
                <span className={`absolute top-2 right-2 text-xs px-2 py-1 rounded-full ${
                  photo.type === 'before' ? 'bg-white0 text-white' :
                  photo.type === 'after' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
                }`}>
                  {photo.type}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Photo Detail Modal */}
      {selectedPhoto && !compareMode && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4" onClick={() => setSelectedPhoto(null)}>
          <div className="max-w-2xl w-full" onClick={e => e.stopPropagation()}>
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.treatmentType || 'Treatment'}
              className="w-full rounded-2xl"
            />
            <div className="mt-4 text-white">
              <p className="font-medium capitalize">{selectedPhoto.treatmentType} - {selectedPhoto.type}</p>
              <p className="text-black text-sm mt-1">{new Date(selectedPhoto.takenAt).toLocaleDateString()}</p>
              {selectedPhoto.notes && <p className="text-black text-sm mt-2">{selectedPhoto.notes}</p>}
              {selectedPhoto.daysPostTreatment && (
                <p className="text-[#FF2D8E] text-sm mt-2">{selectedPhoto.daysPostTreatment} days post-treatment</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
