// ============================================================
// ADMIN API: Seed Services
// POST /api/admin/seed-services
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient, isAdminConfigured } from '@/lib/hgos/supabase';
import { SERVICE_CATEGORIES, SERVICES } from '@/lib/hgos/seeds/services';

export async function POST(request: NextRequest) {
  try {
    // Check admin key
    const adminKey = request.headers.get('x-admin-key');
    if (adminKey !== process.env.ADMIN_ACCESS_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!isAdminConfigured()) {
      return NextResponse.json(
        { error: 'Supabase service role key not configured' },
        { status: 500 }
      );
    }

    const supabase = createAdminSupabaseClient();
    const results = {
      categories: { inserted: 0, errors: [] as string[] },
      services: { inserted: 0, errors: [] as string[] },
    };

    // Step 1: Insert categories
    console.log('Seeding service categories...');
    const categoryMap: Record<string, string> = {};

    for (const cat of SERVICE_CATEGORIES) {
      const { data, error } = await supabase
        .from('service_categories')
        .upsert(
          {
            name: cat.name,
            slug: cat.slug,
            description: cat.description,
            icon: cat.icon,
            display_order: cat.displayOrder,
            is_active: cat.isActive,
          },
          { onConflict: 'slug' }
        )
        .select('id, slug')
        .single();

      if (error) {
        results.categories.errors.push(`${cat.slug}: ${error.message}`);
      } else if (data) {
        categoryMap[cat.slug] = data.id;
        results.categories.inserted++;
      }
    }

    // Step 2: Insert services
    console.log('Seeding services...');
    for (const svc of SERVICES) {
      const categoryId = categoryMap[svc.categorySlug] || null;

      const { error } = await supabase
        .from('services')
        .upsert(
          {
            category_id: categoryId,
            name: svc.name,
            slug: svc.slug,
            description: svc.description,
            short_description: svc.shortDescription,
            price_cents: svc.priceCents,
            price_display: svc.priceDisplay,
            price_type: svc.priceType,
            duration_minutes: svc.durationMinutes,
            buffer_before_minutes: svc.bufferBeforeMinutes,
            buffer_after_minutes: svc.bufferAfterMinutes,
            deposit_required: svc.depositRequired,
            deposit_amount_cents: svc.depositAmountCents,
            deposit_type: svc.depositType,
            requires_consult: svc.requiresConsult,
            requires_intake: svc.requiresIntake,
            requires_consent: svc.requiresConsent,
            requires_labs: svc.requiresLabs,
            requires_telehealth_clearance: svc.requiresTelehealthClearance,
            minimum_age: svc.minimumAge,
            contraindications: svc.contraindications,
            max_advance_booking_days: svc.maxAdvanceBookingDays,
            min_advance_booking_hours: svc.minAdvanceBookingHours,
            allow_online_booking: svc.allowOnlineBooking,
            addon_service_ids: svc.addonServiceIds,
            related_service_ids: svc.relatedServiceIds,
            image_url: svc.imageUrl,
            display_order: svc.displayOrder,
            is_featured: svc.isFeatured,
            is_active: svc.isActive,
            primary_persona_id: svc.primaryPersonaId,
          },
          { onConflict: 'slug' }
        );

      if (error) {
        results.services.errors.push(`${svc.slug}: ${error.message}`);
      } else {
        results.services.inserted++;
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Services seeded successfully',
      results,
    });
  } catch (error) {
    console.error('Seed services error:', error);
    return NextResponse.json(
      { error: 'Failed to seed services', details: String(error) },
      { status: 500 }
    );
  }
}
