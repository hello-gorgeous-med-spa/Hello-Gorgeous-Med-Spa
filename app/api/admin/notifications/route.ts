// ============================================================
// API: ADMIN NOTIFICATIONS
// Recent activity feed for calendar nav (new bookings, cancellations, reschedules, no-shows, confirmations)
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes('placeholder') || key.includes('placeholder')) return null;
  try {
    return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
  } catch {
    return null;
  }
}

export type NotificationType =
  | 'new_booking'
  | 'cancellation'
  | 'reschedule'
  | 'no_show'
  | 'confirmed'
  | 'checked_in'
  | 'completed';

export interface AdminNotification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  appointmentId: string;
  at: string; // ISO
  clientName: string;
  providerName: string;
  serviceName: string;
  startsAt: string;
  status: string;
}

function getClientName(apt: any): string {
  const c = apt.client;
  if (c?.first_name || c?.last_name) return [c.first_name, c.last_name].filter(Boolean).join(' ').trim();
  if (c?.users?.first_name || c?.users?.last_name) return [c.users.first_name, c.users.last_name].filter(Boolean).join(' ').trim();
  return 'Client';
}

function getProviderName(apt: any): string {
  const p = apt.provider;
  if (p?.first_name || p?.last_name) return [p.first_name, p.last_name].filter(Boolean).join(' ').trim();
  if (p?.users?.first_name || p?.users?.last_name) return [p.users?.first_name, p.users?.last_name].filter(Boolean).join(' ').trim();
  return apt.provider_first_name || 'Provider';
}

function getServiceName(apt: any): string {
  return apt.service?.name || apt.service_name || 'Appointment';
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function formatDateShort(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

// GET /api/admin/notifications?limit=50
export async function GET(request: NextRequest) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ notifications: [], unreadCount: 0 });
  }

  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 100);

  const since = new Date();
  since.setDate(since.getDate() - 30);
  const sinceStr = since.toISOString();

  const { data: appointments, error } = await supabase
    .from('appointments')
    .select(`
      id,
      status,
      starts_at,
      created_at,
      updated_at,
      client:clients(id, first_name, last_name, users(first_name, last_name)),
      provider:providers(id, first_name, last_name, users(first_name, last_name)),
      service:services(id, name)
    `)
    .gte('updated_at', sinceStr)
    .order('updated_at', { ascending: false })
    .limit(limit * 2);

  if (error) {
    console.error('[admin/notifications]', error);
    return NextResponse.json({ notifications: [], unreadCount: 0 });
  }

  const list: AdminNotification[] = [];
  const seen = new Set<string>();

  for (const apt of appointments || []) {
    const clientName = getClientName(apt);
    const providerName = getProviderName(apt);
    const serviceName = getServiceName(apt);
    const at = apt.updated_at || apt.created_at || apt.starts_at;
    const created = apt.created_at ? new Date(apt.created_at).getTime() : 0;
    const updated = apt.updated_at ? new Date(apt.updated_at).getTime() : 0;
    const isNew = updated - created < 60_000; // within 1 min = treat as new booking

    let type: NotificationType = 'confirmed';
    let title = 'Appointment update';
    let description = '';

    if (apt.status === 'cancelled') {
      type = 'cancellation';
      title = 'Cancellation';
      description = `${clientName} — ${serviceName} with ${providerName} was cancelled.`;
    } else if (apt.status === 'no_show') {
      type = 'no_show';
      title = 'No-show';
      description = `${clientName} did not show for ${serviceName} with ${providerName}.`;
    } else if (apt.status === 'completed') {
      type = 'completed';
      title = 'Completed';
      description = `${clientName} — ${serviceName} with ${providerName} completed.`;
    } else if (apt.status === 'checked_in') {
      type = 'checked_in';
      title = 'Checked in';
      description = `${clientName} checked in for ${serviceName} with ${providerName}.`;
    } else if (apt.status === 'confirmed' && isNew) {
      type = 'new_booking';
      title = 'New booking';
      description = `${clientName} booked ${serviceName} with ${providerName} — ${formatDateShort(apt.starts_at)} at ${formatTime(apt.starts_at)}.`;
    } else if (apt.status === 'confirmed') {
      type = 'confirmed';
      title = 'Confirmed';
      description = `${clientName} — ${serviceName} with ${providerName} at ${formatDateShort(apt.starts_at)} ${formatTime(apt.starts_at)}.`;
    } else {
      description = `${clientName} — ${serviceName} with ${providerName}.`;
    }

    const key = `${apt.id}-${at}`;
    if (seen.has(key)) continue;
    seen.add(key);

    list.push({
      id: `${apt.id}-${type}-${at}`,
      type,
      title,
      description,
      appointmentId: apt.id,
      at,
      clientName,
      providerName,
      serviceName,
      startsAt: apt.starts_at,
      status: apt.status,
    });
  }

  // Sort by at desc and cap
  list.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
  const notifications = list.slice(0, limit);
  const unreadCount = notifications.filter((n) =>
    ['new_booking', 'cancellation', 'reschedule', 'no_show'].includes(n.type)
  ).length;

  return NextResponse.json({ notifications, unreadCount });
}
