import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendPaymentReceipt } from '@/lib/postmark';
import { logCallback } from '@/lib/logger';

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
      const items = result.CallbackMetadata?.Item || [];
      const receiptItem = items.find((item: { Name: string; Value: any }) => item.Name === 'MpesaReceiptNumber');
      mpesaReceipt = receiptItem ? receiptItem.Value : '';

      // Try to find a Name item in the metadata (some APIs or aggregators include this)
      const nameItem = items.find((item: { Name: string; Value: any }) => 
        item.Name.toLowerCase().includes('name') && item.Value
      );
      if (nameItem) {
        extractedName = nameItem.Value.toString().trim();
      }

      // If not found in items, extract name from ResultDesc if possible
      // (e.g. "Confirmed. KES 1 received from JOHN DOE 254712345678...")
      if (!extractedName && resultDesc) {
        // Try multiple formats just in case
        const nameMatch = resultDesc.match(/received from (.*?) \d+/i) || resultDesc.match(/from (.*?) on/i);
        if (nameMatch && nameMatch[1]) {
          extractedName = nameMatch[1].trim();
        }
      }
    }

    // Build the update payload dynamically to avoid overwriting existing full_name with null
    const updatePayload: any = { 
      status, 
      mpesa_receipt: mpesaReceipt,
      result_desc: resultDesc,
      updated_at: new Date().toISOString()
    };
    
    if (extractedName) {
      updatePayload.full_name = extractedName;
    }

    console.log('Update Payload for Supabase:', updatePayload);
    logCallback({ stage: 'pre_update', checkoutRequestID, extractedName, updatePayload });

    // Update Supabase with all details in one go
    const { error: dbError } = await supabase
      .from('payments')
      .update(updatePayload)
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
