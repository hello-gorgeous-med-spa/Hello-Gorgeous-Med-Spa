'use client';

// ============================================================
// PROVIDER DASHBOARD
// Provider-specific view of appointments, schedule, and charting
// ============================================================

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Appointment {
  id: string;
  client_name: string;
  service_name: string;
  starts_at: string;
  ends_at: string;
  status: string;
  client_phone?: string;
}

export default function ProviderDashboard() {
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Fetch today's appointments
  useEffect(() => {
    async function fetchAppointments() {
      try {
        const today = new Date().toISOString().split('T')[0];
        const res = await fetch(`/api/appointments?date=${today}`);
        const data = await res.json();
        
        if (data.appointments) {
          // Sort by time
          const sorted = data.appointments.sort((a: any, b: any) => 
            new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime()
          );
          setTodayAppointments(sorted);
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchAppointments();
  }, []);

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700';
      case 'checked_in': return 'bg-blue-100 text-blue-700';
      case 'in_progress': return 'bg-purple-100 text-purple-700';
      case 'completed': return 'bg-gray-100 text-gray-600';
      case 'cancelled': return 'bg-red-100 text-red-700';
      case 'no_show': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  // Find current/next appointment
  const now = currentTime.getTime();
  const currentAppointment = todayAppointments.find(apt => {
    const start = new Date(apt.starts_at).getTime();
    const end = new Date(apt.ends_at).getTime();
    return now >= start && now <= end && apt.status !== 'cancelled' && apt.status !== 'completed';
  });

  const nextAppointment = todayAppointments.find(apt => {
    const start = new Date(apt.starts_at).getTime();
    return start > now && apt.status !== 'cancelled' && apt.status !== 'completed';
  });

  const upcomingCount = todayAppointments.filter(apt => 
    new Date(apt.starts_at).getTime() > now && 
    apt.status !== 'cancelled' && 
    apt.status !== 'completed'
  ).length;

  const completedCount = todayAppointments.filter(apt => 
    apt.status === 'completed'
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">HG</span>
                </div>
                <span className="font-bold text-gray-900">Provider Portal</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </span>
              <span className="text-lg font-semibold text-gray-900">
                {currentTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
              </span>
              <Link 
                href="/admin" 
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
              >
                Full Admin →
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-sm text-gray-500 mb-1">Today's Appointments</p>
            <p className="text-3xl font-bold text-gray-900">{todayAppointments.length}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-sm text-gray-500 mb-1">Remaining</p>
            <p className="text-3xl font-bold text-blue-600">{upcomingCount}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-sm text-gray-500 mb-1">Completed</p>
            <p className="text-3xl font-bold text-green-600">{completedCount}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-sm text-gray-500 mb-1">No Shows</p>
            <p className="text-3xl font-bold text-amber-600">
              {todayAppointments.filter(a => a.status === 'no_show').length}
            </p>
          </div>
        </div>

        {/* Current/Next Appointment */}
        {(currentAppointment || nextAppointment) && (
          <div className="mb-8">
            {currentAppointment ? (
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-3 h-3 bg-white rounded-full animate-pulse"></span>
                  <span className="text-sm font-medium text-white/80">NOW IN PROGRESS</span>
                </div>
                <h2 className="text-2xl font-bold mb-1">{currentAppointment.client_name}</h2>
                <p className="text-white/90 text-lg">{currentAppointment.service_name}</p>
                <p className="text-white/70 mt-2">
                  {formatTime(currentAppointment.starts_at)} - {formatTime(currentAppointment.ends_at)}
                </p>
                <div className="mt-4 flex gap-3">
                  <Link
                    href={`/admin/charting?appointment=${currentAppointment.id}`}
                    className="px-4 py-2 bg-white text-purple-600 rounded-lg font-medium hover:bg-white/90"
                  >
                    Open Chart
                  </Link>
                  <Link
                    href={`/admin/appointments/${currentAppointment.id}`}
                    className="px-4 py-2 bg-white/20 text-white rounded-lg font-medium hover:bg-white/30"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ) : nextAppointment && (
              <div className="bg-white rounded-2xl border-2 border-blue-200 p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-blue-500">⏰</span>
                  <span className="text-sm font-medium text-blue-600">UP NEXT</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{nextAppointment.client_name}</h2>
                <p className="text-gray-600 text-lg">{nextAppointment.service_name}</p>
                <p className="text-gray-500 mt-2">
                  {formatTime(nextAppointment.starts_at)} - {formatTime(nextAppointment.ends_at)}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Link
            href="/admin/calendar"
            className="bg-white rounded-xl border border-gray-200 p-4 hover:border-pink-300 hover:shadow-md transition-all text-center"
          >
            <span className="text-3xl mb-2 block">📅</span>
            <span className="font-medium text-gray-900">Calendar</span>
          </Link>
          <Link
            href="/admin/charting"
            className="bg-white rounded-xl border border-gray-200 p-4 hover:border-pink-300 hover:shadow-md transition-all text-center"
          >
            <span className="text-3xl mb-2 block">📝</span>
            <span className="font-medium text-gray-900">Charting</span>
          </Link>
          <Link
            href="/admin/team/schedules"
            className="bg-white rounded-xl border border-gray-200 p-4 hover:border-pink-300 hover:shadow-md transition-all text-center"
          >
            <span className="text-3xl mb-2 block">🗓️</span>
            <span className="font-medium text-gray-900">My Schedule</span>
          </Link>
          <Link
            href="/pos"
            className="bg-white rounded-xl border border-gray-200 p-4 hover:border-pink-300 hover:shadow-md transition-all text-center"
          >
            <span className="text-3xl mb-2 block">💳</span>
            <span className="font-medium text-gray-900">Checkout</span>
          </Link>
        </div>

        {/* Today's Schedule */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Today's Schedule</h2>
            <Link href="/admin/appointments" className="text-sm text-pink-600 hover:text-pink-700">
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : todayAppointments.length === 0 ? (
            <div className="p-8 text-center">
              <span className="text-4xl mb-4 block">🎉</span>
              <p className="text-gray-500">No appointments scheduled for today</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {todayAppointments.map((apt) => {
                const aptTime = new Date(apt.starts_at).getTime();
                const isPast = aptTime < now && apt.status !== 'in_progress';
                const isCurrent = apt.id === currentAppointment?.id;
                
                return (
                  <div 
                    key={apt.id} 
                    className={`px-6 py-4 flex items-center justify-between ${
                      isCurrent ? 'bg-purple-50' : isPast ? 'opacity-60' : ''
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-center min-w-[70px]">
                        <p className={`font-semibold ${isCurrent ? 'text-purple-600' : 'text-gray-900'}`}>
                          {formatTime(apt.starts_at)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatTime(apt.ends_at)}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{apt.client_name}</p>
                        <p className="text-sm text-gray-500">{apt.service_name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>
                        {apt.status.replace('_', ' ')}
                      </span>
                      <Link
                        href={`/admin/appointments/${apt.id}`}
                        className="px-3 py-1.5 text-sm text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-lg"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
