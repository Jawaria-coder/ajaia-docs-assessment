import type {
  TiptapDocument,
  TiptapNode,
  TiptapText,
} from "@/lib/types";

function textNode(text: string): TiptapText {
  return {
    type: "text",
    text,
  };
}

function paragraphNode(text: string): TiptapNode {
  return {
    type: "paragraph",
    content: text ? [textNode(text)] : undefined,
  };
}

function headingNode(text: string, level: number): TiptapNode {
  return {
    type: "heading",
    attrs: {
      level,
    },
    content: text ? [textNode(text)] : undefined,
  };
}

function listItemNode(text: string): TiptapNode {
  return {
    type: "listItem",
    content: [paragraphNode(text)],
  };
}

export function plainTextToTiptap(text: string): TiptapDocument {
  const lines = text.replace(/\r\n/g, "\n").split("\n");

  const content = lines.map((line) => paragraphNode(line));

  return {
    type: "doc",
    content: content.length > 0 ? content : [paragraphNode("")],
  };
}

export function markdownToTiptap(markdown: string): TiptapDocument {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const content: TiptapNode[] = [];

  let currentBulletItems: TiptapNode[] = [];
  let currentNumberedItems: TiptapNode[] = [];

  function flushBulletList() {
    if (currentBulletItems.length === 0) {
      return;
    }

    content.push({
      type: "bulletList",
      content: currentBulletItems,
    });

    currentBulletItems = [];
  }

  function flushNumberedList() {
    if (currentNumberedItems.length === 0) {
      return;
    }

    content.push({
      type: "orderedList",
      attrs: {
        start: 1,
        type: null,
      },
      content: currentNumberedItems,
    });

    currentNumberedItems = [];
  }

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    const headingMatch = line.match(/^(#{1,3})\s+(.+)$/);
    const bulletMatch = line.match(/^\s*[-*]\s+(.+)$/);
    const numberedMatch = line.match(/^\s*\d+\.\s+(.+)$/);

    if (bulletMatch) {
      flushNumberedList();
      currentBulletItems.push(listItemNode(bulletMatch[1]));
      continue;
    }

    if (numberedMatch) {
      flushBulletList();
      currentNumberedItems.push(listItemNode(numberedMatch[1]));
      continue;
    }

    flushBulletList();
    flushNumberedList();

    if (headingMatch) {
      content.push(
        headingNode(headingMatch[2], headingMatch[1].length),
      );
      continue;
    }

    content.push(paragraphNode(line));
  }

  flushBulletList();
  flushNumberedList();

  return {
    type: "doc",
    content: content.length > 0 ? content : [paragraphNode("")],
  };
}

export function fileNameToTitle(fileName: string): string {
  return fileName.replace(/\.(txt|md)$/i, "").trim() || "Imported document";
}