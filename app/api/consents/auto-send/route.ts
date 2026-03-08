// ============================================================
// API: CONSENT AUTO-SEND
// Triggered on appointment booking to send required consent forms
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendConsentSms } from '@/lib/notifications/telnyx';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!url || !key) return null;
  
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// Generate secure random token
function generateToken(length: number = 48): string {
  return crypto.randomBytes(length).toString('base64url').substring(0, length);
}

// Default consent templates required for all appointments
const DEFAULT_REQUIRED_TEMPLATES = [
  'hipaa_authorization',
  'general_treatment_consent',
  'photo_consent',
];

// Service-specific consent requirements
const SERVICE_CONSENT_MAP: Record<string, string[]> = {
  botox: ['injectable_consent', 'botox_specific_consent'],
  filler: ['injectable_consent', 'filler_consent'],
  laser: ['laser_consent', 'photo_consent'],
  chemical_peel: ['chemical_peel_consent'],
  microneedling: ['microneedling_consent'],
  prp: ['prp_consent', 'blood_draw_consent'],
  iv_therapy: ['iv_therapy_consent'],
  weight_loss: ['weight_loss_consent', 'medication_consent'],
};

interface AutoSendRequest {
  appointment_id: string;
  client_id: string;
  service_id?: string;
  force_resend?: boolean;
}

