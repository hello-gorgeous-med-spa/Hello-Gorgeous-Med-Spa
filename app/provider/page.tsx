'use client';

// ============================================================
// PROVIDER DASHBOARD - DAILY WORKSPACE
// Fresha-Level UX - Calm, focused, confidence-boosting
// This is where providers live all day
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  KPICard,
  KPISkeleton,
  StatusBadge,
  EmptyState,
  Card,
  SectionHeader,
  AlertBanner,
  Skeleton,
  ProgressBar,
} from '@/components/ui/design-system';

// ============================================================
// TYPES
// ============================================================
interface Appointment {
  id: string;
  client_name: string;
  client_id?: string;
  service_name: string;
  starts_at: string;
  ends_at: string;
  status: string;
  service_price?: number;
  duration?: number;
  notes?: string;
}

interface ProviderStats {
  todayTotal: number;
  completed: number;
  remaining: number;
  noShows: number;
  revenue: number;
  unitsUsed: number;
}

interface Task {
  id: string;
  type: 'chart' | 'consent' | 'photo' | 'signature' | 'followup';
  title: string;
  client: string;
  urgent: boolean;
  appointmentId?: string;
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function ProviderDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState<ProviderStats | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [waitingRoom, setWaitingRoom] = useState<Appointment[]>([]);

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const res = await fetch(`/api/appointments?date=${today}`);
      
      if (!res.ok) {
        throw new Error('Failed to fetch appointments');
      }

      const data = await res.json();
      const appts = (data.appointments || []).sort((a: any, b: any) => 
        new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime()
      );
      
      setAppointments(appts);

      // Calculate stats
      const completed = appts.filter((a: Appointment) => a.status === 'completed').length;
      const noShows = appts.filter((a: Appointment) => a.status === 'no_show').length;
      const now = new Date().getTime();
      const remaining = appts.filter((a: Appointment) => {
        const start = new Date(a.starts_at).getTime();
        return start > now && !['cancelled', 'completed', 'no_show'].includes(a.status);
      }).length;
      const revenue = appts
        .filter((a: Appointment) => a.status === 'completed')
        .reduce((sum: number, a: Appointment) => sum + (a.service_price || 0), 0);

      setStats({
        todayTotal: appts.filter((a: Appointment) => a.status !== 'cancelled').length,
        completed,
        remaining,
        noShows,
        revenue,
        unitsUsed: completed * 25, // Estimate - would come from actual charting
      });

      // Set waiting room
      setWaitingRoom(appts.filter((a: Appointment) => a.status === 'checked_in'));

      // Generate tasks from appointments
      const generatedTasks: Task[] = [];
      appts.forEach((apt: Appointment) => {
        if (apt.status === 'completed') {
          // Check if chart is incomplete (mock check)
          if (Math.random() > 0.7) { // Simulated incomplete
            generatedTasks.push({
              id: `chart-${apt.id}`,
              type: 'chart',
              title: 'Complete chart notes',
              client: apt.client_name,
              urgent: true,
              appointmentId: apt.id,
            });
          }
        }
      });
      setTasks(generatedTasks);

      setError(null);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Unable to load schedule');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // Refresh every 30 seconds for real-time feel
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Current & next appointment
  const now = new Date().getTime();
  const currentAppointment = appointments.find(apt => {
    const start = new Date(apt.starts_at).getTime();
    const end = new Date(apt.ends_at).getTime();
    return now >= start && now <= end && apt.status === 'in_progress';
  });

  const upcomingAppointments = appointments
    .filter(apt => {
      const start = new Date(apt.starts_at).getTime();
      return start > now && !['cancelled', 'completed', 'no_show'].includes(apt.status);
    })
    .slice(0, 6);

  const nextAppointment = upcomingAppointments[0];

