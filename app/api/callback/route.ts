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
    let extractedName = null;

    if (resultCodeCode === 0) {
      status = 'completed';
      const items = result.CallbackMetadata.Item;
      const receiptItem = items.find((item: { Name: string; Value: any }) => item.Name === 'MpesaReceiptNumber');
      mpesaReceipt = receiptItem ? receiptItem.Value : '';

      // Extract name from ResultDesc if possible (e.g. "Confirmed. KES 1 received from JOHN DOE 254712345678...")
      const nameMatch = resultDesc.match(/received from (.*?) \d+/);
      if (nameMatch && nameMatch[1]) {
        extractedName = nameMatch[1].trim();
      }
    }

    // Update Supabase with all details in one go
    const { error: dbError } = await supabase
      .from('payments')
      .update({ 
        status, 
        mpesa_receipt: mpesaReceipt,
        result_desc: resultDesc,
        full_name: extractedName,
        updated_at: new Date().toISOString()
      })
      .eq('checkout_request_id', checkoutRequestID);

    if (dbError) {
      console.error('Supabase Callback Update Error:', dbError);
    }

    // Fetch the updated record for email/receipt
    const { data: updatedPayment } = await supabase
      .from('payments')
      .select('*')
      .eq('checkout_request_id', checkoutRequestID)
      .maybeSingle();

    // If payment was successful, send email notification
    if (status === 'completed' && updatedPayment) {
      await sendPaymentReceipt({
        amount: updatedPayment.amount,
        phone: updatedPayment.phone,
        reference: updatedPayment.reference,
        mpesaReceipt: mpesaReceipt,
        fullName: updatedPayment.full_name || 'Valued Customer'
      });
    }

    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Success' });

  } catch (error) {
    console.error('Callback API Error:', error);
    return NextResponse.json({ ResultCode: 1, ResultDesc: 'Internal Error' }, { status: 500 });
  }

}
