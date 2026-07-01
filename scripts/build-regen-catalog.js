#!/usr/bin/env node
/**
 * Build RE GEN Product Catalog from Pharmacy Bible
 * 
 * Reads: data/pharmacy-catalog-raw.json (extracted from Pharmacy Selector HTML)
 * Writes: data/regen-best-prices.json (cheapest option per compound/strength)
 * 
 * Run: node scripts/build-regen-catalog.js
 */

const fs = require('fs');
const path = require('path');

const MARKUP = 2.5;
const DISCOUNT_90 = 0.10;
const SHIPPING = 30;

// Load raw catalog
const rawPath = path.join(__dirname, '../data/pharmacy-catalog-raw.json');
const data = JSON.parse(fs.readFileSync(rawPath, 'utf8'));

console.log(`Loaded ${data.length} products from pharmacy bible\n`);

// Normalize compound names for grouping
function normalizeCompound(name) {
  const l = name.toLowerCase();
  if (l.includes('semaglutide')) return 'Semaglutide';
  if (l.includes('tirzepatide')) return 'Tirzepatide';
  if (l.includes('sermorelin') && l.includes('oxytocin')) return 'Sermorelin/Oxytocin';
  if (l.includes('sermorelin') && l.includes('dhea')) return 'Sermorelin/DHEA';
  if (l.includes('sermorelin')) return 'Sermorelin';
  if (l.match(/^nad[+ ]/i)) return 'NAD+';
  if (l.includes('testosterone cypionate') && l.includes('anastrozole')) return 'Test Cyp/Anastrozole';
  if (l.includes('testosterone cypionate') && l.includes('propionate')) return 'Test Cyp/Propionate';
  if (l.includes('testosterone cypionate')) return 'Testosterone Cypionate';
  if (l.includes('testosterone cream')) return 'Testosterone Cream';
  if (l.includes('testosterone propionate')) return 'Testosterone Propionate';
  if (l.includes('progesterone')) return 'Progesterone';
  if (l.includes('estradiol')) return 'Estradiol';
  if (l.includes('b12') || l.includes('methylcobalamin') || l.includes('hydroxocobalamin')) return 'B12';
  if (l.includes('bpc-157') || l.includes('bpc 157')) return 'BPC-157';
  if (l.includes('pt-141') || l.includes('bremelanotide')) return 'PT-141';
  if (l.includes('glutathione')) return 'Glutathione';
  if (l.includes('minoxidil')) return 'Minoxidil';
  if (l.includes('lipo-mino') || l.includes('lipomino') || l.includes('mic')) return 'Lipo-Mino/MIC';
  if (l.includes('gonadorelin')) return 'Gonadorelin';
  if (l.includes('tesamorelin')) return 'Tesamorelin';
  if (l.includes('ipamorelin')) return 'Ipamorelin';
  if (l.includes('cjc-1295')) return 'CJC-1295';
  if (l.includes('ghk-cu') || l.includes('ghk cu')) return 'GHK-Cu';
  if (l.includes('naltrexone')) return 'Naltrexone (LDN)';
  if (l.includes('sildenafil') && l.includes('tadalafil')) return 'Sildenafil/Tadalafil Combo';
  if (l.includes('sildenafil')) return 'Sildenafil';
  if (l.includes('tadalafil')) return 'Tadalafil';
  return name;
}

// Map categories to RE GEN categories
function mapCategory(cat) {
  const map = {
    'GLP-1 / Weight Loss': 'weight-loss',
    'Hormone Therapy': 'hormones',
    'Peptide Therapy': 'peptides',
    'Wellness': 'wellness',
    'Vitamin Injections': 'vitamins',
    'Hair Loss': 'hair-skin',
    'Sexual Health': 'sexual-health',
  };
  return map[cat] || 'other';
}

// Map route to form
function mapForm(route) {
  const r = (route || '').toLowerCase();
  if (r.includes('inject') || r.includes('im') || r.includes('subq')) return 'injectable';
  if (r.includes('cream') || r.includes('topical')) return 'cream';
  if (r.includes('troche')) return 'troche';
  if (r.includes('tablet') || r.includes('rdt') || r.includes('sublingual')) return 'rdt';
  if (r.includes('capsule') || r.includes('oral')) return 'capsule';
  if (r.includes('spray')) return 'spray';
  if (r.includes('patch')) return 'patch';
  return 'other';
}