  // Format time
  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Get status color
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'checked_in': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'in_progress': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'completed': return 'bg-gray-100 text-gray-500 border-gray-200';
      case 'no_show': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Waiting Room Alert */}
      {waitingRoom.length > 0 && (
        <div className="bg-emerald-500 text-white rounded-2xl p-5 shadow-lg shadow-emerald-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl animate-pulse">👥</span>
              </div>
              <div>
                <p className="font-bold text-lg">
                  {waitingRoom.length} Patient{waitingRoom.length > 1 ? 's' : ''} Checked In
                </p>
                <p className="text-emerald-100 text-sm">
                  {waitingRoom.map(w => w.client_name.split(' ')[0]).join(', ')}
                </p>
              </div>
            </div>
            <Link
              href="/provider/queue"
              className="px-5 py-2.5 bg-white text-emerald-600 font-semibold rounded-xl hover:bg-emerald-50 transition-colors"
            >
              View Queue
            </Link>
          </div>
        </div>
      )}

      {/* Current Appointment - Hero Card */}
      {currentAppointment && (
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-xl shadow-purple-500/20">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-3 h-3 bg-white rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-white/80 uppercase tracking-wide">
              Now in Progress
            </span>
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
                className="px-6 py-3 bg-white text-purple-600 rounded-xl font-semibold hover:bg-white/90 transition-colors text-center shadow-lg"
              >
                📝 Open Chart
              </Link>
              <Link
                href={`/provider/patients?id=${currentAppointment.client_id}`}
                className="px-6 py-3 bg-white/20 text-white rounded-xl font-medium hover:bg-white/30 transition-colors text-center"
              >
                View Patient
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {loading ? (
          <>
            <KPISkeleton />
            <KPISkeleton />
            <KPISkeleton />
            <KPISkeleton />
            <KPISkeleton />
            <KPISkeleton />
          </>
        ) : stats ? (
          <>
            <KPICard
              label="Today's Patients"
              value={stats.todayTotal}
              icon="👥"
              color="pink"
            />
            <KPICard
              label="Completed"
              value={stats.completed}
              icon="✅"
              color="green"
            />
            <KPICard
              label="Remaining"
              value={stats.remaining}
              icon="⏳"
              color="default"
            />
            <KPICard
              label="No Shows"
              value={stats.noShows}
              color={stats.noShows > 0 ? 'amber' : 'default'}
            />
            <KPICard
              label="Revenue Today"
              value={stats.revenue}
              prefix="$"
              icon="💰"
              color="green"
            />
            <KPICard
              label="Units Used"
              value={stats.unitsUsed}
              icon="💉"
            />
          </>
        ) : null}
      </div>

      {/* Progress Bar */}
      {stats && stats.todayTotal > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Day Progress</span>
            <span className="text-sm text-gray-500">
              {stats.completed} of {stats.todayTotal} completed
            </span>
          </div>
          <ProgressBar 
            value={stats.completed} 
            max={stats.todayTotal} 
            color="pink" 
            showLabel={false} 
          />
        </Card>
      )}

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming Appointments */}
        <div className="lg:col-span-2">
          <Card padding="none">
            <div className="px-5 py-4 border-b border-gray-100">
              <SectionHeader
                title="Upcoming Today"
                badge={upcomingAppointments.length}
                action={{ label: 'Full Schedule', href: '/provider/schedule' }}
              />
            </div>

            {loading ? (
              <div className="p-5 space-y-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="w-16 h-12 rounded" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-8 w-20 rounded-full" />
                  </div>
                ))}
              </div>
            ) : upcomingAppointments.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {upcomingAppointments.map((apt, idx) => (
                  <div
                    key={apt.id}
                    className={`
                      flex items-center gap-4 px-5 py-4 transition-all hover:bg-gray-50
                      ${idx === 0 ? 'bg-pink-50' : ''}
                    `}
                  >
                    <div className="text-center min-w-[70px]">
                      <p className={`text-lg font-bold ${idx === 0 ? 'text-pink-600' : 'text-gray-900'}`}>
                        {formatTime(apt.starts_at)}
                      </p>
                      <p className="text-xs text-gray-500">{apt.duration || 30} min</p>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900 truncate">{apt.client_name}</p>
                        {idx === 0 && (
                          <span className="px-2 py-0.5 bg-pink-500 text-white text-xs font-bold rounded-full">
                            NEXT
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate">{apt.service_name}</p>
                    </div>

                    <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusStyle(apt.status)}`}>
                      {apt.status === 'checked_in' && (
                        <span className="inline-block w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse" />
                      )}
                      {apt.status.replace('_', ' ')}
                    </span>

                    <Link
                      href={`/provider/charting?appointment=${apt.id}`}
                      className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium rounded-xl transition-colors"
                    >
                      Start
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon="🎉"
                title="All caught up!"
                description="No more appointments remaining today"
              />
            )}
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Tasks */}
          {tasks.length > 0 && (
            <Card padding="none">
              <div className="px-5 py-4 border-b border-gray-100 bg-amber-50">
                <SectionHeader
                  title="Pending Tasks"
                  badge={tasks.length}
                />
              </div>
              <div className="divide-y divide-gray-100">
                {tasks.map(task => (
                  <Link
                    key={task.id}
                    href={task.type === 'chart' ? `/provider/charting?appointment=${task.appointmentId}` : '/provider/tasks'}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-xl">
                      {task.type === 'chart' && '📝'}
                      {task.type === 'consent' && '📋'}
                      {task.type === 'photo' && '📷'}
                      {task.type === 'signature' && '✍️'}
                      {task.type === 'followup' && '📞'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm">{task.title}</p>
                      <p className="text-xs text-gray-500">{task.client}</p>
                    </div>
                    {task.urgent && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                        Urgent
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <SectionHeader title="Quick Actions" />
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/provider/charting/new"
                className="flex flex-col items-center gap-2 p-4 bg-pink-50 hover:bg-pink-100 text-pink-600 rounded-xl transition-colors"
              >
                <span className="text-2xl">📝</span>
                <span className="text-sm font-medium">New Chart</span>
              </Link>
              <Link
                href="/pos/quick-sale"
                className="flex flex-col items-center gap-2 p-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl transition-colors"
              >
                <span className="text-2xl">💳</span>
                <span className="text-sm font-medium">Quick Sale</span>
              </Link>
              <Link
                href="/provider/patients"
                className="flex flex-col items-center gap-2 p-4 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-colors"
              >
                <span className="text-2xl">🔍</span>
                <span className="text-sm font-medium">Find Patient</span>
              </Link>
              <Link
                href="/provider/photos"
                className="flex flex-col items-center gap-2 p-4 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-xl transition-colors"
              >
                <span className="text-2xl">📷</span>
                <span className="text-sm font-medium">Take Photo</span>
              </Link>
            </div>
          </Card>

          {/* Treatment Quick Links */}
          <Card>
            <SectionHeader title="Quick Treatments" />
            <div className="space-y-2">
              <Link
                href="/provider/charting/new?treatment=botox"
                className="flex items-center gap-3 p-3 bg-gradient-to-r from-pink-50 to-purple-50 hover:from-pink-100 hover:to-purple-100 rounded-xl transition-colors"
              >
                <span className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center text-white text-lg">💉</span>
                <div>
                  <p className="font-medium text-gray-900">Botox</p>
                  <p className="text-xs text-gray-500">Neurotoxin injection</p>
                </div>
              </Link>
              <Link
                href="/provider/charting/new?treatment=filler"
                className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 rounded-xl transition-colors"
              >
                <span className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white text-lg">✨</span>
                <div>
                  <p className="font-medium text-gray-900">Filler</p>
                  <p className="text-xs text-gray-500">Dermal filler injection</p>
                </div>
              </Link>
              <Link
                href="/provider/charting/new?treatment=laser"
                className="flex items-center gap-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 rounded-xl transition-colors"
              >
                <span className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center text-white text-lg">⚡</span>
                <div>
                  <p className="font-medium text-gray-900">Laser</p>
                  <p className="text-xs text-gray-500">Laser treatment</p>
                </div>
              </Link>
            </div>
          </Card>

          {/* Compliance Checklist */}
          <Card>
            <SectionHeader title="Daily Compliance" />
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-100 rounded-xl cursor-pointer">
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded text-emerald-500 border-emerald-300" />
                <span className="text-sm text-emerald-800 font-medium">Temperature log completed</span>
              </label>
              <label className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-100 rounded-xl cursor-pointer">
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded text-emerald-500 border-emerald-300" />
                <span className="text-sm text-emerald-800 font-medium">Equipment sanitized</span>
              </label>
              <label className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl cursor-pointer">
                <input type="checkbox" className="w-5 h-5 rounded border-gray-300" />
                <span className="text-sm text-gray-700">End of day reconciliation</span>
              </label>
            </div>
          </Card>
        </div>
      </div>

      {/* Day Timeline */}
      <Card padding="none">
        <div className="px-5 py-4 border-b border-gray-100">
          <SectionHeader
            title="Full Day Timeline"
            badge={appointments.filter(a => a.status !== 'cancelled').length}
          />
        </div>
        <div className="p-5 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {Array.from({ length: 10 }, (_, i) => {
              const hour = 9 + i;
              const hourStr = hour > 12 ? `${hour - 12} PM` : hour === 12 ? '12 PM' : `${hour} AM`;
              const aptsInHour = appointments.filter(apt => {
                const aptHour = new Date(apt.starts_at).getHours();
                return aptHour === hour && apt.status !== 'cancelled';
              });
              
              const isPast = new Date().getHours() > hour;
              const isCurrent = new Date().getHours() === hour;
              
              return (
                <div key={hour} className="w-28 flex-shrink-0">
                  <p className={`text-xs font-medium mb-2 text-center ${
                    isCurrent ? 'text-pink-600' : isPast ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {hourStr}
                    {isCurrent && <span className="ml-1">•</span>}
                  </p>
                  <div className={`
                    min-h-[80px] rounded-xl border-2 border-dashed p-1.5 overflow-hidden
                    ${isCurrent ? 'border-pink-300 bg-pink-50' : isPast ? 'border-gray-200 bg-gray-50' : 'border-gray-200'}
                  `}>
                    {aptsInHour.map(apt => (
                      <Link
                        key={apt.id}
                        href={`/provider/charting?appointment=${apt.id}`}
                        className={`
                          block text-xs p-1.5 rounded-lg mb-1 truncate font-medium
                          ${apt.status === 'completed' ? 'bg-emerald-200 text-emerald-800' :
                            apt.status === 'in_progress' ? 'bg-purple-200 text-purple-800' :
                            apt.status === 'checked_in' ? 'bg-blue-200 text-blue-800' :
                            apt.status === 'no_show' ? 'bg-amber-200 text-amber-800 line-through' :
                            'bg-pink-200 text-pink-800'
                          }
                        `}
                        title={`${apt.client_name} - ${apt.service_name}`}
                      >
                        {apt.client_name.split(' ')[0]}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
}
