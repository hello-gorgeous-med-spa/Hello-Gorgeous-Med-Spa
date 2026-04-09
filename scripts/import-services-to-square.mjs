#!/usr/bin/env node
// ============================================================
// HELLO GORGEOUS — Square Catalog Bulk Import
// Imports all Fresha-exported services (~86) into Square Appointments catalog
//
// USAGE (from repo root):
//   SQUARE_ACCESS_TOKEN=EAAA... node scripts/import-services-to-square.mjs
//   SQUARE_ENVIRONMENT=sandbox SQUARE_ACCESS_TOKEN=... node scripts/import-services-to-square.mjs
//
// Or with .env:
//   node --env-file=.env.local scripts/import-services-to-square.mjs
//
// Dry run (no API calls):
//   node scripts/import-services-to-square.mjs --dry-run
//
// WHAT IT DOES:
//   1. Creates service categories in Square Catalog
//   2. Creates all 85 services under the right categories
//   3. Sets prices, durations, and descriptions
//   4. Enables online booking for each service
//   5. Logs any errors without stopping the whole import
//
// SAFE TO RUN MULTIPLE TIMES — uses idempotency keys
// ============================================================

const DRY_RUN = process.argv.includes('--dry-run');

function apiRoot() {
  const env = (process.env.SQUARE_ENVIRONMENT || process.env.SQUARE_ENV || 'production').toLowerCase();
  return env === 'sandbox'
    ? 'https://connect.squareupsandbox.com/v2'
    : 'https://connect.squareup.com/v2';
}

const SQUARE_VERSION = '2024-11-20';
const TOKEN = process.env.SQUARE_ACCESS_TOKEN;
const ENV = apiRoot();

if (!DRY_RUN && (!TOKEN || TOKEN.length < 10)) {
  console.error('❌ Missing SQUARE_ACCESS_TOKEN (set env or use --dry-run)');
  process.exit(1);
}

