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
  const [error, setError] = useState<string | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/memory');
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setItems(data.items || []);
      } else {
        setError(data.error || `Failed to load (${res.status})`);
      }
    } catch (e) {
      console.error(e);
      setError('Network error loading entries');
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
    setError(null);
  };

  const openEdit = (item: MemoryItem) => {
    setForm({ type: item.type, title: item.title, content: item.content });
    setModal(item);
    setError(null);
  };

  const save = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const payload = { type: form.type, title: form.title.trim(), content: (form.content || '').trim() };
      if (modal === 'add') {
        const res = await fetch('/api/ai/memory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok) {
          setModal(null);
          fetchItems();
        } else {
          setError(data.error || `Failed to save (${res.status})`);
        }
      } else if (typeof modal === 'object' && modal.id) {
        const res = await fetch(`/api/ai/memory/${modal.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok) {
          setModal(null);
          fetchItems();
        } else {
          setError(data.error || `Failed to save (${res.status})`);
        }
      }
    } catch (e) {
      console.error(e);
      setError('Network error. Please try again.');
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
        <Link href="/admin/ai" className="text-black hover:text-black">← AI Hub</Link>
        <button
          onClick={openAdd}
          className="px-4 py-2 bg-[#FF2D8E] text-white rounded-lg hover:bg-black text-sm font-medium"
        >
          + Add entry
        </button>
      </div>
      <h1 className="text-xl font-bold text-black">Business Memory</h1>
      <p className="text-black text-sm">
        Searchable knowledge your AI uses. You own this data. Add FAQs, policies, service info.
      </p>

      {error && !modal && (
        <p className="p-3 rounded-lg bg-red-50 text-red-700 text-sm" role="alert">
          {error}
        </p>
      )}
      {loading ? (
        <p className="text-black">Loading…</p>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-xl border border-black p-8 text-center text-black">
          <p className="mb-4">No entries yet. Add your first FAQ or policy so your AI can use it.</p>
          <button onClick={openAdd} className="px-4 py-2 bg-[#FF2D8E] text-white rounded-lg hover:bg-black">
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
                <span className="text-xs text-black uppercase font-medium">{item.type}</span>
                <h3 className="font-medium text-black mt-0.5">{item.title}</h3>
                <p className="text-sm text-black mt-1 line-clamp-2">{item.content}</p>
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
        <div className="fixed inset-0 bg-white flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-black mb-4">
              {modal === 'add' ? 'Add to Business Memory' : 'Edit entry'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full px-3 py-2 border border-black rounded-lg"
                >
                  <option value="faq">FAQ</option>
                  <option value="policy">Policy</option>
                  <option value="document">Document</option>
                  <option value="service_info">Service info</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Title</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 border border-black rounded-lg"
                  placeholder="e.g. Cancellation policy"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Content</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full px-3 py-2 border border-black rounded-lg"
                  rows={5}
                  placeholder="What should the AI know?"
                />
              </div>
            </div>
            {error && (
              <p className="mt-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm" role="alert">
                {error}
              </p>
            )}
            <div className="flex gap-3 mt-6">
              <button
                onClick={save}
                disabled={saving || !form.title.trim()}
                className="px-4 py-2 bg-[#FF2D8E] text-white rounded-lg hover:bg-black disabled:opacity-50"
              >
                {saving ? 'Saving…' : form.content.trim() ? 'Save' : 'Save draft'}
              </button>
              <button onClick={() => setModal(null)} className="px-4 py-2 border border-black rounded-lg hover:bg-white">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
