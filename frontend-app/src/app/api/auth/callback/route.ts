import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { jwtDecode } from 'jwt-decode';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters from the request
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    // Get stored state, nonce, and code verifier from cookies for verification
    const storedState = request.cookies.get('fc_state')?.value;
    const storedNonce = request.cookies.get('fc_nonce')?.value;
    const storedCodeVerifier = request.cookies.get('fc_code_verifier')?.value;

    // Validate state to prevent CSRF attacks
    if (!state || !storedState || state !== storedState) {
      return NextResponse.redirect(new URL('/auth/error?error=invalid_state', request.url));
    }

    if (!code) {
      return NextResponse.redirect(new URL('/auth/error?error=no_code', request.url));
    }
    
    if (!storedCodeVerifier) {
      return NextResponse.redirect(new URL('/auth/error?error=missing_code_verifier', request.url));
    }

    // Exchange code for tokens
    const clientId = process.env.FRANCE_CONNECT_CLIENT_ID;
    const clientSecret = process.env.FRANCE_CONNECT_CLIENT_SECRET;
    const redirectUri = process.env.FRANCE_CONNECT_REDIRECT_URI;
    
    // Build the token endpoint URL from base and path
    const fcBaseUrl = process.env.FRANCE_CONNECT_ISSUER || 'https://fcp.integ01.dev-franceconnect.fr';
    const tokenPath = process.env.FRANCE_CONNECT_TOKEN_PATH || '/api/v1/token';
    const tokenEndpoint = `${fcBaseUrl}${tokenPath}`;
    
    console.log('Token endpoint:', tokenEndpoint);

    if (!clientId || !clientSecret || !redirectUri || !tokenEndpoint) {
      return NextResponse.redirect(new URL('/auth/error?error=missing_config', request.url));
    }

    const tokenResponse = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        code_verifier: storedCodeVerifier,
      }),
    });

    if (!tokenResponse.ok) {
      let errorDetails;
      try {
        // Try to parse as JSON first
        errorDetails = await tokenResponse.json();
      } catch (e) {
        // If not JSON, get as text
        errorDetails = await tokenResponse.text();
      }
      console.error('Token exchange failed:', errorDetails);
      // Include status code in the error for better debugging
      return NextResponse.redirect(new URL(`/auth/error?error=token_exchange&status=${tokenResponse.status}`, request.url));
    }

    const tokens = await tokenResponse.json();
    if (!tokens.id_token) {
      return NextResponse.redirect(new URL('/auth/error?error=no_id_token', request.url));
    }

    // Decode the token for now
    // TODO: In a production implementation, we should verify the ID token signature with JWKS
    // This would involve fetching the JWKS from the FRANCE_CONNECT_JWKS_URI endpoint,
    // finding the key that matches the token's 'kid' header,
    // and using that key to verify the token signature
    const decodedToken: any = jwtDecode(tokens.id_token);
    
    // Log for debugging purposes
    console.log('Decoded token claims:', JSON.stringify(decodedToken, null, 2));
    
    // Get additional user information from the userinfo endpoint if available
    let userInfo = {};
    try {
      const fcBaseUrl = process.env.FRANCE_CONNECT_ISSUER || 'https://fcp.integ01.dev-franceconnect.fr';
      const userInfoPath = process.env.FRANCE_CONNECT_USERINFO_PATH || '/api/v1/userinfo';
      const userInfoEndpoint = `${fcBaseUrl}${userInfoPath}`;
      
      // Only attempt to get userinfo if we have an access token
      if (tokens.access_token) {
        console.log('Fetching user info from:', userInfoEndpoint);
        const userInfoResponse = await fetch(userInfoEndpoint, {
          headers: {
            'Authorization': `Bearer ${tokens.access_token}`
          }
        });
        
        if (userInfoResponse.ok) {
          userInfo = await userInfoResponse.json();
          console.log('User info from userinfo endpoint:', JSON.stringify(userInfo, null, 2));
        } else {
          console.error('Failed to get user info:', await userInfoResponse.text());
        }
      }
    } catch (error) {
      console.error('Error fetching userinfo:', error);
    }

    // Verify nonce to prevent replay attacks
    if (!storedNonce || decodedToken.nonce !== storedNonce) {
      return NextResponse.redirect(new URL('/auth/error?error=invalid_nonce', request.url));
    }

    // Merge data from ID token and userinfo endpoint
    const userData = {
      ...decodedToken,
      ...(userInfo as any),
    };

    // Create a session for the user, handling both V1 and V2 claim formats
    const sessionToken = jwt.sign(
      {
        user: {
          sub: userData.sub || '',
          given_name: userData.given_name || '',
          family_name: userData.family_name || '',
          birth_date: userData.birth || userData.birthdate || userData.birth_date || '',
          email: userData.email || '',
        },
        exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour expiration
      },
      process.env.NEXTAUTH_SECRET || 'your-secret-key'
    );

    // Redirect to dashboard with session token
    const response = NextResponse.redirect(new URL('/dashboard', request.url));
    
    // Set session cookie
    response.cookies.set('fc_session', sessionToken, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60, // 1 hour
    });

    // Clear state, nonce, and code verifier cookies
    response.cookies.delete('fc_state');
    response.cookies.delete('fc_nonce');
    response.cookies.delete('fc_code_verifier');

    return response;
  } catch (error) {
    console.error('Error in callback route:', error);
    return NextResponse.redirect(new URL('/auth/error?error=server_error', request.url));
  }
}