'use client';

// ============================================================
// NEW APPOINTMENT PAGE
// Book a new appointment
// ============================================================

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

// Mock data - will be replaced with Supabase
const MOCK_SERVICES = [
  { id: 's1', name: 'Botox/Dysport/Jeuveau', category: 'Botox & Neurotoxins', duration: 30, price: '$10/unit' },
  { id: 's2', name: 'Botox - New Client Special', category: 'Botox & Neurotoxins', duration: 45, price: '$199' },
  { id: 's3', name: 'Lip Flip', category: 'Botox & Neurotoxins', duration: 15, price: '$150' },
  { id: 's4', name: 'Dermal Filler - Per Syringe', category: 'Dermal Fillers', duration: 45, price: '$650' },
  { id: 's5', name: 'Filler - 2 Syringe Special', category: 'Dermal Fillers', duration: 60, price: '$1,200' },
  { id: 's6', name: 'Semaglutide', category: 'Weight Loss', duration: 30, price: '$400' },
  { id: 's7', name: 'Tirzepatide', category: 'Weight Loss', duration: 30, price: '$500' },
  { id: 's8', name: 'Glass Glow Facial', category: 'Facials', duration: 60, price: '$175' },
  { id: 's9', name: 'Dermaplaning', category: 'Facials', duration: 45, price: '$75' },
  { id: 's10', name: 'Chemical Peel', category: 'Facials', duration: 45, price: '$125' },
  { id: 's11', name: 'Myers Cocktail IV', category: 'IV Therapy', duration: 45, price: '$175' },
  { id: 's12', name: 'Vitamin Injection', category: 'IV Therapy', duration: 15, price: '$25' },
  { id: 's13', name: 'Free Consultation', category: 'Consultations', duration: 30, price: 'Free' },
];

const PROVIDERS = [
  { id: 'p1', name: 'Ryan Kent, APRN', services: ['all'] },
  { id: 'p2', name: 'Staff', services: ['Facials', 'IV Therapy'] },
];

const TIME_SLOTS = [
  '9:00 AM', '9:15 AM', '9:30 AM', '9:45 AM',
  '10:00 AM', '10:15 AM', '10:30 AM', '10:45 AM',
  '11:00 AM', '11:15 AM', '11:30 AM', '11:45 AM',
  '12:00 PM', '12:15 PM', '12:30 PM', '12:45 PM',
  '1:00 PM', '1:15 PM', '1:30 PM', '1:45 PM',
  '2:00 PM', '2:15 PM', '2:30 PM', '2:45 PM',
  '3:00 PM', '3:15 PM', '3:30 PM', '3:45 PM',
  '4:00 PM', '4:15 PM', '4:30 PM', '4:45 PM',
];

export default function NewAppointmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedClient = searchParams.get('client');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [clientSearch, setClientSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState<any>(preselectedClient ? {
    id: preselectedClient,
    name: 'Pre-selected Client',
  } : null);

  const [formData, setFormData] = useState({
    serviceId: '',
    providerId: 'p1',
    date: new Date().toISOString().split('T')[0],
    time: '',
    notes: '',
    sendConfirmation: true,
  });

  // Mock client search results
  const clientResults = clientSearch.length >= 2 ? [
    { id: 'c1', name: 'Jennifer Martinez', email: 'jennifer.martinez@email.com', phone: '(630) 555-1234' },
    { id: 'c2', name: 'Amanda Chen', email: 'amanda.chen@email.com', phone: '(630) 555-2345' },
    { id: 'c3', name: 'Sarah Johnson', email: 'sarah.j@email.com', phone: '(630) 555-3456' },
  ].filter((c) => c.name.toLowerCase().includes(clientSearch.toLowerCase())) : [];

  const selectedService = MOCK_SERVICES.find((s) => s.id === formData.serviceId);
  const selectedProvider = PROVIDERS.find((p) => p.id === formData.providerId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: Save to Supabase
    await new Promise((resolve) => setTimeout(resolve, 1000));

    alert('Appointment booked successfully!');
    router.push('/admin/appointments');
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
                    placeholder="Search by name, email, or phone..."
                    value={clientSearch}
                    onChange={(e) => setClientSearch(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>

                {clientResults.length > 0 && (
                  <div className="border border-gray-200 rounded-lg divide-y divide-gray-100">
                    {clientResults.map((client) => (
                      <button
                        key={client.id}
                        type="button"
                        onClick={() => {
                          setSelectedClient(client);
                          setClientSearch('');
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors"
                      >
                        <p className="font-medium text-gray-900">{client.name}</p>
                        <p className="text-sm text-gray-500">{client.email} • {client.phone}</p>
                      </button>
                    ))}
                  </div>
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
                {PROVIDERS.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto">
              {MOCK_SERVICES.map((service) => (
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
                      onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                      className="sr-only"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{service.name}</p>
                      <p className="text-sm text-gray-500">{service.category} • {service.duration} min</p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-900">{service.price}</p>
                </label>
              ))}
            </div>

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
                <span className="font-medium">{selectedProvider?.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{selectedService?.duration} minutes</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
              </div>

              {/* Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                <select
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                >
                  <option value="">Select time...</option>
                  {TIME_SLOTS.map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
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
                className="px-6 py-2.5 bg-pink-500 text-white font-semibold rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Booking...' : 'Book Appointment'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
