import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasEnvVars } from "../utils";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  if (!hasEnvVars) {
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );

          response = NextResponse.next({ request });

          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  /* ================= ROOT (/) ================= */
  if (pathname === "/") {
    if (user) {
      const url = request.nextUrl.clone();
      url.pathname = "/protected/dashboard";
      return NextResponse.redirect(url);
    } else {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      return NextResponse.redirect(url);
    }
  }

  /* ================= AUTH ROUTES ================= */
  if (pathname.startsWith("/auth")) {
    if (user) {
      const url = request.nextUrl.clone();
      url.pathname = "/protected/dashboard";
      return NextResponse.redirect(url);
    }
    return response;
  }

  /* ================= PROTECTED ROUTES ================= */
  if (pathname.startsWith("/protected")) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      return NextResponse.redirect(url);
    }
  }

  return response;
}
