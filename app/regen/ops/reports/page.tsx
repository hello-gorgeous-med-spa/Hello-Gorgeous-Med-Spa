'use client';

export default function ReportsPage() {
  const stats = {
    revenue: {
      today: 1249,
      week: 8750,
      month: 32450,
      ytd: 187500,
    },
    orders: {
      today: 4,
      week: 28,
      month: 112,
    },
    patients: {
      total: 156,
      new: 23,
      active: 89,
    },
    topProducts: [
      { name: 'Semaglutide 4mL', revenue: 12500, orders: 42 },
      { name: 'Tirzepatide 2mL', revenue: 8750, orders: 25 },
      { name: 'NAD+ 10mL', revenue: 4500, orders: 12 },
      { name: 'B12 Bundle', revenue: 2800, orders: 35 },
      { name: 'Sermorelin', revenue: 1950, orders: 10 },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Reports</h1>
        <p className="text-white/50">Business analytics and insights</p>
      </div>

      {/* Revenue Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-teal-500/20 to-teal-600/10 rounded-2xl p-5 border border-teal-500/20">
          <p className="text-white/50 text-sm">Today</p>
          <p className="text-3xl font-bold text-teal-400">${stats.revenue.today.toLocaleString()}</p>
        </div>
        <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
          <p className="text-white/50 text-sm">This Week</p>
          <p className="text-3xl font-bold text-white">${stats.revenue.week.toLocaleString()}</p>
        </div>
        <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
          <p className="text-white/50 text-sm">This Month</p>
          <p className="text-3xl font-bold text-white">${stats.revenue.month.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-pink-500/20 to-pink-600/10 rounded-2xl p-5 border border-pink-500/20">
          <p className="text-white/50 text-sm">Year to Date</p>
          <p className="text-3xl font-bold text-pink-400">${stats.revenue.ytd.toLocaleString()}</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Orders Chart */}
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <h2 className="text-lg font-semibold text-white mb-4">Orders Overview</h2>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-white/5 rounded-xl">
              <p className="text-white/50 text-sm">Today</p>
              <p className="text-2xl font-bold text-white">{stats.orders.today}</p>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-xl">
              <p className="text-white/50 text-sm">This Week</p>
              <p className="text-2xl font-bold text-white">{stats.orders.week}</p>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-xl">
              <p className="text-white/50 text-sm">This Month</p>
              <p className="text-2xl font-bold text-white">{stats.orders.month}</p>
            </div>
          </div>
          {/* Placeholder chart */}
          <div className="h-40 bg-gradient-to-t from-teal-500/20 to-transparent rounded-xl flex items-end justify-around px-4 pb-4">
            {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
              <div
                key={i}
                className="w-8 bg-teal-500/60 rounded-t"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>

        {/* Patients */}
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <h2 className="text-lg font-semibold text-white mb-4">Patients</h2>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-white/5 rounded-xl">
              <p className="text-white/50 text-sm">Total</p>
              <p className="text-2xl font-bold text-white">{stats.patients.total}</p>
            </div>
            <div className="text-center p-4 bg-green-500/10 rounded-xl border border-green-500/20">
              <p className="text-white/50 text-sm">New (30d)</p>
              <p className="text-2xl font-bold text-green-400">{stats.patients.new}</p>
            </div>
            <div className="text-center p-4 bg-teal-500/10 rounded-xl border border-teal-500/20">
              <p className="text-white/50 text-sm">Active</p>
              <p className="text-2xl font-bold text-teal-400">{stats.patients.active}</p>
            </div>
          </div>
          {/* Donut placeholder */}
          <div className="flex items-center justify-center">
            <div className="w-40 h-40 rounded-full border-8 border-teal-500 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">57%</p>
                  <p className="text-white/50 text-xs">Active</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
        <h2 className="text-lg font-semibold text-white mb-4">Top Products (This Month)</h2>
        <div className="space-y-3">
          {stats.topProducts.map((product, i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
              <span className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                {i + 1}
              </span>
              <div className="flex-1">
                <p className="text-white font-medium">{product.name}</p>
                <p className="text-white/50 text-sm">{product.orders} orders</p>
              </div>
              <div className="text-right">
                <p className="text-teal-400 font-bold">${product.revenue.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
