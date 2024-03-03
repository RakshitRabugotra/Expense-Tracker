import { NextResponse } from "next/server";

export async function middleware(request) {
  const session = request.cookies.get("session")?.value;
  const path = request.nextUrl.pathname;

  // If the app is requesting for a login
  if(!session && path.startsWith("/login")) {
    // Login the user
    const authorization = request.nextUrl.searchParams.get('token');
    // If the authorization is not provided then leave to the route
    if(typeof authorization === "undefined") return NextResponse.next();
    
    // Else login the user
    // Set the session token
    const res = NextResponse.redirect(new URL("/profile", request.url));
    res.cookies.set({
      name: "session",
      value: authorization,
      expires: new Date(Date.now() + process.env.AUTH_TOKEN_LIFE),
      httpOnly: true
    });
    return res;
  }

  // If the path is logout and session is active
  if (session && path === "/logout") {
    // Clear all the cookies
    const res = NextResponse.redirect(new URL("/", request.url));
    res.cookies.set({
      name: "session",
      value: "",
      expires: new Date(0),
      httpOnly: true
    });
    return res;
  }

  // If the session is active and we go to auth, then clear the cookies
  if(session && path === "/auth") {
    const res = NextResponse.redirect(new URL("/auth", request.url));
    res.cookies.set({
      name: "session",
      value: "",
      expires: new Date(0),
      httpOnly: true
    });
    return res;
  }

  // If the session is not active and we're not at /auth
  if (!session && path !== "/auth") {
    const url = new URL("/auth", request.url);
    const resp = NextResponse.redirect(url);
    return resp;
  }
  // If the session is not active, go to the next page
  if (!session) return NextResponse.next();

  // Set a new expiration time for session
  const res = NextResponse.next();
  res.cookies.set({
    name: "session",
    value: request.cookies.get("session")?.value,
    httpOnly: true,
    expires: new Date(Date.now() + process.env.AUTH_TOKEN_LIFE),
  });
  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|public/|favicon.ico|robots.txt|sitemap.xml|manifest.json).*)",
  ],
};
