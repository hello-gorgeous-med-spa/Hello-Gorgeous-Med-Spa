'use client';

// ============================================================
// PROVIDER SCHEDULE EDITOR
// Set working hours, blocked time, and availability
// ============================================================

import { useState } from 'react';
import Link from 'next/link';

interface TimeSlot {
  start: string;
  end: string;
  isOff: boolean;
}

interface ProviderSchedule {
  id: string;
  name: string;
  title: string;
  schedule: Record<string, TimeSlot>;
  blockedDates: string[];
}

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DAY_LABELS: Record<string, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};

const TIME_OPTIONS = [
  '7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM',
  '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
  '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
  '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM',
  '7:00 PM', '7:30 PM', '8:00 PM',
];

// Mock providers
const MOCK_PROVIDERS: ProviderSchedule[] = [
  {
    id: 'p1',
    name: 'Ryan Kent',
    title: 'APRN',
    schedule: {
      monday: { start: '9:00 AM', end: '5:00 PM', isOff: false },
      tuesday: { start: '9:00 AM', end: '5:00 PM', isOff: false },
      wednesday: { start: '9:00 AM', end: '5:00 PM', isOff: false },
      thursday: { start: '9:00 AM', end: '5:00 PM', isOff: false },
      friday: { start: '9:00 AM', end: '3:00 PM', isOff: false },
      saturday: { start: '', end: '', isOff: true },
      sunday: { start: '', end: '', isOff: true },
    },
    blockedDates: ['2026-02-14', '2026-02-15'],
  },
  {
    id: 'p2',
    name: 'Danielle Glazier-Alcala',
    title: 'Owner',
    schedule: {
      monday: { start: '10:00 AM', end: '4:00 PM', isOff: false },
      tuesday: { start: '10:00 AM', end: '4:00 PM', isOff: false },
      wednesday: { start: '', end: '', isOff: true },
      thursday: { start: '10:00 AM', end: '4:00 PM', isOff: false },
      friday: { start: '10:00 AM', end: '2:00 PM', isOff: false },
      saturday: { start: '', end: '', isOff: true },
      sunday: { start: '', end: '', isOff: true },
    },
    blockedDates: [],
  },
];

export default function ProviderSchedulePage() {
  const [providers, setProviders] = useState<ProviderSchedule[]>(MOCK_PROVIDERS);
  const [selectedProvider, setSelectedProvider] = useState<string>(MOCK_PROVIDERS[0].id);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [saved, setSaved] = useState(false);

  const currentProvider = providers.find(p => p.id === selectedProvider)!;

  const updateSchedule = (day: string, field: 'start' | 'end' | 'isOff', value: string | boolean) => {
    setProviders(providers.map(p => {
      if (p.id !== selectedProvider) return p;
      return {
        ...p,
        schedule: {
          ...p.schedule,
          [day]: {
            ...p.schedule[day],
            [field]: value,
            ...(field === 'isOff' && value ? { start: '', end: '' } : {}),
          },
        },
      };
    }));
  };

  const copyToAllDays = (sourceDay: string) => {
    const source = currentProvider.schedule[sourceDay];
    setProviders(providers.map(p => {
      if (p.id !== selectedProvider) return p;
      const newSchedule = { ...p.schedule };
      DAYS.filter(d => d !== sourceDay && d !== 'saturday' && d !== 'sunday').forEach(day => {
        newSchedule[day] = { ...source };
      });
      return { ...p, schedule: newSchedule };
    }));
  };

  const handleSave = () => {
    // TODO: Save to Supabase
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/staff" className="text-sm text-gray-500 hover:text-gray-700 mb-1 inline-block">
            ← Back to Staff
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Provider Schedules</h1>
          <p className="text-gray-500">Set working hours and availability</p>
        </div>
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600"
        >
          {saved ? '✓ Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Provider Selector */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Select Provider:</label>
          <select
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg"
          >
            {providers.map(p => (
              <option key={p.id} value={p.id}>
                {p.name}, {p.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Weekly Schedule */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-900">Weekly Schedule</h2>
            <p className="text-sm text-gray-500">Regular working hours for {currentProvider.name}</p>
          </div>
          <button
            onClick={() => copyToAllDays('monday')}
            className="text-sm text-pink-600 hover:text-pink-700"
          >
            Copy Monday to Weekdays
          </button>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {DAYS.map((day) => {
              const slot = currentProvider.schedule[day];
              return (
                <div key={day} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                  <div className="w-32">
                    <p className="font-medium text-gray-900">{DAY_LABELS[day]}</p>
                  </div>
                  
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={slot.isOff}
                      onChange={(e) => updateSchedule(day, 'isOff', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-600">Day Off</span>
                  </label>

                  {!slot.isOff && (
                    <>
                      <select
                        value={slot.start}
                        onChange={(e) => updateSchedule(day, 'start', e.target.value)}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      >
                        <option value="">Start time</option>
                        {TIME_OPTIONS.map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                      <span className="text-gray-400">to</span>
                      <select
                        value={slot.end}
                        onChange={(e) => updateSchedule(day, 'end', e.target.value)}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      >
                        <option value="">End time</option>
                        {TIME_OPTIONS.map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </>
                  )}

                  {slot.isOff && (
                    <span className="text-gray-400 italic">Not working</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Blocked Dates */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-900">Blocked Dates</h2>
            <p className="text-sm text-gray-500">Vacations, time off, or unavailable dates</p>
          </div>
          <button
            onClick={() => setShowBlockModal(true)}
            className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200"
          >
            + Block Date
          </button>
        </div>
        <div className="p-6">
          {currentProvider.blockedDates.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No blocked dates</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {currentProvider.blockedDates.map((date) => (
                <div
                  key={date}
                  className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg"
                >
                  <span>{new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                  <button
                    onClick={() => {
                      setProviders(providers.map(p => {
                        if (p.id !== selectedProvider) return p;
                        return {
                          ...p,
                          blockedDates: p.blockedDates.filter(d => d !== date),
                        };
                      }));
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Schedule Preview */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">📅 This Week's Availability</h3>
        <div className="grid grid-cols-7 gap-2">
          {DAYS.map((day) => {
            const slot = currentProvider.schedule[day];
            return (
              <div key={day} className="text-center">
                <p className="text-xs font-medium text-gray-500 mb-1">{DAY_LABELS[day].slice(0, 3)}</p>
                {slot.isOff ? (
                  <p className="text-sm text-gray-400">Off</p>
                ) : (
                  <p className="text-sm text-gray-900">
                    {slot.start.replace(' AM', 'a').replace(' PM', 'p')} - {slot.end.replace(' AM', 'a').replace(' PM', 'p')}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Block Date Modal */}
      {showBlockModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Block Date</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  id="blockDate"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason (optional)</label>
                <input
                  type="text"
                  placeholder="e.g., Vacation, Training"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowBlockModal(false)}
                className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const dateInput = document.getElementById('blockDate') as HTMLInputElement;
                  if (dateInput.value) {
                    setProviders(providers.map(p => {
                      if (p.id !== selectedProvider) return p;
                      return {
                        ...p,
                        blockedDates: [...p.blockedDates, dateInput.value],
                      };
                    }));
                  }
                  setShowBlockModal(false);
                }}
                className="px-6 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600"
              >
                Block Date
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
