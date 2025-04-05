import { NextResponse, NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";
interface jwtPayload {
  exp: number;
  role: {
    name: "patient" | "manager";
  };
}
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value as string | null;

  if (!token) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }
  const decoded = jwtDecode<jwtPayload>(token as string);
  const role = decoded.role.name;
  if (token && pathname == "/auth") {
    if (role == "patient") {
      return NextResponse.redirect(new URL("/patient/dashboard", request.url));
    } else if (role == "manager") {
      return NextResponse.redirect(new URL("/manager/dashboard", request.url));
    }
  }
  if (token && pathname.startsWith("/patient") && role !== "patient") {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (token && pathname.startsWith("/manager") && role !== "manager") {
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
