'use client';

import { useState, useEffect } from 'react';
import { usePortalAuth } from '@/lib/portal/useAuth';

interface Document {
  id: string;
  document_type: string;
  title: string;
  description?: string;
  file_name: string;
  category?: string;
  is_signed: boolean;
  created_at: string;
}

const CATEGORIES = [
  { id: 'all', label: 'All Documents', icon: '📁' },
  { id: 'financial', label: 'Financial', icon: '💳' },
  { id: 'medical', label: 'Medical Records', icon: '🏥' },
  { id: 'consent', label: 'Consent Forms', icon: '📝' },
  { id: 'photos', label: 'Treatment Photos', icon: '📷' },
  { id: 'instructions', label: 'Instructions', icon: '📋' },
];

export default function DocumentsPage() {
  const { user, loading: authLoading } = usePortalAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    fetchDocuments();
  }, [user, activeCategory]);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const params = activeCategory !== 'all' ? `?category=${activeCategory}` : '';
      const res = await fetch(`/api/portal/documents${params}`, { credentials: 'include' });
      const data = await res.json();
      setDocuments(data.documents || []);
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (doc: Document) => {
    setDownloading(doc.id);
    try {
      const res = await fetch(`/api/portal/documents/download?id=${doc.id}`, { credentials: 'include' });
      const data = await res.json();
      if (data.download_url) {
        const a = document.createElement('a');
        a.href = data.download_url;
        a.download = data.file_name || doc.file_name;
        a.click();
      }
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setDownloading(null);
    }
  };

  if (authLoading) {
    return <div className="flex items-center justify-center min-h-[400px]"><div className="animate-spin text-4xl">💗</div></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111]">My Documents</h1>
        <p className="text-[#111]/70 mt-1">Access and download your records securely</p>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? 'bg-[#E6007E] text-white'
                : 'bg-white border border-[#111]/10 text-[#111]/70 hover:border-[#E6007E]/50'
            }`}
          >
            <span>{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Documents Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-[#111]/10 p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : documents.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-[#111]/10">
          <span className="text-4xl">📄</span>
          <p className="mt-4 text-[#111]/70">No documents found</p>
          <p className="text-sm text-[#111]/50 mt-1">Documents will appear here after your appointments</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <div key={doc.id} className="bg-white rounded-xl border border-[#111]/10 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-[#111] line-clamp-1">{doc.title}</h3>
                  <p className="text-sm text-[#111]/50 mt-1">{doc.file_name}</p>
                  <p className="text-xs text-[#111]/40 mt-2">
                    {new Date(doc.created_at).toLocaleDateString()}
                  </p>
                </div>
                {doc.is_signed && (
                  <span className="text-green-500 text-xs bg-green-50 px-2 py-1 rounded-full">Signed</span>
                )}
              </div>
              <button
                onClick={() => handleDownload(doc)}
                disabled={downloading === doc.id}
                className="mt-4 w-full bg-[#E6007E]/10 text-[#E6007E] py-2 px-4 rounded-lg text-sm font-medium hover:bg-[#E6007E]/20 transition-colors disabled:opacity-50"
              >
                {downloading === doc.id ? 'Downloading...' : '⬇️ Download'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Download All Button */}
      {documents.length > 0 && (
        <div className="flex justify-center pt-4">
          <button className="flex items-center gap-2 bg-black text-white py-3 px-6 rounded-xl font-medium hover:bg-black/90 transition-colors">
            <span>📦</span>
            Download All Records
          </button>
        </div>
      )}
    </div>
  );
}
