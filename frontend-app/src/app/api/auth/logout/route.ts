import { NextResponse } from 'next/server';

export async function POST() {
  // Clear the session cookie
  const response = NextResponse.json({ success: true });
  response.cookies.delete('fc_session');
  return response;
}