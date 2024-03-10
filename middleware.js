import { NextResponse } from "next/server";
import { cookies } from "next/headers";


async function clearSession(response) {
  return response;
}


export async function middleware(request) {
  const session = cookies().get("session")?.value;
  const path = request.nextUrl.pathname;

  console.log("path: ", path);

  // If the app is requesting for a login
  if(path.startsWith("/login")) {
    // Login the user
    const authorization = request.nextUrl.searchParams.get('token');
    // If the authorization is not provided then leave to the route
    if(typeof authorization === "undefined") return NextResponse.next();
    
    // Else login the user
    // Set the session token
    const res = NextResponse.redirect(new URL("/", request.url));
    res.cookies.set({
      name: "session",
      value: authorization,
      expires: new Date(Date.now() + 7 * 86_400_000),
      httpOnly: true
    });
    console.log("Logging in....");
    return res;
  }

  // If the path is logout and session is active
  if (path === "/logout") {
    // Clear all the cookies
    const res = NextResponse.redirect(new URL("/", request.url));
    res.cookies.set({
      name: "session",
      value: "",
      expires: new Date(0),
      httpOnly: true
    });
    console.log("Logging out....");
    return res;
  }

  // If the session is not active and we're not at /auth
  if (!session && path !== "/auth") {
    const url = new URL("/auth", request.url);
    const resp = NextResponse.redirect(url);
    console.log("Redirecting to auth....");
    return resp;
  }
  // If the session is not active, go to the next page
  if (!session) {
    console.log("Session is not defined...");
    // return NextResponse.redirect( new URL("/auth", request.url));
  }

  // Set a new expiration time for session
  const res = NextResponse.next();
  res.cookies.set({
    name: "session",
    value: request.cookies.get("session")?.value,
    httpOnly: true,
    expires: new Date(Date.now() + 7 * 86_400_000),
  });
  console.log("Setting the cookies....");
  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|public/|favicon.ico|robots.txt|sitemap.xml|manifest.json).*)",
  ],
};
