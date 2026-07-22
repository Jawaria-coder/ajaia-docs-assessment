"use client";

import {
  type ChangeEvent,
  useRef,
} from "react";
import {
  LoaderCircle,
  Plus,
  Upload,
} from "lucide-react";

type WorkspaceActionsProps = {
  selectedUserName: string | null;
  creating: boolean;
  importing: boolean;
  actionsDisabled: boolean;
  onCreateDocument: () => void | Promise<void>;
  onFileSelected: (
    event: ChangeEvent<HTMLInputElement>,
  ) => void | Promise<void>;
};

export default function WorkspaceActions({
  selectedUserName,
  creating,
  importing,
  actionsDisabled,
  onCreateDocument,
  onFileSelected,
}: WorkspaceActionsProps) {
  const fileInputRef =
    useRef<HTMLInputElement>(null);

  return (
    <section className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-1 text-sm font-medium text-teal-600">
            Demo workspace
          </p>

          <h2 className="text-2xl font-bold tracking-tight">
            Welcome
            {selectedUserName
              ? `, ${selectedUserName}`
              : ""}
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Create a rich-text document, import an existing
            file, or open a document shared by another demo
            user.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.md,text/plain,text/markdown"
            onChange={(event) => {
              void onFileSelected(event);
            }}
            className="hidden"
          />

          <button
            type="button"
            onClick={() =>
              fileInputRef.current?.click()
            }
            disabled={
              actionsDisabled || importing || creating
            }
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-teal-300 hover:bg-teal-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {importing ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}

            {importing
              ? "Importing..."
              : "Import file"}
          </button>

          <button
            type="button"
            onClick={() => {
              void onCreateDocument();
            }}
            disabled={
              actionsDisabled || creating || importing
            }
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {creating ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}

            {creating
              ? "Creating..."
              : "New document"}
          </button>
        </div>
      </div>

      <div className="border-t border-slate-200 bg-slate-50 px-6 py-3 text-xs text-slate-500">
        File import supports `.txt` and `.md` files up to
        1 MB. Markdown headings and basic lists are
        preserved.
      </div>
    </section>
  );
}