import styles from "./loader.module.css";

export default function Loader({ heading, context }) {
  return (
    <div className={styles.loadingPage}>
      {heading && <h1>{heading} {context && <span>{context}</span>}</h1>}
      <div className={styles.progressLoader}></div>
    </div>
  );
}
