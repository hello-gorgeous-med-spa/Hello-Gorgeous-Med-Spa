'use client';

// ============================================================
// PUBLIC BOOKING FORM COMPONENT
// Collects client info and schedules appointment
// With provider selection and schedule-based availability
// Fetches providers from API (database-driven with fallback)
// ============================================================

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Service {
  id: string;
  name: string;
  slug: string;
  duration_minutes: number;
  price_display: string;
  deposit_required: boolean;
  deposit_amount: number | null;
  requires_consult: boolean;
}

interface Provider {
  id: string;
  name: string;
  title: string;
  image?: string;
  bio?: string;
  color: string;
  schedule: {
    [day: number]: { start: string; end: string } | null;
  };
}

interface Props {
  service: Service;
  providerPref?: string;
}

// Generate time slots based on provider schedule (defensive: require valid start/end)
function getTimeSlotsForProvider(provider: Provider, date: Date, duration: number): string[] {
  const dayOfWeek = date.getDay(); // 0=Sunday, 1=Monday, etc.
  const schedule = provider.schedule?.[dayOfWeek] ?? provider.schedule?.[String(dayOfWeek)];
  if (!schedule || typeof schedule.start !== 'string' || typeof schedule.end !== 'string') return [];

  const startParts = schedule.start.trim().split(':').map(Number);
  const endParts = schedule.end.trim().split(':').map(Number);
  const startHour = startParts[0];
  const startMin = startParts[1] ?? 0;
  const endHour = endParts[0];
  const endMin = endParts[1] ?? 0;
  if (Number.isNaN(startHour) || Number.isNaN(endHour)) return [];

  const slots: string[] = [];
  let currentHour = startHour;
  let currentMin = startMin;

  while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
    const slotEndMin = currentMin + duration;
    const slotEndHour = currentHour + Math.floor(slotEndMin / 60);
    const actualEndMin = slotEndMin % 60;

    if (slotEndHour < endHour || (slotEndHour === endHour && actualEndMin <= endMin)) {
      const hour12 = currentHour > 12 ? currentHour - 12 : currentHour === 0 ? 12 : currentHour;
      const ampm = currentHour >= 12 ? 'PM' : 'AM';
      const minStr = currentMin.toString().padStart(2, '0');
      slots.push(`${hour12}:${minStr} ${ampm}`);
    }

    currentMin += 30;
    if (currentMin >= 60) {
      currentHour += 1;
      currentMin = 0;
    }
  }

  return slots;
}

// Generate next 30 days (excluding days provider doesn't work)
function getAvailableDates(provider: Provider | null) {
  const dates = [];
  const today = new Date();
  
  for (let i = 1; i <= 45; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    // Skip Sundays (0) and Saturdays (6)
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    
    // If provider selected, check their schedule
    if (provider) {
      const dayOfWeek = date.getDay();
      if (!provider.schedule[dayOfWeek]) continue; // Provider doesn't work this day
    }
    
    dates.push(date);
    if (dates.length >= 21) break; // Show 3 weeks max
  }
  
  return dates;
}

