"use client";
import Heading from "./Heading";
import ExpenseEntry from "./ExpenseEntry";
import styles from "./expense.module.css";
import { groupBy } from "../(lib)/utils";
import moment from "moment";
import { useEffect, useRef, useState } from "react";

// Dummy expenses
const noExpense = {
  id: "",
  name: "No expenses yet",
  category: "null",
  expenditure: null,
};

const getGroupExpenses = (expenses) => {
  return groupBy(expenses, (expense) => {
    const dateObj = moment.utc(expense.expense_date).toDate();
    const month = dateObj.toLocaleString("default", { month: "short" });
    const day = dateObj.toLocaleString("default", { day: "2-digit" });
    const year = dateObj.toLocaleDateString("default", { year: "2-digit" });
    return [day, month, "'" + year].join(" ");
  });
};

function DateGroup({ expenses, date }) {
  const dateGroupRef = useRef();
  const [clicked, setClicked] = useState(false);

  // Check how many children we have in each group
  useEffect(() => {
    const handleInsideClick = (event) => {
      if (dateGroupRef.current?.contains(event.target)) {
        setClicked((prev) => true);
        let length = dateGroupRef?.current.children.length;
        console.log("Running");
        let noneCount = 0;
        for (let children of dateGroupRef?.current.children) {
          noneCount += children.style.display === "none";
        }
        console.log(length - noneCount);

        if (dateGroupRef.current.children.length <= 1) {
          dateGroupRef.current.removeChild(dateGroupRef.current.children[0]);
        }
      }
    };
    window.addEventListener("mousedown", handleInsideClick);
    return () => {
      window.removeEventListener("mousedown", handleInsideClick);
    };
  }, [dateGroupRef, clicked]);

  return (
    <div className={styles.dateGroup} ref={dateGroupRef}>
      <div className={styles.dateContainer}>{date}</div>
      {expenses.map((expense, index) => {
        return <ExpenseEntry expense={expense} key={index + 1} />;
      })}
    </div>
  );
}

// The expense list component
export default function ExpenseList({ expenses }) {
  // If we don't have any expenses
  if (expenses.length === 0) {
    return (
      <div className="page">
        <Heading text={"Your"} coloredText={"Expenses"} />
        <div className={styles.expenseList}>
          <ExpenseEntry expense={noExpense} isDisabled={true} />
        </div>
      </div>
    );
  }

  // Group expenses by their dates (not their exact times)
  const groupedExpenses = getGroupExpenses(expenses);

  // The expense-list
  const expenseList = [];
  // Translate this into react-component
  let i = 0;
  groupedExpenses.forEach((expenses, date) => {
    // Push this component to the list
    expenseList.push(<DateGroup expenses={expenses} date={date} key={i++} />);
  });

  // Else, return the whole list
  return (
    <div className="page">
      <Heading text={"Your"} coloredText={"Expenses"} />
      <div className={styles.expenseList}>{expenseList}</div>
    </div>
  );
}
