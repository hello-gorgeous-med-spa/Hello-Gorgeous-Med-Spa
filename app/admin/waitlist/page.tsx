// ============================================================
// ADMIN: WAITLIST MANAGEMENT
// Aesthetic Record-style waitlist - Turn cancellations into conversions
// ============================================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface WaitlistEntry {
  id: string;
  client_id: string;
  client_name: string;
  client_email?: string;
  client_phone?: string;
  service_id?: string;
  service_name?: string;
  provider_id?: string;
  provider_name?: string;
  preferred_days?: string[];
  preferred_time?: string;
  notes?: string;
  card_on_file?: boolean;
  priority: string;
  status: string;
  created_at: string;
  contacted_at?: string;
  booked_at?: string;
}

interface Client {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

interface Service {
  id: string;
  name: string;
}

interface Provider {
  id: string;
  name: string;
}

const DAYS_OF_WEEK = [
  { id: 'monday', label: 'Mon' },
  { id: 'tuesday', label: 'Tue' },
  { id: 'wednesday', label: 'Wed' },
  { id: 'thursday', label: 'Thu' },
  { id: 'friday', label: 'Fri' },
  { id: 'saturday', label: 'Sat' },
  { id: 'sunday', label: 'Sun' },
];

const TIME_PREFERENCES = [
  { id: 'any', label: 'Any Time' },
  { id: 'morning', label: 'Morning (9am-12pm)' },
  { id: 'afternoon', label: 'Afternoon (12pm-4pm)' },
  { id: 'evening', label: 'Evening (4pm-7pm)' },
];

interface VIPWaitlistEntry {
  id: string;
  campaign: string;
  name: string;
  email: string;
  phone?: string;
  status: string;
  qualification_data?: { section?: string; treatmentId?: string };
  created_at: string;
}

const VIP_CAMPAIGN_LABELS: Record<string, string> = {
  co2_solaria: 'Solaria CO₂ VIP',
  vip_skin_tightening: 'VIP Skin Tightening / Trifecta',
};

const VIP_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'contacted', label: 'Contacted', color: 'bg-blue-100 text-blue-800' },
  { value: 'scheduled', label: 'Scheduled', color: 'bg-purple-100 text-purple-800' },
  { value: 'booked', label: 'Booked', color: 'bg-green-100 text-green-800' },
  { value: 'declined', label: 'Declined', color: 'bg-gray-100 text-gray-800' },
];

