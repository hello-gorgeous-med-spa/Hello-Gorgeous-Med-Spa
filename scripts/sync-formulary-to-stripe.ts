/**
 * Sync BoomRx Master Formulary to Stripe Products
 * 
 * Usage: npx tsx scripts/sync-formulary-to-stripe.ts
 * 
 * Creates Stripe Products and Prices for Re Gen RX catalog.
 * Applies markup: wholesale × 2.5 (minimum $25 for low-cost items)
 */

import Stripe from 'stripe';

const STRIPE_SECRET = process.env.REGEN_STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY;

if (!STRIPE_SECRET) {
  console.error('Missing STRIPE_SECRET_KEY');
  process.exit(1);
}

const stripe = new Stripe(STRIPE_SECRET, { apiVersion: '2024-06-20' });

// Markup: wholesale × 2.5, minimum $25 for items under $10 wholesale
function calculateRetailPrice(wholesale: number): number {
  const retail = wholesale * 2.5;
  return Math.max(retail, 25); // Minimum $25 retail
}

// Product categories for organization
type Category = 
  | 'GLP-1 Weight Loss'
  | 'Peptides - Recovery'
  | 'Peptides - Growth'
  | 'Peptides - Longevity'
  | 'Peptides - Cognitive'
  | 'Peptides - Intimacy'
  | 'Hormones - Women'
  | 'Hormones - Men'
  | 'Hormones - Thyroid'
  | 'Sexual Health - Men'
  | 'Sexual Health - Women'
  | 'Hair & Skin'
  | 'Vitamins & Injectables'
  | 'Supplies'
  | 'Other';

interface FormularyItem {
  name: string;
  form: string;
  strength: string;
  wholesale: number;
  vendor: string;
  category: Category;
}

