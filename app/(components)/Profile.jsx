"use client";
import { useRouter } from "next/navigation";
import Heading from "./Heading";

export default function Profile({ user, children }) {
  // To change the url of the application
  const router = useRouter();

  const handleLogout = async (e) => {
    e.preventDefault();
    router.replace("/logout");
    router.refresh();
  };

  return (
    <div>
      <Heading text={"Welcome"} coloredText={user.username} />
      {children}
      <form onSubmit={handleLogout}>
        <button type="submit">Logout</button>
      </form>
    </div>
  );
}
