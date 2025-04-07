import { NextResponse, NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  sub: number;
  role: { name: string };
  has_cabinet: boolean;
  is_paid: boolean;
  iat: number;
  exp: number;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  if (!token && pathname === "/auth") {
    return;
  }

  if (!token) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  // Decode JWT with error handling
  let decoded: JwtPayload;
  try {
    decoded = jwtDecode<JwtPayload>(token);
  } catch (error) {
    console.error("Invalid JWT:", error);
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  const role = decoded.role.name;

  if (pathname == "/auth" && token) {
    if (role === "manager") {
      return NextResponse.redirect(new URL("/manager/dashboard", request.url));
    }
    if (role === "patient") {
      return NextResponse.redirect(new URL("/patient/dashboard", request.url));
    }
  }
  // Manager-specific redirects
  if (pathname.startsWith("/manager") && role !== "manager") {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (pathname == "/create-cabinet" && role !== "manager") {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (pathname == "/pricing" && role !== "manager") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Patient-specific redirects
  if (pathname.startsWith("/patient") && role !== "patient") {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
