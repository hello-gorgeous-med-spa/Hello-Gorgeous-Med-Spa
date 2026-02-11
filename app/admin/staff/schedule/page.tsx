'use client';

// ============================================================
// PROVIDER SCHEDULE EDITOR
// Set working hours, blocked time, holidays, and closed days
// Loads from and saves to API (provider_schedules).
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  HOLIDAYS_2026,
  type BlockedTime,
  type Holiday,
} from '@/lib/hgos/providers';

interface TimeSlot {
  start: string;
  end: string;
  isOff: boolean;
  breaks?: { start: string; end: string; label: string }[];
}

interface EditableSchedule {
  providerId: string;
  schedule: Record<string, TimeSlot>;
  blockedTimes: BlockedTime[];
}

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
const DAY_LABELS: Record<string, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};

// API uses day_of_week: 0=Sunday, 1=Monday, ..., 6=Saturday
const DAY_NAME_TO_API_DAY: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

const TIME_OPTIONS = [
  '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
  '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
  '19:00', '19:30', '20:00',
];

const BLOCK_REASONS = [
  { id: 'time-off', label: 'Time Off', color: 'red' },
  { id: 'lunch', label: 'Lunch Break', color: 'yellow' },
  { id: 'meeting', label: 'Meeting', color: 'blue' },
  { id: 'training', label: 'Training', color: 'purple' },
  { id: 'personal', label: 'Personal', color: 'gray' },
] as const;

function formatTime(time: string): string {
  if (!time) return '';
  const [hours, minutes] = time.split(':').map(Number);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
}

function formatTimeShort(time: string): string {
  if (!time) return '';
  const [hours, minutes] = time.split(':').map(Number);
  const ampm = hours >= 12 ? 'p' : 'a';
  const displayHours = hours % 12 || 12;
  return `${displayHours}${minutes > 0 ? ':' + minutes.toString().padStart(2, '0') : ''}${ampm}`;
}

// Build editable schedule from API schedule response
function apiSchedulesToEditable(
  providerId: string,
  apiSchedules: { day_of_week: number; is_working: boolean; start_time: string | null; end_time: string | null }[]
): EditableSchedule {
  const schedule: Record<string, TimeSlot> = {};
  for (const day of DAYS) {
    const apiDay = DAY_NAME_TO_API_DAY[day];
    const row = apiSchedules?.find((s) => s.day_of_week === apiDay);
    const isWorking = row?.is_working ?? (day !== 'saturday' && day !== 'sunday');
    const start = (row?.is_working && row?.start_time) ? row.start_time : '';
    const end = (row?.is_working && row?.end_time) ? row.end_time : '';
    schedule[day] = {
      start: start || (isWorking ? '09:00' : ''),
      end: end || (isWorking ? '17:00' : ''),
      isOff: !isWorking,
      breaks: [],
    };
  }
  return {
    providerId,
    schedule,
    blockedTimes: [],
  };
}

interface ProviderInfo {
  id: string;
  fullName: string;
  displayName: string;
  credentials: string;
  color: string;
}

