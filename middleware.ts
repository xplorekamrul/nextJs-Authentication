import { type NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/utils/jwt";

const protectedRoutes = ["/home", "/admin", "/editor"];
const authRoutes = ["/signin", "/signup", "/verify-otp", "/forgot-password", "/reset-password"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth-token")?.value;

  // ✅ Safe token verification
  const payload = token ? verifyToken(token) : null;
  const isAuthenticated = !!payload;

  // ✅ Redirect authenticated users away from auth routes
  if (isAuthenticated && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // ✅ Protect routes that require auth
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    // ✅ Role-based access control
    const role = payload?.role;
    if (
      pathname.startsWith("/admin") &&
      role !== "admin" &&
      role !== "superAdmin"
    ) {
      return NextResponse.redirect(new URL("/home", request.url));
    }

    if (
      pathname.startsWith("/editor") &&
      !["editor", "admin", "superAdmin"].includes(role)
    ) {
      return NextResponse.redirect(new URL("/home", request.url));
    }
  }

  return NextResponse.next();
}
