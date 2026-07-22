import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

import { createDocumentSchema } from "@/lib/document-schema";
import { getDatabase } from "@/lib/mongodb";
import { getRequestUserId } from "@/lib/request-user";

const emptyDocumentContent = {
  type: "doc",
  content: [
    {
      type: "paragraph",
    },
  ],
};

export async function GET(request: NextRequest) {
  try {
    const userId = getRequestUserId(request);

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "A valid user is required",
        },
        { status: 401 },
      );
    }

    const database = await getDatabase();
    const userObjectId = new ObjectId(userId);

    const documents = await database
      .collection("documents")
      .find({
        $or: [
          { ownerId: userObjectId },
          { sharedWith: userObjectId },
        ],
      })
      .sort({ updatedAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      documents: documents.map((document) => ({
        id: document._id.toString(),
        title: document.title,
        ownerId: document.ownerId.toString(),
        sharedWith: (document.sharedWith ?? []).map(
          (sharedUserId: ObjectId) => sharedUserId.toString(),
        ),
        accessType:
          document.ownerId.toString() === userId
            ? "owned"
            : "shared",
        createdAt: document.createdAt,
        updatedAt: document.updatedAt,
      })),
    });
  } catch (error) {
    console.error("Failed to fetch documents:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch documents",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getRequestUserId(request);

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "A valid user is required",
        },
        { status: 401 },
      );
    }

    const body = await request.json();
    const parsed = createDocumentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: parsed.error.issues[0]?.message ?? "Invalid document",
        },
        { status: 400 },
      );
    }

    const database = await getDatabase();
    const ownerId = new ObjectId(userId);

    const ownerExists = await database
      .collection("users")
      .findOne({ _id: ownerId });

    if (!ownerExists) {
      return NextResponse.json(
        {
          success: false,
          message: "User does not exist",
        },
        { status: 404 },
      );
    }

    const now = new Date();

    const document = {
      title: parsed.data.title,
      content: parsed.data.content ?? emptyDocumentContent,
      ownerId,
      sharedWith: [] as ObjectId[],
      createdAt: now,
      updatedAt: now,
    };

    const result = await database
      .collection("documents")
      .insertOne(document);

    return NextResponse.json(
      {
        success: true,
        document: {
          id: result.insertedId.toString(),
          title: document.title,
          content: document.content,
          ownerId: document.ownerId.toString(),
          sharedWith: [],
          accessType: "owned",
          createdAt: document.createdAt,
          updatedAt: document.updatedAt,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to create document:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create document",
      },
      { status: 500 },
    );
  }
}