import { NextResponse } from "next/server";

import { demoUsers } from "@/lib/demo-users";
import { getDatabase } from "@/lib/mongodb";

export async function POST() {
  try {
    const database = await getDatabase();
    const usersCollection = database.collection("users");

    for (const user of demoUsers) {
      await usersCollection.updateOne(
        { email: user.email },
        {
          $set: user,
        },
        {
          upsert: true,
        },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Demo users created successfully",
      usersCreated: demoUsers.length,
    });
  } catch (error) {
    console.error("Failed to seed users:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create demo users",
      },
      { status: 500 },
    );
  }
}