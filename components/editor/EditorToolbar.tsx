"use client";

import type { ReactNode } from "react";
import type { Editor } from "@tiptap/react";
import {
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Pilcrow,
  Redo2,
  Underline,
  Undo2,
} from "lucide-react";

type EditorToolbarProps = {
  editor: Editor | null;
};

type ToolbarButtonProps = {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
};

function ToolbarButton({
  label,
  active = false,
  disabled = false,
  onClick,
  children,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-md border text-sm transition ${
        active
          ? "border-teal-300 bg-teal-100 text-teal-700"
          : "border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-100"
      } disabled:cursor-not-allowed disabled:opacity-35`}
    >
      {children}
    </button>
  );
}

export default function EditorToolbar({
  editor,
}: EditorToolbarProps) {
  if (!editor) {
    return (
      <div className="h-14 border-b border-slate-200 bg-white" />
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-1 border-t border-slate-100 bg-white px-3 py-2">
      <ToolbarButton
        label="Undo"
        disabled={
          !editor
            .can()
            .chain()
            .focus()
            .undo()
            .run()
        }
        onClick={() =>
          editor.chain().focus().undo().run()
        }
      >
        <Undo2 className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarButton
        label="Redo"
        disabled={
          !editor
            .can()
            .chain()
            .focus()
            .redo()
            .run()
        }
        onClick={() =>
          editor.chain().focus().redo().run()
        }
      >
        <Redo2 className="h-4 w-4" />
      </ToolbarButton>

      <div className="mx-1 h-6 w-px bg-slate-200" />

      <ToolbarButton
        label="Paragraph"
        active={editor.isActive("paragraph")}
        onClick={() =>
          editor.chain().focus().setParagraph().run()
        }
      >
        <Pilcrow className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarButton
        label="Heading 1"
        active={editor.isActive("heading", {
          level: 1,
        })}
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleHeading({ level: 1 })
            .run()
        }
      >
        <Heading1 className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarButton
        label="Heading 2"
        active={editor.isActive("heading", {
          level: 2,
        })}
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleHeading({ level: 2 })
            .run()
        }
      >
        <Heading2 className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarButton
        label="Heading 3"
        active={editor.isActive("heading", {
          level: 3,
        })}
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleHeading({ level: 3 })
            .run()
        }
      >
        <Heading3 className="h-4 w-4" />
      </ToolbarButton>

      <div className="mx-1 h-6 w-px bg-slate-200" />

      <ToolbarButton
        label="Bold"
        active={editor.isActive("bold")}
        onClick={() =>
          editor.chain().focus().toggleBold().run()
        }
      >
        <Bold className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarButton
        label="Italic"
        active={editor.isActive("italic")}
        onClick={() =>
          editor.chain().focus().toggleItalic().run()
        }
      >
        <Italic className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarButton
        label="Underline"
        active={editor.isActive("underline")}
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleUnderline()
            .run()
        }
      >
        <Underline className="h-4 w-4" />
      </ToolbarButton>

      <div className="mx-1 h-6 w-px bg-slate-200" />

      <ToolbarButton
        label="Bulleted list"
        active={editor.isActive("bulletList")}
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleBulletList()
            .run()
        }
      >
        <List className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarButton
        label="Numbered list"
        active={editor.isActive("orderedList")}
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleOrderedList()
            .run()
        }
      >
        <ListOrdered className="h-4 w-4" />
      </ToolbarButton>
    </div>
  );
}