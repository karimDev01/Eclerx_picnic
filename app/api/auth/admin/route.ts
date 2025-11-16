import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();

  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (username === adminUsername && password === adminPassword) {
    const response = NextResponse.json({ success: true });
    response.cookies.set('adminAuth', 'true', {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60,
    });
    return response;
  }

  return NextResponse.json({ success: false }, { status: 401 });
}
