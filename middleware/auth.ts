import "server-only"

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

export interface AuthPayload {
  id: string;
  type: 'user' | 'admin';
  iat: number;
  exp: number;
}

// Authentication middleware for both users and admins
export async function authMiddleware(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;

    // Attach user info to request headers for use in controllers
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-user-id', decoded.id);
    requestHeaders.set('x-user-type', decoded.type);

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    return response;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    if (error instanceof jwt.TokenExpiredError) {
      return NextResponse.json(
        { error: 'Token expired' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    );
  }
}

// Admin-only middleware
export async function adminMiddleware(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;

    // Check if user is admin
    if (decoded.type !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Attach admin info to request headers
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-user-id', decoded.id);
    requestHeaders.set('x-user-type', decoded.type);

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    return response;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    if (error instanceof jwt.TokenExpiredError) {
      return NextResponse.json(
        { error: 'Token expired' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    );
  }
}
