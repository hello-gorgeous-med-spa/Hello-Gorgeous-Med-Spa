'use client';

// ============================================================
// SCHEDULE / CALENDAR PAGE
// Interactive booking calendar - Connected to Live API Data
// ============================================================

import { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';

// Generate time slots (9 AM to 6:30 PM)
const TIME_SLOTS = Array.from({ length: 20 }, (_, i) => {
  const hour = Math.floor(i / 2) + 9;
  const minute = i % 2 === 0 ? '00' : '30';
  return `${hour.toString().padStart(2, '0')}:${minute}`;
});

const STATUS_COLORS: Record<string, string> = {
  booked: 'bg-blue-100 border-blue-300 text-blue-800',
  confirmed: 'bg-green-100 border-green-300 text-green-800',
  checked_in: 'bg-amber-100 border-amber-300 text-amber-800',
  in_progress: 'bg-purple-100 border-purple-300 text-purple-800',
  completed: 'bg-gray-100 border-gray-300 text-gray-600',
  no_show: 'bg-red-100 border-red-300 text-red-800',
  cancelled: 'bg-gray-100 border-gray-300 text-gray-400 line-through',
};

const PROVIDER_COLORS = [
  'bg-blue-500',
  'bg-pink-500',
  'bg-purple-500',
  'bg-green-500',
  'bg-amber-500',
];

export default function CalendarPage() {
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'provider'>('provider');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedProvider, setSelectedProvider] = useState<string | 'all'>('all');
  const [showNewApptModal, setShowNewApptModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ time: string; provider: string } | null>(null);

  // Format date for API
  const dateString = selectedDate.toISOString().split('T')[0];

  // State for API data
  const [appointments, setAppointments] = useState<any[]>([]);
  const [providers, setProviders] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [apptsLoading, setApptsLoading] = useState(true);
  const [providersLoading, setProvidersLoading] = useState(true);

  // Fetch appointments from API
  const fetchAppointments = useCallback(async () => {
    try {
      setApptsLoading(true);
      const res = await fetch(`/api/appointments?date=${dateString}`);
      const data = await res.json();
      if (data.appointments) {
        setAppointments(data.appointments);
      }
    } catch (err) {
      console.error('Failed to load appointments:', err);
    } finally {
      setApptsLoading(false);
    }
  }, [dateString]);

  // Fetch providers from API
  const fetchProviders = useCallback(async () => {
    try {
      setProvidersLoading(true);
      const res = await fetch('/api/providers');
      const data = await res.json();
      if (data.providers) {
        setProviders(data.providers);
      }
    } catch (err) {
      console.error('Failed to load providers:', err);
    } finally {
      setProvidersLoading(false);
    }
  }, []);

  // Fetch services from API
  const fetchServices = useCallback(async () => {
    try {
      const res = await fetch('/api/services');
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

  const refetch = fetchAppointments;

  // Filter appointments by provider
  const filteredAppointments = useMemo(() => {
    if (selectedProvider === 'all') return appointments;
    return appointments.filter(apt => apt.provider_id === selectedProvider);
  }, [appointments, selectedProvider]);

  // Filter providers for display
  const displayProviders = useMemo(() => {
    if (selectedProvider === 'all') return providers;
    return providers.filter(p => p.id === selectedProvider);
  }, [providers, selectedProvider]);

  // Format date display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Navigate dates
  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    }
    setSelectedDate(newDate);
  };

  // Get time from ISO string
  const getTime = (isoString: string) => {
    const date = new Date(isoString);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  // Get end time based on duration
  const getEndTime = (isoString: string, durationMinutes: number) => {
    const date = new Date(isoString);
    date.setMinutes(date.getMinutes() + durationMinutes);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  // Get appointments for a time slot and provider
  const getAppointmentsForSlot = (time: string, providerId: string) => {
    return filteredAppointments.filter(appt => {
      const apptTime = getTime(appt.starts_at);
      const apptEndTime = getEndTime(appt.starts_at, appt.duration || 30);
      const matchesTime = apptTime <= time && apptEndTime > time;
      const matchesProvider = appt.provider_id === providerId;
      return matchesTime && matchesProvider;
    });
  };

  // Calculate appointment position and height for provider view
  const getAppointmentStyle = (appt: any) => {
    const startTime = getTime(appt.starts_at);
    const startParts = startTime.split(':').map(Number);
    const startMinutes = (startParts[0] - 9) * 60 + startParts[1];
    const duration = appt.duration || 30;
    
    return {
      top: `${(startMinutes / 30) * 48}px`,
      height: `${(duration / 30) * 48 - 4}px`,
    };
  };

  // Handle slot click
  const handleSlotClick = (time: string, providerId: string) => {
    setSelectedSlot({ time, provider: providerId });
    setShowNewApptModal(true);
  };

  // Calculate stats
  const stats = useMemo(() => {
    const confirmed = filteredAppointments.filter(a => a.status === 'confirmed').length;
    const pending = filteredAppointments.filter(a => a.status === 'booked').length;
    const checkedIn = filteredAppointments.filter(a => a.status === 'checked_in').length;
    const revenue = filteredAppointments.reduce((sum, a) => sum + (a.service?.price || 0), 0);
    
    return { total: filteredAppointments.length, confirmed, pending, checkedIn, revenue };
  }, [filteredAppointments]);

  const loading = apptsLoading || providersLoading;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Schedule</h1>
          <p className="text-gray-500">Manage appointments and bookings</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/appointments/new"
            className="px-4 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600"
          >
            + New Appointment
          </Link>
          <Link
            href="/book"
            target="_blank"
            className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200"
          >
            Online Booking ↗
          </Link>
        </div>
      </div>


      {/* Controls */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Date Navigation */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateDate('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              ←
            </button>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={dateString}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="px-3 py-2 border border-gray-200 rounded-lg"
              />
              <button
                onClick={() => setSelectedDate(new Date())}
                className="px-3 py-2 text-sm text-pink-600 hover:bg-pink-50 rounded-lg font-medium"
              >
                Today
              </button>
            </div>
            <button
              onClick={() => navigateDate('next')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              →
            </button>
            <span className="text-gray-700 font-medium ml-2">
              {formatDate(selectedDate)}
            </span>
          </div>

          {/* View & Filter Controls */}
          <div className="flex items-center gap-3">
            {/* Provider Filter */}
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg"
            >
              <option value="all">All Providers</option>
              {providers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.first_name} {p.last_name}
                </option>
              ))}
            </select>

            {/* View Mode */}
            <div className="flex border border-gray-200 rounded-lg overflow-hidden">
              {(['day', 'week', 'provider'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-2 text-sm font-medium capitalize ${
                    viewMode === mode
                      ? 'bg-pink-500 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            {/* Refresh */}
            <button
              onClick={() => refetch()}
              className="p-2 hover:bg-gray-100 rounded-lg"
              title="Refresh"
            >
              🔄
            </button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-white rounded-lg border border-gray-100 p-3">
          <p className="text-sm text-gray-500">Total Today</p>
          <p className="text-xl font-bold text-gray-900">{loading ? '-' : stats.total}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-3">
          <p className="text-sm text-gray-500">Confirmed</p>
          <p className="text-xl font-bold text-green-600">{loading ? '-' : stats.confirmed}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-3">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-xl font-bold text-blue-600">{loading ? '-' : stats.pending}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-3">
          <p className="text-sm text-gray-500">Checked In</p>
          <p className="text-xl font-bold text-amber-600">{loading ? '-' : stats.checkedIn}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-3">
          <p className="text-sm text-gray-500">Revenue Est.</p>
          <p className="text-xl font-bold text-pink-600">{loading ? '-' : `$${stats.revenue.toLocaleString()}`}</p>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">Loading schedule...</p>
        </div>
      )}

      {/* Calendar Grid - Provider View */}
      {!loading && viewMode === 'provider' && displayProviders.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <div className="text-4xl mb-4">👩‍⚕️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Providers Set Up</h3>
          <p className="text-gray-500 mb-4">Add providers to see the calendar view</p>
          <Link
            href="/admin/staff"
            className="px-4 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 inline-block"
          >
            Manage Staff
          </Link>
        </div>
      )}

      {!loading && viewMode === 'provider' && displayProviders.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {/* Provider Headers */}
          <div className="grid border-b border-gray-200" style={{ gridTemplateColumns: `80px repeat(${displayProviders.length}, 1fr)` }}>
            <div className="p-3 bg-gray-50 border-r border-gray-200 text-sm font-medium text-gray-600">
              Time
            </div>
            {displayProviders.map((provider, index) => (
              <div key={provider.id} className="p-3 bg-gray-50 border-r border-gray-200 last:border-r-0">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${PROVIDER_COLORS[index % PROVIDER_COLORS.length]}`} />
                  <span className="font-medium text-gray-900">
                    {provider.first_name} {provider.last_name}
                  </span>
                  {provider.title && (
                    <span className="text-xs text-gray-500">, {provider.title}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Time Slots */}
          <div className="relative">
            {TIME_SLOTS.map((time) => (
              <div 
                key={time} 
                className="grid border-b border-gray-100"
                style={{ gridTemplateColumns: `80px repeat(${displayProviders.length}, 1fr)` }}
              >
                {/* Time Label */}
                <div className="p-2 border-r border-gray-200 text-xs text-gray-500 text-right pr-3 bg-gray-50">
                  {time}
                </div>
                
                {/* Provider Columns */}
                {displayProviders.map((provider) => {
                  const slotAppts = getAppointmentsForSlot(time, provider.id);
                  const isHourStart = time.endsWith(':00');
                  
                  return (
                    <div
                      key={`${time}-${provider.id}`}
                      className={`h-12 border-r border-gray-200 last:border-r-0 relative cursor-pointer hover:bg-pink-50 ${
                        isHourStart ? 'border-t border-gray-300 bg-white' : 'bg-white'
                      }`}
                      onClick={() => !slotAppts.length && handleSlotClick(time, provider.id)}
                    >
                      {/* Render appointments that START at this time */}
                      {filteredAppointments
                        .filter(appt => getTime(appt.starts_at) === time && appt.provider_id === provider.id)
                        .map((appt) => (
                          <Link
                            key={appt.id}
                            href={`/admin/appointments/${appt.id}`}
                            className={`absolute inset-x-1 rounded-lg border-l-4 p-2 z-10 ${STATUS_COLORS[appt.status] || STATUS_COLORS.booked} hover:shadow-md transition-shadow overflow-hidden`}
                            style={getAppointmentStyle(appt)}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <p className="font-medium text-sm truncate">
                              {appt.client_name || 'Client'}
                            </p>
                            <p className="text-xs truncate opacity-75">
                              {appt.service_name || 'Appointment'}
                            </p>
                          </Link>
                        ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Day View - List Style */}
      {!loading && viewMode === 'day' && (
        <div className="bg-white rounded-xl border border-gray-100">
          {filteredAppointments.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500 mb-2">No appointments scheduled for this day</p>
              <Link
                href="/admin/appointments/new"
                className="text-pink-600 hover:text-pink-700 font-medium"
              >
                + Book an appointment
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {TIME_SLOTS.filter(t => t.endsWith(':00')).map((hour) => {
                const hourAppts = filteredAppointments.filter(appt => {
                  const apptHour = getTime(appt.starts_at).split(':')[0];
                  return apptHour === hour.split(':')[0];
                });

                return (
                  <div key={hour} className="flex">
                    <div className="w-20 p-3 bg-gray-50 text-sm text-gray-500 font-medium">
                      {parseInt(hour) > 12 ? `${parseInt(hour) - 12} PM` : parseInt(hour) === 12 ? '12 PM' : `${parseInt(hour)} AM`}
                    </div>
                    <div className="flex-1 p-3 min-h-[80px]">
                      {hourAppts.length > 0 ? (
                        <div className="space-y-2">
                          {hourAppts.map((appt) => (
                            <Link
                              key={appt.id}
                              href={`/admin/appointments/${appt.id}`}
                              className={`block p-3 rounded-lg border ${STATUS_COLORS[appt.status] || STATUS_COLORS.booked} hover:shadow-md transition-shadow`}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium">
                                    {appt.client_name || 'Client'}
                                  </p>
                                  <p className="text-sm">{appt.service_name || 'Appointment'}</p>
                                </div>
                                <div className="text-right text-sm">
                                  <p>{getTime(appt.starts_at)} - {getEndTime(appt.starts_at, appt.duration || 30)}</p>
                                  <p className="opacity-75">
                                    {appt.provider_name || 'Provider'}
                                  </p>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div 
                          className="h-full flex items-center justify-center text-gray-400 text-sm cursor-pointer hover:bg-gray-50 rounded-lg"
                          onClick={() => handleSlotClick(hour, displayProviders[0]?.id || '')}
                        >
                          Click to book
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Week View */}
      {!loading && viewMode === 'week' && (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 7 }, (_, i) => {
              const date = new Date(selectedDate);
              date.setDate(date.getDate() - date.getDay() + i);
              const isToday = date.toDateString() === new Date().toDateString();
              const isSelected = date.toDateString() === selectedDate.toDateString();
              
              // Count appointments for the selected date (we have this data loaded)
              const dayAppts = isSelected ? filteredAppointments.length : null;
              
              return (
                <div 
                  key={i} 
                  className={`p-4 rounded-lg cursor-pointer transition-colors ${
                    isSelected ? 'bg-pink-100 border-2 border-pink-300' :
                    isToday ? 'bg-pink-50 border-2 border-pink-200' : 
                    'bg-gray-50 hover:bg-gray-100'
                  }`}
                  onClick={() => {
                    setSelectedDate(new Date(date));
                    setViewMode('day');
                  }}
                >
                  <p className="text-xs text-gray-500">
                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </p>
                  <p className={`text-lg font-bold ${isToday || isSelected ? 'text-pink-600' : 'text-gray-900'}`}>
                    {date.getDate()}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {dayAppts !== null ? `${dayAppts} appts` : 'Click to view'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Status Legend</p>
        <div className="flex flex-wrap gap-3">
          {Object.entries(STATUS_COLORS).map(([status, classes]) => (
            <div key={status} className="flex items-center gap-2">
              <span className={`px-2 py-1 text-xs font-medium rounded ${classes}`}>
                {status.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* New Appointment Quick Modal */}
      {showNewApptModal && selectedSlot && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Quick Book</h2>
              <p className="text-gray-500">
                {selectedSlot.time} with {providers.find(p => p.id === selectedSlot.provider)?.first_name || 'Provider'}
              </p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                <input
                  type="text"
                  placeholder="Search client..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                <select className="w-full px-4 py-2 border border-gray-200 rounded-lg">
                  <option>Select service...</option>
                  {services.map(service => (
                    <option key={service.id} value={service.id}>
                      {service.name} - ${service.price}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-between">
              <button
                onClick={() => setShowNewApptModal(false)}
                className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <div className="flex gap-2">
                <Link
                  href="/admin/appointments/new"
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200"
                  onClick={() => setShowNewApptModal(false)}
                >
                  Full Form
                </Link>
                <Link
                  href={`/admin/appointments/new?provider=${selectedSlot?.provider}&date=${dateString}&time=${encodeURIComponent(selectedSlot?.time || '')}`}
                  className="px-6 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 inline-block text-center"
                  onClick={() => setShowNewApptModal(false)}
                >
                  Book
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
