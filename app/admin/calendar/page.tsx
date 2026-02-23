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
import { CalendarNavBar } from '@/components/calendar/CalendarNavBar';
import { DANIELLE_CREDENTIALS, RYAN_CREDENTIALS } from '@/lib/provider-credentials';
import { businessDateTimeToUTC } from '@/lib/business-timezone';
import { fetchWithTimeout } from '@/lib/fetchWithTimeout';

// Provider colors - soft pastels like Boulevard
const PROVIDER_COLORS = [
  { bg: 'bg-pink-100', border: 'border-l-pink-400', text: 'text-pink-900', accent: 'bg-pink-400' },
  { bg: 'bg-sky-100', border: 'border-l-sky-400', text: 'text-sky-900', accent: 'bg-sky-400' },
  { bg: 'bg-amber-100', border: 'border-l-amber-400', text: 'text-amber-900', accent: 'bg-amber-400' },
  { bg: 'bg-emerald-100', border: 'border-l-emerald-400', text: 'text-emerald-900', accent: 'bg-emerald-400' },
  { bg: 'bg-violet-100', border: 'border-l-violet-400', text: 'text-violet-900', accent: 'bg-violet-400' },
  { bg: 'bg-rose-100', border: 'border-l-rose-400', text: 'text-rose-900', accent: 'bg-rose-400' },
];

