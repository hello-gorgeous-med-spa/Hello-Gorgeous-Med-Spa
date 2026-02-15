'use client';

// ============================================================
// HOMEPAGE SECTION MANAGER
// Toggle visibility, reorder sections - NO CODE REQUIRED
// ============================================================

import { useState, useEffect } from 'react';
import Link from 'next/link';
import OwnerLayout from '../../layout-wrapper';

interface Section {
  id: string;
  type: string;
  visible: boolean;
  content: Record<string, unknown>;
}

interface CMSPage {
  id: string;
  slug: string;
  title: string;
  sections: Section[];
}

// Section type labels
const SECTION_LABELS: Record<string, { name: string; icon: string; description: string }> = {
  hero: { name: 'Hero Banner', icon: '🎯', description: 'Main headline and call-to-action' },
  geo_links: { name: 'Local Area Links', icon: '📍', description: 'Serving Naperville, Aurora, etc.' },
  promo_banner: { name: 'Promo Banner', icon: '🎉', description: 'Special offers and announcements' },
  mascots: { name: 'Treatment Guides', icon: '🤖', description: 'Mascot characters section' },
  fix_what_bothers_me: { name: 'Fix What Bothers Me', icon: '💗', description: 'Interactive concern selector' },
  quiz_cta: { name: 'Quiz CTA', icon: '❓', description: 'Treatment quiz call-to-action' },
  hormone_tool: { name: 'Hormone Lab Tool', icon: '🧪', description: 'Hormone insight calculator' },
  providers: { name: 'Meet Providers', icon: '👩‍⚕️', description: 'Danielle & Ryan profiles' },
  offers: { name: 'Current Offers', icon: '🏷️', description: 'Active promotions' },
  membership: { name: 'VIP Membership', icon: '💎', description: 'Membership benefits' },
  interactive_tools: { name: 'Planning Tools', icon: '🛠️', description: 'Botox calculator, etc.' },
  care_team: { name: 'Care Team', icon: '👥', description: 'Your care team section' },
  pharmacy: { name: 'Pharmacy Partner', icon: '💊', description: 'Olympia compounding' },
  fullscript: { name: 'Fullscript', icon: '🌿', description: 'Supplements section' },
  biote: { name: 'Biote Hormones', icon: '⚖️', description: 'Hormone therapy info' },
  trigger_point: { name: 'Trigger Point', icon: '💉', description: 'Trigger point injections' },
  microneedling: { name: 'Microneedling', icon: '✨', description: 'RF microneedling showcase' },
  anteage: { name: 'AnteAGE', icon: '🧴', description: 'Skincare products' },
  laser_hair: { name: 'Laser Hair', icon: '⚡', description: 'Laser hair removal' },
  tiktok: { name: 'TikTok', icon: '📱', description: 'Social media embed' },
  testimonials: { name: 'Testimonials', icon: '⭐', description: 'Client reviews' },
  immediate_care: { name: 'Same-Day Care', icon: '🚀', description: 'Book same-day CTA' },
  partners: { name: 'Partners', icon: '🤝', description: 'Partner logos' },
  photo_gallery: { name: 'Photo Gallery', icon: '📸', description: 'Spa photos' },
  email_capture: { name: 'Email Signup', icon: '✉️', description: 'Newsletter subscription' },
  location_map: { name: 'Location & Map', icon: '🗺️', description: 'Address and map' },
};

