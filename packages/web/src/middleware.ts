import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;

    if (pathname.startsWith("/wishocracy/")) {
      const identifier = pathname.replace("/wishocracy/", "");
      if (identifier) {
        const url = req.nextUrl.clone();
        url.pathname = "/wishocracy";
        url.search = `?ref=${encodeURIComponent(identifier)}`;
        return NextResponse.redirect(url);
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const authPaths = ["/dashboard", "/profile", "/admin"];
        const requiresAuth = authPaths.some((p) =>
          req.nextUrl.pathname.startsWith(p)
        );
        return requiresAuth ? !!token : true;
      },
    },
  }
);

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
};
