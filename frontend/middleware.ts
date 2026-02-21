import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

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
      new URL("/student/dashboard", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/student/:path*",        // protected routes
    "/auth/student-login",    // login page
  ],
};