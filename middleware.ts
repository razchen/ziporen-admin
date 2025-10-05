import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const REFRESH_COOKIE = "refreshToken";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // (optional) dev log
  // console.log("[MW]", pathname);

  // Lightweight presence check
  const hasRefresh = !!req.cookies.get(REFRESH_COOKIE)?.value;
  if (!hasRefresh) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/signin";
    url.searchParams.set("next", pathname); // optional return-to
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Only run on protected routes; avoid static/_next noise
export const config = {
  matcher: ["/dashboard/:path*", "/users/:path*"],
};
