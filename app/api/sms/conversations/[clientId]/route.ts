// ============================================================
// SMS CONVERSATIONS API
// Get conversation and messages for a client
// ============================================================

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key || url.includes('placeholder')) return null;
  
  try {
    const { createClient } = require('@supabase/supabase-js');
    return createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  } catch {
    return null;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { clientId: string } }
) {
  const supabase = getSupabase();
  
  if (!supabase) {
    return NextResponse.json({ messages: [], conversation: null });
  }

  try {
    const clientId = params.clientId;

    // Get or create conversation
    let { data: conversation } = await supabase
      .from('sms_conversations')
      .select('*')
      .eq('client_id', clientId)
      .maybeSingle();

    // If no conversation exists, return empty
    if (!conversation) {
      return NextResponse.json({ 
        messages: [], 
        conversation: null,
        client_id: clientId
      });
    }

    // Mark as read (reset unread count)
    await supabase
      .from('sms_conversations')
      .update({ unread_count: 0 })
      .eq('id', conversation.id);

    // Get messages
    const { data: messages, error: messagesError } = await supabase
      .from('sms_messages')
      .select('*')
      .eq('conversation_id', conversation.id)
      .order('sent_at', { ascending: true })
      .limit(100);

    if (messagesError) {
      console.error('Fetch messages error:', messagesError);
    }

    return NextResponse.json({
      conversation,
      messages: messages || [],
    });
  } catch (error) {
    console.error('Conversations API error:', error);
    return NextResponse.json({ messages: [], conversation: null });
  }
}
