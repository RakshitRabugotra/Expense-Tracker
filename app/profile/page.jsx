import styles from "./profile.module.css";
import Profile from "../(components)/Profile";
import { cookies } from "next/headers";
import { getUser } from "../(lib)/auth";

const NotLoggedIn = () => {
  return <div>Not Logged In</div>;
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
  const {record, token} = await getUser(session);

  if (typeof token === "undefined") return <NotLoggedIn />;

  return (
    <div className={styles.page}>
      <Profile user={record}>
        <div>Email: {record.email}</div>
      </Profile>
    </div>
  );
}
