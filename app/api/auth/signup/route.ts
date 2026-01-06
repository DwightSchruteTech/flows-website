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

    // Use Memberstack API to create a new member
    try {
      const signupResponse = await fetch(`${MEMBERSTACK_API}/members`, {
        method: 'POST',
        headers: {
          'X-API-KEY': MEMBERSTACK_SECRET_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          plans: [{ planId: 'pln_free-xgrp0bsv' }],
        }),
      });

      if (!signupResponse.ok) {
        const errorData = await signupResponse.json().catch(() => ({}));
        let errorMessage = 'Signup failed';
        
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (signupResponse.status === 409) {
          errorMessage = 'An account with this email already exists';
        }

        return NextResponse.json(
          { error: errorMessage },
          { status: signupResponse.status || 400 }
        );
      }

      const member = await signupResponse.json();

      // Generate session token
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
    } catch (signupError: any) {
      console.error('Memberstack signup error:', signupError);
      return NextResponse.json(
        { error: signupError.message || 'Signup failed' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: error.message || 'Signup failed' },
      { status: 400 }
    );
  }
}
