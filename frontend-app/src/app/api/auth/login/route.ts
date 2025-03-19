import { NextResponse } from 'next/server';
import { randomBytes, createHash } from 'crypto';

// Generate a random state parameter to protect against CSRF
function generateState(): string {
  return `state${randomBytes(32).toString('hex')}`;
}

// Generate a nonce to protect against replay attacks
function generateNonce(): string {
  return `nonce${randomBytes(32).toString('hex')}`;
}

// Generate a code verifier for PKCE
function generateCodeVerifier(): string {
  return randomBytes(32)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

// Generate a code challenge for PKCE (S256 method)
function generateCodeChallenge(verifier: string): string {
  return createHash('sha256')
    .update(verifier)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

export async function GET() {
  try {
    const state = generateState();
    const nonce = generateNonce();
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = generateCodeChallenge(codeVerifier);

    // Store state, nonce, and code verifier in cookies for validation during callback
    const stateExpirationDate = new Date();
    stateExpirationDate.setTime(stateExpirationDate.getTime() + 10 * 60 * 1000); // 10 minutes

    // Build France Connect authorization URL
    const clientId = process.env.FRANCE_CONNECT_CLIENT_ID;
    const redirectUri = process.env.FRANCE_CONNECT_REDIRECT_URI;
    const fcBaseUrl = process.env.FRANCE_CONNECT_ISSUER || 'https://fcp.integ01.dev-franceconnect.fr';
    const authorizePath = process.env.FRANCE_CONNECT_AUTHORIZE_PATH || '/api/v1/authorize';

    if (!clientId || !redirectUri) {
      return NextResponse.json(
        { error: 'France Connect configuration is missing' },
        { status: 500 }
      );
    }
    
    // Construct the full authorization URL from base URL and path
    const fullAuthorizeUrl = `${fcBaseUrl}${authorizePath}`;
    console.log('Full authorize URL:', fullAuthorizeUrl);
    const authUrl = new URL(fullAuthorizeUrl);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('client_id', clientId);
    authUrl.searchParams.append('redirect_uri', redirectUri);
    authUrl.searchParams.append('scope', 'openid email given_name family_name birthdate');
    authUrl.searchParams.append('state', state);
    authUrl.searchParams.append('nonce', nonce);
    // eidas1 is what's used in the working example
    authUrl.searchParams.append('acr_values', 'eidas1');
    authUrl.searchParams.append('prompt', 'login');  // Always ask for authentication
    authUrl.searchParams.append('code_challenge', codeChallenge);
    authUrl.searchParams.append('code_challenge_method', 'S256');

    // Log the full authorization URL for debugging
    const authUrlString = authUrl.toString();
    console.log('Authorization URL:', authUrlString);
    
    // We need to set cookies for the state and nonce
    const response = NextResponse.redirect(authUrlString);
    
    // Secure cookies for state, nonce, and code verifier
    response.cookies.set('fc_state', state, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: stateExpirationDate,
    });
    
    response.cookies.set('fc_nonce', nonce, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: stateExpirationDate,
    });
    
    response.cookies.set('fc_code_verifier', codeVerifier, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: stateExpirationDate,
    });

    return response;
  } catch (error) {
    console.error('Error in login route:', error);
    return NextResponse.json(
      { error: 'Failed to initiate authentication' },
      { status: 500 }
    );
  }
}