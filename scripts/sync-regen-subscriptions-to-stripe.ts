#!/usr/bin/env npx tsx
/**
 * Sync REGEN RX subscription tiers to Stripe
 * Creates products and recurring prices for each subscription tier
 * 
 * Usage: STRIPE_SECRET_KEY=sk_live_xxx npx tsx scripts/sync-regen-subscriptions-to-stripe.ts
 */

import Stripe from 'stripe';
import { SUBSCRIPTION_TIERS, SUBSCRIPTION_CATEGORIES, PREPAY_DISCOUNTS } from '../lib/regen/subscriptions/subscription-tiers';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
if (!STRIPE_SECRET_KEY) {
  console.error('Missing STRIPE_SECRET_KEY');
  process.exit(1);
}

const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });

async function findOrCreateProduct(tier: typeof SUBSCRIPTION_TIERS[0]): Promise<Stripe.Product> {
  const category = SUBSCRIPTION_CATEGORIES[tier.category];
  
  // Search for existing product by metadata
  const existing = await stripe.products.search({
    query: `metadata['regen_tier_id']:'${tier.id}'`,
  });
  
  if (existing.data.length > 0) {
    console.log(`  ✓ Found existing product: ${tier.name}`);
    return existing.data[0];
  }
  
  // Create new product
  const product = await stripe.products.create({
    name: `REGEN RX: ${tier.name}`,
    description: tier.description,
    metadata: {
      regen_tier_id: tier.id,
      category: tier.category,
      category_name: category.name,
      includes: tier.includes.join(' | '),
      estimated_cost_usd: tier.estimatedCostUsd.toString(),
    },
    default_price_data: {
      currency: 'usd',
      unit_amount: tier.monthlyPriceUsd * 100,
      recurring: {
        interval: 'month',
      },
    },
  });
  
  console.log(`  + Created product: ${tier.name} ($${tier.monthlyPriceUsd}/mo)`);
  return product;
}

async function createPrepayPrices(product: Stripe.Product, tier: typeof SUBSCRIPTION_TIERS[0]): Promise<void> {
  // Create 3-month, 6-month, 12-month prepay prices
  for (const [months, discount] of Object.entries(PREPAY_DISCOUNTS)) {
    const monthsNum = parseInt(months);
    const totalPrice = Math.round(tier.monthlyPriceUsd * monthsNum * (1 - discount));
    const discountPct = Math.round(discount * 100);
    
    // Check if price exists
    const existingPrices = await stripe.prices.list({
      product: product.id,
      active: true,
    });
    
    const hasPrice = existingPrices.data.some(p => 
      p.metadata?.prepay_months === months && 
      p.unit_amount === totalPrice * 100
    );
    
    if (hasPrice) {
      console.log(`    ✓ ${months}-month prepay price exists`);
      continue;
    }
    
    await stripe.prices.create({
      product: product.id,
      currency: 'usd',
      unit_amount: totalPrice * 100,
      metadata: {
        prepay_months: months,
        discount_pct: discountPct.toString(),
        original_monthly: tier.monthlyPriceUsd.toString(),
      },
    });
    
    console.log(`    + Created ${months}-month prepay: $${totalPrice} (${discountPct}% off)`);
  }
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('REGEN RX Subscription Sync to Stripe');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  let created = 0;
  let existing = 0;
  
  // Group by category for nicer output
  const categories = [...new Set(SUBSCRIPTION_TIERS.map(t => t.category))];
  
  for (const category of categories) {
    const categoryMeta = SUBSCRIPTION_CATEGORIES[category];
    console.log(`\n${categoryMeta.icon} ${categoryMeta.name}`);
    console.log('─'.repeat(50));
    
    const tiers = SUBSCRIPTION_TIERS.filter(t => t.category === category);
    
    for (const tier of tiers) {
      try {
        const product = await findOrCreateProduct(tier);
        
        if (product.created > Date.now() / 1000 - 60) {
          created++;
        } else {
          existing++;
        }
        
        // Create prepay prices
        await createPrepayPrices(product, tier);
        
      } catch (error) {
        console.error(`  ✗ Error with ${tier.name}:`, error);
      }
    }
  }
  
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log(`Done! Created: ${created}, Existing: ${existing}`);
  console.log('═══════════════════════════════════════════════════════════════\n');
}

main().catch(console.error);
