"use client";

import {
  FolderOpen,
  LoaderCircle,
  RefreshCw,
  Share2,
} from "lucide-react";

import NoticeBanner from "@/components/NoticeBanner";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DocumentSection from "@/components/dashboard/DocumentSection";
import WorkspaceActions from "@/components/dashboard/WorkspaceActions";
import { useDashboard } from "@/hooks/useDashboard";

export default function HomePage() {
  const {
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
  } = useDashboard();

  if (usersLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-slate-600">
          <LoaderCircle className="h-5 w-5 animate-spin" />
          <span>Loading Ajaia Docs...</span>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <DashboardHeader
        users={users}
        selectedUserId={selectedUserId}
        onUserChange={changeUser}
      />

      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <NoticeBanner notice={notice} />

        <WorkspaceActions
          selectedUserName={
            selectedUser?.name ?? null
          }
          creating={creating}
          importing={importing}
          actionsDisabled={!selectedUserId}
          onCreateDocument={createNewDocument}
          onFileSelected={importDocument}
        />

        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">
              Documents
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Owned and shared documents are kept
              clearly separated.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              void loadDocuments();
            }}
            disabled={
              documentsLoading ||
              !selectedUserId
            }
            aria-label="Refresh documents"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-teal-300 hover:bg-teal-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                documentsLoading
                  ? "animate-spin"
                  : ""
              }`}
            />

            Refresh
          </button>
        </div>

        {documentsLoading ? (
          <div className="flex min-h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <LoaderCircle className="h-5 w-5 animate-spin" />
              Loading documents...
            </div>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-2">
            <DocumentSection
              title="Owned by me"
              description="Documents created by the selected user"
              icon={
                <FolderOpen className="h-5 w-5" />
              }
              documents={ownedDocuments}
              emptyTitle="No owned documents"
              emptyDescription="Create a new document or import a file to get started."
              onOpen={openDocument}
            />

            <DocumentSection
              title="Shared with me"
              description="Documents another user has granted access to"
              icon={
                <Share2 className="h-5 w-5" />
              }
              documents={sharedDocuments}
              emptyTitle="Nothing shared yet"
              emptyDescription="Switch users after sharing a document to verify this flow."
              onOpen={openDocument}
            />
          </div>
        )}
      </div>
    </main>
  );
}