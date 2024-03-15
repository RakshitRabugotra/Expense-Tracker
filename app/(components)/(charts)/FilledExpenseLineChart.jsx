"use client";

import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import styles from "./line-chart.module.css";

// Custom modules
import {
  getPreviousMonths,
  getMonthExpenseFor,
  getMonthNumberFromName,
  getMonthsInOrder,
  arraySum,
  EXPENDITURE_COLORS,
  hexToRgb,
  groupBy,
} from "../../(lib)/utils";

// Register various Components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler);

const options = {
  plugins: {},
  events: [],
  responsive: true,
};

// The allowed time periods
const MONTH_TIME_PERIODS = [1, 3, 6];

export default function FilledLineChart({ user }) {
  // The time period (in months)
  const [numOfMonths, setNumOfMonths] = useState(
    MONTH_TIME_PERIODS[parseInt(MONTH_TIME_PERIODS.length / 2)]
  );

  // Get the expenses for previous 'n' months
  const [monthlyExpenses, setMonthlyExpenses] = useState(new Array());
  const [dummyObj, setDummyObj] = useState(new Object());
  // The current year
  const thisYear = new Date().getFullYear();

  useEffect(() => {
    setDummyObj((prev) => new Object());
    // 'getPreviousMonths' returns the name of the previous 'n' months
    const previousMonths = getPreviousMonths(
      MONTH_TIME_PERIODS[MONTH_TIME_PERIODS.length - 1]
    );
    // Iterate over and get each expense
    previousMonths.forEach((monthName, index) => {
      // Convert the month name to number
      const monthNumber = getMonthNumberFromName(monthName);
      // Get the expenses for this particular month
      getMonthExpenseFor(user.id, thisYear, monthNumber).then((expenses) => {
        // Set the dummy object
        setDummyObj((previous) => {
          const newEntry = {};
          newEntry[monthName] = expenses;
          return new Object({ ...previous, ...newEntry });
        });
      });
    });
  }, [thisYear, user.id]);

  // When the dummy object changes, set the monthlyExpenses
  useEffect(() => {
    const iCurrMonth = new Date().getMonth();
    // For all other cases where number of months is more than 1
    if (numOfMonths > 1) {
      return setMonthlyExpenses(() =>
        getMonthsInOrder(dummyObj, iCurrMonth + 1)
      );
    }
    let monthName = "";
    // Else if, we're looking at our current month, then show all the dates too
    for (monthName of Object.keys(dummyObj)) {
      // If the month doesn't match our current month
      if (getMonthNumberFromName(monthName) - 1 === iCurrMonth) break;
    }

    // Get the expenses for this particular month
    const expenses = dummyObj[monthName];
    // Group them by dates only (not time)
    const dailyExpenseMap = groupBy(
      expenses,
      (expense) => expense.expense_date.split(" ")[0]
    );
    // Convert this map to a 2D-array containing 'date' as first item
    // and 'total-expenditure' as second item for each item in the array
    const newArray = dailyExpenseMap.entries().toArray();

    // Record this array
    setMonthlyExpenses(() => newArray);
  }, [numOfMonths, dummyObj]);

  // The data that will be displayed to the user
  const sliceData =
    numOfMonths !== 1 ? monthlyExpenses.slice(-numOfMonths) : monthlyExpenses;

  // Set the graph data
  const data = {
    labels: sliceData.map((monthExpensePair) => monthExpensePair[0]),
    datasets: [
      {
        data: sliceData.map((monthExpensePair) => {
          return arraySum(monthExpensePair[1], (expense) =>
            expense?.expenditure ? expense.expenditure : 0
          );
        }),
        label: "Expense",
        borderColor: EXPENDITURE_COLORS[EXPENDITURE_COLORS.length - 1],
        backgroundColor: ((hexColor, alpha) => {
          const rgb = hexToRgb(hexColor);
          return `rgba(${rgb.r}, ${rgb.b}, ${rgb.b}, ${alpha})`;
        })(EXPENDITURE_COLORS[EXPENDITURE_COLORS.length - 1], 0.3),
        fill: true,
      },
      {
        data: [],
        label: "Income",
        borderColor: EXPENDITURE_COLORS[0],
        backgroundColors: ((hexColor, alpha) => {
          const rgb = hexToRgb(hexColor);
          return `rgba(${rgb.r}, ${rgb.b}, ${rgb.b}, ${alpha})`;
        })(EXPENDITURE_COLORS[0], 0.3),
        fill: true,
      },
    ],
  };

  return (
    <div className={styles.graphContainer}>
      <Line options={options} data={data} />

      <div className={styles.buttonContainer}>
        {MONTH_TIME_PERIODS.map((n, index) => {
          return (
            <div
              key={index}
              className={n === numOfMonths ? styles.active : ""}
              onClick={(e) => setNumOfMonths((prev) => n)}
            >
              {`${n} months`}
            </div>
          );
        })}
      </div>
    </div>
  );
}