export default function BookingForm({ service, providerPref: propProviderPref }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const providerPref = propProviderPref ?? searchParams?.get('provider') ?? undefined;
  const [step, setStep] = useState<'provider' | 'datetime' | 'info' | 'confirm'>('provider');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [availableProviders, setAvailableProviders] = useState<Provider[]>([]);
  const [loadingProviders, setLoadingProviders] = useState(true);
  const [userChangedProvider, setUserChangedProvider] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [availabilitySlots, setAvailabilitySlots] = useState<{ time: string; available: boolean }[]>([]);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    isNewClient: true,
    notes: '',
    agreeToTerms: false,
    agreeToSMS: true,
  });

  // Fetch providers from API (database-driven with fallback)
  useEffect(() => {
    async function fetchProviders() {
      setLoadingProviders(true);
      try {
        const response = await fetch(`/api/booking/providers?serviceSlug=${service.slug}`);
        const data = await response.json();
        if (data.providers && data.providers.length > 0) {
          setAvailableProviders(data.providers);
        }
      } catch (error) {
        console.error('Error fetching providers:', error);
      } finally {
        setLoadingProviders(false);
      }
    }
    fetchProviders();
  }, [service.slug]);
  
  // Get dates based on selected provider
  const availableDates = getAvailableDates(selectedProvider);
  
  const timeSlotsFromSchedule = selectedProvider && selectedDate
    ? getTimeSlotsForProvider(selectedProvider, selectedDate, service.duration_minutes)
    : [];
  const hasAvailability = availabilitySlots.length > 0;
  const timeSlots = hasAvailability
    ? availabilitySlots.map((s) => s.time)
    : timeSlotsFromSchedule;
  const slotAvailable = (time: string) => {
    if (!hasAvailability) return false;
    const s = availabilitySlots.find((x) => x.time === time);
    return s ? s.available : false;
  };
  const anySlotAvailable = hasAvailability && availabilitySlots.some((s) => s.available);

  // Auto-select provider: (1) URL ?provider=danielle/ryan matches, or (2) only one provider
  useEffect(() => {
    if (loadingProviders || userChangedProvider || selectedProvider) return;
    if (availableProviders.length === 0) return;

    const pref = (providerPref || '').toLowerCase();
    if (pref) {
      const match = availableProviders.find((p) => p.name.toLowerCase().includes(pref));
      if (match) {
        setSelectedProvider(match);
        setStep('datetime');
        return;
      }
    }
    if (availableProviders.length === 1) {
      setSelectedProvider(availableProviders[0]);
      setStep('datetime');
    }
  }, [availableProviders, selectedProvider, loadingProviders, userChangedProvider, providerPref]);

  // Reset date/time when provider changes
  useEffect(() => {
    setSelectedDate(null);
    setSelectedTime('');
    setAvailabilitySlots([]);
  }, [selectedProvider?.id]);

  // Fetch real availability when provider + date selected (so we can gray out unavailable slots)
  useEffect(() => {
    if (!selectedProvider?.id || !selectedDate) {
      setAvailabilitySlots([]);
      return;
    }
    const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
    setLoadingAvailability(true);
    setAvailabilitySlots([]);
    setSelectedTime('');
    fetch(`/api/availability?provider_id=${encodeURIComponent(selectedProvider.id)}&date=${dateStr}&duration=${service.duration_minutes || 30}`)
      .then((res) => res.json())
      .then((data) => {
        const slots = (data.slots || []).map((s: { time: string; available: boolean }) => ({
          time: s.time,
          available: !!s.available,
        }));
        setAvailabilitySlots(slots);
      })
      .catch(() => setAvailabilitySlots([]))
      .finally(() => setLoadingAvailability(false));
  }, [selectedProvider?.id, selectedDate, service.duration_minutes]);

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/booking/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceSlug: service.slug,
          serviceId: service.id,
          providerId: selectedProvider?.id,
          date: selectedDate ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}` : null,
          time: selectedTime,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          dateOfBirth: formData.dateOfBirth || null,
          isNewClient: formData.isNewClient,
          notes: formData.notes,
          agreeToTerms: formData.agreeToTerms,
          agreeToSMS: formData.agreeToSMS,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const msg = data.error || 'Failed to book appointment';
        setSubmitError(msg);
        throw new Error(msg);
      }

      setStep('confirm');
    } catch (error) {
      console.error('Booking error:', error);
      const msg = error instanceof Error ? error.message : 'Failed to book appointment. Please try again or call us.';
      setSubmitError(msg);
      alert(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatFullDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-black overflow-hidden keyboard-safe">
      {/* Progress Steps */}
      <div className="bg-white px-6 py-4 border-b border-black">
        <div className="flex items-center justify-center gap-2 sm:gap-4">
          {/* Step 1: Provider */}
          <div className={`flex items-center gap-2 ${step === 'provider' ? 'text-pink-600' : 'text-black'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              step === 'provider' ? 'bg-pink-500 text-white' : 
              ['datetime', 'info', 'confirm'].includes(step) ? 'bg-green-500 text-white' : 'bg-white'
            }`}>
              {['datetime', 'info', 'confirm'].includes(step) ? '✓' : '1'}
            </span>
            <span className="text-sm font-medium hidden sm:inline">Provider</span>
          </div>
          <div className="w-4 sm:w-8 h-px bg-white" />
          
          {/* Step 2: Date & Time */}
          <div className={`flex items-center gap-2 ${step === 'datetime' ? 'text-pink-600' : 'text-black'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              step === 'datetime' ? 'bg-pink-500 text-white' : 
              ['info', 'confirm'].includes(step) ? 'bg-green-500 text-white' : 'bg-white'
            }`}>
              {['info', 'confirm'].includes(step) ? '✓' : '2'}
            </span>
            <span className="text-sm font-medium hidden sm:inline">Date & Time</span>
          </div>
          <div className="w-4 sm:w-8 h-px bg-white" />
          
          {/* Step 3: Info */}
          <div className={`flex items-center gap-2 ${step === 'info' ? 'text-pink-600' : 'text-black'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              step === 'info' ? 'bg-pink-500 text-white' : 
              step === 'confirm' ? 'bg-green-500 text-white' : 'bg-white'
            }`}>
              {step === 'confirm' ? '✓' : '3'}
            </span>
            <span className="text-sm font-medium hidden sm:inline">Your Info</span>
          </div>
          <div className="w-4 sm:w-8 h-px bg-white" />
          
          {/* Step 4: Confirmed */}
          <div className={`flex items-center gap-2 ${step === 'confirm' ? 'text-pink-600' : 'text-black'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              step === 'confirm' ? 'bg-green-500 text-white' : 'bg-white'
            }`}>
              {step === 'confirm' ? '✓' : '4'}
            </span>
            <span className="text-sm font-medium hidden sm:inline">Done</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Step 1: Provider Selection */}
        {step === 'provider' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-black mb-2">Choose Your Provider</h3>
              <p className="text-sm text-black mb-4">
                Select who you'd like to see for your {service.name}
              </p>
              
              {loadingProviders ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl border-2 border-black animate-pulse">
                      <div className="w-16 h-16 rounded-full bg-white" />
                      <div className="flex-1">
                        <div className="h-5 w-32 bg-white rounded mb-2" />
                        <div className="h-4 w-24 bg-white rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="grid gap-4">
                    {availableProviders.map((provider) => (
                      <button
                        key={provider.id}
                        onClick={() => {
                          setUserChangedProvider(false); // Reset flag on manual selection
                          setSelectedProvider(provider);
                          setStep('datetime');
                        }}
                        className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left hover:shadow-md ${
                          selectedProvider?.id === provider.id
                            ? 'border-pink-500 bg-pink-50'
                            : 'border-black hover:border-pink-300'
                        }`}
                      >
                        {/* Provider Avatar */}
                        <div 
                          className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0"
                          style={{ backgroundColor: provider.color }}
                        >
                          {provider.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="font-semibold text-black">{provider.name}</h4>
                          <p className="text-sm text-black">{provider.title}</p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-black">
                            <span className="inline-flex items-center gap-1 bg-white px-2 py-1 rounded-full">
                              📅 {Object.entries(provider.schedule).filter(([_, v]) => v !== null).length} days/week
                            </span>
                          </div>
                        </div>
                        
                        <div className="text-pink-500">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </button>
                    ))}
                  </div>
                  
                  {availableProviders.length === 0 && (
                    <div className="text-center py-8 text-black">
                      <p>No providers available for this service.</p>
                      <p className="text-sm mt-2">Please call us at (630) 636-6193 to book.</p>
                    </div>
                  )}
                </>
              )}
            </div>
            
            {/* No preference option */}
            {availableProviders.length > 1 && (
              <button
                onClick={() => {
                  setSelectedProvider(availableProviders[0]); // Default to first
                  setStep('datetime');
                }}
                className="w-full py-3 text-black text-sm hover:text-black transition-colors"
              >
                No preference - show me the first available
              </button>
            )}
          </div>
        )}

        {/* Step 2: Date & Time Selection */}
        {step === 'datetime' && selectedProvider && (
          <div className="space-y-6">
            {/* Provider Summary */}
            <div className="flex items-center justify-between bg-white rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  style={{ backgroundColor: selectedProvider.color }}
                >
                  {selectedProvider.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-medium text-black">{selectedProvider.name}</p>
                  <p className="text-xs text-black">{selectedProvider.title}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setUserChangedProvider(true); // Prevent auto-select
                  setSelectedProvider(null);
                  setStep('provider');
                }}
                className="text-sm text-pink-600 hover:text-pink-700 font-medium"
              >
                Change
              </button>
            </div>

            {/* Date Selection — thumb-friendly tap targets */}
            <div>
              <h3 className="font-semibold text-black mb-3">Select a Date</h3>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide touch-pan-x" style={{ WebkitOverflowScrolling: 'touch' }}>
                {availableDates.map((date) => (
                  <button
                    key={date.toISOString()}
                    type="button"
                    onClick={() => {
                      setSelectedDate(date);
                      setSelectedTime(''); // Reset time when date changes
                    }}
                    className={`flex-shrink-0 min-h-[44px] min-w-[64px] px-4 py-3 rounded-xl text-center transition-all active:scale-[0.98] ${
                      selectedDate?.toDateString() === date.toDateString()
                        ? 'text-white'
                        : 'bg-white text-black hover:bg-white'
                    }`}
                    style={selectedDate?.toDateString() === date.toDateString() 
                      ? { backgroundColor: selectedProvider.color } 
                      : {}
                    }
                  >
                    <p className="text-xs font-medium">
                      {date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </p>
                    <p className="text-lg font-bold">{date.getDate()}</p>
                    <p className="text-xs">
                      {date.toLocaleDateString('en-US', { month: 'short' })}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Selection — only available slots are selectable; unavailable are grayed out */}
            {selectedDate && (
              <div>
                <h3 className="font-semibold text-black mb-3">
                  Select a Time for {formatDate(selectedDate)}
                </h3>
                {loadingAvailability ? (
                  <div className="py-6 text-center text-black text-sm">
                    Checking availability…
                  </div>
                ) : timeSlots.length > 0 ? (
                  <>
                    {hasAvailability && !anySlotAvailable && (
                      <p className="text-sm text-amber-700 bg-amber-50 rounded-lg px-3 py-2 mb-3">
                        No available times left on this day. Please pick another date.
                      </p>
                    )}
                    {!hasAvailability && !loadingAvailability && (
                      <p className="text-sm text-black mb-3">
                        Couldn&apos;t load availability. Please refresh or call (630) 636-6193.
                      </p>
                    )}
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {timeSlots.map((time) => {
                        const available = slotAvailable(time);
                        return (
                          <button
                            key={time}
                            type="button"
                            onClick={() => available && setSelectedTime(time)}
                            disabled={!available}
                            className={`min-h-[44px] px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                              !available
                                ? 'bg-white text-black cursor-not-allowed line-through'
                                : selectedTime === time
                                  ? 'text-white'
                                  : 'bg-white text-black hover:bg-white active:scale-[0.98]'
                            }`}
                            style={available && selectedTime === time && selectedProvider
                              ? { backgroundColor: selectedProvider.color }
                              : undefined
                            }
                            title={!available ? 'This time is not available' : undefined}
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-6 bg-white rounded-xl">
                    <p className="text-black">
                      {selectedProvider?.name} is not available on this day.
                    </p>
                    <p className="text-sm text-black mt-1">
                      Please select a different date.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Continue Button */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSelectedProvider(null);
                  setStep('provider');
                }}
                className="px-6 py-3 text-black font-medium hover:bg-white rounded-xl transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setStep('info')}
                disabled={!selectedDate || !selectedTime || !slotAvailable(selectedTime)}
                className="flex-1 py-3 bg-pink-500 text-white font-semibold rounded-xl hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Client Information */}
        {step === 'info' && (
          <div className="space-y-6">
            {/* Summary */}
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-black">Your Appointment</p>
                <button
                  onClick={() => setStep('datetime')}
                  className="text-sm text-pink-600 hover:text-pink-700 font-medium"
                >
                  Change
                </button>
              </div>
              <div className="flex items-center gap-3">
                {selectedProvider && (
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                    style={{ backgroundColor: selectedProvider.color }}
                  >
                    {selectedProvider.name.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-black">
                    {selectedDate && formatDate(selectedDate)} at {selectedTime}
                  </p>
                  <p className="text-sm text-black">with {selectedProvider?.name}</p>
                </div>
              </div>
            </div>

            {/* Are you a new client? */}
            <div>
              <h3 className="font-semibold text-black mb-3">Have you visited us before?</h3>
              <div className="flex gap-3">
                <button
                  onClick={() => updateField('isNewClient', true)}
                  className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                    formData.isNewClient
                      ? 'bg-pink-500 text-white'
                      : 'bg-white text-black hover:bg-white'
                  }`}
                >
                  I'm New! 🎉
                </button>
                <button
                  onClick={() => updateField('isNewClient', false)}
                  className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                    !formData.isNewClient
                      ? 'bg-pink-500 text-white'
                      : 'bg-white text-black hover:bg-white'
                  }`}
                >
                  Returning Client
                </button>
              </div>
            </div>

            {/* Contact Form */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    autoComplete="given-name"
                    value={formData.firstName}
                    onChange={(e) => updateField('firstName', e.target.value)}
                    className="w-full min-h-[44px] px-4 py-3 border border-black rounded-lg focus:ring-2 focus:ring-[#FF2D8E] focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    autoComplete="family-name"
                    value={formData.lastName}
                    onChange={(e) => updateField('lastName', e.target.value)}
                    className="w-full min-h-[44px] px-4 py-3 border border-black rounded-lg focus:ring-2 focus:ring-[#FF2D8E] focus:border-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  className="w-full min-h-[44px] px-4 py-3 border border-black rounded-lg focus:ring-2 focus:ring-[#FF2D8E] focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="(630) 555-1234"
                  className="w-full min-h-[44px] px-4 py-3 border border-black rounded-lg focus:ring-2 focus:ring-[#FF2D8E] focus:border-pink-500"
                />
              </div>

              {formData.isNewClient && (
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.dateOfBirth}
                    onChange={(e) => updateField('dateOfBirth', e.target.value)}
                    className="w-full min-h-[44px] px-4 py-3 border border-black rounded-lg focus:ring-2 focus:ring-[#FF2D8E] focus:border-pink-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Notes (optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => updateField('notes', e.target.value)}
                  rows={2}
                  placeholder="Any special requests or concerns..."
                  className="w-full min-h-[44px] px-4 py-3 border border-black rounded-lg focus:ring-2 focus:ring-[#FF2D8E] focus:border-pink-500"
                />
              </div>

              {/* Policy reminder - compact */}
              <p className="text-xs text-black">
                24-hour cancellation notice required. By booking you agree to our{' '}
                <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:underline">terms</a> and{' '}
                <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:underline">privacy policy</a>.
              </p>

              {/* Agreements - compact */}
              <div className="space-y-3 pt-1">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreeToSMS}
                    onChange={(e) => updateField('agreeToSMS', e.target.checked)}
                    className="mt-1 w-4 h-4 min-w-[16px] min-h-[16px] text-pink-500 border-black rounded focus:ring-[#FF2D8E] shrink-0"
                  />
                  <span className="text-sm text-black">
                    Send me SMS reminders &amp; offers (msg rates may apply, reply STOP to opt out)
                  </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={formData.agreeToTerms}
                    onChange={(e) => updateField('agreeToTerms', e.target.checked)}
                    className="mt-1 w-4 h-4 min-w-[16px] min-h-[16px] text-pink-500 border-black rounded focus:ring-[#FF2D8E] shrink-0"
                  />
                  <span className="text-sm text-black">
                    I agree to the <a href="/terms" target="_blank" className="text-pink-600 hover:underline">terms</a> and <a href="/privacy" target="_blank" className="text-pink-600 hover:underline">privacy policy</a> *
                  </span>
                </label>
              </div>
            </div>

            {submitError && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm" role="alert">
                {submitError}
                <p className="mt-2 text-red-700">Please pick another time or call us at <a href="tel:6306366193" className="font-semibold underline">(630) 636-6193</a>.</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setStep('datetime')}
                className="px-6 py-3 text-black font-medium hover:bg-white rounded-xl transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={
                  !formData.firstName ||
                  !formData.lastName ||
                  !formData.email ||
                  !formData.phone ||
                  !formData.agreeToTerms ||
                  (formData.isNewClient && !formData.dateOfBirth) ||
                  isSubmitting
                }
                className="flex-1 py-3 bg-pink-500 text-white font-semibold rounded-xl hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {step === 'confirm' && (
          <div className="text-center py-8">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-4xl">✓</span>
            </div>
            <h2 className="text-2xl font-bold text-black mb-2">
              You're All Set!
            </h2>
            <p className="text-black mb-6">
              Your appointment has been booked. We've sent a confirmation to{' '}
              <strong>{formData.email}</strong>
            </p>

            <div className="bg-white rounded-xl p-6 max-w-sm mx-auto text-left mb-8">
              <h3 className="font-semibold text-black mb-3">Appointment Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-black">Service:</span>
                  <span className="text-black font-medium">{service.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black">Provider:</span>
                  <span className="text-black font-medium">{selectedProvider?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black">Date:</span>
                  <span className="text-black font-medium">
                    {selectedDate && formatFullDate(selectedDate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black">Time:</span>
                  <span className="text-black font-medium">{selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black">Duration:</span>
                  <span className="text-black font-medium">{service.duration_minutes} min</span>
                </div>
              </div>
            </div>

            <div className="bg-pink-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-pink-800">
                📍 <strong>Location:</strong> 74 W. Washington St, Oswego, IL 60543
              </p>
            </div>

            <div className="space-y-3">
              <a
                href={`https://calendar.google.com/calendar/r/eventedit?text=${encodeURIComponent(service.name + ' with ' + selectedProvider?.name + ' at Hello Gorgeous')}&dates=${selectedDate?.toISOString().split('T')[0].replace(/-/g, '')}&details=${encodeURIComponent('Your appointment at Hello Gorgeous Med Spa with ' + selectedProvider?.name)}&location=${encodeURIComponent('74 W. Washington St, Oswego, IL 60543')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-black text-black font-medium rounded-xl hover:bg-white transition-colors"
              >
                📅 Add to Calendar
              </a>

              <div className="bg-pink-50/80 border border-pink-200 rounded-xl p-4 text-center">
                <p className="text-sm text-pink-900 mb-2">Add Hello Gorgeous to your home screen for 1-tap booking.</p>
                <a
                  href="/get-app"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-pink-500 text-white font-semibold rounded-xl hover:bg-pink-600 transition-colors"
                >
                  → Go to /get-app
                </a>
              </div>
            </div>

            {/* Reminder about policies */}
            <div className="bg-white rounded-xl p-4 mt-6 text-left max-w-sm mx-auto">
              <p className="text-xs text-black">
                <strong>Reminder:</strong> Please arrive 5-10 minutes early. If you need to cancel or 
                reschedule, please provide at least 24 hours notice to avoid a cancellation fee.
              </p>
            </div>

            <p className="text-sm text-black mt-8">
              Need to make changes?{' '}
              <a href="tel:6306366193" className="text-pink-600 hover:underline">
                Call us at (630) 636-6193
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
