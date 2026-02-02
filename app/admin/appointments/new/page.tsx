'use client';

// ============================================================
// NEW APPOINTMENT PAGE - Fresha-Style Booking Flow
// Client → Service (categorized + search) → Forms → Date/Time → Confirm
// ============================================================

import { useState, Suspense, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

// Generate time slots from 9am to 6pm in 15-minute increments
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 9; hour <= 18; hour++) {
    for (let min = 0; min < 60; min += 15) {
      if (hour === 18 && min > 0) break;
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      const displayMin = min.toString().padStart(2, '0');
      slots.push(`${displayHour}:${displayMin} ${period}`);
    }
  }
  return slots;
};

const TIME_SLOTS = generateTimeSlots();

// Default consent forms
const DEFAULT_CONSENT_FORMS = [
  { id: 'consent-hipaa', name: 'HIPAA Acknowledgment', description: 'Privacy practices and patient rights', required: true },
  { id: 'consent-treatment', name: 'Treatment Consent', description: 'General treatment consent and risks', required: true },
  { id: 'consent-photo', name: 'Photo/Media Release', description: 'Permission for before/after photos', required: false },
  { id: 'consent-financial', name: 'Financial Policy', description: 'Payment terms and cancellation policy', required: true },
];

function NewAppointmentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedClientId = searchParams.get('client');

  // State for API data
  const [services, setServices] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [providers, setProviders] = useState<any[]>([]);
  const [consentForms, setConsentForms] = useState<any[]>(DEFAULT_CONSENT_FORMS);
  const [loading, setLoading] = useState(true);
  const [existingAppointments, setExistingAppointments] = useState<any[]>([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Search and filter state
  const [serviceSearch, setServiceSearch] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Client search state
  const [clientSearch, setClientSearch] = useState('');
  const [clientResults, setClientResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [allClients, setAllClients] = useState<any[]>([]);

  // Form state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(preselectedClientId ? 2 : 1);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [isWalkIn, setIsWalkIn] = useState(false);

  const [formData, setFormData] = useState({
    serviceId: '',
    providerId: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    notes: '',
    sendConfirmation: true,
    customPrice: '',
    selectedForms: ['consent-hipaa', 'consent-treatment', 'consent-financial'] as string[],
    formsCompleted: false,
  });

  // Fetch all data on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [servicesRes, providersRes, clientsRes] = await Promise.all([
          fetch('/api/services'),
          fetch('/api/providers'),
          fetch('/api/clients?limit=100'),
        ]);

        const [servicesData, providersData, clientsData] = await Promise.all([
          servicesRes.json(),
          providersRes.json(),
          clientsRes.json(),
        ]);

        if (servicesData.services) setServices(servicesData.services);
        if (servicesData.categories) setCategories(servicesData.categories);
        if (providersData.providers) {
          setProviders(providersData.providers);
          if (providersData.providers.length > 0) {
            setFormData(prev => ({ ...prev, providerId: providersData.providers[0].id }));
          }
        }
        if (clientsData.clients) setAllClients(clientsData.clients);

        // Try to fetch consent forms
        try {
          const consentsRes = await fetch('/api/consents');
          const consentsData = await consentsRes.json();
          if (consentsData.templates && consentsData.templates.length > 0) {
            setConsentForms(consentsData.templates.map((t: any) => ({
              id: t.id,
              name: t.name,
              description: t.description || '',
              required: t.is_required || false,
            })));
          }
        } catch (e) {
          // Use defaults
        }

      } catch (err) {
        console.error('Failed to load data:', err);
        setErrorMessage('Failed to load booking data. Please refresh.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Load preselected client
  useEffect(() => {
    if (preselectedClientId) {
      fetch(`/api/clients?id=${preselectedClientId}`)
        .then(res => res.json())
        .then(data => {
          if (data.client) {
            setSelectedClient({
              id: data.client.id,
              name: `${data.client.first_name} ${data.client.last_name}`,
              email: data.client.email,
              phone: data.client.phone,
            });
          }
        })
        .catch(err => console.error('Failed to load client:', err));
    }
  }, [preselectedClientId]);

  // Search clients
  useEffect(() => {
    if (clientSearch.length < 1) {
      setClientResults(allClients.slice(0, 20));
      return;
    }

    const searchLower = clientSearch.toLowerCase();
    const filtered = allClients.filter((c: any) =>
      c.first_name?.toLowerCase().includes(searchLower) ||
      c.last_name?.toLowerCase().includes(searchLower) ||
      c.email?.toLowerCase().includes(searchLower) ||
      c.phone?.includes(clientSearch)
    ).slice(0, 20);

    setClientResults(filtered);
  }, [clientSearch, allClients]);

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

  // Group services by category
  const groupedServices = categories.map(cat => ({
    ...cat,
    services: services.filter(s => s.category_id === cat.id),
  })).filter(cat => cat.services.length > 0);

  // Filter services by search
  const filteredGroupedServices = serviceSearch
    ? groupedServices.map(cat => ({
        ...cat,
        services: cat.services.filter((s: any) =>
          s.name.toLowerCase().includes(serviceSearch.toLowerCase()) ||
          s.short_description?.toLowerCase().includes(serviceSearch.toLowerCase())
        ),
      })).filter(cat => cat.services.length > 0)
    : groupedServices;

  // Expand all categories when searching
  useEffect(() => {
    if (serviceSearch) {
      setExpandedCategories(new Set(filteredGroupedServices.map(c => c.id)));
    }
  }, [serviceSearch, filteredGroupedServices.length]);

  const toggleCategory = (catId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(catId)) {
      newExpanded.delete(catId);
    } else {
      newExpanded.add(catId);
    }
    setExpandedCategories(newExpanded);
  };

  // Check if a time slot is booked
  const isTimeSlotBooked = (timeSlot: string) => {
    if (!existingAppointments.length) return false;

    const [time, period] = timeSlot.split(' ');
    const [hours, minutes] = time.split(':');
    let hour = parseInt(hours);
    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;

    const slotDate = new Date(formData.date);
    slotDate.setHours(hour, parseInt(minutes), 0, 0);
    const slotTime = slotDate.getTime();

    return existingAppointments.some((apt: any) => {
      if (apt.status === 'cancelled' || apt.status === 'no_show') return false;
      const aptStart = new Date(apt.starts_at).getTime();
      const aptEnd = apt.ends_at ? new Date(apt.ends_at).getTime() : aptStart + (apt.duration || 30) * 60000;
      return slotTime >= aptStart && slotTime < aptEnd;
    });
  };

  const selectedService = services.find((s: any) => s.id === formData.serviceId);
  const selectedProvider = providers.find((p: any) => p.id === formData.providerId);

  const getDisplayPrice = () => {
    if (formData.customPrice) return parseFloat(formData.customPrice);
    if (selectedService?.price_cents) return selectedService.price_cents / 100;
    return 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    setErrorMessage('');
    setSuccessMessage('');

    if (!isWalkIn && !selectedClient) {
      setErrorMessage('Please select a client or mark as walk-in');
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

      const appointmentData = {
        client_id: isWalkIn ? null : selectedClient?.id,
        provider_id: formData.providerId,
        service_id: formData.serviceId,
        starts_at: scheduledAt.toISOString(),
        duration_minutes: selectedService?.duration_minutes || 30,
        notes: formData.notes + (isWalkIn ? ' [WALK-IN]' : ''),
        custom_price_cents: formData.customPrice ? Math.round(parseFloat(formData.customPrice) * 100) : null,
        consent_forms: formData.selectedForms,
        is_walk_in: isWalkIn,
      };

      console.log('Creating appointment:', appointmentData);

      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentData),
      });

      const result = await res.json();
      console.log('Appointment result:', result);

      if (!res.ok) {
        if (result.conflictType === 'double_booking') {
          setErrorMessage('This time slot is already booked. Please select a different time.');
        } else {
          setErrorMessage(result.error || 'Failed to create appointment. Please try again.');
        }
        return;
      }

      // Success!
      setSuccessMessage('Appointment booked successfully!');
      setTimeout(() => {
        router.push('/admin/appointments');
      }, 1000);

    } catch (error) {
      console.error('Failed to create appointment:', error);
      setErrorMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/appointments"
          className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-block"
        >
          ← Back to Calendar
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Book Appointment</h1>
        <p className="text-gray-500">Select client, service, consent forms, and time</p>
      </div>

      {/* Error/Success Messages */}
      {errorMessage && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <span className="text-red-500">⚠️</span>
          <p className="text-red-700 font-medium">{errorMessage}</p>
          <button onClick={() => setErrorMessage('')} className="ml-auto text-red-500 hover:text-red-700">×</button>
        </div>
      )}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
          <span className="text-green-500">✓</span>
          <p className="text-green-700 font-medium">{successMessage}</p>
        </div>
      )}

      {/* Progress Steps */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        {['Client', 'Service', 'Forms', 'Date/Time', 'Confirm'].map((label, i) => (
          <div key={label} className="flex items-center">
            <button
              onClick={() => setStep(i + 1)}
              disabled={i + 1 > step}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                step === i + 1
                  ? 'bg-pink-500 text-white'
                  : step > i + 1
                  ? 'bg-pink-200 text-pink-700 hover:bg-pink-300'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {step > i + 1 ? '✓' : i + 1}
            </button>
            {i < 4 && <div className={`w-8 h-1 mx-1 ${step > i + 1 ? 'bg-pink-300' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Select Client */}
      {step === 1 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Select a client</h2>
          </div>

          {/* Search Bar */}
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input
                type="text"
                placeholder="Search client or leave empty for walk-ins"
                value={clientSearch}
                onChange={(e) => setClientSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-4 border-b border-gray-100 flex gap-4">
            <Link
              href="/admin/clients/new"
              className="flex items-center gap-3 px-4 py-3 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
            >
              <span className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center text-xl">+</span>
              <span className="font-medium">Add new client</span>
            </Link>
            <button
              type="button"
              onClick={() => {
                setIsWalkIn(true);
                setSelectedClient(null);
                setStep(2);
              }}
              className="flex items-center gap-3 px-4 py-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <span className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center text-xl">🚶</span>
              <span className="font-medium">Walk-In</span>
            </button>
          </div>

          {/* Client List */}
          <div className="max-h-96 overflow-y-auto">
            {clientResults.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                {clientSearch ? 'No clients found' : 'No clients yet'}
              </div>
            ) : (
              clientResults.map((client: any) => (
                <button
                  key={client.id}
                  type="button"
                  onClick={() => {
                    setSelectedClient({
                      id: client.id,
                      name: `${client.first_name} ${client.last_name}`,
                      email: client.email,
                      phone: client.phone,
                    });
                    setIsWalkIn(false);
                    setStep(2);
                  }}
                  className="w-full flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                >
                  <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                    {client.first_name?.[0]}{client.last_name?.[0]}
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{client.first_name} {client.last_name}</p>
                    <p className="text-sm text-gray-500">{client.phone || client.email}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* Step 2: Select Service (Fresha-style) */}
      {step === 2 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Select a service</h2>
            {(selectedClient || isWalkIn) && (
              <span className="text-sm text-gray-500">
                {isWalkIn ? '🚶 Walk-In' : `👤 ${selectedClient?.name}`}
              </span>
            )}
          </div>

          {/* Search Bar */}
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input
                type="text"
                placeholder="Search by service name"
                value={serviceSearch}
                onChange={(e) => setServiceSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              />
            </div>
          </div>

          {/* Provider Selection */}
          <div className="p-4 border-b border-gray-100">
            <label className="block text-sm font-medium text-gray-700 mb-2">Provider</label>
            <select
              value={formData.providerId}
              onChange={(e) => setFormData({ ...formData, providerId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500"
            >
              {providers.map((p: any) => (
                <option key={p.id} value={p.id}>
                  {p.first_name || p.firstName} {p.last_name || p.lastName}
                </option>
              ))}
            </select>
          </div>

          {/* Categorized Services */}
          <div className="max-h-[500px] overflow-y-auto">
            {filteredGroupedServices.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                {serviceSearch ? 'No services match your search' : 'No services available'}
              </div>
            ) : (
              filteredGroupedServices.map((category: any) => (
                <div key={category.id} className="border-b border-gray-100 last:border-0">
                  {/* Category Header */}
                  <button
                    type="button"
                    onClick={() => toggleCategory(category.id)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">{category.name}</span>
                      <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                        {category.services.length}
                      </span>
                    </div>
                    <span className={`transform transition-transform ${expandedCategories.has(category.id) ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </button>

                  {/* Services in Category */}
                  {expandedCategories.has(category.id) && (
                    <div className="bg-gray-50">
                      {category.services.map((service: any) => (
                        <button
                          key={service.id}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, serviceId: service.id, customPrice: '' });
                            setStep(3);
                          }}
                          className={`w-full flex items-center justify-between px-4 py-3 border-l-4 hover:bg-gray-100 transition-colors ${
                            formData.serviceId === service.id
                              ? 'border-pink-500 bg-pink-50'
                              : 'border-blue-400'
                          }`}
                        >
                          <div className="text-left pl-4">
                            <p className="font-medium text-gray-900">{service.name}</p>
                            <p className="text-sm text-gray-500">
                              {service.duration_minutes || 30}min
                              {service.short_description && ` • ${service.short_description}`}
                            </p>
                          </div>
                          <p className="font-semibold text-gray-900">
                            {service.price_display || `$${(service.price_cents || 0) / 100}`}
                          </p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100 flex justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg"
            >
              Back
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Consent Forms */}
      {step === 3 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Required Forms</h2>
            <p className="text-sm text-gray-500 mt-1">Select forms for client to sign before appointment</p>
          </div>

          {/* Summary */}
          <div className="p-4 bg-gray-50 border-b border-gray-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Client:</span>
              <span className="font-medium text-gray-900">{isWalkIn ? 'Walk-In' : selectedClient?.name}</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-gray-600">Service:</span>
              <span className="font-medium text-gray-900">{selectedService?.name}</span>
            </div>
          </div>

          {/* Form Selection */}
          <div className="p-4 space-y-3">
            {consentForms.map((form: any) => (
              <label
                key={form.id}
                className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${
                  formData.selectedForms.includes(form.id)
                    ? 'border-pink-500 bg-pink-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.selectedForms.includes(form.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData({ ...formData, selectedForms: [...formData.selectedForms, form.id] });
                    } else {
                      setFormData({ ...formData, selectedForms: formData.selectedForms.filter((f: string) => f !== form.id) });
                    }
                  }}
                  className="w-5 h-5 text-pink-500 border-gray-300 rounded focus:ring-pink-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{form.name}</span>
                    {form.required && (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">Required</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{form.description}</p>
                </div>
              </label>
            ))}
          </div>

          {/* Price Adjustment */}
          {selectedService && (
            <div className="p-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price Adjustment</label>
                  <p className="text-xs text-gray-500">
                    Standard: {selectedService.price_display || `$${(selectedService.price_cents || 0) / 100}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder={(selectedService.price_cents / 100).toFixed(2)}
                    value={formData.customPrice}
                    onChange={(e) => setFormData({ ...formData, customPrice: e.target.value })}
                    className="w-28 px-3 py-2 border border-gray-200 rounded-lg text-right"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="p-4 border-t border-gray-100 flex justify-between">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setStep(4)}
              className="px-6 py-2.5 bg-pink-500 text-white font-semibold rounded-lg hover:bg-pink-600"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Date & Time */}
      {step === 4 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Select Date & Time</h2>
          </div>

          {/* Summary */}
          <div className="p-4 bg-gray-50 border-b border-gray-100">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-gray-600">Client:</span>
              <span className="font-medium text-gray-900 text-right">{isWalkIn ? 'Walk-In' : selectedClient?.name}</span>
              <span className="text-gray-600">Service:</span>
              <span className="font-medium text-gray-900 text-right">{selectedService?.name}</span>
              <span className="text-gray-600">Provider:</span>
              <span className="font-medium text-gray-900 text-right">
                {selectedProvider?.first_name || selectedProvider?.firstName} {selectedProvider?.last_name || selectedProvider?.lastName}
              </span>
              <span className="text-gray-600">Duration:</span>
              <span className="font-medium text-gray-900 text-right">{selectedService?.duration_minutes || 30} min</span>
              <span className="text-gray-600">Forms:</span>
              <span className="font-medium text-gray-900 text-right">{formData.selectedForms.length} selected</span>
              <span className="text-gray-900 font-semibold pt-2 border-t">Price:</span>
              <span className="font-bold text-pink-600 text-right text-lg pt-2 border-t">${getDisplayPrice().toFixed(2)}</span>
            </div>
          </div>

          {/* Date Picker */}
          <div className="p-4 border-b border-gray-100">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value, time: '' })}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
            />
          </div>

          {/* Time Grid */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Select Time</label>
              {availabilityLoading && (
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <div className="animate-spin w-3 h-3 border-2 border-pink-500 border-t-transparent rounded-full" />
                  Loading...
                </span>
              )}
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-64 overflow-y-auto">
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
                        : 'bg-white text-gray-700 border-gray-200 hover:border-pink-300'
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
                <span className="w-3 h-3 bg-gray-200 rounded"></span> Booked
              </span>
            </div>
          </div>

          {/* Notes */}
          <div className="p-4 border-t border-gray-100">
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes (optional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
              placeholder="Any special requests..."
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
            />
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100 flex justify-between">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => formData.time && setStep(5)}
              disabled={!formData.time}
              className="px-6 py-2.5 bg-pink-500 text-white font-semibold rounded-lg hover:bg-pink-600 disabled:opacity-50"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Confirm & Book */}
      {step === 5 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Confirm Booking</h2>
          </div>

          {/* Full Summary */}
          <div className="p-6">
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-pink-500 flex items-center justify-center text-white text-xl font-bold">
                  {isWalkIn ? '🚶' : selectedClient?.name?.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <div>
                  <p className="font-semibold text-lg text-gray-900">{isWalkIn ? 'Walk-In Client' : selectedClient?.name}</p>
                  {!isWalkIn && selectedClient?.phone && (
                    <p className="text-gray-600">{selectedClient.phone}</p>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-300 pt-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Service</span>
                  <span className="font-medium text-gray-900">{selectedService?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Provider</span>
                  <span className="font-medium text-gray-900">
                    {selectedProvider?.first_name || selectedProvider?.firstName} {selectedProvider?.last_name || selectedProvider?.lastName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date</span>
                  <span className="font-medium text-gray-900">
                    {new Date(formData.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time</span>
                  <span className="font-medium text-gray-900">{formData.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium text-gray-900">{selectedService?.duration_minutes || 30} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Forms to Sign</span>
                  <span className="font-medium text-gray-900">{formData.selectedForms.length}</span>
                </div>
              </div>

              <div className="border-t border-gray-300 pt-4 flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-pink-600">${getDisplayPrice().toFixed(2)}</span>
              </div>
            </div>

            {/* Confirmation checkbox */}
            <label className="flex items-center gap-2 mt-6">
              <input
                type="checkbox"
                checked={formData.sendConfirmation}
                onChange={(e) => setFormData({ ...formData, sendConfirmation: e.target.checked })}
                className="w-4 h-4 text-pink-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">Send confirmation email & SMS to client</span>
            </label>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100 flex justify-between">
            <button
              type="button"
              onClick={() => setStep(4)}
              className="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 py-3 bg-pink-500 text-white font-bold rounded-lg hover:bg-pink-600 disabled:opacity-50 flex items-center gap-2 text-lg"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                  Booking...
                </>
              ) : (
                '✓ Book Appointment'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function NewAppointmentPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full" /></div>}>
      <NewAppointmentContent />
    </Suspense>
  );
}
