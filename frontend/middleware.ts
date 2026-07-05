import { NextRequest, NextResponse } from "next/server";

// Routes that require the user to be logged in
const PROTECTED = ["/dashboard", "/generate", "/settings", "/product"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const isLoggedIn = req.cookies.get("hs_auth")?.value === "1";

  if (!isLoggedIn) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/generate/:path*", "/settings/:path*", "/product/:path*"],
};