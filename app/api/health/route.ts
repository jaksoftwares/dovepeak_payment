import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Force dynamic execution to prevent Next.js from caching the health check response
export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();
  
  try {
    // Perform a lightweight database operation to keep the project active
    // Even if RLS returns 0 rows, the query itself constitutes activity
    const { error: dbError } = await supabase
      .from('payments')
      .select('id')
      .limit(1);

    const endTime = Date.now();
    const durationMs = endTime - startTime;

    if (dbError) {
      console.error('[Health Check] Database error:', dbError);
      return NextResponse.json({
        status: 'unhealthy',
        service: 'Dovepeak Payments',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        error: 'Database connection failed',
        duration_ms: durationMs
      }, { status: 503 });
    }

    return NextResponse.json({
      status: 'healthy',
      service: 'Dovepeak Payments',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      duration_ms: durationMs
    }, { status: 200 });

  } catch (err: any) {
    console.error('[Health Check] Unexpected error:', err);
    return NextResponse.json({
      status: 'unhealthy',
      service: 'Dovepeak Payments',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      error: 'Unexpected server error',
      details: err.message
    }, { status: 500 });
  }
}
