import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering - this route uses request.url
export const dynamic = 'force-dynamic';
import { createAdminSupabaseClient, isAdminConfigured } from '@/lib/hgos/supabase';
import { toCSV, toJSON, DATA_TYPES } from '@/lib/hgos/data-export';

// GET /api/export?type=clients&format=csv&startDate=2025-01-01&endDate=2026-01-31
export async function GET(request: NextRequest) {
  try {
    if (!isAdminConfigured()) {
      return NextResponse.json(
        { error: 'Server not configured' },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(request.url);
    const dataType = searchParams.get('type') || 'clients';
    const format = searchParams.get('format') || 'csv';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = parseInt(searchParams.get('limit') || '10000');

    // Validate data type
    const typeConfig = DATA_TYPES.find(t => t.id === dataType);
    if (!typeConfig) {
      return NextResponse.json(
        { error: `Invalid data type: ${dataType}. Available: ${DATA_TYPES.map(t => t.id).join(', ')}` },
        { status: 400 }
      );
    }

    const supabase = createAdminSupabaseClient();

    // Build query based on data type
    let query = supabase.from(typeConfig.tableName).select('*');

    // Add date filter if provided
    if (startDate) {
      query = query.gte('created_at', startDate);
    }
    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    // Add limit
    query = query.limit(limit);

    const { data, error } = await query;

    if (error) {
      console.error('Export query error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch data' },
        { status: 500 }
      );
    }

    // Format response based on requested format
    if (format === 'json') {
      return new NextResponse(toJSON(data || []), {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="${dataType}_export_${new Date().toISOString().split('T')[0]}.json"`,
        },
      });
    }

    // Default to CSV
    const csv = toCSV(data || []);
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${dataType}_export_${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });

  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/export - Custom query export (for advanced users)
export async function POST(request: NextRequest) {
  try {
    if (!isAdminConfigured()) {
      return NextResponse.json(
        { error: 'Server not configured' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { query, format = 'json' } = body;

    // Security: Only allow SELECT queries
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery.startsWith('select')) {
      return NextResponse.json(
        { error: 'Only SELECT queries are allowed' },
        { status: 400 }
      );
    }

    // Block dangerous operations
    const forbidden = ['drop', 'delete', 'update', 'insert', 'alter', 'create', 'truncate'];
    if (forbidden.some(word => normalizedQuery.includes(word))) {
      return NextResponse.json(
        { error: 'Query contains forbidden operations' },
        { status: 400 }
      );
    }

    const supabase = createAdminSupabaseClient();
    
    // Execute raw query (this requires database function or direct access)
    // For security, we'll use the rpc method with a safe function
    const { data, error } = await supabase.rpc('execute_readonly_query', {
      query_text: query,
    });

    if (error) {
      // If the function doesn't exist, return helpful message
      if (error.message.includes('function') && error.message.includes('does not exist')) {
        return NextResponse.json({
          error: 'Custom queries require a database function. Use the standard export endpoints or connect directly to the database.',
          hint: 'For direct database access, see GET /api/export/connection-info',
        }, { status: 400 });
      }
      
      console.error('Custom query error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    if (format === 'csv') {
      return new NextResponse(toCSV(data || []), {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="custom_export_${Date.now()}.csv"`,
        },
      });
    }

    return NextResponse.json({ data });

  } catch (error) {
    console.error('Custom export error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
