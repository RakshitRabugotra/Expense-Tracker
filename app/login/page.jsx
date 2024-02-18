'use client';
import { useState } from "react";
import Heading from "../(components)/Heading";
import styles from "./login.module.css";


export default function LoginPage() {

    const [username, setUsername] = useState("");
    const [passwd, setPasswd] = useState("");
    const [isLoading, setLoading] = useState(false);


    const handleSubmit = async() => {

    }

    return (<form onSubmit={handleSubmit} className={styles.createExpenseForm}>
        <Heading text={"User,"} coloredText={"Welcome!"} />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />  
        <input
          type="number"
          placeholder="Password"
          value={passwd}
          onChange={(e) => setPasswd(e.target.value)}
        />
  
        {isLoading ? (
          <div className={styles.loading}>Processing...</div>
        ) : (
          <button type="submit">{(patch ? "Update" : "Add") + " Login"}</button>
        )}
      </form>);
}