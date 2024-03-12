import { NextResponse } from "next/server";
import {
  ResponseCookies,
  RequestCookies,
} from "next/dist/server/web/spec-extension/cookies";

/**
 * Copy cookies from the Set-Cookie header of the response to the Cookie header of the request,
 * so that it will appear to SSR/RSC as if the user already has the new cookies.
 */
function applySetCookie(req, res) {
  // 1. Parse Set-Cookie header from the response
  const setCookies = new ResponseCookies(res.headers);

  // 2. Construct updated Cookie header for the request
  const newReqHeaders = new Headers(req.headers);
  const newReqCookies = new RequestCookies(newReqHeaders);
  setCookies.getAll().forEach((cookie) => newReqCookies.set(cookie));

  // 3. Set up the “request header overrides” (see https://github.com/vercel/next.js/pull/41380)
  //    on a dummy response
  // NextResponse.next will set x-middleware-override-headers / x-middleware-request-* headers
  const dummyRes = NextResponse.next({ request: { headers: newReqHeaders } });

  // 4. Copy the “request header overrides” headers from our dummy response to the real response
  dummyRes.headers.forEach((value, key) => {
    if (
      key === "x-middleware-override-headers" ||
      key.startsWith("x-middleware-request-")
    ) {
      res.headers.set(key, value);
    }
  });
}

export default function middleware(request) {
  const sessionToken = request.cookies.get("session")?.value;
  const path = request.nextUrl.pathname;

  console.log("PATH: ", path);

  // If the path is logout and session is active
  if (path === "/logout") {
    // Clear all the cookies
    const res = NextResponse.redirect(new URL("/", request.url));
    res.cookies.set("session", "", {
      expires: new Date(0),
      httpOnly: true,
    });
    applySetCookie(request, res);
    return res;
  }

  // Path for logging in
  if (path.startsWith("/login")) {
    // Login the user
    const authToken = request.nextUrl.searchParams.get("token");
    // If the authorization is not provided then leave to the auth route
    if (typeof authToken === "undefined") {
      return NextResponse.redirect(new URL("/auth", request.url));
    }
    // Else do a successful login
    // Set the session token
    const res = NextResponse.redirect(new URL("/", request.url));
    res.cookies.set("session", authToken, {
      expires: new Date(Date.now() + 7 * 86_400_000),
      httpOnly: true,
    });
    // Apply the cookies
    applySetCookie(request, res);
    return res;
  }

  // If the session is not active and we're not at /auth
  if (!sessionToken && path !== "/auth") {
    const url = new URL("/auth", request.url);
    const res = NextResponse.redirect(url);
    // Delete the session cookie
    res.cookies.delete("session");
    return res;
  }

  if (sessionToken) {
    // Renew the session
    const res = NextResponse.next();
    res.cookies.set("session", sessionToken, {
      expires: new Date(Date.now() + 7 * 86_400_000),
      httpOnly: true,
      path: "/",
    });
    // Apply those cookies to the request
    applySetCookie(request, res);
    return res;
  }

  // Return the next response
  return NextResponse.next();
}

// export async function middleware(request) {
//   const session = cookies().get("session")?.value;
//   const path = request.nextUrl.pathname;

//   console.log("path: ", path);

//   // If the app is requesting for a login
//   if(path.startsWith("/login")) {
//     // Login the user
//     const authorization = request.nextUrl.searchParams.get('token');
//     // If the authorization is not provided then leave to the route
//     if(typeof authorization === "undefined") return NextResponse.next();

//     // Else login the user
//     // Set the session token
//     const res = NextResponse.redirect(new URL("/", request.url));
//     res.cookies.set({
//       name: "session",
//       value: authorization,
//       expires: new Date(Date.now() + 7 * 86_400_000),
//       httpOnly: true
//     });
//     console.log("Logging in....");
//     return res;
//   }

//   // If the path is logout and session is active
//   if (path === "/logout") {
//     // Clear all the cookies
//     const res = NextResponse.redirect(new URL("/", request.url));
//     res.cookies.set({
//       name: "session",
//       value: "",
//       expires: new Date(0),
//       httpOnly: true
//     });
//     console.log("Logging out....");
//     return res;
//   }

//   // If the session is not active and we're not at /auth
//   if (!session && path !== "/auth") {
//     const url = new URL("/auth", request.url);
//     const resp = NextResponse.redirect(url);
//     console.log("Redirecting to auth....");
//     return resp;
//   }
//   // If the session is not active, go to the next page
//   if (!session) {
//     console.log("Session is not defined...");
//     // return NextResponse.redirect( new URL("/auth", request.url));
//   }

//   // Set a new expiration time for session
//   const res = NextResponse.next();
//   res.cookies.set({
//     name: "session",
//     value: request.cookies.get("session")?.value,
//     httpOnly: true,
//     expires: new Date(Date.now() + 7 * 86_400_000),
//   });
//   console.log("Setting the cookies....");
//   return res;
// }

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|public/|favicon.ico|robots.txt|sitemap.xml|manifest.json).*)",
  ],
};
