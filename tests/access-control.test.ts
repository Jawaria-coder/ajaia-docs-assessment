import { describe, expect, it } from "vitest";

import {
  canAccessDocument,
  isDocumentOwner,
} from "../lib/access-control";

describe("document access control", () => {
  const ownerId = "507f1f77bcf86cd799439011";
  const sharedUserId = "507f1f77bcf86cd799439012";
  const unrelatedUserId = "507f1f77bcf86cd799439013";

  const document = {
    ownerId,
    sharedWith: [sharedUserId],
  };

  it("recognizes the document owner", () => {
    expect(isDocumentOwner(document, ownerId)).toBe(true);
  });

  it("does not treat a shared user as the owner", () => {
    expect(isDocumentOwner(document, sharedUserId)).toBe(false);
  });

  it("allows the owner to access the document", () => {
    expect(canAccessDocument(document, ownerId)).toBe(true);
  });

  it("allows a shared user to access the document", () => {
    expect(
      canAccessDocument(document, sharedUserId),
    ).toBe(true);
  });

  it("blocks an unrelated user", () => {
    expect(
      canAccessDocument(document, unrelatedUserId),
    ).toBe(false);
  });

  it("handles MongoDB-style IDs with toString methods", () => {
    const mongoStyleDocument = {
      ownerId: {
        toString: () => ownerId,
      },
      sharedWith: [
        {
          toString: () => sharedUserId,
        },
      ],
    };

    expect(
      canAccessDocument(mongoStyleDocument, ownerId),
    ).toBe(true);

    expect(
      canAccessDocument(
        mongoStyleDocument,
        sharedUserId,
      ),
    ).toBe(true);
  });
});