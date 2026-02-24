import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('M-Pesa Callback Received:', JSON.stringify(body, null, 2));

    const result = body.Body.stkCallback;
    const resultCodeCode = result.ResultCode;
    const checkoutRequestID = result.CheckoutRequestID;

    // Find the record. Safaricom doesn't send our 'reference' back in the top level.
    // Usually we'd map MerchantRequestID or CheckoutRequestID.
    // For this MVP, let's assume we store one of these IDs in the DB or use a simpler mapping.
    // Let's check how to get our reference back. Safaricom sends 'AccountReference' in the request, 
    // but in callback it's usually not there unless we use specific metadata.
    
    // Most developers use CheckoutRequestID as the key.
    
    let status = 'failed';
    let mpesaReceipt = '';

    if (resultCodeCode === 0) {
      status = 'success';
      const items = result.CallbackMetadata.Item;
      const receiptItem = items.find((item: { Name: string; Value: any }) => item.Name === 'MpesaReceiptNumber');
      mpesaReceipt = receiptItem ? receiptItem.Value : '';
    }

    // Update Supabase. 
    // Wait, I should have saved MerchantRequestID or CheckoutRequestID in the initial insert.
    // I will update the insert in stkpush/route.ts to include CheckoutRequestID.
    
    const { error: dbError } = await supabase
      .from('payments')
      .update({ 
        status, 
        mpesa_receipt: mpesaReceipt,
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
