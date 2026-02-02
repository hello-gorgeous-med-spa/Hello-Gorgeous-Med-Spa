#!/usr/bin/env node

/**
 * Database Migration Script
 * Executes SQL migrations against Supabase using the pg library
 * 
 * Usage: node scripts/migrate.mjs
 * 
 * Requires DATABASE_URL or will construct from Supabase credentials
 */

import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase direct database connection
// Format: postgresql://postgres.[project-ref]:[password]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
const PROJECT_REF = 'ljixwtwxjufbwpxpxpff';

// Try to get DATABASE_URL from environment or construct it
let connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.log('⚠️  DATABASE_URL not found in environment');
  console.log('');
  console.log('To run migrations, you need the database password from Supabase.');
  console.log('');
  console.log('Option 1: Set DATABASE_URL environment variable');
  console.log('   Get the connection string from:');
  console.log(`   https://supabase.com/dashboard/project/${PROJECT_REF}/settings/database`);
  console.log('');
  console.log('Option 2: Run SQL directly in Supabase Dashboard');
  console.log(`   https://supabase.com/dashboard/project/${PROJECT_REF}/sql/new`);
  console.log('');
  console.log('The SQL files to run are:');
  console.log('   1. supabase/migrations/002_square_gift_cards.sql');
  console.log('   2. supabase/migrations/003_website_cms.sql');
  console.log('');
  console.log('Would you like me to output the combined SQL for you to copy? (y/n)');
  
  // Read stdin for response
  process.stdin.setEncoding('utf8');
  process.stdin.once('data', async (answer) => {
    if (answer.trim().toLowerCase() === 'y') {
      await outputCombinedSql();
    }
    process.exit(0);
  });
  
  // Also output after a timeout if no input
  setTimeout(async () => {
    console.log('\nOutputting SQL...\n');
    await outputCombinedSql();
    process.exit(0);
  }, 3000);
  
} else {
  runMigrations();
}

async function outputCombinedSql() {
  const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');
  const files = ['002_square_gift_cards.sql', '003_website_cms.sql'];
  
  console.log('='.repeat(80));
  console.log('COPY THE SQL BELOW AND PASTE INTO SUPABASE SQL EDITOR');
  console.log(`https://supabase.com/dashboard/project/${PROJECT_REF}/sql/new`);
  console.log('='.repeat(80));
  console.log('');
  
  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    if (fs.existsSync(filePath)) {
      console.log(`-- ============================================`);
      console.log(`-- FILE: ${file}`);
      console.log(`-- ============================================`);
      console.log('');
      console.log(fs.readFileSync(filePath, 'utf8'));
      console.log('');
    }
  }
  
  console.log('='.repeat(80));
  console.log('END OF SQL - PASTE THE ABOVE INTO SUPABASE SQL EDITOR');
  console.log('='.repeat(80));
}

async function runMigrations() {
  const client = new pg.Client({ connectionString });
  
  try {
    console.log('🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected!');
    
    const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');
    const files = ['002_square_gift_cards.sql', '003_website_cms.sql'];
    
    for (const file of files) {
      const filePath = path.join(migrationsDir, file);
      
      if (!fs.existsSync(filePath)) {
        console.log(`⚠️  Skipping ${file} - file not found`);
        continue;
      }
      
      console.log(`\n📦 Running: ${file}`);
      const sql = fs.readFileSync(filePath, 'utf8');
      
      try {
        await client.query(sql);
        console.log(`✅ ${file} completed successfully`);
      } catch (err) {
        console.error(`❌ Error in ${file}:`, err.message);
        // Continue with next migration
      }
    }
    
    console.log('\n🎉 Migrations complete!');
    
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    console.log('');
    console.log('Please run the SQL manually in Supabase Dashboard:');
    console.log(`https://supabase.com/dashboard/project/${PROJECT_REF}/sql/new`);
  } finally {
    await client.end();
  }
}
