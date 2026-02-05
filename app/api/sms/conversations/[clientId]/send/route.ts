// ============================================================
import { createClient } from '@supabase/supabase-js';
// SMS SEND API
// Send a message to a client
// ============================================================

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key || url.includes('placeholder')) return null;
  
  try {
    // createClient imported at top
    return createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  } catch {
    return null;
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { clientId: string } }
) {
  const supabase = getSupabase();
  
  if (!supabase) {
    return NextResponse.json({ error: 'Database not available' }, { status: 500 });
  }

  try {
    const clientId = params.clientId;
    const { content } = await request.json();

    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Message content is required' }, { status: 400 });
    }

    // Get client info and phone number
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select(`
        id,
        user_id,
        user_profiles:user_id(first_name, last_name, phone)
      `)
      .eq('id', clientId)
      .single();

    if (clientError || !client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    const phone = client.user_profiles?.phone;
    if (!phone) {
      return NextResponse.json({ error: 'Client has no phone number' }, { status: 400 });
    }

    // Get or create conversation
    let { data: conversation } = await supabase
      .from('sms_conversations')
      .select('*')
      .eq('client_id', clientId)
      .maybeSingle();

    if (!conversation) {
      const { data: newConversation, error: createError } = await supabase
        .from('sms_conversations')
        .insert({
          client_id: clientId,
          phone_number: phone,
        })
        .select()
        .single();

      if (createError) {
        console.error('Create conversation error:', createError);
        return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 });
      }
      conversation = newConversation;
    }

    // Send via Telnyx (if configured)
    let externalId = null;
    let status = 'sent';
    let errorMessage = null;

    const telnyxApiKey = process.env.TELNYX_API_KEY;
    const telnyxPhone = process.env.TELNYX_PHONE_NUMBER;

    if (telnyxApiKey && telnyxPhone) {
      try {
        const telnyxRes = await fetch('https://api.telnyx.com/v2/messages', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${telnyxApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: telnyxPhone,
            to: phone,
            text: content,
          }),
        });

        const telnyxData = await telnyxRes.json();

        if (telnyxRes.ok && telnyxData.data) {
          externalId = telnyxData.data.id;
          status = 'sent';
        } else {
          console.error('Telnyx error:', telnyxData);
          status = 'failed';
          errorMessage = telnyxData.errors?.[0]?.detail || 'Failed to send via Telnyx';
        }
      } catch (telnyxError) {
        console.error('Telnyx API error:', telnyxError);
        status = 'failed';
        errorMessage = 'Telnyx API error';
      }
    } else {
      // No Telnyx configured - still save message but mark as sent (for demo)
      console.log(`[SMS] Would send to ${phone}: ${content}`);
      status = 'sent';
    }

    // Save message to database
    const { data: message, error: messageError } = await supabase
      .from('sms_messages')
      .insert({
        conversation_id: conversation.id,
        client_id: clientId,
        direction: 'outbound',
        content: content.trim(),
        status,
        external_id: externalId,
        error_message: errorMessage,
        sent_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (messageError) {
      console.error('Save message error:', messageError);
      return NextResponse.json({ error: 'Failed to save message' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message,
    });
  } catch (error) {
    console.error('Send SMS API error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
