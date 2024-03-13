"use client";

import { motion } from "framer-motion";
import styles from "./bar-chart.module.css";
import { arraySum, COLORS } from "../(lib)/utils";

export default function BarChart({ keyValuePairObj }) {
  // Get the maximum expenditure
  const total = arraySum(Object.values(keyValuePairObj), (exp) =>
    parseFloat(exp)
  );
  const maxNum = Math.max(...Object.values(keyValuePairObj));

  return (
    <div className={styles.barChart}>
      {Object.keys(keyValuePairObj).map((key, index) => {
        const widthPercentage =
          100 * (keyValuePairObj[key] / maxNum).toFixed(2) + "%";
        const textPercentage =
          100 * (keyValuePairObj[key] / total).toFixed(2) + "%";

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
              {key + " - " + textPercentage}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
