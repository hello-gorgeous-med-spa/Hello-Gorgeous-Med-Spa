'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePortalAuth } from '@/lib/portal/useAuth';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  priority: string;
  category?: string;
  actionUrl?: string;
  actionLabel?: string;
  isRead: boolean;
  createdAt: string;
}

const TYPE_ICONS: Record<string, string> = {
  appointment_reminder: '📅',
  form_required: '📝',
  payment_due: '💳',
  promotion: '🎉',
  general: '💗',
  aftercare: '📋',
  results: '✨',
};

const PRIORITY_STYLES: Record<string, string> = {
  low: 'border-l-gray-300',
  normal: 'border-l-blue-400',
  high: 'border-l-amber-400',
  urgent: 'border-l-red-500',
};

export default function NotificationsPage() {
  const { user, loading: authLoading } = usePortalAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    if (!user) return;
    fetchNotifications();
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/portal/notifications');
      const data = await res.json();
      setNotifications(data.notifications || []);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await fetch('/api/portal/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: id }),
      });
      setNotifications(notifications.map(n =>
        n.id === id ? { ...n, isRead: true } : n
      ));
    } catch (err) {
      console.error('Failed to mark read:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await fetch('/api/portal/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllRead: true }),
      });
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Failed to mark all read:', err);
    }
  };

  const handleDismiss = async (id: string) => {
    try {
      await fetch(`/api/portal/notifications?id=${id}`, { method: 'DELETE' });
      setNotifications(notifications.filter(n => n.id !== id));
    } catch (err) {
      console.error('Failed to dismiss:', err);
    }
  };

  const handleAction = (notification: Notification) => {
    if (!notification.isRead) handleMarkRead(notification.id);
    if (notification.actionUrl) router.push(notification.actionUrl);
  };

  const filteredNotifications = filter === 'unread'
    ? notifications.filter(n => !n.isRead)
    : notifications;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (authLoading || loading) {
    return <div className="flex items-center justify-center min-h-[400px]"><div className="animate-spin text-4xl">💗</div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111]">Notifications</h1>
          <p className="text-[#111]/70 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="text-sm text-[#E6007E] hover:underline"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filter === 'all' ? 'bg-[#E6007E] text-white' : 'bg-white border border-[#111]/10 text-[#111]/70'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filter === 'unread' ? 'bg-[#E6007E] text-white' : 'bg-white border border-[#111]/10 text-[#111]/70'
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-[#111]/10">
          <span className="text-4xl">🔔</span>
          <p className="mt-4 text-[#111]/70">
            {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-xl border border-[#111]/10 border-l-4 ${PRIORITY_STYLES[notification.priority]} overflow-hidden ${
                !notification.isRead ? 'bg-blue-50/50' : ''
              }`}
            >
              <div className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#E6007E]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">{TYPE_ICONS[notification.type] || '🔔'}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className={`font-medium text-[#111] ${!notification.isRead ? 'font-semibold' : ''}`}>
                          {notification.title}
                        </p>
                        <p className="text-sm text-[#111]/70 mt-1">{notification.message}</p>
                      </div>
                      <button
                        onClick={() => handleDismiss(notification.id)}
                        className="text-[#111]/30 hover:text-[#111]/70 text-xl"
                      >
                        ×
                      </button>
                    </div>
                    <div className="flex items-center gap-4 mt-3">
                      <span className="text-xs text-[#111]/40">
                        {new Date(notification.createdAt).toLocaleDateString()} at{' '}
                        {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {notification.actionUrl && (
                        <button
                          onClick={() => handleAction(notification)}
                          className="text-xs text-[#E6007E] font-medium hover:underline"
                        >
                          {notification.actionLabel || 'View'} →
                        </button>
                      )}
                      {!notification.isRead && (
                        <button
                          onClick={() => handleMarkRead(notification.id)}
                          className="text-xs text-[#111]/50 hover:text-[#111]/70"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
