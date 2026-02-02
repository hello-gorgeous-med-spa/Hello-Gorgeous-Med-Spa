'use client';

// ============================================================
// SCHEDULING ENGINE - OWNER CONTROLLED
// Calendar view, global hours, provider schedules, capacity
// ============================================================

import { useState } from 'react';
import OwnerLayout from '../layout-wrapper';

interface DaySchedule {
  day: string;
  isOpen: boolean;
  open: string;
  close: string;
}

interface ProviderSchedule {
  providerId: string;
  providerName: string;
  schedule: DaySchedule[];
}

export default function SchedulingEnginePage() {
  const [businessHours, setBusinessHours] = useState<DaySchedule[]>([
    { day: 'Monday', isOpen: true, open: '09:00', close: '18:00' },
    { day: 'Tuesday', isOpen: true, open: '09:00', close: '18:00' },
    { day: 'Wednesday', isOpen: true, open: '09:00', close: '18:00' },
    { day: 'Thursday', isOpen: true, open: '09:00', close: '20:00' },
    { day: 'Friday', isOpen: true, open: '09:00', close: '18:00' },
    { day: 'Saturday', isOpen: true, open: '10:00', close: '16:00' },
    { day: 'Sunday', isOpen: false, open: '', close: '' },
  ]);

  const [providerSchedules, setProviderSchedules] = useState<ProviderSchedule[]>([
    { providerId: 'p1', providerName: 'Ryan Kent', schedule: [
      { day: 'Monday', isOpen: true, open: '09:00', close: '17:00' },
      { day: 'Tuesday', isOpen: true, open: '09:00', close: '17:00' },
      { day: 'Wednesday', isOpen: true, open: '09:00', close: '17:00' },
      { day: 'Thursday', isOpen: true, open: '09:00', close: '19:00' },
      { day: 'Friday', isOpen: true, open: '09:00', close: '17:00' },
      { day: 'Saturday', isOpen: false, open: '', close: '' },
      { day: 'Sunday', isOpen: false, open: '', close: '' },
    ]},
    { providerId: 'p2', providerName: 'Danielle Alcala', schedule: [
      { day: 'Monday', isOpen: true, open: '10:00', close: '18:00' },
      { day: 'Tuesday', isOpen: true, open: '10:00', close: '18:00' },
      { day: 'Wednesday', isOpen: true, open: '10:00', close: '18:00' },
      { day: 'Thursday', isOpen: true, open: '10:00', close: '20:00' },
      { day: 'Friday', isOpen: true, open: '10:00', close: '18:00' },
      { day: 'Saturday', isOpen: true, open: '10:00', close: '16:00' },
      { day: 'Sunday', isOpen: false, open: '', close: '' },
    ]},
  ]);

  const [blackoutDates, setBlackoutDates] = useState([
    { id: '1', date: '2025-02-14', reason: "Valentine's Day - Limited Hours" },
    { id: '2', date: '2025-05-26', reason: 'Memorial Day - Closed' },
    { id: '3', date: '2025-07-04', reason: 'Independence Day - Closed' },
  ]);

  const [capacitySettings, setCapacitySettings] = useState({
    maxDailyAppointments: 25,
    maxConcurrent: 2,
    allowOverbooking: false,
    overbookingLimit: 0,
  });

  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const saveSettings = () => {
    setMessage({ type: 'success', text: 'Scheduling settings saved successfully!' });
    setTimeout(() => setMessage(null), 3000);
  };

  const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <OwnerLayout title="Scheduling Engine" description="Calendar configuration, hours, and capacity">
      {message && (
        <div className={`mb-4 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Business Hours & Provider Schedules */}
        <div className="col-span-2 space-y-6">
          {/* Global Business Hours */}
          <div className="bg-white rounded-xl border">
            <div className="p-4 border-b bg-gray-50">
              <h2 className="font-semibold">🏢 Global Business Hours</h2>
            </div>
            <div className="p-4">
              {businessHours.map((day, idx) => (
                <div key={day.day} className={`flex items-center gap-4 p-3 ${idx % 2 === 0 ? 'bg-gray-50' : ''} rounded-lg`}>
                  <div className="w-28">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={day.isOpen}
                        onChange={(e) => {
                          const updated = [...businessHours];
                          updated[idx].isOpen = e.target.checked;
                          setBusinessHours(updated);
                        }}
                        className="w-4 h-4"
                      />
                      <span className={day.isOpen ? 'font-medium' : 'text-gray-400'}>{day.day}</span>
                    </label>
                  </div>
                  {day.isOpen ? (
                    <>
                      <input
                        type="time"
                        value={day.open}
                        onChange={(e) => { const u = [...businessHours]; u[idx].open = e.target.value; setBusinessHours(u); }}
                        className="px-3 py-2 border rounded text-sm"
                      />
                      <span>to</span>
                      <input
                        type="time"
                        value={day.close}
                        onChange={(e) => { const u = [...businessHours]; u[idx].close = e.target.value; setBusinessHours(u); }}
                        className="px-3 py-2 border rounded text-sm"
                      />
                    </>
                  ) : (
                    <span className="text-gray-400 text-sm">Closed</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Provider Schedules */}
          <div className="bg-white rounded-xl border">
            <div className="p-4 border-b bg-gray-50">
              <h2 className="font-semibold">👤 Provider Schedules</h2>
            </div>
            <div className="p-4">
              {/* Provider Tabs */}
              <div className="flex gap-2 mb-4">
                {providerSchedules.map(ps => (
                  <button
                    key={ps.providerId}
                    onClick={() => setSelectedProvider(ps.providerId)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedProvider === ps.providerId ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30' : 'bg-pink-100 text-pink-700 hover:bg-pink-200 border border-pink-200'
                    }`}
                  >
                    {ps.providerName}
                  </button>
                ))}
              </div>

              {/* Selected Provider Schedule */}
              {selectedProvider && (
                <div>
                  {providerSchedules.find(ps => ps.providerId === selectedProvider)?.schedule.map((day, idx) => (
                    <div key={day.day} className={`flex items-center gap-4 p-3 ${idx % 2 === 0 ? 'bg-gray-50' : ''} rounded-lg`}>
                      <div className="w-28">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={day.isOpen}
                            onChange={(e) => {
                              setProviderSchedules(prev => prev.map(ps => {
                                if (ps.providerId === selectedProvider) {
                                  const updated = [...ps.schedule];
                                  updated[idx].isOpen = e.target.checked;
                                  return { ...ps, schedule: updated };
                                }
                                return ps;
                              }));
                            }}
                            className="w-4 h-4"
                          />
                          <span className={day.isOpen ? 'font-medium' : 'text-gray-400'}>{day.day}</span>
                        </label>
                      </div>
                      {day.isOpen ? (
                        <>
                          <input
                            type="time"
                            value={day.open}
                            onChange={(e) => {
                              setProviderSchedules(prev => prev.map(ps => {
                                if (ps.providerId === selectedProvider) {
                                  const updated = [...ps.schedule];
                                  updated[idx].open = e.target.value;
                                  return { ...ps, schedule: updated };
                                }
                                return ps;
                              }));
                            }}
                            className="px-3 py-2 border rounded text-sm"
                          />
                          <span>to</span>
                          <input
                            type="time"
                            value={day.close}
                            onChange={(e) => {
                              setProviderSchedules(prev => prev.map(ps => {
                                if (ps.providerId === selectedProvider) {
                                  const updated = [...ps.schedule];
                                  updated[idx].close = e.target.value;
                                  return { ...ps, schedule: updated };
                                }
                                return ps;
                              }));
                            }}
                            className="px-3 py-2 border rounded text-sm"
                          />
                        </>
                      ) : (
                        <span className="text-gray-400 text-sm">Not working</span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {!selectedProvider && (
                <p className="text-gray-500 text-center py-4">Select a provider to edit their schedule</p>
              )}
            </div>
          </div>

          {/* Blackout Dates */}
          <div className="bg-white rounded-xl border">
            <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
              <h2 className="font-semibold">📅 Blackout Dates / Holidays</h2>
              <button className="text-sm text-pink-600 hover:text-pink-700">+ Add Date</button>
            </div>
            <div className="p-4">
              {blackoutDates.map(bd => (
                <div key={bd.id} className="flex items-center justify-between p-3 border-b last:border-0">
                  <div>
                    <p className="font-medium text-sm">{bd.reason}</p>
                    <p className="text-xs text-gray-500">{bd.date}</p>
                  </div>
                  <button className="text-red-500 hover:text-red-700 text-sm">Remove</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Controls & Preview */}
        <div className="space-y-6">
          {/* Capacity Settings */}
          <div className="bg-white rounded-xl border">
            <div className="p-4 border-b bg-gray-50">
              <h2 className="font-semibold">⚙️ Capacity Controls</h2>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Daily Appointments</label>
                <input
                  type="number"
                  value={capacitySettings.maxDailyAppointments}
                  onChange={(e) => setCapacitySettings(prev => ({ ...prev, maxDailyAppointments: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border rounded-lg"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Concurrent Bookings</label>
                <input
                  type="number"
                  value={capacitySettings.maxConcurrent}
                  onChange={(e) => setCapacitySettings(prev => ({ ...prev, maxConcurrent: parseInt(e.target.value) || 1 }))}
                  className="w-full px-3 py-2 border rounded-lg"
                  min="1"
                />
              </div>
              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={capacitySettings.allowOverbooking}
                  onChange={(e) => setCapacitySettings(prev => ({ ...prev, allowOverbooking: e.target.checked }))}
                  className="w-5 h-5"
                />
                <div>
                  <span className="font-medium text-sm">Allow Overbooking</span>
                  <p className="text-xs text-gray-500">Requires manual approval</p>
                </div>
              </label>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="bg-purple-50 border border-pink-200 rounded-xl p-4">
            <h3 className="font-semibold text-purple-800 mb-3">👁️ Preview Panel</h3>
            <p className="text-sm text-pink-600 mb-3">"This is what clients will see."</p>
            <div className="bg-white rounded-lg p-3 text-sm">
              <p className="font-medium mb-2">Available Hours</p>
              {businessHours.filter(d => d.isOpen).map(d => (
                <div key={d.day} className="flex justify-between text-xs text-gray-600 py-1">
                  <span>{d.day}</span>
                  <span>{d.open} - {d.close}</span>
                </div>
              ))}
              {businessHours.filter(d => !d.isOpen).map(d => (
                <div key={d.day} className="flex justify-between text-xs text-gray-400 py-1">
                  <span>{d.day}</span>
                  <span>Closed</span>
                </div>
              ))}
            </div>
          </div>

          {/* Capacity Indicator */}
          <div className="bg-white rounded-xl border p-4">
            <h3 className="font-semibold text-gray-800 mb-3">📊 Today's Capacity</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Booked</span>
                <span className="font-medium">18 / {capacitySettings.maxDailyAppointments}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-pink-500 rounded-full h-2" style={{ width: `${(18 / capacitySettings.maxDailyAppointments) * 100}%` }} />
              </div>
              <p className="text-xs text-gray-500">{capacitySettings.maxDailyAppointments - 18} slots remaining</p>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={saveSettings}
            className="w-full px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 font-medium"
          >
            Save All Scheduling Settings
          </button>
        </div>
      </div>
    </OwnerLayout>
  );
}
