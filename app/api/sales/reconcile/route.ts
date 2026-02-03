// ============================================================
// RECONCILIATION API
// Validates that Sales = Payments and flags discrepancies
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

interface DiscrepancyRecord {
  sale_id: string;
  sale_number: string;
  expected: number;
  actual: number;
  difference: number;
  type: string;
}

// GET - Run reconciliation check
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const dateFrom = searchParams.get('date_from');
    const dateTo = searchParams.get('date_to');

    // Build date filter
    let dateFilter = '';
    if (date) {
      dateFilter = `AND s.created_at >= '${date}T00:00:00' AND s.created_at <= '${date}T23:59:59'`;
    } else if (dateFrom && dateTo) {
      dateFilter = `AND s.created_at >= '${dateFrom}T00:00:00' AND s.created_at <= '${dateTo}T23:59:59'`;
    }

    // Get all sales with their payment totals
    const { data: sales, error: salesError } = await supabase
      .from('sales')
      .select(`
        id, sale_number, gross_total, net_total, amount_paid, balance_due, status,
        sale_payments (id, amount, status)
      `)
      .not('status', 'in', '("voided","cancelled")');

    if (salesError) {
      console.error('Reconciliation error:', salesError);
      return NextResponse.json({ error: salesError.message }, { status: 500 });
    }

    const discrepancies: DiscrepancyRecord[] = [];
    let totalSales = 0;
    let totalPayments = 0;
    let salesChecked = 0;

    (sales || []).forEach((sale: any) => {
      salesChecked++;
      totalSales += sale.net_total || 0;

      // Calculate actual payments
      const completedPayments = (sale.sale_payments || [])
        .filter((p: any) => p.status === 'completed')
        .reduce((sum: number, p: any) => sum + (p.amount || 0), 0);

      totalPayments += completedPayments;

      // Check if amount_paid matches actual payments
      if (sale.amount_paid !== completedPayments) {
        discrepancies.push({
          sale_id: sale.id,
          sale_number: sale.sale_number,
          expected: sale.amount_paid,
          actual: completedPayments,
          difference: sale.amount_paid - completedPayments,
          type: 'payment_mismatch',
        });
      }

      // Check balance due calculation
      const expectedBalance = (sale.net_total || 0) - completedPayments;
      if (sale.balance_due !== Math.max(0, expectedBalance)) {
        discrepancies.push({
          sale_id: sale.id,
          sale_number: sale.sale_number,
          expected: Math.max(0, expectedBalance),
          actual: sale.balance_due,
          difference: sale.balance_due - Math.max(0, expectedBalance),
          type: 'balance_mismatch',
        });
      }
    });

    // Check for orphaned payments (payments without valid sales)
    const { data: allPayments } = await supabase
      .from('sale_payments')
      .select('id, payment_number, sale_id, amount');

    const saleIds = new Set((sales || []).map((s: any) => s.id));
    const orphanedPayments = (allPayments || []).filter((p: any) => !saleIds.has(p.sale_id));

    // Summary
    const reconciliation = {
      timestamp: new Date().toISOString(),
      salesChecked,
      totalSalesValue: totalSales,
      totalPaymentsValue: totalPayments,
      difference: totalSales - totalPayments,
      
      discrepancies: {
        count: discrepancies.length,
        items: discrepancies.slice(0, 50), // Limit for response size
      },
      
      orphanedPayments: {
        count: orphanedPayments.length,
        items: orphanedPayments.slice(0, 20),
      },
      
      status: discrepancies.length === 0 && orphanedPayments.length === 0 
        ? 'RECONCILED' 
        : 'DISCREPANCIES_FOUND',
      
      isHealthy: discrepancies.length === 0 && orphanedPayments.length === 0,
    };

    return NextResponse.json({ reconciliation });

  } catch (error) {
    console.error('Reconciliation API error:', error);
    return NextResponse.json({ error: 'Failed to run reconciliation' }, { status: 500 });
  }
}

// POST - Auto-fix reconciliation issues
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const body = await request.json();
    const { action, sale_id } = body;

    if (action === 'fix_balance') {
      // Recalculate and fix balance for a specific sale
      const { data: sale, error: saleError } = await supabase
        .from('sales')
        .select(`
          id, net_total,
          sale_payments (amount, status)
        `)
        .eq('id', sale_id)
        .single();

      if (saleError || !sale) {
        return NextResponse.json({ error: 'Sale not found' }, { status: 404 });
      }

      const completedPayments = (sale.sale_payments || [])
        .filter((p: any) => p.status === 'completed')
        .reduce((sum: number, p: any) => sum + (p.amount || 0), 0);

      const { error: updateError } = await supabase
        .from('sales')
        .update({
          amount_paid: completedPayments,
          balance_due: Math.max(0, (sale.net_total || 0) - completedPayments),
          status: completedPayments >= (sale.net_total || 0) ? 'completed' : 
                  completedPayments > 0 ? 'partially_paid' : 'unpaid',
        })
        .eq('id', sale_id);

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: 'Balance fixed' });
    }

    if (action === 'fix_all') {
      // Fix all sales with mismatched balances
      const { data: sales } = await supabase
        .from('sales')
        .select(`
          id, net_total, amount_paid, balance_due,
          sale_payments (amount, status)
        `)
        .not('status', 'in', '("voided","cancelled")');

      let fixed = 0;

      for (const sale of (sales || [])) {
        const completedPayments = (sale.sale_payments || [])
          .filter((p: any) => p.status === 'completed')
          .reduce((sum: number, p: any) => sum + (p.amount || 0), 0);

        const expectedBalance = Math.max(0, (sale.net_total || 0) - completedPayments);

        if (sale.amount_paid !== completedPayments || sale.balance_due !== expectedBalance) {
          await supabase
            .from('sales')
            .update({
              amount_paid: completedPayments,
              balance_due: expectedBalance,
              status: completedPayments >= (sale.net_total || 0) ? 'completed' : 
                      completedPayments > 0 ? 'partially_paid' : 'unpaid',
            })
            .eq('id', sale.id);
          fixed++;
        }
      }

      return NextResponse.json({ 
        success: true, 
        message: `Fixed ${fixed} sale(s)`,
        fixed,
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Reconciliation fix error:', error);
    return NextResponse.json({ error: 'Failed to fix reconciliation' }, { status: 500 });
  }
}
