'use client';

// ============================================================
// BOOKING FORM - Date/Time Selection Component
// ============================================================

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Service {
  id: string;
  name: string;
  slug: string;
  duration_minutes: number;
  price_cents: number;
  price_display: string;
  deposit_required: boolean;
  deposit_amount_cents: number | null;
  min_advance_booking_hours: number;
  max_advance_booking_days: number;
}

interface Location {
  id: string;
  name: string;
  business_hours: Record<string, { open: string; close: string } | null>;
  timezone: string;
}

interface BookingFormProps {
  service: Service;
  location: Location | null;
}

// Generate next 30 days
function generateDates(daysAhead: number): Date[] {
  const dates: Date[] = [];
  const today = new Date();
  
  for (let i = 1; i <= daysAhead; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    dates.push(date);
  }
  
  return dates;
}

// Generate time slots for a day
function generateTimeSlots(
  date: Date,
  businessHours: Record<string, { open: string; close: string } | null>,
  durationMinutes: number
): string[] {
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayName = dayNames[date.getDay()];
  const hours = businessHours[dayName];
  
  if (!hours) return []; // Closed
  
  const slots: string[] = [];
  const [openHour, openMin] = hours.open.split(':').map(Number);
  const [closeHour, closeMin] = hours.close.split(':').map(Number);
  
  let currentHour = openHour;
  let currentMin = openMin;
  
  while (
    currentHour < closeHour ||
    (currentHour === closeHour && currentMin + durationMinutes <= closeMin)
  ) {
    const timeStr = `${currentHour.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}`;
    slots.push(timeStr);
    
    // Increment by 30 minutes
    currentMin += 30;
    if (currentMin >= 60) {
      currentMin = 0;
      currentHour++;
    }
  }
  
  return slots;
}

// Format time for display
function formatTime(time: string): string {
  const [hour, min] = time.split(':').map(Number);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${min.toString().padStart(2, '0')} ${ampm}`;
}

// Format date for display
function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export default function BookingForm({ service, location }: BookingFormProps) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dates = generateDates(Math.min(service.max_advance_booking_days, 30));
  
  const timeSlots = selectedDate && location?.business_hours
    ? generateTimeSlots(selectedDate, location.business_hours, service.duration_minutes)
    : [];

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime) {
      setError('Please select a date and time');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // In production, this would call the booking API
      // For now, we'll simulate success and show confirmation
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store booking intent in session/localStorage for confirmation page
      const bookingData = {
        serviceId: service.id,
        serviceName: service.name,
        date: selectedDate.toISOString(),
        time: selectedTime,
        notes,
        locationId: location?.id,
      };
      
      sessionStorage.setItem('pendingBooking', JSON.stringify(bookingData));
      
      // Redirect to confirmation/payment page
      if (service.deposit_required) {
        router.push(`/portal/book/checkout?service=${service.slug}`);
      } else {
        router.push(`/portal/book/confirm?service=${service.slug}`);
      }
    } catch (err) {
      setError('Failed to process booking. Please try again.');
      console.error('Booking error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Date Selection */}
      <section className="bg-white rounded-2xl border border-black p-6">
        <h2 className="font-semibold text-black mb-4 flex items-center gap-2">
          <span>📅</span> Select a Date
        </h2>
        
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
          {dates.map((date) => {
            const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
            const dayNum = date.getDate();
            const month = date.toLocaleDateString('en-US', { month: 'short' });
            
            // Check if location is open this day
            const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
            const isOpen = location?.business_hours?.[dayNames[date.getDay()]] !== null;
            
            const isSelected = selectedDate?.toDateString() === date.toDateString();
            
            return (
              <button
                key={date.toISOString()}
                onClick={() => {
                  setSelectedDate(date);
                  setSelectedTime(null);
                }}
                disabled={!isOpen}
                className={`flex-shrink-0 w-16 py-3 rounded-xl border-2 transition-all ${
                  isSelected
                    ? 'border-pink-500 bg-pink-50 text-pink-600'
                    : isOpen
                    ? 'border-black hover:border-pink-300 hover:bg-pink-50'
                    : 'border-black bg-white text-black cursor-not-allowed'
                }`}
              >
                <div className="text-xs font-medium">{dayName}</div>
                <div className="text-xl font-bold">{dayNum}</div>
                <div className="text-xs text-black">{month}</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Time Selection */}
      {selectedDate && (
        <section className="bg-white rounded-2xl border border-black p-6">
          <h2 className="font-semibold text-black mb-4 flex items-center gap-2">
            <span>🕐</span> Select a Time
            <span className="text-sm font-normal text-black">
              ({formatDate(selectedDate)})
            </span>
          </h2>
          
          {timeSlots.length === 0 ? (
            <p className="text-black text-center py-4">
              No available times for this date. Please select another date.
            </p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {timeSlots.map((time) => {
                const isSelected = selectedTime === time;
                
                return (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`py-2.5 px-3 rounded-lg border-2 text-sm font-medium transition-all ${
                      isSelected
                        ? 'border-pink-500 bg-pink-50 text-pink-600'
                        : 'border-black hover:border-pink-300 hover:bg-pink-50'
                    }`}
                  >
                    {formatTime(time)}
                  </button>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* Notes */}
      {selectedDate && selectedTime && (
        <section className="bg-white rounded-2xl border border-black p-6">
          <h2 className="font-semibold text-black mb-4 flex items-center gap-2">
            <span>📝</span> Notes (Optional)
          </h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any special requests or information we should know?"
            className="w-full px-4 py-3 rounded-xl border border-black focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none resize-none"
            rows={3}
          />
        </section>
      )}

      {/* Summary & Submit */}
      {selectedDate && selectedTime && (
        <section className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl border border-pink-100 p-6">
          <h2 className="font-semibold text-black mb-4">Booking Summary</h2>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-black">Service</span>
              <span className="font-medium">{service.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black">Date</span>
              <span className="font-medium">{formatDate(selectedDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black">Time</span>
              <span className="font-medium">{formatTime(selectedTime)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black">Duration</span>
              <span className="font-medium">{service.duration_minutes} min</span>
            </div>
            <hr className="border-pink-200" />
            <div className="flex justify-between text-lg">
              <span className="font-semibold">
                {service.deposit_required ? 'Deposit Due Today' : 'Price'}
              </span>
              <span className="font-bold text-pink-600">
                {service.deposit_required
                  ? `$${((service.deposit_amount_cents || 0) / 100).toFixed(0)}`
                  : service.price_display}
              </span>
            </div>
            {service.deposit_required && (
              <p className="text-sm text-black">
                Full service price: {service.price_display} (balance due at appointment)
              </p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span>
                Processing...
              </span>
            ) : service.deposit_required ? (
              'Continue to Payment →'
            ) : (
              'Confirm Booking →'
            )}
          </button>
        </section>
      )}
    </div>
  );
}
