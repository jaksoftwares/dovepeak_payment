import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const checkoutRequestId = searchParams.get('checkoutRequestId');

    console.log('check-status called with:', checkoutRequestId);

    if (!checkoutRequestId) {
      return NextResponse.json({ message: 'Checkout Request ID is required' }, { status: 400 });
    }

    if (!supabase) {
      console.error('Supabase client is null!');
      return NextResponse.json({ message: 'Database not configured' }, { status: 500 });
    }

    // First, let's try to get all payments to debug
    const { data: allPayments, error: listError } = await supabase
      .from('payments')
      .select('id, checkout_request_id, status')
      .order('created_at', { ascending: false })
      .limit(5);

    console.log('Recent payments:', allPayments);

    // Now try to find by checkout_request_id
    const { data: payment, error } = await supabase
      .from('payments')
      .select('*')
      .eq('checkout_request_id', checkoutRequestId)
      .maybeSingle();

    console.log('Query result:', { payment, error });

    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    if (!payment) {
      return NextResponse.json({ 
        status: 'not_found',
        searchedId: checkoutRequestId,
        recentIds: allPayments?.map((p: any) => p.checkout_request_id)
      }, { status: 404 });
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
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
