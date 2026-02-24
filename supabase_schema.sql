-- Create payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  reference TEXT NOT NULL UNIQUE,
  checkout_request_id TEXT UNIQUE,
  mpesa_receipt TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Optional but recommended)
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public inserts (for the STK push)
CREATE POLICY "Allow public insert" ON payments FOR INSERT WITH CHECK (true);

-- Create policy to allow public reads (for checking payment status)
CREATE POLICY "Allow public read" ON payments FOR SELECT USING (true);

-- Create policy to allow service role/backend to update
CREATE POLICY "Allow backend update" ON payments FOR UPDATE USING (true);
