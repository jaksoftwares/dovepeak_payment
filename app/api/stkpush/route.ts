import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendStkPush } from '@/lib/mpesa';
import { isValidPhone } from '@/lib/utils';

export async function POST(req: NextRequest) {
  try {
    const { phone, amount } = await req.json();

    // 1. Validate
    if (!phone || !amount) {
      return NextResponse.json({ message: 'Phone and amount are required' }, { status: 400 });
    }

    if (!isValidPhone(phone)) {
      console.log('Payment Request - Invalid phone:', { phone, amount });
      return NextResponse.json({ message: 'Invalid phone format' }, { status: 400 });
    }

    // 2. Generate a reference
    const reference = `DP-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    // 3. Send STK Push
    const stkResponse = await sendStkPush(phone, amount, reference);

    console.log('STK Push Response:', stkResponse);

    if (stkResponse.ResponseCode !== '0') {
      const errorMessage = stkResponse.errorMessage || stkResponse.CustomerMessage || 'Failed to initiate STK Push';
      console.error('STK Push Error:', errorMessage);
      return NextResponse.json({ message: errorMessage, details: stkResponse }, { status: 400 });
    }

    // 4. Save to Supabase
    console.log('Saving to Supabase:', {
      phone,
      amount,
      reference,
      checkoutRequestId: stkResponse.CheckoutRequestID
    });
    
    if (!supabase) {
      console.error('Supabase client is null!');
    } else {
      const { error: dbError } = await supabase
        .from('payments')
        .insert({
          phone,
          amount,
          reference,
          status: 'pending',
          mpesa_receipt: null,
          checkout_request_id: stkResponse.CheckoutRequestID,
        });

      if (dbError) {
        console.error('Supabase Insert Error:', dbError);
      } else {
        console.log('Payment saved to Supabase successfully');
      }
    }

    return NextResponse.json({ 
      message: 'STK Push initiated successfully',
      reference,
      checkoutRequestId: stkResponse.CheckoutRequestID
    });

  } catch (error: any) {
    console.error('STK Push API Error:', error);
    const errorMessage = error.message || 'Internal Server Error';
    return NextResponse.json({ message: errorMessage, details: error.toString() }, { status: 500 });
  }
}
