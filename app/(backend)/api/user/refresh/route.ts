import { NextRequest, NextResponse } from 'next/server';
import { refreshAccessToken } from '../controller';

export async function POST(req: NextRequest, res: NextResponse) {

  try {
    console.log(req.cookies);
    const token = await refreshAccessToken(req);
    console.log('New access token generated:', token);
    return token;
  } catch (error) {
    console.error('Refresh token error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
