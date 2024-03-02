"use client";
import styles from "./form.module.css";
import Heading from "./Heading";
import Loader from "./Loader";
import { Suspense, useState } from "react";

export default function Form({ heading, submitHandler, buttonText, children }) {
  const [isLoading, setLoading] = useState(false);

  return (
    <Suspense fallback={<Loader context={"form"} />}>
      {typeof heading?.text !== "undefined" && (
        <Heading text={heading.text} coloredText={heading.coloredText} />
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setLoading(true);
          submitHandler(e);
          setLoading(false);
        }}
        className={styles.customForm}
      >
        {children}
        {/* The submit button */}
        <button type="submit" disabled={isLoading}>
          {isLoading ? buttonText.loading : buttonText.normal}
        </button>
      </form>
    </Suspense>
  );
}
