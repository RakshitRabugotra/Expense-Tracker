import styles from "../expense.module.css";
import Heading from "../../(components)/Heading";
import ExpenseEntry from "../../(components)/ExpenseEntry";

async function getExpense(expenseId) {
  const res = await fetch(
    `https://expense-tracker.pockethost.io/api/collections/expenses/records/${expenseId}`,
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
  const year = created.toLocaleDateString("default", { year: "numeric" });

  return (
    <div className={styles.expenseList}>
      {/* Give the date here */}
      <Heading text={`${day} ${month},`} coloredText={year}/>
      <ExpenseEntry expense={expense}/>
    </div>
  );
}
