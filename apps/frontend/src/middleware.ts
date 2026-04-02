import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  
  // SEO Redirect: www para root
  if (request.headers.get("host")?.startsWith("www.agonimports.com")) {
    url.hostname = "agonimports.com";
    return NextResponse.redirect(url, 301);
  }

  const token = request.cookies.get("vitta_token")?.value;
  const pathname = url.pathname;

  // Rotas que requerem autenticação
  const protectedRoutes = ["/checkout", "/admin"];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute && !token) {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Se o usuário já está logado e tenta ir para login/register, manda pro home
  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/cadastro");
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/checkout/:path*",
    "/admin/:path*",
    "/login",
    "/cadastro"
  ],
};
