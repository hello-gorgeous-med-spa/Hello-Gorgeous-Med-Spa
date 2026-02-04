// ============================================================
// SEED DEFAULT AFTERCARE TEMPLATES
// Creates professional aftercare templates for med spa services
// ============================================================

import { NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/hgos/supabase';

const DEFAULT_TEMPLATES = [
  {
    name: 'Botox / Neuromodulator Aftercare',
    service_id: null,
    content: `# Aftercare Instructions: Botox / Neuromodulators

Hi {client_name}! Thank you for your visit today. Here are your aftercare instructions:

## First 4 Hours
- **Stay upright** - no lying down or bending over
- **No touching** the treated areas
- Gentle facial exercises are OK (frown, raise eyebrows)

## First 24 Hours
- **No strenuous exercise** or activities that cause sweating
- **No facials, massages, or skin treatments**
- **No alcohol** (increases bruising risk)
- Avoid extreme heat (saunas, hot tubs, hot yoga)

## First 2 Weeks
- **No dental work** if you had treatment near your mouth
- Avoid tight headbands, hats, or goggles
- Sleep on your back if possible

## What's Normal
✓ Small red bumps at injection sites (resolve in 30-60 minutes)
✓ Mild headache (take Tylenol if needed)
✓ Slight bruising (usually resolves in 3-5 days)

## When to Call Us
- Significant swelling or pain
- Drooping eyelid
- Difficulty swallowing (rare)
- Any concerns at all!

## Results Timeline
- Initial results: 3-5 days
- Full results: 10-14 days
- Duration: 3-4 months typically

📞 Questions? Call: (630) 636-6193

Your next appointment: Schedule your touch-up in 3-4 months!

💗 Hello Gorgeous Med Spa`,
    send_via: 'email',
    send_delay_minutes: 30,
    is_active: true,
  },
  {
    name: 'Dermal Filler Aftercare',
    service_id: null,
    content: `# Aftercare Instructions: Dermal Fillers

Hi {client_name}! Thank you for your visit. Here's how to care for your new look:

## First 24-48 Hours
- **Ice the area** 10-15 minutes on/off to reduce swelling
- **No touching, pressing, or massaging** unless instructed
- Sleep elevated the first night
- Stay well-hydrated

## First Week
- **No strenuous exercise** for 24-48 hours
- **No extreme heat** (saunas, steam, hot yoga)
- **No dental work** for 2 weeks (lip filler patients)
- Avoid blood thinners (Aspirin, Ibuprofen)
- Take Arnica to help with bruising

## What's Normal
✓ Swelling (peaks at 48-72 hours, especially lip filler)
✓ Bruising (resolves in 5-10 days)
✓ Firmness or lumps (massage gently, will soften)
✓ Asymmetry initially (improves as swelling resolves)

## What's NOT Normal (Call Us!)
- Severe pain that worsens
- White or blue discoloration
- Vision changes
- Increasing redness/warmth after 48 hours

## Results Timeline
- Immediate improvement
- Final results: 2 weeks (once swelling resolves)
- Duration: 6-18 months depending on product/area

📞 Questions or concerns? Call immediately: (630) 636-6193

Your follow-up: We'll see you in 2 weeks to check your results!

💗 Hello Gorgeous Med Spa`,
    send_via: 'email',
    send_delay_minutes: 30,
    is_active: true,
  },
  {
    name: 'GLP-1 Injection Aftercare',
    service_id: null,
    content: `# Aftercare: GLP-1 Weight Loss Injection

Hi {client_name}! Here's what to expect after your injection:

## Injection Site Care
- Small bandage can be removed after 1 hour
- Some redness at site is normal
- Rotate injection sites each week

## Managing Side Effects

### Nausea (Most Common)
- Eat smaller, more frequent meals
- Avoid greasy, fatty, or spicy foods
- Ginger tea or ginger candies help
- Stay hydrated with small sips

### Other Common Effects
- Decreased appetite (this is expected!)
- Mild fatigue (usually temporary)
- Constipation (increase fiber and water)

## Tips for Success
🥗 Focus on protein with each meal
💧 Drink 64+ oz water daily
🚶 Light walking is encouraged
📝 Track your meals and progress

## When to Call Us
- Severe nausea/vomiting that won't stop
- Severe abdominal pain
- Signs of pancreatitis (severe pain radiating to back)
- Any concerning symptoms

## Your Next Injection
Schedule: Weekly injections, same day each week
Your next appointment should be in 1 week

📞 Questions? Call: (630) 636-6193

You've got this! 💪

💗 Hello Gorgeous Med Spa`,
    send_via: 'both',
    send_delay_minutes: 60,
    is_active: true,
  },
  {
    name: 'HydraFacial Aftercare',
    service_id: null,
    content: `# Aftercare: HydraFacial

Hi {client_name}! Your skin is glowing! Here's how to maintain your results:

## First 6 Hours
- **No makeup** for at least 6 hours (let products absorb)
- Your skin may appear flushed - this is normal!

## First 24-48 Hours
- **Avoid direct sun exposure** and wear SPF 30+
- **No retinoids** or active serums
- Skip exfoliating products
- Gentle cleanser and moisturizer only

## Maximize Your Results
✨ Stay hydrated
✨ Apply SPF daily (always!)
✨ Continue your recommended skincare routine after 48 hours
✨ Book your next HydraFacial in 4-6 weeks

## What You'll Notice
- Immediate hydration and glow
- Smaller-looking pores
- Smoother skin texture
- Results improve over the following days

## Tip: For Best Results
Monthly HydraFacials maintain that glow and continue improving your skin health!

📞 Questions? Call: (630) 636-6193

Enjoy your gorgeous skin! ✨

💗 Hello Gorgeous Med Spa`,
    send_via: 'sms',
    send_delay_minutes: 15,
    is_active: true,
  },
  {
    name: 'Microneedling / PRP Aftercare',
    service_id: null,
    content: `# Aftercare: Microneedling / PRP

Hi {client_name}! Your skin just got a major boost. Follow these instructions carefully:

## Day 1 (First 24 Hours)
- **No makeup, sunscreen, or products** for 24 hours
- **No washing face** for 12 hours (let PRP absorb)
- Skin will be red like a sunburn - this is normal!
- Use only the post-care products we provided

## Days 2-3
- Gentle cleanser only
- Apply provided recovery balm or hyaluronic serum
- Still no makeup if possible
- Mild peeling may begin

## Days 4-7
- Can resume light makeup
- Continue gentle skincare
- SPF 30+ is mandatory!
- Peeling and dryness is normal

## First 2 Weeks - AVOID:
❌ Direct sun exposure
❌ Retinoids, AHAs, BHAs
❌ Strenuous exercise (first 48 hours)
❌ Swimming pools, hot tubs
❌ Picking or peeling skin

## What's Normal
✓ Redness (24-72 hours)
✓ Mild swelling
✓ Dryness and peeling (days 3-7)
✓ Skin sensitivity

## Results Timeline
- Initial glow: 1 week
- Collagen building: 4-6 weeks
- Optimal results: 3-6 months
- Series of 3 treatments recommended

📞 Questions or concerns? Call: (630) 636-6193

Your skin will thank you! 🌟

💗 Hello Gorgeous Med Spa`,
    send_via: 'email',
    send_delay_minutes: 30,
    is_active: true,
  },
  {
    name: 'IV Therapy Aftercare',
    service_id: null,
    content: `# Aftercare: IV Therapy

Hi {client_name}! You're all set. Here's what to know:

## Immediately After
- Keep bandage on for 30 minutes
- Small bruise at IV site is normal
- You may feel effects right away!

## Next 24 Hours
- **Drink plenty of water** to continue hydrating
- Eat normally
- Most people feel energized!

## What You May Notice
✓ Increased energy
✓ Better mood
✓ Clearer thinking
✓ Effects can last days to weeks

## For Best Results
- Monthly maintenance drips
- Combine with healthy lifestyle
- Let us know which drip worked best for you!

📞 Questions? Call: (630) 636-6193

Feel amazing! 💧✨

💗 Hello Gorgeous Med Spa`,
    send_via: 'sms',
    send_delay_minutes: 15,
    is_active: true,
  },
  {
    name: 'Lash Extensions Aftercare',
    service_id: null,
    content: `# Aftercare: Lash Extensions

Hi {client_name}! Your lashes look amazing! Here's how to keep them that way:

## First 24-48 Hours - CRITICAL!
- **NO water on lashes** for 24 hours
- **NO steam** (hot showers, cooking)
- **NO touching** or rubbing

## Daily Care
🪥 Brush daily with your spoolie (we provided one!)
🧴 Oil-free products only near eyes
💧 Clean lashes with lash cleanser every 2-3 days
😴 Sleep on your back or side (not face-down)

## AVOID (Always!)
❌ Oil-based makeup removers
❌ Waterproof mascara
❌ Rubbing or pulling lashes
❌ Cotton pads near eyes (fibers snag)
❌ Sleeping on your face

## What's Normal
✓ Losing 2-5 lashes per day (natural lash cycle)
✓ Some twisting after sleeping
✓ Needing fills every 2-3 weeks

## Maintenance Schedule
- Full set lasts 2-3 weeks before fill needed
- Fills recommended every 2-3 weeks
- After 4 weeks, may need full set refresh

📞 Lash emergency? Call: (630) 636-6193

Book your fill before you leave! 💕

💗 Hello Gorgeous Med Spa`,
    send_via: 'both',
    send_delay_minutes: 15,
    is_active: true,
  },
  {
    name: 'General Visit Follow-Up',
    service_id: null,
    content: `# Thank You for Your Visit!

Hi {client_name}!

Thank you for choosing Hello Gorgeous Med Spa for your {service_name} today.

## Questions or Concerns?
Don't hesitate to reach out if you have any questions about your treatment or results.

📞 Phone: (630) 636-6193
📧 Email: hello@hellogorgeousmedspa.com

## Your Next Steps
- Follow any specific aftercare instructions provided
- Book your follow-up or next appointment
- Leave us a review if you loved your experience!

## Stay Connected
Follow us on Instagram @hellogorgeousmedspa for tips, specials, and more!

We look forward to seeing you again soon!

💗 Hello Gorgeous Med Spa
74 W. Washington St, Oswego, IL 60543`,
    send_via: 'email',
    send_delay_minutes: 120,
    is_active: true,
  },
];

export async function POST() {
  try {
    const supabase = createAdminSupabaseClient();
    
    if (!supabase) {
      return NextResponse.json({
        success: true,
        message: 'Templates ready (Supabase not configured)',
        templates: DEFAULT_TEMPLATES,
        count: DEFAULT_TEMPLATES.length,
      });
    }

    const { data, error } = await supabase
      .from('aftercare_templates')
      .upsert(
        DEFAULT_TEMPLATES.map(t => ({
          name: t.name,
          service_id: t.service_id,
          content: t.content,
          send_via: t.send_via,
          send_delay_minutes: t.send_delay_minutes,
          is_active: t.is_active,
        })),
        { onConflict: 'name' }
      )
      .select();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: `Seeded ${data?.length || DEFAULT_TEMPLATES.length} aftercare templates`,
      count: data?.length || DEFAULT_TEMPLATES.length,
    });

  } catch (error: any) {
    console.error('Seed aftercare error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to seed templates' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    templates: DEFAULT_TEMPLATES,
    count: DEFAULT_TEMPLATES.length,
  });
}
