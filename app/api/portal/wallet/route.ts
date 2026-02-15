import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function getClientFromSession(request: NextRequest) {
  const sessionToken = request.cookies.get('portal_session')?.value;
  if (!sessionToken) return null;

  const { data: session } = await supabase
    .from('client_sessions')
    .select('client_id')
    .eq('session_token', sessionToken)
    .is('revoked_at', null)
    .gt('expires_at', new Date().toISOString())
    .single();

  return session?.client_id || null;
}

// GET - Get wallet info
export async function GET(request: NextRequest) {
  try {
    const clientId = await getClientFromSession(request);
    if (!clientId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get or create wallet
    let { data: wallet } = await supabase
      .from('patient_wallet')
      .select('*')
      .eq('client_id', clientId)
      .single();

    if (!wallet) {
      const { data: newWallet } = await supabase
        .from('patient_wallet')
        .insert({ client_id: clientId })
        .select()
        .single();
      wallet = newWallet;
    }

    // Get recent transactions
    const { data: transactions } = await supabase
      .from('wallet_transactions')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })
      .limit(20);

    return NextResponse.json({
      wallet: {
        creditBalance: (wallet?.credit_balance_cents || 0) / 100,
        giftCardBalance: (wallet?.gift_card_balance_cents || 0) / 100,
        rewardPoints: wallet?.reward_points || 0,
        totalSpent: (wallet?.total_spent_cents || 0) / 100,
        totalSaved: (wallet?.total_saved_cents || 0) / 100,
        membershipTier: wallet?.membership_tier || 'standard'
      },
      transactions: (transactions || []).map(t => ({
        id: t.id,
        type: t.transaction_type,
        amount: t.amount_cents / 100,
        balanceAfter: t.balance_after_cents / 100,
        description: t.description,
        source: t.source,
        date: t.created_at
      }))
    });
  } catch (error) {
    console.error('Wallet error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Redeem gift card
export async function POST(request: NextRequest) {
  try {
    const clientId = await getClientFromSession(request);
    if (!clientId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { giftCardCode } = await request.json();
    if (!giftCardCode) {
      return NextResponse.json({ error: 'Gift card code required' }, { status: 400 });
    }

    // TODO: Validate gift card code against gift_cards table
    // For now, return error
    return NextResponse.json({ error: 'Invalid gift card code' }, { status: 400 });
  } catch (error) {
    console.error('Gift card error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
