"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  AlertCircle,
  Check,
  LoaderCircle,
  Share2,
  UserMinus,
  UserPlus,
  X,
} from "lucide-react";

import type { DemoUser } from "@/lib/types";

type ShareDialogProps = {
  open: boolean;
  documentId: string;
  currentUserId: string;
  ownerId: string;
  sharedWith: string[];
  onClose: () => void;
  onSharedWithChange: (
    sharedWith: string[],
  ) => void;
};

export default function ShareDialog({
  open,
  documentId,
  currentUserId,
  ownerId,
  sharedWith,
  onClose,
  onSharedWithChange,
}: ShareDialogProps) {
  const [users, setUsers] = useState<DemoUser[]>([]);
  const [loading, setLoading] = useState(false);

  const [updatingUserId, setUpdatingUserId] =
    useState("");

  const [error, setError] = useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const shareableUsers = useMemo(
    () =>
      users.filter((user) => user.id !== ownerId),
    [users, ownerId],
  );

  const closeDialog = useCallback(() => {
    setError("");
    setSuccessMessage("");
    setUpdatingUserId("");
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) {
      return;
    }

    async function loadUsers() {
      try {
        setLoading(true);
        setError("");
        setSuccessMessage("");

        const response = await fetch("/api/users", {
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ??
              "Failed to load users",
          );
        }

        setUsers(result.users as DemoUser[]);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Failed to load users",
        );
      } finally {
        setLoading(false);
      }
    }


    void loadUsers();
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeDialog();
      }
    }

    window.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, [open, closeDialog]);

  async function changeAccess(
    targetUser: DemoUser,
    currentlyShared: boolean,
  ) {
    try {
      setUpdatingUserId(targetUser.id);
      setError("");
      setSuccessMessage("");

      const response = await fetch(
        `/api/documents/${documentId}/share`,
        {
          method: currentlyShared
            ? "DELETE"
            : "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": currentUserId,
          },
          body: JSON.stringify({
            userId: targetUser.id,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ??
            "Failed to update access",
        );
      }

      onSharedWithChange(
        result.sharedWith as string[],
      );

      setSuccessMessage(
        currentlyShared
          ? `Access removed for ${targetUser.name}`
          : `Shared successfully with ${targetUser.name}`,
      );
    } catch (accessError) {
      setError(
        accessError instanceof Error
          ? accessError.message
          : "Failed to update access",
      );
    } finally {
      setUpdatingUserId("");
    }
  }

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          closeDialog();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-dialog-title"
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
      >
        <header className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-teal-100 p-2.5 text-teal-700">
              <Share2 className="h-5 w-5" />
            </div>

            <div>
              <h2
                id="share-dialog-title"
                className="text-lg font-bold"
              >
                Share document
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Grant edit access to another demo user.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeDialog}
            aria-label="Close sharing dialog"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="px-6 py-5">
          {error ? (
            <div
              role="alert"
              className="mb-4 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            >
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          ) : null}

          {successMessage ? (
            <div
              role="status"
              className="mb-4 flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
            >
              <Check className="h-5 w-5 shrink-0" />
              <span>{successMessage}</span>
            </div>
          ) : null}

          {loading ? (
            <div className="flex min-h-48 items-center justify-center text-sm text-slate-500">
              <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
              Loading users...
            </div>
          ) : shareableUsers.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center text-sm text-slate-500">
              No other demo users are available.
            </div>
          ) : (
            <div className="space-y-3">
              {shareableUsers.map((user) => {
                const currentlyShared =
                  sharedWith.includes(user.id);

                const updating =
                  updatingUserId === user.id;

                return (
                  <div
                    key={user.id}
                    className="flex items-center gap-4 rounded-xl border border-slate-200 p-4 transition hover:border-teal-200 hover:bg-teal-50/30"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-teal-100 font-bold text-teal-700">
                      {user.name
                        .split(" ")
                        .map((part) => part[0])
                        .join("")
                        .slice(0, 2)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-slate-800">
                        {user.name}
                      </p>

                      <p className="truncate text-sm text-slate-500">
                        {user.email}
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={
                        updatingUserId !== "" &&
                        !updating
                      }
                      onClick={() => {
                        void changeAccess(
                          user,
                          currentlyShared,
                        );
                      }}
                      className={`inline-flex min-w-28 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                        currentlyShared
                          ? "border border-red-200 bg-white text-red-600 hover:bg-red-50"
                          : "bg-teal-600 text-white hover:bg-teal-700"
                      }`}
                    >
                      {updating ? (
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                      ) : currentlyShared ? (
                        <UserMinus className="h-4 w-4" />
                      ) : (
                        <UserPlus className="h-4 w-4" />
                      )}

                      {updating
                        ? "Updating"
                        : currentlyShared
                          ? "Remove"
                          : "Share"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <footer className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">
          <p className="inline-flex items-center gap-1.5 text-xs text-slate-500">
            <Check className="h-3.5 w-3.5" />
            Access changes apply immediately.
          </p>

          <button
            type="button"
            onClick={closeDialog}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-teal-300 hover:bg-teal-50"
          >
            Done
          </button>
        </footer>
      </section>
    </div>
  );
}