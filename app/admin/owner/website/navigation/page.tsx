'use client';

// ============================================================
// NAVIGATION MANAGER - OWNER MODE CMS
// Header, footer, mobile menus - NO DEV REQUIRED
// ============================================================

import { useState, useEffect } from 'react';
import OwnerLayout from '../../layout-wrapper';

interface NavItem {
  id: string;
  label: string;
  url: string;
  type: 'link' | 'dropdown' | 'button';
  children?: NavItem[];
  highlight?: boolean;
  badge?: string;
  visible: boolean;
}

interface Navigation {
  location: string;
  items: NavItem[];
  is_active: boolean;
}

const DEFAULT_NAV: NavItem[] = [
  { id: '1', label: 'Home', url: '/', type: 'link', visible: true },
  { id: '2', label: 'Services', url: '/services', type: 'dropdown', visible: true, children: [
    { id: '2a', label: 'Botox', url: '/botox', type: 'link', visible: true },
    { id: '2b', label: 'Fillers', url: '/fillers', type: 'link', visible: true },
    { id: '2c', label: 'Weight Loss', url: '/weight-loss', type: 'link', visible: true },
  ]},
  { id: '3', label: 'About', url: '/about', type: 'link', visible: true },
  { id: '4', label: 'Contact', url: '/contact', type: 'link', visible: true },
  { id: '5', label: 'Book Now', url: '/book', type: 'button', visible: true, highlight: true },
];

