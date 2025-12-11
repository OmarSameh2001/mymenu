import { NextRequest, NextResponse } from 'next/server';
import { AddMenuItem } from './controller';

export async function POST(req: NextRequest) {
  const response = await AddMenuItem(req);
  
  return response;
}

export async function GET(req: NextRequest) {
  return NextResponse.json(
    { message: 'Menu GET endpoint' },
    { status: 200 }
  );
}

export async function PATCH(req: NextRequest) {
  return NextResponse.json(
    { message: 'Menu PATCH endpoint' },
    { status: 200 }
  );
}

export async function DELETE(req: NextRequest) {
  return NextResponse.json(
    { message: 'Menu DELETE endpoint' },
    { status: 200 }
  );
}