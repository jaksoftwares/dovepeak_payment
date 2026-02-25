import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'dovepeak2024';
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'aB3xK9mP2vL5qR8tW4yZ7cF6hJ3nM0pQ';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json({ message: 'Password is required' }, { status: 400 });
    }

    // Verify password
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ message: 'Invalid password' }, { status: 401 });
    }

    // Generate a secure token using both password and secret
    const token = crypto
      .createHash('sha256')
      .update(`${ADMIN_PASSWORD}-${ADMIN_SECRET}-${Date.now()}`)
      .digest('hex');

    // Create response with token
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      token
    });

    // Set token in HTTP-only cookie for security
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    return response;

  } catch (error: any) {
    console.error('Admin Login API Error:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Admin login endpoint' }, { status: 200 });
}
