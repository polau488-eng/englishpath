import { NextRequest, NextResponse } from "next/server";

// Routes that require authentication
const PROTECTED = ["/dashboard", "/lesson", "/api/progress", "/api/ai"];
// Routes only for non-authenticated users
const AUTH_ONLY  = ["/auth/login", "/auth/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for Supabase auth session cookie
  const supabaseSession =
    request.cookies.get("sb-access-token")?.value ||
    request.cookies.get("supabase-auth-token")?.value ||
    // Check any supabase cookie pattern
    [...request.cookies.getAll()].find(c => c.name.startsWith("sb-") && c.name.endsWith("-auth-token"))?.value;

  const isAuthenticated = !!supabaseSession;
  const isProtected = PROTECTED.some(route => pathname.startsWith(route));
  const isAuthOnly  = AUTH_ONLY.some(route => pathname.startsWith(route));

  // In development or when using mock data, skip auth middleware
  if (process.env.NODE_ENV === "development" && !process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("supabase.co")) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users away from protected routes
  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from login/register
  if (isAuthOnly && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes except static files and Next internals
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
