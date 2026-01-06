import { NextRequest, NextResponse } from 'next/server';

const MEMBERSTACK_ADMIN_API = 'https://admin.memberstack.com';
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

    // First, find the member by email using Admin API
    try {
      // Search for member by email
      const searchResponse = await fetch(`${MEMBERSTACK_ADMIN_API}/members?email=${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
          'X-API-KEY': MEMBERSTACK_SECRET_KEY,
          'Content-Type': 'application/json',
        },
      });

      if (!searchResponse.ok) {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        );
      }

      const membersData = await searchResponse.json();
      const members = Array.isArray(membersData) ? membersData : membersData.members || [];
      const member = members.find((m: any) => m.auth?.email === email);

      if (!member) {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        );
      }

      // Verify password using Memberstack's public API
      // Note: Memberstack Admin API doesn't support password verification directly
      // We'll use a workaround: try to authenticate via the public endpoint
      const authResponse = await fetch('https://api.memberstack.com/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Public-Key': PUBLIC_KEY,
        },
        body: JSON.stringify({ 
          email, 
          password,
          appId: member.appId || undefined, // Include appId if available
        }),
      });

      if (!authResponse.ok) {
        const errorData = await authResponse.json().catch(() => ({}));
        return NextResponse.json(
          { error: errorData.message || 'Invalid email or password' },
          { status: 401 }
        );
      }

      // Get full member details from Admin API
      const memberResponse = await fetch(`${MEMBERSTACK_ADMIN_API}/members/${member.id}`, {
        method: 'GET',
        headers: {
          'X-API-KEY': MEMBERSTACK_SECRET_KEY,
          'Content-Type': 'application/json',
        },
      });

      if (!memberResponse.ok) {
        return NextResponse.json(
          { error: 'Failed to fetch member details' },
          { status: 401 }
        );
      }

      const fullMember = await memberResponse.json();

      // Generate a session token for the macOS app
      const token = Buffer.from(`${fullMember.id}:${Date.now()}`).toString('base64');

      return NextResponse.json({
        success: true,
        member: {
          id: fullMember.id,
          auth: {
            email: fullMember.auth?.email || email,
          },
          planConnections: fullMember.planConnections || [],
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
