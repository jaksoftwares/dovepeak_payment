const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testUpdate() {
  const checkoutRequestID = 'test_req_next';
  
  // 1. Check current full_name
  const { data: before } = await supabase.from('payments').select('*').eq('checkout_request_id', checkoutRequestID).single();
  console.log('Before Update:', before.full_name);

  // 2. Perform exact updatePayload as in callback when extractedName is null
  const updatePayload = { 
    status: 'completed', 
    mpesa_receipt: 'REC123456',
    result_desc: 'The service request is processed successfully.',
    updated_at: new Date().toISOString()
  };
  
  const { data: updated, error } = await supabase
    .from('payments')
    .update(updatePayload)
    .eq('checkout_request_id', checkoutRequestID)
    .select()
    .single();

  console.log('Update Error:', error);
  console.log('After Update:', updated.full_name);
}

testUpdate();
