import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

interface Product {
  sku: string;
  product: string;
  strength: string;
  category: string;
  patient_price: number;
}

let catalogCache: Product[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

async function loadCatalog(): Promise<Product[]> {
  // Return cached if valid
  if (catalogCache && Date.now() - cacheTimestamp < CACHE_TTL) {
    return catalogCache;
  }

  try {
    const csvPath = path.join(process.cwd(), 'data', 'formulation-rx-catalog.csv');
    const csvContent = await fs.readFile(csvPath, 'utf-8');
    
    const lines = csvContent.split('\n');
    const products: Product[] = [];
    
    // Skip header
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      // Parse CSV (handle quoted fields)
      const fields = parseCSVLine(line);
      if (fields.length >= 5) {
        const [sku, product, strength, category, price] = fields;
        const parsedPrice = parseFloat(price);
        
        if (sku && product && !isNaN(parsedPrice)) {
          products.push({
            sku: sku.trim(),
            product: product.trim(),
            strength: strength.trim(),
            category: cleanCategory(category.trim()),
            patient_price: parsedPrice,
          });
        }
      }
    }
    
    catalogCache = products;
    cacheTimestamp = Date.now();
    
    return products;
  } catch (error) {
    console.error('Failed to load catalog:', error);
    return [];
  }
}

function parseCSVLine(line: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      fields.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  fields.push(current);
  
  return fields;
}

function cleanCategory(category: string): string {
  // Clean up malformed categories from CSV parsing
  const validCategories = [
    'Anti-Aging',
    'Antiemetic',
    'Dental',
    'Dermatology',
    'Hair Loss',
    'Hormone Therapy',
    'Injectable Nutrients',
    'IV Therapy',
    'Lipotropic/Vitamin',
    'Oral Sprays',
    'Pain Management',
    'Peptide',
    'Retail Generic',
    'Sexual Health',
    'Supplies',
    'Weight Management',
    'Wellness',
  ];
  
  const found = validCategories.find(c => 
    category.toLowerCase().includes(c.toLowerCase())
  );
  
  return found || 'Other';
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.toLowerCase() || '';
    const category = searchParams.get('category') || '';
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    const allProducts = await loadCatalog();
    
    // Filter
    let filtered = allProducts;
    
    if (search) {
      filtered = filtered.filter(p => 
        p.product.toLowerCase().includes(search) ||
        p.strength.toLowerCase().includes(search) ||
        p.sku.toLowerCase().includes(search)
      );
    }
    
    if (category && category !== 'All Categories') {
      filtered = filtered.filter(p => p.category === category);
    }
    
    // Get unique categories
    const categories = [...new Set(allProducts.map(p => p.category))].sort();
    
    // Paginate
    const paginated = filtered.slice(offset, offset + limit);
    
    return NextResponse.json({
      products: paginated,
      total: filtered.length,
      categories,
      catalogTotal: allProducts.length,
    });
  } catch (error) {
    console.error('Catalog API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch catalog' },
      { status: 500 }
    );
  }
}
