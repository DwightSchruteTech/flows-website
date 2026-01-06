import { NextRequest, NextResponse } from 'next/server';

const MEMBERSTACK_API = 'https://api.memberstack.com';
const MEMBERSTACK_SECRET_KEY = process.env.MEMBERSTACK_SECRET_KEY;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY || 'pk_sb_921e54f1773946f5da41';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (!MEMBERSTACK_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Use Memberstack API to login
    // Note: We need to use the API endpoint that supports password verification
    try {
      // First, get the member by email to verify they exist
      const membersResponse = await fetch(`${MEMBERSTACK_API}/members?email=${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
          'X-API-KEY': MEMBERSTACK_SECRET_KEY,
          'Content-Type': 'application/json',
        },
      });

      if (!membersResponse.ok) {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        );
      }

      const membersData = await membersResponse.json();
      const members = Array.isArray(membersData) ? membersData : membersData.members || [];
      const member = members.find((m: any) => m.auth?.email === email);

      if (!member) {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        );
      }

      // For password verification, we'll use a workaround:
      // Try to authenticate via the public API endpoint
      // This is a simplified approach - in production, you'd want proper password hashing verification
      const authResponse = await fetch(`${MEMBERSTACK_API}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Public-Key': PUBLIC_KEY,
        },
        body: JSON.stringify({ email, password }),
      });

      if (!authResponse.ok) {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        );
      }

      const authData = await authResponse.json();

      // Generate a session token for the macOS app
      const token = Buffer.from(`${member.id}:${Date.now()}`).toString('base64');

      return NextResponse.json({
        success: true,
        member: {
          id: member.id,
          auth: {
            email: member.auth?.email || email,
          },
          planConnections: member.planConnections || [],
        },
        token: token,
      });
    } catch (loginError: any) {
      console.error('Memberstack login error:', loginError);
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error.message || 'Login failed' },
      { status: 401 }
    );
  }
}
