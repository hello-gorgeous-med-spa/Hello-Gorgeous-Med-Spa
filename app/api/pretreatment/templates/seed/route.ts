// ============================================================
// SEED DEFAULT PRETREATMENT TEMPLATES
// Creates professional templates for common med spa services
// ============================================================

import { NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/hgos/supabase';

const DEFAULT_TEMPLATES = [
  {
    name: 'Botox / Neuromodulator Prep',
    service_id: null, // Will match Botox/Dysport/Jeuveau services
    category_match: 'botox',
    content: `# Pre-Treatment Instructions: Botox / Neuromodulators

Hi {client_name}! Your {service_name} appointment is coming up on {appointment_date} at {appointment_time}.

## 1 Week Before
- **Stop blood thinners** (if medically safe): Aspirin, Ibuprofen (Advil/Motrin), Fish Oil, Vitamin E
- Avoid Ginkgo Biloba, Garlic supplements, and Ginseng
- Continue any prescription blood thinners unless otherwise directed by your physician

## 48-72 Hours Before
- **No alcohol** - increases bruising risk
- **Stay hydrated** - drink plenty of water
- Avoid strenuous exercise the day before

## Day Of Appointment
- Come with **clean skin** - no makeup on treatment area
- Eat a light meal before your appointment
- Arrive 5-10 minutes early to fill out any forms

## What to Expect
- Treatment takes 10-15 minutes
- You may see small bumps at injection sites (temporary)
- Results visible in 3-14 days
- No lying down for 4 hours after treatment

## Questions?
📞 Call us: (630) 636-6193
📧 Email: hello@hellogorgeousmedspa.com

We look forward to seeing you!

💗 Hello Gorgeous Med Spa`,
    send_via: 'email',
    send_delay_hours: 48,
    is_active: true,
  },
  {
    name: 'Dermal Filler Prep',
    service_id: null,
    category_match: 'fillers',
    content: `# Pre-Treatment Instructions: Dermal Fillers

Hi {client_name}! Your {service_name} appointment is on {appointment_date} at {appointment_time}.

## 1 Week Before
- **Stop blood thinners** (if medically safe): Aspirin, Ibuprofen, Fish Oil, Vitamin E, Ginkgo Biloba
- Avoid alcohol for 48-72 hours before
- Start Arnica supplements if desired (helps reduce bruising)

## 48 Hours Before
- **No dental work** 2 weeks before/after lip fillers
- Avoid excessive sun exposure
- If you have a history of cold sores, let us know for prophylactic medication

## Day Of Appointment
- **No makeup** on treatment area
- Eat normally before your appointment
- Come well-hydrated
- Plan for potential swelling (especially lip filler)

## What to Expect
- Treatment takes 30-60 minutes depending on areas
- Numbing cream applied for comfort
- Some swelling and bruising is normal (peaks at 48-72 hours)
- Results are immediate but settle in 2 weeks

## After Your Appointment
- No strenuous exercise for 24-48 hours
- Avoid extreme heat (sauna, hot yoga) for 48 hours
- Sleep elevated the first night to reduce swelling

📞 Questions? Call us: (630) 636-6193

💗 Hello Gorgeous Med Spa`,
    send_via: 'email',
    send_delay_hours: 72,
    is_active: true,
  },
  {
    name: 'GLP-1 / Weight Loss Visit Prep',
    service_id: null,
    category_match: 'weight-loss',
    content: `# Pre-Appointment Instructions: Weight Loss Program

Hi {client_name}! Your {service_name} appointment is on {appointment_date} at {appointment_time}.

## Before Your Visit
- **Complete your intake forms** if not already done
- Write down questions you have about the program
- Note your current weight (we'll verify at your visit)

## What to Bring
- List of all current medications and supplements
- Previous lab work (if available within last 6 months)
- Insurance card and ID

## For Injection Appointments
- Stay well-hydrated
- Eat normally (no fasting required)
- Wear comfortable clothing (injection site: abdomen or thigh)

## What to Expect
- Review of your progress and any side effects
- Weight and vitals check
- Medication adjustment if needed
- Your injection (if injection appointment)

## Common Questions Addressed
- Managing nausea and GI side effects
- Dietary recommendations
- Exercise guidelines
- Medication timing

📞 Questions before your visit? Call: (630) 636-6193

💗 Hello Gorgeous Med Spa`,
    send_via: 'both',
    send_delay_hours: 24,
    is_active: true,
  },
  {
    name: 'HydraFacial / Facial Prep',
    service_id: null,
    category_match: 'facials',
    content: `# Pre-Treatment Instructions: HydraFacial / Facial

Hi {client_name}! Your {service_name} is scheduled for {appointment_date} at {appointment_time}.

## 3-5 Days Before
- **Stop retinoids** (Retin-A, Tretinoin, Retinol) 3-5 days before
- Avoid chemical peels or laser treatments for 2 weeks prior
- Avoid excessive sun exposure

## 24 Hours Before
- No waxing or threading
- Avoid exfoliating products
- Stay hydrated!

## Day Of Appointment
- **Arrive with clean skin** - no makeup, sunscreen, or skincare products
- Let us know about any skin sensitivities or changes since your last visit
- Mention if you're using any new skincare products

## What to Expect
- Treatment takes 45-60 minutes
- Cleansing, exfoliation, extraction, hydration
- Relaxing and comfortable experience
- Immediate glow with no downtime!

## After Your Treatment
- Apply sunscreen before leaving (we'll provide if needed)
- Avoid heavy makeup for a few hours
- Your skin will be radiant and glowing!

📞 Questions? Call: (630) 636-6193

💗 Hello Gorgeous Med Spa`,
    send_via: 'email',
    send_delay_hours: 24,
    is_active: true,
  },
  {
    name: 'Microneedling / PRP Prep',
    service_id: null,
    category_match: 'prp',
    content: `# Pre-Treatment Instructions: Microneedling / PRP

Hi {client_name}! Your {service_name} is on {appointment_date} at {appointment_time}.

## 1 Week Before
- **Stop retinoids** (Retin-A, Tretinoin) 5-7 days before
- Stop Accutane at least 6 months before
- Avoid blood thinners (Aspirin, Ibuprofen, Fish Oil)

## 48-72 Hours Before
- No chemical peels, laser treatments, or waxing
- Avoid excessive sun exposure
- No alcohol

## Day Of Appointment
- **Arrive with clean skin** - absolutely no makeup
- Eat a normal meal before (especially for PRP - we draw blood)
- Stay well-hydrated (important for PRP blood draw)

## What to Expect
- Numbing cream applied for 20-30 minutes
- For PRP: Small blood draw from your arm
- Treatment takes 45-90 minutes total
- Mild redness expected (like a sunburn)

## After Treatment
- Redness for 24-72 hours is normal
- No makeup for 24 hours
- No sweating/exercise for 24-48 hours
- Avoid sun exposure and use SPF diligently
- Follow post-care instructions we'll provide

📞 Questions? Call: (630) 636-6193

💗 Hello Gorgeous Med Spa`,
    send_via: 'email',
    send_delay_hours: 72,
    is_active: true,
  },
  {
    name: 'IV Therapy Prep',
    service_id: null,
    category_match: 'iv-therapy',
    content: `# Pre-Appointment Instructions: IV Therapy

Hi {client_name}! Your {service_name} is scheduled for {appointment_date} at {appointment_time}.

## Before Your Visit
- **Eat a meal** 1-2 hours before your appointment
- **Drink plenty of water** - being hydrated makes IV insertion easier
- Wear comfortable clothing with sleeves that can roll up easily

## What to Bring
- List of any allergies
- Current medications (especially if first visit)
- Something to do during your drip (phone, book, etc.)

## What to Expect
- Treatment takes 30-60 minutes depending on your IV
- Small pinch during IV insertion
- Relax in a comfortable chair
- You may feel effects during or shortly after treatment

## After Your Treatment
- Drink plenty of water to continue hydrating
- You can resume normal activities immediately
- Many clients feel energized!

## Perfect For
- Before/after travel
- After illness or hangover
- Athletic recovery
- General wellness boost

📞 Questions? Call: (630) 636-6193

💗 Hello Gorgeous Med Spa`,
    send_via: 'both',
    send_delay_hours: 24,
    is_active: true,
  },
  {
    name: 'Lash Extensions Prep',
    service_id: null,
    category_match: 'lash',
    content: `# Pre-Appointment Instructions: Lash Extensions

Hi {client_name}! Your {service_name} is on {appointment_date} at {appointment_time}.

## Before Your Appointment
- **Come with clean lashes** - no mascara or eye makeup
- Remove contact lenses before appointment (glasses recommended)
- Avoid caffeine if possible (helps you stay still/relaxed)

## Day Of
- Shower beforehand (avoid getting lashes wet for 24 hours after)
- Skip the eye makeup entirely
- Wear comfortable clothing - you'll be lying down for 1-2+ hours

## What to Expect
- Full set: 2-2.5 hours
- Fill: 45-90 minutes
- Your eyes will be closed the entire time
- Completely painless and relaxing!

## Aftercare Preview
- No water on lashes for 24 hours
- No oil-based products near eyes
- Brush daily with spoolie
- Fills recommended every 2-3 weeks

📞 Questions? Call: (630) 636-6193

💗 Hello Gorgeous Med Spa`,
    send_via: 'sms',
    send_delay_hours: 24,
    is_active: true,
  },
  {
    name: 'BioTE / Hormone Consultation Prep',
    service_id: null,
    category_match: 'bhrt',
    content: `# Pre-Appointment Instructions: Hormone Consultation

Hi {client_name}! Your {service_name} is scheduled for {appointment_date} at {appointment_time}.

## What to Bring
- **List of symptoms** you're experiencing (fatigue, mood changes, sleep issues, etc.)
- Current medications and supplements
- Previous lab work (if available)
- Questions you want answered

## Before Your Visit
- Complete any intake forms sent to you
- Note any hormone-related symptoms and when they started
- Consider your goals for hormone optimization

## Lab Work
- If labs are needed, we may do them at your visit or order them beforehand
- Fasting may be required for certain labs (we'll let you know)

## What We'll Discuss
- Your symptoms and health history
- How bioidentical hormones work
- Treatment options (pellets, creams, injections)
- Expected timeline for results
- Monitoring and follow-up

## What to Expect
- Consultation takes 30-45 minutes
- All questions welcomed and encouraged
- No pressure - we'll create a plan that works for you

📞 Questions? Call: (630) 636-6193

💗 Hello Gorgeous Med Spa`,
    send_via: 'email',
    send_delay_hours: 48,
    is_active: true,
  },
  {
    name: 'General Appointment Prep',
    service_id: null,
    category_match: null, // Default for all
    content: `# Pre-Appointment Reminder

Hi {client_name}! Your appointment is coming up:

📅 **Date:** {appointment_date}
🕐 **Time:** {appointment_time}
✨ **Service:** {service_name}

## Quick Reminders
- Arrive 5-10 minutes early
- Bring your ID and payment method
- Let us know of any health changes since your last visit

## Location
Hello Gorgeous Med Spa
74 W. Washington St
Oswego, IL 60543

📞 Need to reschedule? Call: (630) 636-6193

We look forward to seeing you!

💗 Hello Gorgeous Med Spa`,
    send_via: 'both',
    send_delay_hours: 24,
    is_active: true,
  },
];

export async function POST() {
  try {
    const supabase = createAdminSupabaseClient();
    
    if (!supabase) {
      // Return templates without saving if no Supabase
      return NextResponse.json({
        success: true,
        message: 'Templates ready (Supabase not configured - templates not persisted)',
        templates: DEFAULT_TEMPLATES.map((t, i) => ({
          id: `temp-${i}`,
          ...t,
          created_at: new Date().toISOString(),
        })),
        count: DEFAULT_TEMPLATES.length,
      });
    }

    // Insert templates
    const { data, error } = await supabase
      .from('pretreatment_templates')
      .upsert(
        DEFAULT_TEMPLATES.map(t => ({
          name: t.name,
          service_id: t.service_id,
          content: t.content,
          send_via: t.send_via,
          send_delay_hours: t.send_delay_hours,
          is_active: t.is_active,
        })),
        { onConflict: 'name' }
      )
      .select();

    if (error) {
      console.error('Seed error:', error);
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: `Seeded ${data?.length || DEFAULT_TEMPLATES.length} pretreatment templates`,
      count: data?.length || DEFAULT_TEMPLATES.length,
    });

  } catch (error: any) {
    console.error('Seed templates error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to seed templates' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return the default templates for preview
  return NextResponse.json({
    templates: DEFAULT_TEMPLATES,
    count: DEFAULT_TEMPLATES.length,
  });
}
