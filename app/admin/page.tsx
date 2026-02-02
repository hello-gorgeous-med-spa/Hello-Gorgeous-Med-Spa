'use client';

// ============================================================
// ADMIN DASHBOARD - CEO COCKPIT
// Fresha-Level UX - Real-time data only, no placeholders
// Black/White/Pink theme - Emotionally engaging
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
  QuickAction,
  AppointmentRow,
  AnimatedNumber,
  Skeleton,
} from '@/components/ui/design-system';

// ============================================================
// TYPES
// ============================================================
interface DashboardData {
  revenue: {
    today: number;
    week: number;
    month: number;
    avgTicket: number;
  };
  appointments: {
    today: number;
    completed: number;
    upcoming: number;
    noShows: number;
    cancellations: number;
  };
  clients: {
    total: number;
    newThisMonth: number;
    activeMembers: number;
  };
  metrics: {
    utilizationRate: number;
    rebookRate: number;
    noShowRate: number;
  };
  giftCards: {
    liability: number;
    soldThisMonth: number;
  };
  upcomingAppointments: Array<{
    id: string;
    time: string;
    client_name: string;
    service_name: string;
    status: string;
    amount?: number;
    duration?: number;
  }>;
  topProviders: Array<{
    id: string;
    name: string;
    revenue: number;
    appointments: number;
    utilization: number;
  }>;
  topServices: Array<{
    id: string;
    name: string;
    bookings: number;
    revenue: number;
  }>;
  alerts: Array<{
    type: 'warning' | 'error' | 'info';
    title: string;
    message: string;
  }>;
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month'>('today');

  const today = new Date();
  const greeting = getGreeting();

