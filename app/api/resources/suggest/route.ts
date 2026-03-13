// ============================================================
// API: RESOURCE SUGGESTION
// Auto-suggest appropriate room/device based on service type
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key || url.includes('placeholder')) {
    return null;
  }
  
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// Service to resource type mapping
const SERVICE_RESOURCE_MAP: Record<string, { type: string; nameContains?: string }> = {
  // Laser/Device services
  'solaria': { type: 'device', nameContains: 'solaria' },
  'co2': { type: 'device', nameContains: 'solaria' },
  'morpheus': { type: 'device', nameContains: 'morpheus' },
  'laser': { type: 'device' },
  'ipl': { type: 'device' },
  
  // IV services
  'iv ': { type: 'iv_chair' },
  'iv-': { type: 'iv_chair' },
  'drip': { type: 'iv_chair' },
  'infusion': { type: 'iv_chair' },
  'vitamin injection': { type: 'iv_chair' },
  
  // Injectable services
  'botox': { type: 'room', nameContains: 'inject' },
  'filler': { type: 'room', nameContains: 'inject' },
  'dysport': { type: 'room', nameContains: 'inject' },
  'juvederm': { type: 'room', nameContains: 'inject' },
  'restylane': { type: 'room', nameContains: 'inject' },
  'injectable': { type: 'room', nameContains: 'inject' },
  'kybella': { type: 'room', nameContains: 'inject' },
  'sculptra': { type: 'room', nameContains: 'inject' },
  
  // Medical services
  'prp': { type: 'room' },
  'microneedling': { type: 'room' },
  'consultation': { type: 'room' },
  
  // Weight loss
  'semaglutide': { type: 'room' },
  'tirzepatide': { type: 'room' },
  'weight loss': { type: 'room' },
};

export async function GET(request: NextRequest) {
  const supabase = getSupabase();
  
  if (!supabase) {
    return NextResponse.json({ suggestions: [] });
  }

  try {
    const { searchParams } = new URL(request.url);
    const serviceId = searchParams.get('service_id');
    const serviceName = searchParams.get('service_name')?.toLowerCase();
    const startTime = searchParams.get('start_time');
    const endTime = searchParams.get('end_time');

    if (!serviceName && !serviceId) {
      return NextResponse.json({ suggestions: [], message: 'service_id or service_name required' });
    }

    // Get service details if only ID provided
    let serviceNameLower = serviceName || '';
    let serviceRequiresResource = false;
    let defaultResourceType = null;

    if (serviceId && !serviceName) {
      const { data: service } = await supabase
        .from('services')
        .select('name, requires_resource, default_resource_type')
        .eq('id', serviceId)
        .single();
      
      if (service) {
        serviceNameLower = (service.name || '').toLowerCase();
        serviceRequiresResource = service.requires_resource;
        defaultResourceType = service.default_resource_type;
      }
    }

    // Determine the best resource type for this service
    let targetResourceType: string | null = defaultResourceType;
    let preferredNameContains: string | null = null;

    for (const [keyword, mapping] of Object.entries(SERVICE_RESOURCE_MAP)) {
      if (serviceNameLower.includes(keyword)) {
        targetResourceType = mapping.type;
        preferredNameContains = mapping.nameContains || null;
        break;
      }
    }

    if (!targetResourceType) {
      return NextResponse.json({ 
        suggestions: [],
        requiresResource: false,
        message: 'Service does not require a specific resource' 
      });
    }

    // Get all active resources of the target type
    let query = supabase
      .from('resources')
      .select('*')
      .eq('is_active', true)
      .eq('type', targetResourceType);

    const { data: resources, error } = await query;

    if (error) {
      console.error('Error fetching resources:', error);
      return NextResponse.json({ suggestions: [] });
    }

    // If we have time constraints, check availability
    let availableResources = resources || [];

    if (startTime && endTime && availableResources.length > 0) {
      const resourceIds = availableResources.map(r => r.id);
      
      // Check for conflicting appointments
      const { data: conflicts } = await supabase
        .from('appointments')
        .select('resource_id')
        .in('resource_id', resourceIds)
        .not('status', 'in', '("cancelled","no_show")')
        .or(`and(starts_at.lt.${endTime},ends_at.gt.${startTime})`);

      const conflictingIds = new Set((conflicts || []).map(c => c.resource_id));
      
      availableResources = availableResources.filter(r => !conflictingIds.has(r.id));
    }

    // Sort: prefer resources with matching name, then by name
    availableResources.sort((a, b) => {
      const aNameLower = (a.name || '').toLowerCase();
      const bNameLower = (b.name || '').toLowerCase();
      
      // Prefer resources with matching name
      if (preferredNameContains) {
        const aMatches = aNameLower.includes(preferredNameContains);
        const bMatches = bNameLower.includes(preferredNameContains);
        if (aMatches && !bMatches) return -1;
        if (!aMatches && bMatches) return 1;
      }
      
      return aNameLower.localeCompare(bNameLower);
    });

    return NextResponse.json({
      suggestions: availableResources,
      requiresResource: true,
      resourceType: targetResourceType,
      preferredResource: availableResources[0] || null,
    });
  } catch (error) {
    console.error('Resource suggestion API error:', error);
    return NextResponse.json({ suggestions: [] });
  }
}
