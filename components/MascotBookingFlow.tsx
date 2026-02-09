"use client";

// ============================================================
// IN-CHAT BOOKING FLOW — Live appointment on schedule
// Service → Provider → Date → Time (from availability API) → Your info → Submit
// ============================================================

import React, { useState, useEffect } from "react";

type ServiceItem = { id: string; name: string; slug: string; duration_minutes: number };
type ProviderItem = {
  id: string;
  name: string;
  title: string;
  color: string;
  schedule: { [day: number]: { start: string; end: string } | null };
};

function getAvailableDates(provider: ProviderItem | null): Date[] {
  const dates: Date[] = [];
  const today = new Date();
  for (let i = 1; i <= 45; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    if (d.getDay() === 0 || d.getDay() === 6) continue;
    if (provider) {
      const dayOfWeek = d.getDay();
      if (!provider.schedule[dayOfWeek]) continue;
    }
    dates.push(d);
    if (dates.length >= 21) break;
  }
  return dates;
}

type Step = "service" | "provider" | "datetime" | "info" | "success";

interface Props {
  onClose: () => void;
  onSuccess?: () => void;
}

export function MascotBookingFlow({ onClose, onSuccess }: Props) {
  const [step, setStep] = useState<Step>("service");
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [providers, setProviders] = useState<ProviderItem[]>([]);
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<ProviderItem | null>(null);
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [timeSlots, setTimeSlots] = useState<{ time: string; available: boolean }[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedTime, setSelectedTime] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    isNewClient: true,
    notes: "",
    agreeToTerms: false,
    agreeToSMS: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/booking/services")
      .then((r) => r.json())
      .then((data) => {
        setServices(data.services || []);
      })
      .catch(() => setServices([]))
      .finally(() => setLoadingServices(false));
  }, []);

  useEffect(() => {
    if (!selectedService) return;
    setLoadingProviders(true);
    setProviders([]);
    setSelectedProvider(null);
    setSelectedDate(null);
    setSelectedTime("");
    fetch(`/api/booking/providers?serviceSlug=${selectedService.slug}`)
      .then((r) => r.json())
      .then((data) => {
        setProviders(data.providers || []);
        if (data.providers?.length === 1) setSelectedProvider(data.providers[0]);
      })
      .catch(() => setProviders([]))
      .finally(() => setLoadingProviders(false));
  }, [selectedService]);

  useEffect(() => {
    if (!selectedProvider) {
      setAvailableDates([]);
      return;
    }
    setAvailableDates(getAvailableDates(selectedProvider));
    setSelectedDate(null);
    setSelectedTime("");
    setTimeSlots([]);
  }, [selectedProvider]);

  useEffect(() => {
    if (!selectedProvider || !selectedDate || !selectedService) {
      setTimeSlots([]);
      return;
    }
    setLoadingSlots(true);
    const dateStr = selectedDate.toISOString().slice(0, 10);
    fetch(
      `/api/availability?provider_id=${encodeURIComponent(selectedProvider.id)}&date=${dateStr}&duration=${selectedService.duration_minutes}`
    )
      .then((r) => r.json())
      .then((data) => {
        const slots = (data.slots || []).filter((s: { available: boolean }) => s.available).map((s: { time: string }) => ({ time: s.time, available: true }));
        setTimeSlots(slots);
      })
      .catch(() => setTimeSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [selectedProvider, selectedDate, selectedService]);

  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

  const handleSubmit = async () => {
    if (!selectedService || !selectedProvider || !selectedDate || !selectedTime) return;
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/booking/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceSlug: selectedService.slug,
          serviceId: selectedService.id,
          providerId: selectedProvider.id,
          date: selectedDate.toISOString(),
          time: selectedTime,
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          dateOfBirth: form.dateOfBirth || null,
          isNewClient: form.isNewClient,
          notes: form.notes,
          agreeToTerms: form.agreeToTerms,
          agreeToSMS: form.agreeToSMS,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Booking failed");
      setStep("success");
      onSuccess?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmitInfo = Boolean(
    form.firstName &&
    form.lastName &&
    form.email &&
    form.phone &&
    form.agreeToTerms &&
    (!form.isNewClient || form.dateOfBirth)
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">
            {step === "success" ? "You're booked!" : "Book an appointment"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {step === "success" && (
            <div className="text-center py-6">
              <p className="text-lg text-gray-800 mb-2">Your appointment is on the schedule.</p>
              <p className="text-sm text-gray-500">
                We'll send confirmation and reminders to your email and phone.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-6 px-6 py-2.5 bg-pink-500 text-white font-medium rounded-xl hover:bg-pink-600"
              >
                Done
              </button>
            </div>
          )}

          {step === "service" && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Choose a service</p>
              {loadingServices ? (
                <div className="animate-pulse space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-12 bg-gray-100 rounded-lg" />
                  ))}
                </div>
              ) : services.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No online booking available right now. Please call us to book.
                </p>
              ) : (
                <div className="space-y-2">
                  {services.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setSelectedService(s);
                        setStep("provider");
                      }}
                      className="w-full text-left px-4 py-3 rounded-xl border-2 border-gray-200 hover:border-pink-300 hover:bg-pink-50/50"
                    >
                      <span className="font-medium text-gray-900">{s.name}</span>
                      <span className="text-gray-500 text-sm block">{s.duration_minutes} min</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === "provider" && selectedService && (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => setStep("service")}
                className="text-sm text-pink-600 hover:text-pink-700"
              >
                ← Change service
              </button>
              <p className="text-sm text-gray-500">Choose your provider</p>
              {loadingProviders ? (
                <div className="animate-pulse h-20 bg-gray-100 rounded-xl" />
              ) : (
                <div className="space-y-2">
                  {providers.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setSelectedProvider(p);
                        setStep("datetime");
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-gray-200 hover:border-pink-300"
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                        style={{ backgroundColor: p.color }}
                      >
                        {p.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div className="text-left">
                        <span className="font-medium text-gray-900">{p.name}</span>
                        <span className="text-gray-500 text-sm block">{p.title}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === "datetime" && selectedProvider && selectedService && (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => setStep("provider")}
                className="text-sm text-pink-600 hover:text-pink-700"
              >
                ← Change provider
              </button>
              <p className="text-sm text-gray-500">Select date</p>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {availableDates.map((d) => (
                  <button
                    key={d.toISOString()}
                    type="button"
                    onClick={() => {
                      setSelectedDate(d);
                      setSelectedTime("");
                    }}
                    className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm ${
                      selectedDate?.toDateString() === d.toDateString()
                        ? "bg-pink-500 text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {d.toLocaleDateString("en-US", { weekday: "short" })} {d.getDate()}
                  </button>
                ))}
              </div>
              {selectedDate && (
                <>
                  <p className="text-sm text-gray-500">Select time</p>
                  {loadingSlots ? (
                    <div className="animate-pulse h-10 bg-gray-100 rounded-lg" />
                  ) : timeSlots.length === 0 ? (
                    <p className="text-sm text-gray-500">No slots this day. Pick another date.</p>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.map(({ time }) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setSelectedTime(time)}
                          className={`py-2 rounded-lg text-sm font-medium ${
                            selectedTime === time ? "bg-pink-500 text-white" : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep("provider")}
                  className="px-4 py-2 text-gray-600 text-sm font-medium"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep("info")}
                  disabled={!selectedDate || !selectedTime}
                  className="flex-1 py-2.5 bg-pink-500 text-white font-medium rounded-xl disabled:opacity-50"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === "info" && selectedProvider && selectedDate && selectedService && (
            <div className="space-y-4">
              <div className="bg-pink-50 rounded-xl p-3 text-sm">
                <p className="font-medium text-gray-900">
                  {formatDate(selectedDate)} at {selectedTime}
                </p>
                <p className="text-gray-600">{selectedService.name} with {selectedProvider.name}</p>
              </div>
              <button
                type="button"
                onClick={() => setStep("datetime")}
                className="text-sm text-pink-600 hover:text-pink-700"
              >
                ← Change date/time
              </button>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="First name *"
                  value={form.firstName}
                  onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
                <input
                  type="text"
                  placeholder="Last name *"
                  value={form.lastName}
                  onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
              <input
                type="email"
                placeholder="Email *"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
              <input
                type="tel"
                placeholder="Phone *"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
              {form.isNewClient && (
                <input
                  type="date"
                  placeholder="Date of birth"
                  value={form.dateOfBirth}
                  onChange={(e) => setForm((f) => ({ ...f, dateOfBirth: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, isNewClient: true }))}
                  className={`flex-1 py-2 rounded-lg text-sm ${form.isNewClient ? "bg-pink-500 text-white" : "bg-gray-100"}`}
                >
                  New client
                </button>
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, isNewClient: false }))}
                  className={`flex-1 py-2 rounded-lg text-sm ${!form.isNewClient ? "bg-pink-500 text-white" : "bg-gray-100"}`}
                >
                  Returning
                </button>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.agreeToSMS}
                  onChange={(e) => setForm((f) => ({ ...f, agreeToSMS: e.target.checked }))}
                  className="rounded border-gray-300 text-pink-500"
                />
                Send reminders by text
              </label>
              <label className="flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.agreeToTerms}
                  onChange={(e) => setForm((f) => ({ ...f, agreeToTerms: e.target.checked }))}
                  className="mt-0.5 rounded border-gray-300 text-pink-500"
                />
                I agree to the cancellation policy and terms *
              </label>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep("datetime")}
                  className="px-4 py-2 text-gray-600 text-sm font-medium"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!canSubmitInfo || submitting}
                  className="flex-1 py-2.5 bg-pink-500 text-white font-medium rounded-xl disabled:opacity-50"
                >
                  {submitting ? "Booking…" : "Book it"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
