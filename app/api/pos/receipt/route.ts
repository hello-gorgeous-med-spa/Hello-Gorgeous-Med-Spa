// ============================================================
// API: POS RECEIPT
// Send receipts via email or SMS
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sale_id, client_id, type, email, phone, items, total } = body;

    if (!type || (type === 'email' && !email) || (type === 'sms' && !phone)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = getSupabase();
    
    // Build receipt content
    const itemLines = (items || [])
      .map((item: any) => `${item.name}: $${item.total?.toFixed(2) || item.unit_price?.toFixed(2) || '0.00'}`)
      .join('\n');
    
    const receiptText = `
Hello Gorgeous Med Spa
Receipt

${itemLines}

Total: $${(total || 0).toFixed(2)}

Thank you for visiting Hello Gorgeous!
74 W. Washington St, Oswego, IL 60543
(630) 636-6193
    `.trim();

    if (type === 'email') {
      // Use Resend or similar email service
      const resendKey = process.env.RESEND_API_KEY;
      
      if (resendKey) {
        const emailRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Hello Gorgeous Med Spa <noreply@hellogorgeousmedspa.com>',
            to: email,
            subject: 'Your Receipt from Hello Gorgeous Med Spa',
            text: receiptText,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
                <h2 style="color: #E6007E;">Hello Gorgeous Med Spa</h2>
                <p><strong>Receipt</strong></p>
                <hr style="border: 1px solid #eee;" />
                ${(items || []).map((item: any) => `
                  <div style="display: flex; justify-content: space-between; padding: 8px 0;">
                    <span>${item.name}</span>
                    <span>$${item.total?.toFixed(2) || item.unit_price?.toFixed(2) || '0.00'}</span>
                  </div>
                `).join('')}
                <hr style="border: 1px solid #eee;" />
                <div style="display: flex; justify-content: space-between; padding: 12px 0; font-size: 18px; font-weight: bold;">
                  <span>Total</span>
                  <span style="color: #E6007E;">$${(total || 0).toFixed(2)}</span>
                </div>
                <hr style="border: 1px solid #eee;" />
                <p style="color: #666; font-size: 14px; margin-top: 20px;">
                  Thank you for visiting Hello Gorgeous!<br/>
                  74 W. Washington St, Oswego, IL 60543<br/>
                  (630) 636-6193
                </p>
              </div>
            `,
          }),
        });

        if (!emailRes.ok) {
          console.error('Email send failed:', await emailRes.text());
          return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
        }
      } else {
        // Fallback: just log it
        console.log('Would send email receipt to:', email);
      }

      // Log receipt send
      if (supabase && sale_id) {
        await supabase.from('receipt_logs').insert({
          sale_id,
          client_id,
          type: 'email',
          recipient: email,
          sent_at: new Date().toISOString(),
        }).catch(() => {});
      }

      return NextResponse.json({ success: true, type: 'email' });
    }

    if (type === 'sms') {
      // Use Telnyx for SMS
      const telnyxKey = process.env.TELNYX_API_KEY;
      const telnyxPhone = process.env.TELNYX_PHONE_NUMBER;
      
      // Format phone
      let formattedPhone = phone.replace(/\D/g, '');
      if (formattedPhone.length === 10) {
        formattedPhone = `+1${formattedPhone}`;
      } else if (!formattedPhone.startsWith('+')) {
        formattedPhone = `+${formattedPhone}`;
      }

      const smsText = `Hello Gorgeous Receipt\n\nTotal: $${(total || 0).toFixed(2)}\n\nThank you for visiting!\n\nQuestions? (630) 636-6193`;

      if (telnyxKey && telnyxPhone) {
        const smsRes = await fetch('https://api.telnyx.com/v2/messages', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${telnyxKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: telnyxPhone,
            to: formattedPhone,
            text: smsText,
          }),
        });

        if (!smsRes.ok) {
          console.error('SMS send failed:', await smsRes.text());
          return NextResponse.json({ error: 'Failed to send SMS' }, { status: 500 });
        }
      } else {
        // Fallback: just log it
        console.log('Would send SMS receipt to:', formattedPhone);
      }

      // Log receipt send
      if (supabase && sale_id) {
        await supabase.from('receipt_logs').insert({
          sale_id,
          client_id,
          type: 'sms',
          recipient: formattedPhone,
          sent_at: new Date().toISOString(),
        }).catch(() => {});
      }

      return NextResponse.json({ success: true, type: 'sms' });
    }

    return NextResponse.json({ error: 'Invalid receipt type' }, { status: 400 });

  } catch (error) {
    console.error('Receipt send error:', error);
    return NextResponse.json({ error: 'Failed to send receipt' }, { status: 500 });
  }
}
