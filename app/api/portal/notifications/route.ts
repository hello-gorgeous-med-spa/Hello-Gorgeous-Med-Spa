import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function getClientFromSession(request: NextRequest) {
  const sessionToken = request.cookies.get('portal_session')?.value;
  if (!sessionToken) return null;

  const { data: session } = await supabase
    .from('client_sessions')
    .select('client_id')
    .eq('session_token', sessionToken)
    .is('revoked_at', null)
    .gt('expires_at', new Date().toISOString())
    .single();

  return session?.client_id || null;
}

// GET - List notifications
export async function GET(request: NextRequest) {
  try {
    const clientId = await getClientFromSession(request);
    if (!clientId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: notifications } = await supabase
      .from('client_notifications')
      .select('*')
      .eq('client_id', clientId)
      .eq('is_dismissed', false)
      .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
      .order('created_at', { ascending: false })
      .limit(50);

    const unreadCount = (notifications || []).filter(n => !n.is_read).length;

    return NextResponse.json({
      notifications: (notifications || []).map(n => ({
        id: n.id,
        title: n.title,
        message: n.message,
        type: n.notification_type,
        priority: n.priority,
        category: n.category,
        actionUrl: n.action_url,
        actionLabel: n.action_label,
        isRead: n.is_read,
        createdAt: n.created_at
      })),
      unreadCount
    });
  } catch (error) {
    console.error('Notifications error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Mark as read
export async function PUT(request: NextRequest) {
  try {
    const clientId = await getClientFromSession(request);
    if (!clientId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { notificationId, markAllRead } = await request.json();

    if (markAllRead) {
      await supabase
        .from('client_notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('client_id', clientId)
        .eq('is_read', false);
    } else if (notificationId) {
      await supabase
        .from('client_notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', notificationId)
        .eq('client_id', clientId);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Notification update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Dismiss notification
export async function DELETE(request: NextRequest) {
  try {
    const clientId = await getClientFromSession(request);
    if (!clientId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const notificationId = searchParams.get('id');

    if (notificationId) {
      await supabase
        .from('client_notifications')
        .update({ is_dismissed: true, dismissed_at: new Date().toISOString() })
        .eq('id', notificationId)
        .eq('client_id', clientId);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Notification dismiss error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
