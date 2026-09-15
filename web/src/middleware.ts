import { NextResponse, type NextRequest } from "next/server";

import { SESSION_COOKIE, verifySessionValue } from "@/lib/auth";

/**
 * Alles ist gesperrt, außer der Login-Seite, dem Login-Endpunkt und
 * statischen Assets. Es gibt bewusst keine "öffentliche" Doku-Route.
 */
const PUBLIC_PATHS = ["/login", "/api/login", "/api/logout", "/favicon.ico", "/robots.txt"];

function isPublic(pathname: string): boolean {
  return PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const session = await verifySessionValue(request.cookies.get(SESSION_COOKIE)?.value);

  if (isPublic(pathname)) {
    // Eingeloggte Nutzer brauchen die Login-Seite nicht mehr.
    if (pathname === "/login" && session) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (!session) {
    const loginUrl = new URL("/login", request.url);
    const target = `${pathname}${search}`;
    if (target !== "/") loginUrl.searchParams.set("next", target);

    const response = NextResponse.redirect(loginUrl);
    // Abgelaufenes oder manipuliertes Cookie gleich entfernen.
    response.cookies.delete(SESSION_COOKIE);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  // Statische Next-Assets und Bild-Optimierung ausnehmen, alles andere prüfen.
  matcher: ["/((?!_next/static|_next/image).*)"],
};
