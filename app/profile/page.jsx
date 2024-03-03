import styles from "./profile.module.css";
import Profile from "../(components)/Profile";
import { cookies } from "next/headers";
import { getUser } from "../(lib)/auth";
import Link from "next/link";

const NotLoggedIn = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "24px",
        gap: "24px",
        alignItems: "center",
        fontSize: "48px",
        fontWeight: "bold",
        color: "var(--olive)",
        marginBottom: "var(--navbar-height)",
      }}
    >
      Not Logged In
      <Link
        className="redirect-links"
        href="/"
        style={{
          position: "absolute",
          bottom: 0,
          marginBottom: "calc(2*var(--navbar-height))",
          width: "calc(100% - 2 * 24px)"
        }}
      >
        Retry
      </Link>
    </div>
  );
};

/*
"record": {
    "id": "RECORD_ID",
    "collectionId": "_pb_users_auth_",
    "collectionName": "users",
    "username": "username123",
    "verified": false,
    "emailVisibility": true,
    "email": "test@example.com",
    "created": "2022-01-01 01:00:00.123Z",
    "updated": "2022-01-01 23:59:59.456Z",
    "name": "test",
    "avatar": "filename.jpg"
  }
*/

export default async function ProfilePage() {
  // Check if the user is logged in?
  const session = cookies().get("session")?.value;
  const { record, token } = await getUser(session);

  if (typeof token === "undefined") return <NotLoggedIn />;

  return (
    <div className={styles.page}>
      <Profile user={record}>
        <div>Email: {record.email}</div>
      </Profile>
    </div>
  );
}
