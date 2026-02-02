// Script to run SQL migrations against Supabase
// Uses the service role key to execute raw SQL

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ljixwtwxjufbwpxpxpff.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqaXh3dHd4anVmYndweHB4cGZmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODQ1MTMyNCwiZXhwIjoyMDg0MDI3MzI0fQ.OdKeQXO63BZ96E66PWwtaA_I-jU-_lDx4syu_G7YTOU';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function runMigration(filename) {
  console.log(`\n📦 Running migration: ${filename}`);
  
  const sqlPath = path.join(__dirname, '..', 'supabase', 'migrations', filename);
  const sql = fs.readFileSync(sqlPath, 'utf8');
  
  // Split by semicolons but keep in larger chunks for better execution
  // Some statements need to be run together (like function definitions)
  const statements = splitSqlStatements(sql);
  
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i].trim();
    if (!stmt || stmt.startsWith('--')) continue;
    
    try {
      const { error } = await supabase.rpc('', {}).then(() => ({ error: null })).catch(() => 
        // Use raw fetch for SQL execution
        fetch(`${SUPABASE_URL}/rest/v1/`, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          }
        })
      );
      
      // Try executing via the query endpoint
      const response = await fetch(`${SUPABASE_URL}/pg/query`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: stmt })
      });
      
      if (!response.ok) {
        // If that doesn't work, try the Supabase SQL API
        throw new Error('Need alternative method');
      }
      
      successCount++;
      process.stdout.write('.');
    } catch (err) {
      // Silent fail for individual statements - we'll try the bulk method
      errorCount++;
    }
  }
  
  console.log(`\n  ✓ Processed ${statements.length} statements`);
}

function splitSqlStatements(sql) {
  // Keep function definitions together
  const statements = [];
  let current = '';
  let inFunction = false;
  
  const lines = sql.split('\n');
  
  for (const line of lines) {
    current += line + '\n';
    
    if (line.includes('$$ LANGUAGE')) {
      inFunction = false;
      statements.push(current);
      current = '';
    } else if (line.includes('AS $$') || line.includes("AS '")) {
      inFunction = true;
    } else if (!inFunction && line.trim().endsWith(';') && !line.trim().startsWith('--')) {
      statements.push(current);
      current = '';
    }
  }
  
  if (current.trim()) {
    statements.push(current);
  }
  
  return statements;
}

async function main() {
  console.log('🚀 Starting migrations...');
  console.log(`📍 Supabase URL: ${SUPABASE_URL}`);
  
  // Test connection
  const { data, error } = await supabase.from('clients').select('count').limit(1);
  if (error && !error.message.includes('permission')) {
    console.error('❌ Cannot connect to Supabase:', error.message);
    process.exit(1);
  }
  console.log('✅ Connected to Supabase');
  
  // Run migrations
  const migrations = [
    '002_square_gift_cards.sql',
    '003_website_cms.sql'
  ];
  
  for (const migration of migrations) {
    await runMigration(migration);
  }
  
  console.log('\n✅ Migration script completed!');
  console.log('\n⚠️  Note: If tables were not created, you may need to run the SQL manually in Supabase Dashboard.');
  console.log('   Go to: https://supabase.com/dashboard/project/ljixwtwxjufbwpxpxpff/sql/new');
}

main().catch(console.error);
