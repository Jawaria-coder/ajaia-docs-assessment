function getDocumentField(
  document: unknown,
  fieldName: string,
): unknown {
  if (
    typeof document !== "object" ||
    document === null
  ) {
    return undefined;
  }

  return (document as Record<string, unknown>)[fieldName];
}

function idToString(value: unknown): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (
    typeof value === "object" &&
    "toString" in value &&
    typeof value.toString === "function"
  ) {
    return value.toString();
  }

  return String(value);
}

export function isDocumentOwner(
  document: unknown,
  userId: string,
): boolean {
  const ownerId = idToString(
    getDocumentField(document, "ownerId"),
  );

  return ownerId === userId;
}

export function canAccessDocument(
  document: unknown,
  userId: string,
): boolean {
  if (isDocumentOwner(document, userId)) {
    return true;
  }

  const sharedWith = getDocumentField(
    document,
    "sharedWith",
  );

  if (!Array.isArray(sharedWith)) {
    return false;
  }

  return sharedWith.some(
    (sharedUserId) =>
      idToString(sharedUserId) === userId,
  );
}