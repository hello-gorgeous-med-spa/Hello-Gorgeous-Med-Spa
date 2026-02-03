// ============================================================
// BUSINESS WALLET API
// Live Cash Position - Not Revenue
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

// GET - Get wallet status
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

    // Get today's payments
    const { data: todayPayments, error: todayError } = await supabase
      .from('sale_payments')
      .select('*')
      .gte('created_at', `${date}T00:00:00`)
      .lte('created_at', `${date}T23:59:59`)
      .eq('status', 'completed');

    if (todayError) {
      console.error('Payments fetch error:', todayError);
    }

    // Get pending payments
    const { data: pendingPayments } = await supabase
      .from('sale_payments')
      .select('*')
      .eq('status', 'pending');

    // Get refunds today
    const todayRefunds = (todayPayments || []).filter((p: any) => p.amount < 0);
    const todayCollections = (todayPayments || []).filter((p: any) => p.amount > 0);

    // Calculate by processor (Square is primary - Stripe deprecated)
    const byProcessor = {
      square: { collected: 0, fees: 0, net: 0 },
      cash: { collected: 0, fees: 0, net: 0 },
      giftCard: { collected: 0, fees: 0, net: 0 },
      other: { collected: 0, fees: 0, net: 0 },
    };

    todayCollections.forEach((payment: any) => {
      const processor = payment.payment_processor || 
        (payment.payment_method === 'cash' ? 'cash' : 
         payment.payment_method === 'gift_card' ? 'giftCard' : 'other');
      
      // Map all card processors to Square (Stripe deprecated)
      const key = processor === 'square' || processor === 'stripe' || processor === 'card' ? 'square' :
                  processor === 'cash' ? 'cash' :
                  payment.payment_method === 'gift_card' ? 'giftCard' : 'other';
      
      byProcessor[key as keyof typeof byProcessor].collected += payment.amount || 0;
      byProcessor[key as keyof typeof byProcessor].fees += payment.processing_fee || 0;
      byProcessor[key as keyof typeof byProcessor].net += payment.net_amount || 0;
    });

    // Calculate totals
    const totalCollected = todayCollections.reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
    const totalRefunds = Math.abs(todayRefunds.reduce((sum: number, p: any) => sum + (p.amount || 0), 0));
    const totalFees = todayCollections.reduce((sum: number, p: any) => sum + (p.processing_fee || 0), 0);
    const totalTips = todayCollections.reduce((sum: number, p: any) => sum + (p.tip_amount || 0), 0);
    const netCollected = totalCollected - totalRefunds - totalFees;

    // Get yesterday's closing for opening balance (simplified)
    const yesterday = new Date(date);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const { data: yesterdayWallet } = await supabase
      .from('business_wallet')
      .select('closing_balance')
      .eq('wallet_date', yesterdayStr)
      .single();

    const openingBalance = yesterdayWallet?.closing_balance || 0;
    const closingBalance = openingBalance + netCollected;

    const wallet = {
      date,
      
      // Balances
      openingBalance,
      closingBalance,
      
      // Today's Activity
      activity: {
        paymentsReceived: totalCollected,
        refundsIssued: totalRefunds,
        processingFees: totalFees,
        tips: totalTips,
        netMovement: netCollected,
      },

      // By Payment Method
      byMethod: {
        card: todayCollections.filter((p: any) => p.payment_method === 'card')
          .reduce((sum: number, p: any) => sum + (p.amount || 0), 0),
        cash: todayCollections.filter((p: any) => p.payment_method === 'cash')
          .reduce((sum: number, p: any) => sum + (p.amount || 0), 0),
        giftCard: todayCollections.filter((p: any) => p.payment_method === 'gift_card')
          .reduce((sum: number, p: any) => sum + (p.amount || 0), 0),
        membershipCredit: todayCollections.filter((p: any) => p.payment_method === 'membership_credit')
          .reduce((sum: number, p: any) => sum + (p.amount || 0), 0),
        other: todayCollections.filter((p: any) => !['card', 'cash', 'gift_card', 'membership_credit'].includes(p.payment_method))
          .reduce((sum: number, p: any) => sum + (p.amount || 0), 0),
      },

      // By Processor
      byProcessor,

      // Counts
      counts: {
        totalTransactions: todayPayments?.length || 0,
        collections: todayCollections.length,
        refunds: todayRefunds.length,
        pending: pendingPayments?.length || 0,
      },

      // Pending
      pending: {
        payments: (pendingPayments || []).reduce((sum: number, p: any) => sum + (p.amount || 0), 0),
        count: pendingPayments?.length || 0,
      },

      // Status
      status: 'live',
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json({ wallet });

  } catch (error) {
    console.error('Wallet API error:', error);
    return NextResponse.json({ error: 'Failed to fetch wallet' }, { status: 500 });
  }
}