export default function NavigationPage() {
  const [activeLocation, setActiveLocation] = useState<'header' | 'footer' | 'mobile'>('header');
  const [navigation, setNavigation] = useState<Record<string, NavItem[]>>({
    header: DEFAULT_NAV,
    footer: [],
    mobile: DEFAULT_NAV,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [editingItem, setEditingItem] = useState<NavItem | null>(null);
  const [showAddItem, setShowAddItem] = useState(false);
  const [newItem, setNewItem] = useState({ label: '', url: '', type: 'link' as const });

  useEffect(() => {
    fetchNavigation();
  }, []);

  const fetchNavigation = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/cms/navigation');
      const data = await res.json();
      
      const navData: Record<string, NavItem[]> = {
        header: DEFAULT_NAV,
        footer: [],
        mobile: DEFAULT_NAV,
      };
      
      (data.navigation || []).forEach((nav: Navigation) => {
        if (nav.items && nav.items.length > 0) {
          navData[nav.location] = nav.items;
        }
      });
      
      setNavigation(navData);
    } catch (err) {
      console.error('Failed to fetch navigation:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const saveNavigation = async (location: string) => {
    setSaving(true);
    try {
      const res = await fetch('/api/cms/navigation', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location,
          items: navigation[location],
        }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: `${location} navigation saved!` });
      } else {
        setMessage({ type: 'error', text: 'Failed to save' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to save navigation' });
    } finally {
      setSaving(false);
    }
  };

  const addItem = () => {
    if (!newItem.label || !newItem.url) {
      setMessage({ type: 'error', text: 'Label and URL required' });
      return;
    }

    const item: NavItem = {
      id: crypto.randomUUID(),
      label: newItem.label,
      url: newItem.url,
      type: newItem.type,
      visible: true,
    };

    setNavigation({
      ...navigation,
      [activeLocation]: [...navigation[activeLocation], item],
    });

    setShowAddItem(false);
    setNewItem({ label: '', url: '', type: 'link' });
  };

  const updateItem = (itemId: string, updates: Partial<NavItem>) => {
    setNavigation({
      ...navigation,
      [activeLocation]: navigation[activeLocation].map(item =>
        item.id === itemId ? { ...item, ...updates } : item
      ),
    });
  };

  const removeItem = (itemId: string) => {
    if (!window.confirm('Remove this item?')) return;
    
    setNavigation({
      ...navigation,
      [activeLocation]: navigation[activeLocation].filter(item => item.id !== itemId),
    });
  };

  const moveItem = (itemId: string, direction: 'up' | 'down') => {
    const items = [...navigation[activeLocation]];
    const idx = items.findIndex(item => item.id === itemId);
    if (idx === -1) return;
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === items.length - 1) return;

    const newIdx = direction === 'up' ? idx - 1 : idx + 1;
    [items[idx], items[newIdx]] = [items[newIdx], items[idx]];

    setNavigation({ ...navigation, [activeLocation]: items });
  };

  const currentItems = navigation[activeLocation] || [];

  return (
    <OwnerLayout title="Navigation" description="Manage header, footer, and mobile menus">
      {message && (
        <div className={`mb-4 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
          <button onClick={() => setMessage(null)} className="float-right">×</button>
        </div>
      )}

      {/* Location Tabs */}
      <div className="flex gap-2 mb-6">
        {(['header', 'footer', 'mobile'] as const).map(loc => (
          <button
            key={loc}
            onClick={() => setActiveLocation(loc)}
            className={`px-4 py-2 rounded-lg capitalize ${
              activeLocation === loc
                ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30'
                : 'bg-pink-100 text-pink-700 hover:bg-pink-200 border border-pink-200'
            }`}
          >
            {loc === 'header' ? '🔝 Header' : loc === 'footer' ? '⬇️ Footer' : '📱 Mobile'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Navigation Editor */}
        <div className="col-span-2">
          <div className="bg-white rounded-xl border">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="font-semibold capitalize">{activeLocation} Navigation</h2>
              <button
                onClick={() => setShowAddItem(true)}
                className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm"
              >
                + Add Item
              </button>
            </div>

            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin text-2xl mb-2">🔄</div>
                <p className="text-gray-500">Loading...</p>
              </div>
            ) : currentItems.length > 0 ? (
              <div className="divide-y">
                {currentItems.map((item, idx) => (
                  <div key={item.id} className={`p-4 ${!item.visible ? 'opacity-50' : ''}`}>
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => moveItem(item.id, 'up')}
                          disabled={idx === 0}
                          className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => moveItem(item.id, 'down')}
                          disabled={idx === currentItems.length - 1}
                          className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                        >
                          ↓
                        </button>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{item.label}</span>
                          {item.type === 'button' && (
                            <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded">Button</span>
                          )}
                          {item.type === 'dropdown' && (
                            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">Dropdown</span>
                          )}
                          {item.highlight && (
                            <span className="text-xs bg-pink-100 text-pink-600 px-2 py-0.5 rounded">Highlight</span>
                          )}
                          {item.badge && (
                            <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded">{item.badge}</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-400">{item.url}</p>
                        
                        {/* Dropdown Children */}
                        {item.type === 'dropdown' && item.children && item.children.length > 0 && (
                          <div className="mt-2 ml-4 space-y-1">
                            {item.children.map(child => (
                              <div key={child.id} className="text-sm text-gray-500 flex items-center gap-2">
                                <span>└</span>
                                <span>{child.label}</span>
                                <span className="text-gray-300">→</span>
                                <span className="text-gray-400">{child.url}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateItem(item.id, { visible: !item.visible })}
                          className={`p-1 ${item.visible ? 'text-green-500' : 'text-gray-400'}`}
                        >
                          {item.visible ? '👁️' : '👁️‍🗨️'}
                        </button>
                        <button
                          onClick={() => setEditingItem(item)}
                          className="p-1 text-gray-400 hover:text-purple-600"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1 text-gray-400 hover:text-red-600"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                No navigation items. Click "Add Item" to start.
              </div>
            )}
            
            {/* Save Button */}
            <div className="p-4 border-t bg-gray-50">
              <button
                onClick={() => saveNavigation(activeLocation)}
                disabled={saving}
                className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : `Save ${activeLocation} Navigation`}
              </button>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border p-4">
            <h3 className="font-semibold mb-3">Preview</h3>
            <div className="bg-gray-900 text-white p-4 rounded-lg">
              {activeLocation === 'header' && (
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold">Hello Gorgeous</span>
                  <div className="flex gap-4">
                    {currentItems.filter(i => i.visible).map(item => (
                      <span
                        key={item.id}
                        className={item.type === 'button' ? 'px-3 py-1 bg-pink-500 rounded' : ''}
                      >
                        {item.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {activeLocation === 'footer' && (
                <div className="text-sm space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    {currentItems.filter(i => i.visible).map(item => (
                      <span key={item.id} className="text-gray-300">{item.label}</span>
                    ))}
                  </div>
                </div>
              )}
              {activeLocation === 'mobile' && (
                <div className="space-y-2">
                  {currentItems.filter(i => i.visible).map(item => (
                    <div key={item.id} className={`p-2 ${item.type === 'button' ? 'bg-pink-500 rounded' : ''}`}>
                      {item.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-4">
            <h3 className="font-semibold text-blue-800 mb-2">Tips</h3>
            <ul className="text-sm text-blue-600 space-y-1">
              <li>• Use "Button" type for CTAs</li>
              <li>• Add badges like "NEW" for promotions</li>
              <li>• Highlight items to draw attention</li>
              <li>• Changes save per location</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Add Item Modal */}
      {showAddItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Add Navigation Item</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                <input
                  type="text"
                  value={newItem.label}
                  onChange={(e) => setNewItem({ ...newItem, label: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="e.g., Services"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                <input
                  type="text"
                  value={newItem.url}
                  onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="/services or https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={newItem.type}
                  onChange={(e) => setNewItem({ ...newItem, type: e.target.value as any })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="link">Link</option>
                  <option value="button">Button</option>
                  <option value="dropdown">Dropdown</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddItem(false)} className="flex-1 px-4 py-2 border rounded-lg">
                Cancel
              </button>
              <button
                onClick={addItem}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg"
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Edit Navigation Item</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                <input
                  type="text"
                  value={editingItem.label}
                  onChange={(e) => setEditingItem({ ...editingItem, label: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                <input
                  type="text"
                  value={editingItem.url}
                  onChange={(e) => setEditingItem({ ...editingItem, url: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={editingItem.highlight || false}
                  onChange={(e) => setEditingItem({ ...editingItem, highlight: e.target.checked })}
                  className="w-4 h-4"
                />
                <label className="text-sm text-gray-700">Highlight (draw attention)</label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Badge (optional)</label>
                <input
                  type="text"
                  value={editingItem.badge || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, badge: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="e.g., NEW"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditingItem(null)} className="flex-1 px-4 py-2 border rounded-lg">
                Cancel
              </button>
              <button
                onClick={() => {
                  updateItem(editingItem.id, editingItem);
                  setEditingItem(null);
                }}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </OwnerLayout>
  );
}
