"use client";

import { FC, ReactNode } from "react";
interface Props {
  children: ReactNode;
}
const DashboardLayout: FC<Props> = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r border-neutral-800 bg-neutral-900 px-4 py-2">
        <h2 className="mb-6 text-lg font-semibold">Secrets Vault</h2>

        <nav className="space-y-2 text-sm">
          <a
            href="/protected/dashboard"
            className="block text-neutral-300 hover:text-white"
          >
            Projects
          </a>
          <a
            href="/protected/dashboard/settings"
            className="block text-neutral-300 hover:text-white"
          >
            Settings
          </a>
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
};

export default DashboardLayout;
