import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const { data, error } = await supabase
    .from('payments')
    .insert({
      phone: '254700000000',
      amount: 5,
      reference: 'TEST-NEXT-API',
      status: 'pending',
      checkout_request_id: 'test_req_next',
      full_name: 'Next JS Test Name'
    })
    .select();
    
  return NextResponse.json({ data, error });
}
