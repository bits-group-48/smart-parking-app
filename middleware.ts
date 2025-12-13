import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Check if accessing admin route
    if (req.nextUrl.pathname.startsWith("/admin")) {
      // Only allow if user is admin
      if (req.nextauth.token?.role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // For admin routes, check if user is admin
        if (req.nextUrl.pathname.startsWith("/admin")) {
          return token?.role === "admin";
        }
        // For other protected routes, just check if token exists
        return !!token;
      },
    },
    pages: {
      signIn: "/auth",
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/bookings/:path*",
    "/book/:path*",
    "/admin/:path*",
  ],
};

