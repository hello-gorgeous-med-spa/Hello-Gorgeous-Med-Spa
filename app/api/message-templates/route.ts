// ============================================================
// API: MESSAGE TEMPLATES - Email & SMS Templates
// Create, edit, delete message templates
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/hgos/supabase';

// Default templates
const DEFAULT_TEMPLATES = [
  {
    id: 'reminder_24h',
    name: 'Appointment Reminder (24 hours)',
    type: 'sms',
    category: 'reminder',
    subject: null,
    body: 'Hi {{clientName}}! This is a reminder about your appointment tomorrow at {{time}} with {{providerName}} at Hello Gorgeous Med Spa. Reply STOP to opt out.',
    variables: ['clientName', 'time', 'providerName', 'serviceName', 'date'],
    is_active: true,
  },
  {
    id: 'reminder_2h',
    name: 'Appointment Reminder (2 hours)',
    type: 'sms',
    category: 'reminder',
    subject: null,
    body: 'Hi {{clientName}}! Your appointment is coming up in 2 hours at {{time}}. See you soon! - Hello Gorgeous Med Spa',
    variables: ['clientName', 'time', 'providerName', 'serviceName'],
    is_active: true,
  },
  {
    id: 'booking_confirmation',
    name: 'Booking Confirmation',
    type: 'email',
    category: 'confirmation',
    subject: 'Your Appointment is Confirmed - Hello Gorgeous Med Spa',
    body: 'Hi {{clientName}},\n\nYour appointment has been confirmed!\n\nService: {{serviceName}}\nDate: {{date}}\nTime: {{time}}\nProvider: {{providerName}}\n\nLocation: 74 W. Washington St, Oswego, IL 60543\n\nNeed to reschedule? Call us at (630) 636-6193 or reply to this email.\n\nSee you soon!\nHello Gorgeous Med Spa',
    variables: ['clientName', 'serviceName', 'date', 'time', 'providerName'],
    is_active: true,
  },
  {
    id: 'post_visit',
    name: 'Post-Visit Thank You',
    type: 'email',
    category: 'follow_up',
    subject: 'Thank you for visiting Hello Gorgeous Med Spa!',
    body: 'Hi {{clientName}},\n\nThank you for visiting us today! We hope you loved your {{serviceName}}.\n\nWe\'d love to hear about your experience. If you have a moment, please leave us a review on Google.\n\nReady to book your next appointment? Visit our website or call (630) 636-6193.\n\nXOXO,\nHello Gorgeous Med Spa',
    variables: ['clientName', 'serviceName', 'providerName'],
    is_active: true,
  },
  {
    id: 'birthday',
    name: 'Birthday Greeting',
    type: 'email',
    category: 'marketing',
    subject: 'Happy Birthday from Hello Gorgeous! 🎂',
    body: 'Happy Birthday, {{clientName}}! 🎉\n\nWe hope your special day is as gorgeous as you are!\n\nAs a birthday gift, enjoy 15% off your next service this month. Use code BIRTHDAY at checkout.\n\nBook now: hellogorgeousmedspa.com\n\nCheers to another beautiful year!\nHello Gorgeous Med Spa',
    variables: ['clientName'],
    is_active: true,
  },
  {
    id: 'reactivation',
    name: 'We Miss You',
    type: 'email',
    category: 'marketing',
    subject: 'We miss you at Hello Gorgeous! 💕',
    body: 'Hi {{clientName}},\n\nIt\'s been a while since we\'ve seen you, and we miss your gorgeous face!\n\nWe\'d love to have you back. Book your next appointment and enjoy 10% off any service.\n\nCall us at (630) 636-6193 or book online.\n\nCan\'t wait to see you!\nHello Gorgeous Med Spa',
    variables: ['clientName', 'lastVisitDate'],
    is_active: true,
  },
  {
    id: 'promo_sms',
    name: 'Promotion SMS',
    type: 'sms',
    category: 'marketing',
    subject: null,
    body: '💖 Hello Gorgeous Special! {{promoDetails}} Book now: hellogorgeousmedspa.com or call (630) 636-6193. Reply STOP to opt out.',
    variables: ['clientName', 'promoDetails', 'promoCode'],
    is_active: true,
  },
];

