'use client';

// ============================================================
// BOULEVARD-STYLE CALENDAR
// Multi-provider schedule view with appointment detail panel
// Interactive - click to book appointments
// ============================================================

import { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/Toast';

// Provider colors - soft pastels like Boulevard
const PROVIDER_COLORS = [
  { bg: 'bg-pink-100', border: 'border-l-pink-400', text: 'text-pink-900', accent: 'bg-pink-400' },
  { bg: 'bg-sky-100', border: 'border-l-sky-400', text: 'text-sky-900', accent: 'bg-sky-400' },
  { bg: 'bg-amber-100', border: 'border-l-amber-400', text: 'text-amber-900', accent: 'bg-amber-400' },
  { bg: 'bg-emerald-100', border: 'border-l-emerald-400', text: 'text-emerald-900', accent: 'bg-emerald-400' },
  { bg: 'bg-violet-100', border: 'border-l-violet-400', text: 'text-violet-900', accent: 'bg-violet-400' },
  { bg: 'bg-rose-100', border: 'border-l-rose-400', text: 'text-rose-900', accent: 'bg-rose-400' },
];

// Fallback providers - always show these
const FALLBACK_PROVIDERS = [
  { id: 'ryan-kent', first_name: 'Ryan', last_name: 'Kent', credentials: 'FNP-BC', color_hex: '#3b82f6' },
  { id: 'danielle-alcala', first_name: 'Danielle', last_name: 'Alcala', credentials: 'RN-S', color_hex: '#ec4899' },
];

// Generate time slots (9 AM to 6 PM)
const TIME_SLOTS = Array.from({ length: 19 }, (_, i) => {
  const hour = Math.floor(i / 2) + 9;
  const minute = i % 2 === 0 ? '00' : '30';
  return { time: `${hour.toString().padStart(2, '0')}:${minute}`, hour, minute: minute === '00' ? 0 : 30 };
});

const HOUR_LABELS = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

export default function CalendarPage() {
  const router = useRouter();
  const toast = useToast();
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProviderFilter, setSelectedProviderFilter] = useState<string[]>([]);
  
  // Quick book modal state
  const [showQuickBook, setShowQuickBook] = useState(false);
  const [quickBookSlot, setQuickBookSlot] = useState<{ time: string; providerId: string; providerName: string } | null>(null);
  const [quickBookClient, setQuickBookClient] = useState('');
  const [quickBookService, setQuickBookService] = useState('');
  const [clientSearchResults, setClientSearchResults] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  
  // API data
  const [appointments, setAppointments] = useState<any[]>([]);
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const dateString = selectedDate.toISOString().split('T')[0];

  // Fetch appointments
  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      console.log('[Calendar] Fetching appointments for date:', dateString);
      const res = await fetch(`/api/appointments?date=${dateString}`);
      const data = await res.json();
      console.log('[Calendar] Received appointments:', data.appointments?.length || 0, data.appointments);
      if (data.appointments) {
        setAppointments(data.appointments);
      }
    } catch (err) {
      console.error('Failed to load appointments:', err);
    } finally {
      setLoading(false);
    }
  }, [dateString]);

  // Fetch providers
  const fetchProviders = useCallback(async () => {
    try {
      const res = await fetch('/api/providers');
      const data = await res.json();
      if (data.providers && data.providers.length > 0) {
        // Filter out providers with no real names
        const validProviders = data.providers.filter((p: any) => 
          p.first_name && p.first_name !== 'Provider'
        );
        setProviders(validProviders.length > 0 ? validProviders : FALLBACK_PROVIDERS);
      } else {
        setProviders(FALLBACK_PROVIDERS);
      }
    } catch (err) {
      console.error('Failed to load providers:', err);
      setProviders(FALLBACK_PROVIDERS);
    }
  }, []);

  // Fetch services
  const fetchServices = useCallback(async () => {
    try {
      const res = await fetch('/api/services?active=true');
      const data = await res.json();
      if (data.services) {
        setServices(data.services);
      }
    } catch (err) {
      console.error('Failed to load services:', err);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  useEffect(() => {
    fetchProviders();
    fetchServices();
  }, [fetchProviders, fetchServices]);

  // Search clients
  const searchClients = useCallback(async (query: string) => {
    if (query.length < 2) {
      setClientSearchResults([]);
      return;
    }
    try {
      const res = await fetch(`/api/clients?search=${encodeURIComponent(query)}&limit=5`);
      const data = await res.json();
      setClientSearchResults(data.clients || []);
    } catch (err) {
      console.error('Failed to search clients:', err);
    }
  }, []);

  // Handle slot click - open quick book modal
  const handleSlotClick = (time: string, providerId: string, providerName: string) => {
    setQuickBookSlot({ time, providerId, providerName });
    setQuickBookClient('');
    setQuickBookService('');
    setClientSearchResults([]);
    setShowQuickBook(true);
  };

  // Resolve provider ID - convert string IDs to real UUIDs via lookup
  const resolveProviderId = async (providerId: string): Promise<string> => {
    // Check if already a UUID format
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(providerId);
    if (isUUID) return providerId;
    
    // Find provider by first name from the current providers list
    const provider = providers.find(p => 
      p.id === providerId || 
      `${p.first_name}-${p.last_name}`.toLowerCase().replace(/\s+/g, '-') === providerId.toLowerCase()
    );
    
    // If provider found and has a UUID id, use it
    if (provider?.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(provider.id)) {
      return provider.id;
    }
    
    // Try to lookup provider by name from API
    try {
      const firstName = providerId.split('-')[0];
      const res = await fetch(`/api/providers?search=${encodeURIComponent(firstName)}`);
      const data = await res.json();
      if (data.providers && data.providers.length > 0) {
        const match = data.providers.find((p: any) => 
          p.first_name?.toLowerCase() === firstName?.toLowerCase()
        );
        if (match?.id) return match.id;
        // Return first provider as fallback
        return data.providers[0].id;
      }
    } catch (err) {
      console.error('Provider lookup failed:', err);
    }
    
    // Return original if lookup fails
    return providerId;
  };

  // Create appointment
  const handleQuickBook = async () => {
    if (!quickBookClient || !quickBookService || !quickBookSlot) {
      toast.error('Please select a client and service');
      return;
    }

    setSaving(true);
    try {
      const [hours, minutes] = quickBookSlot.time.split(':').map(Number);
      
      // Build a datetime string that preserves the selected calendar date
      // Format: YYYY-MM-DDTHH:MM:SS (local time, no timezone offset)
      // This ensures the appointment shows on the correct calendar day
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const hourStr = String(hours).padStart(2, '0');
      const minStr = String(minutes).padStart(2, '0');
      const startsAt = `${year}-${month}-${day}T${hourStr}:${minStr}:00`;

      // Resolve provider ID to ensure it's a valid UUID
      const resolvedProviderId = await resolveProviderId(quickBookSlot.providerId);

      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: quickBookClient,
          service_id: quickBookService,
          provider_id: resolvedProviderId,
          starts_at: startsAt,
          status: 'confirmed',
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create appointment');
      }

      toast.success('Appointment booked!');
      setShowQuickBook(false);
      fetchAppointments();
    } catch (err: any) {
      toast.error(err.message || 'Failed to book appointment');
    } finally {
      setSaving(false);
    }
  };

  // Filter providers
  const displayProviders = useMemo(() => {
    if (selectedProviderFilter.length === 0) return providers;
    return providers.filter(p => selectedProviderFilter.includes(p.id));
  }, [providers, selectedProviderFilter]);

  // Get provider color
  const getProviderColor = (providerId: string) => {
    const index = providers.findIndex(p => p.id === providerId);
    return PROVIDER_COLORS[index % PROVIDER_COLORS.length];
  };

  // Format date display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  // Navigate dates
  const navigateDate = (direction: 'prev' | 'next' | 'today') => {
    if (direction === 'today') {
      setSelectedDate(new Date());
      return;
    }
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    setSelectedDate(newDate);
  };

  // Get time display
  const formatTimeDisplay = (hour: number) => {
    if (hour === 12) return '12 PM';
    if (hour > 12) return `${hour - 12} PM`;
    return `${hour} AM`;
  };

  // Get appointment position
  const getAppointmentStyle = (appt: any) => {
    const startTime = new Date(appt.starts_at);
    const startHour = startTime.getHours();
    const startMinute = startTime.getMinutes();
    const startMinutes = (startHour - 9) * 60 + startMinute;
    const duration = appt.duration_minutes || appt.duration || 60;
    
    // 48px per 30 min = 96px per hour
    const top = (startMinutes / 60) * 96;
    const height = (duration / 60) * 96 - 2;
    
    return { top: `${top}px`, height: `${height}px` };
  };

  // Get appointments for a provider
  // Match by ID first, then by provider name as fallback (handles ID mismatch between calendar and DB)
  const getProviderAppointments = (providerId: string, providerFirstName?: string) => {
    return appointments.filter(apt => {
      // Direct ID match
      if (apt.provider_id === providerId) return true;
      
      // Fallback: match by provider_first_name (new field from API)
      if (providerFirstName && apt.provider_first_name) {
        return apt.provider_first_name.toLowerCase() === providerFirstName.toLowerCase();
      }
      
      // Fallback: match by provider name if we have name info
      if (providerFirstName && apt.provider_name) {
        const aptProviderFirst = apt.provider_name.split(' ')[0]?.toLowerCase();
        if (aptProviderFirst === providerFirstName.toLowerCase()) return true;
      }
      
      // Also check nested provider data
      if (providerFirstName && apt.provider?.first_name) {
        return apt.provider.first_name.toLowerCase() === providerFirstName.toLowerCase();
      }
      
      return false;
    });
  };

  // Format time for display
  const formatApptTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  // Get end time
  const getEndTime = (isoString: string, duration: number) => {
    const date = new Date(isoString);
    date.setMinutes(date.getMinutes() + duration);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  // Status display
  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; text: string; label: string }> = {
      confirmed: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Confirmed' },
      checked_in: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Checked In' },
      in_progress: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'In Progress' },
      completed: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Completed' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelled' },
      no_show: { bg: 'bg-red-100', text: 'text-red-700', label: 'No Show' },
    };
    const style = styles[status] || styles.confirmed;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${status === 'checked_in' ? 'bg-amber-500' : status === 'confirmed' ? 'bg-emerald-500' : 'bg-gray-500'}`} />
        {style.label}
      </span>
    );
  };

  return (
    <div className="h-[calc(100vh-120px)] flex bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
      {/* Main Calendar Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateDate('today')}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              TODAY
            </button>
            <div className="flex items-center gap-1">
              <button
                onClick={() => navigateDate('prev')}
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => navigateDate('next')}
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <h2 className="text-lg font-semibold text-slate-800">
              {formatDate(selectedDate)}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Filters */}
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                FILTERS
              </button>
              {showFilters && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 z-50 p-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Providers</p>
                  <div className="space-y-2">
                    {providers.map((provider, idx) => (
                      <label key={provider.id} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedProviderFilter.length === 0 || selectedProviderFilter.includes(provider.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              if (selectedProviderFilter.length === providers.length - 1) {
                                setSelectedProviderFilter([]);
                              } else {
                                setSelectedProviderFilter([...selectedProviderFilter, provider.id]);
                              }
                            } else {
                              setSelectedProviderFilter(selectedProviderFilter.filter(id => id !== provider.id));
                            }
                          }}
                          className="w-4 h-4 rounded border-gray-300 text-pink-500 focus:ring-pink-500"
                        />
                        <div className={`w-3 h-3 rounded-full ${PROVIDER_COLORS[idx % PROVIDER_COLORS.length].accent}`} />
                        <span className="text-sm text-gray-700">{provider.first_name} {provider.last_name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* View Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('day')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                  viewMode === 'day'
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                DAY
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                  viewMode === 'week'
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                WEEK
              </button>
            </div>
          </div>
        </div>

        {/* Provider Headers */}
        <div className="flex border-b border-gray-200 bg-gray-50/50">
          {/* Time column spacer */}
          <div className="w-16 flex-shrink-0" />
          
          {/* Provider columns */}
          {displayProviders.map((provider, idx) => {
            const color = PROVIDER_COLORS[providers.findIndex(p => p.id === provider.id) % PROVIDER_COLORS.length];
            return (
              <div
                key={provider.id}
                className="flex-1 px-3 py-3 border-l border-gray-200 min-w-[180px]"
              >
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-full ${color.accent} flex items-center justify-center text-white font-medium text-sm shadow-sm`}>
                    {provider.first_name?.[0]}{provider.last_name?.[0]}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-800">
                      {provider.first_name}
                    </span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full" />
            </div>
          ) : (
            <div className="flex min-h-full">
              {/* Time labels */}
              <div className="w-16 flex-shrink-0 border-r border-gray-200">
                {HOUR_LABELS.map((hour) => (
                  <div key={hour} className="h-24 relative">
                    <span className="absolute -top-2.5 right-3 text-xs text-gray-500 font-medium">
                      {formatTimeDisplay(hour)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Provider columns */}
              {displayProviders.map((provider) => {
                const providerAppts = getProviderAppointments(provider.id, provider.first_name);
                const color = getProviderColor(provider.id);
                const providerName = `${provider.first_name} ${provider.last_name}`;
                
                return (
                  <div
                    key={provider.id}
                    className="flex-1 border-l border-gray-200 relative min-w-[180px]"
                  >
                    {/* Clickable hour slots */}
                    {HOUR_LABELS.map((hour) => (
                      <div key={hour} className="h-24 border-b border-gray-100 relative">
                        {/* First 30 min */}
                        <div 
                          className="absolute inset-x-0 top-0 h-12 cursor-pointer hover:bg-pink-50/50 transition-colors group"
                          onClick={() => handleSlotClick(`${hour.toString().padStart(2, '0')}:00`, provider.id, providerName)}
                        >
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-xs text-pink-500 font-medium bg-white/80 px-2 py-1 rounded">+ Book</span>
                          </div>
                        </div>
                        {/* Second 30 min */}
                        <div 
                          className="absolute inset-x-0 bottom-0 h-12 cursor-pointer hover:bg-pink-50/50 transition-colors group"
                          onClick={() => handleSlotClick(`${hour.toString().padStart(2, '0')}:30`, provider.id, providerName)}
                        >
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-xs text-pink-500 font-medium bg-white/80 px-2 py-1 rounded">+ Book</span>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Appointments - positioned above slots */}
                    {providerAppts.map((appt) => {
                      const style = getAppointmentStyle(appt);
                      const isSelected = selectedAppointment?.id === appt.id;
                      
                      return (
                        <button
                          key={appt.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAppointment(appt);
                          }}
                          className={`absolute left-1 right-1 rounded-lg border-l-4 p-2 text-left transition-all overflow-hidden ${color.bg} ${color.border} ${color.text} ${
                            isSelected ? 'ring-2 ring-slate-400 shadow-lg z-20' : 'hover:shadow-md z-10'
                          }`}
                          style={style}
                        >
                          <p className="font-semibold text-xs uppercase tracking-wide truncate">
                            {appt.service_name || 'Appointment'}
                          </p>
                          <p className="font-medium text-sm mt-0.5 truncate">
                            {appt.client_name || 'Client'}
                          </p>
                          <p className="text-xs opacity-75 mt-0.5">
                            {formatApptTime(appt.starts_at)} - {getEndTime(appt.starts_at, appt.duration_minutes || appt.duration || 60)}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Appointment Detail */}
      <div className="w-80 border-l border-gray-200 bg-white flex flex-col">
        {selectedAppointment ? (
          <>
            {/* Panel Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-slate-800">Appointment</h3>
              <div className="flex items-center gap-2">
                <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
                <button 
                  onClick={() => setSelectedAppointment(null)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Status & Checkout */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              {getStatusBadge(selectedAppointment.status)}
              <Link
                href={`/pos?appointment=${selectedAppointment.id}`}
                className="px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors"
              >
                CHECKOUT
              </Link>
            </div>

            {/* Date/Time */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">On</span>
                <span className="text-slate-800 font-medium">
                  {new Date(selectedAppointment.starts_at).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-gray-500">At</span>
                <span className="text-slate-800 font-medium">
                  {formatApptTime(selectedAppointment.starts_at)}
                </span>
              </div>
            </div>

            {/* Client Info */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white font-semibold text-lg">
                  {selectedAppointment.client_name?.[0] || 'C'}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-800">
                    {selectedAppointment.client_name || 'Client'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Client since {new Date().getFullYear()}
                  </p>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </button>
              </div>

              {/* Membership Badge */}
              <div className="mt-4 p-3 bg-gray-50 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-purple-500">👑</span>
                  <div>
                    <p className="text-sm font-medium text-slate-800">Radiance Membership</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Active
                    </p>
                  </div>
                </div>
                <button className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>

              <button className="mt-3 text-sm text-pink-600 hover:text-pink-700 font-medium">
                Show additional client info
              </button>
            </div>

            {/* Service Details */}
            <div className="p-4 flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800">
                    {selectedAppointment.service_name || 'Service'}
                  </p>
                </div>
                <p className="text-lg font-bold text-slate-800">
                  ${selectedAppointment.service_price || selectedAppointment.service?.price || 0}
                </p>
              </div>
              
              <div className="mt-3 text-sm text-gray-600 space-y-1">
                <p>
                  <span className="text-gray-500">with</span>{' '}
                  <span className="font-medium">{selectedAppointment.provider_name || 'Provider'}</span>
                  <span className="text-gray-500 ml-3">request: none</span>
                </p>
                <p>
                  <span className="text-gray-500">at</span>{' '}
                  <span className="font-medium">{formatApptTime(selectedAppointment.starts_at)}</span>
                  <span className="text-gray-500 ml-3">for: {selectedAppointment.duration_minutes || selectedAppointment.duration || 60} min</span>
                </p>
              </div>
            </div>

            {/* Booking Details */}
            <div className="p-4 border-t border-gray-200">
              <button className="text-sm text-gray-500 hover:text-gray-700 font-medium flex items-center gap-1">
                Booking Details
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8 text-center">
            <div>
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">Select an appointment</p>
              <p className="text-sm text-gray-400 mt-1">Click on any appointment to view details</p>
              <p className="text-sm text-gray-400 mt-1">or click empty time slot to book</p>
            </div>
          </div>
        )}
      </div>

      {/* Quick Book Modal */}
      {showQuickBook && quickBookSlot && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Quick Book</h2>
                  <p className="text-gray-500 mt-1">
                    {quickBookSlot.time} with {quickBookSlot.providerName}
                  </p>
                  <p className="text-sm text-gray-400">
                    {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <button
                  onClick={() => setShowQuickBook(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Client Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Client *</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search client by name..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    onChange={(e) => searchClients(e.target.value)}
                  />
                  {clientSearchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-10 max-h-48 overflow-y-auto">
                      {clientSearchResults.map((client) => (
                        <button
                          key={client.id}
                          type="button"
                          onClick={() => {
                            setQuickBookClient(client.id);
                            setClientSearchResults([]);
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 last:border-0"
                        >
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white font-medium">
                            {client.first_name?.[0]}{client.last_name?.[0]}
                          </div>
                          <div>
                            <p className="font-medium text-slate-800">{client.first_name} {client.last_name}</p>
                            <p className="text-sm text-gray-500">{client.email}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {quickBookClient && (
                  <p className="text-sm text-emerald-600 mt-2 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Client selected
                  </p>
                )}
              </div>

              {/* Service Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service *</label>
                <select 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white"
                  value={quickBookService}
                  onChange={(e) => setQuickBookService(e.target.value)}
                >
                  <option value="">Select service...</option>
                  {services.map(service => (
                    <option key={service.id} value={service.id}>
                      {service.name} - ${service.price_cents ? (service.price_cents / 100).toFixed(0) : (service.price || 0)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-between">
              <button
                onClick={() => setShowQuickBook(false)}
                className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <div className="flex gap-2">
                <Link
                  href={`/admin/appointments/new?provider=${quickBookSlot?.providerId}&date=${dateString}&time=${encodeURIComponent(quickBookSlot?.time || '')}`}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200"
                  onClick={() => setShowQuickBook(false)}
                >
                  Full Form
                </Link>
                <button
                  onClick={handleQuickBook}
                  disabled={saving || !quickBookClient || !quickBookService}
                  className="px-6 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium rounded-lg hover:from-pink-600 hover:to-rose-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {saving ? 'Booking...' : 'Book Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
