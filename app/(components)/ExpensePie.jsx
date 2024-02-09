"use client";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { useEffect, useState } from "react";
import styles from "./component.module.css";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ExpensePie({ categorizedExpenditure }) {
  // Get the draw function from outside
  const [data, setData] = useState({});

    console.log(typeof categorizedExpenditure, categorizedExpenditure);

  useEffect(() => {
    setData({
      labels: Object.keys(categorizedExpenditure),
      datasets: [
        {
          data: Object.values(categorizedExpenditure),
          backgroundColor: ["#fe2e55", "#33a4db", "#fe9600", "#fecf01", "#1775fe", "#c7c6cb"],
        },
      ],
    });
  }, [categorizedExpenditure]);

  return (
    <div>
      <h3>Today's Expense</h3>
      <div className={styles.pieChart}>
        {(typeof data?.labels !== "undefined") && 
        <>
            <Pie data={data} options={{
            plugins: {
                legend: {display: false,}
            }
        }}></Pie>
        <div className={styles.pieCircle}><p>{"Today's Expenses"}</p></div>
        </>}
      </div>
    </div>
  );
}
