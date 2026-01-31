'use client';

// ============================================================
// PUBLIC BOOKING FORM COMPONENT
// Collects client info and schedules appointment
// ============================================================

import { useState } from 'react';
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

interface Props {
  service: Service;
}

// Generate time slots
const TIME_SLOTS = [
  '9:00 AM', '9:30 AM',
  '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM',
  '1:00 PM', '1:30 PM',
  '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM',
  '4:00 PM', '4:30 PM',
];

// Generate next 30 days
function getAvailableDates() {
  const dates = [];
  const today = new Date();
  
  for (let i = 1; i <= 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    // Skip Sundays (0) and Saturdays (6)
    if (date.getDay() !== 0 && date.getDay() !== 6) {
      dates.push(date);
    }
  }
  
  return dates;
}

export default function BookingForm({ service }: Props) {
  const router = useRouter();
  const [step, setStep] = useState<'datetime' | 'info' | 'confirm'>('datetime');
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const availableDates = getAvailableDates();

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // TODO: Save to Supabase
    // For now, simulate booking
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Show confirmation
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
        <div className="flex items-center justify-center gap-4">
          <div className={`flex items-center gap-2 ${step === 'datetime' ? 'text-pink-600' : 'text-gray-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              step === 'datetime' ? 'bg-pink-500 text-white' : 
              step === 'info' || step === 'confirm' ? 'bg-green-500 text-white' : 'bg-gray-300'
            }`}>
              {step === 'info' || step === 'confirm' ? '✓' : '1'}
            </span>
            <span className="text-sm font-medium hidden sm:inline">Date & Time</span>
          </div>
          <div className="w-8 h-px bg-gray-300" />
          <div className={`flex items-center gap-2 ${step === 'info' ? 'text-pink-600' : 'text-gray-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              step === 'info' ? 'bg-pink-500 text-white' : 
              step === 'confirm' ? 'bg-green-500 text-white' : 'bg-gray-300'
            }`}>
              {step === 'confirm' ? '✓' : '2'}
            </span>
            <span className="text-sm font-medium hidden sm:inline">Your Info</span>
          </div>
          <div className="w-8 h-px bg-gray-300" />
          <div className={`flex items-center gap-2 ${step === 'confirm' ? 'text-pink-600' : 'text-gray-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              step === 'confirm' ? 'bg-green-500 text-white' : 'bg-gray-300'
            }`}>
              {step === 'confirm' ? '✓' : '3'}
            </span>
            <span className="text-sm font-medium hidden sm:inline">Confirmed</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Step 1: Date & Time Selection */}
        {step === 'datetime' && (
          <div className="space-y-6">
            {/* Date Selection */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Select a Date</h3>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {availableDates.slice(0, 14).map((date) => (
                  <button
                    key={date.toISOString()}
                    onClick={() => setSelectedDate(date)}
                    className={`flex-shrink-0 px-4 py-3 rounded-xl text-center transition-all ${
                      selectedDate?.toDateString() === date.toDateString()
                        ? 'bg-pink-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
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
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {TIME_SLOTS.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        selectedTime === time
                          ? 'bg-pink-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Continue Button */}
            <button
              onClick={() => setStep('info')}
              disabled={!selectedDate || !selectedTime}
              className="w-full py-3 bg-pink-500 text-white font-semibold rounded-xl hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 2: Client Information */}
        {step === 'info' && (
          <div className="space-y-6">
            {/* Summary */}
            <div className="bg-pink-50 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-pink-600 font-medium">Your Appointment</p>
                <p className="font-semibold text-gray-900">
                  {selectedDate && formatDate(selectedDate)} at {selectedTime}
                </p>
              </div>
              <button
                onClick={() => setStep('datetime')}
                className="text-sm text-pink-600 hover:text-pink-700 font-medium"
              >
                Change
              </button>
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
                  I'm New!
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

        {/* Step 3: Confirmation */}
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
                href={`https://calendar.google.com/calendar/r/eventedit?text=${encodeURIComponent(service.name + ' at Hello Gorgeous')}&dates=${selectedDate?.toISOString().split('T')[0].replace(/-/g, '')}&details=${encodeURIComponent('Your appointment at Hello Gorgeous Med Spa')}&location=${encodeURIComponent('74 W. Washington St, Oswego, IL 60543')}`}
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
