"use client";
import { TiRefresh } from "react-icons/ti";
import { useState } from "react";
import styles from "./heading.module.css";

export default function Heading({ text, coloredText }) {
  const [isSpinning, setSpinning] = useState(false);

  return (
    <div className={styles.heading}>
      <div>
        {text}
        <p>{coloredText}</p>
      </div>
      <span
        className={`${styles.refresh} ${isSpinning && "spinner"}`}
        onClick={() => {
          setSpinning(true);
          window.location.reload();
        }}
      >
        <TiRefresh />
      </span>
    </div>
  );
}
