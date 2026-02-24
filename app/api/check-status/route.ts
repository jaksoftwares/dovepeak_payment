import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const checkoutRequestId = searchParams.get('checkoutRequestId');

    if (!checkoutRequestId) {
      return NextResponse.json({ message: 'Checkout Request ID is required' }, { status: 400 });
    }

    const { data: payment, error } = await supabase
      .from('payments')
      .select('*')
      .eq('checkout_request_id', checkoutRequestId)
      .single();

    if (error || !payment) {
      return NextResponse.json({ status: 'not_found' }, { status: 404 });
    }

    return NextResponse.json({
      status: payment.status,
      phone: payment.phone,
      amount: payment.amount,
      reference: payment.reference,
      mpesa_receipt: payment.mpesa_receipt,
      updated_at: payment.updated_at,
    });

  } catch (error: any) {
    console.error('Check Payment Status Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
