import { getSupabase } from '@/lib/supabase-server';

export async function loadOpsChart(email: string) {
  const supabase = getSupabase();
  if (!supabase || !email) {
    return { patient: null, intakes: [], consents: [], labs: [], orders: [], attestations: [], audit: [], messages: [] };
  }

  const { data: intakes } = await supabase
    .from('regen_intakes')
    .select('*')
    .ilike('email', email)
    .order('created_at', { ascending: false });

  const lookupEmail = (intakes?.[0]?.email || email).toLowerCase();

  const { data: patients } = await supabase.from('regen_patients').select('*').ilike('email', lookupEmail).limit(1);
  const { data: consents } = await supabase.from('regen_signed_consents').select('*').eq('patient_email', lookupEmail).order('signed_at', { ascending: false });
  const { data: labs } = await supabase.from('regen_lab_requirements').select('*').eq('patient_email', lookupEmail).order('created_at', { ascending: false });

  const intakeIds = (intakes || []).map((i) => i.id);
  const { data: orders } = intakeIds.length
    ? await supabase.from('regen_orders').select('*').in('intake_id', intakeIds).order('created_at', { ascending: false })
    : { data: [] };
  const { data: attestations } = intakeIds.length
    ? await supabase.from('regen_provider_attestations').select('*').in('intake_id', intakeIds).order('attested_at', { ascending: false })
    : { data: [] };
  const { data: audit } = intakeIds.length
    ? await supabase.from('regen_audit_log').select('*').in('resource_id', intakeIds).order('created_at', { ascending: false }).limit(50)
    : { data: [] };

  let messages: unknown[] = [];
  const byEmail = await supabase.from('regen_messages').select('*').eq('patient_email', lookupEmail).order('created_at', { ascending: false }).limit(50);
  if (!byEmail.error) messages = byEmail.data || [];

  return {
    patient: patients?.[0] || null,
    intakes: intakes || [],
    consents: consents || [],
    labs: labs || [],
    orders: orders || [],
    attestations: attestations || [],
    audit: audit || [],
    messages,
  };
}