// ── ALL 85 SERVICES FROM FRESHA ──────────────────────────────
const SERVICES = [
  // EXCLUSIVE MODEL SPECIALS
  { name: 'Professional Brazilian Laser Hair Removal', price: 49900, duration: 30, category: 'Spring Specials', description: '✨ Brazilian Laser Hair Removal — 3 Month Package\nApril · May · June — all three sessions included\n💰 Only $499 for all 3 months\n🎁 Book by end of March — get a FREE small area added to every session\n🔁 Not fully removed after 3 sessions? We\'ll do a FREE touch-up.\nMedical-grade laser technology with full clinical oversight.' },
  { name: 'The Trifecta', price: 199900, duration: 60, category: 'Exclusive Model Specials', description: 'Morpheus8 for tightening and collagen, Solaria CO₂ for resurfacing and tone, Quantum RF for fat reduction and contouring. Full face, neck, and sculpting protocol. Only 20 VIP Model spots.' },
  { name: 'Morpheus8 + CO₂ Combo — Most Popular', price: 149900, duration: 60, category: 'Exclusive Model Specials', description: 'Transform your skin with Morpheus8 Burst for deep collagen remodeling plus Solaria CO₂ for surface correction. Two layers of treatment, one plan. Only 20 VIP Model spots.' },
  { name: 'Solaria CO₂ Laser — Under Eye', price: 49500, duration: 60, category: 'Exclusive Model Specials', description: 'Experience the rejuvenating power of our carbon laser peel, designed to revitalize your skin. This advanced treatment gently removes imperfections, leaving your complexion smoother and more radiant.' },
  { name: 'Solaria CO₂ Laser — Neck Only', price: 59500, duration: 60, category: 'Exclusive Model Specials', description: 'Experience the rejuvenating power of our carbon laser peel for the neck. Removes imperfections, leaving your complexion smoother and more radiant.' },
  { name: 'Solaria CO₂ Laser', price: 89900, duration: 60, category: 'Exclusive Model Specials', description: 'Experience the rejuvenating power of our carbon laser peel. Advanced treatment gently removes imperfections, leaving your complexion smoother and more radiant.' },
  { name: 'Morpheus8 Burst Full Face + Free Neck — VIP Model Special', price: 79900, duration: 60, category: 'Exclusive Model Specials', description: 'Morpheus8 Burst is an RF microneedling treatment that delivers radiofrequency energy at three depths at once, including up to 8mm. Treats loose skin, fine lines, wrinkles, acne scars, jowls, and enlarged pores.' },
  { name: 'Morpheus8 Burst — Buy One Area, Get One 50% Off', price: 120000, duration: 60, category: 'Exclusive Model Specials', description: 'Morpheus8 Burst RF microneedling. Buy one area, get one 50% off. Treats loose skin, fine lines, wrinkles, acne scars, jowls, jawline laxity, and enlarged pores.' },
  { name: 'Morpheus8 Burst x3 Package', price: 199900, duration: 60, category: 'Exclusive Model Specials', description: 'Three Morpheus8 Burst sessions. RF microneedling that delivers radiofrequency energy at three depths at once, up to 8mm deep. Continued improvement for 3–6 months.' },

  // BIOIDENTICAL HORMONE THERAPY (BHRT)
  { name: 'Pellet Therapy — Women', price: 65000, duration: 60, category: 'Bioidentical Hormone Therapy (BHRT)', description: 'BioTE hormone optimization for women. Initial Package includes consult + labs + first pellet. Many patients report improvements in energy, sleep, mood, clarity, and libido.' },
  { name: 'Pellet Therapy — Men', price: 90000, duration: 60, category: 'Bioidentical Hormone Therapy (BHRT)', description: 'BioTE hormone optimization for men. Initial Package includes consult + labs + first pellet. Maintenance: $700.' },
  { name: 'Hormone Lab Panel — Women', price: 24900, duration: 30, category: 'Bioidentical Hormone Therapy (BHRT)', description: '17 Hormone panel with results within 36 hours. Personalized hormone optimization plan based on your symptoms and results.' },

  // BOTOX
  { name: 'Botox — 1 Area', price: 0, duration: 30, category: 'Botox', description: 'Neuromodulator treatment for one area. Price determined at consultation based on units needed. Includes forehead, glabella (11s), or crows feet.' },
  { name: 'Botox — 2 Areas', price: 0, duration: 30, category: 'Botox', description: 'Neuromodulator treatment for two areas. Price determined at consultation based on units needed.' },
  { name: 'Botox — 3 Areas', price: 0, duration: 45, category: 'Botox', description: 'Neuromodulator treatment for three areas. Price determined at consultation based on units needed.' },
  { name: 'Lip Flip', price: 0, duration: 15, category: 'Botox', description: 'Subtle lip enhancement using neuromodulator to flip the upper lip slightly upward for a fuller appearance without filler.' },

  // DERMAL FILLERS
  { name: 'Lip Filler — 0.5ml', price: 0, duration: 45, category: 'Dermal Fillers', description: 'Hyaluronic acid lip filler for subtle enhancement. 0.5ml syringe. Results last 6–12 months.' },
  { name: 'Lip Filler — 1ml', price: 0, duration: 45, category: 'Dermal Fillers', description: 'Hyaluronic acid lip filler for fuller enhancement. 1ml syringe. Results last 6–12 months.' },
  { name: 'Lip Dissolver (Hylanex)', price: 25000, duration: 30, category: 'Dermal Fillers', description: 'Hyaluronidase (Hylenex) injection to dissolve existing hyaluronic acid filler. From $250.' },

  // SKIN SPA
  { name: '2-in-1 Hydra Pen Micro-channeling & Hydra Facial', price: 16900, duration: 60, category: 'Skin Spa', description: 'Combines micro-channeling with hydra facial for deep hydration and skin renewal.' },
  { name: 'Anteage Growth Factor Under Eye Mesotherapy', price: 19900, duration: 30, category: 'Skin Spa', description: 'Advanced under eye treatment using Anteage growth factors delivered via mesotherapy for dark circles, puffiness, and fine lines.' },
  { name: 'Carbon Laser Peel', price: 15000, duration: 45, category: 'Skin Spa', description: 'Hollywood carbon laser peel for glowing, rejuvenated skin. Reduces pores, oil, and pigmentation.' },
  { name: 'Chemical Peel', price: 9900, duration: 45, category: 'Skin Spa', description: 'Medical-grade chemical peel customized to your skin type and concerns.' },
  { name: 'Diamond Glow Facial', price: 14900, duration: 60, category: 'Skin Spa', description: 'Professional diamond-tip microdermabrasion with serum infusion for radiant, smooth skin.' },
  { name: 'HydraFacial', price: 16900, duration: 60, category: 'Skin Spa', description: 'The signature HydraFacial — cleanse, extract, hydrate. Suitable for all skin types.' },
  { name: 'Microdermabrasion', price: 10900, duration: 45, category: 'Skin Spa', description: 'Crystal or diamond microdermabrasion to exfoliate and renew skin texture.' },
  { name: 'Microneedling', price: 29900, duration: 60, category: 'Skin Spa', description: 'Collagen Induction Therapy (CIT) using fine needles to stimulate natural collagen production.' },
  { name: 'Microneedling with PRP', price: 45000, duration: 75, category: 'Skin Spa', description: 'Microneedling combined with your own Platelet Rich Plasma for enhanced collagen stimulation and healing.' },
  { name: 'Nano Needling', price: 14900, duration: 45, category: 'Skin Spa', description: 'Nano-channeling for superficial serum infusion and skin brightening without downtime.' },
  { name: 'Oxygen Facial', price: 12900, duration: 60, category: 'Skin Spa', description: 'Pressurized oxygen infusion with hyaluronic acid and vitamins for instant glow and hydration.' },
  { name: 'Signature Facial', price: 9900, duration: 60, category: 'Skin Spa', description: 'Customized facial treatment including cleanse, exfoliation, extractions, mask, and hydration.' },
  { name: 'VI Peel', price: 25000, duration: 30, category: 'Skin Spa', description: 'Medical-grade VI Peel for pigmentation, acne, and anti-aging. Includes take-home kit.' },

  // GLOWDOX FACIAL
  { name: 'GlowTox Facial — Our Signature', price: 55000, duration: 90, category: 'GlowTox Facial', description: 'Our signature GlowTox combines HydraFacial + Botox for the ultimate glow treatment. Cleanse, hydrate, and smooth in one session.' },

  // BODY SPA
  { name: 'Body Contouring — Abdomen', price: 0, duration: 60, category: 'Body Spa', description: 'Non-invasive body contouring for the abdomen using advanced RF and ultrasound technology.' },
  { name: 'Body Contouring — Arms', price: 0, duration: 45, category: 'Body Spa', description: 'Non-invasive body contouring for the arms.' },
  { name: 'Body Contouring — Back', price: 0, duration: 60, category: 'Body Spa', description: 'Non-invasive body contouring for the back.' },
  { name: 'Body Contouring — Flanks', price: 0, duration: 45, category: 'Body Spa', description: 'Non-invasive body contouring for the flanks and love handles.' },
  { name: 'Body Contouring — Legs', price: 0, duration: 60, category: 'Body Spa', description: 'Non-invasive body contouring for the legs and thighs.' },
  { name: 'Body Wrap', price: 12900, duration: 60, category: 'Body Spa', description: 'Detoxifying and slimming body wrap treatment.' },
  { name: 'Quantum RF Lipo — Abdomen', price: 149900, duration: 75, category: 'Body Spa', description: 'Quantum RF Lipo for non-surgical fat reduction and skin tightening of the abdomen.' },

  // LASH SPA
  { name: 'Lash Lift & Tint', price: 9500, duration: 60, category: 'Lash Spa', description: 'Lash lift to curl and open the eye, combined with tint for darker, fuller lashes. Lasts 6–8 weeks.' },
  { name: 'Lash Tint Only', price: 3500, duration: 20, category: 'Lash Spa', description: 'Lash tinting only for darker, more defined lashes.' },
  { name: 'Classic Lash Extensions — Full Set', price: 14500, duration: 120, category: 'Lash Spa', description: 'Full set of classic lash extensions. One extension per natural lash for a natural, defined look.' },
  { name: 'Classic Lash Extensions — 2-Week Fill', price: 6500, duration: 60, category: 'Lash Spa', description: '2-week lash extension fill to maintain your full set.' },
  { name: 'Classic Lash Extensions — 3-Week Fill', price: 8000, duration: 75, category: 'Lash Spa', description: '3-week lash extension fill.' },
  { name: 'Volume Lash Extensions — Full Set', price: 17500, duration: 150, category: 'Lash Spa', description: 'Full set of volume lash extensions. Multiple fine extensions per natural lash for a dramatic, full look.' },
  { name: 'Volume Lash Extensions — 2-Week Fill', price: 8000, duration: 60, category: 'Lash Spa', description: '2-week volume lash fill.' },
  { name: 'Volume Lash Extensions — 3-Week Fill', price: 9500, duration: 75, category: 'Lash Spa', description: '3-week volume lash fill.' },
  { name: 'Mega Volume — Full Set', price: 20000, duration: 180, category: 'Lash Spa', description: 'Mega volume lash extensions for the most dramatic, fluffy look.' },
  { name: 'Lash Removal', price: 2500, duration: 20, category: 'Lash Spa', description: 'Safe removal of lash extensions.' },
  { name: 'Lash Brow Combo', price: 12500, duration: 80, category: 'Lash Spa', description: 'Lash lift and tint combined with brow lamination and tint.' },

  // BROW SPA
  { name: 'Brow Lamination', price: 7500, duration: 45, category: 'Brow Spa', description: 'Brow lamination for fluffy, groomed brows. Lasts 6–8 weeks.' },
  { name: 'Brow Lamination & Tint', price: 9500, duration: 60, category: 'Brow Spa', description: 'Brow lamination combined with tint for definition and color.' },
  { name: 'Brow Tint', price: 3000, duration: 20, category: 'Brow Spa', description: 'Brow tinting for darker, more defined brows.' },
  { name: 'Brow Wax & Shape', price: 2500, duration: 15, category: 'Brow Spa', description: 'Brow waxing and shaping for clean, defined arches.' },
  { name: 'Brow Microblading Consultation', price: 0, duration: 30, category: 'Brow Spa', description: 'Complimentary consultation for microblading and permanent makeup services.' },

  // ANTEAGE
  { name: 'AnteAGE MD Microneedling Treatment', price: 45000, duration: 75, category: 'AnteAGE Skin Regeneration', description: 'Microneedling with AnteAGE MD growth factors for advanced skin regeneration, collagen stimulation, and rejuvenation.' },
  { name: 'AnteAGE MD Scalp Treatment', price: 35000, duration: 60, category: 'AnteAGE Skin Regeneration', description: 'AnteAGE MD scalp treatment for hair restoration and scalp health using growth factors.' },
  { name: 'AnteAGE MD Facial', price: 25000, duration: 60, category: 'AnteAGE Skin Regeneration', description: 'AnteAGE MD facial using stem cell growth factors for deep skin regeneration.' },
  { name: 'AnteAGE Exosome Treatment', price: 55000, duration: 75, category: 'AnteAGE Skin Regeneration', description: 'Cutting-edge exosome therapy for cellular regeneration and anti-aging.' },
  { name: 'AnteAGE Home Care Consultation', price: 0, duration: 30, category: 'AnteAGE Skin Regeneration', description: 'Complimentary consultation for AnteAGE home care protocol.' },
  { name: 'AnteAGE MD + CO₂ Combo', price: 119900, duration: 90, category: 'AnteAGE Skin Regeneration', description: 'AnteAGE MD growth factors combined with Solaria CO₂ laser for maximum skin regeneration.' },

  // IV DRIP
  { name: 'IV Drip — Myers Cocktail', price: 17500, duration: 45, category: 'IV Drip Package Deals', description: 'The classic Myers Cocktail IV drip with magnesium, B vitamins, vitamin C, and calcium.' },
  { name: 'IV Drip — Immunity Boost', price: 19500, duration: 45, category: 'IV Drip Package Deals', description: 'High-dose vitamin C, zinc, and immune-boosting nutrients to strengthen your immune system.' },
  { name: 'IV Drip — Beauty Glow', price: 19500, duration: 45, category: 'IV Drip Package Deals', description: 'Biotin, glutathione, and collagen-boosting nutrients for skin, hair, and nails.' },
  { name: 'IV Drip — Energy & Performance', price: 19500, duration: 45, category: 'IV Drip Package Deals', description: 'B12, amino acids, and energy-boosting nutrients for peak performance and recovery.' },
  { name: 'IV Drip — Hangover Recovery', price: 17500, duration: 45, category: 'IV Drip Package Deals', description: 'Anti-nausea, anti-inflammatory, and hydration IV drip for rapid hangover relief.' },
  { name: 'IV Drip — NAD+', price: 35000, duration: 180, category: 'IV Drip Package Deals', description: 'NAD+ IV infusion for cellular energy, anti-aging, and cognitive clarity.' },

  // PRP INJECTIONS
  { name: 'PRP — Facial (Vampire Facial)', price: 60000, duration: 75, category: 'PRP Injections', description: 'Platelet Rich Plasma facial with microneedling for natural collagen stimulation and skin rejuvenation.' },
  { name: 'PRP — Hair Restoration', price: 75000, duration: 60, category: 'PRP Injections', description: 'PRP injections into the scalp to stimulate hair follicles and promote natural hair regrowth.' },
  { name: 'PRP — Joint / Body', price: 65000, duration: 45, category: 'PRP Injections', description: 'PRP injections for joint pain, tendon injuries, and body regeneration.' },

  // WEIGHT LOSS
  { name: 'Semaglutide — Initial Consult + First Injection', price: 29900, duration: 30, category: 'Weight Loss Injections', description: 'GLP-1 weight loss program with semaglutide. Initial consultation with Ryan Kent, FNP-BC + first injection. Includes full medical evaluation and personalized dosing plan.' },
  { name: 'Semaglutide — Monthly Maintenance', price: 24900, duration: 15, category: 'Weight Loss Injections', description: 'Monthly semaglutide injection maintenance for existing GLP-1 clients.' },
  { name: 'Tirzepatide — Initial Consult + First Injection', price: 34900, duration: 30, category: 'Weight Loss Injections', description: 'GLP-1/GIP dual agonist weight loss program with tirzepatide. Initial consultation + first injection.' },
  { name: 'Tirzepatide — Monthly Maintenance', price: 29900, duration: 15, category: 'Weight Loss Injections', description: 'Monthly tirzepatide injection maintenance for existing clients.' },
  { name: 'B12 Injection', price: 2500, duration: 10, category: 'Weight Loss Injections', description: 'Vitamin B12 injection for energy, metabolism, and mood support.' },
  { name: 'MIC/Lipo-B Injection', price: 3500, duration: 10, category: 'Weight Loss Injections', description: 'Methionine, Inositol, Choline (MIC) lipotropic injection for fat metabolism and energy.' },
  { name: 'B-Complex Injection', price: 2500, duration: 10, category: 'Weight Loss Injections', description: 'Full B-Complex vitamin injection for energy, mood, and nerve health.' },
  { name: 'Glutathione Injection', price: 3500, duration: 10, category: 'Weight Loss Injections', description: 'Master antioxidant glutathione injection for detox, skin brightening, and immune support.' },
  { name: 'Weight Loss Consultation', price: 0, duration: 30, category: 'Weight Loss Injections', description: 'Complimentary weight loss consultation with Ryan Kent, FNP-BC. Includes review of medical history and personalized GLP-1 program options.' },
  { name: 'Body Composition Analysis', price: 2500, duration: 15, category: 'Weight Loss Injections', description: 'InBody or similar body composition scan to track fat, muscle, and water composition.' },
  { name: 'Weight Loss Package — 3 Months', price: 74900, duration: 15, category: 'Weight Loss Injections', description: '3-month GLP-1 weight loss package. Includes monthly injections, monitoring, and check-ins.' },

  // VITAMIN INJECTIONS
  { name: 'Vitamin Injection Bar — Choose Your Shot', price: 2500, duration: 10, category: 'Vitamin Injections', description: 'Choose from B12, MIC/Lipo-B, B-Complex, Glutathione, or Vitamin D injections. Walk-in friendly.' },

  // TRIGGER POINT
  { name: 'Trigger Point Injection — Single Site', price: 8500, duration: 20, category: 'Trigger Point Injections', description: 'Trigger point injection for muscle pain relief at a single site using lidocaine or saline.' },
  { name: 'Trigger Point Injection — Multiple Sites', price: 14900, duration: 30, category: 'Trigger Point Injections', description: 'Trigger point injections for multiple sites for broader muscle pain relief.' },

  // MEDICAL VISIT
  { name: 'Medical Visit with Ryan Kent, FNP-BC', price: 15000, duration: 30, category: 'Medical Consultations', description: 'Medical visit with Ryan Kent, APRN, FNP-BC, FPA for consultations, follow-ups, and medical oversight.' },
];