// Calculate pricing
function calcPricing(cost) {
  const retail30 = Math.round(cost * MARKUP * 100) / 100;
  const retail90Full = retail30 * 3;
  const retail90 = Math.round(retail90Full * (1 - DISCOUNT_90) * 100) / 100;
  const savings90 = Math.round((retail90Full - retail90) * 100) / 100;
  const margin30 = Math.round((retail30 - cost) * 100) / 100;
  const margin90 = Math.round((retail90 - (cost * 3)) * 100) / 100;
  
  return {
    wholesale: cost,
    retail30,
    retail90,
    savings90,
    margin30,
    margin90,
  };
}

// Build catalog with best prices
const catalog = [];

// Group by unique product (name + strength + size)
const productKey = (p) => `${p.name}|${p.conc}|${p.size}`;
const byProduct = {};

data.forEach(p => {
  const key = productKey(p);
  if (!byProduct[key]) byProduct[key] = [];
  byProduct[key].push(p);
});

// For each product, find cheapest pharmacy
Object.entries(byProduct).forEach(([key, options]) => {
  // Sort by cost to get cheapest
  options.sort((a, b) => a.cost - b.cost);
  const best = options[0];
  const alternatives = options.slice(1);
  
  const pricing = calcPricing(best.cost);
  
  catalog.push({
    id: best.id || `prod-${catalog.length}`,
    sku: best.sku,
    name: best.name,
    compound: normalizeCompound(best.name),
    concentration: best.conc,
    size: best.size,
    route: best.route,
    form: mapForm(best.route),
    category: mapCategory(best.category),
    originalCategory: best.category,
    
    // Best pharmacy
    pharmacy: best.pharmacy,
    
    // Pricing
    ...pricing,
    
    // Shipping/handling
    coldShip: best.coldShip || false,
    controlled: best.controlled || false,
    budDays: best.budDays,
    
    // Alternatives (if other pharmacies have it)
    alternatives: alternatives.map(a => ({
      pharmacy: a.pharmacy,
      cost: a.cost,
      retail30: Math.round(a.cost * MARKUP * 100) / 100,
    })),
    
    // Flag if cross-shop opportunity exists
    crossShop: alternatives.length > 0,
  });
});

// Sort by category, then compound, then cost
catalog.sort((a, b) => {
  if (a.category !== b.category) return a.category.localeCompare(b.category);
  if (a.compound !== b.compound) return a.compound.localeCompare(b.compound);
  return a.wholesale - b.wholesale;
});

// Write output
const outPath = path.join(__dirname, '../data/regen-best-prices.json');
fs.writeFileSync(outPath, JSON.stringify({
  generatedAt: new Date().toISOString(),
  markup: MARKUP,
  discount90Day: DISCOUNT_90,
  shippingFlat: SHIPPING,
  totalProducts: catalog.length,
  byPharmacy: {
    'Formulation Rx': catalog.filter(p => p.pharmacy === 'Formulation Rx').length,
    'BoomRx': catalog.filter(p => p.pharmacy === 'BoomRx').length,
    'Olympia': catalog.filter(p => p.pharmacy === 'Olympia').length,
  },
  byCategory: Object.fromEntries(
    [...new Set(catalog.map(p => p.category))].map(cat => [
      cat,
      catalog.filter(p => p.category === cat).length
    ])
  ),
  products: catalog,
}, null, 2));

console.log(`Generated ${catalog.length} best-price products`);
console.log(`Saved to: ${outPath}`);

// Summary
console.log('\n=== SUMMARY ===');
console.log('\nBy Pharmacy (best price wins):');
const byPharm = {};
catalog.forEach(p => { byPharm[p.pharmacy] = (byPharm[p.pharmacy] || 0) + 1; });
Object.entries(byPharm).sort((a,b) => b[1] - a[1]).forEach(([k,v]) => console.log(`  ${k}: ${v} products`));

console.log('\nCross-shop opportunities:', catalog.filter(p => p.crossShop).length);

console.log('\nSample products:');
catalog.slice(0, 5).forEach(p => {
  console.log(`  ${p.compound} (${p.concentration}) - ${p.pharmacy} - $${p.wholesale} → $${p.retail30}`);
});