// Fallback providers - use actual database UUIDs so appointments match!
const FALLBACK_PROVIDERS = [
  { id: '47ab9361-4a68-4ab8-a860-c9c9fd64d26c', first_name: 'Ryan', last_name: 'Kent', credentials: RYAN_CREDENTIALS, color_hex: '#3b82f6' },
  { id: 'b7e6f872-3628-418a-aefb-aca2101f7cb2', first_name: 'Danielle', last_name: 'Alcala', credentials: DANIELLE_CREDENTIALS, color_hex: '#ec4899' },
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
  // Mobile: Fresha-style full-day view — "All" (agenda list) or single provider (one-column timeline)
  const [mobileProviderTab, setMobileProviderTab] = useState<string>('all');
  
  // Quick book modal state
  const [showQuickBook, setShowQuickBook] = useState(false);
  const [quickBookSlot, setQuickBookSlot] = useState<{ time: string; providerId: string; providerName: string } | null>(null);
  const [quickBookClient, setQuickBookClient] = useState('');
  const [quickBookService, setQuickBookService] = useState('');
  const [clientSearchResults, setClientSearchResults] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  
  // New client form state
  const [isNewClient, setIsNewClient] = useState(false);
  const [newClientForm, setNewClientForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
  });
  
  // API data
  const [appointments, setAppointments] = useState<any[]>([]);
  const [providers, setProviders] = useState<any[]>([]);
  const [providerSchedules, setProviderSchedules] = useState<Record<string, { day_of_week: number; is_working: boolean; start_time: string | null; end_time: string | null }[]>>({});
  const [loading, setLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);

  const dateString = selectedDate.toISOString().split('T')[0];

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setDataError(null);
      const res = await fetchWithTimeout(`/api/appointments?date=${dateString}`, { cache: 'no-store' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setDataError(data?.error || 'Failed to load appointments');
        setAppointments([]);
        return;
      }
      if (data.source === 'local') {
        setDataError('Database not connected. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your hosting environment.');
        setAppointments([]);
        return;
      }
      setAppointments(data.appointments ?? []);
    } catch (err) {
      setDataError(err instanceof Error ? err.message : 'Failed to load appointments');
      setAppointments([]);
      console.error('Failed to load appointments:', err);
    } finally {
      setLoading(false);
    }
  }, [dateString]);

  const fetchProviders = useCallback(async () => {
    try {
      const res = await fetchWithTimeout('/api/providers');
      const data = await res.json().catch(() => ({}));
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

  const fetchServices = useCallback(async () => {
    try {
      const res = await fetchWithTimeout('/api/services?active=true');
      const data = await res.json().catch(() => ({}));
      if (data.services) setServices(data.services);
    } catch (err) {
      console.error('Failed to load services:', err);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Fetch provider schedules (staff working days/hours) so we can gray out off-schedule slots
  const fetchProviderSchedules = useCallback(async (providerIds: string[]) => {
    if (providerIds.length === 0) return;
    try {
      const cacheBust = Date.now();
      const results = await Promise.all(
        providerIds.map(async (id) => {
          const res = await fetch(`/api/providers/${id}/schedules?t=${cacheBust}`);
          const data = await res.json();
          return { id, schedules: data.schedules as { day_of_week: number; is_working: boolean; start_time: string | null; end_time: string | null }[] };
        })
      );
      const map: Record<string, typeof results[0]['schedules']> = {};
      results.forEach((r) => { map[r.id] = r.schedules || []; });
      setProviderSchedules(map);
    } catch (err) {
      console.error('Failed to load provider schedules:', err);
    }
  }, []);

  useEffect(() => {
    fetchProviders();
    fetchServices();
  }, [fetchProviders, fetchServices]);

  useEffect(() => {
    if (providers.length > 0) {
      fetchProviderSchedules(providers.map((p: any) => p.id));
    }
  }, [providers, fetchProviderSchedules]);

  // Refetch schedules when user returns to this tab (e.g. after editing Team Schedules)
  useEffect(() => {
    const onVisible = () => {
      if (providers.length > 0) {
        fetchProviderSchedules(providers.map((p: any) => p.id));
      }
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [providers, fetchProviderSchedules]);

  // Refresh button: reload both appointments and provider schedules (keeps calendar in sync with Team Schedules)
  const handleRefresh = useCallback(() => {
    fetchAppointments();
    if (providers.length > 0) {
      fetchProviderSchedules(providers.map((p: any) => p.id));
    }
  }, [fetchAppointments, fetchProviderSchedules, providers]);

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

  // Create appointment (with optional new client creation)
  const handleQuickBook = async () => {
    // Validate: need either existing client OR new client form filled
    if (isNewClient) {
      if (!newClientForm.first_name || !newClientForm.last_name || !newClientForm.phone) {
        toast.error('Please fill in client name and phone');
      return;
      }
    } else {
      if (!quickBookClient) {
        toast.error('Please select a client');
        return;
      }
    }
    
    if (!quickBookService || !quickBookSlot) {
      toast.error('Please select a service');
      return;
    }

    setSaving(true);
    try {
      let clientId = quickBookClient;
      
      // If creating new client, do that first
      if (isNewClient) {
        const clientRes = await fetch('/api/clients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            first_name: newClientForm.first_name,
            last_name: newClientForm.last_name,
            email: newClientForm.email || null,
            phone: newClientForm.phone,
          }),
        });
        
        if (!clientRes.ok) {
          const clientData = await clientRes.json();
          throw new Error(clientData.error || 'Failed to create client');
        }
        
        const clientData = await clientRes.json();
        clientId = clientData.client?.id;
        
        if (!clientId) {
          throw new Error('Client created but no ID returned');
        }
        
        toast.success(`Client ${newClientForm.first_name} created!`);
      }
      
      const [hours, minutes] = quickBookSlot.time.split(':').map(Number);
      
      // Use business timezone (America/Chicago) so appointment stores correctly and shows on calendar
      const dateOnly = selectedDate.toISOString().split('T')[0];
      const startDateTime = businessDateTimeToUTC(dateOnly, hours, minutes);
      const startsAt = startDateTime.toISOString();

      const selectedService = services.find((s: any) => s.id === quickBookService);
      const durationMinutes = selectedService?.duration_minutes ?? 30;

      // Resolve provider ID to ensure it's a valid UUID
      const resolvedProviderId = await resolveProviderId(quickBookSlot.providerId);

      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: clientId,
          service_id: quickBookService,
          provider_id: resolvedProviderId,
          starts_at: startsAt,
          duration_minutes: durationMinutes,
          status: 'confirmed',
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create appointment');
      }

      toast.success('Appointment booked!');
      setShowQuickBook(false);
      setIsNewClient(false);
      setNewClientForm({ first_name: '', last_name: '', email: '', phone: '' });
      setQuickBookClient('');
      setQuickBookSlot(null);
      await fetchAppointments();
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

  // Sorted appointments for the day (for mobile agenda list)
  const sortedDayAppointments = useMemo(() => {
    return [...appointments]
      .filter(a => a.status !== 'cancelled')
      .sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime());
  }, [appointments]);

  // Check if a time slot is within provider's working schedule for the given date (grays out off-days/hours)
  const isSlotInSchedule = useCallback(
    (providerId: string, date: Date, timeStr: string): boolean => {
      const dayOfWeek = date.getDay();
      const schedules = providerSchedules[providerId];
      if (!schedules || schedules.length === 0) return true; // no data = show as available
      const daySchedule = schedules.find((s) => s.day_of_week === dayOfWeek);
      if (!daySchedule || !daySchedule.is_working || !daySchedule.start_time || !daySchedule.end_time) return false;
      const toMins = (t: string) => {
        const part = (t || '').slice(0, 5);
        const [h, m] = part.split(':').map(Number);
        return (h ?? 0) * 60 + (m ?? 0);
      };
      const slotMins = toMins(timeStr);
      const startMins = toMins(daySchedule.start_time);
      const endMins = toMins(daySchedule.end_time);
      return slotMins >= startMins && slotMins < endMins;
    },
    [providerSchedules]
  );

  // Whether the whole day is off for this provider (for header label)
  const isProviderOffDay = useCallback(
    (providerId: string, date: Date): boolean => {
      const dayOfWeek = date.getDay();
      const schedules = providerSchedules[providerId];
      if (!schedules || schedules.length === 0) return false;
      const daySchedule = schedules.find((s) => s.day_of_week === dayOfWeek);
      return !daySchedule || !daySchedule.is_working;
    },
    [providerSchedules]
  );

  // Get provider color
  const getProviderColor = (providerId: string) => {
    const index = providers.findIndex(p => p.id === providerId);
    return PROVIDER_COLORS[index % PROVIDER_COLORS.length];
  };

  // Format date display — show full date; calendar passes selectedDate so we show the correct day
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isToday = (date: Date) => {
    const t = new Date();
    return date.getDate() === t.getDate() && date.getMonth() === t.getMonth() && date.getFullYear() === t.getFullYear();
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

  // Get appointment position — use business timezone (America/Chicago) so block appears on correct row
  const getAppointmentStyle = (appt: any) => {
    const d = new Date(appt.starts_at || 0);
    const startHour = parseInt(d.toLocaleString('en-US', { timeZone: BUSINESS_TZ, hour: '2-digit', hour12: false }), 10) || 9;
    const startMinute = parseInt(d.toLocaleString('en-US', { timeZone: BUSINESS_TZ, minute: '2-digit' }), 10) || 0;

    const startMinutes = (startHour - 9) * 60 + startMinute;
    const duration = appt.duration_minutes || appt.duration || 30;
    
    // 48px per 30 min = 96px per hour
    // Clamp to visible area (9 AM - 6 PM)
    const clampedMinutes = Math.max(0, Math.min(startMinutes, 9 * 60)); // Max 9 hours from 9 AM
    const top = (clampedMinutes / 60) * 96;
    const height = Math.max(24, (duration / 60) * 96 - 2); // Minimum 24px height
    
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

  // Format time in business timezone (America/Chicago) — matches booking and confirmations
  const BUSINESS_TZ = 'America/Chicago';
  const formatApptTime = (isoString: string) => {
    if (!isoString) return '—';
    return new Date(isoString).toLocaleTimeString('en-US', {
      timeZone: BUSINESS_TZ,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getEndTime = (isoString: string, duration: number) => {
    if (!isoString) return '—';
    const end = new Date(new Date(isoString).getTime() + duration * 60 * 1000);
    return end.toLocaleTimeString('en-US', {
      timeZone: BUSINESS_TZ,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Status display
  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; text: string; label: string }> = {
      confirmed: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Confirmed' },
      checked_in: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Checked In' },
      in_progress: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'In Progress' },
      completed: { bg: 'bg-white', text: 'text-black', label: 'Completed' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelled' },
      no_show: { bg: 'bg-red-100', text: 'text-red-700', label: 'No Show' },
    };
    const style = styles[status] || styles.confirmed;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${status === 'checked_in' ? 'bg-amber-500' : status === 'confirmed' ? 'bg-emerald-500' : 'bg-white'}`} />
        {style.label}
      </span>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-h-[calc(100vh-80px)] min-h-0">
      {/* Top nav bar — Fresha-style: calendar controls + notifications + Add */}
      <CalendarNavBar
        selectedDate={selectedDate}
        onNavigateDate={navigateDate}
        formatDate={formatDate}
        isToday={isToday(selectedDate)}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onRefresh={handleRefresh}
        filtersButton={
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/20 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
            </button>
            {showFilters && (
              <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-black z-50 p-4">
                <p className="text-xs font-semibold text-black uppercase tracking-wider mb-3">Providers</p>
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
                        className="w-4 h-4 rounded border-black text-[#FF2D8E] focus:ring-pink-500"
                      />
                      <div className={`w-3 h-3 rounded-full ${PROVIDER_COLORS[idx % PROVIDER_COLORS.length].accent}`} />
                      <span className="text-sm text-black">{provider.first_name} {provider.last_name}</span>
                    </label>
                  ))}
            </div>
              </div>
            )}
          </div>
        }
      />

      {dataError && (
        <div className="mx-4 mt-2 p-4 bg-amber-50 border-2 border-amber-400 rounded-lg text-amber-900">
          <p className="font-medium">Data unavailable</p>
          <p className="text-sm">{dataError}</p>
        </div>
      )}

      <div className="flex flex-1 min-h-0 flex-col lg:flex-row bg-white rounded-b-xl overflow-hidden shadow-sm border border-black border-t-0">
        {/* ========== MOBILE: Fresha-style full-day view (no horizontal scroll) ========== */}
        <div className="lg:hidden flex flex-col flex-1 min-w-0 min-h-0 overflow-hidden">
          {/* Provider chips */}
          <div className="flex gap-2 p-3 border-b border-black bg-white overflow-x-auto shrink-0">
            <button
              onClick={() => setMobileProviderTab('all')}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                mobileProviderTab === 'all' ? 'bg-black text-white' : 'bg-white border border-black text-black'
              }`}
            >
              All
            </button>
            {displayProviders.map((provider) => {
              const isActive = mobileProviderTab === provider.id;
              const color = PROVIDER_COLORS[providers.findIndex(p => p.id === provider.id) % PROVIDER_COLORS.length];
              return (
                <button
                  key={provider.id}
                  onClick={() => setMobileProviderTab(provider.id)}
                  className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    isActive ? `${color.accent} text-white` : 'bg-white border border-black text-black'
                  }`}
                >
                  {provider.first_name}
                </button>
              );
            })}
          </div>
          {loading ? (
            <div className="flex items-center justify-center flex-1">
              <div className="animate-spin w-8 h-8 border-4 border-[#FF2D8E] border-t-transparent rounded-full" />
            </div>
          ) : mobileProviderTab === 'all' ? (
            /* Agenda list: all appointments for the day in order */
            <div className="flex-1 overflow-y-auto p-3">
              {sortedDayAppointments.length === 0 ? (
                <p className="text-sm text-black text-center py-8">No appointments this day. Tap + in nav to book.</p>
              ) : (
                <ul className="space-y-2">
                  {sortedDayAppointments.map((appt) => {
                    const color = getProviderColor(appt.provider_id);
                    const isSelected = selectedAppointment?.id === appt.id;
                    return (
                      <li key={appt.id}>
                        <button
                          onClick={() => setSelectedAppointment(appt)}
                          className={`w-full text-left rounded-xl border-l-4 p-3 transition-all ${color.bg} ${color.border} ${color.text} ${
                            isSelected ? 'ring-2 ring-black shadow-lg' : 'hover:shadow-md'
                          }`}
                        >
                          <p className="font-semibold text-xs uppercase tracking-wide truncate">
                            {appt.service_name || 'Appointment'}
                          </p>
                          <p className="font-medium text-sm mt-0.5 truncate">
                            {appt.client_name || 'Client'}
                          </p>
                          <p className="text-xs opacity-75 mt-0.5">
                            {formatApptTime(appt.starts_at)} – {getEndTime(appt.starts_at, appt.duration_minutes || appt.duration || 60)}
                            {appt.provider_first_name && ` · ${appt.provider_first_name}`}
                          </p>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          ) : (
            /* Single-provider timeline: full day in one column, compact rows (no horizontal scroll) */
            (() => {
              const provider = displayProviders.find(p => p.id === mobileProviderTab);
              if (!provider) return null;
              const providerAppts = getProviderAppointments(provider.id, provider.first_name);
              const color = getProviderColor(provider.id);
              const providerName = `${provider.first_name} ${provider.last_name}`;
              // Compact: ~24px per 30 min so 9–6 fits on one screen (18 slots × 48px = 432px)
              const slotHeightPx = 24;
              const rowHeight = slotHeightPx * 2;
              const scale = rowHeight / 96;
              return (
                <div className="flex-1 flex min-h-0 overflow-auto">
                  <div className="w-12 flex-shrink-0 border-r border-black flex flex-col text-xs font-medium text-black">
                    {HOUR_LABELS.map((hour) => (
                      <div key={hour} className="flex items-center justify-end pr-1 shrink-0" style={{ height: rowHeight }}>
                        {formatTimeDisplay(hour)}
                      </div>
                    ))}
                  </div>
                  <div className="flex-1 min-w-0 relative shrink-0" style={{ height: HOUR_LABELS.length * rowHeight }}>
                    {/* Slot hit targets */}
                    {HOUR_LABELS.map((hour) => {
                      const slot00 = `${hour.toString().padStart(2, '0')}:00`;
                      const slot30 = `${hour.toString().padStart(2, '0')}:30`;
                      const inSchedule00 = isSlotInSchedule(provider.id, selectedDate, slot00);
                      const inSchedule30 = isSlotInSchedule(provider.id, selectedDate, slot30);
                      return (
                        <div key={hour} className="border-b border-black/20 flex flex-col" style={{ height: rowHeight }}>
                          <div
                            className={`flex-1 border-b border-black/10 ${inSchedule00 ? 'cursor-pointer hover:bg-pink-100 active:bg-pink-200' : 'bg-white'}`}
                            onClick={() => inSchedule00 && handleSlotClick(slot00, provider.id, providerName)}
                          />
                          <div
                            className={`flex-1 ${inSchedule30 ? 'cursor-pointer hover:bg-pink-100 active:bg-pink-200' : 'bg-white'}`}
                            onClick={() => inSchedule30 && handleSlotClick(slot30, provider.id, providerName)}
                          />
                        </div>
                      );
                    })}
                    {/* Appointments overlaid */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="relative w-full h-full">
                        {providerAppts.map((appt) => {
                          const style = getAppointmentStyle(appt);
                          const isSelected = selectedAppointment?.id === appt.id;
                          const topNum = parseInt(String(style.top).replace('px', ''), 10) || 0;
                          const heightNum = parseInt(String(style.height).replace('px', ''), 10) || 24;
                          return (
                            <button
                              key={appt.id}
                              onClick={(e) => { e.stopPropagation(); setSelectedAppointment(appt); }}
                              className={`absolute left-1 right-1 rounded border-l-4 p-1.5 text-left overflow-hidden pointer-events-auto ${color.bg} ${color.border} ${color.text} ${
                                isSelected ? 'ring-2 ring-black z-20' : 'z-10'
                              }`}
                              style={{
                                top: `${topNum * scale}px`,
                                height: `${Math.max(16, heightNum * scale)}px`,
                                fontSize: 10,
                              }}
                            >
                              <span className="font-semibold truncate block">{appt.service_name || '—'}</span>
                              <span className="truncate block opacity-90">{appt.client_name || '—'}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()
          )}
        </div>

        {/* DESKTOP: Multi-column grid (hidden on mobile) */}
        <div className="hidden lg:flex flex-1 flex-col overflow-hidden min-w-0 min-h-0">
        {/* Provider Headers */}
        <div className="flex border-b border-black bg-white">
          <div className="w-16 flex-shrink-0" />
          {displayProviders.map((provider, idx) => {
            const color = PROVIDER_COLORS[providers.findIndex(p => p.id === provider.id) % PROVIDER_COLORS.length];
            const offToday = isProviderOffDay(provider.id, selectedDate);
            return (
              <div
                key={provider.id}
                className={`flex-1 px-2 sm:px-3 py-2 sm:py-3 border-l border-black min-w-[120px] sm:min-w-[160px] lg:min-w-[180px] flex-shrink-0 ${offToday ? 'bg-white' : ''}`}
              >
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-full ${offToday ? 'bg-white' : color.accent} flex items-center justify-center text-white font-medium text-sm shadow-sm`}>
                    {provider.first_name?.[0]}{provider.last_name?.[0]}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${offToday ? 'text-black' : 'text-black'}`}>
                      {provider.first_name}
                      {offToday && <span className="text-black font-normal ml-1">(off)</span>}
            </span>
                    <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
          </div>

        {/* Calendar Grid */}
        <div className="flex-1 overflow-auto min-h-0">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="animate-spin w-8 h-8 border-4 border-[#FF2D8E] border-t-transparent rounded-full" />
            </div>
          ) : (
            <div className="flex min-h-full min-w-max lg:min-w-0">
              <div className="w-14 sm:w-16 flex-shrink-0 border-r border-black">
                {HOUR_LABELS.map((hour) => (
                  <div key={hour} className="h-24 relative">
                    <span className="absolute -top-2.5 right-3 text-xs text-black font-medium">
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
                const offToday = isProviderOffDay(provider.id, selectedDate);

                return (
                  <div
                    key={provider.id}
                    className={`flex-1 border-l border-black relative min-w-[120px] sm:min-w-[160px] lg:min-w-[180px] flex-shrink-0 ${offToday ? 'bg-white' : ''}`}
                  >
                    {/* Clickable hour slots — grayed out when provider is off or outside working hours */}
                    {HOUR_LABELS.map((hour) => {
                      const slot00 = `${hour.toString().padStart(2, '0')}:00`;
                      const slot30 = `${hour.toString().padStart(2, '0')}:30`;
                      const inSchedule00 = isSlotInSchedule(provider.id, selectedDate, slot00);
                      const inSchedule30 = isSlotInSchedule(provider.id, selectedDate, slot30);
                      return (
                        <div key={hour} className="h-24 border-b border-black relative">
                          {/* First 30 min */}
                          <div
                            className={`absolute inset-x-0 top-0 h-12 transition-colors group ${inSchedule00 ? 'cursor-pointer hover:bg-pink-50/50' : 'bg-white cursor-not-allowed'}`}
                            onClick={() => inSchedule00 && handleSlotClick(slot00, provider.id, providerName)}
                          >
                            {inSchedule00 && (
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-xs text-[#FF2D8E] font-medium bg-white/80 px-2 py-1 rounded">+ Book</span>
            </div>
                            )}
                          </div>
                          {/* Second 30 min */}
                          <div
                            className={`absolute inset-x-0 bottom-0 h-12 transition-colors group ${inSchedule30 ? 'cursor-pointer hover:bg-pink-50/50' : 'bg-white cursor-not-allowed'}`}
                            onClick={() => inSchedule30 && handleSlotClick(slot30, provider.id, providerName)}
                          >
                            {inSchedule30 && (
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-xs text-[#FF2D8E] font-medium bg-white/80 px-2 py-1 rounded">+ Book</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}

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
                            isSelected ? 'ring-2 ring-black shadow-lg z-20' : 'hover:shadow-md z-10'
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

      {/* Right Panel - Appointment Detail; full width below calendar on mobile */}
      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-black bg-white flex flex-col flex-shrink-0 max-h-[50vh] lg:max-h-none overflow-y-auto">
        {selectedAppointment ? (
          <>
            {/* Panel Header */}
            <div className="p-4 border-b border-black flex items-center justify-between">
              <h3 className="font-semibold text-black">Appointment</h3>
              <div className="flex items-center gap-2">
                {/* More Actions Dropdown */}
                <div className="relative group">
                  <button className="p-1.5 hover:bg-white rounded-lg text-black">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-black opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    <button 
                      onClick={() => {
                        if (confirm('Cancel this appointment?')) {
                          fetch(`/api/appointments/${selectedAppointment.id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ status: 'cancelled' })
                          }).then(async (res) => {
                            if (res.ok) {
                              toast.success('Appointment cancelled');
                              fetchAppointments();
                              setSelectedAppointment(null);
                            } else {
                              const d = await res.json().catch(() => ({}));
                              toast.error(d.error || 'Failed to cancel appointment');
                            }
                          });
                        }
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-t-lg"
                    >
                      Cancel Appointment
                    </button>
                    <button 
                      onClick={() => {
                        fetch(`/api/appointments/${selectedAppointment.id}`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ status: 'no_show' })
                        }).then(() => {
                          toast.success('Marked as no-show');
                          fetchAppointments();
                        });
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-orange-600 hover:bg-orange-50"
                    >
                      Mark No-Show
                    </button>
                    <button 
                      onClick={() => {
                        fetch(`/api/appointments/${selectedAppointment.id}`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ status: 'completed' })
                        }).then(() => {
                          toast.success('Marked as completed');
                          fetchAppointments();
                        });
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-green-50 rounded-b-lg"
                    >
                      Mark Completed
                    </button>
        </div>
        </div>
                {/* Edit Appointment */}
                <Link 
                  href={`/admin/appointments/${selectedAppointment.id}/edit`}
                  className="p-1.5 hover:bg-white rounded-lg text-black"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </Link>
                {/* Close */}
                <button 
                  onClick={() => setSelectedAppointment(null)}
                  className="p-1.5 hover:bg-white rounded-lg text-black"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
        </div>
      </div>

            {/* Status & Checkout */}
            <div className="p-4 border-b border-black flex items-center justify-between">
              {getStatusBadge(selectedAppointment.status)}
          <Link
                href={`/pos?appointment=${selectedAppointment.id}&client=${selectedAppointment.client_id}`}
                className="px-4 py-2 bg-[#FF2D8E] text-white text-sm font-medium rounded-lg hover:bg-black transition-colors"
          >
                CHECKOUT
          </Link>
        </div>

            {/* Date/Time */}
            <div className="p-4 border-b border-black">
              <div className="flex items-center justify-between text-sm">
                <span className="text-black">On</span>
                <span className="text-black font-medium">
                  {new Date(selectedAppointment.starts_at).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
            </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-black">At</span>
                <span className="text-black font-medium">
                  {formatApptTime(selectedAppointment.starts_at)}
                  </span>
                </div>
          </div>

            {/* Client Info - INTERACTIVE */}
            <div className="p-4 border-b border-black">
              <div className="flex items-center gap-3">
                <Link 
                  href={selectedAppointment.client_id ? `/admin/clients/${selectedAppointment.client_id}` : '#'}
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white font-semibold text-lg hover:scale-105 transition-transform"
                >
                  {selectedAppointment.client_name?.[0] || 'C'}
                </Link>
                          <Link
                  href={selectedAppointment.client_id ? `/admin/clients/${selectedAppointment.client_id}` : '#'}
                  className="flex-1 hover:bg-white -m-2 p-2 rounded-lg transition-colors"
                >
                  <p className="font-semibold text-black">
                    {selectedAppointment.client_name || 'Client'}
                  </p>
                  <p className="text-sm text-black">
                    Client since {new Date().getFullYear()}
                            </p>
                          </Link>
                {/* Message Button - Opens SMS */}
                {selectedAppointment.client_id && (
                  <Link
                    href={`/admin/inbox?client=${selectedAppointment.client_id}`}
                    className="p-2 hover:bg-green-50 rounded-lg text-green-600 transition-colors"
                    title="Send SMS"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </Link>
                )}
                {/* Call Button */}
                {selectedAppointment.client_phone && (
                  <a
                    href={`tel:${selectedAppointment.client_phone}`}
                    className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors"
                    title="Call client"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </a>
                )}
                    </div>

              {/* Contact Info */}
              {(selectedAppointment.client_email || selectedAppointment.client_phone) && (
                <div className="mt-3 text-xs text-black space-y-1">
                  {selectedAppointment.client_email && (
                    <p className="flex items-center gap-2">
                      <span>✉️</span>
                      <a href={`mailto:${selectedAppointment.client_email}`} className="hover:text-pink-600">
                        {selectedAppointment.client_email}
                      </a>
                    </p>
                  )}
                  {selectedAppointment.client_phone && (
                    <p className="flex items-center gap-2">
                      <span>📱</span>
                      <a href={`tel:${selectedAppointment.client_phone}`} className="hover:text-pink-600">
                        {selectedAppointment.client_phone}
                      </a>
                    </p>
                  )}
        </div>
      )}

              {/* View Full Profile Link */}
              {selectedAppointment.client_id && (
              <Link
                  href={`/admin/clients/${selectedAppointment.client_id}`}
                  className="mt-3 text-sm text-pink-600 hover:text-pink-700 font-medium flex items-center gap-1"
              >
                  View Full Profile
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
              </Link>
              )}
            </div>

            {/* Service Details */}
            <div className="p-4 flex-1">
                              <div className="flex items-center justify-between">
                                <div>
                  <p className="font-semibold text-black">
                    {selectedAppointment.service_name || 'Service'}
                                  </p>
                                </div>
                <p className="text-lg font-bold text-black">
                  ${selectedAppointment.service_price || selectedAppointment.service?.price || 0}
                                  </p>
                                </div>
              
              <div className="mt-3 text-sm text-black space-y-1">
                <p>
                  <span className="text-black">with</span>{' '}
                  <span className="font-medium">{selectedAppointment.provider_name || 'Provider'}</span>
                </p>
                <p>
                  <span className="text-black">at</span>{' '}
                  <span className="font-medium">{formatApptTime(selectedAppointment.starts_at)}</span>
                  <span className="text-black ml-3">for: {selectedAppointment.duration_minutes || selectedAppointment.duration || 30} min</span>
                </p>
                              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-4 border-t border-black space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href={`/admin/charting?client=${selectedAppointment.client_id}&appointment=${selectedAppointment.id}`}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-purple-50 text-purple-700 text-sm font-medium rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <span>📋</span> Chart
                            </Link>
                <Link
                  href={`/admin/consents?client=${selectedAppointment.client_id}`}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <span>📝</span> Consents
                </Link>
                        </div>
              <Link
                href={`/admin/clients/${selectedAppointment.client_id}/photos`}
                className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-pink-50 text-pink-700 text-sm font-medium rounded-lg hover:bg-pink-100 transition-colors"
              >
                <span>📸</span> Before/After Photos
              </Link>
                        </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8 text-center">
            <div>
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                    </div>
              <p className="text-black font-medium">Select an appointment</p>
              <p className="text-sm text-black mt-1">Click on any appointment to view details</p>
              <p className="text-sm text-black mt-1">or click empty time slot to book</p>
                  </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Book Modal */}
      {showQuickBook && quickBookSlot && (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="p-6 border-b border-black">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-black">Quick Book</h2>
                  <p className="text-pink-600 font-semibold mt-2">
                    Booking for: {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                  <p className="text-black mt-1">
                    {quickBookSlot.time} with {quickBookSlot.providerName}
                  </p>
                </div>
                <button
                  onClick={() => setShowQuickBook(false)}
                  className="p-2 hover:bg-white rounded-lg text-black"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
          </div>
        </div>
            
            <div className="p-6 space-y-4">
              {/* Toggle: Existing vs New Client */}
              <div className="flex gap-2 p-1 bg-white rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setIsNewClient(false);
                    setNewClientForm({ first_name: '', last_name: '', email: '', phone: '' });
                  }}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                    !isNewClient 
                      ? 'bg-white text-black shadow-sm' 
                      : 'text-black hover:text-black'
                  }`}
                >
                  Existing Client
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsNewClient(true);
                    setQuickBookClient('');
                    setClientSearchResults([]);
                  }}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                    isNewClient 
                      ? 'bg-white text-black shadow-sm' 
                      : 'text-black hover:text-black'
                  }`}
                >
                  + New Client
                </button>
      </div>

              {/* Existing Client Search */}
              {!isNewClient && (
              <div>
                  <label className="block text-sm font-medium text-black mb-2">Search Client *</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search client by name..."
                      className="w-full px-4 py-3 border border-black rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-[#FF2D8E]"
                      onChange={(e) => searchClients(e.target.value)}
                  />
                  {clientSearchResults.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-black rounded-xl shadow-xl z-10 max-h-48 overflow-y-auto">
                      {clientSearchResults.map((client) => (
                        <button
                          key={client.id}
                          type="button"
                          onClick={() => {
                            setQuickBookClient(client.id);
                            setClientSearchResults([]);
                          }}
                            className="w-full text-left px-4 py-3 hover:bg-white flex items-center gap-3 border-b border-black last:border-0"
                        >
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white font-medium">
                            {client.first_name?.[0]}{client.last_name?.[0]}
                          </div>
                          <div>
                              <p className="font-medium text-black">{client.first_name} {client.last_name}</p>
                              <p className="text-sm text-black">{client.email || client.phone}</p>
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
              )}

              {/* New Client Form */}
              {isNewClient && (
                <div className="space-y-3 p-4 bg-pink-50 rounded-xl border border-pink-100">
                  <p className="text-sm font-medium text-pink-700 flex items-center gap-2">
                    <span>✨</span> New Client Details
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="First Name *"
                      value={newClientForm.first_name}
                      onChange={(e) => setNewClientForm({ ...newClientForm, first_name: e.target.value })}
                      className="px-3 py-2.5 border border-black rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-[#FF2D8E] text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Last Name *"
                      value={newClientForm.last_name}
                      onChange={(e) => setNewClientForm({ ...newClientForm, last_name: e.target.value })}
                      className="px-3 py-2.5 border border-black rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-[#FF2D8E] text-sm"
                    />
                  </div>
                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    value={newClientForm.phone}
                    onChange={(e) => setNewClientForm({ ...newClientForm, phone: e.target.value })}
                    className="w-full px-3 py-2.5 border border-black rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-[#FF2D8E] text-sm"
                  />
                  <input
                    type="email"
                    placeholder="Email (optional)"
                    value={newClientForm.email}
                    onChange={(e) => setNewClientForm({ ...newClientForm, email: e.target.value })}
                    className="w-full px-3 py-2.5 border border-black rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-[#FF2D8E] text-sm"
                  />
                  {newClientForm.first_name && newClientForm.last_name && newClientForm.phone && (
                    <p className="text-sm text-emerald-600 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Ready to create: {newClientForm.first_name} {newClientForm.last_name}
                    </p>
                  )}
                </div>
              )}

              {/* Service Selection */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">Service *</label>
                <select 
                  className="w-full px-4 py-3 border border-black rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-[#FF2D8E] bg-white"
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

            <div className="p-6 border-t border-black flex justify-between">
              <button
                onClick={() => setShowQuickBook(false)}
                className="px-4 py-2 text-black font-medium hover:bg-white rounded-lg"
              >
                Cancel
              </button>
              <div className="flex gap-2">
                <Link
                  href={`/admin/appointments/new?provider=${quickBookSlot?.providerId}&date=${dateString}&time=${encodeURIComponent(quickBookSlot?.time || '')}`}
                  className="px-4 py-2 bg-white text-black font-medium rounded-lg hover:bg-white"
                  onClick={() => setShowQuickBook(false)}
                >
                  Full Form
                </Link>
                <button
                  onClick={handleQuickBook}
                  disabled={saving || !quickBookService || (isNewClient ? (!newClientForm.first_name || !newClientForm.last_name || !newClientForm.phone) : !quickBookClient)}
                  className="px-6 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium rounded-lg hover:from-pink-600 hover:to-rose-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {saving ? 'Booking...' : isNewClient ? 'Create & Book' : 'Book Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
