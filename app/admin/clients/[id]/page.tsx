'use client';

// ============================================================
// CLIENT PROFILE - Fresha-Style Design
// Dark sidebar, comprehensive tabs, click-to-action
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-700 rounded ${className}`} />;
}

export default function ClientProfilePage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Data states
  const [appointments, setAppointments] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [loadingExtra, setLoadingExtra] = useState(true);
  
  // UI states
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const [showPhoneMenu, setShowPhoneMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [editForm, setEditForm] = useState<any>({});

  // Fetch client
  const fetchClient = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/clients?id=${params.id}`);
      const data = await res.json();
      if (data.client) {
        setClient(data.client);
      } else {
        setError('Client not found');
      }
    } catch (err) {
      setError('Failed to load client');
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  // Fetch appointments
  const fetchAppointments = useCallback(async () => {
    try {
      const res = await fetch(`/api/appointments?client_id=${params.id}`);
      const data = await res.json();
      if (data.appointments) {
        setAppointments(data.appointments.sort((a: any, b: any) => 
          new Date(b.starts_at).getTime() - new Date(a.starts_at).getTime()
        ));
      }
    } catch (err) {
      console.error('Failed to load appointments:', err);
    }
  }, [params.id]);

  // Fetch sales/transactions
  const fetchSales = useCallback(async () => {
    try {
      const res = await fetch(`/api/transactions?client_id=${params.id}`);
      const data = await res.json();
      if (data.transactions) {
        setSales(data.transactions);
      }
    } catch (err) {
      console.error('Failed to load sales:', err);
    } finally {
      setLoadingExtra(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchClient();
    fetchAppointments();
    fetchSales();
  }, [fetchClient, fetchAppointments, fetchSales]);

  // Helpers
  const formatDate = (isoString: string | null) => {
    if (!isoString) return '-';
    return new Date(isoString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatMoney = (cents: number) => {
    return `$${(cents / 100).toLocaleString()}`;
  };

  // Group appointments by month
  const groupedAppointments = appointments.reduce((groups: any, apt) => {
    const date = new Date(apt.starts_at);
    const now = new Date();
    const isUpcoming = date > now;
    const monthYear = isUpcoming ? 'Upcoming' : date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    if (!groups[monthYear]) groups[monthYear] = [];
    groups[monthYear].push(apt);
    return groups;
  }, {});

  // Calculate stats
  const stats = {
    totalSales: client?.total_spent || 0,
    appointments: appointments.length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
    noShows: appointments.filter(a => a.status === 'no_show').length,
    balance: 0, // Would come from wallet/credits
    rating: 4.9, // Would come from reviews
  };

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setShowPhoneMenu(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-120px)]">
        <div className="w-80 bg-[#1a1a1a] p-6">
          <Skeleton className="w-24 h-24 rounded-full mx-auto mb-4" />
          <Skeleton className="w-40 h-6 mx-auto mb-2" />
          <Skeleton className="w-32 h-4 mx-auto" />
        </div>
        <div className="flex-1 p-6">
          <Skeleton className="w-64 h-8 mb-4" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">{error || 'Client not found'}</p>
        <Link href="/admin/clients" className="text-pink-600 hover:text-pink-700">← Back to Clients</Link>
      </div>
    );
  }

  // Sidebar tabs
  const TABS = [
    { id: 'overview', label: 'Overview' },
    { id: 'appointments', label: 'Appointments', count: appointments.length },
    { id: 'sales', label: 'Sales', count: sales.length, dot: true },
    { id: 'details', label: 'Client details' },
    { id: 'items', label: 'Items', count: appointments.length },
    { id: 'documents', label: 'Documents' },
    { id: 'wallet', label: 'Wallet' },
    { id: 'loyalty', label: 'Loyalty' },
    { id: 'reviews', label: 'Reviews', count: 15 },
  ];

  return (
    <div className="flex min-h-[calc(100vh-120px)] -m-6">
      {/* Left Sidebar - Dark Theme */}
      <div className="w-80 bg-[#1a1a1a] text-white flex flex-col">
        {/* Client Header */}
        <div className="p-6 text-center border-b border-gray-800">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 mx-auto mb-4 flex items-center justify-center text-3xl font-bold">
            {client.first_name?.[0]}{client.last_name?.[0]}
          </div>
          
          {/* Name */}
          <h1 className="text-xl font-bold text-white mb-1">
            {client.first_name} {client.last_name}
          </h1>
          
          {/* Email */}
          <p className="text-gray-400 text-sm mb-1">{client.email}</p>
          
          {/* Phone - Clickable */}
          <div className="relative inline-block">
            <button
              onClick={() => setShowPhoneMenu(!showPhoneMenu)}
              className="text-gray-400 text-sm hover:text-white transition-colors"
            >
              {client.phone || 'No phone'}
            </button>
            
            {/* Phone dropdown */}
            {showPhoneMenu && client.phone && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-[#2a2a2a] rounded-lg shadow-xl z-50 py-2">
                <a
                  href={`tel:${client.phone}`}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700 text-white text-sm"
                >
                  <span>📞</span> Call phone
                </a>
                <Link
                  href={`/admin/sms?phone=${client.phone}&client=${client.id}`}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700 text-white text-sm"
                >
                  <span>💬</span> Send message
                </Link>
                <button
                  onClick={() => copyToClipboard(client.phone)}
                  className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-700 text-white text-sm text-left"
                >
                  <span>📋</span> Copy phone
                </button>
              </div>
            )}
          </div>
          
          {/* Unpaid Balance Badge */}
          {stats.balance > 0 && (
            <div className="mt-3">
              <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm font-medium">
                ${stats.balance} Unpaid
              </span>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {/* Actions Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowActionsMenu(!showActionsMenu)}
                className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#333] text-white rounded-full text-sm font-medium flex items-center gap-2"
              >
                Actions
                <span className="text-xs">{showActionsMenu ? '▲' : '▼'}</span>
              </button>
              
              {showActionsMenu && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-[#2a2a2a] rounded-lg shadow-xl z-50 py-2">
                  <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-700 text-white text-sm text-left">
                    <span>🔄</span> Remove client
                  </button>
                  <div className="border-t border-gray-700 my-2" />
                  <p className="px-4 py-1 text-xs text-gray-500 font-semibold">Quick actions</p>
                  <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-700 text-white text-sm text-left">
                    <span>🔔</span> Add staff alert
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-700 text-white text-sm text-left">
                    <span>⚠️</span> Add allergy
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-700 text-white text-sm text-left">
                    <span>🧪</span> Add patch test
                  </button>
                  <div className="border-t border-gray-700 my-2" />
                  <button
                    onClick={() => { setShowActionsMenu(false); setShowEditModal(true); }}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-700 text-white text-sm text-left"
                  >
                    Edit client details
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-700 text-white text-sm text-left">
                    Block client
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-700 text-red-400 text-sm text-left">
                    Delete client
                  </button>
                </div>
              )}
            </div>
            
            <Link
              href={`/admin/appointments/new?client=${client.id}`}
              className="px-4 py-2 bg-white text-gray-900 hover:bg-gray-100 rounded-full text-sm font-medium"
            >
              Book now
            </Link>
          </div>
        </div>
        
        {/* Client Meta */}
        <div className="p-4 space-y-3 text-sm border-b border-gray-800">
          <button className="flex items-center gap-3 text-gray-400 hover:text-white w-full">
            <span>⚧</span> Add pronouns
          </button>
          <button className="flex items-center gap-3 text-gray-400 hover:text-white w-full">
            <span>🎂</span> {client.date_of_birth ? formatDate(client.date_of_birth) : 'Add date of birth'}
          </button>
          <div className="flex items-center gap-3 text-gray-500">
            <span>📅</span> Created {formatDate(client.created_at)}
          </div>
        </div>
        
        {/* Sidebar Navigation */}
        <nav className="flex-1 py-2">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white border-l-4 border-indigo-400'
                  : 'text-gray-300 hover:bg-gray-800 border-l-4 border-transparent'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`flex items-center gap-1 ${
                  activeTab === tab.id ? 'text-indigo-200' : 'text-gray-500'
                }`}>
                  {tab.dot && <span className="w-2 h-2 bg-amber-500 rounded-full" />}
                  {tab.count > 99 ? '99+' : tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-[#121212] text-white p-6 overflow-y-auto">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Overview</h2>
            
            {/* Wallet */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium">Wallet</h3>
                <Link href={`/admin/clients/${client.id}/wallet`} className="text-blue-400 text-sm hover:underline">
                  View wallet
                </Link>
              </div>
              <div className="bg-[#1e1e1e] rounded-xl p-4 border border-gray-800">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Balance</span>
                  <span className="text-gray-500">ⓘ</span>
                </div>
                <p className="text-3xl font-bold mt-1">${stats.balance}</p>
              </div>
            </div>
            
            {/* Summary */}
            <div>
              <h3 className="text-lg font-medium mb-3">Summary</h3>
              <div className="bg-[#1e1e1e] rounded-xl p-4 border border-gray-800 mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-400">Total sales</span>
                  <span className="text-gray-500">ⓘ</span>
                </div>
                <p className="text-3xl font-bold">${stats.totalSales.toLocaleString()}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#1e1e1e] rounded-xl p-4 border border-gray-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-400">Appointments</span>
                    <span className="text-gray-500">ⓘ</span>
                  </div>
                  <p className="text-2xl font-bold">{stats.appointments}</p>
                </div>
                <div className="bg-[#1e1e1e] rounded-xl p-4 border border-gray-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-400">Rating</span>
                    <span className="text-gray-500">ⓘ</span>
                  </div>
                  <p className="text-2xl font-bold">{stats.rating} ⭐</p>
                </div>
                <div className="bg-[#1e1e1e] rounded-xl p-4 border border-gray-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-400">Canceled</span>
                    <span className="text-gray-500">ⓘ</span>
                  </div>
                  <p className="text-2xl font-bold">{stats.cancelled}</p>
                </div>
                <div className="bg-[#1e1e1e] rounded-xl p-4 border border-gray-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-400">No show</span>
                    <span className="text-gray-500">ⓘ</span>
                  </div>
                  <p className="text-2xl font-bold">{stats.noShows}</p>
                </div>
              </div>
            </div>
            
            {/* Upcoming Appointments */}
            {appointments.filter(a => new Date(a.starts_at) > new Date()).length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-medium">Upcoming appointment</h3>
                  <button onClick={() => setActiveTab('appointments')} className="text-blue-400 text-sm hover:underline">
                    View all
                  </button>
                </div>
                {appointments.filter(a => new Date(a.starts_at) > new Date()).slice(0, 1).map(apt => (
                  <div key={apt.id} className="bg-[#1e1e1e] rounded-xl p-4 border border-gray-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Appointment</span>
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                        {apt.status || 'Booked'}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-3">
                      {new Date(apt.starts_at).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })} {new Date(apt.starts_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} • Hello Gorgeous Med Spa
                    </p>
                    <div className="border-t border-gray-700 pt-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{apt.service_name}</p>
                          <p className="text-sm text-gray-400">
                            {new Date(apt.starts_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} • {apt.duration || 60}min • {apt.provider_name || 'Provider'}
                          </p>
                        </div>
                        <p className="font-medium">${apt.service_price || 0}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Link
                        href={`/admin/appointments/${apt.id}`}
                        className="inline-block px-4 py-2 bg-[#2a2a2a] hover:bg-[#333] rounded-full text-sm"
                      >
                        Checkout
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Appointments</h2>
            
            {/* Filters */}
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 bg-white text-gray-900 rounded-full text-sm font-medium">
                All
              </button>
              <button className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#333] text-white rounded-full text-sm">
                Booked
              </button>
              <button className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#333] text-white rounded-full text-sm">
                Confirmed
              </button>
              <button className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#333] text-white rounded-full text-sm flex items-center gap-1">
                More <span className="text-xs">▼</span>
              </button>
            </div>
            
            {/* Timeline */}
            {Object.entries(groupedAppointments).map(([month, apts]: [string, any]) => (
              <div key={month}>
                <h3 className={`text-sm font-semibold mb-4 ${month === 'Upcoming' ? 'text-amber-400' : 'text-gray-400'}`}>
                  {month}
                </h3>
                <div className="space-y-4">
                  {apts.map((apt: any) => (
                    <div key={apt.id} className="flex gap-4">
                      {/* Timeline dot */}
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
                          <span>📅</span>
                        </div>
                        <div className="w-0.5 flex-1 bg-indigo-600/30 mt-2" />
                      </div>
                      
                      {/* Card */}
                      <div className="flex-1 bg-[#1e1e1e] rounded-xl p-4 border border-gray-800 mb-2">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Appointment</span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            apt.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                            apt.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                            'bg-blue-500/20 text-blue-400'
                          }`}>
                            {apt.status || 'Booked'}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm mb-3">
                          {new Date(apt.starts_at).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })} {new Date(apt.starts_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} • Hello Gorgeous Med Spa
                        </p>
                        <div className="border-t border-gray-700 pt-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{apt.service_name}</p>
                              <p className="text-sm text-gray-400">
                                {new Date(apt.starts_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} • {apt.duration || 60}min • {apt.provider_name || 'Provider'}
                              </p>
                            </div>
                            <p className="font-medium">${apt.service_price || 0}</p>
                          </div>
                        </div>
                        {apt.status !== 'completed' && apt.status !== 'cancelled' && (
                          <div className="mt-4">
                            <Link
                              href={`/admin/appointments/${apt.id}`}
                              className="inline-block px-4 py-2 bg-[#2a2a2a] hover:bg-[#333] rounded-full text-sm"
                            >
                              Checkout
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            {appointments.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <p className="mb-4">No appointments yet</p>
                <Link href={`/admin/appointments/new?client=${client.id}`} className="text-pink-400 hover:underline">
                  + Book first appointment
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Sales Tab */}
        {activeTab === 'sales' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Sales</h2>
              <Link href={`/pos?client=${client.id}`} className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#333] rounded-full text-sm">
                Sell
              </Link>
            </div>
            
            {/* Filters */}
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 bg-white text-gray-900 rounded-full text-sm font-medium flex items-center gap-2">
                All <span className="bg-gray-200 text-gray-700 px-1.5 rounded text-xs">{sales.length > 99 ? '99+' : sales.length}</span>
              </button>
              <button className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#333] text-white rounded-full text-sm flex items-center gap-2">
                Paid <span className="text-gray-500">{sales.filter(s => s.status === 'paid').length > 99 ? '99+' : sales.filter(s => s.status === 'paid').length}</span>
              </button>
              <button className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#333] text-white rounded-full text-sm">
                Drafts
              </button>
              <button className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#333] text-white rounded-full text-sm flex items-center gap-1">
                More <span className="text-xs">▼</span>
              </button>
            </div>
            
            {/* Sales List */}
            <div className="space-y-4">
              {sales.map((sale) => (
                <div key={sale.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-[#2a2a2a] flex items-center justify-center">
                      <span>🏷️</span>
                    </div>
                    <div className="w-0.5 flex-1 bg-gray-700 mt-2" />
                  </div>
                  
                  <div className="flex-1 bg-[#1e1e1e] rounded-xl p-4 border border-gray-800 mb-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Sale</span>
                    </div>
                    <p className="text-gray-400 text-sm flex items-center gap-2">
                      {formatDate(sale.created_at)}
                      <span className="text-green-400">• Paid</span>
                    </p>
                    <div className="border-t border-gray-700 pt-3 mt-3">
                      <div className="flex items-center justify-between">
                        <p>{sale.description || 'Service'}</p>
                        <p className="font-medium">${(sale.amount_cents / 100).toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="border-t border-gray-700 pt-3 mt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Total (Incl. charges)</span>
                        <span className="font-bold">${((sale.amount_cents + (sale.tax_cents || 0)) / 100).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {sales.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No sales yet
              </div>
            )}
          </div>
        )}

        {/* Client Details Tab */}
        {activeTab === 'details' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Client details</h2>
              <button
                onClick={() => setShowEditModal(true)}
                className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#333] rounded-full text-sm"
              >
                Edit
              </button>
            </div>
            
            <div className="bg-[#1e1e1e] rounded-xl p-6 border border-gray-800 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">First name</p>
                  <p className="font-medium">{client.first_name || '-'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Last name</p>
                  <p className="font-medium">{client.last_name || '-'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Email</p>
                  <p className="font-medium">{client.email || '-'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Phone</p>
                  <p className="font-medium">{client.phone || '-'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Date of birth</p>
                  <p className="font-medium">{formatDate(client.date_of_birth) || '-'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Gender</p>
                  <p className="font-medium">{client.gender || '-'}</p>
                </div>
              </div>
              
              <div className="border-t border-gray-700 pt-4">
                <p className="text-gray-400 text-sm mb-1">Address</p>
                <p className="font-medium">
                  {client.address_line1 ? (
                    <>
                      {client.address_line1}<br />
                      {client.city}, {client.state} {client.postal_code}
                    </>
                  ) : '-'}
                </p>
              </div>
              
              <div className="border-t border-gray-700 pt-4">
                <p className="text-gray-400 text-sm mb-1">Emergency contact</p>
                <p className="font-medium">{client.emergency_contact_name || '-'}</p>
                {client.emergency_contact_phone && (
                  <p className="text-gray-400">{client.emergency_contact_phone}</p>
                )}
              </div>
              
              {client.allergies_summary && (
                <div className="border-t border-gray-700 pt-4">
                  <p className="text-red-400 text-sm mb-1">⚠️ Allergies</p>
                  <p className="font-medium text-red-300">{client.allergies_summary}</p>
                </div>
              )}
              
              {client.internal_notes && (
                <div className="border-t border-gray-700 pt-4">
                  <p className="text-gray-400 text-sm mb-1">Internal notes</p>
                  <p className="text-gray-300">{client.internal_notes}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Wallet Tab */}
        {activeTab === 'wallet' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Wallet</h2>
            <div className="bg-[#1e1e1e] rounded-xl p-6 border border-gray-800 text-center">
              <p className="text-gray-400 mb-2">Current Balance</p>
              <p className="text-4xl font-bold">${stats.balance}</p>
              <div className="mt-6 flex items-center justify-center gap-4">
                <button className="px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-full font-medium">
                  Add Credit
                </button>
                <Link href={`/admin/clients/${client.id}/wallet`} className="px-6 py-2 bg-[#2a2a2a] hover:bg-[#333] rounded-full">
                  View History
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Loyalty Tab */}
        {activeTab === 'loyalty' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Loyalty</h2>
            <div className="bg-[#1e1e1e] rounded-xl p-6 border border-gray-800 text-center">
              <p className="text-6xl mb-4">💎</p>
              <p className="text-xl font-bold mb-2">Member since {formatDate(client.created_at)}</p>
              <p className="text-gray-400">Total lifetime value: ${stats.totalSales.toLocaleString()}</p>
            </div>
          </div>
        )}

        {/* Other tabs placeholder */}
        {['items', 'documents', 'reviews'].includes(activeTab) && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold capitalize">{activeTab}</h2>
            <div className="bg-[#1e1e1e] rounded-xl p-12 border border-gray-800 text-center text-gray-500">
              <p>Coming soon...</p>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e1e1e] rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Edit Client</h2>
                <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-white text-2xl">×</button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">First Name</label>
                  <input
                    type="text"
                    defaultValue={client.first_name}
                    onChange={(e) => setEditForm({...editForm, first_name: e.target.value})}
                    className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Last Name</label>
                  <input
                    type="text"
                    defaultValue={client.last_name}
                    onChange={(e) => setEditForm({...editForm, last_name: e.target.value})}
                    className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Email</label>
                  <input
                    type="email"
                    defaultValue={client.email}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Phone</label>
                  <input
                    type="tel"
                    defaultValue={client.phone}
                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                    className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">Date of Birth</label>
                <input
                  type="date"
                  defaultValue={client.date_of_birth}
                  onChange={(e) => setEditForm({...editForm, date_of_birth: e.target.value})}
                  className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-pink-500"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">Allergies</label>
                <input
                  type="text"
                  defaultValue={client.allergies_summary}
                  onChange={(e) => setEditForm({...editForm, allergies_summary: e.target.value})}
                  className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-pink-500"
                  placeholder="e.g., Penicillin, latex"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">Internal Notes</label>
                <textarea
                  defaultValue={client.internal_notes}
                  onChange={(e) => setEditForm({...editForm, internal_notes: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-700 flex justify-end gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setEditSaving(true);
                  try {
                    const res = await fetch(`/api/clients/${params.id}`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(editForm),
                    });
                    if (res.ok) {
                      setClient({ ...client, ...editForm });
                      setShowEditModal(false);
                    }
                  } finally {
                    setEditSaving(false);
                  }
                }}
                disabled={editSaving}
                className="px-6 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 disabled:opacity-50"
              >
                {editSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close menus */}
      {(showActionsMenu || showPhoneMenu) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => { setShowActionsMenu(false); setShowPhoneMenu(false); }}
        />
      )}
    </div>
  );
}
