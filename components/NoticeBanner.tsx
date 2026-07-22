"use client";

import {
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import type { Notice } from "@/lib/types";

type NoticeBannerProps = {
  notice: Notice | null;
  floating?: boolean;
};

export default function NoticeBanner({
  notice,
  floating = false,
}: NoticeBannerProps) {
  if (!notice) {
    return null;
  }

  const isSuccess = notice.type === "success";

  return (
    <div
      role={isSuccess ? "status" : "alert"}
      className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${
        floating
          ? "fixed right-5 top-28 z-40 max-w-sm shadow-lg"
          : "mb-6"
      } ${
        isSuccess
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-red-200 bg-red-50 text-red-800"
      }`}
    >
      {isSuccess ? (
        <CheckCircle2 className="h-5 w-5 shrink-0" />
      ) : (
        <AlertCircle className="h-5 w-5 shrink-0" />
      )}

      <span>{notice.message}</span>
    </div>
  );
}