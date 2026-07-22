"use client";

import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import {
  fileNameToTitle,
  markdownToTiptap,
  plainTextToTiptap,
} from "@/lib/file-import";
import type {
  DemoUser,
  DocumentSummary,
  Notice,
  TiptapDocument,
} from "@/lib/types";

const MAXIMUM_FILE_SIZE = 1_000_000;

export function useDashboard() {
  const router = useRouter();

  const noticeTimerRef = useRef<number | null>(null);

  const [users, setUsers] = useState<DemoUser[]>([]);
  const [selectedUserId, setSelectedUserId] =
    useState("");

  const [documents, setDocuments] = useState<
    DocumentSummary[]
  >([]);

  const [usersLoading, setUsersLoading] =
    useState(true);

  const [documentsLoading, setDocumentsLoading] =
    useState(false);

  const [creating, setCreating] = useState(false);
  const [importing, setImporting] = useState(false);

  const [notice, setNotice] =
    useState<Notice | null>(null);

  const selectedUser = useMemo(
    () =>
      users.find(
        (user) => user.id === selectedUserId,
      ) ?? null,
    [users, selectedUserId],
  );

  const ownedDocuments = useMemo(
    () =>
      documents.filter(
        (document) =>
          document.accessType === "owned",
      ),
    [documents],
  );

  const sharedDocuments = useMemo(
    () =>
      documents.filter(
        (document) =>
          document.accessType === "shared",
      ),
    [documents],
  );

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

  const loadUsers = useCallback(async () => {
    try {
      setUsersLoading(true);

      const response = await fetch("/api/users", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ??
            "Failed to load demo users",
        );
      }

      const loadedUsers =
        result.users as DemoUser[];

      if (loadedUsers.length === 0) {
        throw new Error(
          "No demo users were found",
        );
      }

      setUsers(loadedUsers);

      const savedUserId =
        window.localStorage.getItem(
          "ajaia-selected-user-id",
        );

      const savedUserExists = loadedUsers.some(
        (user) => user.id === savedUserId,
      );

      setSelectedUserId(
        savedUserExists && savedUserId
          ? savedUserId
          : loadedUsers[0].id,
      );
    } catch (error) {
      showNotice({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to load demo users",
      });
    } finally {
      setUsersLoading(false);
    }
  }, [showNotice]);

  const loadDocuments = useCallback(async () => {
    if (!selectedUserId) {
      return;
    }

    try {
      setDocumentsLoading(true);

      const response = await fetch(
        "/api/documents",
        {
          headers: {
            "x-user-id": selectedUserId,
          },
          cache: "no-store",
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ??
            "Failed to load documents",
        );
      }

      setDocuments(
        result.documents as DocumentSummary[],
      );
    } catch (error) {
      setDocuments([]);

      showNotice({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to load documents",
      });
    } finally {
      setDocumentsLoading(false);
    }
  }, [selectedUserId, showNotice]);

  useEffect(() => {
    // Initial client-side API loading intentionally updates local state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    if (!selectedUserId) {
      return;
    }

    window.localStorage.setItem(
      "ajaia-selected-user-id",
      selectedUserId,
    );

    // Documents reload whenever the active demo user changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadDocuments();
  }, [selectedUserId, loadDocuments]);

  useEffect(() => {
    return () => {
      if (noticeTimerRef.current !== null) {
        window.clearTimeout(
          noticeTimerRef.current,
        );
      }
    };
  }, []);

  async function createDocumentRecord(
    title: string,
    content?: TiptapDocument,
    feedbackMessage?: string,
  ) {
    if (!selectedUserId) {
      throw new Error(
        "Select a demo user first",
      );
    }

    const response = await fetch(
      "/api/documents",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": selectedUserId,
        },
        body: JSON.stringify({
          title,
          content,
        }),
      },
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message ??
          "Failed to create document",
      );
    }

    const createdDocumentId =
      result.document.id as string;

    if (feedbackMessage) {
      window.sessionStorage.setItem(
        "ajaia-document-feedback",
        JSON.stringify({
          documentId: createdDocumentId,
          message: feedbackMessage,
        }),
      );
    }

    router.push(
      `/documents/${createdDocumentId}`,
    );
  }

  async function createNewDocument() {
    try {
      setCreating(true);

      await createDocumentRecord(
        "Untitled document",
        undefined,
        "New editable document created",
      );
    } catch (error) {
      showNotice({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to create document",
      });
    } finally {
      setCreating(false);
    }
  }

  async function importDocument(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) {
      return;
    }

    const extension = file.name
      .split(".")
      .pop()
      ?.toLowerCase();

    if (
      extension !== "txt" &&
      extension !== "md"
    ) {
      showNotice({
        type: "error",
        message:
          "Only .txt and .md files are supported",
      });

      return;
    }

    if (file.size > MAXIMUM_FILE_SIZE) {
      showNotice({
        type: "error",
        message:
          "The file must be smaller than 1 MB",
      });

      return;
    }

    try {
      setImporting(true);

      const text = await file.text();

      const content =
        extension === "md"
          ? markdownToTiptap(text)
          : plainTextToTiptap(text);

      await createDocumentRecord(
        fileNameToTitle(file.name),
        content,
        `Imported "${file.name}" as an editable document`,
      );
    } catch (error) {
      showNotice({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to import the file",
      });
    } finally {
      setImporting(false);
    }
  }

  function changeUser(userId: string) {
    setSelectedUserId(userId);
    setDocuments([]);
    setNotice(null);
  }

  function openDocument(documentId: string) {
    router.push(`/documents/${documentId}`);
  }

  return {
    users,
    selectedUser,
    selectedUserId,
    ownedDocuments,
    sharedDocuments,

    usersLoading,
    documentsLoading,
    creating,
    importing,
    notice,

    changeUser,
    createNewDocument,
    importDocument,
    loadDocuments,
    openDocument,
  };
}