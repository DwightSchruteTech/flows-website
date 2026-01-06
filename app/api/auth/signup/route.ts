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

    // Initialize Memberstack SDK
    const ms = memberstack.init({
      publicKey: PUBLIC_KEY,
    });

    try {
      const result = await ms.signupMemberEmailPassword({
        email,
        password,
        plans: [{ planId: 'pln_free-xgrp0bsv' }], // Add free plan by default
      });

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
        { error: 'Signup failed' },
        { status: 400 }
      );
    } catch (signupError: any) {
      console.error('Memberstack signup error:', signupError);
      
      let errorMessage = 'Signup failed';
      if (signupError.message) {
        errorMessage = signupError.message;
      } else if (signupError.code === 'EMAIL_ALREADY_EXISTS') {
        errorMessage = 'An account with this email already exists';
      } else if (signupError.code === 'WEAK_PASSWORD') {
        errorMessage = 'Password is too weak. Please use a stronger password';
      }
      
      return NextResponse.json(
        { error: errorMessage },
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
