import { NextResponse, type NextRequest } from "next/server";

// Middleware edge qui protège `/dashboard/**`. On vérifie la session auprès de
// l'API Express via le cookie `refresh_token` (HttpOnly). L'endpoint ne rotate
// pas le token — appel safe à chaque navigation.
//
// En prod (même container), l'API écoute sur 127.0.0.1:4000. En dehors du
// container, on passe par les rewrites Next `/api/auth/*` → Express.
const API_INTERNAL = process.env.API_INTERNAL_URL ?? "http://127.0.0.1:4000";

const redirectTo = (req: NextRequest, pathname: string) => {
  const url = req.nextUrl.clone();
  url.pathname = pathname;
  url.search = "";
  return NextResponse.redirect(url);
};

export async function middleware(req: NextRequest) {
  const cookie = req.headers.get("cookie");
  if (!cookie || !cookie.includes("refresh_token=")) {
    return redirectTo(req, "/signin");
  }

  try {
    const res = await fetch(`${API_INTERNAL}/auth/verify-session`, {
      headers: { cookie },
      cache: "no-store",
    });
    if (!res.ok) return redirectTo(req, "/signin");

    const { user } = (await res.json()) as { user?: { role?: string } };
    if (user?.role !== "ADMIN") return redirectTo(req, "/");

    return NextResponse.next();
  } catch {
    // API injoignable → on refuse plutôt que de laisser passer.
    return redirectTo(req, "/signin");
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
