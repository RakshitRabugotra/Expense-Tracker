"use client";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import { Pie } from "react-chartjs-2";
import { useEffect, useState } from "react";
import styles from "./expense-pie.module.css";
import { arraySum, currencyFormatter } from "../(lib)/utils";

ChartJS.register(ArcElement, Tooltip);

const colors = [
  "#fe2e55",
  "#33a4db",
  "#fe9600",
  "#fecf01",
  "#1775fe",
  "#c7c6cb",
];

const options = {
  plugins: {},
  events: [],
  elements: {
    arc: {
      borderWidth: 0,
    },
  },
};

export default function ExpensePie({ categorizedExpenditure, dailyLimit }) {
  // Get the draw function from outside
  const [data, setData] = useState({});
  const [dailyTotal, setDailyTotal] = useState(0);
  const [colorMap, setColorMap] = useState(new Map());

  useEffect(() => {
    // Get the keys and values separately
    const keys = Object.keys(categorizedExpenditure);
    const values = Object.values(categorizedExpenditure);
    // Total of this expenditure
    const totalExpenditure = arraySum(values);

    // Check if the user didn't make any expense (expenditure is empty)
    const isEmpty = Object.keys(categorizedExpenditure).length === 0;
    // Set the data
    setData({
      labels: isEmpty ? ["No Expense"] : keys,
      datasets: [
        {
          data: isEmpty ? [100] : values,
          backgroundColor: isEmpty ? colors.slice(-1) : colors,
        },
      ],
    });
    // Get the sum of the expenses today
    if (isEmpty) return;
    // If the user made some expenditure, then get it's total
    setDailyTotal((prev) => {
      return values.reduce((prev, curr) => prev + curr);
    });
    // Set the new color map
    const tempMap = new Map();
    for (let i = 0; i < Math.min(keys.length, colors.length); i++) {
      tempMap.set(keys[i], [colors[i], values[i] / totalExpenditure]);
    }
    setColorMap(tempMap);
  }, [categorizedExpenditure]);

  return (
    <div className={styles.pieComponent}>
      <h3>{"Today's Expense"}</h3>

      <div className={styles.pieChart}>
        {typeof data?.labels !== "undefined" && (
          <>
            <Pie data={data} options={options}></Pie>
            <div className={styles.pieCircle}>
              {/* Calculate the daily expense percentage, based on the limit */}
              <h4>{((dailyTotal * 100) / dailyLimit).toFixed(2) + "%"}</h4>
              {dailyLimit && (
                <>
                  <div>of daily limit</div>
                  <h4>{currencyFormatter.format(dailyLimit.toFixed(2))}</h4>
                </>
              )}
            </div>
          </>
        )}
      </div>
      {colorMap.size !== 0 && (
        <div className={styles.pieLegends}>
          {Array.from(colorMap).map((pair, index) => {
            // The first item in the pair is label name,
            // The second item in the pair is the label color
            const [color, expenseRatio] = pair[1];
            const legendName = pair[0];
            return (
              <div className={styles.legendPair} key={index}>
                <div
                  className={styles.legendColor}
                  style={{ backgroundColor: color }}
                ></div>
                <div className={styles.legendName}>{legendName}</div>
                <div
                  className={styles.legendPercentage}
                  style={{ color: color }}
                >
                  {(expenseRatio * 100).toFixed(2)}<span>{"%"}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
