"use client";
import { useState } from "react";
import Heading from "../../(components)/Heading";
import styles from "../profile.module.css";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [passwd, setPasswd] = useState("");
  const [isLoading, setLoading] = useState(false);

  const handleSubmit = async () => {};

  return (
    <div className={styles.page}>
      <form onSubmit={handleSubmit} className={styles.customForm}>
        <Heading text={"User,"} coloredText={"Welcome!"} />

        <label htmlFor="username">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            name="username"
          />
          <span>Username</span>
        </label>

        <label htmlFor="password">
          <input
            type="password"
            placeholder="Password"
            value={passwd}
            onChange={(e) => setPasswd(e.target.value)}
          />
          <span>Password</span>
        </label>

        <button type="submit" disabled={isLoading}>
          {"Login"}
        </button>
      </form>

      <hr />
      <div>OR</div>
    </div>
  );
}
