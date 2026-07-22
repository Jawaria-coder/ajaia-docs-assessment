"use client";

import type { ReactNode } from "react";
import { FilePlus2 } from "lucide-react";

import DocumentCard from "@/components/dashboard/DocumentCard";
import type { DocumentSummary } from "@/lib/types";

type DocumentSectionProps = {
  title: string;
  description: string;
  icon: ReactNode;
  documents: DocumentSummary[];
  emptyTitle: string;
  emptyDescription: string;
  onOpen: (documentId: string) => void;
};

export default function DocumentSection({
  title,
  description,
  icon,
  documents,
  emptyTitle,
  emptyDescription,
  onOpen,
}: DocumentSectionProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-teal-50 p-2 text-teal-600">
            {icon}
          </div>

          <div>
            <h3 className="font-bold">{title}</h3>

            <p className="mt-1 text-sm text-slate-500">
              {description}
            </p>
          </div>
        </div>

        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
          {documents.length}
        </span>
      </div>

      {documents.length === 0 ? (
        <div className="flex min-h-56 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 text-center">
          <FilePlus2 className="mb-3 h-8 w-8 text-slate-400" />

          <p className="font-semibold text-slate-700">
            {emptyTitle}
          </p>

          <p className="mt-1 max-w-xs text-sm leading-6 text-slate-500">
            {emptyDescription}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {documents.map((document) => (
            <DocumentCard
              key={document.id}
              document={document}
              onOpen={onOpen}
            />
          ))}
        </div>
      )}
    </section>
  );
}