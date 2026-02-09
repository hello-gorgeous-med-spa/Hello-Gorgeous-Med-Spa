'use client';

// ============================================================
// CLIENT PORTAL DASHBOARD
// Connected to Live Data
// ============================================================

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useChatOpen } from '@/components/ChatOpenContext';


// Skeleton component
function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

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
  const { openChat } = useChatOpen();
  const [user, setUser] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const openPeppiSupplements = () => {
    openChat('peppi', { source: 'client_portal', fulfillment: 'fullscript' });
  };

  // Portal dashboard - shows welcome state for clients
  useEffect(() => {
    // Client portal will show personalized data when client auth is implemented
    // For now, show welcome state
    setUser({ firstName: 'Guest', isVip: false });
    setAppointments([]);
    setLoading(false);
  }, []);

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <section className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative">
          <p className="text-pink-100 text-sm font-medium mb-1">Welcome back</p>
          {loading ? (
            <Skeleton className="h-8 w-48 bg-white/20 mb-2" />
          ) : (
            <h1 className="text-3xl font-bold mb-2">
              Hello{user?.firstName ? `, ${user.firstName}` : ''}! 💗
            </h1>
          )}
          <p className="text-pink-100 mb-6">
            Ready to feel gorgeous today?
          </p>

          {/* VIP Badge */}
          {user?.isVip && (
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="text-xl">💎</span>
              <span className="font-semibold">VIP Member</span>
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Appointments */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Upcoming Appointments</h2>
          <Link
            href="/portal/appointments"
            className="text-pink-600 hover:text-pink-700 text-sm font-medium"
          >
            View All →
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-24" />
          </div>
        ) : appointments.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
            <span className="text-4xl mb-4 block">📅</span>
            <h3 className="font-semibold text-gray-900 mb-2">No upcoming appointments</h3>
            <p className="text-gray-500 mb-4">Book your next treatment today!</p>
            <Link
              href="/portal/book"
              className="inline-flex items-center gap-2 bg-pink-500 text-white px-6 py-2.5 rounded-full font-medium hover:bg-pink-600 transition-colors"
            >
              Book Now
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center">
                      <span className="text-2xl">💆‍♀️</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{apt.service?.name || 'Appointment'}</h3>
                      <p className="text-sm text-gray-500">
                        {apt.provider?.first_name} {apt.provider?.last_name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatDate(apt.scheduled_at)}</p>
                    <p className="text-sm text-gray-500">{formatTime(apt.scheduled_at)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.title}
              href={action.href}
              className="group"
            >
              <div className={`bg-gradient-to-br ${action.color} rounded-2xl p-5 text-white h-full hover:shadow-lg transition-all hover:scale-[1.02]`}>
                <span className="text-3xl mb-3 block">{action.icon}</span>
                <h3 className="font-semibold mb-1">{action.title}</h3>
                <p className="text-sm text-white/80">{action.description}</p>
              </div>
            </Link>
          ))}
          {/* Ask Peppi about supplements — opens Peppi with client_portal + fullscript context */}
          <button
            type="button"
            onClick={openPeppiSupplements}
            className="group text-left"
          >
            <div className="bg-gradient-to-br from-fuchsia-500 to-pink-500 rounded-2xl p-5 text-white h-full hover:shadow-lg transition-all hover:scale-[1.02] min-h-[120px]">
              <span className="text-3xl mb-3 block">💬</span>
              <h3 className="font-semibold mb-1">Ask Peppi about supplements</h3>
              <p className="text-sm text-white/80">Get guided recommendations for sleep, gut, energy & more.</p>
            </div>
          </button>
        </div>
      </section>

      {/* Featured Services */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Popular Services</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {FEATURED_SERVICES.map((service) => (
            <Link
              key={service.name}
              href={service.href}
              className="bg-white rounded-2xl border border-gray-100 p-5 text-center hover:shadow-md transition-all hover:border-pink-200"
            >
              <span className="text-4xl mb-3 block">{service.image}</span>
              <h3 className="font-semibold text-gray-900">{service.name}</h3>
              <p className="text-sm text-pink-600 font-medium">{service.price}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Book CTA */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-3">Ready for Your Next Glow-Up?</h2>
        <p className="text-gray-300 mb-6">
          Book online 24/7 and choose your preferred time
        </p>
        <Link
          href="/portal/book"
          className="inline-flex items-center gap-2 bg-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-pink-600 transition-colors"
        >
          Book Your Appointment
          <span>→</span>
        </Link>
      </section>
    </div>
  );
}
