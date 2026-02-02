'use client';

// ============================================================
// MY SCHEDULE - Provider Schedule Management
// View and manage personal availability
// ============================================================

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ScheduleDay {
  day_of_week: number;
  is_working: boolean;
  start_time: string | null;
  end_time: string | null;
}

interface Appointment {
  id: string;
  client_name: string;
  service_name: string;
  starts_at: string;
  ends_at: string;
  status: string;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAY_ABBREV = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function ProviderSchedulePage() {
  const [weeklySchedule, setWeeklySchedule] = useState<ScheduleDay[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [editingDay, setEditingDay] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ is_working: true, start_time: '09:00', end_time: '17:00' });
  const [saving, setSaving] = useState(false);

  // Get week dates
  const getWeekDates = () => {
    const dates = [];
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates();

  // Fetch schedule and appointments
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Get providers first to find the current provider ID
        const providersRes = await fetch('/api/providers');
        const providersData = await providersRes.json();
        
        // Use first provider for now (would come from auth session)
        const providerId = providersData.providers?.[0]?.id;
        
        if (providerId) {
          // Fetch weekly schedule
          const scheduleRes = await fetch(`/api/providers/${providerId}/schedules`);
          const scheduleData = await scheduleRes.json();
          
          if (scheduleData.schedules) {
            setWeeklySchedule(scheduleData.schedules);
          }

          // Fetch this week's appointments
          const startDate = weekDates[0].toISOString().split('T')[0];
          const endDate = weekDates[6].toISOString().split('T')[0];
          const aptsRes = await fetch(`/api/appointments?provider_id=${providerId}&start_date=${startDate}&end_date=${endDate}`);
          const aptsData = await aptsRes.json();
          
          if (aptsData.appointments) {
            setAppointments(aptsData.appointments);
          }
        }
      } catch (error) {
        console.error('Error fetching schedule:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  const formatTime = (time: string | null) => {
    if (!time) return '--:--';
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    return `${displayHour}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const getAppointmentsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return appointments.filter(apt => apt.starts_at.startsWith(dateStr));
  };

  const handleEditDay = (dayOfWeek: number) => {
    const daySchedule = weeklySchedule.find(s => s.day_of_week === dayOfWeek);
    setEditForm({
      is_working: daySchedule?.is_working ?? true,
      start_time: daySchedule?.start_time || '09:00',
      end_time: daySchedule?.end_time || '17:00',
    });
    setEditingDay(dayOfWeek);
  };

  const handleSaveDay = async () => {
    if (editingDay === null) return;
    
    setSaving(true);
    try {
      // Get provider ID
      const providersRes = await fetch('/api/providers');
      const providersData = await providersRes.json();
      const providerId = providersData.providers?.[0]?.id;
      
      if (providerId) {
        const res = await fetch(`/api/providers/${providerId}/schedules`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            schedules: [{
              day_of_week: editingDay,
              is_working: editForm.is_working,
              start_time: editForm.is_working ? editForm.start_time : null,
              end_time: editForm.is_working ? editForm.end_time : null,
            }],
          }),
        });
        
        if (res.ok) {
          // Update local state
          setWeeklySchedule(prev => prev.map(s => 
            s.day_of_week === editingDay
              ? { ...s, ...editForm, start_time: editForm.is_working ? editForm.start_time : null, end_time: editForm.is_working ? editForm.end_time : null }
              : s
          ));
          setEditingDay(null);
        }
      }
    } catch (error) {
      console.error('Error saving schedule:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Schedule</h1>
          <p className="text-gray-500">Manage your availability and view appointments</p>
        </div>
        <Link
          href="/admin/team/schedules"
          className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 font-medium"
        >
          Full Schedule Editor
        </Link>
      </div>

      {/* Weekly Schedule Overview */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Weekly Hours</h2>
        </div>
        <div className="grid grid-cols-7 divide-x divide-gray-100">
          {DAYS.map((day, idx) => {
            const schedule = weeklySchedule.find(s => s.day_of_week === idx);
            const isToday = new Date().getDay() === idx;
            
            return (
              <div 
                key={day} 
                className={`p-4 ${isToday ? 'bg-pink-50' : ''}`}
              >
                <div className="text-center mb-3">
                  <p className={`font-semibold ${isToday ? 'text-pink-600' : 'text-gray-900'}`}>
                    {DAY_ABBREV[idx]}
                  </p>
                  {isToday && <span className="text-xs text-pink-500">Today</span>}
                </div>
                
                {schedule?.is_working ? (
                  <div className="text-center">
                    <p className="text-sm text-green-600 font-medium">Working</p>
                    <p className="text-xs text-gray-500">
                      {formatTime(schedule.start_time)}
                    </p>
                    <p className="text-xs text-gray-500">
                      to {formatTime(schedule.end_time)}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 text-center">Off</p>
                )}
                
                <button
                  onClick={() => handleEditDay(idx)}
                  className="w-full mt-2 px-2 py-1 text-xs text-gray-500 hover:text-pink-600 hover:bg-pink-50 rounded"
                >
                  Edit
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* This Week's View */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">This Week's Appointments</h2>
        </div>
        <div className="grid grid-cols-7 divide-x divide-gray-100">
          {weekDates.map((date, idx) => {
            const dateAppts = getAppointmentsForDate(date);
            const isToday = date.toDateString() === new Date().toDateString();
            const schedule = weeklySchedule.find(s => s.day_of_week === idx);
            
            return (
              <div 
                key={idx}
                className={`min-h-[200px] ${!schedule?.is_working ? 'bg-gray-50' : ''} ${isToday ? 'bg-blue-50' : ''}`}
              >
                <div className={`p-2 text-center border-b border-gray-100 ${isToday ? 'bg-blue-100' : 'bg-gray-50'}`}>
                  <p className="text-xs text-gray-500">{DAY_ABBREV[idx]}</p>
                  <p className={`text-lg font-bold ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                    {date.getDate()}
                  </p>
                </div>
                
                <div className="p-2 space-y-1">
                  {!schedule?.is_working ? (
                    <p className="text-xs text-gray-400 text-center py-4">Day Off</p>
                  ) : dateAppts.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-4">No appts</p>
                  ) : (
                    dateAppts.slice(0, 5).map(apt => (
                      <Link
                        key={apt.id}
                        href={`/provider/charting?appointment=${apt.id}`}
                        className={`block p-1.5 text-xs rounded ${
                          apt.status === 'completed' ? 'bg-green-100 text-green-700' :
                          apt.status === 'cancelled' ? 'bg-gray-100 text-gray-500 line-through' :
                          'bg-pink-100 text-pink-700'
                        }`}
                      >
                        <p className="font-medium truncate">
                          {new Date(apt.starts_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                        </p>
                        <p className="truncate">{apt.client_name?.split(' ')[0]}</p>
                      </Link>
                    ))
                  )}
                  {dateAppts.length > 5 && (
                    <p className="text-xs text-gray-500 text-center">
                      +{dateAppts.length - 5} more
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Today's Detailed Schedule */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Today's Schedule</h2>
          <span className="text-sm text-gray-500">
            {getAppointmentsForDate(new Date()).length} appointments
          </span>
        </div>
        
        <div className="divide-y divide-gray-100">
          {getAppointmentsForDate(new Date()).length === 0 ? (
            <div className="p-8 text-center">
              <span className="text-4xl block mb-2">📅</span>
              <p className="text-gray-500">No appointments scheduled for today</p>
            </div>
          ) : (
            getAppointmentsForDate(new Date()).map(apt => (
              <div key={apt.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="text-center min-w-[80px]">
                    <p className="text-lg font-bold text-gray-900">
                      {new Date(apt.starts_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(apt.ends_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{apt.client_name}</p>
                    <p className="text-sm text-gray-500">{apt.service_name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    apt.status === 'completed' ? 'bg-green-100 text-green-700' :
                    apt.status === 'in_progress' ? 'bg-pink-100 text-pink-700' :
                    apt.status === 'checked_in' ? 'bg-blue-100 text-blue-700' :
                    apt.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {apt.status.replace('_', ' ')}
                  </span>
                  <Link
                    href={`/provider/charting?appointment=${apt.id}`}
                    className="px-3 py-1.5 bg-pink-500 text-white text-sm rounded-lg hover:bg-pink-600"
                  >
                    Chart
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Edit Day Modal */}
      {editingDay !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Edit {DAYS[editingDay]} Schedule
            </h2>
            
            <div className="space-y-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={editForm.is_working}
                  onChange={(e) => setEditForm(prev => ({ ...prev, is_working: e.target.checked }))}
                  className="w-5 h-5 rounded text-pink-500"
                />
                <span className="text-gray-900">Working this day</span>
              </label>
              
              {editForm.is_working && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Start Time</label>
                    <input
                      type="time"
                      value={editForm.start_time}
                      onChange={(e) => setEditForm(prev => ({ ...prev, start_time: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">End Time</label>
                    <input
                      type="time"
                      value={editForm.end_time}
                      onChange={(e) => setEditForm(prev => ({ ...prev, end_time: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditingDay(null)}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDay}
                disabled={saving}
                className="flex-1 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