// Parsed formulary data (key items for Re Gen)
const FORMULARY: FormularyItem[] = [
  // ========== GLP-1 WEIGHT LOSS ==========
  { name: 'Semaglutide 1mg Injectable', form: 'Injectable', strength: '1mg', wholesale: 40, vendor: 'DRX', category: 'GLP-1 Weight Loss' },
  { name: 'Semaglutide 2mg Injectable', form: 'Injectable', strength: '2mg', wholesale: 55, vendor: 'DRX', category: 'GLP-1 Weight Loss' },
  { name: 'Semaglutide 4mg Injectable', form: 'Injectable', strength: '4mg', wholesale: 60, vendor: 'DRX', category: 'GLP-1 Weight Loss' },
  { name: 'Semaglutide 5mg Injectable', form: 'Injectable', strength: '5mg', wholesale: 70, vendor: 'EMD', category: 'GLP-1 Weight Loss' },
  { name: 'Semaglutide 7.5mg Injectable', form: 'Injectable', strength: '7.5mg', wholesale: 90, vendor: 'EMD', category: 'GLP-1 Weight Loss' },
  { name: 'Semaglutide 10mg Injectable', form: 'Injectable', strength: '10mg', wholesale: 105, vendor: 'DRX', category: 'GLP-1 Weight Loss' },
  { name: 'Semaglutide 12.5mg Injectable', form: 'Injectable', strength: '12.5mg', wholesale: 155, vendor: 'V', category: 'GLP-1 Weight Loss' },
  { name: 'Semaglutide ODT 2mg (30 day)', form: 'ODT', strength: '2mg', wholesale: 98, vendor: 'V', category: 'GLP-1 Weight Loss' },
  { name: 'Semaglutide ODT 4mg (30 day)', form: 'ODT', strength: '4mg', wholesale: 140, vendor: 'V', category: 'GLP-1 Weight Loss' },
  { name: 'Semaglutide ODT 6mg (30 day)', form: 'ODT', strength: '6mg', wholesale: 170, vendor: 'V', category: 'GLP-1 Weight Loss' },
  { name: 'Semaglutide ODT 8mg (30 day)', form: 'ODT', strength: '8mg', wholesale: 200, vendor: 'V', category: 'GLP-1 Weight Loss' },
  { name: 'Semaglutide Sublingual 2mg (30 ampules)', form: 'Sublingual', strength: '2mg', wholesale: 90, vendor: 'ABC', category: 'GLP-1 Weight Loss' },
  { name: 'Semaglutide Sublingual 4mg (30 ampules)', form: 'Sublingual', strength: '4mg', wholesale: 110, vendor: 'ABC', category: 'GLP-1 Weight Loss' },
  
  { name: 'Tirzepatide 10mg Injectable', form: 'Injectable', strength: '10mg', wholesale: 75, vendor: 'DRX', category: 'GLP-1 Weight Loss' },
  { name: 'Tirzepatide 17mg Injectable', form: 'Injectable', strength: '17mg', wholesale: 100, vendor: 'V', category: 'GLP-1 Weight Loss' },
  { name: 'Tirzepatide 20mg Injectable', form: 'Injectable', strength: '20mg', wholesale: 100, vendor: 'DRX', category: 'GLP-1 Weight Loss' },
  { name: 'Tirzepatide 30mg Injectable', form: 'Injectable', strength: '30mg', wholesale: 135, vendor: 'DRX', category: 'GLP-1 Weight Loss' },
  { name: 'Tirzepatide 34mg Injectable', form: 'Injectable', strength: '34mg', wholesale: 137, vendor: 'V', category: 'GLP-1 Weight Loss' },
  { name: 'Tirzepatide 40mg Injectable', form: 'Injectable', strength: '40mg', wholesale: 150, vendor: 'DRX', category: 'GLP-1 Weight Loss' },
  { name: 'Tirzepatide 50mg Injectable', form: 'Injectable', strength: '50mg', wholesale: 170, vendor: 'DRX', category: 'GLP-1 Weight Loss' },
  { name: 'Tirzepatide 51mg Injectable', form: 'Injectable', strength: '51mg', wholesale: 170, vendor: 'V', category: 'GLP-1 Weight Loss' },
  { name: 'Tirzepatide 60mg Injectable', form: 'Injectable', strength: '60mg', wholesale: 185, vendor: 'DRX', category: 'GLP-1 Weight Loss' },
  { name: 'Tirzepatide 68mg Injectable', form: 'Injectable', strength: '68mg', wholesale: 190, vendor: 'V', category: 'GLP-1 Weight Loss' },
  { name: 'Tirzepatide ODT 5mg (30 day)', form: 'ODT', strength: '5mg', wholesale: 165, vendor: 'V', category: 'GLP-1 Weight Loss' },
  { name: 'Tirzepatide ODT 7.5mg (30 day)', form: 'ODT', strength: '7.5mg', wholesale: 185, vendor: 'V', category: 'GLP-1 Weight Loss' },
  { name: 'Tirzepatide ODT 10mg (30 day)', form: 'ODT', strength: '10mg', wholesale: 205, vendor: 'V', category: 'GLP-1 Weight Loss' },
  { name: 'Tirzepatide ODT 12mg (30 day)', form: 'ODT', strength: '12mg', wholesale: 225, vendor: 'V', category: 'GLP-1 Weight Loss' },
  
  // ========== PEPTIDES - RECOVERY ==========
  { name: 'BPC-157 Injectable 15mg vial', form: 'Injectable', strength: '3mg/mL 5mL', wholesale: 120, vendor: 'DRX', category: 'Peptides - Recovery' },
  { name: 'TB-500 Injectable 15mg vial', form: 'Injectable', strength: '3mg/mL 5mL', wholesale: 120, vendor: 'DRX', category: 'Peptides - Recovery' },
  { name: 'BPC-157 / TB-500 Blend Injectable', form: 'Injectable', strength: '3mg/3mg 5mL', wholesale: 150, vendor: 'DRX', category: 'Peptides - Recovery' },
  { name: 'BPC-157 / TB-500 / GHK-Cu Blend', form: 'Injectable', strength: '3mg/3mg/10mg 5mL', wholesale: 150, vendor: 'DRX', category: 'Peptides - Recovery' },
  { name: 'BPC-157 / KPV / TB-500 Blend', form: 'Injectable', strength: '3mg/3mg/3mg 5mL', wholesale: 150, vendor: 'DRX', category: 'Peptides - Recovery' },
  { name: 'BPC-157 Oral Capsules', form: 'Capsule', strength: '500mcg', wholesale: 2, vendor: 'V', category: 'Peptides - Recovery' },
  { name: 'Pentadeca Arginate Injectable', form: 'Injectable', strength: '3mg/mL 5mL', wholesale: 120, vendor: 'V', category: 'Peptides - Recovery' },
  { name: 'LL-37 Injectable', form: 'Injectable', strength: '2mg/mL 5mL', wholesale: 120, vendor: 'DRX', category: 'Peptides - Recovery' },
  
  // ========== PEPTIDES - GROWTH ==========
  { name: 'Sermorelin Injectable 15mg vial', form: 'Injectable', strength: '3mg/mL 5mL', wholesale: 90, vendor: 'V', category: 'Peptides - Growth' },
  { name: 'Sermorelin / Ipamorelin Blend', form: 'Injectable', strength: '3mg/2mg 5mL', wholesale: 120, vendor: 'DRX', category: 'Peptides - Growth' },
  { name: 'CJC-1295 / Ipamorelin Blend', form: 'Injectable', strength: '1.2mg/2mg 5mL', wholesale: 150, vendor: 'DRX', category: 'Peptides - Growth' },
  { name: 'Tesamorelin Injectable 15mg vial', form: 'Injectable', strength: '3mg/mL 5mL', wholesale: 120, vendor: 'DRX', category: 'Peptides - Growth' },
  { name: 'Tesamorelin / Ipamorelin Blend', form: 'Injectable', strength: '3mg/2mg 5mL', wholesale: 150, vendor: 'DRX', category: 'Peptides - Growth' },
  { name: 'IGF-LR3 Injectable', form: 'Injectable', strength: '200mcg/mL 5mL', wholesale: 120, vendor: 'DRX', category: 'Peptides - Growth' },
  { name: 'Sermorelin Troche 500mcg', form: 'Troche', strength: '500mcg', wholesale: 1.5, vendor: 'V', category: 'Peptides - Growth' },
  { name: 'Sermorelin Troche 1000mcg', form: 'Troche', strength: '1000mcg', wholesale: 3.25, vendor: 'V', category: 'Peptides - Growth' },
  
  // ========== PEPTIDES - LONGEVITY ==========
  { name: 'NAD+ Injectable 500mg vial', form: 'Injectable', strength: '100mg/mL 5mL', wholesale: 90, vendor: 'V', category: 'Peptides - Longevity' },
  { name: 'NAD+ Injectable 1000mg vial', form: 'Injectable', strength: '100mg/mL 10mL', wholesale: 90, vendor: 'DRX', category: 'Peptides - Longevity' },
  { name: 'Glutathione Injectable 200mg/mL', form: 'Injectable', strength: '200mg/mL 10mL', wholesale: 40, vendor: 'DRX', category: 'Peptides - Longevity' },
  { name: 'Epithalon Injectable', form: 'Injectable', strength: '2mg/mL 5mL', wholesale: 120, vendor: 'DRX', category: 'Peptides - Longevity' },
  { name: 'GHK-Cu Injectable', form: 'Injectable', strength: '10mg/mL 5mL', wholesale: 120, vendor: 'DRX', category: 'Peptides - Longevity' },
  { name: 'MOTS-c Injectable', form: 'Injectable', strength: '2mg/mL 5mL', wholesale: 120, vendor: 'DRX', category: 'Peptides - Longevity' },
  { name: 'MOTS-c / Tesamorelin Blend', form: 'Injectable', strength: '2mg/3mg 5mL', wholesale: 150, vendor: 'DRX', category: 'Peptides - Longevity' },
  { name: 'SS-31 Injectable', form: 'Injectable', strength: '2mg/mL 5mL', wholesale: 120, vendor: 'DRX', category: 'Peptides - Longevity' },
  { name: 'Thymosin Alpha-1 Injectable', form: 'Injectable', strength: '5mg/mL 5mL', wholesale: 120, vendor: 'DRX', category: 'Peptides - Longevity' },
  { name: 'Methylene Blue Capsules 25mg', form: 'Capsule', strength: '25mg', wholesale: 2.5, vendor: 'V', category: 'Peptides - Longevity' },
  { name: 'Methylene Blue Capsules 50mg', form: 'Capsule', strength: '50mg', wholesale: 4, vendor: 'V', category: 'Peptides - Longevity' },
  
  // ========== PEPTIDES - COGNITIVE ==========
  { name: 'DSIP Injectable', form: 'Injectable', strength: '1mg/mL 5mL', wholesale: 120, vendor: 'DRX', category: 'Peptides - Cognitive' },
  { name: 'Semax / Selank Blend', form: 'Injectable', strength: '1mg/1mg 5mL', wholesale: 150, vendor: 'DRX', category: 'Peptides - Cognitive' },
  { name: 'Pinealon / PE-22-28 / Selank Blend', form: 'Injectable', strength: '2mg/2mg 5mL', wholesale: 150, vendor: 'DRX', category: 'Peptides - Cognitive' },
  { name: 'Kisspeptin Injectable', form: 'Injectable', strength: '1mg/mL 5mL', wholesale: 120, vendor: 'DRX', category: 'Peptides - Cognitive' },
  
  // ========== PEPTIDES - INTIMACY ==========
  { name: 'PT-141 Injectable', form: 'Injectable', strength: '2mg/mL 5mL', wholesale: 120, vendor: 'DRX', category: 'Peptides - Intimacy' },
  { name: 'Oxytocin Nasal Spray', form: 'Nasal Spray', strength: '20 IU/spray 15mL', wholesale: 130, vendor: 'BDX', category: 'Peptides - Intimacy' },
  { name: 'Oxytocin Troche 300 IU', form: 'Troche', strength: '300 IU', wholesale: 2.5, vendor: 'V', category: 'Peptides - Intimacy' },
  { name: 'Melanotan II Injectable', form: 'Injectable', strength: '2mg/mL 5mL', wholesale: 120, vendor: 'DRX', category: 'Peptides - Intimacy' },
  
  // ========== HORMONES - WOMEN ==========
  { name: 'BIEST 20:80 Cream (Topi-Click)', form: 'Cream', strength: '1mg/mL 30mL', wholesale: 30, vendor: 'V', category: 'Hormones - Women' },
  { name: 'BIEST 50:50 Cream (Topi-Click)', form: 'Cream', strength: '1mg/mL 30mL', wholesale: 30, vendor: 'V', category: 'Hormones - Women' },
  { name: 'Progesterone Cream (Topi-Click)', form: 'Cream', strength: '100mg/mL 30mL', wholesale: 30, vendor: 'V', category: 'Hormones - Women' },
  { name: 'Progesterone IR Capsule 100mg', form: 'Capsule', strength: '100mg', wholesale: 1, vendor: 'V', category: 'Hormones - Women' },
  { name: 'Progesterone IR Capsule 200mg', form: 'Capsule', strength: '200mg', wholesale: 1, vendor: 'V', category: 'Hormones - Women' },
  { name: 'Estradiol Cream (Topi-Click)', form: 'Cream', strength: '2mg/mL 30mL', wholesale: 30, vendor: 'V', category: 'Hormones - Women' },
  { name: 'Estradiol Vaginal Cream', form: 'Vaginal Cream', strength: '0.1mg/mL 30mL', wholesale: 30, vendor: 'V', category: 'Hormones - Women' },
  { name: 'Estradiol Patch (4 pack)', form: 'Patch', strength: '0.05mg/24hr', wholesale: 150, vendor: 'V', category: 'Hormones - Women' },
  { name: 'Estriol Cream (Topi-Click)', form: 'Cream', strength: '1mg/mL 30mL', wholesale: 30, vendor: 'V', category: 'Hormones - Women' },
  { name: 'DHEA SR Capsule 25mg', form: 'Capsule', strength: '25mg', wholesale: 1.1, vendor: 'V', category: 'Hormones - Women' },
  { name: 'Pregnenolone IR Capsule 25mg', form: 'Capsule', strength: '25mg', wholesale: 1, vendor: 'V', category: 'Hormones - Women' },
  
  // ========== HORMONES - MEN ==========
  { name: 'Testosterone Cypionate Injectable 200mg/mL', form: 'Injectable', strength: '200mg/mL 10mL', wholesale: 70, vendor: 'V', category: 'Hormones - Men' },
  { name: 'Testosterone Cypionate Injectable MCT', form: 'Injectable', strength: '200mg/mL 5mL', wholesale: 17.5, vendor: 'V', category: 'Hormones - Men' },
  { name: 'Testosterone Cream (Topi-Click)', form: 'Cream', strength: '200mg/mL 30mL', wholesale: 30, vendor: 'V', category: 'Hormones - Men' },
  { name: 'Testosterone Cream (Atrevis)', form: 'Cream', strength: '100mg/mL 30mL', wholesale: 30, vendor: 'V', category: 'Hormones - Men' },
  { name: 'Enclomiphene Citrate Capsule 25mg', form: 'Capsule', strength: '25mg', wholesale: 1.5, vendor: 'V', category: 'Hormones - Men' },
  { name: 'Enclomiphene Citrate Capsule 50mg', form: 'Capsule', strength: '50mg', wholesale: 2, vendor: 'V', category: 'Hormones - Men' },
  { name: 'Anastrozole SR Capsule 0.5mg', form: 'Capsule', strength: '0.5mg', wholesale: 1, vendor: 'V', category: 'Hormones - Men' },
  { name: 'Anastrozole SR Capsule 1mg', form: 'Capsule', strength: '1mg', wholesale: 1.2, vendor: 'V', category: 'Hormones - Men' },
  { name: 'Gonadorelin Injectable', form: 'Injectable', strength: '1mg/mL 5mL', wholesale: 50, vendor: 'V', category: 'Hormones - Men' },
  { name: 'HCG Injectable 10,000 IU', form: 'Injectable', strength: '10,000 IU', wholesale: 210, vendor: 'V', category: 'Hormones - Men' },
  { name: 'Nandrolone Decanoate Injectable', form: 'Injectable', strength: '200mg/mL 5mL', wholesale: 75, vendor: 'V', category: 'Hormones - Men' },
  
  // ========== HORMONES - THYROID ==========
  { name: 'Liothyronine (T3) SR 12mcg', form: 'Capsule', strength: '12mcg', wholesale: 1.2, vendor: 'V', category: 'Hormones - Thyroid' },
  { name: 'Liothyronine (T3) SR 22mcg', form: 'Capsule', strength: '22mcg', wholesale: 1.2, vendor: 'V', category: 'Hormones - Thyroid' },
  { name: 'Thyroxine (T4) SR 50mcg', form: 'Capsule', strength: '50mcg', wholesale: 1, vendor: 'V', category: 'Hormones - Thyroid' },
  { name: 'T3/T4 Combination 9mcg/38mcg', form: 'Capsule', strength: '9mcg/38mcg', wholesale: 1.2, vendor: 'V', category: 'Hormones - Thyroid' },
  { name: 'Armour Thyroid 60mg', form: 'Tablet', strength: '60mg', wholesale: 2.9, vendor: 'V', category: 'Hormones - Thyroid' },
  
  // ========== SEXUAL HEALTH - MEN ==========
  { name: 'Sildenafil Tablet 100mg', form: 'Tablet', strength: '100mg', wholesale: 2.75, vendor: 'V', category: 'Sexual Health - Men' },
  { name: 'Tadalafil Tablet 20mg', form: 'Tablet', strength: '20mg', wholesale: 2, vendor: 'V', category: 'Sexual Health - Men' },
  { name: 'Sildenafil/Tadalafil Troche', form: 'Troche', strength: '120mg/22mg', wholesale: 2.75, vendor: 'V', category: 'Sexual Health - Men' },
  { name: 'Vardenafil Capsule 20mg', form: 'Capsule', strength: '20mg', wholesale: 1.4, vendor: 'V', category: 'Sexual Health - Men' },
  { name: 'Tri-Mix Injectable', form: 'Injectable', strength: '30mg/1mg/20mcg 1mL', wholesale: 115, vendor: 'BDX', category: 'Sexual Health - Men' },
  { name: 'Quad-Mix Injectable', form: 'Injectable', strength: '5mL vial', wholesale: 200, vendor: 'BDX', category: 'Sexual Health - Men' },
  { name: 'Apomorphine/Sildenafil/Tadalafil/Vardenafil Troche', form: 'Troche', strength: 'Combo', wholesale: 4, vendor: 'V', category: 'Sexual Health - Men' },
  
  // ========== SEXUAL HEALTH - WOMEN ==========
  { name: 'Ecstasy Cream for Her', form: 'Cream', strength: '10g tube', wholesale: 100, vendor: 'EMD', category: 'Sexual Health - Women' },
  { name: 'Climax Cream', form: 'Cream', strength: '30mL tube', wholesale: 80, vendor: 'V', category: 'Sexual Health - Women' },
  { name: 'Female Desire Troche', form: 'Troche', strength: 'Apomorphine/Bremelanotide/Oxytocin', wholesale: 2, vendor: 'V', category: 'Sexual Health - Women' },
  
  // ========== HAIR & SKIN ==========
  { name: 'Finasteride/Minoxidil Solution', form: 'Solution', strength: '0.25/12% 30mL', wholesale: 30, vendor: 'V', category: 'Hair & Skin' },
  { name: 'Finasteride/Minoxidil Foam', form: 'Foam', strength: '0.25mg/5mg 30mL', wholesale: 30, vendor: 'V', category: 'Hair & Skin' },
  { name: 'Dutasteride/Minoxidil/Tretinoin Solution', form: 'Solution', strength: '30mL', wholesale: 120, vendor: 'V', category: 'Hair & Skin' },
  { name: 'Finasteride Capsule 1mg', form: 'Capsule', strength: '1mg', wholesale: 1.5, vendor: 'V', category: 'Hair & Skin' },
  { name: 'Dutasteride SR Capsule 0.5mg', form: 'Capsule', strength: '0.5mg', wholesale: 2.1, vendor: 'V', category: 'Hair & Skin' },
  { name: 'Biotin/Minoxidil Capsule', form: 'Capsule', strength: '5mg/3mg', wholesale: 2, vendor: 'V', category: 'Hair & Skin' },
  { name: 'Tretinoin Cream 0.025%', form: 'Cream', strength: '0.025% 30mL', wholesale: 40, vendor: 'V', category: 'Hair & Skin' },
  { name: 'Tretinoin Cream 0.05%', form: 'Cream', strength: '0.05% 30mL', wholesale: 60, vendor: 'V', category: 'Hair & Skin' },
  { name: 'Hydroquinone Cream 6%', form: 'Cream', strength: '6% 30mL', wholesale: 60, vendor: 'V', category: 'Hair & Skin' },
  { name: 'GHK-Cu Cosmetic Cream', form: 'Cream', strength: '0.5% 30mL', wholesale: 100, vendor: 'V', category: 'Hair & Skin' },
  { name: 'Clarity Cream (Azelaic/Niacinamide/Clindamycin/Tretinoin)', form: 'Cream', strength: '30g', wholesale: 100, vendor: 'EMD', category: 'Hair & Skin' },
  { name: 'ClearTone Cream', form: 'Cream', strength: '30g', wholesale: 100, vendor: 'EMD', category: 'Hair & Skin' },
  
  // ========== VITAMINS & INJECTABLES ==========
  { name: 'Cyanocobalamin (B12) Injectable', form: 'Injectable', strength: '1000mcg/mL 30mL', wholesale: 48, vendor: 'V', category: 'Vitamins & Injectables' },
  { name: 'Methylcobalamin (B12) Injectable', form: 'Injectable', strength: '1mg/mL 10mL', wholesale: 20, vendor: 'V', category: 'Vitamins & Injectables' },
  { name: 'Lipo-B Injectable', form: 'Injectable', strength: '10mL vial', wholesale: 50, vendor: 'DRX', category: 'Vitamins & Injectables' },
  { name: 'Lipo-C Injectable', form: 'Injectable', strength: '10mL vial', wholesale: 50, vendor: 'DRX', category: 'Vitamins & Injectables' },
  { name: 'MIC/B12 Injectable', form: 'Injectable', strength: '10mL vial', wholesale: 25, vendor: 'V', category: 'Vitamins & Injectables' },
  { name: 'Vitamin D3 Capsule 5000 IU', form: 'Capsule', strength: '5000 IU', wholesale: 0.5, vendor: 'V', category: 'Vitamins & Injectables' },
  { name: 'Vitamin D3/K2 Capsule', form: 'Capsule', strength: '10000 IU/180mcg', wholesale: 0.6, vendor: 'V', category: 'Vitamins & Injectables' },
  { name: 'CoQ-10 Capsule 100mg', form: 'Capsule', strength: '100mg', wholesale: 2, vendor: 'V', category: 'Vitamins & Injectables' },
  { name: 'Glutathione Capsule 100mg', form: 'Capsule', strength: '100mg', wholesale: 1.2, vendor: 'V', category: 'Vitamins & Injectables' },
  
  // ========== OTHER ==========
  { name: 'LDN (Naltrexone) 4.5mg', form: 'Capsule', strength: '4.5mg', wholesale: 0.9, vendor: 'V', category: 'Other' },
  { name: 'Metformin 500mg', form: 'Tablet', strength: '500mg', wholesale: 0.8, vendor: 'V', category: 'Other' },
  { name: 'Metformin 1000mg', form: 'Tablet', strength: '1000mg', wholesale: 1.75, vendor: 'V', category: 'Other' },
  { name: 'Phentermine 37.5mg', form: 'Tablet', strength: '37.5mg', wholesale: 0.9, vendor: 'V', category: 'Other' },
  { name: 'Topiramate 25mg', form: 'Tablet', strength: '25mg', wholesale: 1, vendor: 'V', category: 'Other' },
  { name: 'Ketamine ODT 100mg', form: 'ODT', strength: '100mg', wholesale: 2.75, vendor: 'V', category: 'Other' },
  { name: 'Ondansetron (Zofran) 4mg', form: 'Tablet', strength: '4mg', wholesale: 0.6, vendor: 'V', category: 'Other' },
  
  // ========== SUPPLIES ==========
  { name: 'Bacteriostatic Water 30mL', form: 'Solution', strength: '30mL', wholesale: 10, vendor: 'V', category: 'Supplies' },
  { name: 'IM Injection Kit (5 pack)', form: 'Kit', strength: '5 pack', wholesale: 5, vendor: 'V', category: 'Supplies' },
  { name: 'IM Injection Kit (10 pack)', form: 'Kit', strength: '10 pack', wholesale: 10, vendor: 'V', category: 'Supplies' },
  { name: 'Topi-Click Perl Device', form: 'Device', strength: '1 unit', wholesale: 4, vendor: 'V', category: 'Supplies' },
];

