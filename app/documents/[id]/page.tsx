import type { Metadata } from "next";

import DocumentEditor from "@/components/DocumentEditor";

export const metadata: Metadata = {
  title: "Document",
};

export default function DocumentPage() {
  return <DocumentEditor />;
}