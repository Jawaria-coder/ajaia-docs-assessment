import { NextResponse } from "next/server";

import { getDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    const database = await getDatabase();

    const users = await database
      .collection("users")
      .find({})
      .sort({ name: 1 })
      .toArray();

    return NextResponse.json({
      success: true,
      users: users.map((user) => ({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      })),
    });
  } catch (error) {
    console.error("Failed to fetch users:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch users",
      },
      { status: 500 },
    );
  }
}