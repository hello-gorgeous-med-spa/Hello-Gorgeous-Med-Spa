'use client';

// ============================================================
// PROVIDER DASHBOARD - Command Center
// The heart of daily clinical operations
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface Appointment {
  id: string;
  client_name: string;
  client_phone?: string;
  client_email?: string;
  service_name: string;
  starts_at: string;
  ends_at: string;
  status: string;
  service_price?: number;
  duration?: number;
  notes?: string;
  consent_status?: 'complete' | 'pending' | 'expired';
}

interface Alert {
  id: string;
  type: 'consent' | 'allergy' | 'expiring' | 'low_stock' | 'no_show' | 'checkin';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  action_url?: string;
  action_label?: string;
  created_at: string;
}

export default function ProviderDashboard() {
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [stats, setStats] = useState({
    totalToday: 0,
    completed: 0,
    remaining: 0,
    noShows: 0,
    revenue: 0,
    unitsToday: 0,
  });
  const [waitingRoom, setWaitingRoom] = useState<Appointment[]>([]);
  const [showAllAlerts, setShowAllAlerts] = useState(false);

  // Fetch today's appointments
  const fetchAppointments = useCallback(async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const res = await fetch(`/api/appointments?date=${today}`);
      const data = await res.json();
      
      if (data.appointments) {
        const sorted = data.appointments.sort((a: any, b: any) => 
          new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime()
        );
        setTodayAppointments(sorted);

        // Calculate stats
        const now = new Date().getTime();
        const completed = sorted.filter((a: any) => a.status === 'completed').length;
        const noShows = sorted.filter((a: any) => a.status === 'no_show').length;
        const remaining = sorted.filter((a: any) => 
          new Date(a.starts_at).getTime() > now && 
          !['cancelled', 'completed', 'no_show'].includes(a.status)
        ).length;
        const revenue = sorted
          .filter((a: any) => a.status === 'completed')
          .reduce((sum: number, a: any) => sum + (a.service_price || 0), 0);

        setStats({
          totalToday: sorted.filter((a: any) => a.status !== 'cancelled').length,
          completed,
          remaining,
          noShows,
          revenue,
          unitsToday: completed * 25, // Estimate - would come from actual charting
        });

        // Set waiting room (checked_in status)
        setWaitingRoom(sorted.filter((a: any) => a.status === 'checked_in'));
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
    // Refresh every 30 seconds for real-time updates
    const interval = setInterval(fetchAppointments, 30000);
    return () => clearInterval(interval);
  }, [fetchAppointments]);

  // Generate alerts based on data
  useEffect(() => {
    const newAlerts: Alert[] = [];
    const now = new Date();

    // Check for pending consents
    todayAppointments.forEach(apt => {
      if (apt.consent_status === 'pending' || apt.consent_status === 'expired') {
        newAlerts.push({
          id: `consent-${apt.id}`,
          type: 'consent',
          severity: 'warning',
          title: 'Consent Required',
          message: `${apt.client_name} needs consent forms before ${apt.service_name}`,
          action_url: `/provider/patients?id=${apt.id}`,
          action_label: 'Review',
          created_at: now.toISOString(),
        });
      }
    });

    // Check for check-ins
    waitingRoom.forEach(apt => {
      const waitTime = Math.round((now.getTime() - new Date(apt.starts_at).getTime()) / 60000);
      if (waitTime > 5) {
        newAlerts.push({
          id: `checkin-${apt.id}`,
          type: 'checkin',
          severity: waitTime > 15 ? 'critical' : 'info',
          title: 'Patient Waiting',
          message: `${apt.client_name} has been waiting ${waitTime} minutes`,
          action_url: `/provider/charting?appointment=${apt.id}`,
          action_label: 'Start Visit',
          created_at: now.toISOString(),
        });
      }
    });

    setAlerts(newAlerts);
  }, [todayAppointments, waitingRoom]);

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'checked_in': return 'bg-green-100 text-green-700 border-green-200';
      case 'in_progress': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'completed': return 'bg-gray-100 text-gray-600 border-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      case 'no_show': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-50 border-red-200 text-red-800';
      case 'warning': return 'bg-amber-50 border-amber-200 text-amber-800';
      default: return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  // Current and next appointment
  const now = new Date().getTime();
  const currentAppointment = todayAppointments.find(apt => {
    const start = new Date(apt.starts_at).getTime();
    const end = new Date(apt.ends_at).getTime();
    return now >= start && now <= end && apt.status === 'in_progress';
  });

  const nextAppointment = todayAppointments.find(apt => {
    const start = new Date(apt.starts_at).getTime();
    return start > now && !['cancelled', 'completed', 'no_show'].includes(apt.status);
  });

  // Upcoming appointments (next 3)
  const upcomingAppointments = todayAppointments
    .filter(apt => {
      const start = new Date(apt.starts_at).getTime();
      return start > now && !['cancelled', 'completed', 'no_show'].includes(apt.status);
    })
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Critical Alerts Banner */}
      {alerts.filter(a => a.severity === 'critical').length > 0 && (
        <div className="bg-red-500 text-white rounded-xl p-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🚨</span>
            <div className="flex-1">
              <p className="font-bold">Attention Required</p>
              <p className="text-sm text-red-100">
                {alerts.filter(a => a.severity === 'critical').length} critical items need your attention
              </p>
            </div>
            <button 
              onClick={() => setShowAllAlerts(true)}
              className="px-4 py-2 bg-white text-red-600 rounded-lg font-medium hover:bg-red-50"
            >
              View All
            </button>
          </div>
        </div>
      )}

      {/* Waiting Room Alert */}
      {waitingRoom.length > 0 && (
        <div className="bg-green-500 text-white rounded-xl p-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl animate-pulse">👥</span>
            <div className="flex-1">
              <p className="font-bold">{waitingRoom.length} Patient{waitingRoom.length > 1 ? 's' : ''} Checked In</p>
              <p className="text-sm text-green-100">
                {waitingRoom.map(w => w.client_name).join(', ')}
              </p>
            </div>
            <Link 
              href="/provider/queue"
              className="px-4 py-2 bg-white text-green-600 rounded-lg font-medium hover:bg-green-50"
            >
              View Queue
            </Link>
          </div>
        </div>
      )}

      {/* Current Appointment (Hero) */}
      {currentAppointment && (
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-3 h-3 bg-white rounded-full animate-pulse"></span>
            <span className="text-sm font-semibold text-white/80 uppercase tracking-wide">Now in Progress</span>
          </div>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-1">{currentAppointment.client_name}</h2>
              <p className="text-xl text-white/90">{currentAppointment.service_name}</p>
              <p className="text-white/70 mt-2">
                {formatTime(currentAppointment.starts_at)} - {formatTime(currentAppointment.ends_at)}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Link
                href={`/provider/charting?appointment=${currentAppointment.id}`}
                className="px-5 py-2.5 bg-white text-purple-600 rounded-lg font-semibold hover:bg-white/90 text-center"
              >
                📝 Open Chart
              </Link>
              <Link
                href={`/provider/patients?id=${currentAppointment.id}`}
                className="px-5 py-2.5 bg-white/20 text-white rounded-lg font-medium hover:bg-white/30 text-center"
              >
                View Patient
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Today's Patients</p>
          <p className="text-3xl font-bold text-gray-900">{stats.totalToday}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Remaining</p>
          <p className="text-3xl font-bold text-blue-600">{stats.remaining}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-sm text-gray-500">No Shows</p>
          <p className="text-3xl font-bold text-amber-600">{stats.noShows}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Revenue Today</p>
          <p className="text-3xl font-bold text-green-600">${stats.revenue.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Units Today</p>
          <p className="text-3xl font-bold text-purple-600">{stats.unitsToday}</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming Appointments */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Upcoming Today</h2>
            <Link href="/provider/schedule" className="text-sm text-pink-600 hover:text-pink-700">
              Full Schedule →
            </Link>
          </div>
          
          {upcomingAppointments.length === 0 ? (
            <div className="p-8 text-center">
              <span className="text-4xl block mb-2">🎉</span>
              <p className="text-gray-500">All caught up! No more appointments today.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {upcomingAppointments.map((apt, idx) => (
                <div key={apt.id} className={`px-5 py-4 hover:bg-gray-50 ${idx === 0 ? 'bg-blue-50' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-center min-w-[80px]">
                        <p className={`text-lg font-bold ${idx === 0 ? 'text-blue-600' : 'text-gray-900'}`}>
                          {formatTime(apt.starts_at)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {apt.duration || 30} min
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-900">{apt.client_name}</p>
                          {idx === 0 && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                              Up Next
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{apt.service_name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(apt.status)}`}>
                        {apt.status.replace('_', ' ')}
                      </span>
                      <Link
                        href={`/provider/charting?appointment=${apt.id}`}
                        className="px-3 py-1.5 bg-pink-500 text-white text-sm font-medium rounded-lg hover:bg-pink-600"
                      >
                        Start
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar - Alerts & Quick Actions */}
        <div className="space-y-6">
          {/* Alerts */}
          {alerts.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900">Alerts ({alerts.length})</h2>
              </div>
              <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
                {alerts.slice(0, showAllAlerts ? undefined : 3).map((alert) => (
                  <div key={alert.id} className={`p-4 ${getAlertColor(alert.severity)}`}>
                    <div className="flex items-start gap-3">
                      <span className="text-lg">
                        {alert.type === 'consent' && '📋'}
                        {alert.type === 'checkin' && '👤'}
                        {alert.type === 'allergy' && '⚠️'}
                        {alert.type === 'expiring' && '⏰'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{alert.title}</p>
                        <p className="text-xs opacity-80">{alert.message}</p>
                        {alert.action_url && (
                          <Link
                            href={alert.action_url}
                            className="text-xs font-medium underline mt-1 inline-block"
                          >
                            {alert.action_label || 'View'}
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {alerts.length > 3 && !showAllAlerts && (
                <button
                  onClick={() => setShowAllAlerts(true)}
                  className="w-full py-2 text-sm text-gray-600 hover:bg-gray-50"
                >
                  Show all {alerts.length} alerts
                </button>
              )}
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/provider/charting/new"
                className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg hover:bg-pink-50 hover:text-pink-600 transition-colors"
              >
                <span className="text-2xl">📝</span>
                <span className="text-sm font-medium">New Chart</span>
              </Link>
              <Link
                href="/pos/quick-sale"
                className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg hover:bg-green-50 hover:text-green-600 transition-colors"
              >
                <span className="text-2xl">💳</span>
                <span className="text-sm font-medium">Quick Sale</span>
              </Link>
              <Link
                href="/provider/patients"
                className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <span className="text-2xl">🔍</span>
                <span className="text-sm font-medium">Find Patient</span>
              </Link>
              <Link
                href="/provider/inventory"
                className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg hover:bg-purple-50 hover:text-purple-600 transition-colors"
              >
                <span className="text-2xl">💉</span>
                <span className="text-sm font-medium">Products</span>
              </Link>
            </div>
          </div>

          {/* Compliance Checklist */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Today's Compliance</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded text-green-500" />
                <span className="text-sm text-green-800">Temperature log completed</span>
              </label>
              <label className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded text-green-500" />
                <span className="text-sm text-green-800">Equipment sanitized</span>
              </label>
              <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <input type="checkbox" className="w-5 h-5 rounded" />
                <span className="text-sm">End of day reconciliation</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Full Day Timeline */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Full Day Timeline</h2>
          <span className="text-sm text-gray-500">{todayAppointments.length} appointments</span>
        </div>
        <div className="p-5 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {/* Time blocks from 9 AM to 6 PM */}
            {Array.from({ length: 10 }, (_, i) => {
              const hour = 9 + i;
              const hourStr = hour > 12 ? `${hour - 12} PM` : hour === 12 ? '12 PM' : `${hour} AM`;
              const aptsInHour = todayAppointments.filter(apt => {
                const aptHour = new Date(apt.starts_at).getHours();
                return aptHour === hour;
              });
              
              return (
                <div key={hour} className="w-24 flex-shrink-0">
                  <p className="text-xs text-gray-500 mb-2 text-center">{hourStr}</p>
                  <div className="h-20 bg-gray-50 rounded-lg border border-gray-200 p-1 overflow-hidden">
                    {aptsInHour.map(apt => (
                      <div
                        key={apt.id}
                        className={`text-xs p-1 rounded mb-1 truncate ${
                          apt.status === 'completed' ? 'bg-green-200 text-green-800' :
                          apt.status === 'in_progress' ? 'bg-purple-200 text-purple-800' :
                          apt.status === 'checked_in' ? 'bg-blue-200 text-blue-800' :
                          apt.status === 'cancelled' ? 'bg-red-200 text-red-800 line-through' :
                          'bg-pink-200 text-pink-800'
                        }`}
                        title={`${apt.client_name} - ${apt.service_name}`}
                      >
                        {apt.client_name.split(' ')[0]}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
