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
      return NextResponse.json({ message: 'Invalid phone format' }, { status: 400 });
    }

    // 2. Generate a reference
    const reference = `DP-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    // 3. Send STK Push
    const stkResponse = await sendStkPush(phone, amount, reference);

    if (stkResponse.ResponseCode !== '0') {
      return NextResponse.json({ message: stkResponse.CustomerMessage || 'Failed to initiate STK Push' }, { status: 400 });
    }

    // 4. Save to Supabase
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
      console.error('Supabase Error:', dbError);
      // We still return success to the user since the STK push was sent
    }

    return NextResponse.json({ 
      message: 'STK Push initiated successfully',
      reference 
    });

  } catch (error: any) {
    console.error('STK Push API Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
