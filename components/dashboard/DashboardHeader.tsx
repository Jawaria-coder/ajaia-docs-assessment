"use client";

import {
  ChevronDown,
  FileText,
  UserRound,
} from "lucide-react";

import type { DemoUser } from "@/lib/types";

type DashboardHeaderProps = {
  users: DemoUser[];
  selectedUserId: string;
  onUserChange: (userId: string) => void;
};

export default function DashboardHeader({
  users,
  selectedUserId,
  onUserChange,
}: DashboardHeaderProps) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm">
            <FileText className="h-6 w-6" />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight">
              Ajaia Docs
            </h1>

            <p className="text-sm text-slate-500">
              Lightweight collaborative document workspace
            </p>
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-1">
          <label
            htmlFor="demo-user"
            className="text-xs font-semibold uppercase tracking-wide text-slate-500"
          >
            Viewing as
          </label>

          <div className="relative">
            <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

            <select
              id="demo-user"
              value={selectedUserId}
              onChange={(event) =>
                onUserChange(event.target.value)
              }
              className="w-full min-w-64 appearance-none rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-10 text-sm font-medium outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            >
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} · {user.email}
                </option>
              ))}
            </select>

            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          </div>
        </div>
      </div>
    </header>
  );
}