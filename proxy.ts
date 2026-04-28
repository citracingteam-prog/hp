import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "cit_admin_session";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // /admin 配下は /admin/login を除いて cookie 必須
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const cookie = req.cookies.get(SESSION_COOKIE)?.value;
    if (!cookie) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
