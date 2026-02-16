'use client';

// ============================================================
// CALENDAR NAV BAR — Fresha-style top bar above calendar
// Notifications for: new bookings, cancellations, reschedules, no-shows, confirmations
// ============================================================

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export type NotificationType =
  | 'new_booking'
  | 'cancellation'
  | 'reschedule'
  | 'no_show'
  | 'confirmed'
  | 'checked_in'
  | 'completed';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  appointmentId: string;
  at: string;
  clientName: string;
  providerName: string;
  serviceName: string;
  startsAt: string;
  status: string;
}

const TYPE_STYLES: Record<NotificationType, { bg: string; icon: string; label: string }> = {
  new_booking: { bg: 'bg-emerald-500/20 text-emerald-700', icon: '📅', label: 'New booking' },
  cancellation: { bg: 'bg-red-500/20 text-red-700', icon: '❌', label: 'Cancellation' },
  reschedule: { bg: 'bg-amber-500/20 text-amber-700', icon: '🔄', label: 'Reschedule' },
  no_show: { bg: 'bg-red-500/20 text-red-700', icon: '⚠️', label: 'No-show' },
  confirmed: { bg: 'bg-sky-500/20 text-sky-700', icon: '✓', label: 'Confirmed' },
  checked_in: { bg: 'bg-purple-500/20 text-purple-700', icon: '📍', label: 'Checked in' },
  completed: { bg: 'bg-white0/20 text-black', icon: '✔', label: 'Completed' },
};

function formatTimeAgo(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const sec = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (sec < 60) return 'Just now';
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
  if (sec < 604800) return `${Math.floor(sec / 86400)}d ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

interface CalendarNavBarProps {
  selectedDate: Date;
  onNavigateDate: (dir: 'prev' | 'next' | 'today') => void;
  formatDate: (date: Date) => string;
  viewMode: 'day' | 'week';
  onViewModeChange: (mode: 'day' | 'week') => void;
  onRefresh?: () => void;
  filtersButton?: React.ReactNode;
  locationName?: string;
}

export function CalendarNavBar({
  selectedDate,
  onNavigateDate,
  formatDate,
  viewMode,
  onViewModeChange,
  onRefresh,
  filtersButton,
  locationName = 'Hello Gorgeous Med Spa',
}: CalendarNavBarProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loadingNotif, setLoadingNotif] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    setLoadingNotif(true);
    try {
      const res = await fetch('/api/admin/notifications?limit=30');
      const data = await res.json();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount ?? 0);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoadingNotif(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="flex items-center justify-between w-full px-4 py-3 bg-black border-b border-black text-white rounded-t-xl">
      {/* Left: Calendar controls */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-black font-medium text-sm hidden sm:inline">Calendar</span>
        <button
          onClick={() => onNavigateDate('today')}
          className="px-3 py-1.5 text-sm font-medium bg-black hover:bg-black rounded-lg transition-colors"
        >
          Today
        </button>
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => onNavigateDate('prev')}
            className="p-2 hover:bg-black rounded-lg text-black transition-colors"
            aria-label="Previous day"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="min-w-[140px] text-center text-sm font-semibold text-white px-2">
            {formatDate(selectedDate)}
          </span>
          <button
            onClick={() => onNavigateDate('next')}
            className="p-2 hover:bg-black rounded-lg text-black transition-colors"
            aria-label="Next day"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <span className="text-black text-sm hidden md:inline">{locationName}</span>
        {filtersButton}
      </div>

      {/* Right: Notifications, Refresh, View, Add */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => {
              setShowNotifications((v) => !v);
              if (!showNotifications) fetchNotifications();
            }}
            className="relative p-2.5 hover:bg-black rounded-lg transition-colors"
            aria-label="Notifications"
          >
            <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 6H7" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-pink-500 text-white text-xs font-bold">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-[380px] max-h-[420px] overflow-hidden bg-white rounded-xl shadow-xl border border-black z-[100] flex flex-col">
              <div className="px-4 py-3 border-b border-black flex items-center justify-between bg-white">
                <h3 className="font-semibold text-black">Notifications</h3>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-1 hover:bg-white rounded text-black"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="overflow-y-auto flex-1">
                {loadingNotif ? (
                  <div className="p-6 text-center text-black text-sm">Loading…</div>
                ) : notifications.length === 0 ? (
                  <div className="p-6 text-center text-black text-sm">No recent activity</div>
                ) : (
                  <ul className="divide-y divide-gray-100">
                    {notifications.map((n) => {
                      const style = TYPE_STYLES[n.type] || TYPE_STYLES.confirmed;
                      return (
                        <li key={n.id}>
                          <Link
                            href={`/admin/appointments/${n.appointmentId}`}
                            onClick={() => setShowNotifications(false)}
                            className="flex gap-3 px-4 py-3 hover:bg-white transition-colors text-left"
                          >
                            <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${style.bg}`}>
                              {style.icon}
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-black text-sm">{n.title}</p>
                              <p className="text-black text-xs mt-0.5 line-clamp-2">{n.description}</p>
                              <p className="text-black text-xs mt-1">{formatTimeAgo(n.at)}</p>
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
              <div className="px-4 py-2 border-t border-black bg-white">
                <Link
                  href="/admin/appointments"
                  className="text-sm font-medium text-pink-600 hover:text-pink-700"
                  onClick={() => setShowNotifications(false)}
                >
                  View all appointments →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Refresh */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="p-2.5 hover:bg-black rounded-lg transition-colors"
            aria-label="Refresh"
          >
            <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        )}

        {/* View: Day / Week */}
        <div className="flex bg-black rounded-lg p-0.5">
          <button
            onClick={() => onViewModeChange('day')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
              viewMode === 'day' ? 'bg-black text-white' : 'text-black hover:text-white'
            }`}
          >
            Day
          </button>
          <button
            onClick={() => onViewModeChange('week')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
              viewMode === 'week' ? 'bg-black text-white' : 'text-black hover:text-white'
            }`}
          >
            Week
          </button>
        </div>

        {/* Add appointment */}
        <Link
          href={`/admin/appointments/new?date=${selectedDate.toISOString().split('T')[0]}`}
          className="flex items-center gap-2 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add
        </Link>
      </div>
    </header>
  );
}