// GET /api/message-templates - List all templates
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'sms' or 'email'
    const category = searchParams.get('category');

    let query = supabase
      .from('message_templates')
      .select('*')
      .order('category')
      .order('name');

    if (type) query = query.eq('type', type);
    if (category) query = query.eq('category', category);

    const { data: templates, error } = await query;

    if (error) {
      console.error('Templates fetch error:', error);
      // Return defaults if table doesn't exist
      let filtered = DEFAULT_TEMPLATES;
      if (type) filtered = filtered.filter(t => t.type === type);
      if (category) filtered = filtered.filter(t => t.category === category);
      return NextResponse.json({ templates: filtered });
    }

    // Merge with defaults for any missing
    const templateIds = (templates || []).map(t => t.id);
    const missingDefaults = DEFAULT_TEMPLATES.filter(d => !templateIds.includes(d.id));
    const allTemplates = [...(templates || []), ...missingDefaults];

    let filtered = allTemplates;
    if (type) filtered = filtered.filter(t => t.type === type);
    if (category) filtered = filtered.filter(t => t.category === category);

    return NextResponse.json({ templates: filtered });
  } catch (error) {
    console.error('Templates GET error:', error);
    return NextResponse.json({ templates: DEFAULT_TEMPLATES });
  }
}

// POST /api/message-templates - Create new template
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const body = await request.json();

    const { name, type, category, subject, body: templateBody, variables } = body;

    if (!name || !type || !templateBody) {
      return NextResponse.json({ error: 'Name, type, and body are required' }, { status: 400 });
    }

    const { data: template, error } = await supabase
      .from('message_templates')
      .insert({
        name,
        type,
        category: category || 'custom',
        subject: subject || null,
        body: templateBody,
        variables: variables || [],
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error('Template create error:', error);
      return NextResponse.json({ error: 'Failed to create template' }, { status: 500 });
    }

    return NextResponse.json({ success: true, template });
  } catch (error) {
    console.error('Templates POST error:', error);
    return NextResponse.json({ error: 'Failed to create template' }, { status: 500 });
  }
}

// PUT /api/message-templates - Update template
export async function PUT(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const body = await request.json();

    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'Template ID is required' }, { status: 400 });
    }

    const update: any = { updated_at: new Date().toISOString() };
    if (data.name !== undefined) update.name = data.name;
    if (data.subject !== undefined) update.subject = data.subject;
    if (data.body !== undefined) update.body = data.body;
    if (data.variables !== undefined) update.variables = data.variables;
    if (data.is_active !== undefined) update.is_active = data.is_active;

    // Try to update existing, or upsert if using default template
    const { data: existing } = await supabase
      .from('message_templates')
      .select('id')
      .eq('id', id)
      .single();

    if (existing) {
      const { error } = await supabase
        .from('message_templates')
        .update(update)
        .eq('id', id);

      if (error) throw error;
    } else {
      // Insert the default template with modifications
      const defaultTemplate = DEFAULT_TEMPLATES.find(t => t.id === id);
      if (defaultTemplate) {
        const { error } = await supabase
          .from('message_templates')
          .insert({
            id,
            name: data.name || defaultTemplate.name,
            type: defaultTemplate.type,
            category: defaultTemplate.category,
            subject: data.subject !== undefined ? data.subject : defaultTemplate.subject,
            body: data.body || defaultTemplate.body,
            variables: data.variables || defaultTemplate.variables,
            is_active: data.is_active !== undefined ? data.is_active : true,
          });

        if (error) throw error;
      }
    }

    return NextResponse.json({ success: true, message: 'Template updated' });
  } catch (error) {
    console.error('Templates PUT error:', error);
    return NextResponse.json({ error: 'Failed to update template' }, { status: 500 });
  }
}

// DELETE /api/message-templates - Delete template
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Template ID is required' }, { status: 400 });
    }

    // Don't actually delete defaults, just mark inactive
    const isDefault = DEFAULT_TEMPLATES.some(t => t.id === id);
    
    if (isDefault) {
      // Mark as inactive instead of deleting
      await supabase
        .from('message_templates')
        .upsert({
          id,
          is_active: false,
          ...DEFAULT_TEMPLATES.find(t => t.id === id),
        });
    } else {
      const { error } = await supabase
        .from('message_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;
    }

    return NextResponse.json({ success: true, message: 'Template deleted' });
  } catch (error) {
    console.error('Templates DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete template' }, { status: 500 });
  }
}
