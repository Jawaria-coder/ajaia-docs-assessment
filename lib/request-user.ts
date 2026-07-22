import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";

export function getRequestUserId(request: NextRequest): string | null {
  const userId = request.headers.get("x-user-id");

  if (!userId || !ObjectId.isValid(userId)) {
    return null;
  }

  return userId;
}