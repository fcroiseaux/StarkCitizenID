import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Get the current auth session
export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('fc_session')?.value;

    if (!sessionToken) {
      return NextResponse.json({ authenticated: false });
    }

    try {
      // Verify and decode the session token
      const decoded = jwt.verify(
        sessionToken,
        process.env.NEXTAUTH_SECRET || 'your-secret-key'
      ) as { user: any };

      return NextResponse.json({
        authenticated: true,
        user: decoded.user,
      });
    } catch (tokenError) {
      // Token is invalid or expired
      const response = NextResponse.json({ authenticated: false });
      response.cookies.delete('fc_session');
      return response;
    }
  } catch (error) {
    console.error('Error in session route:', error);
    return NextResponse.json(
      { error: 'Failed to get session' },
      { status: 500 }
    );
  }
}