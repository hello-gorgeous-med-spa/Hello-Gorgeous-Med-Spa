// ============================================================
// CLIENT PORTAL DASHBOARD
// ============================================================

import Link from 'next/link';

// Mock data - will be replaced with real data from Supabase
const MOCK_USER = {
  firstName: 'Sarah',
  membershipStatus: 'active',
  membershipType: 'Annual',
  freeServiceAvailable: true,
};

const MOCK_UPCOMING_APPOINTMENTS = [
  {
    id: '1',
    service: 'Botox - Full Face',
    provider: 'Ryan Kent, APRN',
    date: 'Feb 5, 2026',
    time: '10:00 AM',
    status: 'confirmed',
  },
];

const QUICK_ACTIONS = [
  {
    title: 'Book Appointment',
    description: 'Schedule your next treatment',
    href: '/portal/book',
    icon: '📅',
    color: 'from-pink-500 to-rose-500',
  },
  {
    title: 'View Services',
    description: 'Explore our treatments',
    href: '/services',
    icon: '✨',
    color: 'from-purple-500 to-indigo-500',
  },
  {
    title: 'Treatment History',
    description: 'See past appointments',
    href: '/portal/history',
    icon: '📋',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Refer a Friend',
    description: 'Give $25, Get $25',
    href: '/referral',
    icon: '🎁',
    color: 'from-amber-500 to-orange-500',
  },
];

const FEATURED_SERVICES = [
  {
    name: 'Botox',
    price: 'From $10/unit',
    image: '💉',
    href: '/portal/book?service=botox',
  },
  {
    name: 'Semaglutide',
    price: 'From $400',
    image: '⚡',
    href: '/portal/book?service=semaglutide',
  },
  {
    name: 'Dermaplaning',
    price: '$75',
    image: '✨',
    href: '/portal/book?service=dermaplaning',
  },
  {
    name: 'IV Therapy',
    price: 'From $149',
    image: '💧',
    href: '/portal/book?service=iv-therapy',
  },
];

export default function PortalDashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <section className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative">
          <p className="text-pink-100 text-sm font-medium mb-1">Welcome back</p>
          <h1 className="text-3xl font-bold mb-2">
            Hello, {MOCK_USER.firstName}! 💗
          </h1>
          <p className="text-pink-100 mb-6">
            Ready to feel gorgeous today?
          </p>

          {/* Membership Badge */}
          {MOCK_USER.membershipStatus === 'active' && (
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="text-yellow-300">💎</span>
              <span className="font-semibold">{MOCK_USER.membershipType} Member</span>
              {MOCK_USER.freeServiceAvailable && (
                <span className="bg-white/30 px-2 py-0.5 rounded-full text-xs">
                  $75 Service Available
                </span>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Appointments */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Upcoming Appointments
          </h2>
          <Link
            href="/portal/appointments"
            className="text-sm text-pink-600 hover:text-pink-700 font-medium"
          >
            View All →
          </Link>
        </div>

        {MOCK_UPCOMING_APPOINTMENTS.length > 0 ? (
          <div className="space-y-3">
            {MOCK_UPCOMING_APPOINTMENTS.map((apt) => (
              <div
                key={apt.id}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{apt.service}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      with {apt.provider}
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                      <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                        <span>📅</span> {apt.date}
                      </span>
                      <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                        <span>🕐</span> {apt.time}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      ✓ Confirmed
                    </span>
                    <Link
                      href={`/portal/appointments/${apt.id}`}
                      className="text-sm text-pink-600 hover:text-pink-700 font-medium"
                    >
                      Manage →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center">
            <p className="text-gray-500 mb-4">No upcoming appointments</p>
            <Link
              href="/portal/book"
              className="inline-flex items-center gap-2 bg-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-pink-600 transition-colors"
            >
              <span>✨</span> Book Your First Appointment
            </Link>
          </div>
        )}
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.title}
              href={action.href}
              className="group bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}
              >
                {action.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">
                {action.title}
              </h3>
              <p className="text-sm text-gray-500">{action.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Services */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Popular Services</h2>
          <Link
            href="/services"
            className="text-sm text-pink-600 hover:text-pink-700 font-medium"
          >
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURED_SERVICES.map((service) => (
            <Link
              key={service.name}
              href={service.href}
              className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md hover:border-pink-200 transition-all group"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                {service.image}
              </div>
              <h3 className="font-semibold text-gray-900">{service.name}</h3>
              <p className="text-sm text-pink-600 font-medium">{service.price}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Membership CTA (for non-members) */}
      {MOCK_USER.membershipStatus !== 'active' && (
        <section className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-3xl p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="text-6xl">💎</div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Become a VIP Member
              </h2>
              <p className="text-gray-600 mb-4">
                Save 10% on all services + get a FREE $75 service with annual membership!
              </p>
              <Link
                href="/subscribe"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
              >
                Join Now — $399/year
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Contact Support */}
      <section className="bg-white rounded-2xl p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">Need Help?</h3>
            <p className="text-sm text-gray-500">
              We're here for you Monday–Saturday
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="tel:630-636-6193"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              <span>📞</span> Call Us
            </a>
            <a
              href="sms:630-636-6193"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500 text-white hover:bg-pink-600 transition-colors text-sm font-medium"
            >
              <span>💬</span> Text Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
