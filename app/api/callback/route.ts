import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'dovepeakdigital@gmail.com';

async function sendPaymentEmail({
  amount,
  phone,
  reference,
  mpesaReceipt,
}: {
  amount: number;
  phone: string;
  reference: string;
  mpesaReceipt: string;
}) {
  if (!resend) {
    console.log('Email not configured. Payment received but no email sent.');
    console.log({ amount, phone, reference, mpesaReceipt });
    return;
  }

  try {
    const formattedPhone = phone.replace(/\D/g, '');
    const displayPhone = formattedPhone.length === 12 
      ? `${formattedPhone.slice(0, 4)} ${formattedPhone.slice(4, 7)} ${formattedPhone.slice(7)}`
      : phone;

    const formattedDate = new Date().toLocaleString('en-KE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Africa/Nairobi'
    });

    await resend.emails.send({
      from: 'Dovepeak Payments <onboarding@resend.dev>',
      to: [ADMIN_EMAIL],
      subject: `💰 Payment Received - KES ${amount.toLocaleString()} from ${displayPhone}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #27187D 0%, #472CE3 100%); color: white; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; }
            .content { padding: 30px; }
            .amount { font-size: 36px; font-weight: bold; color: #27187D; text-align: center; margin: 20px 0; }
            .details { background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e9ecef; }
            .detail-row:last-child { border-bottom: none; }
            .detail-label { color: #6c757d; font-size: 14px; }
            .detail-value { color: #27187D; font-weight: 600; font-size: 14px; }
            .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #6c757d; font-size: 12px; }
            .badge { display: inline-block; background-color: #10B981; color: white; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>💰 Payment Received</h1>
            </div>
            <div class="content">
              <div class="amount">KES ${amount.toLocaleString()}</div>
              <p style="text-align: center; color: #10B981; font-weight: 600; margin-bottom: 20px;">
                ✓ Payment Successful
              </p>
              <div class="details">
                <div class="detail-row">
                  <span class="detail-label">Reference</span>
                  <span class="detail-value">${reference}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Phone Number</span>
                  <span class="detail-value">${displayPhone}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">M-Pesa Receipt</span>
                  <span class="detail-value">${mpesaReceipt}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Date & Time</span>
                  <span class="detail-value">${formattedDate}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Status</span>
                  <span class="badge">COMPLETED</span>
                </div>
              </div>
              <p style="color: #6c757d; font-size: 13px; text-align: center;">
                Log in to your admin dashboard to view all transactions.
              </p>
            </div>
            <div class="footer">
              <p>Dovepeak Digital Solutions • Powered by M-Pesa</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log('Email sent successfully to:', ADMIN_EMAIL);
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('M-Pesa Callback Received:', JSON.stringify(body, null, 2));

    const result = body.Body.stkCallback;
    const resultCodeCode = result.ResultCode;
    const resultDesc = result.ResultDesc;
    const checkoutRequestID = result.CheckoutRequestID;

    console.log('M-Pesa Callback Result:', {
      ResultCode: resultCodeCode,
      ResultDesc: resultDesc,
      CheckoutRequestID: checkoutRequestID,
      fullResult: result
    });

    let status = 'failed';
    let mpesaReceipt = '';
    let errorMessage = resultDesc || 'Payment failed';

    if (resultCodeCode === 0) {
      status = 'completed';
      const items = result.CallbackMetadata.Item;
      const receiptItem = items.find((item: { Name: string; Value: any }) => item.Name === 'MpesaReceiptNumber');
      mpesaReceipt = receiptItem ? receiptItem.Value : '';
      errorMessage = null;
    }

    // First, get the payment details before updating
    const { data: existingPayment } = await supabase
      .from('payments')
      .select('*')
      .eq('checkout_request_id', checkoutRequestID)
      .maybeSingle();

    // Update Supabase
    const { error: dbError } = await supabase
      .from('payments')
      .update({ 
        status, 
        mpesa_receipt: mpesaReceipt,
        result_desc: resultDesc,
        updated_at: new Date().toISOString()
      })
      .eq('checkout_request_id', checkoutRequestID);

    if (dbError) {
      console.error('Supabase Callback Update Error:', dbError);
    }

    // If payment was successful, send email notification
    if (status === 'completed' && existingPayment) {
      await sendPaymentEmail({
        amount: existingPayment.amount,
        phone: existingPayment.phone,
        reference: existingPayment.reference,
        mpesaReceipt: mpesaReceipt
      });
    }

    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Success' });

  } catch {
    console.error('Callback API Error');
    return NextResponse.json({ ResultCode: 1, ResultDesc: 'Internal Error' }, { status: 500 });
  }
}
