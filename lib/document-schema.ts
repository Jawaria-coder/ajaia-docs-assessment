import { z } from "zod";

export const editorContentSchema = z.record(z.string(), z.unknown());

export const createDocumentSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(120, "Title must be 120 characters or fewer")
    .default("Untitled document"),
  content: editorContentSchema.optional(),
});

export const updateDocumentSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Title is required")
      .max(120, "Title must be 120 characters or fewer")
      .optional(),
    content: editorContentSchema.optional(),
  })
  .refine(
    (data) => data.title !== undefined || data.content !== undefined,
    {
      message: "Provide a title or document content",
    },
  );