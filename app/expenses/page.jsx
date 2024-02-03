// This page will show all the expenses
// and provide a form to new new expense
import Link from "next/link";
import styles from "./expense.module.css";

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

export default async function ExpensePage() {
  const expenses = await getExpenses();
  return (
    <div>
      <ExpenseList expenses={expenses} />
    </div>
  );
}

// The expense list component
const ExpenseList = ({ expenses }) => {
  const noExpense = {
    name: "No expenses yet",
    category: "",
    expenditure: null,
  };

  if (typeof expenses === "undefined") {
    return (
      <div className={styles.expenseList}>
        <h1 className={styles.heading}>Expenses</h1>
        <ExpenseEntry expense={noExpense} />
      </div>
    );
  }
  

  return (
    <div className={styles.expenseList}>
      <h1 className={styles.heading}>Expenses</h1>
      {expenses.map((expense, index) => {
        return <ExpenseEntry expense={expense} key={index}/>;
      })}
    </div>
  );
};

// The expense entry component
const ExpenseEntry = ({ expense }) => {
    const id = expense.id;
    const created = new Date(expense?.created);
    const month = created.toLocaleString('default', {'month': 'short'});
    const day = created.toLocaleString('default', {'day': '2-digit'});
    const year = created.toLocaleDateString('default', {'year': '2-digit'});

  return (
    <Link href={`/expenses/${id}`}>
        <div className={styles.expenseItem}>
        {created && <div className={styles.dateContainer}>
          <h5>{day}</h5>
          <h6>{month}</h6>
          <p>'{year}</p>
        </div>}
        {expense.name && <h4>{expense.name}</h4>}
        {expense.category && <h6>{expense.category}</h6>}
        {expense.expenditure && <p>{expense.expenditure}</p>}
        </div>
    </Link>
  );
};
