import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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
      status = 'completed'; // Using 'completed' for consistency with frontend polling
      const items = result.CallbackMetadata.Item;
      const receiptItem = items.find((item: { Name: string; Value: any }) => item.Name === 'MpesaReceiptNumber');
      mpesaReceipt = receiptItem ? receiptItem.Value : '';
      errorMessage = null;
    }

    // Update Supabase. 
    // Wait, I should have saved MerchantRequestID or CheckoutRequestID in the initial insert.
    // I will update the insert in stkpush/route.ts to include CheckoutRequestID.
    
    const { error: dbError } = await supabase
      .from('payments')
      .update({ 
        status, 
        mpesa_receipt: mpesaReceipt,
        result_desc: resultDesc, // Add this to see the failure reason in DB
        updated_at: new Date().toISOString()
      })
      .eq('checkout_request_id', checkoutRequestID); // Will need this column

    if (dbError) {
      console.error('Supabase Callback Update Error:', dbError);
    }

    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Success' });

  } catch {
    console.error('Callback API Error');
    return NextResponse.json({ ResultCode: 1, ResultDesc: 'Internal Error' }, { status: 500 });
  }
}