export default function WaitlistPage() {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'waiting' | 'contacted' | 'booked'>('waiting');
  const [stats, setStats] = useState({ total: 0, waiting: 0, contacted: 0, booked: 0 });
  const [activeTab, setActiveTab] = useState<'slots' | 'vip'>('slots');
  const [vipEntries, setVipEntries] = useState<VIPWaitlistEntry[]>([]);
  const [vipLoading, setVipLoading] = useState(false);

  // Add to waitlist modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [clientSearch, setClientSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState({
    service_id: '',
    provider_id: '',
    preferred_days: [] as string[],
    preferred_time: 'any',
    notes: '',
    card_on_file: false,
    priority: 'normal',
  });
  const [saving, setSaving] = useState(false);

  const fetchWaitlist = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') params.append('status', filter);
      
      const res = await fetch(`/api/waitlist?${params}`);
      const data = await res.json();
      setEntries(data.entries || []);
      setStats(data.stats || { total: 0, waiting: 0, contacted: 0, booked: 0 });
    } catch (err) {
      console.error('Failed to fetch waitlist:', err);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchWaitlist();
  }, [fetchWaitlist]);

  const fetchVipEntries = useCallback(async () => {
    setVipLoading(true);
    try {
      const res = await fetch('/api/vip-waitlist?campaign=all');
      const data = await res.json();
      setVipEntries(data.entries || []);
    } catch (err) {
      console.error('Failed to fetch VIP waitlist:', err);
    } finally {
      setVipLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'vip') fetchVipEntries();
  }, [activeTab, fetchVipEntries]);

  const updateVipStatus = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/vip-waitlist', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) fetchVipEntries();
    } catch (err) {
      console.error('Failed to update VIP status:', err);
    }
  };

  // Fetch clients for modal
  const fetchClients = async (search: string) => {
    try {
      const res = await fetch(`/api/clients?search=${encodeURIComponent(search)}&limit=20`);
      const data = await res.json();
      setClients(data.clients || []);
    } catch (err) {
      console.error('Failed to fetch clients:', err);
    }
  };

  // Fetch services and providers on modal open
  useEffect(() => {
    if (showAddModal) {
      fetch('/api/services').then(r => r.json()).then(d => {
        const svcList = (d.services || d || []).map((s: any) => ({ id: s.id, name: s.name }));
        setServices(svcList);
      });
      fetch('/api/providers').then(r => r.json()).then(d => {
        const provList = (d.providers || d || []).map((p: any) => ({
          id: p.id,
          name: p.users ? `${p.users.first_name} ${p.users.last_name}` : p.name || 'Provider'
        }));
        setProviders(provList);
      });
    }
  }, [showAddModal]);

  const handleAddToWaitlist = async () => {
    if (!selectedClient) return;
    
    setSaving(true);
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: selectedClient.id,
          ...formData,
        }),
      });

      if (res.ok) {
        setShowAddModal(false);
        setSelectedClient(null);
        setFormData({
          service_id: '',
          provider_id: '',
          preferred_days: [],
          preferred_time: 'any',
          notes: '',
          card_on_file: false,
          priority: 'normal',
        });
        fetchWaitlist();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to add to waitlist');
      }
    } catch (err) {
      console.error('Add to waitlist error:', err);
      alert('Failed to add to waitlist');
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/waitlist', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (res.ok) {
        fetchWaitlist();
      }
    } catch (err) {
      console.error('Update status error:', err);
    }
  };

  const removeFromWaitlist = async (id: string) => {
    if (!confirm('Remove this patient from the waitlist?')) return;
    
    try {
      const res = await fetch(`/api/waitlist?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchWaitlist();
      }
    } catch (err) {
      console.error('Remove error:', err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'waiting':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">Waiting</span>;
      case 'contacted':
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Contacted</span>;
      case 'booked':
        return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Booked</span>;
      case 'expired':
        return <span className="px-3 py-1 bg-white text-black rounded-full text-xs font-medium">Expired</span>;
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'vip':
        return <span className="px-2 py-0.5 bg-pink-100 text-pink-700 rounded text-xs font-medium">VIP</span>;
      case 'high':
        return <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs font-medium">High</span>;
      default:
        return null;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getTimeAgo = (dateStr: string) => {
    const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black flex items-center gap-3">
            <span className="text-3xl">📋</span>
            Waitlist Management
          </h1>
          <p className="text-black mt-1">Turn cancellations into conversions · VIP & Trifecta signups</p>
        </div>
        {activeTab === 'slots' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 bg-[#FF2D8E] text-white rounded-xl hover:bg-black transition-colors font-medium flex items-center gap-2"
          >
            <span>+</span> Add to Waitlist
          </button>
        )}
      </div>

      {/* Tabs: Slot waitlist | VIP & Trifecta */}
      <div className="flex items-center gap-2 mb-6 border-b border-black pb-2">
        <button
          onClick={() => setActiveTab('slots')}
          className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${
            activeTab === 'slots' ? 'bg-[#FF2D8E] text-white' : 'bg-white text-black hover:bg-white'
          }`}
        >
          Slot waitlist
        </button>
        <button
          onClick={() => setActiveTab('vip')}
          className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${
            activeTab === 'vip' ? 'bg-[#FF2D8E] text-white' : 'bg-white text-black hover:bg-white'
          }`}
        >
          VIP & Trifecta signups
        </button>
      </div>

      {activeTab === 'vip' ? (
        /* VIP & Trifecta signups (from vip-skin-tightening, solaria-co2-vip, etc.) */
        <div className="space-y-4">
          <p className="text-black text-sm">People who signed up for VIP Skin Tightening (Quantum/Morpheus8) or Solaria CO₂ VIP. Manage status and follow up here.</p>
          {vipLoading ? (
            <div className="bg-white rounded-xl border border-black p-8">
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-14 bg-white rounded-lg" />
                ))}
              </div>
            </div>
          ) : vipEntries.length === 0 ? (
            <div className="bg-white rounded-xl border border-black p-12 text-center">
              <span className="text-5xl">💎</span>
              <h3 className="text-lg font-semibold text-black mt-4">No VIP / Trifecta signups yet</h3>
              <p className="text-black mt-2 text-sm">Signups from the VIP Skin Tightening and Solaria CO₂ VIP pages will appear here.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-black overflow-hidden">
              <table className="w-full">
                <thead className="bg-white border-b border-black">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-black uppercase">Name</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-black uppercase">Contact</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-black uppercase">Campaign</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-black uppercase">Added</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-black uppercase">Status</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-black uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black">
                  {vipEntries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-white">
                      <td className="px-4 py-3">
                        <p className="font-medium text-black">{entry.name}</p>
                        {entry.qualification_data?.section && (
                          <p className="text-xs text-black capitalize">{entry.qualification_data.section}</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-black text-sm">{entry.email}</p>
                        {entry.phone && <p className="text-black text-sm">{entry.phone}</p>}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-black">
                          {VIP_CAMPAIGN_LABELS[entry.campaign] || entry.campaign}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-black">
                        {formatDate(entry.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          VIP_STATUS_OPTIONS.find((s) => s.value === entry.status)?.color || 'bg-gray-100 text-gray-800'
                        }`}>
                          {VIP_STATUS_OPTIONS.find((s) => s.value === entry.status)?.label || entry.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <select
                          value={entry.status}
                          onChange={(e) => updateVipStatus(entry.id, e.target.value)}
                          className="text-sm border border-black rounded-lg px-2 py-1 bg-white text-black"
                        >
                          {VIP_STATUS_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                          ))}
                        </select>
                        <Link
                          href={`/admin/appointments/new?email=${encodeURIComponent(entry.email)}`}
                          className="ml-2 inline-block text-sm text-[#FF2D8E] hover:underline"
                        >
                          Book
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-black p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-black">Total on Waitlist</p>
              <p className="text-3xl font-bold text-black mt-1">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <span className="text-2xl">📋</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-black p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-black">Waiting</p>
              <p className="text-3xl font-bold text-yellow-600 mt-1">{stats.waiting}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">⏳</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-black p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-black">Contacted</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">{stats.contacted}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📞</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-black p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-black">Converted to Bookings</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{stats.booked}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6">
        {(['all', 'waiting', 'contacted', 'booked'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              filter === f
                ? 'bg-[#FF2D8E] text-white'
                : 'bg-white text-black hover:bg-white'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Waitlist Table */}
      {loading ? (
        <div className="bg-white rounded-xl border border-black p-8">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-white rounded-lg" />
            ))}
          </div>
        </div>
      ) : entries.length === 0 ? (
        <div className="bg-white rounded-xl border border-black p-16 text-center">
          <span className="text-6xl">📋</span>
          <h3 className="text-xl font-semibold text-black mt-4">No patients on waitlist</h3>
          <p className="text-black mt-2">Add patients to the waitlist when schedules are full</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-6 px-6 py-3 bg-[#FF2D8E] text-white rounded-xl hover:bg-black transition-colors font-medium"
          >
            Add First Patient
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-black overflow-hidden">
          <table className="w-full">
            <thead className="bg-white border-b border-black">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-black uppercase tracking-wider">Patient</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-black uppercase tracking-wider">Service</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-black uppercase tracking-wider">Preferences</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-black uppercase tracking-wider">Added</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-black uppercase tracking-wider">Status</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-black uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black">
              {entries.map((entry) => (
                <tr key={entry.id} className="hover:bg-white">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-semibold">
                        {entry.client_name?.split(' ').map(n => n[0]).join('') || '?'}
                      </div>
                      <div>
                        <p className="font-medium text-black flex items-center gap-2">
                          {entry.client_name}
                          {getPriorityBadge(entry.priority)}
                          {entry.card_on_file && (
                            <span className="text-green-500 text-sm" title="Card on file">💳</span>
                          )}
                        </p>
                        <p className="text-sm text-black">{entry.client_phone || entry.client_email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-black">{entry.service_name || 'Any service'}</p>
                    {entry.provider_name && (
                      <p className="text-sm text-black">with {entry.provider_name}</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {entry.preferred_days?.map(day => (
                        <span key={day} className="px-2 py-0.5 bg-white rounded text-xs text-black capitalize">
                          {day.slice(0, 3)}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-black mt-1 capitalize">
                      {entry.preferred_time === 'any' ? 'Any time' : entry.preferred_time}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-black">{formatDate(entry.created_at)}</p>
                    <p className="text-xs text-black">{getTimeAgo(entry.created_at)}</p>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(entry.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {entry.status === 'waiting' && (
                        <>
                          <button
                            onClick={() => updateStatus(entry.id, 'contacted')}
                            className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                          >
                            Mark Contacted
                          </button>
                          <Link
                            href={`/admin/appointments/new?client_id=${entry.client_id}&service_id=${entry.service_id || ''}`}
                            className="px-3 py-1.5 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                          >
                            Book Now
                          </Link>
                        </>
                      )}
                      {entry.status === 'contacted' && (
                        <Link
                          href={`/admin/appointments/new?client_id=${entry.client_id}&service_id=${entry.service_id || ''}`}
                          onClick={() => updateStatus(entry.id, 'booked')}
                          className="px-3 py-1.5 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        >
                          Convert to Booking
                        </Link>
                      )}
                      <button
                        onClick={() => removeFromWaitlist(entry.id)}
                        className="p-1.5 text-black hover:text-red-500 transition-colors"
                      >
                        <span>🗑</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

        </>
      )}

      {/* Add to Waitlist Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-black">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-black">Add to Waitlist</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-black hover:text-black"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Client Selection */}
              {!selectedClient ? (
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Search Patient
                  </label>
                  <input
                    type="text"
                    value={clientSearch}
                    onChange={(e) => {
                      setClientSearch(e.target.value);
                      if (e.target.value.length >= 2) {
                        fetchClients(e.target.value);
                      }
                    }}
                    placeholder="Search by name or phone..."
                    className="w-full px-4 py-2 border border-black rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-[#FF2D8E]"
                  />
                  {clients.length > 0 && clientSearch.length >= 2 && (
                    <div className="mt-2 border border-black rounded-xl max-h-48 overflow-y-auto">
                      {clients.map((client) => (
                        <button
                          key={client.id}
                          onClick={() => setSelectedClient(client)}
                          className="w-full p-3 text-left hover:bg-pink-50 border-b border-black last:border-0"
                        >
                          <p className="font-medium text-black">
                            {client.first_name} {client.last_name}
                          </p>
                          <p className="text-sm text-black">{client.phone || client.email}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-pink-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#FF2D8E] rounded-full flex items-center justify-center text-white font-semibold">
                      {selectedClient.first_name?.[0]}{selectedClient.last_name?.[0]}
                    </div>
                    <div>
                      <p className="font-medium text-black">
                        {selectedClient.first_name} {selectedClient.last_name}
                      </p>
                      <p className="text-sm text-black">{selectedClient.phone}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedClient(null)}
                    className="text-pink-600 hover:text-pink-700 text-sm"
                  >
                    Change
                  </button>
                </div>
              )}

              {/* Service Selection */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Requested Service (Optional)
                </label>
                <select
                  value={formData.service_id}
                  onChange={(e) => setFormData({ ...formData, service_id: e.target.value })}
                  className="w-full px-4 py-2 border border-black rounded-xl focus:ring-2 focus:ring-pink-500"
                >
                  <option value="">Any service</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              {/* Provider Selection */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Preferred Provider (Optional)
                </label>
                <select
                  value={formData.provider_id}
                  onChange={(e) => setFormData({ ...formData, provider_id: e.target.value })}
                  className="w-full px-4 py-2 border border-black rounded-xl focus:ring-2 focus:ring-pink-500"
                >
                  <option value="">Any provider</option>
                  {providers.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              {/* Preferred Days */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Preferred Days
                </label>
                <div className="flex flex-wrap gap-2">
                  {DAYS_OF_WEEK.map((day) => (
                    <button
                      key={day.id}
                      type="button"
                      onClick={() => {
                        const days = formData.preferred_days.includes(day.id)
                          ? formData.preferred_days.filter(d => d !== day.id)
                          : [...formData.preferred_days, day.id];
                        setFormData({ ...formData, preferred_days: days });
                      }}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        formData.preferred_days.includes(day.id)
                          ? 'bg-[#FF2D8E] text-white'
                          : 'bg-white text-black hover:bg-white'
                      }`}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preferred Time */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Preferred Time
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {TIME_PREFERENCES.map((time) => (
                    <button
                      key={time.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, preferred_time: time.id })}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        formData.preferred_time === time.id
                          ? 'bg-[#FF2D8E] text-white'
                          : 'bg-white text-black hover:bg-white'
                      }`}
                    >
                      {time.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Priority
                </label>
                <div className="flex gap-2">
                  {[
                    { id: 'normal', label: 'Normal' },
                    { id: 'high', label: 'High' },
                    { id: 'vip', label: 'VIP' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, priority: p.id })}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        formData.priority === p.id
                          ? p.id === 'vip' ? 'bg-[#FF2D8E] text-white' :
                            p.id === 'high' ? 'bg-orange-500 text-white' :
                            'bg-black text-white'
                          : 'bg-white text-black hover:bg-white'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Card on File */}
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.card_on_file}
                  onChange={(e) => setFormData({ ...formData, card_on_file: e.target.checked })}
                  className="w-5 h-5 rounded border-black text-[#FF2D8E] focus:ring-pink-500"
                />
                <span className="text-sm text-black">Card on file (secures slot if available)</span>
              </label>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any additional notes..."
                  rows={3}
                  className="w-full px-4 py-2 border border-black rounded-xl focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>

            <div className="p-6 border-t border-black flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-black hover:text-black"
              >
                Cancel
              </button>
              <button
                onClick={handleAddToWaitlist}
                disabled={!selectedClient || saving}
                className="px-6 py-2 bg-[#FF2D8E] text-white rounded-xl hover:bg-black transition-colors font-medium disabled:opacity-50"
              >
                {saving ? 'Adding...' : 'Add to Waitlist'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Tips */}
      <div className="mt-8 bg-pink-50 border border-pink-100 rounded-xl p-6">
        <h3 className="font-semibold text-pink-900 mb-3">Waitlist Tips</h3>
        <ul className="space-y-2 text-sm text-pink-800">
          <li>• Add patients when schedules are full but they want to get in</li>
          <li>• Capture card on file to secure the slot when available</li>
          <li>• Use preferences to quickly match cancellations to waitlist patients</li>
          <li>• Mark as "Contacted" when you reach out, "Booked" when scheduled</li>
          <li>• VIP priority patients should be contacted first for openings</li>
        </ul>
      </div>
    </div>
  );
}
