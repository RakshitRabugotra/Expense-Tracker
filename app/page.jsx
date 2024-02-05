import styles from "./page.module.css";

export default function Home() {

  const username = "Rakshit";

  return (
    <main className={styles.main}>

      <div className={styles.userHeading}>
        <div>Hello,</div>
        <h3>{username}!</h3>
      </div>

      {/* The box showing the graph */}
      <div className={styles.graphBox}>

      </div>
    </main>
  );
}
