import { cookies } from "next/headers";

export function getSession() {
  const session = cookies().get("session")?.value;
  if (!session) return null;
  return session;
}

export async function getUser(token, tries = 0) {
  if (typeof token === "undefined") return null;

  // Fetch the user from pocketbase
  try {
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
  } catch (error) {
    if (tries >= 3) return JSON.stringify({});

    return await getUser(token, ++tries);
  }
}
