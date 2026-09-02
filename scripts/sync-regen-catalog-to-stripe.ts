/**
 * Sync RE GEN Admin Catalog to Stripe
 * 
 * Reads from lib/regen/catalog/catalog-data.js and creates
 * Stripe Products organized by goal category.
 * 
 * Usage: npx tsx scripts/sync-regen-catalog-to-stripe.ts
 */

import Stripe from 'stripe';
// @ts-expect-error - JS file import
import { PRODUCTS, GOALS } from '../lib/regen/catalog/catalog-data.js';

const STRIPE_SECRET = process.env.REGEN_STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY;

if (!STRIPE_SECRET) {
  console.error('Missing STRIPE_SECRET_KEY');
  process.exit(1);
}

const stripe = new Stripe(STRIPE_SECRET, { apiVersion: '2024-06-20' });

interface Variant {
  strength: string;
  cost: number;
  retail: number;
}

interface Product {
  id: string;
  name: string;
  form: string;
  category: string;
  drugKey: string;
  goal: string;
  perUnit: boolean;
  fromRetail: number;
  variants: Variant[];
}

async function syncCatalogToStripe() {
  console.log('🚀 Syncing RE GEN catalog to Stripe...\n');
  console.log(`Found ${PRODUCTS.length} products in ${GOALS.length} categories\n`);

  let created = 0;
  let skipped = 0;
  let errors = 0;
  let pricesCreated = 0;

  // Group products by goal for logging
  const byGoal: Record<string, Product[]> = {};
  for (const product of PRODUCTS as Product[]) {
    if (!byGoal[product.goal]) byGoal[product.goal] = [];
    byGoal[product.goal].push(product);
  }

  for (const goal of Object.keys(byGoal)) {
    console.log(`\n📁 ${goal} (${byGoal[goal].length} products)`);
    console.log('─'.repeat(50));

    for (const product of byGoal[goal]) {
      try {
        // Check if product already exists by metadata
        const existingProducts = await stripe.products.search({
          query: `metadata["regen_id"]:"${product.id}"`,
        });

        if (existingProducts.data.length > 0) {
          console.log(`  ⏭️  ${product.name} (already exists)`);
          skipped++;
          continue;
        }

        // Create product with full metadata
        const stripeProduct = await stripe.products.create({
          name: product.name,
          description: `${product.form}${product.variants.length > 1 ? ` - ${product.variants.length} strengths available` : ` - ${product.variants[0]?.strength || ''}`}`,
          metadata: {
            source: 'regen',
            regen_id: product.id,
            goal: product.goal,
            category: product.category,
            form: product.form,
            drugKey: product.drugKey,
            perUnit: product.perUnit.toString(),
          },
        });

        // Create a price for each variant
        for (const variant of product.variants) {
          await stripe.prices.create({
            product: stripeProduct.id,
            unit_amount: Math.round(variant.retail * 100), // cents
            currency: 'usd',
            nickname: variant.strength,
            metadata: {
              source: 'regen',
              strength: variant.strength,
              cost: variant.cost.toString(),
            },
          });
          pricesCreated++;
        }

        const priceRange = product.variants.length > 1
          ? `$${Math.min(...product.variants.map(v => v.retail))} - $${Math.max(...product.variants.map(v => v.retail))}`
          : `$${product.variants[0]?.retail || 0}`;

        console.log(`  ✅ ${product.name} (${product.form}) → ${priceRange}`);
        created++;

        // Rate limit
        await new Promise(resolve => setTimeout(resolve, 150));

      } catch (error) {
        console.error(`  ❌ ${product.name}:`, error instanceof Error ? error.message : error);
        errors++;
      }
    }
  }

  console.log('\n' + '═'.repeat(50));
  console.log('📊 Summary:');
  console.log(`   Products created: ${created}`);
  console.log(`   Prices created: ${pricesCreated}`);
  console.log(`   Skipped (existing): ${skipped}`);
  console.log(`   Errors: ${errors}`);
  console.log(`   Total in catalog: ${PRODUCTS.length}`);
  console.log('═'.repeat(50));
}

syncCatalogToStripe().catch(console.error);
