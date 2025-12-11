import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../controller";
import { authMiddleware } from "@/app/(backend)/_middleware/auth";

export async function GET(req: NextRequest) {
  const authResult = await authMiddleware(req);
  if (authResult instanceof NextResponse && authResult.status !== 200) {
    return authResult;
  }
  return getCurrentUser(req);
}