async function syncToStripe() {
  console.log('🚀 Syncing formulary to Stripe...\n');
  
  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (const item of FORMULARY) {
    const retailPrice = calculateRetailPrice(item.wholesale);
    
    try {
      // Check if product already exists
      const existingProducts = await stripe.products.search({
        query: `name:"${item.name}"`,
      });

      if (existingProducts.data.length > 0) {
        console.log(`⏭️  Skip: ${item.name} (already exists)`);
        skipped++;
        continue;
      }

      // Create product
      const product = await stripe.products.create({
        name: item.name,
        description: `${item.form} - ${item.strength}`,
        metadata: {
          source: 'regen',
          category: item.category,
          form: item.form,
          strength: item.strength,
          vendor: item.vendor,
          wholesale: item.wholesale.toString(),
        },
      });

      // Create price
      await stripe.prices.create({
        product: product.id,
        unit_amount: Math.round(retailPrice * 100),
        currency: 'usd',
        metadata: {
          source: 'regen',
        },
      });

      console.log(`✅ Created: ${item.name} → $${retailPrice.toFixed(2)} (wholesale $${item.wholesale})`);
      created++;

      // Rate limit: Stripe allows 100 requests/sec, but let's be conservative
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error(`❌ Error: ${item.name}`, error instanceof Error ? error.message : error);
      errors++;
    }
  }

  console.log('\n📊 Summary:');
  console.log(`   Created: ${created}`);
  console.log(`   Skipped: ${skipped}`);
  console.log(`   Errors: ${errors}`);
  console.log(`   Total: ${FORMULARY.length}`);
}

syncToStripe().catch(console.error);
