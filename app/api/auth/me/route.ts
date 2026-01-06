import { NextRequest, NextResponse } from 'next/server';

const MEMBERSTACK_ADMIN_API = 'https://admin.memberstack.com';
const MEMBERSTACK_SECRET_KEY = process.env.MEMBERSTACK_SECRET_KEY;

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (token) {
      if (!MEMBERSTACK_SECRET_KEY) {
        return NextResponse.json(
          { error: 'Server configuration error' },
          { status: 500 }
        );
      }

      try {
        const decoded = Buffer.from(token, 'base64').toString('utf-8');
        const [memberId] = decoded.split(':');
        
        if (!memberId) {
          return NextResponse.json(
            { error: 'Invalid token' },
            { status: 401 }
          );
        }

        const memberResponse = await fetch(`${MEMBERSTACK_ADMIN_API}/members/${memberId}`, {
          method: 'GET',
          headers: {
            'X-API-KEY': MEMBERSTACK_SECRET_KEY,
            'Content-Type': 'application/json',
          },
        });

        if (!memberResponse.ok) {
          return NextResponse.json(
            { error: 'Member not found' },
            { status: 401 }
          );
        }

        const member = await memberResponse.json();

        return NextResponse.json({
          success: true,
          member: {
            id: member.id,
            auth: {
              email: member.auth?.email,
            },
            planConnections: member.planConnections || [],
          },
          token: token,
        });
      } catch (decodeError) {
        return NextResponse.json(
          { error: 'Invalid token format' },
          { status: 401 }
        );
      }
    }

    return NextResponse.json(
      { error: 'No authentication token provided' },
      { status: 401 }
    );
  } catch (error: any) {
    console.error('Get member error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get member' },
      { status: 401 }
    );
  }
}

