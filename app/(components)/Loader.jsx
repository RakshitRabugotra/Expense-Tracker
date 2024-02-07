import styles from "./component.module.css";

export default function Loader() {
  return (
    <div className={styles.loadingPage}>
      <h1>Loading</h1>
      <div className={styles.loader}></div>
    </div>
  );
}
