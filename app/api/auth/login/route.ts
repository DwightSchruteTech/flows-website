import { NextRequest, NextResponse } from 'next/server';
import memberstack from '@memberstack/dom';

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

    const ms = memberstack.init({
      publicKey: PUBLIC_KEY,
    });

    try {
      const result = await ms.loginMemberEmailPassword({ email, password });

      if (result.data?.member) {
        const token = Buffer.from(`${result.data.member.id}:${Date.now()}`).toString('base64');

        return NextResponse.json({
          success: true,
          member: {
            id: result.data.member.id,
            auth: {
              email: result.data.member.auth?.email || email,
            },
            planConnections: result.data.member.planConnections || [],
          },
          token: token,
        });
      }

      return NextResponse.json(
        { error: 'Login failed' },
        { status: 401 }
      );
    } catch (loginError: any) {
      console.error('Memberstack login error:', loginError);
      
      let errorMessage = 'Invalid email or password';
      if (loginError.message) {
        errorMessage = loginError.message;
      } else if (loginError.code === 'INVALID_CREDENTIALS') {
        errorMessage = 'Invalid email or password';
      } else if (loginError.code === 'MEMBER_NOT_VERIFIED') {
        errorMessage = 'Please verify your email address first';
      }
      
      return NextResponse.json(
        { error: errorMessage },
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

