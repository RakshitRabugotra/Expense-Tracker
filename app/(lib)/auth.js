import { cookies } from "next/headers";


export async function login(authToken) {
  // Create the session
  const expires = new Date(Date.now() + process.env.AUTH_TOKEN_LIFE);
  // Save the session in a cookie
  cookies().set("session", authToken, { expires, httpOnly: true });
}

export function getSession(request) {
  const session = request.cookies.get("session")?.value;
  if (!session) return null;
  return session;
}

export async function getUser(token) {
  if (typeof token === "undefined") return null;
  // Fetch the user from pocketbase
  const response = await fetch(
    process.env.SERVER + "/api/collections/users/auth-refresh",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    }
  );
  return await response.json();
}
