/**
 * Sync completed payments to payment_receipts for client portal
 */

import type { SupabaseClient } from '@supabase/supabase-js';

export async function createPaymentReceiptFromSale(
  supabase: SupabaseClient,
  saleId: string
): Promise<{ created: boolean; receiptId?: string; error?: string }> {
  try {
    const { data: sale, error: saleError } = await supabase
      .from('sales')
      .select('id, client_id, appointment_id, provider_id, sale_number, subtotal, discount_total, tax_total, tip_total, gross_total, net_total, status, completed_at')
      .eq('id', saleId)
      .single();

    if (saleError || !sale) return { created: false, error: saleError?.message || 'Sale not found' };
    if (!sale.client_id || sale.status !== 'completed') return { created: false };

    const receiptNumber = sale.sale_number || 'HG-RCP-' + sale.id.slice(0, 8).toUpperCase();
    const { data: existing } = await supabase.from('payment_receipts').select('id').eq('receipt_number', receiptNumber).single();
    if (existing) return { created: false };

    const { data: saleItems } = await supabase.from('sale_items').select('item_name, quantity, unit_price, total_price').eq('sale_id', saleId);
    const lineItems = (saleItems || []).map((i: { item_name: string; quantity: number; unit_price: number; total_price: number }) => ({
      name: i.item_name, quantity: i.quantity, unitPrice: (i.unit_price || 0) / 100, total: (i.total_price || 0) / 100
    }));

    const { data: payment } = await supabase.from('sale_payments').select('payment_method, card_brand, card_last_four, processor_receipt_url')
      .eq('sale_id', saleId).eq('status', 'completed').order('processed_at', { ascending: false }).limit(1).single();

    let providerName: string | null = null;
    if (sale.provider_id) {
      const { data: p } = await supabase.from('providers').select('first_name, last_name, display_name').eq('id', sale.provider_id).single();
      if (p) providerName = p.display_name || [p.first_name, p.last_name].filter(Boolean).join(' ');
    }

    const receiptDate = sale.completed_at ? new Date(sale.completed_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    const subtotal = Number(sale.subtotal) || 0, discount = Number(sale.discount_total) || 0, tax = Number(sale.tax_total) || 0, tip = Number(sale.tip_total) || 0;
    const total = Number(sale.gross_total) || Number(sale.net_total) || subtotal - discount + tax + tip;

    const { data: receipt, error: insertError } = await supabase.from('payment_receipts').insert({
      client_id: sale.client_id, appointment_id: sale.appointment_id || null, receipt_number: receiptNumber, receipt_date: receiptDate,
      subtotal_cents: subtotal, discount_cents: discount, tax_cents: tax, tip_cents: tip, total_cents: total,
      payment_method: payment?.payment_method || 'card', payment_reference: saleId, last_four: payment?.card_last_four || null, card_brand: payment?.card_brand || null,
      line_items: lineItems, provider_id: sale.provider_id || null, provider_name: providerName, pdf_url: payment?.processor_receipt_url || null, status: 'completed'
    }).select('id').single();

    if (insertError) { console.error('[portal/sync-receipt]', insertError); return { created: false, error: insertError.message }; }
    return { created: true, receiptId: receipt?.id };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown';
    console.error('[portal/sync-receipt]', msg);
    return { created: false, error: msg };
  }
}
