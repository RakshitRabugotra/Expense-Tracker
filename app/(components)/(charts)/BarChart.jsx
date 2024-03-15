"use client";

import { motion } from "framer-motion";
import styles from "./bar-chart.module.css";
import { arraySum, COLORS } from "../../(lib)/utils";
import { useEffect, useState } from "react";

export default function BarChart({ keyValuePairObj, noDataFoundMessage }) {
  // The total of the data
  const total = arraySum(Object.values(keyValuePairObj), (exp) =>
    parseFloat(exp)
  );
  // Get the maximum data point
  const maxNum = Math.max(...Object.values(keyValuePairObj));

  // Store this as a state variable
  const [keyValueObj, setObj] = useState(new Object(keyValuePairObj));

  // Change this object whenever our parameter changes
  useEffect(() => {
    setObj((prev) => new Object(keyValuePairObj));
  }, [keyValuePairObj]);

  // If the length of the object is 0, then show the error message
  if (Object.keys(keyValueObj).length <= 0) {
    return <div className={styles.noData}>{noDataFoundMessage}</div>;
  }

  return (
    <div className={styles.barChart}>
      {Object.keys(keyValuePairObj).map((key, index) => {
        const widthPercentage =
          100 * parseFloat(keyValuePairObj[key] / maxNum).toFixed(2) + "%";
        const textPercentage = 100 * parseFloat(keyValuePairObj[key] / total);

        return (
          <motion.div
            key={index}
            className={styles.categoryBar}
            initial={{ backgroundColor: "#fff", width: 0, opacity: 0 }}
            animate={{
              backgroundColor: COLORS[index],
              width: widthPercentage,
              opacity: 1,
            }}
            exit={{ backgroundColor: "#fff", width: 0, opacity: 0 }}
            transition={{ ease: "easeOut", duration: 1.5 }}
            style={{
              backgroundColor: COLORS[index],
            }}
          >
            <span style={{ color: COLORS[index] }}>
              {key + " - " + textPercentage.toFixed(2) + "%"}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