export async function POST(request: NextRequest) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  try {
    const body: AutoSendRequest = await request.json();
    const { appointment_id, client_id, service_id, force_resend = false } = body;

    if (!appointment_id || !client_id) {
      return NextResponse.json(
        { error: 'appointment_id and client_id are required' },
        { status: 400 }
      );
    }

    // 1. Get client info (phone number)
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select(`
        id,
        user_id,
        users(first_name, last_name, phone, email)
      `)
      .eq('id', client_id)
      .single();

    if (clientError || !client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    const clientName = client.users?.first_name || 'Patient';
    const clientPhone = client.users?.phone;
    const clientEmail = client.users?.email;

    // 2. Get service info to determine required consents
    let requiredTemplateTypes = [...DEFAULT_REQUIRED_TEMPLATES];
    
    if (service_id) {
      const { data: service } = await supabase
        .from('services')
        .select('name, category, tags')
        .eq('id', service_id)
        .single();

      if (service) {
        // Check service name/category against consent map
        const serviceLower = (service.name || '').toLowerCase();
        const categoryLower = (service.category || '').toLowerCase();
        
        for (const [keyword, templates] of Object.entries(SERVICE_CONSENT_MAP)) {
          if (serviceLower.includes(keyword) || categoryLower.includes(keyword)) {
            requiredTemplateTypes.push(...templates);
          }
        }
      }
    }

    // Remove duplicates
    requiredTemplateTypes = [...new Set(requiredTemplateTypes)];

    // 3. Get consent templates
    const { data: templates } = await supabase
      .from('consent_templates')
      .select('*')
      .in('form_type', requiredTemplateTypes)
      .eq('is_active', true);

    // If no templates found, create minimal defaults
    const templatesToUse = templates || [
      { id: 'default-hipaa', name: 'HIPAA Authorization', form_type: 'hipaa_authorization', content: {}, version: 1 },
      { id: 'default-treatment', name: 'General Treatment Consent', form_type: 'general_treatment_consent', content: {}, version: 1 },
    ];

    // 4. Check for existing valid consents (12-month validity)
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const { data: existingConsents } = await supabase
      .from('consent_packets')
      .select('template_id, status, signed_at')
      .eq('client_id', client_id)
      .eq('status', 'signed')
      .gte('signed_at', oneYearAgo.toISOString());

    const signedTemplateIds = new Set(
      (existingConsents || []).map(c => c.template_id)
    );

    // 5. Check for recent sends (2-hour resend guardrail)
    if (!force_resend) {
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
      
      const { data: recentSends } = await supabase
        .from('consent_packets')
        .select('id, sent_at')
        .eq('appointment_id', appointment_id)
        .gte('sent_at', twoHoursAgo.toISOString())
        .limit(1);

      if (recentSends && recentSends.length > 0) {
        return NextResponse.json({
          success: false,
          message: 'Consent SMS was sent recently. Use force_resend=true to override.',
          last_sent_at: recentSends[0].sent_at,
        }, { status: 429 });
      }
    }

    // 6. Filter templates that need new packets
    const templatesNeedingPackets = templatesToUse.filter(
      t => !signedTemplateIds.has(t.id)
    );

    if (templatesNeedingPackets.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'All required consents already signed',
        packets_created: 0,
        sms_sent: false,
      });
    }

    // 7. Generate wizard token for this appointment
    const wizardToken = generateToken(48);
    const wizardExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // 8. Create consent packets
    const packetsToCreate = templatesNeedingPackets.map(template => ({
      client_id,
      appointment_id,
      template_id: template.id,
      template_name: template.name,
      template_version: template.version || 1,
      template_content: template.content || template,
      status: 'draft',
      wizard_token: wizardToken,
      wizard_expires_at: wizardExpiresAt.toISOString(),
    }));

    const { data: createdPackets, error: createError } = await supabase
      .from('consent_packets')
      .insert(packetsToCreate)
      .select();

    if (createError) {
      console.error('Error creating consent packets:', createError);
      return NextResponse.json(
        { error: 'Failed to create consent packets' },
        { status: 500 }
      );
    }

    // 9. Create appointment consent token
    await supabase
      .from('appointment_consent_tokens')
      .upsert({
        appointment_id,
        client_id,
        token: wizardToken,
        token_type: 'sms',
        expires_at: wizardExpiresAt.toISOString(),
        is_valid: true,
      }, {
        onConflict: 'appointment_id,token_type,is_valid',
      });

    // 10. Log creation events
    for (const packet of createdPackets || []) {
      await supabase
        .from('consent_events')
        .insert({
          packet_id: packet.id,
          event: 'created',
          actor_type: 'system',
          meta: { appointment_id, template_name: packet.template_name },
        });
    }

    // 11. Send SMS if phone available
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.BASE_URL || 'https://www.hellogorgeousmedspa.com';
    const wizardLink = `${baseUrl}/consents/wizard/${wizardToken}`;
    
    let smsResult = null;
    
    if (clientPhone) {
      smsResult = await sendConsentSms(clientPhone, clientName, wizardLink);

      // Update packets with SMS info
      const updateData: any = {
        sent_to: smsResult.to,
        sent_at: new Date().toISOString(),
        sms_provider: 'telnyx',
        sms_message_id: smsResult.providerMessageId,
      };

      if (smsResult.success) {
        updateData.status = 'sent';
      } else {
        updateData.send_error = smsResult.error;
      }

      await supabase
        .from('consent_packets')
        .update(updateData)
        .eq('wizard_token', wizardToken);

      // Log send events
      for (const packet of createdPackets || []) {
        await supabase
          .from('consent_events')
          .insert({
            packet_id: packet.id,
            event: smsResult.success ? 'sent' : 'failed',
            actor_type: 'system',
            meta: {
              provider: 'telnyx',
              message_id: smsResult.providerMessageId,
              to: smsResult.to,
              error: smsResult.error,
            },
          });
      }
    }

    return NextResponse.json({
      success: true,
      packets_created: createdPackets?.length || 0,
      templates: templatesNeedingPackets.map(t => t.name),
      wizard_link: wizardLink,
      wizard_token: wizardToken,
      expires_at: wizardExpiresAt.toISOString(),
      sms_sent: smsResult?.success || false,
      sms_error: smsResult?.error || null,
      client_has_phone: !!clientPhone,
    });

  } catch (error) {
    console.error('Consent auto-send error:', error);
    return NextResponse.json(
      { error: 'Failed to process consent auto-send' },
      { status: 500 }
    );
  }
}
