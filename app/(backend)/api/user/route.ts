import { NextRequest, NextResponse } from 'next/server';
import {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  changeUserType,
  deleteUser,
  getCurrentUser,
} from './controller';
import { authMiddleware, adminMiddleware } from '@/app/(backend)/_middleware/auth';

export async function POST(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
    console.log(pathname);
  if (pathname.endsWith('/register')) {
    return registerUser(req);
  }

  if (pathname.endsWith('/login')) {
    return loginUser(req);
  }


  return NextResponse.json(
    { error: 'Not found' },
    { status: 404 }
  );
}

export async function GET(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const segments = pathname.split('/');
  const userId = segments[segments.length - 1];

  // Get current user
  if (pathname.endsWith('/me')) {
    const authResult = await authMiddleware(req);
    if (authResult instanceof NextResponse && authResult.status !== 200) {
      return authResult;
    }
    return getCurrentUser(req);
  }

  // Get all users (admin only)
  if (pathname.endsWith('/users')) {
    const adminResult = await adminMiddleware(req);
    if (adminResult instanceof NextResponse && adminResult.status !== 200) {
      return adminResult;
    }
    return getAllUsers(req);
  }

  // Get user by ID (admin or own profile)
  if (userId && userId !== 'users' && userId !== 'me' && userId !== 'register' && userId !== 'login') {
    const authResult = await authMiddleware(req);
    if (authResult instanceof NextResponse && authResult.status !== 200) {
      return authResult;
    }
    return getUserById(req, userId);
  }

  return NextResponse.json(
    { error: 'Not found' },
    { status: 404 }
  );
}

export async function PUT(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const segments = pathname.split('/');
  const userId = segments[segments.length - 1];

  if (!userId || userId === 'user' || userId === 'api') {
    return NextResponse.json(
      { error: 'User ID required' },
      { status: 400 }
    );
  }

  const authResult = await authMiddleware(req);
  if (authResult instanceof NextResponse && authResult.status !== 200) {
    return authResult;
  }

  return updateUser(req, userId);
}

export async function PATCH(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const segments = pathname.split('/');

  // Change user type (admin only)
  if (pathname.includes('/type/')) {
    const adminResult = await adminMiddleware(req);
    if (adminResult instanceof NextResponse && adminResult.status !== 200) {
      return adminResult;
    }

    const userId = segments[segments.length - 2];
    return changeUserType(req, userId);
  }

  return NextResponse.json(
    { error: 'Not found' },
    { status: 404 }
  );
}

export async function DELETE(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const segments = pathname.split('/');
  const userId = segments[segments.length - 1];

  if (!userId || userId === 'user' || userId === 'api') {
    return NextResponse.json(
      { error: 'User ID required' },
      { status: 400 }
    );
  }

  const adminResult = await adminMiddleware(req);
  if (adminResult instanceof NextResponse && adminResult.status !== 200) {
    return adminResult;
  }

  return deleteUser(req, userId);
}
