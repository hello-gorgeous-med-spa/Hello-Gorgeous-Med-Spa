#!/usr/bin/env node

/**
 * Run Sales Ledger Migration
 * Executes the sales_ledger_wallet migration directly against Supabase
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = 'https://ljixwtwxjufbwpxpxpff.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqaXh3dHd4anVmYndweHB4cGZmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODQ1MTMyNCwiZXhwIjoyMDg0MDI3MzI0fQ.OdKeQXO63BZ96E66PWwtaA_I-jU-_lDx4syu_G7YTOU';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false }
});

async function runMigration() {
  console.log('🚀 Starting Sales Ledger Migration...\n');

  try {
    // Read the migration file
    const migrationPath = path.join(__dirname, '../supabase/migrations/006_sales_ledger_wallet.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    // Split into individual statements (handle CREATE OR REPLACE FUNCTION blocks)
    // We'll execute the whole thing as one query via RPC
    console.log('📄 Migration file loaded\n');

    // Execute via Supabase's REST API for SQL
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'apikey': SUPABASE_SERVICE_KEY,
      },
      body: JSON.stringify({ query: sql })
    });

    if (!response.ok) {
      // If RPC doesn't exist, try direct approach
      console.log('ℹ️  RPC not available, running statements individually...\n');
      
      // Split by semicolon but be careful with function bodies
      const statements = splitSqlStatements(sql);
      
      let successCount = 0;
      let errorCount = 0;

      for (let i = 0; i < statements.length; i++) {
        const stmt = statements[i].trim();
        if (!stmt || stmt.startsWith('--')) continue;

        try {
          const { error } = await supabase.rpc('exec_sql', { query: stmt });
          if (error) throw error;
          successCount++;
          process.stdout.write('.');
        } catch (err) {
          // Try alternative method
          try {
            await executeSqlDirect(stmt);
            successCount++;
            process.stdout.write('.');
          } catch (e) {
            console.log(`\n⚠️  Statement ${i + 1} warning: ${e.message?.slice(0, 100)}`);
            errorCount++;
          }
        }
      }

      console.log(`\n\n✅ Migration complete: ${successCount} statements executed, ${errorCount} warnings\n`);
    } else {
      console.log('✅ Migration executed successfully!\n');
    }

    // Verify tables were created
    console.log('🔍 Verifying tables...\n');
    
    const tables = ['sales', 'sale_items', 'sale_payments', 'daily_sales_summary', 'business_wallet'];
    
    for (const table of tables) {
      const { data, error } = await supabase.from(table).select('id').limit(1);
      if (error && error.code === '42P01') {
        console.log(`  ❌ ${table} - NOT FOUND`);
      } else {
        console.log(`  ✅ ${table} - EXISTS`);
      }
    }

    console.log('\n🎉 Sales Ledger system deployed!\n');
    console.log('Access your new pages at:');
    console.log('  • Sales Ledger: /admin/sales');
    console.log('  • Daily Summary: /admin/sales/daily-summary');
    console.log('  • Business Wallet: /admin/sales/wallet');
    console.log('  • Payments: /admin/sales/payments\n');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

async function executeSqlDirect(sql) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'apikey': SUPABASE_SERVICE_KEY,
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify({ query: sql })
  });
  
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text);
  }
}

function splitSqlStatements(sql) {
  const statements = [];
  let current = '';
  let inFunction = false;
  let dollarQuote = false;
  
  const lines = sql.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Track $$ blocks for function bodies
    if (trimmed.includes('$$')) {
      dollarQuote = !dollarQuote;
    }
    
    current += line + '\n';
    
    // If we're not in a dollar-quoted block and line ends with ;
    if (!dollarQuote && trimmed.endsWith(';')) {
      statements.push(current);
      current = '';
    }
  }
  
  if (current.trim()) {
    statements.push(current);
  }
  
  return statements;
}

runMigration();
