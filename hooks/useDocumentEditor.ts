"use client";

import Underline from "@tiptap/extension-underline";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import {
  downloadMarkdown,
  tiptapToMarkdown,
} from "@/lib/export-markdown";
import type {
  DocumentDetail,
  Notice,
  TiptapDocument,
} from "@/lib/types";

type PendingDocumentFeedback = {
  documentId: string;
  message: string;
};

const emptyDocument: TiptapDocument = {
  type: "doc",
  content: [
    {
      type: "paragraph",
    },
  ],
};

export function useDocumentEditor(
  documentId: string,
) {
  const router = useRouter();

  const noticeTimerRef = useRef<number | null>(null);

  const [selectedUserId, setSelectedUserId] =
    useState("");

  const [document, setDocument] =
    useState<DocumentDetail | null>(null);

  const [title, setTitle] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [shareDialogOpen, setShareDialogOpen] =
    useState(false);

  const [isDirty, setIsDirty] = useState(false);

  const [lastSavedAt, setLastSavedAt] =
    useState<Date | null>(null);

  const [notice, setNotice] =
    useState<Notice | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
    ],
    content: emptyDocument,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "document-editor min-h-[560px] w-full outline-none",
        spellcheck: "true",
      },
    },
    onUpdate: () => {
      setIsDirty(true);
      setNotice(null);
    },
  });

  const showNotice = useCallback(
    (nextNotice: Notice) => {
      if (noticeTimerRef.current !== null) {
        window.clearTimeout(
          noticeTimerRef.current,
        );
      }

      setNotice(nextNotice);

      noticeTimerRef.current =
        window.setTimeout(() => {
          setNotice(null);
          noticeTimerRef.current = null;
        }, 4000);
    },
    [],
  );

  const loadDocument = useCallback(
    async (userId: string) => {
      try {
        setLoading(true);
        setDocument(null);

        const response = await fetch(
          `/api/documents/${documentId}`,
          {
            headers: {
              "x-user-id": userId,
            },
            cache: "no-store",
          },
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ??
              "Failed to load document",
          );
        }

        const loadedDocument =
          result.document as DocumentDetail;

        setDocument(loadedDocument);
        setTitle(loadedDocument.title);

        setLastSavedAt(
          new Date(loadedDocument.updatedAt),
        );

        editor?.commands.setContent(
          loadedDocument.content ?? emptyDocument,
          {
            emitUpdate: false,
          },
        );

        setIsDirty(false);

        const pendingFeedback =
          window.sessionStorage.getItem(
            "ajaia-document-feedback",
          );

        if (pendingFeedback) {
          try {
            const parsed = JSON.parse(
              pendingFeedback,
            ) as PendingDocumentFeedback;

            if (
              parsed.documentId === loadedDocument.id
            ) {
              window.sessionStorage.removeItem(
                "ajaia-document-feedback",
              );

              showNotice({
                type: "success",
                message: parsed.message,
              });
            }
          } catch {
            window.sessionStorage.removeItem(
              "ajaia-document-feedback",
            );
          }
        }
      } catch (error) {
        showNotice({
          type: "error",
          message:
            error instanceof Error
              ? error.message
              : "Failed to load document",
        });
      } finally {
        setLoading(false);
      }
    },
    [documentId, editor, showNotice],
  );

  useEffect(() => {
    const storedUserId =
      window.localStorage.getItem(
        "ajaia-selected-user-id",
      );

    if (!storedUserId) {
      router.replace("/");
      return;
    }

    // Restoring the selected demo user from browser storage is intentional.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedUserId(storedUserId);
  }, [router]);

  useEffect(() => {
    if (!selectedUserId || !editor) {
      return;
    }

    // Document loading starts once the user and editor are ready.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadDocument(selectedUserId);
  }, [selectedUserId, editor, loadDocument]);

  useEffect(() => {
    function warnBeforeLeaving(
      event: BeforeUnloadEvent,
    ) {
      if (!isDirty) {
        return;
      }

      event.preventDefault();
    }

    window.addEventListener(
      "beforeunload",
      warnBeforeLeaving,
    );

    return () => {
      window.removeEventListener(
        "beforeunload",
        warnBeforeLeaving,
      );
    };
  }, [isDirty]);

  useEffect(() => {
    return () => {
      if (noticeTimerRef.current !== null) {
        window.clearTimeout(
          noticeTimerRef.current,
        );
      }
    };
  }, []);

  function changeTitle(nextTitle: string) {
    setTitle(nextTitle);
    setIsDirty(true);
    setNotice(null);
  }

  async function saveDocument() {
    if (
      !selectedUserId ||
      !document ||
      !editor ||
      saving
    ) {
      return;
    }

    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      showNotice({
        type: "error",
        message:
          "Document title cannot be empty",
      });

      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `/api/documents/${document.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": selectedUserId,
          },
          body: JSON.stringify({
            title: normalizedTitle,
            content: editor.getJSON(),
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ??
            "Failed to save document",
        );
      }

      const updatedDocument =
        result.document as DocumentDetail;

      setDocument(updatedDocument);
      setTitle(updatedDocument.title);
      setIsDirty(false);

      setLastSavedAt(
        new Date(
          updatedDocument.updatedAt ??
            Date.now(),
        ),
      );

      showNotice({
        type: "success",
        message:
          "Document saved successfully",
      });
    } catch (error) {
      showNotice({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to save document",
      });
    } finally {
      setSaving(false);
    }
  }

  async function deleteDocument() {
    if (
      !selectedUserId ||
      !document ||
      deleting ||
      document.accessType !== "owned"
    ) {
      return;
    }

    const confirmed = window.confirm(
      `Delete "${document.title}"? This cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);

      const response = await fetch(
        `/api/documents/${document.id}`,
        {
          method: "DELETE",
          headers: {
            "x-user-id": selectedUserId,
          },
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ??
            "Failed to delete document",
        );
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      showNotice({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to delete document",
      });

      setDeleting(false);
    }
  }

  function exportDocument() {
    if (!editor || !document) {
      return;
    }

    const markdown = tiptapToMarkdown(
      editor.getJSON() as TiptapDocument,
    );

    downloadMarkdown(
      title.trim() || document.title,
      markdown,
    );

    showNotice({
      type: "success",
      message:
        "Markdown file exported successfully",
    });
  }

  function updateSharedUsers(
    updatedSharedWith: string[],
  ) {
    setDocument((currentDocument) => {
      if (!currentDocument) {
        return currentDocument;
      }

      return {
        ...currentDocument,
        sharedWith: updatedSharedWith,
        updatedAt: new Date().toISOString(),
      };
    });
  }

  function goBack() {
    if (
      isDirty &&
      !window.confirm(
        "You have unsaved changes. Leave without saving?",
      )
    ) {
      return;
    }

    router.push("/");
  }

  return {
    editor,
    document,
    selectedUserId,
    title,

    loading,
    saving,
    deleting,
    isDirty,
    lastSavedAt,
    notice,
    shareDialogOpen,

    changeTitle,
    closeShareDialog: () =>
      setShareDialogOpen(false),
    deleteDocument,
    exportDocument,
    goBack,
    openShareDialog: () =>
      setShareDialogOpen(true),
    saveDocument,
    updateSharedUsers,
  };
}