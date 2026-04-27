import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Perform a simple query to keep the database active
    const { data, error } = await supabase
      .from('payments')
      .select('id')
      .limit(1);

    if (error) throw error;

    return NextResponse.json({
      status: 'active',
      timestamp: new Date().toISOString(),
      message: 'Supabase project is active.'
    });
  } catch (error: any) {
    console.error('Keep-alive failed:', error);
    return NextResponse.json({
      status: 'error',
      message: error.message
    }, { status: 500 });
  }
}
