export type DemoUser = {
  id: string;
  name: string;
  email: string;
};

export type Notice = {
  type: "success" | "error";
  message: string;
};

export type DocumentAccessType = "owned" | "shared";

export type TiptapMark = {
  type: string;
  attrs?: Record<string, unknown>;
};

export type TiptapText = {
  type: "text";
  text: string;
  marks?: TiptapMark[];
};

export type TiptapNode = {
  type: string;
  attrs?: Record<string, unknown>;
  content?: Array<TiptapNode | TiptapText>;
};

export type TiptapDocument = {
  type: "doc";
  content: TiptapNode[];
};

export type DocumentSummary = {
  id: string;
  title: string;
  ownerId: string;
  sharedWith: string[];
  accessType: DocumentAccessType;
  createdAt: string;
  updatedAt: string;
};

export type DocumentDetail = DocumentSummary & {
  content: TiptapDocument;
};