'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import OwnerLayout from '../../layout-wrapper';

interface PageRow {
  id: string;
  title: string;
  slug: string;
  status: string;
  updated_at: string;
}

export default function WebsitePagesPage() {
  const [pages, setPages] = useState<PageRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/cms/pages')
      .then((r) => r.json())
      .then((d) => {
        setPages(d.pages || []);
      })
      .catch(() => setPages([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <OwnerLayout title="Pages" description="Create and edit website pages.">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-gray-600">Manage your website pages. Publish, draft, or archive.</p>
          <Link
            href="/admin/owner/website/pages?new=true"
            className="px-4 py-2 bg-[#FF2D8E] text-white rounded-lg hover:bg-black text-sm font-medium"
          >
            + New Page
          </Link>
        </div>
        <div className="rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading…</div>
          ) : pages.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No pages yet. Create one from Website Control.</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {pages.map((p) => (
                <li key={p.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                  <div>
                    <span className="font-medium">{p.title}</span>
                    <span className="text-gray-500 text-sm ml-2">/{p.slug}</span>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      p.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {p.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <Link href="/admin/owner/website" className="text-[#FF2D8E] font-medium hover:underline">
          ← Website Control
        </Link>
      </div>
    </OwnerLayout>
  );
}
