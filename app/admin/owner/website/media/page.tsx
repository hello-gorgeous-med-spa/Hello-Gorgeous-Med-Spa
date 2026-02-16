'use client';

// ============================================================
// MEDIA LIBRARY - OWNER MODE WEBSITE
// Central hub for images, videos, and media assets
// ============================================================

import Link from 'next/link';
import OwnerLayout from '../../layout-wrapper';

const MEDIA_LINKS = [
  {
    href: '/admin/media',
    icon: '🎬',
    label: 'Stream Videos',
    description: 'Upload and manage Cloudflare Stream videos for homepage, hero, testimonials',
  },
  {
    href: '/admin/content/providers',
    icon: '👩‍⚕️',
    label: 'Provider Media',
    description: 'Provider videos and before/after photos for provider profile pages',
  },
  {
    href: '/admin/content/site-videos',
    icon: '📹',
    label: 'Site Videos',
    description: 'Site-wide video content and embeds',
  },
];

export default function WebsiteMediaPage() {
  return (
    <OwnerLayout title="Media Library" description="Images, videos, and files used across your website">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MEDIA_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="bg-white rounded-xl border border-slate-200 p-6 hover:border-pink-300 hover:shadow-md transition-all group"
          >
            <div className="flex items-start gap-4">
              <span className="text-3xl group-hover:scale-110 transition-transform">{link.icon}</span>
              <div>
                <h3 className="font-semibold text-slate-800 group-hover:text-pink-600">{link.label}</h3>
                <p className="text-sm text-slate-500 mt-1">{link.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-200">
        <h3 className="font-semibold text-slate-800 mb-2">Media Tips</h3>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• Stream Videos: Add Cloudflare env vars for uploads</li>
          <li>• Provider Media: Upload headshots, intro videos, before/after photos</li>
          <li>• Keep file sizes reasonable for fast page loads</li>
        </ul>
      </div>
    </OwnerLayout>
  );
}
