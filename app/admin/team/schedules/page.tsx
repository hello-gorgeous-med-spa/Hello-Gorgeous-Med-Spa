'use client';

// ============================================================
// ADMIN PROVIDER SCHEDULES PAGE - LIVE CALENDAR
// Shows recurring weekly schedules, editable, syncs to booking
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface Provider {
  id: string;
  name: string;
  title?: string;
  color: string;
}

interface DaySchedule {
  day_of_week: number;
  day_name: string;
  is_working: boolean;
  start_time: string | null;
  end_time: string | null;
}

interface ProviderSchedule {
  provider: Provider;
  schedules: DaySchedule[];
  loading?: boolean;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const FULL_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const TIME_OPTIONS = [
  '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
  '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00',
];

// Format 24h time to display format
function formatTime(time: string | null): string {
  if (!time) return 'Off';
  const [hours, minutes] = time.split(':');
  const h = parseInt(hours);
  const period = h >= 12 ? 'p' : 'a';
  const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${h12}${period}`;
}

function formatTimeFull(time: string | null): string {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  const h = parseInt(hours);
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${h12}:${minutes} ${period}`;
}

export default function LiveSchedulesPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [providerSchedules, setProviderSchedules] = useState<ProviderSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [editingCell, setEditingCell] = useState<{ providerId: string; day: number } | null>(null);
  const [editForm, setEditForm] = useState({ isWorking: true, startTime: '09:00', endTime: '17:00' });

  // Fetch all providers and their schedules
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Fetch providers
        const providersRes = await fetch('/api/providers');
        const providersData = await providersRes.json();
        
        const providersList: Provider[] = (providersData.providers || []).map((p: any) => ({
          id: p.id,
          name: `${p.first_name || ''} ${p.last_name || ''}`.trim() || p.name || 'Provider',
          title: p.credentials,
          color: p.color_hex || '#EC4899',
        }));
        
        setProviders(providersList);

        // Fetch schedules for each provider
        const schedulesPromises = providersList.map(async (provider) => {
          try {
            const res = await fetch(`/api/providers/${provider.id}/schedules`);
            const data = await res.json();
            return {
              provider,
              schedules: data.schedules || [],
            };
          } catch (err) {
            console.error(`Error fetching schedule for ${provider.name}:`, err);
            // Return default schedule
            return {
              provider,
              schedules: FULL_DAYS.map((name, i) => ({
                day_of_week: i,
                day_name: name,
                is_working: i !== 0 && i !== 6,
                start_time: i !== 0 && i !== 6 ? '09:00' : null,
                end_time: i !== 0 && i !== 6 ? '17:00' : null,
              })),
            };
          }
        });

