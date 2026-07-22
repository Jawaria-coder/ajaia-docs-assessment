import type {
  TiptapDocument,
  TiptapNode,
  TiptapText,
} from "@/lib/types";

type EditorNode = TiptapNode | TiptapText;

function isTextNode(node: EditorNode): node is TiptapText {
  return node.type === "text" && "text" in node;
}

function renderText(node: TiptapText): string {
  let output = node.text;

  for (const mark of node.marks ?? []) {
    if (mark.type === "bold") {
      output = `**${output}**`;
    } else if (mark.type === "italic") {
      output = `*${output}*`;
    } else if (mark.type === "underline") {
      output = `<u>${output}</u>`;
    } else if (mark.type === "strike") {
      output = `~~${output}~~`;
    } else if (mark.type === "code") {
      output = `\`${output}\``;
    }
  }

  return output;
}

function renderChildren(node: TiptapNode): string {
  return (node.content ?? []).map(renderNode).join("");
}

function indent(text: string): string {
  return text
    .split("\n")
    .map((line) => `  ${line}`)
    .join("\n");
}

function renderList(node: TiptapNode, ordered: boolean): string {
  const start =
    typeof node.attrs?.start === "number"
      ? node.attrs.start
      : 1;

  return (node.content ?? [])
    .map((item, index) => {
      if (isTextNode(item)) {
        return "";
      }

      const prefix = ordered
        ? `${start + index}. `
        : "- ";

      const children = item.content ?? [];
      const first = children[0];
      const remaining = children.slice(1);

      const firstLine = first ? renderNode(first).trim() : "";

      const nested = remaining
        .map(renderNode)
        .filter(Boolean)
        .join("\n");

      return nested
        ? `${prefix}${firstLine}\n${indent(nested)}`
        : `${prefix}${firstLine}`;
    })
    .filter(Boolean)
    .join("\n");
}

function renderNode(node: EditorNode): string {
  if (isTextNode(node)) {
    return renderText(node);
  }

  switch (node.type) {
    case "doc":
      return (node.content ?? [])
        .map(renderNode)
        .filter(Boolean)
        .join("\n\n");

    case "paragraph":
      return renderChildren(node);

    case "heading": {
      const level =
        typeof node.attrs?.level === "number"
          ? Math.min(Math.max(node.attrs.level, 1), 6)
          : 1;

      return `${"#".repeat(level)} ${renderChildren(node)}`;
    }

    case "bulletList":
      return renderList(node, false);

    case "orderedList":
      return renderList(node, true);

    case "listItem":
      return renderChildren(node);

    case "blockquote":
      return renderChildren(node)
        .split("\n")
        .map((line) => `> ${line}`)
        .join("\n");

    case "codeBlock":
      return `\`\`\`\n${renderChildren(node)}\n\`\`\``;

    case "hardBreak":
      return "  \n";

    case "horizontalRule":
      return "---";

    default:
      return renderChildren(node);
  }
}

export function tiptapToMarkdown(
  document: TiptapDocument,
): string {
  return renderNode(document).trim();
}

export function downloadMarkdown(
  title: string,
  markdown: string,
): void {
  const safeTitle =
    title
      .trim()
      .replace(/[<>:"/\\|?*\u0000-\u001F]/g, "-")
      .slice(0, 80) || "document";

  const blob = new Blob([`${markdown}\n`], {
    type: "text/markdown;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);
  const link = window.document.createElement("a");

  link.href = url;
  link.download = `${safeTitle}.md`;

  window.document.body.appendChild(link);
  link.click();
  link.remove();

  window.setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 0);
}