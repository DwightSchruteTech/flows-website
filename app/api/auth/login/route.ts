import { NextRequest, NextResponse } from 'next/server';

const MEMBERSTACK_ADMIN_API = 'https://admin.memberstack.com';
const MEMBERSTACK_SECRET_KEY = process.env.MEMBERSTACK_SECRET_KEY;

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

    // Memberstack doesn't provide direct password verification via Admin API
    // We need to use the public API endpoint for authentication
    // This is a workaround - in production, consider using Memberstack's webhook or session-based auth
    try {
      // Use Memberstack's public auth endpoint
      const authResponse = await fetch('https://api.memberstack.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Public-Key': process.env.NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY || 'pk_sb_921e54f1773946f5da41',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!authResponse.ok) {
        const errorData = await authResponse.json().catch(() => ({}));
        return NextResponse.json(
          { error: errorData.message || 'Invalid email or password' },
          { status: 401 }
        );
      }

      const authData = await authResponse.json();
      const memberId = authData.member?.id || authData.id;

      if (!memberId) {
        return NextResponse.json(
          { error: 'Login failed' },
          { status: 401 }
        );
      }

      // Get full member details from Admin API
      const memberResponse = await fetch(`${MEMBERSTACK_ADMIN_API}/members/${memberId}`, {
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

      const member = await memberResponse.json();

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
