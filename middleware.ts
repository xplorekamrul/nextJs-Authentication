import { type NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/utils/jwt";

const protectedRoutes = ["/home", "/admin", "/editor"];
const authRoutes = [
  "/signin",
  "/signup",
  "/verify-otp",
  "/forgot-password",
  "/reset-password",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth-token")?.value;

  const payload = token ? verifyToken(token) : null;
  const isAuthenticated = !!payload;

  if (isAuthenticated && authRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    const role = payload?.role;
    if (pathname.startsWith("/admin") && !["admin", "superAdmin"].includes(role)) {
      return NextResponse.redirect(new URL("/home", request.url));
    }

    if (pathname.startsWith("/editor") && !["editor", "admin", "superAdmin"].includes(role)) {
      return NextResponse.redirect(new URL("/home", request.url));
    }
  }

  return NextResponse.next();
}

// ✅ THIS IS REQUIRED!

