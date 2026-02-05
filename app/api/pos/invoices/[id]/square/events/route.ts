// ============================================================
// TERMINAL STATUS SSE ENDPOINT
// Server-Sent Events for real-time terminal checkout updates
// ============================================================
// ARCHITECTURE:
// - Uses Supabase Realtime to subscribe to terminal_checkouts changes
// - Falls back to polling if Realtime unavailable
// - NEVER polls Square directly (single source of truth = our DB)
// - Webhook handler writes to DB → Realtime/SSE → streams to client
// ============================================================

import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Final states that should close the SSE connection
const FINAL_STATES = ['COMPLETED', 'CANCELED', 'FAILED', 'EXPIRED'];

/**
 * GET /api/pos/invoices/[id]/square/events
 * SSE stream for terminal checkout status updates
 * 
 * Usage:
 * ```js
 * const eventSource = new EventSource(`/api/pos/invoices/${saleId}/square/events`);
 * eventSource.onmessage = (e) => {
 *   const data = JSON.parse(e.data);
 *   if (['COMPLETED', 'CANCELED', 'FAILED'].includes(data.status)) {
 *     eventSource.close();
 *   }
 * };
 * ```
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: saleId } = await params;
  
  const encoder = new TextEncoder();
  let isActive = true;
  let pollInterval: NodeJS.Timeout | null = null;
  let heartbeatInterval: NodeJS.Timeout | null = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let realtimeChannel: any = null;
  
  // Create Supabase client for Realtime
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  const stream = new ReadableStream({
    async start(controller) {
      
      // Helper to send SSE data
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sendData = (data: any) => {
        if (!isActive) return;
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        } catch {
          // Stream may be closed
          isActive = false;
        }
      };
      
      // Helper to fetch current status from DB
      const fetchStatus = async () => {
        if (!isActive) return null;
        
        try {
          // Use service role for server-side fetch
          const supabase = createClient(supabaseUrl!, supabaseKey!, {
            auth: { persistSession: false },
          });
          
          const { data: checkout, error } = await supabase
            .from('terminal_checkouts')
            .select(`
              square_checkout_id,
              status,
              square_payment_id,
              amount_money,
              tip_money,
              error_code,
              error_message,
              created_at,
              updated_at,
              completed_at
            `)
            .eq('sale_id', saleId)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
          
          if (error || !checkout) {
            return {
              status: 'NOT_FOUND',
              sale_id: saleId,
              message: 'No terminal checkout found for this sale',
            };
          }
          
          // Get sale info for additional context
          const { data: sale } = await supabase
            .from('sales')
            .select('status, gross_total, amount_paid, tip_total')
            .eq('id', saleId)
            .single();
          
          return {
            checkout_id: checkout.square_checkout_id,
            status: checkout.status,
            payment_id: checkout.square_payment_id,
            amount_cents: checkout.amount_money,
            tip_cents: checkout.tip_money || 0,
            total_cents: (checkout.amount_money || 0) + (checkout.tip_money || 0),
            error_code: checkout.error_code,
            error_message: checkout.error_message,
            created_at: checkout.created_at,
            updated_at: checkout.updated_at,
            completed_at: checkout.completed_at,
            sale_status: sale?.status,
            sale_total: sale?.gross_total,
            sale_paid: sale?.amount_paid,
            sale_tip: sale?.tip_total,
          };
        } catch (error) {
          console.error('SSE status fetch error:', error);
          return { status: 'ERROR', error: 'Failed to fetch status' };
        }
      };
      
      // Handle final state - close stream after sending
      const handleFinalState = (status: string) => {
        if (FINAL_STATES.includes(status)) {
          // Give client time to receive the final state
          setTimeout(() => {
            cleanup();
            try {
              controller.close();
            } catch {
              // Already closed
            }
          }, 1000);
        }
      };
      
      // Cleanup function
      const cleanup = () => {
        isActive = false;
        if (pollInterval) clearInterval(pollInterval);
        if (heartbeatInterval) clearInterval(heartbeatInterval);
        if (realtimeChannel) {
          realtimeChannel.unsubscribe();
        }
      };
      
      // ============================================================
      // 1. SEND INITIAL STATUS IMMEDIATELY
      // ============================================================
      const initialStatus = await fetchStatus();
      if (initialStatus) {
        sendData(initialStatus);
        
        // If already in final state, close immediately
        if (FINAL_STATES.includes(initialStatus.status)) {
          cleanup();
          controller.close();
          return;
        }
      }
      
      // ============================================================
      // 2. TRY SUPABASE REALTIME (preferred)
      // ============================================================
      let usingRealtime = false;
      
      if (supabaseUrl && supabaseKey) {
        try {
          const supabase = createClient(supabaseUrl, supabaseKey, {
            auth: { persistSession: false },
          });
          
          // Subscribe to changes on terminal_checkouts for this sale
          realtimeChannel = supabase
            .channel(`terminal_checkout_${saleId}`)
            .on(
              'postgres_changes',
              {
                event: 'UPDATE',
                schema: 'public',
                table: 'terminal_checkouts',
                filter: `sale_id=eq.${saleId}`,
              },
              async (payload) => {
                console.log('Realtime update for sale:', saleId, payload.new?.status);
                const status = await fetchStatus();
                if (status) {
                  sendData(status);
                  handleFinalState(status.status);
                }
              }
            )
            .subscribe((status) => {
              if (status === 'SUBSCRIBED') {
                usingRealtime = true;
                console.log('Realtime subscribed for sale:', saleId);
              }
            });
        } catch (error) {
          console.error('Realtime setup error:', error);
        }
      }
      
      // ============================================================
      // 3. FALLBACK POLLING (if Realtime not working)
      // ============================================================
      // Poll every 2 seconds as fallback
      // If Realtime is working, this is just a safety net
      pollInterval = setInterval(async () => {
        if (!isActive) return;
        
        const status = await fetchStatus();
        if (status) {
          sendData(status);
          handleFinalState(status.status);
        }
      }, usingRealtime ? 5000 : 2000); // Slower poll if Realtime is working
      
      // ============================================================
      // 4. HEARTBEAT (keep connection alive)
      // ============================================================
      heartbeatInterval = setInterval(() => {
        if (isActive) {
          try {
            controller.enqueue(encoder.encode(`: heartbeat\n\n`));
          } catch {
            cleanup();
          }
        }
      }, 15000);
      
      // ============================================================
      // 5. CLIENT DISCONNECT HANDLER
      // ============================================================
      request.signal.addEventListener('abort', () => {
        cleanup();
        try {
          controller.close();
        } catch {
          // Already closed
        }
      });
      
      // ============================================================
      // 6. HARD TIMEOUT (prevent zombie connections)
      // ============================================================
      setTimeout(() => {
        if (isActive) {
          sendData({ 
            status: 'TIMEOUT', 
            message: 'SSE connection timeout after 5 minutes',
          });
          cleanup();
          try {
            controller.close();
          } catch {
            // Already closed
          }
        }
      }, 5 * 60 * 1000);
    },
    
    cancel() {
      isActive = false;
      if (pollInterval) clearInterval(pollInterval);
      if (heartbeatInterval) clearInterval(heartbeatInterval);
      if (realtimeChannel) {
        realtimeChannel.unsubscribe();
      }
    },
  });
  
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // Disable nginx buffering
    },
  });
}