export default function ProviderSchedulePage() {
  const [providers, setProviders] = useState<ProviderInfo[]>([]);
  const [schedules, setSchedules] = useState<EditableSchedule[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showHolidayModal, setShowHolidayModal] = useState(false);
  const [showClosedDayModal, setShowClosedDayModal] = useState(false);
  const [holidays, setHolidays] = useState<Holiday[]>(HOLIDAYS_2026);
  const [closedDays, setClosedDays] = useState<{ date: string; reason: string }[]>([]);
  const [activeTab, setActiveTab] = useState<'schedule' | 'blocked' | 'holidays' | 'closed'>('schedule');

  const currentSchedule = schedules.find((s) => s.providerId === selectedProvider);
  const currentProvider = providers.find((p) => p.id === selectedProvider);

  // Load providers and their schedules from API
  const loadSchedules = useCallback(async () => {
    setLoading(true);
    try {
      const provRes = await fetch('/api/providers');
      const provData = await provRes.json();
      const list: ProviderInfo[] = (provData.providers || []).map((p: { id: string; first_name?: string; last_name?: string; credentials?: string; color_hex?: string }) => ({
        id: p.id,
        fullName: `${p.first_name || ''} ${p.last_name || ''}`.trim() || 'Provider',
        displayName: `${p.first_name || ''} ${p.last_name || ''}`.trim() || 'Provider',
        credentials: p.credentials || '',
        color: p.color_hex || '#ec4899',
      }));
      setProviders(list);
      if (list.length > 0 && !selectedProvider) setSelectedProvider(list[0].id);

      const editable: EditableSchedule[] = [];
      for (const provider of list) {
        const res = await fetch(`/api/providers/${provider.id}/schedules`);
        const data = await res.json();
        const apiSchedules = data.schedules || [];
        editable.push(apiSchedulesToEditable(provider.id, apiSchedules));
      }
      setSchedules(editable);
      setSaveError(null);
    } catch (err) {
      console.error('Failed to load staff schedules:', err);
      setSaveError('Failed to load schedules. Please refresh.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSchedules();
  }, [loadSchedules]);

  const updateSchedule = (day: string, field: 'start' | 'end' | 'isOff', value: string | boolean) => {
    setSchedules(schedules.map(s => {
      if (s.providerId !== selectedProvider) return s;
      return {
        ...s,
        schedule: {
          ...s.schedule,
          [day]: {
            ...s.schedule[day],
            [field]: value,
            ...(field === 'isOff' && value ? { start: '', end: '' } : {}),
          },
        },
      };
    }));
  };

  const copyToAllDays = (sourceDay: string) => {
    const source = currentSchedule.schedule[sourceDay];
    setSchedules(schedules.map(s => {
      if (s.providerId !== selectedProvider) return s;
      const newSchedule = { ...s.schedule };
      DAYS.filter(d => d !== sourceDay && d !== 'saturday' && d !== 'sunday').forEach(day => {
        newSchedule[day] = { ...source };
      });
      return { ...s, schedule: newSchedule };
    }));
  };

  const addBlockedTime = (date: string, reason: string, notes: string, startTime?: string, endTime?: string) => {
    const newBlock: BlockedTime = {
      id: `block-${Date.now()}`,
      providerId: selectedProvider,
      date,
      startTime,
      endTime,
      reason: reason as BlockedTime['reason'],
      notes,
    };
    setSchedules(schedules.map(s => {
      if (s.providerId !== selectedProvider) return s;
      return { ...s, blockedTimes: [...s.blockedTimes, newBlock] };
    }));
  };

  const removeBlockedTime = (blockId: string) => {
    setSchedules(schedules.map(s => {
      if (s.providerId !== selectedProvider) return s;
      return { ...s, blockedTimes: s.blockedTimes.filter(b => b.id !== blockId) };
    }));
  };

  const addHoliday = (date: string, name: string, isClosed: boolean) => {
    const newHoliday: Holiday = {
      id: `holiday-${Date.now()}`,
      date,
      name,
      isClosed,
    };
    setHolidays([...holidays, newHoliday]);
  };

  const removeHoliday = (holidayId: string) => {
    setHolidays(holidays.filter(h => h.id !== holidayId));
  };

  const addClosedDay = (date: string, reason: string) => {
    setClosedDays([...closedDays, { date, reason }]);
  };

  const removeClosedDay = (date: string) => {
    setClosedDays(closedDays.filter(d => d.date !== date));
  };

  const handleSave = async () => {
    setSaveError(null);
    setSaving(true);
    try {
      for (const ed of schedules) {
        const payload = DAYS.map((day) => {
          const slot = ed.schedule[day];
          const isWorking = !slot.isOff;
          return {
            day_of_week: DAY_NAME_TO_API_DAY[day],
            is_working: isWorking,
            start_time: isWorking && slot.start ? slot.start : null,
            end_time: isWorking && slot.end ? slot.end : null,
          };
        });
        const res = await fetch(`/api/providers/${ed.providerId}/schedules`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || `Failed to save schedule for provider ${ed.providerId}`);
        }
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save schedules');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/staff" className="text-sm text-gray-500 hover:text-gray-700 mb-1 inline-block">
            ← Back to Staff
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Schedule Management</h1>
          <p className="text-gray-500">Working hours, blocked time, holidays & closed days</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          {saveError && (
            <p className="text-sm text-red-600">{saveError}</p>
          )}
          <button
            onClick={handleSave}
            disabled={saving || schedules.length === 0}
            className={`px-6 py-2 font-medium rounded-lg transition-colors ${
              saved ? 'bg-green-500 text-white' : 'bg-pink-500 text-white hover:bg-pink-600 disabled:opacity-50'
            }`}
          >
            {saving ? 'Saving…' : saved ? '✓ Saved!' : 'Save All Changes'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-100 p-1 inline-flex gap-1">
        {[
          { id: 'schedule', label: '📅 Weekly Schedule' },
          { id: 'blocked', label: '🚫 Blocked Time' },
          { id: 'holidays', label: '🎄 Holidays' },
          { id: 'closed', label: '🔒 Closed Days' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-pink-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Provider Selector */}
      {(activeTab === 'schedule' || activeTab === 'blocked') && (
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Select Provider:</label>
            <div className="flex gap-2">
              {providers.map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => setSelectedProvider(provider.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                    selectedProvider === provider.id
                      ? 'border-pink-500 bg-pink-50 text-pink-700'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                    style={{ backgroundColor: provider.color }}
                  >
                    {provider.fullName.split(/\s+/).map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <p className="font-medium">{provider.fullName}</p>
                    <p className="text-xs text-gray-500">{provider.credentials}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Weekly Schedule Tab */}
      {activeTab === 'schedule' && currentSchedule && currentProvider && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-900">Weekly Schedule</h2>
              <p className="text-sm text-gray-500">Regular working hours for {currentProvider.displayName}</p>
            </div>
            <button
              onClick={() => copyToAllDays('monday')}
              className="text-sm text-pink-600 hover:text-pink-700"
            >
              Copy Monday to All Weekdays
            </button>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {DAYS.map((day) => {
                const slot = currentSchedule.schedule[day];
                return (
                  <div key={day} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                    <div className="w-32">
                      <p className="font-medium text-gray-900">{DAY_LABELS[day]}</p>
                    </div>
                    
                    <label className="flex items-center gap-2 min-w-[100px]">
                      <input
                        type="checkbox"
                        checked={slot.isOff}
                        onChange={(e) => updateSchedule(day, 'isOff', e.target.checked)}
                        className="rounded border-gray-300 text-pink-500 focus:ring-pink-500"
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
                            <option key={t} value={t}>{formatTime(t)}</option>
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
                            <option key={t} value={t}>{formatTime(t)}</option>
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
      )}

      {/* Blocked Time Tab */}
      {activeTab === 'blocked' && currentSchedule && currentProvider && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-900">Blocked Time</h2>
              <p className="text-sm text-gray-500">Time off, meetings, and other blocked periods for {currentProvider.displayName}</p>
            </div>
            <button
              onClick={() => setShowBlockModal(true)}
              className="px-4 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600"
            >
              + Block Time
            </button>
          </div>
          <div className="p-6">
            {currentSchedule.blockedTimes.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-2">No blocked time scheduled</p>
                <button
                  onClick={() => setShowBlockModal(true)}
                  className="text-pink-600 hover:text-pink-700"
                >
                  + Add blocked time
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {currentSchedule.blockedTimes.map((block) => (
                  <div
                    key={block.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        block.reason === 'time-off' ? 'bg-red-100 text-red-700' :
                        block.reason === 'lunch' ? 'bg-yellow-100 text-yellow-700' :
                        block.reason === 'meeting' ? 'bg-blue-100 text-blue-700' :
                        block.reason === 'training' ? 'bg-pink-100 text-pink-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {BLOCK_REASONS.find(r => r.id === block.reason)?.label || block.reason}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {new Date(block.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                        <p className="text-sm text-gray-500">
                          {block.startTime && block.endTime 
                            ? `${formatTime(block.startTime)} - ${formatTime(block.endTime)}`
                            : 'Full day'}
                          {block.notes && ` • ${block.notes}`}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeBlockedTime(block.id)}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Holidays Tab */}
      {activeTab === 'holidays' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-900">Holidays</h2>
              <p className="text-sm text-gray-500">Business holidays and modified hours (applies to all providers)</p>
            </div>
            <button
              onClick={() => setShowHolidayModal(true)}
              className="px-4 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600"
            >
              + Add Holiday
            </button>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {holidays.sort((a, b) => a.date.localeCompare(b.date)).map((holiday) => (
                <div
                  key={holiday.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      holiday.isClosed 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {holiday.isClosed ? 'Closed' : 'Modified Hours'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{holiday.name}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(holiday.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                        {holiday.modifiedHours && ` • ${formatTime(holiday.modifiedHours.start)} - ${formatTime(holiday.modifiedHours.end)}`}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeHoliday(holiday.id)}
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Closed Days Tab */}
      {activeTab === 'closed' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-900">Closed Days</h2>
              <p className="text-sm text-gray-500">Days the business is closed (applies to all providers)</p>
            </div>
            <button
              onClick={() => setShowClosedDayModal(true)}
              className="px-4 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600"
            >
              + Add Closed Day
            </button>
          </div>
          <div className="p-6">
            {closedDays.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-2">No additional closed days scheduled</p>
                <p className="text-sm text-gray-400">Holidays are shown in the Holidays tab</p>
              </div>
            ) : (
              <div className="space-y-3">
                {closedDays.sort((a, b) => a.date.localeCompare(b.date)).map((day) => (
                  <div
                    key={day.date}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        Closed
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                        {day.reason && <p className="text-sm text-gray-500">{day.reason}</p>}
                      </div>
                    </div>
                    <button
                      onClick={() => removeClosedDay(day.date)}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Schedule Preview */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">📅 All Providers - This Week</h3>
        <div className="space-y-4">
          {providers.map((provider) => {
            const schedule = schedules.find((s) => s.providerId === provider.id);
            if (!schedule) return null;
            const initials = provider.fullName.split(/\s+/).map((n) => n[0]).join('').slice(0, 2).toUpperCase();
            return (
              <div key={provider.id} className="bg-white rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium"
                    style={{ backgroundColor: provider.color }}
                  >
                    {initials}
                  </div>
                  <span className="font-medium text-gray-900">{provider.displayName}</span>
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {DAYS.map((day) => {
                    const slot = schedule.schedule[day];
                    return (
                      <div key={day} className="text-center">
                        <p className="text-xs font-medium text-gray-500 mb-1">{DAY_LABELS[day].slice(0, 3)}</p>
                        {slot.isOff ? (
                          <p className="text-xs text-gray-400">Off</p>
                        ) : (
                          <p className="text-xs text-gray-900">
                            {formatTimeShort(slot.start)} - {formatTimeShort(slot.end)}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Block Time Modal */}
      {showBlockModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Block Time for {currentProvider?.displayName ?? 'Provider'}</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const date = (form.elements.namedItem('blockDate') as HTMLInputElement).value;
              const reason = (form.elements.namedItem('reason') as HTMLSelectElement).value;
              const notes = (form.elements.namedItem('notes') as HTMLInputElement).value;
              const fullDay = (form.elements.namedItem('fullDay') as HTMLInputElement).checked;
              const startTime = fullDay ? undefined : (form.elements.namedItem('startTime') as HTMLSelectElement).value;
              const endTime = fullDay ? undefined : (form.elements.namedItem('endTime') as HTMLSelectElement).value;
              addBlockedTime(date, reason, notes, startTime, endTime);
              setShowBlockModal(false);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <input
                    type="date"
                    name="blockDate"
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason *</label>
                  <select
                    name="reason"
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  >
                    {BLOCK_REASONS.map(r => (
                      <option key={r.id} value={r.id}>{r.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="fullDay"
                      defaultChecked
                      className="rounded border-gray-300 text-pink-500"
                      onChange={(e) => {
                        const timeSelects = document.querySelectorAll('.time-select');
                        timeSelects.forEach(el => {
                          (el as HTMLElement).style.display = e.target.checked ? 'none' : 'block';
                        });
                      }}
                    />
                    <span className="text-sm text-gray-700">Full Day</span>
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-4 time-select" style={{ display: 'none' }}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                    <select name="startTime" className="w-full px-4 py-2 border border-gray-200 rounded-lg">
                      {TIME_OPTIONS.map(t => (
                        <option key={t} value={t}>{formatTime(t)}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                    <select name="endTime" className="w-full px-4 py-2 border border-gray-200 rounded-lg">
                      {TIME_OPTIONS.map(t => (
                        <option key={t} value={t}>{formatTime(t)}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                  <input
                    type="text"
                    name="notes"
                    placeholder="e.g., Vacation, Doctor appointment"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowBlockModal(false)}
                  className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600"
                >
                  Block Time
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Holiday Modal */}
      {showHolidayModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add Holiday</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const date = (form.elements.namedItem('holidayDate') as HTMLInputElement).value;
              const name = (form.elements.namedItem('holidayName') as HTMLInputElement).value;
              const isClosed = (form.elements.namedItem('isClosed') as HTMLInputElement).checked;
              addHoliday(date, name, isClosed);
              setShowHolidayModal(false);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Holiday Name *</label>
                  <input
                    type="text"
                    name="holidayName"
                    required
                    placeholder="e.g., Christmas Day"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <input
                    type="date"
                    name="holidayDate"
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="isClosed"
                      defaultChecked
                      className="rounded border-gray-300 text-pink-500"
                    />
                    <span className="text-sm text-gray-700">Business Closed</span>
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowHolidayModal(false)}
                  className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600"
                >
                  Add Holiday
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Closed Day Modal */}
      {showClosedDayModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add Closed Day</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const date = (form.elements.namedItem('closedDate') as HTMLInputElement).value;
              const reason = (form.elements.namedItem('closedReason') as HTMLInputElement).value;
              addClosedDay(date, reason);
              setShowClosedDayModal(false);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <input
                    type="date"
                    name="closedDate"
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason (optional)</label>
                  <input
                    type="text"
                    name="closedReason"
                    placeholder="e.g., Team training, Maintenance"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowClosedDayModal(false)}
                  className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600"
                >
                  Add Closed Day
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
