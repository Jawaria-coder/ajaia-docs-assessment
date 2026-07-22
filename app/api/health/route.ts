import { NextResponse } from "next/server";

import { getDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    const database = await getDatabase();

    await database.command({ ping: 1 });

    return NextResponse.json({
      success: true,
      message: "MongoDB connected successfully",
      database: database.databaseName,
    });
  } catch (error) {
    console.error("MongoDB health check failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "MongoDB connection failed",
      },
      { status: 500 },
    );
  }
}