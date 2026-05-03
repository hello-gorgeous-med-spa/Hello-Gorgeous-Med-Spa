// Test Lead Nurture Agent locally (dry run)
// Usage: node --env-file=.env.local scripts/test-lead-nurture-agent.mjs

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  console.log('='.repeat(60));
  console.log('LEAD NURTURE AGENT TEST');
  console.log('='.repeat(60));
  console.log('');

  // Check if migration has been run
  const { data: testLead, error: colError } = await supabase
    .from('leads')
    .select('id, nurture_step')
    .limit(1);

  if (colError && colError.message.includes('nurture_step')) {
    console.log('❌ Migration not run yet!');
    console.log('');
    console.log('Please run in Supabase Dashboard > SQL Editor:');
    console.log('supabase/migrations/20260503060000_lead_nurture_tracking.sql');
    console.log('');
    return;
  }

  console.log('✅ Migration verified');
  console.log('');

  // Count leads
  const { count: totalLeads } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true });

  console.log(`Total leads in database: ${totalLeads || 0}`);

  // Get unconverted leads awaiting nurture
  const { data: pendingLeads, count: pendingCount } = await supabase
    .from('leads')
    .select('id, email, full_name, lead_type, nurture_step, created_at', { count: 'exact' })
    .eq('converted_to_client', false)
    .is('nurture_completed_at', null)
    .order('created_at', { ascending: false })
    .limit(10);

  console.log(`Leads awaiting nurture: ${pendingCount || 0}`);
  console.log('');

  if (pendingLeads && pendingLeads.length > 0) {
    console.log('Recent leads:');
    for (const lead of pendingLeads) {
      const ageHours = Math.round((Date.now() - new Date(lead.created_at).getTime()) / (1000 * 60 * 60));
      console.log(`  - ${lead.email} | Step ${lead.nurture_step} | ${ageHours}h old | ${lead.lead_type}`);
    }
  } else {
    console.log('No leads awaiting nurture.');
    console.log('');
    console.log('Creating a test lead...');
    
    const { data: newLead, error: insertError } = await supabase
      .from('leads')
      .insert({
        email: 'test-lead@example.com',
        phone: '+16305551234',
        full_name: 'Test Lead',
        source: 'website',
        lead_type: 'contact_form',
        nurture_step: 0,
      })
      .select()
      .single();

    if (insertError) {
      console.log('Insert error:', insertError.message);
    } else {
      console.log(`✅ Test lead created: ${newLead.id}`);
      console.log('');
      console.log('Now you can test the agent by running:');
      console.log('curl -H "Authorization: Bearer hg-cron-secret-change-me-in-vercel" http://localhost:3000/api/agents/lead-nurture');
    }
  }

  console.log('');
  console.log('='.repeat(60));
  console.log('To run the agent (dry run on Vercel):');
  console.log('curl -H "Authorization: Bearer YOUR_CRON_SECRET" https://your-site.vercel.app/api/agents/lead-nurture');
  console.log('='.repeat(60));
}

main().catch(console.error);