        const allSchedules = await Promise.all(schedulesPromises);
        setProviderSchedules(allSchedules);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Save schedule for a specific day
  const saveSchedule = async (providerId: string, day: number, isWorking: boolean, startTime: string, endTime: string) => {
    setSaving(providerId);
    setMessage(null);

    try {
      const res = await fetch(`/api/providers/${providerId}/schedules`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          day_of_week: day,
          is_working: isWorking,
          start_time: isWorking ? startTime : null,
          end_time: isWorking ? endTime : null,
        }),
      });

      if (res.ok) {
        // Update local state
        setProviderSchedules(prev => prev.map(ps => {
          if (ps.provider.id !== providerId) return ps;
          return {
            ...ps,
            schedules: ps.schedules.map(s => 
              s.day_of_week === day 
                ? { ...s, is_working: isWorking, start_time: isWorking ? startTime : null, end_time: isWorking ? endTime : null }
                : s
            ),
          };
        }));
        setMessage({ type: 'success', text: 'Schedule updated!' });
        setEditingCell(null);
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.error || 'Failed to save' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save schedule' });
    }
    
    setSaving(null);
    setTimeout(() => setMessage(null), 3000);
  };

  // Quick toggle - mark day as off
  const toggleDayOff = async (providerId: string, day: number, currentlyWorking: boolean) => {
    if (currentlyWorking) {
      // Turn off
      await saveSchedule(providerId, day, false, '', '');
    } else {
      // Turn on with default hours
      setEditForm({ isWorking: true, startTime: '09:00', endTime: '17:00' });
      setEditingCell({ providerId, day });
    }
  };

  // Open edit modal
  const openEdit = (providerId: string, day: number) => {
    const schedule = providerSchedules.find(ps => ps.provider.id === providerId);
    const daySchedule = schedule?.schedules.find(s => s.day_of_week === day);
    
    setEditForm({
      isWorking: daySchedule?.is_working ?? true,
      startTime: daySchedule?.start_time || '09:00',
      endTime: daySchedule?.end_time || '17:00',
    });
    setEditingCell({ providerId, day });
  };

  // Get schedule for a provider and day
  const getSchedule = (providerId: string, day: number): DaySchedule | undefined => {
    const schedule = providerSchedules.find(ps => ps.provider.id === providerId);
    return schedule?.schedules.find(s => s.day_of_week === day);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-black">Provider Schedules</h1>
          <p className="text-black">Loading schedules...</p>
        </div>
        <div className="bg-white rounded-xl border border-black shadow-sm p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-16 bg-white rounded" />
            <div className="h-16 bg-white rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">📅 All Providers - This Week</h1>
          <p className="text-black">Click any cell to edit hours • Changes affect booking immediately</p>
        </div>
        <Link
          href="/admin/appointments/new"
          className="px-4 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600"
        >
          + Book Appointment
        </Link>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Schedule Grid */}
      <div className="bg-white rounded-xl border border-black shadow-sm overflow-hidden">
        {providerSchedules.length === 0 ? (
          <div className="p-8 text-center text-black">
            No providers found. Add providers first.
          </div>
        ) : (
          <div className="overflow-x-auto">
            {providerSchedules.map((ps) => (
              <div key={ps.provider.id} className="border-b border-black last:border-0">
                {/* Provider Header */}
                <div className="px-6 py-4 bg-white flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: ps.provider.color }}
                  >
                    {ps.provider.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-black">{ps.provider.name}</p>
                    {ps.provider.title && (
                      <p className="text-xs text-black">{ps.provider.title}</p>
                    )}
                  </div>
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 divide-x divide-black">
                  {DAYS.map((day, dayIndex) => {
                    const schedule = getSchedule(ps.provider.id, dayIndex);
                    const isWorking = schedule?.is_working ?? false;
                    const isEditing = editingCell?.providerId === ps.provider.id && editingCell?.day === dayIndex;
                    const isSaving = saving === ps.provider.id;

                    return (
                      <div
                        key={dayIndex}
                        className={`p-3 text-center cursor-pointer hover:bg-white transition-colors ${
                          !isWorking ? 'bg-white' : ''
                        }`}
                        onClick={() => !isEditing && openEdit(ps.provider.id, dayIndex)}
                      >
                        <p className="text-xs font-medium text-black mb-1">{day}</p>
                        {isWorking ? (
                          <p className="text-sm font-semibold text-black">
                            {formatTime(schedule?.start_time || '09:00')} - {formatTime(schedule?.end_time || '17:00')}
                          </p>
                        ) : (
                          <p className="text-sm text-black italic">Off</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingCell && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-sm w-full">
            <div className="p-6 border-b border-black">
              <h2 className="text-xl font-bold text-black">
                Edit {FULL_DAYS[editingCell.day]}
              </h2>
              <p className="text-sm text-black">
                {providerSchedules.find(ps => ps.provider.id === editingCell.providerId)?.provider.name}
              </p>
            </div>

            <div className="p-6 space-y-4">
              {/* Working toggle */}
              <div className="flex items-center justify-between">
                <span className="font-medium text-black">Working this day?</span>
                <button
                  onClick={() => setEditForm(prev => ({ ...prev, isWorking: !prev.isWorking }))}
                  className={`w-14 h-7 rounded-full transition-colors relative ${
                    editForm.isWorking ? 'bg-green-500' : 'bg-white'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform shadow ${
                      editForm.isWorking ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {editForm.isWorking && (
                <>
                  {/* Start time */}
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Start Time</label>
                    <select
                      value={editForm.startTime}
                      onChange={(e) => setEditForm(prev => ({ ...prev, startTime: e.target.value }))}
                      className="w-full px-4 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500"
                    >
                      {TIME_OPTIONS.map(time => (
                        <option key={time} value={time}>{formatTimeFull(time)}</option>
                      ))}
                    </select>
                  </div>

                  {/* End time */}
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">End Time</label>
                    <select
                      value={editForm.endTime}
                      onChange={(e) => setEditForm(prev => ({ ...prev, endTime: e.target.value }))}
                      className="w-full px-4 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500"
                    >
                      {TIME_OPTIONS.filter(t => t > editForm.startTime).map(time => (
                        <option key={time} value={time}>{formatTimeFull(time)}</option>
                      ))}
                    </select>
                  </div>

                  {/* Hours display */}
                  <div className="bg-white rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-pink-600">
                      {(() => {
                        const [sh, sm] = editForm.startTime.split(':').map(Number);
                        const [eh, em] = editForm.endTime.split(':').map(Number);
                        const hours = (eh + em/60) - (sh + sm/60);
                        return hours.toFixed(1);
                      })()}
                    </p>
                    <p className="text-xs text-black">hours scheduled</p>
                  </div>
                </>
              )}

              {!editForm.isWorking && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                  <p className="text-yellow-800">This day will show as <strong>unavailable</strong> for booking</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-black flex justify-end gap-3">
              <button
                onClick={() => setEditingCell(null)}
                className="px-4 py-2 text-black font-medium hover:bg-white rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => saveSchedule(
                  editingCell.providerId,
                  editingCell.day,
                  editForm.isWorking,
                  editForm.startTime,
                  editForm.endTime
                )}
                disabled={saving !== null}
                className="px-6 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="font-medium text-blue-800 mb-2">How this works:</p>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• <strong>Click any cell</strong> to edit that day's hours</li>
          <li>• Changes <strong>immediately affect booking availability</strong></li>
          <li>• Days marked "Off" will show <strong>no available slots</strong> in booking</li>
          <li>• This is a <strong>recurring weekly schedule</strong> (same each week)</li>
        </ul>
      </div>
    </div>
  );
}
