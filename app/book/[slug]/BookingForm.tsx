'use client';

// ============================================================
// PUBLIC BOOKING FORM COMPONENT
// Collects client info and schedules appointment
// With provider selection and schedule-based availability
// ============================================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
    [day: string]: { start: string; end: string } | null;
  };
}

interface Props {
  service: Service;
}

// Provider data - Danielle and Ryan with their schedules (from Fresha)
const PROVIDERS: Provider[] = [
  {
    id: 'danielle-001',
    name: 'Danielle Glazier-Alcala',
    title: 'Owner & Aesthetic Specialist',
    color: '#EC4899', // pink
    schedule: {
      // From Fresha: Mon-Tue 11am-4pm, Wed OFF, Thu-Fri 11am-4pm
      monday: { start: '11:00', end: '16:00' },
      tuesday: { start: '11:00', end: '16:00' },
      wednesday: null, // Off Wednesdays
      thursday: { start: '11:00', end: '16:00' },
      friday: { start: '11:00', end: '16:00' },
      saturday: null,
      sunday: null,
    },
  },
  {
    id: 'ryan-001',
    name: 'Ryan Kent',
    title: 'APRN, FNP-BC',
    color: '#8B5CF6', // purple
    schedule: {
      // From Fresha: Mon-Tue-Wed 10am-5pm, Thu OFF, Fri 10am-3pm
      monday: { start: '10:00', end: '17:00' },
      tuesday: { start: '10:00', end: '17:00' },
      wednesday: { start: '10:00', end: '17:00' },
      thursday: null, // Off Thursdays
      friday: { start: '10:00', end: '15:00' },
      saturday: null,
      sunday: null,
    },
  },
];

// Services that only specific providers can do
const PROVIDER_SERVICES: { [providerId: string]: string[] } = {
  'danielle-001': [
    // Danielle does: Lashes, Brows, Facials, Skincare
    'lash', 'brow', 'facial', 'dermaplanning', 'hydra', 'chemical-peel', 
    'glow2facial', 'geneo', 'lamination', 'wax', 'extension', 'lift', 'tint',
    'high-frequency', 'anteage-microneedling', 'salmon', 'glass-glow'
  ],
  'ryan-001': [
    // Ryan does: Injectables, Medical treatments, IV therapy, Weight loss
    'botox', 'filler', 'jeuveau', 'dysport', 'lip', 'semaglutide', 'tirzepatide',
    'retatrutide', 'weight', 'iv', 'vitamin', 'prp', 'pellet', 'hormone', 'bhrt',
    'medical', 'trigger', 'kybella', 'consult', 'laser', 'ipl', 'photofacial'
  ],
};

// Check if provider can do this service
function canProviderDoService(provider: Provider, serviceSlug: string): boolean {
  const providerKeywords = PROVIDER_SERVICES[provider.id] || [];
  const slug = serviceSlug.toLowerCase();
  
  // Check if any keyword matches
  return providerKeywords.some(keyword => slug.includes(keyword));
}

// Get available providers for a service
function getProvidersForService(serviceSlug: string): Provider[] {
  const eligible = PROVIDERS.filter(p => canProviderDoService(p, serviceSlug));
  // If no specific match, both can do it (consultations, etc)
  return eligible.length > 0 ? eligible : PROVIDERS;
}

// Generate time slots based on provider schedule
function getTimeSlotsForProvider(provider: Provider, date: Date, duration: number): string[] {
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const schedule = provider.schedule[dayName];
  
  if (!schedule) return []; // Provider doesn't work this day
  
  const slots: string[] = [];
  const [startHour, startMin] = schedule.start.split(':').map(Number);
  const [endHour, endMin] = schedule.end.split(':').map(Number);
  
  let currentHour = startHour;
  let currentMin = startMin;
  
  while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
    // Don't show slots that would extend past end time
    const slotEndMin = currentMin + duration;
    const slotEndHour = currentHour + Math.floor(slotEndMin / 60);
    const actualEndMin = slotEndMin % 60;
    
    if (slotEndHour < endHour || (slotEndHour === endHour && actualEndMin <= endMin)) {
      const hour12 = currentHour > 12 ? currentHour - 12 : currentHour === 0 ? 12 : currentHour;
      const ampm = currentHour >= 12 ? 'PM' : 'AM';
      const minStr = currentMin.toString().padStart(2, '0');
      slots.push(`${hour12}:${minStr} ${ampm}`);
    }
    
    // Move to next slot (30 min intervals)
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
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      if (!provider.schedule[dayName]) continue; // Provider doesn't work this day
    }
    
    dates.push(date);
    if (dates.length >= 21) break; // Show 3 weeks max
  }
  
  return dates;
}

