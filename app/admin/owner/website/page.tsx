'use client';

// ============================================================
// WEBSITE CONTROL CENTER - OWNER MODE
// Full CMS control - NO DEV REQUIRED
// ============================================================

import { useState, useEffect } from 'react';
import Link from 'next/link';
import OwnerLayout from '../layout-wrapper';

interface QuickStat {
  label: string;
  value: number | string;
  icon: string;
  href?: string;
}

interface Page {
  id: string;
  title: string;
  slug: string;
  status: string;
  updated_at: string;
}

interface Promotion {
  id: string;
  name: string;
  is_active: boolean;
  starts_at: string | null;
  ends_at: string | null;
}

export default function WebsiteControlPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [pagesRes, promosRes] = await Promise.all([
        fetch('/api/cms/pages'),
        fetch('/api/cms/promotions'),
      ]);
      
      const pagesData = await pagesRes.json();
      const promosData = await promosRes.json();
      
      setPages(pagesData.pages || []);
      setPromotions(promosData.promotions || []);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const publishedPages = pages.filter(p => p.status === 'published').length;
  const draftPages = pages.filter(p => p.status === 'draft').length;
  const activePromos = promotions.filter(p => p.is_active).length;

  const quickStats: QuickStat[] = [
    { label: 'Published Pages', value: publishedPages, icon: '📄', href: '/admin/owner/website/pages' },
    { label: 'Draft Pages', value: draftPages, icon: '📝', href: '/admin/owner/website/pages?status=draft' },
    { label: 'Active Promos', value: activePromos, icon: '🎉', href: '/admin/owner/website/promotions' },
    { label: 'Site Status', value: 'Live', icon: '🟢' },
  ];

  const websiteLinks = [
    { href: '/admin/owner/website/homepage', icon: '🏠', label: 'Homepage', description: 'Edit sections, reorder content' },
    { href: '/admin/owner/website/pages', icon: '📄', label: 'Pages', description: 'Create and edit website pages' },
    { href: '/admin/owner/website/navigation', icon: '🧭', label: 'Navigation', description: 'Header, footer, and menus' },
    { href: '/admin/owner/website/promotions', icon: '🎉', label: 'Offers & Promotions', description: 'Banners, campaigns, specials' },
    { href: '/admin/owner/website/media', icon: '🖼️', label: 'Media Library', description: 'Images, videos, files' },
    { href: '/admin/owner/website/settings', icon: '🎨', label: 'Design & Branding', description: 'Colors, fonts, layout' },
    { href: '/admin/owner/website/seo', icon: '🔍', label: 'SEO & Metadata', description: 'Titles, descriptions, schema' },
  ];

  return (
    <OwnerLayout title="Website Control" description="Full control of your public website - no dev required">
      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {quickStats.map((stat, idx) => (
          <div 
            key={idx} 
            className={`bg-white rounded-xl border p-4 ${stat.href ? 'cursor-pointer hover:border-purple-300' : ''}`}
            onClick={() => stat.href && window.location.assign(stat.href)}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{stat.icon}</span>
              <div>
                <p className="text-xs text-black">{stat.label}</p>
                <p className="text-xl font-bold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Website Sections */}
        <div className="col-span-2">
          <h2 className="text-lg font-semibold mb-4">Website Management</h2>
          <div className="grid grid-cols-2 gap-4">
            {websiteLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="bg-white rounded-xl border p-4 hover:border-purple-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{link.icon}</span>
                  <div>
                    <h3 className="font-semibold">{link.label}</h3>
                    <p className="text-sm text-black">{link.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Quick Actions */}
          <h2 className="text-lg font-semibold mb-4 mt-8">Quick Actions</h2>
          <div className="flex gap-4">
            <Link
              href="/admin/owner/website/pages?new=true"
              className="px-4 py-3 bg-[#FF2D8E] text-white rounded-lg hover:bg-black"
            >
              + Create New Page
            </Link>
            <Link
              href="/admin/owner/website/promotions?new=true"
              className="px-4 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
            >
              + New Promotion
            </Link>
            <a
              href="/"
              target="_blank"
              className="px-4 py-3 bg-white text-black rounded-lg hover:bg-white"
            >
              👁️ Preview Site
            </a>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Pages */}
          <div className="bg-white rounded-xl border p-4">
            <h3 className="font-semibold mb-3">Recent Pages</h3>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-10 bg-white rounded animate-pulse" />
                ))}
              </div>
            ) : pages.length > 0 ? (
              <div className="space-y-2">
                {pages.slice(0, 5).map(page => (
                  <Link
                    key={page.id}
                    href={`/admin/owner/website/pages/${page.id}`}
                    className="flex items-center justify-between p-2 hover:bg-white rounded"
                  >
                    <span className="text-sm truncate">{page.title}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      page.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-white text-black'
                    }`}>
                      {page.status}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-black">No pages yet</p>
            )}
            <Link href="/admin/owner/website/pages" className="text-sm text-pink-600 block mt-3">
              View all pages →
            </Link>
          </div>

          {/* Active Promotions */}
          <div className="bg-white rounded-xl border p-4">
            <h3 className="font-semibold mb-3">Active Promotions</h3>
            {promotions.filter(p => p.is_active).length > 0 ? (
              <div className="space-y-2">
                {promotions.filter(p => p.is_active).slice(0, 3).map(promo => (
                  <Link
                    key={promo.id}
                    href={`/admin/owner/website/promotions/${promo.id}`}
                    className="flex items-center gap-2 p-2 hover:bg-white rounded"
                  >
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm truncate">{promo.name}</span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-black">No active promotions</p>
            )}
            <Link href="/admin/owner/website/promotions" className="text-sm text-pink-600 block mt-3">
              Manage promotions →
            </Link>
          </div>

          {/* Help */}
          <div className="bg-blue-50 rounded-xl p-4">
            <h3 className="font-semibold text-blue-800 mb-2">Website CMS</h3>
            <p className="text-sm text-blue-600">
              You have full control over your website. Create pages, manage promotions, 
              update navigation - all without any code or developer involvement.
            </p>
          </div>
        </div>
      </div>
    </OwnerLayout>
  );
}
