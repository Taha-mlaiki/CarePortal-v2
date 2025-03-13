import { NextResponse, NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";
interface jwtPayload {
  exp: number;
  role: "user" | "admin";
}
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value as string | undefined;
  if (!token && pathname !== "/auth/login" && pathname !== "/auth/login" ) {
    return 
  }
  if(token as string){
    const decoded = jwtDecode<jwtPayload>(token as string);
    if(decoded.role == "user" && pathname.startsWith("/admin")){
      return NextResponse.redirect(new URL("/unauthorized",request.url))
    }
    if(decoded.role == "admin" &&  pathname.startsWith("/user")){
      return NextResponse.redirect(new URL("/unauthorized",request.url))
    }
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
