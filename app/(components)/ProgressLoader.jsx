import styles from "./loader.module.css";

export default function Loader({ heading, context, isPage }) {
  return isPage ? (
    <div className={styles.loadingPage}>
      {heading && <h1>{heading} {context && <span>{context}</span>}</h1>}
      <div className={styles.progressLoader}></div>
    </div>
  ) : (
    <div style={{
      width: "100%",
      display: "inline-flex",
      justifyContent: "center",
      padding: "8px 0px",
      }}>
      <div className={styles.progressLoader}></div>
    </div>
  );
}
