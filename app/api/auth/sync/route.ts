import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import initMemberstack from '@/lib/memberstack';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    try {
      // Decode token to get member ID
      const decoded = Buffer.from(token, 'base64').toString('utf-8');
      const [memberId] = decoded.split(':');
      
      if (!memberId) {
        return NextResponse.json(
          { error: 'Invalid token' },
          { status: 401 }
        );
      }

      // Initialize Memberstack to create a proper session
      // We'll use the member ID to authenticate via Memberstack Admin API
      // and then set up a session cookie that the website can use
      
      // For now, we'll store the member ID in a session cookie
      // The website's Memberstack SDK will handle the actual authentication
      const sessionData = {
        memberId: memberId,
        timestamp: Date.now()
      };

      const sessionToken = Buffer.from(JSON.stringify(sessionData)).toString('base64');

      // Set cookie for website session
      const cookieStore = await cookies();
      cookieStore.set('flows_session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });

      return NextResponse.json({
        success: true,
        message: 'Session synced successfully',
      });
    } catch (error: any) {
      console.error('Sync error:', error);
      return NextResponse.json(
        { error: 'Failed to sync session' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Sync error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to sync session' },
      { status: 500 }
    );
  }
}
