async function simulateCallback() {
  const req = await fetch('http://localhost:3000/api/callback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      Body: {
        stkCallback: {
          MerchantRequestID: "123",
          CheckoutRequestID: "test_req_next",
          ResultCode: 0,
          ResultDesc: "The service request is processed successfully.",
          CallbackMetadata: {
            Item: [
              { Name: "Amount", Value: 5 },
              { Name: "MpesaReceiptNumber", Value: "REC123456" },
              { Name: "TransactionDate", Value: 20260625120000 },
              { Name: "PhoneNumber", Value: 254700000000 }
            ]
          }
        }
      }
    })
  });
  
  const text = await req.text();
  console.log('Response:', text);
}

simulateCallback();
