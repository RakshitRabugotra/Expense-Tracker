// This page will show all the expenses
// and provide a form to new new expense
import styles from "./expense.module.css";
import Heading from "../(components)/Heading";
import ExpenseEntry from "../(components)/ExpenseEntry";


// Utility functions
async function getExpenses() {
  const res = await fetch(
    "https://expense-tracker.pockethost.io/api/collections/expenses/records?page=1&perPage=30",
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
    category: "null",
    expenditure: null,
  };

  // If we don't have any expenses
  if (expenses.length === 0) {
    return (
      <div className={styles.expenseList}>
        <Heading text={"Your"} coloredText={"Expenses"}/>
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

