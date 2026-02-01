'use client';

// ============================================================
// NEW APPOINTMENT PAGE
// Book a new appointment - With real-time availability checking
// ============================================================

import { useState, Suspense, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

// Generate time slots from 9am to 6pm in 15-minute increments
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 9; hour <= 18; hour++) {
    for (let min = 0; min < 60; min += 15) {
      if (hour === 18 && min > 0) break; // Stop at 6pm
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      const displayMin = min.toString().padStart(2, '0');
      slots.push(`${displayHour}:${displayMin} ${period}`);
    }
  }
  return slots;
};

const TIME_SLOTS = generateTimeSlots();

function NewAppointmentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedClientId = searchParams.get('client');

  // State for API data
  const [services, setServices] = useState<any[]>([]);
  const [providers, setProviders] = useState<any[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [existingAppointments, setExistingAppointments] = useState<any[]>([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch services from API
  const fetchServices = useCallback(async () => {
    try {
      setServicesLoading(true);
      const res = await fetch('/api/services');
      const data = await res.json();
      if (data.services) {
        setServices(data.services);
      }
    } catch (err) {
      console.error('Failed to load services:', err);
    } finally {
      setServicesLoading(false);
    }
  }, []);

  // Fetch providers from API
  const fetchProviders = useCallback(async () => {
    try {
      const res = await fetch('/api/providers');
      const data = await res.json();
      if (data.providers) {
        setProviders(data.providers);
      }
    } catch (err) {
      console.error('Failed to load providers:', err);
    }
  }, []);

  useEffect(() => {
    fetchServices();
    fetchProviders();
  }, [fetchServices, fetchProviders]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(preselectedClientId ? 2 : 1);
  const [clientSearch, setClientSearch] = useState('');
  const [clientResults, setClientResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);

  const [formData, setFormData] = useState({
    serviceId: '',
    providerId: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    notes: '',
    sendConfirmation: true,
    customPrice: '', // For price adjustments
  });

  // Update providerId when providers load
  useEffect(() => {
    if (providers.length > 0 && !formData.providerId) {
      setFormData(prev => ({ ...prev, providerId: providers[0].id }));
    }
  }, [providers, formData.providerId]);

  // Fetch availability when date or provider changes
  useEffect(() => {
    if (!formData.date || !formData.providerId) return;

    const fetchAvailability = async () => {
      setAvailabilityLoading(true);
      try {
        const res = await fetch(`/api/appointments?date=${formData.date}&provider_id=${formData.providerId}`);
        const data = await res.json();
        setExistingAppointments(data.appointments || []);
      } catch (err) {
        console.error('Failed to load availability:', err);
      } finally {
        setAvailabilityLoading(false);
      }
    };

    fetchAvailability();
  }, [formData.date, formData.providerId]);

  // Check if a time slot is booked
  const isTimeSlotBooked = (timeSlot: string) => {
    if (!existingAppointments.length) return false;

    // Convert time slot to comparable format
    const [time, period] = timeSlot.split(' ');
    const [hours, minutes] = time.split(':');
    let hour = parseInt(hours);
    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;

    const slotDate = new Date(formData.date);
    slotDate.setHours(hour, parseInt(minutes), 0, 0);
    const slotTime = slotDate.getTime();

    // Check if slot overlaps with any existing appointment
    return existingAppointments.some((apt: any) => {
      if (apt.status === 'cancelled' || apt.status === 'no_show') return false;
      const aptStart = new Date(apt.starts_at).getTime();
      const aptEnd = apt.ends_at ? new Date(apt.ends_at).getTime() : aptStart + (apt.duration || 30) * 60000;
      return slotTime >= aptStart && slotTime < aptEnd;
    });
  };

  // Load preselected client
  useEffect(() => {
    if (preselectedClientId) {
      fetch(`/api/clients?id=${preselectedClientId}`)
        .then(res => res.json())
        .then(data => {
          if (data.clients && data.clients.length > 0) {
            const c = data.clients[0];
            setSelectedClient({
              id: c.id,
              name: `${c.first_name} ${c.last_name}`,
              email: c.email,
              phone: c.phone,
            });
          }
        })
        .catch(err => console.error('Failed to load client:', err));
    }
  }, [preselectedClientId]);

  // Search clients
  useEffect(() => {
    if (clientSearch.length < 2) {
      setClientResults([]);
      return;
    }

    const searchClients = async () => {
      setSearchLoading(true);
      try {
        const res = await fetch(`/api/clients?search=${encodeURIComponent(clientSearch)}`);
        const data = await res.json();
        
        setClientResults((data.clients || []).slice(0, 10).map((c: any) => ({
          id: c.id,
          name: `${c.first_name} ${c.last_name}`,
          email: c.email,
          phone: c.phone,
        })));
      } catch (err) {
        console.error('Failed to search clients:', err);
        setClientResults([]);
      }
      setSearchLoading(false);
    };

    const debounce = setTimeout(searchClients, 300);
    return () => clearTimeout(debounce);
  }, [clientSearch]);

  const selectedService = services.find((s: any) => s.id === formData.serviceId);
  const selectedProvider = providers.find((p: any) => p.id === formData.providerId);

  // Calculate display price
  const getDisplayPrice = () => {
    if (formData.customPrice) {
      return parseFloat(formData.customPrice);
    }
    if (selectedService?.price_cents) {
      return selectedService.price_cents / 100;
    }
    return 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!selectedClient) {
      setErrorMessage('Please select a client');
      return;
    }
    if (!formData.serviceId) {
      setErrorMessage('Please select a service');
      return;
    }
    if (!formData.time) {
      setErrorMessage('Please select a time');
      return;
    }

    setIsSubmitting(true);

    try {
      // Parse time to create ISO datetime
      const [time, period] = formData.time.split(' ');
      const [hours, minutes] = time.split(':');
      let hour = parseInt(hours);
      if (period === 'PM' && hour !== 12) hour += 12;
      if (period === 'AM' && hour === 12) hour = 0;
      
      const scheduledAt = new Date(formData.date);
      scheduledAt.setHours(hour, parseInt(minutes), 0, 0);

      // Use API to create appointment
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: selectedClient.id,
          provider_id: formData.providerId,
          service_id: formData.serviceId,
          starts_at: scheduledAt.toISOString(),
          duration_minutes: selectedService?.duration_minutes || 30,
          notes: formData.notes,
          custom_price_cents: formData.customPrice ? Math.round(parseFloat(formData.customPrice) * 100) : null,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        if (result.conflictType === 'double_booking') {
          setErrorMessage('This time slot is already booked. Please select a different time.');
        } else {
          setErrorMessage(result.error || 'Failed to create appointment');
        }
        return;
      }

      // Success! Redirect to appointments
      router.push('/admin/appointments');
    } catch (error) {
      console.error('Failed to create appointment:', error);
      setErrorMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/appointments"
          className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-block"
        >
          ← Back to Appointments
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Book Appointment</h1>
        <p className="text-gray-500">Schedule a new appointment</p>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 font-medium">{errorMessage}</p>
        </div>
      )}

      {/* Progress */}
      <div className="flex items-center gap-2 mb-6">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step >= s
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {s}
            </div>
            {s < 3 && (
              <div
                className={`w-16 h-1 mx-2 ${
                  step > s ? 'bg-pink-500' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
        <span className="text-sm text-gray-500 ml-2">
          {step === 1 && 'Select Client'}
          {step === 2 && 'Choose Service'}
          {step === 3 && 'Pick Time'}
        </span>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Select Client */}
        {step === 1 && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Select Client</h2>

            {selectedClient ? (
              <div className="flex items-center justify-between p-4 bg-pink-50 border border-pink-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold">
                    {selectedClient.name.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{selectedClient.name}</p>
                    {selectedClient.email && (
                      <p className="text-sm text-gray-500">{selectedClient.email}</p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedClient(null)}
                  className="text-pink-600 hover:text-pink-700 text-sm font-medium"
                >
                  Change
                </button>
              </div>
            ) : (
              <>
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={clientSearch}
                    onChange={(e) => setClientSearch(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  />
                  {searchLoading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="animate-spin w-5 h-5 border-2 border-pink-500 border-t-transparent rounded-full" />
                    </div>
                  )}
                </div>

                {clientResults.length > 0 && (
                  <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 max-h-60 overflow-y-auto">
                    {clientResults.map((client) => (
                      <button
                        key={client.id}
                        type="button"
                        onClick={() => {
                          setSelectedClient(client);
                          setClientSearch('');
                          setClientResults([]);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors"
                      >
                        <p className="font-medium text-gray-900">{client.name}</p>
                        <p className="text-sm text-gray-500">{client.email} • {client.phone}</p>
                      </button>
                    ))}
                  </div>
                )}

                {clientSearch.length >= 2 && clientResults.length === 0 && !searchLoading && (
                  <p className="text-gray-500 text-sm py-4 text-center">No clients found</p>
                )}

                <div className="mt-4 text-center">
                  <Link
                    href="/admin/clients/new"
                    className="text-pink-600 hover:text-pink-700 font-medium text-sm"
                  >
                    + Create New Client
                  </Link>
                </div>
              </>
            )}

            <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!selectedClient}
                className="px-6 py-2.5 bg-pink-500 text-white font-semibold rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Select Service */}
        {step === 2 && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Select Service</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Provider</label>
              <select
                value={formData.providerId}
                onChange={(e) => setFormData({ ...formData, providerId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              >
                {providers.map((p: any) => (
                  <option key={p.id} value={p.id}>
                    {p.first_name || p.firstName} {p.last_name || p.lastName}
                    {p.title && `, ${p.title}`}
                  </option>
                ))}
              </select>
            </div>

            {servicesLoading ? (
              <div className="py-8 text-center text-gray-500">Loading services...</div>
            ) : services.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                No services found. Add services in the Services section.
              </div>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {services.map((service: any) => (
                  <label
                    key={service.id}
                    className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                      formData.serviceId === service.id
                        ? 'border-pink-500 bg-pink-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="service"
                        value={service.id}
                        checked={formData.serviceId === service.id}
                        onChange={(e) => setFormData({ ...formData, serviceId: e.target.value, customPrice: '' })}
                        className="sr-only"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{service.name}</p>
                        <p className="text-sm text-gray-500">
                          {service.category?.name || 'Service'} • {service.duration_minutes || 30} min
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold text-gray-900">{service.price_display || `$${(service.price_cents || 0) / 100}`}</p>
                  </label>
                ))}
              </div>
            )}

            {/* Price Adjustment Section */}
            {formData.serviceId && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Price Adjustment
                    </label>
                    <p className="text-xs text-gray-500">
                      Standard: ${selectedService?.price_cents ? (selectedService.price_cents / 100).toFixed(2) : '0.00'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder={selectedService?.price_cents ? (selectedService.price_cents / 100).toFixed(2) : '0.00'}
                      value={formData.customPrice}
                      onChange={(e) => setFormData({ ...formData, customPrice: e.target.value })}
                      className="w-28 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-right"
                    />
                  </div>
                </div>
                {formData.customPrice && parseFloat(formData.customPrice) !== (selectedService?.price_cents || 0) / 100 && (
                  <p className="text-sm text-pink-600 mt-2">
                    {parseFloat(formData.customPrice) < (selectedService?.price_cents || 0) / 100
                      ? `💰 Discount: $${((selectedService?.price_cents || 0) / 100 - parseFloat(formData.customPrice)).toFixed(2)} off`
                      : `⬆️ Premium: +$${(parseFloat(formData.customPrice) - (selectedService?.price_cents || 0) / 100).toFixed(2)}`
                    }
                  </p>
                )}
              </div>
            )}

            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                disabled={!formData.serviceId}
                className="px-6 py-2.5 bg-pink-500 text-white font-semibold rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Select Date/Time */}
        {step === 3 && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Select Date & Time</h2>

            {/* Summary */}
            <div className="p-4 bg-gray-50 rounded-lg mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Client:</span>
                <span className="font-medium">{selectedClient?.name}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Service:</span>
                <span className="font-medium">{selectedService?.name}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Provider:</span>
                <span className="font-medium">
                  {selectedProvider?.first_name || selectedProvider?.firstName} {selectedProvider?.last_name || selectedProvider?.lastName}
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{selectedService?.duration_minutes || 30} minutes</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-200 mt-2">
                <span className="text-gray-900 font-semibold">Price:</span>
                <span className="font-bold text-pink-600 text-lg">${getDisplayPrice().toFixed(2)}</span>
              </div>
            </div>

            <div className="mb-6">
              {/* Date */}
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value, time: '' })}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              />
            </div>

            {/* Time Slots Grid */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Select Time</label>
                {availabilityLoading && (
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <div className="animate-spin w-3 h-3 border-2 border-pink-500 border-t-transparent rounded-full" />
                    Checking availability...
                  </span>
                )}
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-64 overflow-y-auto p-1">
                {TIME_SLOTS.map((time) => {
                  const isBooked = isTimeSlotBooked(time);
                  const isSelected = formData.time === time;
                  
                  return (
                    <button
                      key={time}
                      type="button"
                      disabled={isBooked}
                      onClick={() => setFormData({ ...formData, time })}
                      className={`px-2 py-2 text-sm rounded-lg border transition-colors ${
                        isSelected
                          ? 'bg-pink-500 text-white border-pink-500'
                          : isBooked
                          ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-pink-300 hover:bg-pink-50'
                      }`}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-pink-500 rounded"></span> Selected
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-gray-100 border border-gray-200 rounded"></span> Booked
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-white border border-gray-200 rounded"></span> Available
                </span>
              </div>
            </div>

            {/* Notes */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes (optional)</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={2}
                placeholder="Any special requests or notes..."
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              />
            </div>

            {/* Confirmation */}
            <label className="flex items-center gap-2 mt-4">
              <input
                type="checkbox"
                checked={formData.sendConfirmation}
                onChange={(e) => setFormData({ ...formData, sendConfirmation: e.target.checked })}
                className="w-4 h-4 text-pink-500 border-gray-300 rounded focus:ring-pink-500"
              />
              <span className="text-sm text-gray-700">Send confirmation email & SMS to client</span>
            </label>

            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={!formData.time || isSubmitting}
                className="px-6 py-2.5 bg-pink-500 text-white font-semibold rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    Booking...
                  </>
                ) : (
                  'Book Appointment'
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default function NewAppointmentPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <NewAppointmentContent />
    </Suspense>
  );
}
