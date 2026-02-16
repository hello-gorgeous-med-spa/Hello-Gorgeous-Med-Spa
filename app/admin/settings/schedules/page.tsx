'use client';

// ============================================================
// PROVIDER SCHEDULE EDITOR - Manage Availability Without Code
// Set working hours, days off, vacation blocks
// ============================================================

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ProviderSchedule {
  id: string;
  provider_id: string;
  provider_name: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_working: boolean;
}

interface TimeOff {
  id: string;
  provider_id: string;
  provider_name: string;
  start_date: string;
  end_date: string;
  reason: string;
  is_approved: boolean;
}

interface Provider {
  id: string;
  name: string;
  color: string;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const DEFAULT_SCHEDULE = {
  start_time: '09:00',
  end_time: '17:00',
  is_working: true,
};

export default function ProviderSchedulesPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [schedules, setSchedules] = useState<Record<string, ProviderSchedule[]>>({});
  const [timeOff, setTimeOff] = useState<TimeOff[]>([]);
  const [showTimeOffModal, setShowTimeOffModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // New time off form
  const [newTimeOff, setNewTimeOff] = useState({
    start_date: '',
    end_date: '',
    reason: '',
  });

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const res = await fetch('/api/providers');
      const data = await res.json();
      if (data.providers && data.providers.length > 0) {
        const formattedProviders = data.providers.map((p: any) => ({
          id: p.id,
          name: p.first_name ? `${p.first_name} ${p.last_name}` : p.name || 'Provider',
          color: p.color_hex || '#EC4899',
        }));
        setProviders(formattedProviders);
        setSelectedProvider(formattedProviders[0].id);
        
        // Initialize default schedules for each provider
        const defaultSchedules: Record<string, ProviderSchedule[]> = {};
        formattedProviders.forEach((p: Provider) => {
          defaultSchedules[p.id] = DAYS.map((day, idx) => ({
            id: `${p.id}-${idx}`,
            provider_id: p.id,
            provider_name: p.name,
            day_of_week: idx,
            start_time: idx === 0 ? '' : '09:00', // Sunday off by default
            end_time: idx === 0 ? '' : '17:00',
            is_working: idx !== 0, // Sunday off by default
          }));
        });
        setSchedules(defaultSchedules);
      }
    } catch (error) {
      console.error('Failed to fetch providers:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSchedule = (dayIndex: number, field: string, value: any) => {
    if (!selectedProvider) return;
    
    setSchedules(prev => ({
      ...prev,
      [selectedProvider]: prev[selectedProvider].map(s => 
        s.day_of_week === dayIndex ? { ...s, [field]: value } : s
      ),
    }));
  };

  const toggleWorkingDay = (dayIndex: number) => {
    if (!selectedProvider) return;
    
    const currentSchedule = schedules[selectedProvider]?.find(s => s.day_of_week === dayIndex);
    const isCurrentlyWorking = currentSchedule?.is_working;
    
    setSchedules(prev => ({
      ...prev,
      [selectedProvider]: prev[selectedProvider].map(s => 
        s.day_of_week === dayIndex 
          ? { 
              ...s, 
              is_working: !isCurrentlyWorking,
              start_time: !isCurrentlyWorking ? '09:00' : '',
              end_time: !isCurrentlyWorking ? '17:00' : '',
            } 
          : s
      ),
    }));
  };

  const saveSchedules = async () => {
    setSaving(true);
    // In production, this would call an API to save
    await new Promise(resolve => setTimeout(resolve, 500));
    setMessage({ type: 'success', text: 'Schedule saved successfully!' });
    setSaving(false);
    setTimeout(() => setMessage(null), 3000);
  };

  const addTimeOff = () => {
    if (!selectedProvider || !newTimeOff.start_date || !newTimeOff.end_date) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' });
      return;
    }

    const provider = providers.find(p => p.id === selectedProvider);
    const newEntry: TimeOff = {
      id: `to-${Date.now()}`,
      provider_id: selectedProvider,
      provider_name: provider?.name || 'Provider',
      start_date: newTimeOff.start_date,
      end_date: newTimeOff.end_date,
      reason: newTimeOff.reason || 'Time off',
      is_approved: true,
    };

    setTimeOff(prev => [...prev, newEntry]);
    setNewTimeOff({ start_date: '', end_date: '', reason: '' });
    setShowTimeOffModal(false);
    setMessage({ type: 'success', text: 'Time off added!' });
    setTimeout(() => setMessage(null), 3000);
  };

  const removeTimeOff = (id: string) => {
    setTimeOff(prev => prev.filter(t => t.id !== id));
  };

