import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase-server';

/**
 * Fullscript Webhook Handler
 * 
 * Receives events from Fullscript including:
 * - lab_order.created
 * - lab_order.updated (results ready)
 * - treatment_plan.created
 * - order.created
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    console.log('Fullscript webhook received:', JSON.stringify(body, null, 2));
    
    const { event_type, data } = body;
    
    switch (event_type) {
      case 'lab_order.created':
        await handleLabOrderCreated(data);
        break;
        
      case 'lab_order.updated':
        await handleLabOrderUpdated(data);
        break;
        
      case 'lab_order.results_available':
        await handleLabResultsAvailable(data);
        break;
        
      default:
        console.log(`Unhandled Fullscript event: ${event_type}`);
    }
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Fullscript webhook error:', error);
    // Still return 200 to acknowledge receipt
    return NextResponse.json({ received: true, error: 'Processing error' });
  }
}

// GET endpoint for webhook verification
export async function GET() {
  return NextResponse.json({ 
    status: 'ok',
    endpoint: 'Fullscript webhook receiver',
    timestamp: new Date().toISOString(),
  });
}

async function handleLabOrderCreated(data: Record<string, unknown>) {
  console.log('Lab order created:', data);
  
  const supabase = getSupabase();
  
  // Store the lab order reference
  try {
    await supabase.from('regen_lab_requirements').insert({
      fullscript_order_id: data.id,
      patient_email: data.patient?.email,
      lab_type: data.test_name || 'Lab Panel',
      required_for: 'treatment',
      status: 'ordered',
      created_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Error storing lab order:', err);
  }
}

async function handleLabOrderUpdated(data: Record<string, unknown>) {
  console.log('Lab order updated:', data);
  
  const supabase = getSupabase();
  
  // Update the lab order status
  try {
    await supabase
      .from('regen_lab_requirements')
      .update({
        status: mapFullscriptStatus(data.status as string),
        updated_at: new Date().toISOString(),
      })
      .eq('fullscript_order_id', data.id);
  } catch (err) {
    console.error('Error updating lab order:', err);
  }
}

async function handleLabResultsAvailable(data: Record<string, unknown>) {
  console.log('Lab results available:', data);
  
  const supabase = getSupabase();
  
  // Update status and notify
  try {
    await supabase
      .from('regen_lab_requirements')
      .update({
        status: 'results_ready',
        updated_at: new Date().toISOString(),
      })
      .eq('fullscript_order_id', data.id);
    
    // TODO: Send SMS/email notification to patient
    // TODO: Add to provider review queue
    
  } catch (err) {
    console.error('Error handling lab results:', err);
  }
}

function mapFullscriptStatus(status: string): string {
  const statusMap: Record<string, string> = {
    'pending': 'ordered',
    'requisition_sent': 'ordered',
    'sample_collected': 'processing',
    'processing': 'processing',
    'results_available': 'results_ready',
    'completed': 'results_ready',
    'cancelled': 'cancelled',
  };
  return statusMap[status] || status;
}
