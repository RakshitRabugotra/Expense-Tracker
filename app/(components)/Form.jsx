"use client";
import styles from "./form.module.css";
import Heading from "./Heading";
import Loader from "./Loader";
import { Suspense } from "react";

export default function Form({ heading, submitHandler, children }) {
  return (
    <Suspense fallback={<Loader context={"form"} />}>
      {typeof heading?.text !== "undefined" && (
        <Heading text={heading.text} coloredText={heading.coloredText} />
      )}
      <form onSubmit={submitHandler} className={styles.customForm}>{children}</form>
    </Suspense>
  );
}
