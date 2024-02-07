// This page will show all the expenses
// and provide a form to new new expense
import Link from "next/link";
import styles from "./expense.module.css";
// BillIcon
import { LiaMoneyBillWaveSolid } from "react-icons/lia";
import Heading from "../(components)/Heading";

// Utility functions
async function getExpenses() {
  const res = await fetch(
    "http://127.0.0.1:8090/api/collections/expenses/records?page=1&perPage=30",
    {
      cache: "no-store",
    }
  );
  const data = await res.json();
  return data?.items;
}

// Function to group certain elements in an object by a key
function groupBy(list, keyGetter) {
  const map = new Map();
  list.forEach((item) => {
       const key = keyGetter(item);
       const collection = map.get(key);
       if (!collection) {
           map.set(key, [item]);
       } else {
           collection.push(item);
       }
  });
  return map;
}

// Object mapping function
function objectMap(obj, fn) {
  const newObject = {};
  Object.keys(obj).forEach((key) => {
    newObject[key] = fn(obj[key]);
  });
  return newObject;
}

// The rendering component
export default async function ExpensePage() {
  const expenses = await getExpenses();
  return (
    <ExpenseList expenses={expenses} />
  );
}

// The expense list component
const ExpenseList = ({ expenses }) => {
  const noExpense = {
    name: "No expenses yet",
    category: "",
    expenditure: null,
  };

  // If we don't have any expenses
  if (typeof expenses === "undefined") {
    return (
      <div className={styles.expenseList}>
        <h1 className={styles.heading}>Expenses</h1>
        <ExpenseEntry expense={noExpense} />
      </div>
    );
  }
  // Group expenses by their dates (not their exact times)
  const groupedExpenses = groupBy(expenses, expense => {
    const dateObj = new Date(expense.created);
    const month = dateObj.toLocaleString("default", { month: "short" });
    const day = dateObj.toLocaleString("default", { day: "2-digit" });
    const year = dateObj.toLocaleDateString("default", { year: "2-digit" });
    
    return [day, month, "\'" + year].join(" ");
  });

  // The expense-list
  const expenseList = [];
  // Translate this into react-component
  groupedExpenses.forEach((expenses, date) => {
    // Push this component to the list
    expenseList.push(
      <>
        <div className={styles.dateContainer}>
          {date}
        </div>
        {expenses.map((expense, index) => {
          return <ExpenseEntry expense={expense} key={index} />;
        })}
      </>
    );
  });

 // Else, return the whole list
 return (
   <div className={styles.expenseList}>
      <Heading text={"Your"} coloredText={"Expenses"}/>
      {expenseList}
    </div>
  );
};

// The expense entry component
const ExpenseEntry = ({ expense }) => {
  const id = expense.id;
  const created = new Date(expense?.created);

  return (
    <Link href={`/expenses/${id}`}>
      <div className={styles.expenseItem}>
        <div className={styles.expenseIcon}>
          <LiaMoneyBillWaveSolid />
        </div>

        <div className={styles.expenseInformation}>
          {expense.name && <h4>{expense.name}</h4>}
          {expense.category && <div className={styles.categoryContainer}>
            {expense.category}
          </div>}
        </div>

        <div className={styles.expenseExpenditure}>
          {expense.expenditure && <p>{expense.expenditure}</p>}
        </div>
      </div>
    </Link>
  );
};
