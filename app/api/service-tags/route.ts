import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  try {
    const { data, error } = await supabase
      .from('service_tags')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ tags: data });
  } catch (err) {
    console.error('Service tags API error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