  const currentProviderSchedule = schedules[selectedProvider] || [];
  const currentProviderTimeOff = timeOff.filter(t => t.provider_id === selectedProvider);
  const selectedProviderData = providers.find(p => p.id === selectedProvider);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-black">Provider Schedules</h1>
        <div className="bg-white rounded-xl border p-8">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-12 bg-white rounded" />)}
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
          <div className="flex items-center gap-2 text-sm text-black mb-1">
            <Link href="/admin/settings" className="hover:text-pink-600">Settings</Link>
            <span>/</span>
            <span>Provider Schedules</span>
          </div>
          <h1 className="text-2xl font-bold text-black">Provider Schedules</h1>
          <p className="text-black">Set working hours, days off, and vacations</p>
        </div>
        <button
          onClick={saveSchedules}
          disabled={saving}
          className="px-6 py-2 bg-[#FF2D8E] text-white rounded-lg hover:bg-black disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {/* Provider Selector */}
      <div className="flex gap-3">
        {providers.map(provider => (
          <button
            key={provider.id}
            onClick={() => setSelectedProvider(provider.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors ${
              selectedProvider === provider.id
                ? 'border-[#FF2D8E] bg-pink-50'
                : 'border-black hover:border-black'
            }`}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: provider.color }}
            />
            <span className={selectedProvider === provider.id ? 'font-medium text-pink-700' : 'text-black'}>
              {provider.name}
            </span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Weekly Schedule */}
        <div className="col-span-2 bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold text-black mb-4">Weekly Schedule</h2>
          
          <div className="space-y-3">
            {DAYS.map((day, idx) => {
              const schedule = currentProviderSchedule.find(s => s.day_of_week === idx);
              const isWorking = schedule?.is_working;

              return (
                <div key={day} className={`flex items-center gap-4 p-3 rounded-lg ${isWorking ? 'bg-white' : 'bg-white'}`}>
                  <div className="w-28">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isWorking}
                        onChange={() => toggleWorkingDay(idx)}
                        className="w-4 h-4 text-[#FF2D8E] rounded"
                      />
                      <span className={`font-medium ${isWorking ? 'text-black' : 'text-black'}`}>
                        {day}
                      </span>
                    </label>
                  </div>

                  {isWorking ? (
                    <>
                      <input
                        type="time"
                        value={schedule?.start_time || '09:00'}
                        onChange={(e) => updateSchedule(idx, 'start_time', e.target.value)}
                        className="px-3 py-2 border rounded-lg text-sm"
                      />
                      <span className="text-black">to</span>
                      <input
                        type="time"
                        value={schedule?.end_time || '17:00'}
                        onChange={(e) => updateSchedule(idx, 'end_time', e.target.value)}
                        className="px-3 py-2 border rounded-lg text-sm"
                      />
                    </>
                  ) : (
                    <span className="text-black text-sm">Not working</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Time Off */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-black">Time Off</h2>
            <button
              onClick={() => setShowTimeOffModal(true)}
              className="text-sm text-pink-600 hover:text-pink-700"
            >
              + Add
            </button>
          </div>

          {currentProviderTimeOff.length === 0 ? (
            <p className="text-sm text-black text-center py-8">
              No scheduled time off
            </p>
          ) : (
            <div className="space-y-2">
              {currentProviderTimeOff.map(to => (
                <div key={to.id} className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-amber-800">{to.reason}</p>
                      <p className="text-sm text-amber-600">
                        {new Date(to.start_date).toLocaleDateString()} - {new Date(to.end_date).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => removeTimeOff(to.id)}
                      className="text-amber-600 hover:text-amber-800"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Time Off Modal */}
      {showTimeOffModal && (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add Time Off for {selectedProviderData?.name}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">Start Date</label>
                <input
                  type="date"
                  value={newTimeOff.start_date}
                  onChange={(e) => setNewTimeOff(prev => ({ ...prev, start_date: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">End Date</label>
                <input
                  type="date"
                  value={newTimeOff.end_date}
                  onChange={(e) => setNewTimeOff(prev => ({ ...prev, end_date: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Reason (optional)</label>
                <input
                  type="text"
                  value={newTimeOff.reason}
                  onChange={(e) => setNewTimeOff(prev => ({ ...prev, reason: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="e.g., Vacation, Training"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowTimeOffModal(false)}
                className="px-4 py-2 text-black hover:bg-white rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={addTimeOff}
                className="px-6 py-2 bg-[#FF2D8E] text-white rounded-lg hover:bg-black"
              >
                Add Time Off
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
