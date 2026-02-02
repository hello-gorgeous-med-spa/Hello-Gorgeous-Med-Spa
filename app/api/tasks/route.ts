// ============================================================
// TASKS API - Clinical Follow-ups & Reminders
// Track patient follow-ups and provider tasks
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export interface Task {
  id: string;
  client_id?: string;
  appointment_id?: string;
  provider_id?: string;
  assigned_to?: string;
  type: 'follow_up' | 'reminder' | 'chart_review' | 'call_patient' | 'other';
  title: string;
  description?: string;
  due_date: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  completed_at?: string;
  completed_by?: string;
  created_by: string;
  created_at: string;
}

// GET /api/tasks - List tasks
export async function GET(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  const searchParams = request.nextUrl.searchParams;
  const providerId = searchParams.get('providerId');
  const clientId = searchParams.get('clientId');
  const status = searchParams.get('status');
  const dueToday = searchParams.get('dueToday') === 'true';
  const overdue = searchParams.get('overdue') === 'true';

  try {
    let query = supabase
      .from('provider_tasks')
      .select(`
        *,
        client:clients(id, users(first_name, last_name))
      `)
      .order('due_date', { ascending: true });

    if (providerId) {
      query = query.or(`provider_id.eq.${providerId},assigned_to.eq.${providerId}`);
    }

    if (clientId) {
      query = query.eq('client_id', clientId);
    }

    if (status) {
      query = query.eq('status', status);
    } else {
      // Default to pending/in_progress
      query = query.in('status', ['pending', 'in_progress']);
    }

    if (dueToday) {
      const today = new Date().toISOString().split('T')[0];
      query = query.eq('due_date', today);
    }

    if (overdue) {
      const today = new Date().toISOString().split('T')[0];
      query = query.lt('due_date', today);
    }

    const { data, error } = await query;

    if (error) {
      console.log('Tasks query error (table may not exist):', error.message);
      return NextResponse.json({ tasks: [] });
    }

    // Transform data
    const tasks = (data || []).map((t: any) => ({
      ...t,
      client_name: t.client?.users 
        ? `${t.client.users.first_name} ${t.client.users.last_name}`
        : null,
    }));

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ tasks: [] });
  }
}

// POST /api/tasks - Create new task
export async function POST(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const {
      client_id,
      appointment_id,
      provider_id,
      assigned_to,
      type,
      title,
      description,
      due_date,
      priority,
      created_by,
    } = body;

    if (!title || !due_date) {
      return NextResponse.json({ error: 'title and due_date required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('provider_tasks')
      .insert({
        client_id: client_id || null,
        appointment_id: appointment_id || null,
        provider_id: provider_id || null,
        assigned_to: assigned_to || provider_id || null,
        type: type || 'other',
        title,
        description: description || null,
        due_date,
        priority: priority || 'medium',
        status: 'pending',
        created_by,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ task: data }, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}

// PUT /api/tasks - Update task status
export async function PUT(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { id, status, completed_by, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Task ID required' }, { status: 400 });
    }

    const finalUpdateData: any = { ...updateData };

    if (status) {
      finalUpdateData.status = status;
      if (status === 'completed') {
        finalUpdateData.completed_at = new Date().toISOString();
        finalUpdateData.completed_by = completed_by;
      }
    }

    const { data, error } = await supabase
      .from('provider_tasks')
      .update(finalUpdateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ task: data });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

// DELETE /api/tasks - Delete task
export async function DELETE(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  const searchParams = request.nextUrl.searchParams;
  const taskId = searchParams.get('id');

  if (!taskId) {
    return NextResponse.json({ error: 'Task ID required' }, { status: 400 });
  }

  try {
    const { error } = await supabase
      .from('provider_tasks')
      .delete()
      .eq('id', taskId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
