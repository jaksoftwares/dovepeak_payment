const CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY || '';
const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET || '';
const SHORTCODE = process.env.MPESA_SHORTCODE || '';
const PASSKEY = process.env.MPESA_PASSKEY || '';
const CALLBACK_URL = process.env.MPESA_CALLBACK_URL || '';
const PARTY_B = process.env.MPESA_PARTY_B || '';
const ENV = process.env.MPESA_ENV || 'production'; // Defaulting to production based on user logs

const BASE_URL = ENV === 'production' 
  ? 'https://api.safaricom.co.ke' 
  : 'https://sandbox.safaricom.co.ke';

console.log('M-Pesa Config:', {
  CONSUMER_KEY: CONSUMER_KEY ? 'set' : 'missing',
  CONSUMER_SECRET: CONSUMER_SECRET ? 'set' : 'missing',
  SHORTCODE,
  PASSKEY: PASSKEY ? 'set' : 'missing',
  CALLBACK_URL,
  PARTY_B,
});

export async function getAccessToken() {
  if (!CONSUMER_KEY || !CONSUMER_SECRET) {
    throw new Error('M-Pesa credentials are not configured');
  }
  
  const url = `${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`;
  const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');

  console.log('OAuth Request:', {
    url,
    authHeader: `Basic ${auth.substring(0, 20)}...`,
    consumerKeyLength: CONSUMER_KEY.length,
    consumerSecretLength: CONSUMER_SECRET.length
  });

  const response = await fetch(url, {
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });

  const data = await response.json();
  
  console.log('OAuth Response Status:', response.status);
  console.log('OAuth Response:', data);
  
  if (!data.access_token) {
    throw new Error(`Failed to get access token: ${data.error || 'Unknown error'}`);
  }
  
  return data.access_token;
}

export async function sendStkPush(phone: string, amount: number, reference: string) {
  // Validate required config
  if (!CONSUMER_KEY || !CONSUMER_SECRET || !SHORTCODE || !PASSKEY) {
    throw new Error('M-Pesa configuration is incomplete. Please check your environment variables.');
  }
  
  const accessToken = await getAccessToken();
  const url = `${BASE_URL}/mpesa/stkpush/v1/processrequest`;
  
  const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
  const password = Buffer.from(`${SHORTCODE}${PASSKEY}${timestamp}`).toString('base64');

  const body = {
    BusinessShortCode: SHORTCODE,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: amount,
    PartyA: phone,
    PartyB: PARTY_B || SHORTCODE,
    PhoneNumber: phone,
    CallBackURL: CALLBACK_URL,
    AccountReference: reference,
    TransactionDesc: `Payment for ${reference}`,
  };

  console.log('STK Push Request:', JSON.stringify(body, null, 2));

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const responseData = await response.json();
  console.log('M-Pesa STK Push Response:', responseData);
  
  return responseData;
}
