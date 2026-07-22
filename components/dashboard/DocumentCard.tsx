"use client";

import { FileText } from "lucide-react";

import type { DocumentSummary } from "@/lib/types";

type DocumentCardProps = {
  document: DocumentSummary;
  onOpen: (documentId: string) => void;
};

function formatDate(dateValue: string): string {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(dateValue));
}

export default function DocumentCard({
  document,
  onOpen,
}: DocumentCardProps) {
  return (
    <button
      type="button"
      onClick={() => onOpen(document.id)}
      className="group flex w-full items-center gap-4 rounded-xl border border-slate-200 p-4 text-left transition hover:border-teal-300 hover:bg-teal-50/50"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition group-hover:bg-teal-100 group-hover:text-teal-600">
        <FileText className="h-5 w-5" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-slate-800">
          {document.title}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          Updated {formatDate(document.updatedAt)}
        </p>

        {document.accessType === "owned" &&
        document.sharedWith.length > 0 ? (
          <p className="mt-1 text-xs text-teal-700">
            Shared with {document.sharedWith.length}{" "}
            {document.sharedWith.length === 1
              ? "person"
              : "people"}
          </p>
        ) : null}
      </div>

      <span
        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
          document.accessType === "owned"
            ? "bg-teal-50 text-teal-700"
            : "bg-emerald-50 text-emerald-700"
        }`}
      >
        {document.accessType === "owned"
          ? "Owner"
          : "Shared"}
      </span>
    </button>
  );
}