'use client';

// ============================================================
// BUSINESS MEMORY — In-house knowledge base you own
// ============================================================

import { useState, useEffect } from 'react';
import Link from 'next/link';

type MemoryItem = {
  id: string;
  type: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export default function AIMemoryPage() {
  const [items, setItems] = useState<MemoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<'add' | MemoryItem | null>(null);
  const [form, setForm] = useState({ type: 'faq', title: '', content: '' });
  const [saving, setSaving] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/memory');
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openAdd = () => {
    setForm({ type: 'faq', title: '', content: '' });
    setModal('add');
  };

  const openEdit = (item: MemoryItem) => {
    setForm({ type: item.type, title: item.title, content: item.content });
    setModal(item);
  };

  const save = async () => {
    if (!form.title.trim() || !form.content.trim()) return;
    setSaving(true);
    try {
      if (modal === 'add') {
        const res = await fetch('/api/ai/memory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (res.ok) {
          setModal(null);
          fetchItems();
        }
      } else if (typeof modal === 'object' && modal.id) {
        const res = await fetch(`/api/ai/memory/${modal.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (res.ok) {
          setModal(null);
          fetchItems();
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this entry?')) return;
    try {
      await fetch(`/api/ai/memory/${id}`, { method: 'DELETE' });
      fetchItems();
      if (typeof modal === 'object' && modal?.id === id) setModal(null);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/admin/ai" className="text-slate-500 hover:text-slate-700">← AI Hub</Link>
        <button
          onClick={openAdd}
          className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 text-sm font-medium"
        >
          + Add entry
        </button>
      </div>
      <h1 className="text-xl font-bold text-gray-900">Business Memory</h1>
      <p className="text-gray-600 text-sm">
        Searchable knowledge your AI uses. You own this data. Add FAQs, policies, service info.
      </p>

      {loading ? (
        <p className="text-gray-500">Loading…</p>
      ) : items.length === 0 ? (
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-8 text-center text-gray-600">
          <p className="mb-4">No entries yet. Add your first FAQ or policy so your AI can use it.</p>
          <button onClick={openAdd} className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600">
            Add first entry
          </button>
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="bg-white rounded-xl border p-4 flex items-start justify-between gap-4"
            >
              <div className="min-w-0 flex-1">
                <span className="text-xs text-gray-500 uppercase font-medium">{item.type}</span>
                <h3 className="font-medium text-gray-900 mt-0.5">{item.title}</h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.content}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => openEdit(item)} className="text-sm text-pink-600 hover:text-pink-700">
                  Edit
                </button>
                <button onClick={() => remove(item.id)} className="text-sm text-red-600 hover:text-red-700">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {modal === 'add' ? 'Add to Business Memory' : 'Edit entry'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                >
                  <option value="faq">FAQ</option>
                  <option value="policy">Policy</option>
                  <option value="document">Document</option>
                  <option value="service_info">Service info</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  placeholder="e.g. Cancellation policy"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  rows={5}
                  placeholder="What should the AI know?"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={save}
                disabled={saving || !form.title.trim() || !form.content.trim()}
                className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button onClick={() => setModal(null)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
