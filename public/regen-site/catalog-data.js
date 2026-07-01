/**
 * RE GEN Storefront Catalog Data
 * Auto-generated from pharmacy bible - DO NOT EDIT MANUALLY
 * 
 * To update: Run `node scripts/build-regen-catalog.js`
 * Source: data/regen-best-prices.json
 */

window.REGEN_CATALOG = {
  shippingFlat: 30,
  markup: 2.5,
  discount90: 0.10,
  
  // Categories for the storefront
  categories: [
    { id: 'weight-loss', title: 'Weight Loss', tag: 'GLP-1 & metabolic', icon: '⚖', priceNote: 'from $87.50' },
    { id: 'daily-wellness', title: 'Daily Wellness', tag: 'Longevity, NAD+ & peptides', icon: '✦', priceNote: 'from $87.50' },
    { id: 'vitamin-injections', title: 'Vitamin Injections', tag: 'At-home wellness shots', icon: '✚', priceNote: 'from $72.75' },
    { id: 'hormones', title: 'Hormones', tag: 'TRT, HCG & bioidentical HRT', icon: '⚕', priceNote: 'from $55' },
    { id: 'sexual-health', title: 'Sexual Health', tag: 'ED, libido & intimacy', icon: '❤', priceNote: 'from $125' },
    { id: 'hair-skin', title: 'Hair & Skin', tag: 'Growth & rejuvenation', icon: '✨', priceNote: 'from $95' },
  ],

  // Products organized by storefront category
  products: {
    'weight-loss': [
      // Semaglutide
      { name: 'Compounded Semaglutide', mol: 'Semaglutide / B6', conc: '2.5mg', size: '1mL Vial', w: 35, form: 'injectable', badge: 'Most popular', cold: true },
      { name: 'Compounded Semaglutide', mol: 'Semaglutide / Glycine', conc: '4mg', size: '0.5mL Vial', w: 40, form: 'injectable' },
      { name: 'Compounded Semaglutide', mol: 'Semaglutide / Glycine', conc: '4mg', size: '1mL Vial (4mg)', w: 50, form: 'injectable' },
      { name: 'Compounded Semaglutide', mol: 'Semaglutide / Glycine', conc: '8mg', size: '2mL Vial', w: 70, form: 'injectable' },
      { name: 'Compounded Semaglutide', mol: 'Semaglutide / Glycine', conc: '16mg', size: '4mL Vial', w: 110, form: 'injectable', badge: 'High dose' },
      // Tirzepatide
      { name: 'Compounded Tirzepatide', mol: 'Tirzepatide / Glycine', conc: '10mg', size: '0.5mL Vial', w: 50, form: 'injectable', badge: 'Best results' },
      { name: 'Compounded Tirzepatide', mol: 'Tirzepatide / Glycine', conc: '10mg', size: '1mL Vial', w: 50, form: 'injectable' },
      { name: 'Compounded Tirzepatide', mol: 'Tirzepatide / Glycine', conc: '20mg', size: '1mL Vial', w: 90, form: 'injectable' },
      { name: 'Compounded Tirzepatide', mol: 'Tirzepatide / Glycine', conc: '40mg', size: '2mL Vial', w: 130, form: 'injectable' },
      { name: 'Compounded Tirzepatide', mol: 'Tirzepatide / Glycine', conc: '60mg', size: '3mL Vial', w: 150, form: 'injectable', badge: 'High dose' },
      // Lipo-Mino
      { name: 'Lipo-Mino Mix (MIC)', mol: 'B12 + lipotropic blend', conc: '', size: '30mL Vial', w: 80.5, form: 'injectable' },
      { name: 'Lipo-Mino Mix (MIC)', mol: 'B12 + lipotropic blend', conc: '', size: '10mL Vial', w: 36.8, form: 'injectable' },
    ],
    
    'daily-wellness': [
      // NAD+
      { name: 'NAD+ Injection', mol: 'Cellular energy & longevity', conc: '1mg/mL', size: '5mL Vial', w: 35, form: 'injectable', badge: 'Longevity', cold: true },
      { name: 'NAD+ Injection', mol: 'Cellular energy & longevity', conc: '50mg/mL', size: '10mL Vial', w: 45, form: 'injectable', cold: true },
      { name: 'NAD+ Injection', mol: 'Cellular energy & longevity', conc: '100mg/mL', size: '10mL Vial', w: 60, form: 'injectable' },
      { name: 'NADvantage Cream', mol: 'NAD+ face cream', conc: '', size: '30g Tube', w: 71, form: 'cream' },
      // Sermorelin
      { name: 'Sermorelin Injection', mol: 'GH-support peptide', conc: '1mg/mL', size: '6mL Vial', w: 38, form: 'injectable', cold: true },
      { name: 'Sermorelin Injection', mol: 'GH-support peptide', conc: '1.5mg/mL', size: '6mL Vial', w: 49, form: 'injectable', cold: true },
      { name: 'Sermorelin Injection', mol: 'GH-support peptide (2-pack)', conc: '1.5mg/mL', size: '12mL', w: 85, form: 'injectable', cold: true, badge: 'Value pack' },
      // BPC-157
      { name: 'BPC-157', mol: 'Tissue repair peptide', conc: '3mg/mL', size: '5mL Vial', w: 70, form: 'injectable' },
      // Tesamorelin
      { name: 'Tesamorelin', mol: 'Body composition peptide', conc: '', size: '5mL Vial', w: 70, form: 'injectable' },
      // CJC-1295/Ipamorelin
      { name: 'CJC-1295 / Ipamorelin', mol: 'GH-releasing combo', conc: '', size: '5mL Vial', w: 80, form: 'injectable' },
      // Glutathione
      { name: 'Glutathione Injection', mol: 'Master antioxidant', conc: '200mg/mL', size: '30mL Vial', w: 58, form: 'injectable' },
      { name: 'Glutathione Injection', mol: 'Master antioxidant', conc: '200mg/mL', size: '5mL Vial', w: 26.45, form: 'injectable' },
    ],
    
    'vitamin-injections': [
      { name: 'B12 Methylcobalamin', mol: 'Energy & metabolism', conc: '5mg/mL', size: '10mL Vial', w: 29.1, form: 'injectable', badge: 'Best seller' },
      { name: 'B12 Methylcobalamin', mol: 'Energy & metabolism', conc: '5mg/mL', size: '30mL Vial', w: 64.8, form: 'injectable' },
      { name: 'Vitamin D3 (IM)', mol: 'Immune support', conc: '50,000 IU/mL', size: '30mL Vial', w: 59.51, form: 'injectable' },
      { name: 'Biotin Injection', mol: 'Hair, skin & nails', conc: '0.5mg/mL', size: '10mL Vial', w: 33.06, form: 'injectable' },
      { name: 'Low Dose Naltrexone', mol: 'Immune & inflammation', conc: '1.5mg', size: '30 capsules', w: 27.5, form: 'capsule' },
      { name: 'Low Dose Naltrexone', mol: 'Immune & inflammation', conc: '4.5mg', size: '30 capsules', w: 27.5, form: 'capsule' },
    ],
    
    'hormones': [
      // Testosterone - Men
      { name: 'Testosterone Cypionate', mol: 'TRT injectable', conc: '200mg/mL', size: '5mL Vial', w: 22, form: 'injectable', controlled: true },
      { name: 'Testosterone Cypionate', mol: 'TRT injectable', conc: '200mg/mL', size: '10mL Vial', w: 40, form: 'injectable', controlled: true },
      { name: 'Testosterone Cream', mol: 'TRT topical', conc: '10%', size: '30g Tube', w: 35, form: 'cream', controlled: true },
      { name: 'Testosterone Cream', mol: 'TRT topical', conc: '20%', size: '30g Tube', w: 35, form: 'cream', controlled: true },
      { name: 'Test Cyp / Anastrozole', mol: 'TRT + estrogen control', conc: '200mg/1mg', size: '5mL Vial', w: 30, form: 'injectable', controlled: true },
      // Enclomiphene
      { name: 'Clomiphene', mol: 'T support / fertility', conc: '', size: '30 tablets', w: 45, form: 'capsule' },
      // Anastrozole
      { name: 'Anastrozole', mol: 'Estrogen management', conc: '1mg', size: '30 capsules', w: 39, form: 'capsule' },
      // Women's hormones
      { name: 'Estradiol RDT', mol: 'Bioidentical estrogen', conc: '1mg', size: '30 tablets', w: 30, form: 'rdt' },
      { name: 'Bi-Est 80/20 Cream', mol: 'Estriol / estradiol', conc: '', size: '30g Tube', w: 36, form: 'cream' },
      { name: 'Progesterone Cream', mol: 'Bioidentical progesterone', conc: '10%', size: '30g Tube', w: 41, form: 'cream' },
      { name: 'Progesterone Capsules', mol: 'Bioidentical progesterone', conc: '100mg', size: '30 capsules', w: 25.5, form: 'capsule' },
    ],
    
    'sexual-health': [
      // Men
      { name: 'Sildenafil RDT', mol: 'Rapid-dissolve ED tablet', conc: '110mg', size: '10 tablets', w: 50, form: 'rdt', badge: 'Men · best seller' },
      { name: 'Tadalafil RDT', mol: 'Rapid-dissolve ED tablet', conc: '20mg', size: '10 tablets', w: 50, form: 'rdt' },
      { name: 'MAXX PE', mol: 'Tadalafil / Oxytocin / PT-141', conc: 'Triple combo', size: '10 tablets', w: 60, form: 'rdt', badge: 'Performance' },
      { name: 'PT-141 Injection', mol: 'Arousal peptide', conc: '2mg/mL', size: '5mL Vial', w: 70, form: 'injectable' },
      // Women
      { name: 'Scream Cream', mol: 'Arginine / sildenafil topical', conc: '', size: '30g Tube', w: 50, form: 'cream', badge: 'Women' },
    ],
    
    'hair-skin': [
      { name: 'Minoxidil Oral', mol: 'Hair growth', conc: '0.25%', size: '30 capsules', w: 38, form: 'capsule', cold: true },
      { name: 'Minoxidil Oral', mol: 'Hair growth', conc: '0.5%', size: '30 capsules', w: 38, form: 'capsule', cold: true },
      { name: 'ManeTain Hair Spray', mol: 'Minoxidil 5% + actives', conc: '', size: 'Spray bottle', w: 69, form: 'spray' },
      { name: 'GHK-Cu Cream (Tighten)', mol: 'Skin tightening peptide', conc: '0.5%', size: '30g Tube', w: 50, form: 'cream' },
      { name: 'GHK-Cu Cream (Tighten Plus)', mol: 'Skin tightening peptide', conc: '2%', size: '30g Tube', w: 65, form: 'cream' },
      { name: 'GHK-Cu Cream (Tighten Max)', mol: 'Skin tightening peptide', conc: '4%', size: '30g Tube', w: 71, form: 'cream', badge: 'Max strength' },
    ],
  },
};

console.log('[RE GEN] Catalog loaded:', 
  Object.values(window.REGEN_CATALOG.products).flat().length, 'products');
