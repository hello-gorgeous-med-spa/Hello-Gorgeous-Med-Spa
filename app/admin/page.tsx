'use client';

// ============================================================
// EXECUTIVE DASHBOARD - CEO COCKPIT
// Real-time business intelligence and operational control
// Owner/Admin Only - Full visibility into all metrics
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

// ============================================================
// TYPES
// ============================================================

interface DashboardStats {
  // Revenue
  todayRevenue: number;
  weekRevenue: number;
  monthRevenue: number;
  yearRevenue: number;
  membershipMRR: number;
  retailRevenue: number;
  serviceRevenue: number;
  
  // Appointments
  todayAppointments: number;
  weekAppointments: number;
  monthAppointments: number;
  completedToday: number;
  
  // Rates
  utilizationRate: number;
  noShowRate: number;
  cancellationRate: number;
  rebookRate: number;
  avgTicket: number;
  
  // Clients
  totalClients: number;
  newClientsMonth: number;
  activeMembers: number;
}

interface ProviderStats {
  id: string;
  name: string;
  appointments: number;
  completed: number;
  revenue: number;
  noShows: number;
  utilization: number;
}

interface ServiceStats {
  id: string;
  name: string;
  bookings: number;
  revenue: number;
  avgPrice: number;
}

interface UpcomingAppointment {
  id: string;
  time: string;
  status: string;
  client_name: string;
  service: string;
  provider_name?: string;
  amount?: number;
}

// ============================================================
// COMPONENTS
// ============================================================

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    completed: 'bg-green-100 text-green-700',
    in_progress: 'bg-purple-100 text-purple-700',
    checked_in: 'bg-blue-100 text-blue-700',
    confirmed: 'bg-gray-100 text-gray-600',
    cancelled: 'bg-red-100 text-red-700',
    no_show: 'bg-amber-100 text-amber-700',
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
      {status.replace('_', ' ')}
    </span>
  );
}

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

