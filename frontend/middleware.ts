import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  // Redirect root "/" to student dashboard
  if (pathname === "/") {
    return NextResponse.redirect(
      new URL("/student/student-dashboard", request.url)
    );
  }

  // Protect /student/* routes
  if (pathname.startsWith("/student")) {
    if (!token) {
      return NextResponse.redirect(
        new URL("/auth/student-login", request.url)
      );
    }
  }

  // Prevent logged-in users from accessing login page
  if (pathname.startsWith("/auth/student-login") && token) {
    return NextResponse.redirect(
      new URL("/student/student-dashboard", request.url)
    );
  }

  return NextResponse.next();
}

// Only ONE config export
export const config = {
  matcher: [
    "/",                       // root route
    "/student/:path*",          // protected routes
    "/auth/student-login",      // login page
  ],
};