// ── HELPERS ──────────────────────────────────────────────────
async function squarePost(endpoint, body) {
  const res = await fetch(`${ENV}${endpoint}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Square-Version': SQUARE_VERSION,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (data.errors) throw new Error(JSON.stringify(data.errors));
  return data;
}

/** If category upsert fails (e.g. already created elsewhere), find by exact name. */
async function findCategoryIdByName(name) {
  const data = await squarePost('/catalog/search', {
    object_types: ['CATEGORY'],
    query: {
      exact_query: { attribute_name: 'name', attribute_value: name },
    },
    limit: 10,
  });
  const objs = data.objects || data.related_objects || [];
  for (const o of objs) {
    if (o.type === 'CATEGORY' && o.category_data?.name === name) return o.id;
  }
  return null;
}

// ── MAIN ─────────────────────────────────────────────────────
async function main() {
  console.log(`\n🌸 Hello Gorgeous — Square Service Import`);
  console.log(`📋 ${SERVICES.length} services · API ${ENV.replace('/v2', '')}\n`);

  if (DRY_RUN) {
    console.log('Dry run — no API calls. Categories:', [...new Set(SERVICES.map((s) => s.category))].length);
    console.log('Sample:', SERVICES[0].name, '→', SERVICES[0].category);
    return;
  }

  // Get unique categories
  const categories = [...new Set(SERVICES.map((s) => s.category))];
  console.log(`📁 Creating / resolving ${categories.length} categories...`);

  // Step 1: Create all categories
  const categoryMap = {}; // name → Square ID
  for (const cat of categories) {
    try {
      const idempotencyKey = `hg-cat-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
      const res = await squarePost('/catalog/object', {
        idempotency_key: idempotencyKey,
        object: {
          type: 'CATEGORY',
          id: `#${idempotencyKey}`,
          present_at_all_locations: true,
          category_data: { name: cat },
        },
      });
      categoryMap[cat] = res.catalog_object.id;
      console.log(`  ✓ ${cat}`);
    } catch (e) {
      const found = await findCategoryIdByName(cat).catch(() => null);
      if (found) {
        categoryMap[cat] = found;
        console.log(`  ↺ ${cat} (found existing)`);
      } else {
        console.log(`  ⚠ ${cat}: ${e.message}`);
      }
    }
    await new Promise((r) => setTimeout(r, 80));
  }

  console.log(`\n💆 Creating ${SERVICES.length} services...\n`);

  // Step 2: Create all services
  let created = 0;
  let failed = 0;
  for (const svc of SERVICES) {
    try {
      const idempotencyKey = `hg-svc-${svc.name.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 40)}`;
      const itemTempId = `#${idempotencyKey}-item`;
      const varTempId = `#${idempotencyKey}-var`;
      const categoryId = categoryMap[svc.category];

      const itemData = {
        name: svc.name,
        description: svc.description || '',
        ...(categoryId ? { category_id: categoryId } : {}),
        variations: [
          {
            type: 'ITEM_VARIATION',
            id: varTempId,
            present_at_all_locations: true,
            item_variation_data: {
              item_id: itemTempId,
              name: 'Standard',
              pricing_type: svc.price > 0 ? 'FIXED_PRICING' : 'VARIABLE_PRICING',
              ...(svc.price > 0
                ? { price_money: { amount: svc.price, currency: 'USD' } }
                : {}),
              service_duration: svc.duration * 60000,
              available_for_booking: true,
            },
          },
        ],
        product_type: 'APPOINTMENTS_SERVICE',
      };

      await squarePost('/catalog/object', {
        idempotency_key: idempotencyKey,
        object: {
          type: 'ITEM',
          id: itemTempId,
          present_at_all_locations: true,
          item_data: itemData,
        },
      });

      console.log(`  ✓ ${svc.name} — $${(svc.price / 100).toFixed(2)} · ${svc.duration}min`);
      created++;

      await new Promise((r) => setTimeout(r, 120));
    } catch (e) {
      console.log(`  ✕ ${svc.name}: ${e.message}`);
      failed++;
    }
  }

  console.log(`\n✅ Import complete!`);
  console.log(`   Created: ${created} services`);
  console.log(`   Failed:  ${failed} services`);
  console.log(`\n📱 Next steps:`);
  console.log(`   1. Go to Square Dashboard → Appointments → Services`);
  console.log(`   2. Review imported services and adjust prices as needed`);
  console.log(`   3. Set up staff availability for Dani and Ryan`);
  console.log(`   4. Enable Online Booking → get embed code`);
  console.log(`   5. Add booking widget to hellogorgeousmedspa.com\n`);
}

main().catch(console.error);
