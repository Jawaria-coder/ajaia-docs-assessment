import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

import {
  canAccessDocument,
  isDocumentOwner,
} from "@/lib/access-control";
import { updateDocumentSchema } from "@/lib/document-schema";
import { getDatabase } from "@/lib/mongodb";
import { getRequestUserId } from "@/lib/request-user";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    const userId = getRequestUserId(request);
    const { id } = await context.params;

    if (!userId) {
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

    const database = await getDatabase();

    const document = await database
      .collection("documents")
      .findOne({ _id: new ObjectId(id) });

    if (!document) {
      return NextResponse.json(
        {
          success: false,
          message: "Document not found",
        },
        { status: 404 },
      );
    }

    if (!canAccessDocument(document, userId)) {
      return NextResponse.json(
        {
          success: false,
          message: "You do not have access to this document",
        },
        { status: 403 },
      );
    }

    return NextResponse.json({
      success: true,
      document: {
        id: document._id.toString(),
        title: document.title,
        content: document.content,
        ownerId: document.ownerId.toString(),
        sharedWith: (document.sharedWith ?? []).map(
          (sharedUserId: ObjectId) => sharedUserId.toString(),
        ),
        accessType: isDocumentOwner(document, userId)
          ? "owned"
          : "shared",
        createdAt: document.createdAt,
        updatedAt: document.updatedAt,
      },
    });
  } catch (error) {
    console.error("Failed to fetch document:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch document",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    const userId = getRequestUserId(request);
    const { id } = await context.params;

    if (!userId) {
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

    const body = await request.json();
    const parsed = updateDocumentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: parsed.error.issues[0]?.message ?? "Invalid update",
        },
        { status: 400 },
      );
    }

    const database = await getDatabase();
    const documentId = new ObjectId(id);

    const existingDocument = await database
      .collection("documents")
      .findOne({ _id: documentId });

    if (!existingDocument) {
      return NextResponse.json(
        {
          success: false,
          message: "Document not found",
        },
        { status: 404 },
      );
    }

    if (!canAccessDocument(existingDocument, userId)) {
      return NextResponse.json(
        {
          success: false,
          message: "You do not have permission to edit this document",
        },
        { status: 403 },
      );
    }

    const updates: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (parsed.data.title !== undefined) {
      updates.title = parsed.data.title;
    }

    if (parsed.data.content !== undefined) {
      updates.content = parsed.data.content;
    }

    await database.collection("documents").updateOne(
      { _id: documentId },
      {
        $set: updates,
      },
    );

    const updatedDocument = await database
      .collection("documents")
      .findOne({ _id: documentId });

    return NextResponse.json({
      success: true,
      document: {
        id: updatedDocument!._id.toString(),
        title: updatedDocument!.title,
        content: updatedDocument!.content,
        ownerId: updatedDocument!.ownerId.toString(),
        sharedWith: (updatedDocument!.sharedWith ?? []).map(
          (sharedUserId: ObjectId) => sharedUserId.toString(),
        ),
        accessType: isDocumentOwner(updatedDocument!, userId)
          ? "owned"
          : "shared",
        createdAt: updatedDocument!.createdAt,
        updatedAt: updatedDocument!.updatedAt,
      },
    });
  } catch (error) {
    console.error("Failed to update document:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update document",
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
    const userId = getRequestUserId(request);
    const { id } = await context.params;

    if (!userId) {
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

    const database = await getDatabase();
    const documentId = new ObjectId(id);

    const document = await database
      .collection("documents")
      .findOne({ _id: documentId });

    if (!document) {
      return NextResponse.json(
        {
          success: false,
          message: "Document not found",
        },
        { status: 404 },
      );
    }

    if (!isDocumentOwner(document, userId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Only the owner can delete this document",
        },
        { status: 403 },
      );
    }

    await database
      .collection("documents")
      .deleteOne({ _id: documentId });

    return NextResponse.json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete document:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete document",
      },
      { status: 500 },
    );
  }
}