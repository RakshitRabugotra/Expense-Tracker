import styles from "../expense.module.css";

async function getExpense(expenseId) {
  const res = await fetch(
    `http://127.0.0.1:8090/api/collections/expenses/records/${expenseId}`,
    {
      next: { revalidate: 10 },
    }
  );
  const data = await res.json();
  return data;
}

export default async function ExpensePage({ params }) {
  const expense = await getExpense(params.id);
  const created = new Date(expense?.created);
  const month = created.toLocaleString("default", { month: "short" });
  const day = created.toLocaleString("default", { day: "2-digit" });
  const year = created.toLocaleDateString("default", { year: "2-digit" });

  return (
    <div className={styles.expenseItem}>
      {created && (
        <div className={styles.dateContainer}>
          <h5>{day}</h5>
          <h6>{month}</h6>
          <p>'{year}</p>
        </div>
      )}
      {expense.name && <h4>{expense.name}</h4>}
      {expense.category && <h6>{expense.category}</h6>}
      {expense.expenditure && <p>{expense.expenditure}</p>}
    </div>
  );
}
