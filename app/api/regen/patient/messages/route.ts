import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase-server';

export async function GET() {
  try {
    const supabase = getSupabase();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get patient record
    const { data: patient } = await supabase
      .from('regen_patients')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!patient) {
      return NextResponse.json({ messages: [], threads: [] });
    }

    // Get messages
    const { data: messages } = await supabase
      .from('regen_messages')
      .select('*')
      .eq('patient_id', patient.id)
      .order('created_at', { ascending: false });

    // Group into threads (by subject or date)
    const threads: Record<string, typeof messages> = {};
    (messages || []).forEach(msg => {
      const threadKey = msg.thread_id || msg.id;
      if (!threads[threadKey]) threads[threadKey] = [];
      threads[threadKey].push(msg);
    });

    return NextResponse.json({ 
      messages: messages || [],
      threads: Object.values(threads),
    });
  } catch (error) {
    console.error('Messages API error:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { subject, content, thread_id } = body;

    if (!content?.trim()) {
      return NextResponse.json({ error: 'Message content required' }, { status: 400 });
    }

    // Get patient record
    const { data: patient } = await supabase
      .from('regen_patients')
      .select('id, name, email')
      .eq('user_id', user.id)
      .single();

    if (!patient) {
      return NextResponse.json({ error: 'Patient record not found' }, { status: 404 });
    }

    // Create message
    const { data: message, error } = await supabase
      .from('regen_messages')
      .insert({
        patient_id: patient.id,
        thread_id: thread_id || undefined,
        subject: subject || 'New Message',
        content: content.trim(),
        direction: 'outbound',
        read: true, // Patient's own message
        sender_name: patient.name,
        sender_email: patient.email,
      })
      .select()
      .single();

    if (error) throw error;

    // TODO: Send notification to staff (email/SMS)

    return NextResponse.json({ message, success: true });
  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
