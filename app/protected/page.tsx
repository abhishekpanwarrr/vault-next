import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { InfoIcon } from "lucide-react";
import { FetchDataSteps } from "@/components/tutorial/fetch-data-steps";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

async function UserDetails() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return JSON.stringify(data.claims, null, 2);
}

export default function ProtectedPage() {
  return (
    <div className="flex-1 w-full flex flex-col gap-12 min-h-screen">
      <div className="max-w-7xl w-full mx-auto">
        <div className="bg-accent max-w-5xl mx-auto text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          This is a protected page that you can only see as an authenticated
          user
        </div>
        <div className="max-w-5xl mx-auto flex items-center justify-center">
          <Link href={"/protected/dashboard"}>
            <Button className="flex items-center gap-2 mt-8" size="sm">
              <svg
                className="h-3 w-3"
                viewBox="0 0 76 65"
                fill="hsl(var(--background)/1)"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" fill="inherit" />
              </svg>
              <span>Go to Dashboard</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
