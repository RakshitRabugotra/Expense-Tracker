import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>

      <div className={styles.userHeading}>
        <h1>Hello Rakshit!</h1>
        <div className={styles.searchIcon}></div>
      </div>

      {/* The box showing the graph */}
      <div className={styles.graphBox}>

      </div>
    </main>
  );
}