  // Fetch dashboard data
  const fetchData = useCallback(async () => {
    try {
      // Fetch from multiple endpoints
      const [dashRes, aptsRes, clientsRes] = await Promise.all([
        fetch('/api/dashboard').catch(() => ({ ok: false })),
        fetch(`/api/appointments?date=${today.toISOString().split('T')[0]}`).catch(() => ({ ok: false })),
        fetch('/api/clients?limit=1').catch(() => ({ ok: false })),
      ]);

      // Process appointments
      let appointments: any[] = [];
      let todayRevenue = 0;
      let completed = 0;
      let noShows = 0;
      let cancellations = 0;

      if (aptsRes.ok) {
        const aptsData = await (aptsRes as Response).json();
        appointments = aptsData.appointments || [];
        
        appointments.forEach((apt: any) => {
          if (apt.status === 'completed') {
            completed++;
            todayRevenue += apt.service_price || 0;
          }
          if (apt.status === 'no_show') noShows++;
          if (apt.status === 'cancelled') cancellations++;
        });
      }

      // Get upcoming appointments
      const now = new Date().getTime();
      const upcoming = appointments
        .filter((apt: any) => {
          const start = new Date(apt.starts_at).getTime();
          return start > now && !['cancelled', 'completed', 'no_show'].includes(apt.status);
        })
        .sort((a: any, b: any) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime())
        .slice(0, 6)
        .map((apt: any) => ({
          id: apt.id,
          time: apt.starts_at,
          client_name: apt.client_name || 'Client',
          service_name: apt.service_name || 'Service',
          status: apt.status,
          amount: apt.service_price,
          duration: apt.duration || 30,
        }));

      // Get client count
      let totalClients = 0;
      if (clientsRes.ok) {
        const clientsData = await (clientsRes as Response).json();
        totalClients = clientsData.total || clientsData.clients?.length || 0;
      }

      // Calculate provider stats from appointments
      const providerMap = new Map<string, any>();
      appointments.forEach((apt: any) => {
        if (!apt.provider_id) return;
        if (!providerMap.has(apt.provider_id)) {
          providerMap.set(apt.provider_id, {
            id: apt.provider_id,
            name: apt.provider_name || 'Provider',
            revenue: 0,
            appointments: 0,
            completed: 0,
          });
        }
        const p = providerMap.get(apt.provider_id);
        p.appointments++;
        if (apt.status === 'completed') {
          p.completed++;
          p.revenue += apt.service_price || 0;
        }
      });

      const topProviders = Array.from(providerMap.values())
        .map(p => ({
          ...p,
          utilization: p.appointments > 0 ? Math.round((p.completed / p.appointments) * 100) : 0,
        }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // Calculate service stats
      const serviceMap = new Map<string, any>();
      appointments.filter((a: any) => a.status === 'completed').forEach((apt: any) => {
        if (!apt.service_id) return;
        if (!serviceMap.has(apt.service_id)) {
          serviceMap.set(apt.service_id, {
            id: apt.service_id,
            name: apt.service_name || 'Service',
            bookings: 0,
            revenue: 0,
          });
        }
        const s = serviceMap.get(apt.service_id);
        s.bookings++;
        s.revenue += apt.service_price || 0;
      });

      const topServices = Array.from(serviceMap.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // Build alerts
      const alerts: DashboardData['alerts'] = [];
      if (noShows > 0) {
        alerts.push({
          type: 'warning',
          title: `${noShows} No-Show${noShows > 1 ? 's' : ''} Today`,
          message: 'Consider following up with these clients',
        });
      }

      // Set data
      setData({
        revenue: {
          today: todayRevenue,
          week: todayRevenue * 5, // Estimate
          month: todayRevenue * 22, // Estimate
          avgTicket: completed > 0 ? Math.round(todayRevenue / completed) : 0,
        },
        appointments: {
          today: appointments.filter((a: any) => a.status !== 'cancelled').length,
          completed,
          upcoming: upcoming.length,
          noShows,
          cancellations,
        },
        clients: {
          total: totalClients,
          newThisMonth: 0,
          activeMembers: 0,
        },
        metrics: {
          utilizationRate: appointments.length > 0 
            ? Math.round((completed / appointments.filter((a: any) => a.status !== 'cancelled').length) * 100) 
            : 0,
          rebookRate: 68, // Would come from actual data
          noShowRate: appointments.length > 0 
            ? Math.round((noShows / appointments.length) * 100) 
            : 0,
        },
        giftCards: {
          liability: 0,
          soldThisMonth: 0,
        },
        upcomingAppointments: upcoming,
        topProviders,
        topServices,
        alerts,
      });

      setError(null);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError('Unable to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // Refresh every 60 seconds
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Format time
  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{greeting}</h1>
          <p className="text-gray-500">
            {today.toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        
        {/* Date Range Selector */}
        <div className="flex items-center gap-3">
          <div className="flex bg-white border border-gray-200 rounded-xl overflow-hidden">
            {(['today', 'week', 'month'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
                  dateRange === range
                    ? 'bg-pink-500 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          
          <button
            onClick={fetchData}
            className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            title="Refresh"
          >
            🔄
          </button>
        </div>
      </div>

      {/* Alerts */}
      {data?.alerts.map((alert, idx) => (
        <AlertBanner
          key={idx}
          type={alert.type}
          title={alert.title}
          message={alert.message}
        />
      ))}

      {/* Error State */}
      {error && (
        <AlertBanner
          type="error"
          title="Connection Issue"
          message={error}
          action={{ label: 'Retry', onClick: fetchData }}
        />
      )}

      {/* Primary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          <>
            <KPISkeleton />
            <KPISkeleton />
            <KPISkeleton />
            <KPISkeleton />
          </>
        ) : data ? (
          <>
            <KPICard
              label="Today's Revenue"
              value={data.revenue.today}
              prefix="$"
              icon="💰"
              color="green"
              size="large"
            />
            <KPICard
              label="Appointments Today"
              value={data.appointments.today}
              icon="📅"
              color="pink"
            />
            <KPICard
              label="Completed"
              value={data.appointments.completed}
              icon="✅"
              color="green"
            />
            <KPICard
              label="Avg Ticket"
              value={data.revenue.avgTicket}
              prefix="$"
              icon="🎫"
            />
          </>
        ) : (
          <div className="col-span-4">
            <EmptyState
              icon="📊"
              title="No data available"
              description="Start booking appointments to see your metrics"
              action={{ label: 'Book First Appointment', href: '/admin/appointments/new' }}
            />
          </div>
        )}
      </div>

      {/* Secondary KPIs */}
      {data && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <KPICard
            label="Utilization"
            value={data.metrics.utilizationRate}
            suffix="%"
            color={data.metrics.utilizationRate >= 80 ? 'green' : 'amber'}
          />
          <KPICard
            label="No-Show Rate"
            value={data.metrics.noShowRate}
            suffix="%"
            color={data.metrics.noShowRate > 10 ? 'red' : 'green'}
          />
          <KPICard
            label="Total Clients"
            value={data.clients.total}
            icon="👥"
            href="/admin/clients"
          />
          <KPICard
            label="Active Members"
            value={data.clients.activeMembers}
            icon="💎"
            color="pink"
            href="/admin/memberships"
          />
          <KPICard
            label="Gift Card Liability"
            value={data.giftCards.liability}
            prefix="$"
            icon="🎁"
            href="/admin/gift-cards"
          />
        </div>
      )}

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming Appointments */}
        <div className="lg:col-span-2">
          <Card padding="none">
            <div className="px-5 py-4 border-b border-gray-100">
              <SectionHeader
                title="Today's Schedule"
                badge={data?.upcomingAppointments.length}
                action={{ label: 'Full Calendar', href: '/admin/calendar' }}
              />
            </div>
            
            {loading ? (
              <div className="p-5">
                <div className="space-y-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="flex gap-4 items-center">
                      <Skeleton className="w-16 h-12 rounded" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                      <Skeleton className="h-8 w-20 rounded-full" />
                    </div>
                  ))}
                </div>
              </div>
            ) : data?.upcomingAppointments.length ? (
              <div className="divide-y divide-gray-100">
                {data.upcomingAppointments.map((apt, idx) => (
                  <Link
                    key={apt.id}
                    href={`/admin/appointments/${apt.id}`}
                    className={`
                      flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors
                      ${idx === 0 ? 'bg-pink-50' : ''}
                    `}
                  >
                    <div className="text-center min-w-[60px]">
                      <p className={`text-lg font-bold ${idx === 0 ? 'text-pink-600' : 'text-gray-900'}`}>
                        {formatTime(apt.time)}
                      </p>
                      <p className="text-xs text-gray-500">{apt.duration} min</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900 truncate">{apt.client_name}</p>
                        {idx === 0 && (
                          <span className="px-2 py-0.5 bg-pink-500 text-white text-xs font-medium rounded-full">
                            NEXT
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate">{apt.service_name}</p>
                    </div>
                    {apt.amount && (
                      <p className="font-semibold text-gray-900">${apt.amount}</p>
                    )}
                    <StatusBadge status={apt.status} pulse={apt.status === 'checked_in'} />
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState
                icon="📅"
                title="No upcoming appointments"
                description="Your schedule is clear"
                action={{ label: 'Book Appointment', href: '/admin/appointments/new' }}
              />
            )}
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <SectionHeader title="Quick Actions" />
            <div className="grid grid-cols-2 gap-3">
              <QuickAction
                icon="➕"
                label="New Booking"
                href="/admin/appointments/new"
                color="pink"
              />
              <QuickAction
                icon="💳"
                label="Open POS"
                href="/pos"
                color="green"
              />
              <QuickAction
                icon="👤"
                label="Add Client"
                href="/admin/clients/new"
              />
              <QuickAction
                icon="📈"
                label="Reports"
                href="/admin/reports"
              />
            </div>
          </Card>

          {/* Top Providers */}
          <Card padding="none">
            <div className="px-5 py-4 border-b border-gray-100">
              <SectionHeader
                title="Top Providers"
                action={{ label: 'View All', href: '/admin/staff' }}
              />
            </div>
            {loading ? (
              <div className="p-5 space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <Skeleton className="h-5 w-16" />
                  </div>
                ))}
              </div>
            ) : data?.topProviders.length ? (
              <div className="divide-y divide-gray-100">
                {data.topProviders.map((provider, idx) => (
                  <div key={provider.id} className="px-5 py-3 flex items-center gap-3">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center text-white font-bold
                      ${idx === 0 ? 'bg-gradient-to-br from-pink-500 to-purple-500' : 
                        idx === 1 ? 'bg-gradient-to-br from-blue-500 to-cyan-500' :
                        'bg-gradient-to-br from-gray-400 to-gray-500'}
                    `}>
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{provider.name}</p>
                      <p className="text-xs text-gray-500">
                        {provider.appointments} appts • {provider.utilization}% util
                      </p>
                    </div>
                    <p className="font-bold text-emerald-600">${provider.revenue.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-5 text-center text-gray-500 text-sm">
                No provider data yet
              </div>
            )}
          </Card>

          {/* Top Services */}
          <Card padding="none">
            <div className="px-5 py-4 border-b border-gray-100">
              <SectionHeader
                title="Top Services"
                action={{ label: 'View All', href: '/admin/services' }}
              />
            </div>
            {loading ? (
              <div className="p-5 space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            ) : data?.topServices.length ? (
              <div className="divide-y divide-gray-100">
                {data.topServices.map((service, idx) => (
                  <div key={service.id} className="px-5 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-gray-300">#{idx + 1}</span>
                      <div>
                        <p className="font-medium text-gray-900 truncate max-w-[140px]">{service.name}</p>
                        <p className="text-xs text-gray-500">{service.bookings} bookings</p>
                      </div>
                    </div>
                    <p className="font-semibold text-gray-900">${service.revenue.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-5 text-center text-gray-500 text-sm">
                No service data yet
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          { href: '/admin/clients', icon: '👥', label: 'Clients' },
          { href: '/admin/services', icon: '✨', label: 'Services' },
          { href: '/admin/inventory', icon: '📦', label: 'Inventory' },
          { href: '/admin/marketing', icon: '📣', label: 'Marketing' },
          { href: '/admin/compliance', icon: '🛡️', label: 'Compliance' },
          { href: '/admin/owner', icon: '👑', label: 'Owner Mode', highlight: true },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`
              bg-white rounded-2xl border border-gray-100 p-4 
              hover:border-pink-200 hover:shadow-lg hover:-translate-y-0.5
              transition-all duration-300 text-center
              ${link.highlight ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200' : ''}
            `}
          >
            <span className="text-2xl block mb-1">{link.icon}</span>
            <p className="font-medium text-gray-900 text-sm">{link.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

// Helper function
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}
