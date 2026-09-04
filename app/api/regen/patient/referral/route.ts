import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

/**
 * GET /api/regen/patient/referral
 * Get patient's referral code and stats
 */
export async function GET() {
  try {
    const supabase = createServerSupabaseClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get patient
    const { data: patient } = await supabase
      .from('regen_patients')
      .select('id, name, email, referral_code')
      .eq('user_id', user.id)
      .single();

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    // Generate referral code if doesn't exist
    let referralCode = patient.referral_code;
    if (!referralCode) {
      referralCode = generateReferralCode(patient.name);
      await supabase
        .from('regen_patients')
        .update({ referral_code: referralCode })
        .eq('id', patient.id);
    }

    // Get referral stats
    const { data: referrals } = await supabase
      .from('regen_referrals')
      .select('*')
      .eq('referrer_id', patient.id);

    const completedReferrals = referrals?.filter(r => r.status === 'completed') || [];
    const pendingReferrals = referrals?.filter(r => r.status === 'pending') || [];
    const totalEarned = completedReferrals.reduce((sum, r) => sum + (r.reward_amount || 0), 0);

    return NextResponse.json({
      referralCode,
      referralLink: `https://tryregenrx.com/start?ref=${referralCode}`,
      stats: {
        completed: completedReferrals.length,
        pending: pendingReferrals.length,
        totalEarned,
      },
      referrals: referrals || [],
    });
  } catch (error) {
    console.error('Referral API error:', error);
    return NextResponse.json({ error: 'Failed to fetch referral data' }, { status: 500 });
  }
}

function generateReferralCode(name: string): string {
  const prefix = name
    .split(' ')[0]
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .substring(0, 4);
  const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${suffix}`;
}
