import Link from "next/link";
import React, { Suspense } from "react";
import { AuthButton } from "./auth-button";

export default function Navbar() {
  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
      <div className="w-full flex justify-between items-center p-3 px-5 text-sm">
        <div className="flex gap-5 items-center font-semibold">
          <Link href={"/"}>Secret Vault</Link>
          <div className="flex items-center gap-2">
            {/* <DeployButton /> */}
          </div>
        </div>
        <Suspense>
          <AuthButton />
        </Suspense>
      </div>
    </nav>
  );
}