export default function BookingForm({ service }: Props) {
  const router = useRouter();
  const [step, setStep] = useState<'provider' | 'datetime' | 'info' | 'confirm'>('provider');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
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

  // Get providers who can do this service
  const availableProviders = getProvidersForService(service.slug);
  
  // Get dates based on selected provider
  const availableDates = getAvailableDates(selectedProvider);
  
  // Get time slots based on provider and date
  const timeSlots = selectedProvider && selectedDate 
    ? getTimeSlotsForProvider(selectedProvider, selectedDate, service.duration_minutes)
    : [];

  // Auto-select if only one provider
  useEffect(() => {
    if (availableProviders.length === 1 && !selectedProvider) {
      setSelectedProvider(availableProviders[0]);
      setStep('datetime');
    }
  }, [availableProviders, selectedProvider]);

  // Reset date/time when provider changes
  useEffect(() => {
    setSelectedDate(null);
    setSelectedTime('');
  }, [selectedProvider?.id]);

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // TODO: Save to Supabase with provider_id
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setStep('confirm');
    setIsSubmitting(false);
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
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Progress Steps */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-center gap-2 sm:gap-4">
          {/* Step 1: Provider */}
          <div className={`flex items-center gap-2 ${step === 'provider' ? 'text-pink-600' : 'text-gray-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              step === 'provider' ? 'bg-pink-500 text-white' : 
              ['datetime', 'info', 'confirm'].includes(step) ? 'bg-green-500 text-white' : 'bg-gray-300'
            }`}>
              {['datetime', 'info', 'confirm'].includes(step) ? '✓' : '1'}
            </span>
            <span className="text-sm font-medium hidden sm:inline">Provider</span>
          </div>
          <div className="w-4 sm:w-8 h-px bg-gray-300" />
          
          {/* Step 2: Date & Time */}
          <div className={`flex items-center gap-2 ${step === 'datetime' ? 'text-pink-600' : 'text-gray-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              step === 'datetime' ? 'bg-pink-500 text-white' : 
              ['info', 'confirm'].includes(step) ? 'bg-green-500 text-white' : 'bg-gray-300'
            }`}>
              {['info', 'confirm'].includes(step) ? '✓' : '2'}
            </span>
            <span className="text-sm font-medium hidden sm:inline">Date & Time</span>
          </div>
          <div className="w-4 sm:w-8 h-px bg-gray-300" />
          
          {/* Step 3: Info */}
          <div className={`flex items-center gap-2 ${step === 'info' ? 'text-pink-600' : 'text-gray-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              step === 'info' ? 'bg-pink-500 text-white' : 
              step === 'confirm' ? 'bg-green-500 text-white' : 'bg-gray-300'
            }`}>
              {step === 'confirm' ? '✓' : '3'}
            </span>
            <span className="text-sm font-medium hidden sm:inline">Your Info</span>
          </div>
          <div className="w-4 sm:w-8 h-px bg-gray-300" />
          
          {/* Step 4: Confirmed */}
          <div className={`flex items-center gap-2 ${step === 'confirm' ? 'text-pink-600' : 'text-gray-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              step === 'confirm' ? 'bg-green-500 text-white' : 'bg-gray-300'
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
              <h3 className="font-semibold text-gray-900 mb-2">Choose Your Provider</h3>
              <p className="text-sm text-gray-500 mb-4">
                Select who you'd like to see for your {service.name}
              </p>
              
              <div className="grid gap-4">
                {availableProviders.map((provider) => (
                  <button
                    key={provider.id}
                    onClick={() => {
                      setSelectedProvider(provider);
                      setStep('datetime');
                    }}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left hover:shadow-md ${
                      selectedProvider?.id === provider.id
                        ? 'border-pink-500 bg-pink-50'
                        : 'border-gray-200 hover:border-pink-300'
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
                      <h4 className="font-semibold text-gray-900">{provider.name}</h4>
                      <p className="text-sm text-gray-500">{provider.title}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                        <span className="inline-flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
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
                <div className="text-center py-8 text-gray-500">
                  <p>No providers available for this service.</p>
                  <p className="text-sm mt-2">Please call us at (630) 636-6193 to book.</p>
                </div>
              )}
            </div>
            
            {/* No preference option */}
            {availableProviders.length > 1 && (
              <button
                onClick={() => {
                  setSelectedProvider(availableProviders[0]); // Default to first
                  setStep('datetime');
                }}
                className="w-full py-3 text-gray-600 text-sm hover:text-gray-900 transition-colors"
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
            <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  style={{ backgroundColor: selectedProvider.color }}
                >
                  {selectedProvider.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{selectedProvider.name}</p>
                  <p className="text-xs text-gray-500">{selectedProvider.title}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedProvider(null);
                  setStep('provider');
                }}
                className="text-sm text-pink-600 hover:text-pink-700 font-medium"
              >
                Change
              </button>
            </div>

            {/* Date Selection */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Select a Date</h3>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {availableDates.map((date) => (
                  <button
                    key={date.toISOString()}
                    onClick={() => {
                      setSelectedDate(date);
                      setSelectedTime(''); // Reset time when date changes
                    }}
                    className={`flex-shrink-0 px-4 py-3 rounded-xl text-center transition-all ${
                      selectedDate?.toDateString() === date.toDateString()
                        ? 'text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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

            {/* Time Selection */}
            {selectedDate && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  Select a Time for {formatDate(selectedDate)}
                </h3>
                {timeSlots.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                          selectedTime === time
                            ? 'text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        style={selectedTime === time 
                          ? { backgroundColor: selectedProvider.color } 
                          : {}
                        }
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 bg-gray-50 rounded-xl">
                    <p className="text-gray-500">
                      {selectedProvider.name} is not available on this day.
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
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
                className="px-6 py-3 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setStep('info')}
                disabled={!selectedDate || !selectedTime}
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
                <p className="text-sm font-medium text-gray-500">Your Appointment</p>
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
                  <p className="font-semibold text-gray-900">
                    {selectedDate && formatDate(selectedDate)} at {selectedTime}
                  </p>
                  <p className="text-sm text-gray-500">with {selectedProvider?.name}</p>
                </div>
              </div>
            </div>

            {/* Are you a new client? */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Have you visited us before?</h3>
              <div className="flex gap-3">
                <button
                  onClick={() => updateField('isNewClient', true)}
                  className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                    formData.isNewClient
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  I'm New! 🎉
                </button>
                <button
                  onClick={() => updateField('isNewClient', false)}
                  className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                    !formData.isNewClient
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Returning Client
                </button>
              </div>
            </div>

            {/* Contact Form */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => updateField('firstName', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => updateField('lastName', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="(630) 555-1234"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
              </div>

              {formData.isNewClient && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.dateOfBirth}
                    onChange={(e) => updateField('dateOfBirth', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => updateField('notes', e.target.value)}
                  rows={2}
                  placeholder="Any special requests or concerns..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
              </div>

              {/* Agreements */}
              <div className="space-y-3 pt-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreeToSMS}
                    onChange={(e) => updateField('agreeToSMS', e.target.checked)}
                    className="mt-1 w-4 h-4 text-pink-500 border-gray-300 rounded focus:ring-pink-500"
                  />
                  <span className="text-sm text-gray-600">
                    Send me appointment reminders via text message
                  </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={formData.agreeToTerms}
                    onChange={(e) => updateField('agreeToTerms', e.target.checked)}
                    className="mt-1 w-4 h-4 text-pink-500 border-gray-300 rounded focus:ring-pink-500"
                  />
                  <span className="text-sm text-gray-600">
                    I agree to the{' '}
                    <a href="/terms" target="_blank" className="text-pink-600 hover:underline">
                      terms of service
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" target="_blank" className="text-pink-600 hover:underline">
                      privacy policy
                    </a> *
                  </span>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setStep('datetime')}
                className="px-6 py-3 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors"
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              You're All Set!
            </h2>
            <p className="text-gray-600 mb-6">
              Your appointment has been booked. We've sent a confirmation to{' '}
              <strong>{formData.email}</strong>
            </p>

            <div className="bg-gray-50 rounded-xl p-6 max-w-sm mx-auto text-left mb-8">
              <h3 className="font-semibold text-gray-900 mb-3">Appointment Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Service:</span>
                  <span className="text-gray-900 font-medium">{service.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Provider:</span>
                  <span className="text-gray-900 font-medium">{selectedProvider?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date:</span>
                  <span className="text-gray-900 font-medium">
                    {selectedDate && formatFullDate(selectedDate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Time:</span>
                  <span className="text-gray-900 font-medium">{selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Duration:</span>
                  <span className="text-gray-900 font-medium">{service.duration_minutes} min</span>
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
                className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
              >
                📅 Add to Calendar
              </a>
            </div>

            <p className="text-sm text-gray-500 mt-8">
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