export default function HomepageEditorPage() {
  const [page, setPage] = useState<CMSPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchHomepage();
  }, []);

  const fetchHomepage = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/cms/pages?slug=home');
      const data = await res.json();
      if (data.page) {
        setPage(data.page);
      }
    } catch (err) {
      console.error('Failed to fetch homepage:', err);
      setMessage({ type: 'error', text: 'Failed to load homepage' });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVisibility = (sectionId: string) => {
    if (!page) return;
    
    setPage({
      ...page,
      sections: page.sections.map(s => 
        s.id === sectionId ? { ...s, visible: !s.visible } : s
      ),
    });
    setHasChanges(true);
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    if (!page) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= page.sections.length) return;

    const newSections = [...page.sections];
    [newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]];
    
    setPage({ ...page, sections: newSections });
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!page) return;
    
    setIsSaving(true);
    try {
      const res = await fetch('/api/cms/pages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: page.id,
          sections: page.sections,
        }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Homepage saved! Changes are now live.' });
        setHasChanges(false);
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.error || 'Failed to save' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to save homepage' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <OwnerLayout title="Homepage" description="Manage homepage sections">
        <div className="p-8 text-center">
          <div className="animate-spin text-4xl mb-4">🏠</div>
          <p className="text-gray-500">Loading homepage...</p>
        </div>
      </OwnerLayout>
    );
  }

  if (!page) {
    return (
      <OwnerLayout title="Homepage" description="Manage homepage sections">
        <div className="p-8 text-center">
          <span className="text-5xl mb-4 block">⚠️</span>
          <h2 className="text-xl font-bold text-gray-900">Homepage not found in CMS</h2>
          <p className="text-gray-500 mt-2">Run the seed script to initialize the homepage.</p>
        </div>
      </OwnerLayout>
    );
  }

  return (
    <OwnerLayout title="Homepage" description="Toggle sections, reorder content - changes go live instantly">
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link href="/admin/owner/website" className="text-pink-600 hover:underline text-sm">
              ← Back to Website Control
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 mt-2">Homepage Sections</h1>
            <p className="text-gray-500">Drag to reorder, toggle to show/hide</p>
          </div>
          <div className="flex gap-3">
            <a
              href="/"
              target="_blank"
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              👁️ Preview
            </a>
            <button
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className={`px-6 py-2 rounded-lg font-medium ${
                hasChanges
                  ? 'bg-pink-500 text-white hover:bg-pink-600'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isSaving ? 'Saving...' : hasChanges ? 'Save & Publish' : 'No Changes'}
            </button>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl ${
            message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message.text}
            <button onClick={() => setMessage(null)} className="float-right font-bold">×</button>
          </div>
        )}

        {/* Sections List */}
        <div className="space-y-3">
          {page.sections.map((section, index) => {
            const info = SECTION_LABELS[section.type] || { 
              name: section.type, 
              icon: '📦', 
              description: 'Custom section' 
            };
            
            return (
              <div
                key={section.id}
                className={`bg-white rounded-xl border p-4 transition-all ${
                  section.visible ? 'border-gray-200' : 'border-gray-100 opacity-60'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Drag Handle / Order Controls */}
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => moveSection(index, 'up')}
                      disabled={index === 0}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => moveSection(index, 'down')}
                      disabled={index === page.sections.length - 1}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    >
                      ▼
                    </button>
                  </div>

                  {/* Icon */}
                  <span className="text-2xl">{info.icon}</span>

                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{info.name}</h3>
                    <p className="text-sm text-gray-500">{info.description}</p>
                  </div>

                  {/* Position */}
                  <span className="text-sm text-gray-400 w-8 text-center">#{index + 1}</span>

                  {/* Visibility Toggle */}
                  <button
                    onClick={() => toggleVisibility(section.id)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      section.visible ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        section.visible ? 'left-6' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Help Text */}
        <div className="mt-8 p-6 bg-pink-50 rounded-xl border border-pink-100">
          <h3 className="font-semibold text-gray-900 mb-2">💡 Tips</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Toggle the switch to show/hide sections on your homepage</li>
            <li>• Use ▲▼ buttons to reorder sections</li>
            <li>• Click "Save & Publish" to make changes live immediately</li>
            <li>• Click "Preview" to see your homepage in a new tab</li>
          </ul>
        </div>
      </div>
    </OwnerLayout>
  );
}
