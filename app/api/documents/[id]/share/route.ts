import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { isDocumentOwner } from "@/lib/access-control";
import { getDatabase } from "@/lib/mongodb";
import { getRequestUserId } from "@/lib/request-user";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type StoredDocument = {
  title: string;
  content: Record<string, unknown>;
  ownerId: ObjectId;
  sharedWith: ObjectId[];
  createdAt: Date;
  updatedAt: Date;
};

type StoredUser = {
  name: string;
  email: string;
};

const shareRequestSchema = z.object({
  userId: z.string().refine((value) => ObjectId.isValid(value), {
    message: "A valid target user is required",
  }),
});

async function parseRequestBody(request: NextRequest) {
  try {
    const body: unknown = await request.json();

    return shareRequestSchema.safeParse(body);
  } catch {
    return shareRequestSchema.safeParse({});
  }
}

export async function POST(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    const currentUserId = getRequestUserId(request);
    const { id } = await context.params;

    if (!currentUserId) {
      return NextResponse.json(
        {
          success: false,
          message: "A valid user is required",
        },
        { status: 401 },
      );
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid document ID",
        },
        { status: 400 },
      );
    }

    const parsed = await parseRequestBody(request);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            parsed.error.issues[0]?.message ??
            "A valid target user is required",
        },
        { status: 400 },
      );
    }

    const targetUserId = parsed.data.userId;

    if (targetUserId === currentUserId) {
      return NextResponse.json(
        {
          success: false,
          message: "The document owner already has access",
        },
        { status: 400 },
      );
    }

    const database = await getDatabase();

    const documentsCollection =
      database.collection<StoredDocument>("documents");

    const usersCollection =
      database.collection<StoredUser>("users");

    const documentId = new ObjectId(id);
    const targetUserObjectId = new ObjectId(targetUserId);

    const document = await documentsCollection.findOne({
      _id: documentId,
    });

    if (!document) {
      return NextResponse.json(
        {
          success: false,
          message: "Document not found",
        },
        { status: 404 },
      );
    }

    if (!isDocumentOwner(document, currentUserId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Only the owner can manage sharing",
        },
        { status: 403 },
      );
    }

    const targetUser = await usersCollection.findOne({
      _id: targetUserObjectId,
    });

    if (!targetUser) {
      return NextResponse.json(
        {
          success: false,
          message: "The selected user does not exist",
        },
        { status: 404 },
      );
    }

    await documentsCollection.updateOne(
      {
        _id: documentId,
      },
      {
        $addToSet: {
          sharedWith: targetUserObjectId,
        },
        $set: {
          updatedAt: new Date(),
        },
      },
    );

    const updatedDocument =
      await documentsCollection.findOne({
        _id: documentId,
      });

    if (!updatedDocument) {
      return NextResponse.json(
        {
          success: false,
          message: "Document could not be reloaded",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: `Document shared with ${targetUser.name}`,
      sharedWith: updatedDocument.sharedWith.map(
        (sharedUserId) => sharedUserId.toString(),
      ),
      updatedAt: updatedDocument.updatedAt,
    });
  } catch (error) {
    console.error("Failed to share document:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to share document",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    const currentUserId = getRequestUserId(request);
    const { id } = await context.params;

    if (!currentUserId) {
      return NextResponse.json(
        {
          success: false,
          message: "A valid user is required",
        },
        { status: 401 },
      );
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid document ID",
        },
        { status: 400 },
      );
    }

    const parsed = await parseRequestBody(request);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            parsed.error.issues[0]?.message ??
            "A valid target user is required",
        },
        { status: 400 },
      );
    }

    const database = await getDatabase();

    const documentsCollection =
      database.collection<StoredDocument>("documents");

    const documentId = new ObjectId(id);
    const targetUserObjectId = new ObjectId(
      parsed.data.userId,
    );

    const document = await documentsCollection.findOne({
      _id: documentId,
    });

    if (!document) {
      return NextResponse.json(
        {
          success: false,
          message: "Document not found",
        },
        { status: 404 },
      );
    }

    if (!isDocumentOwner(document, currentUserId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Only the owner can manage sharing",
        },
        { status: 403 },
      );
    }

    await documentsCollection.updateOne(
      {
        _id: documentId,
      },
      {
        $pull: {
          sharedWith: targetUserObjectId,
        },
        $set: {
          updatedAt: new Date(),
        },
      },
    );

    const updatedDocument =
      await documentsCollection.findOne({
        _id: documentId,
      });

    if (!updatedDocument) {
      return NextResponse.json(
        {
          success: false,
          message: "Document could not be reloaded",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Shared access removed",
      sharedWith: updatedDocument.sharedWith.map(
        (sharedUserId) => sharedUserId.toString(),
      ),
      updatedAt: updatedDocument.updatedAt,
    });
  } catch (error) {
    console.error("Failed to revoke document access:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to revoke document access",
      },
      { status: 500 },
    );
  }
}