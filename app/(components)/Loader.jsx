import styles from "./component.module.css";

export default function Loader({ context }) {
  return (
    <div className={styles.loadingPage}>
      <h1>Loading {context && <span>{context}</span>}</h1>
      <div className={styles.loader}></div>
    </div>
  );
}
