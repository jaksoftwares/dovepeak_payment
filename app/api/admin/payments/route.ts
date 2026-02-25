import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    // In production, you would add authentication here
    // For now, we'll keep it simple

    if (!supabase) {
      return NextResponse.json({ message: 'Database not configured' }, { status: 500 });
    }

    // Fetch all payments ordered by most recent
    const { data: payments, error } = await supabase
      .from('payments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({
      payments: payments || []
    });

  } catch (error: any) {
    console.error('Admin Payments API Error:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
