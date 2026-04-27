import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendPaymentReceipt } from '@/lib/postmark';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'dovepeakdigital@gmail.com';

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
      await sendPaymentReceipt({
        amount: existingPayment.amount,
        phone: existingPayment.phone,
        reference: existingPayment.reference,
        mpesaReceipt: mpesaReceipt,
        fullName: existingPayment.full_name || 'Valued Customer'
      });

    }

    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Success' });

  } catch {
    console.error('Callback API Error');
    return NextResponse.json({ ResultCode: 1, ResultDesc: 'Internal Error' }, { status: 500 });
  }
}
