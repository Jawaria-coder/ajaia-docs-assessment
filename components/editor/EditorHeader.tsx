"use client";

import {
  ArrowLeft,
  Check,
  Download,
  FileText,
  LoaderCircle,
  Save,
  Share2,
  Trash2,
} from "lucide-react";

import type {
  DocumentAccessType,
} from "@/lib/types";

type EditorHeaderProps = {
  title: string;
  accessType: DocumentAccessType;
  sharedCount: number;
  saving: boolean;
  deleting: boolean;
  isDirty: boolean;
  lastSavedAt: Date | null;
  onTitleChange: (title: string) => void;
  onBack: () => void;
  onExport: () => void;
  onShare: () => void;
  onDelete: () => void | Promise<void>;
  onSave: () => void | Promise<void>;
};

export default function EditorHeader({
  title,
  accessType,
  sharedCount,
  saving,
  deleting,
  isDirty,
  lastSavedAt,
  onTitleChange,
  onBack,
  onExport,
  onShare,
  onDelete,
  onSave,
}: EditorHeaderProps) {
  const isOwner = accessType === "owned";

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between lg:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to documents"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-600 text-white">
          <FileText className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <input
            value={title}
            onChange={(event) =>
              onTitleChange(event.target.value)
            }
            maxLength={120}
            aria-label="Document title"
            className="w-full min-w-0 rounded-md border border-transparent bg-transparent px-2 py-1 text-lg font-bold outline-none transition hover:border-slate-200 focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100 sm:w-96"
          />

          <div className="flex flex-wrap items-center gap-2 px-2 text-xs text-slate-500">
            <span
              className={`rounded-full px-2 py-0.5 font-semibold ${
                isOwner
                  ? "bg-teal-50 text-teal-700"
                  : "bg-emerald-50 text-emerald-700"
              }`}
            >
              {isOwner
                ? "Owner"
                : "Shared access"}
            </span>

            <span>•</span>

            {saving ? (
              <span>Saving...</span>
            ) : isDirty ? (
              <span className="font-medium text-amber-600">
                Unsaved changes
              </span>
            ) : (
              <span className="inline-flex items-center gap-1">
                <Check className="h-3.5 w-3.5 text-emerald-600" />

                {lastSavedAt
                  ? `Saved at ${lastSavedAt.toLocaleTimeString(
                      [],
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}`
                  : "Saved"}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2">
        <button
          type="button"
          onClick={onExport}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-teal-300 hover:bg-teal-50"
        >
          <Download className="h-4 w-4" />

          <span className="hidden sm:inline">
            Export
          </span>
        </button>

        {isOwner ? (
          <button
            type="button"
            onClick={onShare}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-teal-200 bg-white px-3 py-2 text-sm font-semibold text-teal-700 transition hover:bg-teal-50"
          >
            <Share2 className="h-4 w-4" />

            <span className="hidden sm:inline">
              Share
            </span>

            {sharedCount > 0 ? (
              <span className="rounded-full bg-teal-100 px-1.5 py-0.5 text-xs">
                {sharedCount}
              </span>
            ) : null}
          </button>
        ) : null}

        {isOwner ? (
          <button
            type="button"
            onClick={() => {
              void onDelete();
            }}
            disabled={deleting}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deleting ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}

            <span className="hidden sm:inline">
              Delete
            </span>
          </button>
        ) : null}

        <button
          type="button"
          onClick={() => {
            void onSave();
          }}
          disabled={saving || !isDirty}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}

          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}