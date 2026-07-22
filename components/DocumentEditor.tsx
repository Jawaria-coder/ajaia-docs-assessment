"use client";

import { EditorContent } from "@tiptap/react";
import {
  AlertCircle,
  LoaderCircle,
} from "lucide-react";
import { useParams } from "next/navigation";

import NoticeBanner from "@/components/NoticeBanner";
import ShareDialog from "@/components/ShareDialog";
import EditorHeader from "@/components/editor/EditorHeader";
import EditorToolbar from "@/components/editor/EditorToolbar";
import { useDocumentEditor } from "@/hooks/useDocumentEditor";

export default function DocumentEditor() {
  const params = useParams<{
    id: string;
  }>();

  const {
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
    closeShareDialog,
    deleteDocument,
    exportDocument,
    goBack,
    openShareDialog,
    saveDocument,
    updateSharedUsers,
  } = useDocumentEditor(params.id);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="flex items-center gap-3 text-slate-600">
          <LoaderCircle className="h-5 w-5 animate-spin" />
          <span>Loading document...</span>
        </div>
      </main>
    );
  }

  if (!document) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-5">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <AlertCircle className="mx-auto h-10 w-10 text-red-500" />

          <h1 className="mt-4 text-xl font-bold">
            Document unavailable
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            {notice?.message ??
              "The document could not be opened."}
          </p>

          <button
            type="button"
            onClick={goBack}
            className="mt-6 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700"
          >
            Return to documents
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white shadow-sm">
        <EditorHeader
          title={title}
          accessType={document.accessType}
          sharedCount={document.sharedWith.length}
          saving={saving}
          deleting={deleting}
          isDirty={isDirty}
          lastSavedAt={lastSavedAt}
          onTitleChange={changeTitle}
          onBack={goBack}
          onExport={exportDocument}
          onShare={openShareDialog}
          onDelete={deleteDocument}
          onSave={saveDocument}
        />

        <EditorToolbar editor={editor} />
      </header>

      <NoticeBanner
        notice={notice}
        floating
      />

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <section className="min-h-175 rounded-sm border border-slate-200 bg-white px-8 py-12 shadow-sm sm:px-16">
          <EditorContent editor={editor} />
        </section>
      </div>

      <ShareDialog
        open={shareDialogOpen}
        documentId={document.id}
        currentUserId={selectedUserId}
        ownerId={document.ownerId}
        sharedWith={document.sharedWith}
        onClose={closeShareDialog}
        onSharedWithChange={updateSharedUsers}
      />
    </main>
  );
}