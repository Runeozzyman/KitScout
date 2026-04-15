import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {

  const { pathname } = req.nextUrl;
  const hasSession = req.cookies
    .getAll()
    .some(cookie => cookie.name.startsWith("sb-"));

  if (hasSession && pathname === "/login") {
    return NextResponse.redirect(new URL("/", req.url));
  }
  
  if (!hasSession && pathname === "/wishlist"){
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [],
};