function KPICard({ 
  label, 
  value, 
  subValue, 
  trend, 
  loading,
  color = 'gray',
  icon,
}: { 
  label: string; 
  value: string | number; 
  subValue?: string;
  trend?: { value: number; positive: boolean };
  loading?: boolean;
  color?: 'gray' | 'green' | 'red' | 'blue' | 'purple' | 'amber';
  icon?: string;
}) {
  const colorClasses = {
    gray: 'text-gray-900',
    green: 'text-green-600',
    red: 'text-red-600',
    blue: 'text-blue-600',
    purple: 'text-purple-600',
    amber: 'text-amber-600',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-start justify-between">
        <p className="text-sm text-gray-500 mb-1">{label}</p>
        {icon && <span className="text-xl">{icon}</span>}
      </div>
      {loading ? (
        <Skeleton className="w-24 h-8" />
      ) : (
        <>
          <p className={`text-3xl font-bold ${colorClasses[color]}`}>{value}</p>
          {subValue && <p className="text-sm text-gray-500 mt-1">{subValue}</p>}
          {trend && (
            <p className={`text-sm mt-1 ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}% vs last period
            </p>
          )}
        </>
      )}
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function ExecutiveDashboard() {
  // State
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [providerStats, setProviderStats] = useState<ProviderStats[]>([]);
  const [serviceStats, setServiceStats] = useState<ServiceStats[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<UpcomingAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'year'>('month');
  const [selectedProvider, setSelectedProvider] = useState<string>('all');
  const [providers, setProviders] = useState<{id: string; name: string}[]>([]);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Fetch dashboard data
  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch base dashboard data
      const dashRes = await fetch('/api/dashboard');
      const dashData = await dashRes.json();

      // Fetch appointments for detailed stats
      const todayDate = new Date().toISOString().split('T')[0];
      const aptsRes = await fetch(`/api/appointments?date=${todayDate}`);
      const aptsData = await aptsRes.json();
      const appointments = aptsData.appointments || [];

      // Fetch all appointments for period stats
      const allAptsRes = await fetch('/api/appointments?limit=500');
      const allAptsData = await allAptsRes.json();
      const allAppointments = allAptsData.appointments || [];

      // Fetch providers
      const provRes = await fetch('/api/providers');
      const provData = await provRes.json();
      const providerList = provData.providers || [];
      setProviders(providerList.map((p: any) => ({
        id: p.id,
        name: `${p.first_name || p.firstName || ''} ${p.last_name || p.lastName || ''}`.trim() || 'Provider',
      })));

      // Calculate stats - use calendar month start, not "30 days ago"
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      // Use 1st of current month, not 30 days ago
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      monthStart.setHours(0, 0, 0, 0);

      const todayAppts = appointments.filter((a: any) => a.status !== 'cancelled');
      const completedToday = appointments.filter((a: any) => a.status === 'completed').length;
      const noShows = allAppointments.filter((a: any) => a.status === 'no_show').length;
      const cancelled = allAppointments.filter((a: any) => a.status === 'cancelled').length;
      const totalAppts = allAppointments.length;

      // Revenue calculations - filter by current calendar month
      const monthAppts = allAppointments.filter((a: any) => 
        a.status === 'completed' && new Date(a.starts_at) >= monthStart
      );
      const weekAppts = allAppointments.filter((a: any) => 
        a.status === 'completed' && new Date(a.starts_at) >= weekAgo
      );
      const todayCompleted = appointments.filter((a: any) => a.status === 'completed');

      // Use ACTUAL transaction revenue from dashboard API if available
      // Only fallback to service prices if no transaction data
      const apiTodayRevenue = dashData.stats?.todayRevenue || 0;
      const apiWeekRevenue = dashData.stats?.weekRevenue || 0;
      const apiMonthRevenue = dashData.stats?.monthRevenue || 0;
      
      // Calculate from appointments as fallback
      const aptTodayRevenue = todayCompleted.reduce((sum: number, a: any) => sum + (a.service_price || 0), 0);
      const aptWeekRevenue = weekAppts.reduce((sum: number, a: any) => sum + (a.service_price || 0), 0);
      const aptMonthRevenue = monthAppts.reduce((sum: number, a: any) => sum + (a.service_price || 0), 0);
      
      // Prefer transaction data (actual payments) over appointment service prices
      const todayRevenue = apiTodayRevenue > 0 ? apiTodayRevenue : aptTodayRevenue;
      const weekRevenue = apiWeekRevenue > 0 ? apiWeekRevenue : aptWeekRevenue;
      const monthRevenue = apiMonthRevenue > 0 ? apiMonthRevenue : aptMonthRevenue;

      // Provider stats
      const providerStatsMap = new Map<string, ProviderStats>();
      allAppointments.forEach((apt: any) => {
        const providerId = apt.provider_id;
        const providerName = apt.provider_name || 'Unknown';
        if (!providerId) return;

        if (!providerStatsMap.has(providerId)) {
          providerStatsMap.set(providerId, {
            id: providerId,
            name: providerName,
            appointments: 0,
            completed: 0,
            revenue: 0,
            noShows: 0,
            utilization: 0,
          });
        }

        const ps = providerStatsMap.get(providerId)!;
        ps.appointments++;
        if (apt.status === 'completed') {
          ps.completed++;
          ps.revenue += apt.service_price || 0;
        }
        if (apt.status === 'no_show') {
          ps.noShows++;
        }
      });

      // Calculate utilization (completed / total scheduled * 100)
      providerStatsMap.forEach(ps => {
        ps.utilization = ps.appointments > 0 
          ? Math.round((ps.completed / ps.appointments) * 100) 
          : 0;
      });

      setProviderStats(Array.from(providerStatsMap.values()).sort((a, b) => b.revenue - a.revenue));

      // Service stats
      const serviceStatsMap = new Map<string, ServiceStats>();
      monthAppts.forEach((apt: any) => {
        const serviceId = apt.service_id;
        const serviceName = apt.service_name || 'Service';
        if (!serviceId) return;

        if (!serviceStatsMap.has(serviceId)) {
          serviceStatsMap.set(serviceId, {
            id: serviceId,
            name: serviceName,
            bookings: 0,
            revenue: 0,
            avgPrice: 0,
          });
        }

        const ss = serviceStatsMap.get(serviceId)!;
        ss.bookings++;
        ss.revenue += apt.service_price || 0;
      });

      serviceStatsMap.forEach(ss => {
        ss.avgPrice = ss.bookings > 0 ? Math.round(ss.revenue / ss.bookings) : 0;
      });

      setServiceStats(Array.from(serviceStatsMap.values()).sort((a, b) => b.revenue - a.revenue).slice(0, 10));

      // Set stats
      // Calculate rebook rate - clients who booked again within 90 days
      // This is a simplified calculation - count clients with 2+ appointments in period
      const clientAppointments = new Map<string, number>();
      allAppointments.forEach((apt: any) => {
        if (apt.client_id) {
          clientAppointments.set(apt.client_id, (clientAppointments.get(apt.client_id) || 0) + 1);
        }
      });
      const totalClientsWithAppts = clientAppointments.size;
      const rebookedClients = Array.from(clientAppointments.values()).filter(count => count >= 2).length;
      const calculatedRebookRate = totalClientsWithAppts > 0 ? Math.round((rebookedClients / totalClientsWithAppts) * 100) : 0;

      setStats({
        todayRevenue,
        weekRevenue,
        monthRevenue,
        yearRevenue: dashData.stats?.yearRevenue || monthRevenue * 12, // Estimate from month
        membershipMRR: dashData.stats?.membershipMRR || 0,
        retailRevenue: dashData.stats?.retailRevenue || 0,
        serviceRevenue: monthRevenue,
        todayAppointments: todayAppts.length,
        weekAppointments: weekAppts.length,
        monthAppointments: monthAppts.length,
        completedToday,
        utilizationRate: totalAppts > 0 ? Math.round(((totalAppts - noShows - cancelled) / totalAppts) * 100) : 0,
        noShowRate: totalAppts > 0 ? Math.round((noShows / totalAppts) * 100) : 0,
        cancellationRate: totalAppts > 0 ? Math.round((cancelled / totalAppts) * 100) : 0,
        rebookRate: calculatedRebookRate,
        avgTicket: monthAppts.length > 0 ? Math.round(monthRevenue / monthAppts.length) : 0,
        totalClients: dashData.stats?.totalClients || 0,
        newClientsMonth: dashData.stats?.newClientsMonth || 0,
        activeMembers: dashData.stats?.activeMembers || 0,
      });

      // Set upcoming appointments
      const upcoming = appointments
        .filter((a: any) => !['cancelled', 'completed', 'no_show'].includes(a.status))
        .sort((a: any, b: any) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime())
        .slice(0, 8)
        .map((a: any) => ({
          id: a.id,
          time: a.starts_at,
          status: a.status,
          client_name: a.client_name || 'Client',
          service: a.service_name || 'Service',
          provider_name: a.provider_name,
          amount: a.service_price,
        }));

      setUpcomingAppointments(upcoming);
      setError(null);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [dateRange, selectedProvider]);

  useEffect(() => {
    fetchDashboard();
    // Refresh every 60 seconds
    const interval = setInterval(fetchDashboard, 60000);
    return () => clearInterval(interval);
  }, [fetchDashboard]);

  // Export functions
  const handleExportCSV = () => {
    const csvData = [
      ['Metric', 'Value'],
      ['Today Revenue', `$${stats?.todayRevenue || 0}`],
      ['Week Revenue', `$${stats?.weekRevenue || 0}`],
      ['Month Revenue', `$${stats?.monthRevenue || 0}`],
      ['Today Appointments', stats?.todayAppointments || 0],
      ['Completed Today', stats?.completedToday || 0],
      ['Utilization Rate', `${stats?.utilizationRate || 0}%`],
      ['No Show Rate', `${stats?.noShowRate || 0}%`],
      ['Avg Ticket', `$${stats?.avgTicket || 0}`],
      ['Total Clients', stats?.totalClients || 0],
      ['', ''],
      ['Provider', 'Revenue', 'Appointments', 'Utilization'],
      ...providerStats.map(p => [p.name, `$${p.revenue}`, p.appointments, `${p.utilization}%`]),
    ];

    const csv = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-snapshot-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    // Simple print-based PDF export
    window.print();
  };

  return (
    <div className="space-y-6 print:space-y-4">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Executive Dashboard</h1>
          <p className="text-gray-500">{today}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Date Range Filter */}
          <div className="flex border border-gray-200 rounded-lg overflow-hidden">
            {(['today', 'week', 'month', 'year'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-3 py-2 text-sm font-medium capitalize ${
                  dateRange === range
                    ? 'bg-pink-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {range === 'today' ? 'Today' : range === 'week' ? 'Week' : range === 'month' ? 'Month' : 'Year'}
              </button>
            ))}
          </div>

          {/* Provider Filter */}
          <select
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
          >
            <option value="all">All Providers</option>
            {providers.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          {/* Export Buttons */}
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 text-sm"
          >
            📊 Export CSV
          </button>
          <button
            onClick={handleExportPDF}
            className="px-4 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 text-sm"
          >
            📄 Print/PDF
          </button>

          {/* Quick Actions */}
          <Link
            href="/admin/appointments/new"
            className="px-4 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 text-sm"
          >
            + New Booking
          </Link>
        </div>
      </div>

      {/* Print Header */}
      <div className="hidden print:block">
        <h1 className="text-xl font-bold">Hello Gorgeous Med Spa - Executive Dashboard</h1>
        <p className="text-gray-600">{today}</p>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Revenue KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard
          label="Today's Revenue"
          value={`$${(stats?.todayRevenue || 0).toLocaleString()}`}
          subValue={`${stats?.completedToday || 0} completed`}
          loading={loading}
          color="green"
          icon="💰"
        />
        <KPICard
          label="Week Revenue"
          value={`$${(stats?.weekRevenue || 0).toLocaleString()}`}
          loading={loading}
          color="green"
        />
        <KPICard
          label="Month Revenue"
          value={`$${(stats?.monthRevenue || 0).toLocaleString()}`}
          subValue={`${stats?.monthAppointments || 0} appointments`}
          loading={loading}
          color="green"
        />
        <KPICard
          label="Avg Ticket"
          value={`$${(stats?.avgTicket || 0).toLocaleString()}`}
          loading={loading}
        />
        <KPICard
          label="Membership MRR"
          value={`$${(stats?.membershipMRR || 0).toLocaleString()}`}
          subValue={`${stats?.activeMembers || 0} members`}
          loading={loading}
          color="purple"
        />
      </div>

      {/* Operational KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard
          label="Today's Appointments"
          value={stats?.todayAppointments || 0}
          subValue={`${stats?.completedToday || 0} completed`}
          loading={loading}
          icon="📅"
        />
        <KPICard
          label="Utilization Rate"
          value={`${stats?.utilizationRate || 0}%`}
          loading={loading}
          color={stats?.utilizationRate && stats.utilizationRate >= 80 ? 'green' : 'amber'}
        />
        <KPICard
          label="No-Show Rate"
          value={`${stats?.noShowRate || 0}%`}
          loading={loading}
          color={stats?.noShowRate && stats.noShowRate > 10 ? 'red' : 'green'}
        />
        <KPICard
          label="Cancellation Rate"
          value={`${stats?.cancellationRate || 0}%`}
          loading={loading}
          color={stats?.cancellationRate && stats.cancellationRate > 15 ? 'red' : 'green'}
        />
        <KPICard
          label="Rebook Rate"
          value={`${stats?.rebookRate || 0}%`}
          loading={loading}
          color={stats?.rebookRate && stats.rebookRate >= 60 ? 'green' : 'amber'}
        />
      </div>

      {/* Client & Service Mix */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Total Clients"
          value={(stats?.totalClients || 0).toLocaleString()}
          loading={loading}
          icon="👥"
        />
        <KPICard
          label="New This Month"
          value={stats?.newClientsMonth || 0}
          loading={loading}
          color="blue"
        />
        <KPICard
          label="Service Revenue"
          value={`$${(stats?.serviceRevenue || 0).toLocaleString()}`}
          loading={loading}
        />
        <KPICard
          label="Retail Revenue"
          value={`$${(stats?.retailRevenue || 0).toLocaleString()}`}
          loading={loading}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue by Provider */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Revenue by Provider</h2>
            <Link href="/admin/reports?tab=providers" className="text-sm text-pink-600 hover:text-pink-700">
              Details →
            </Link>
          </div>
          <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="px-5 py-3">
                  <Skeleton className="h-12 w-full" />
                </div>
              ))
            ) : providerStats.length === 0 ? (
              <div className="px-5 py-8 text-center text-gray-500">
                No provider data yet
              </div>
            ) : (
              providerStats.map((provider, idx) => (
                <div key={provider.id} className="px-5 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{provider.name}</p>
                      <p className="text-xs text-gray-500">
                        {provider.appointments} appts • {provider.utilization}% util
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">${provider.revenue.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{provider.completed} completed</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Services */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Top Services (Month)</h2>
            <Link href="/admin/reports?tab=services" className="text-sm text-pink-600 hover:text-pink-700">
              Details →
            </Link>
          </div>
          <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="px-5 py-3">
                  <Skeleton className="h-10 w-full" />
                </div>
              ))
            ) : serviceStats.length === 0 ? (
              <div className="px-5 py-8 text-center text-gray-500">
                No service data yet
              </div>
            ) : (
              serviceStats.map((service, idx) => (
                <div key={service.id} className="px-5 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-gray-300">#{idx + 1}</span>
                    <div>
                      <p className="font-medium text-gray-900 truncate max-w-[150px]">{service.name}</p>
                      <p className="text-xs text-gray-500">{service.bookings} bookings</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${service.revenue.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">${service.avgPrice} avg</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Today's Schedule</h2>
            <Link href="/admin/calendar" className="text-sm text-pink-600 hover:text-pink-700">
              Full Calendar →
            </Link>
          </div>
          <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="px-5 py-3">
                  <Skeleton className="h-12 w-full" />
                </div>
              ))
            ) : upcomingAppointments.length === 0 ? (
              <div className="px-5 py-8 text-center text-gray-500">
                No appointments scheduled
              </div>
            ) : (
              upcomingAppointments.map((apt) => (
                <Link
                  key={apt.id}
                  href={`/admin/appointments/${apt.id}`}
                  className="px-5 py-3 flex items-center justify-between hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-900 w-16">
                      {formatTime(apt.time)}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">{apt.client_name}</p>
                      <p className="text-sm text-gray-500">{apt.service}</p>
                    </div>
                  </div>
                  <StatusBadge status={apt.status} />
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 print:hidden">
        <Link
          href="/admin/clients"
          className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:border-pink-200 hover:shadow-md transition-all text-center"
        >
          <span className="text-2xl block mb-1">👥</span>
          <p className="font-medium text-gray-900 text-sm">Clients</p>
        </Link>
        <Link
          href="/admin/services"
          className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:border-pink-200 hover:shadow-md transition-all text-center"
        >
          <span className="text-2xl block mb-1">✨</span>
          <p className="font-medium text-gray-900 text-sm">Services</p>
        </Link>
        <Link
          href="/admin/reports"
          className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:border-pink-200 hover:shadow-md transition-all text-center"
        >
          <span className="text-2xl block mb-1">📈</span>
          <p className="font-medium text-gray-900 text-sm">Reports</p>
        </Link>
        <Link
          href="/admin/compliance"
          className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:border-pink-200 hover:shadow-md transition-all text-center"
        >
          <span className="text-2xl block mb-1">✅</span>
          <p className="font-medium text-gray-900 text-sm">Compliance</p>
        </Link>
        <Link
          href="/admin/marketing"
          className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:border-pink-200 hover:shadow-md transition-all text-center"
        >
          <span className="text-2xl block mb-1">📣</span>
          <p className="font-medium text-gray-900 text-sm">Marketing</p>
        </Link>
        <Link
          href="/pos"
          className="bg-green-500 rounded-xl shadow-sm p-4 hover:bg-green-600 transition-all text-center text-white"
        >
          <span className="text-2xl block mb-1">💳</span>
          <p className="font-medium text-sm">Open POS</p>
        </Link>
      </div>
    </div>
  );
}
