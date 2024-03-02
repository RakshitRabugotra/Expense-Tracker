"use client";

import styles from "../expense.module.css";
import Heading from "../../(components)/Heading";
import ExpenseEntry from "../../(components)/ExpenseEntry";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "../../(components)/Loader";


export default function ExpensePage({ params }) {
  const [expense, setExpense] = useState({});

  useEffect(() => {
    fetch(
      process.env.SERVER + `/api/collections/expenses/records/${params.id}`,
      {
        next: { revalidate: 10 },
      }
    )
    .then(response => response.json())
    .then(data => setExpense(data));
  }, [params.id]);

  // const expense = await getExpense(params.id);
  const created = new Date(expense?.created);
  const month = created.toLocaleString("default", { month: "short" });
  const day = created.toLocaleString("default", { day: "2-digit" });
  const year = created.toLocaleDateString("default", { year: "numeric" });

  // To navigate here and there
  const router = useRouter();

  // To delete this record
  const handleDelete = (expenseId) => {
    const res = fetch(
      `https://expense-tracker.pockethost.io/api/collections/expenses/records/${expenseId}`,
      { method: "DELETE" }
    );
    // Redirect to expenses
    router.push("/expenses");
    return res.status;
  }

  // To update this record
  const handleUpdate = (expenseId) => {
    router.push(`/expenses/update/${expenseId}`);
    return;
  }

  if(typeof expense?.created === "undefined") {
    return <Loader context={"expense"}/>
  }

  return (
    <div className={styles.expenseView}>
      {/* Give the date here */}
      <Heading text={`${day} ${month},`} coloredText={year} />
      {/* The expense entry */}
      <ExpenseEntry expense={expense} />
      {/* The option to delete and modify */}
      <div className={styles.buttonContainer}>
        <button
          onClick={(e) => handleDelete(expense.id)}
          className={styles.deleteButton}
        >
          Delete Record
        </button>
        <button
          onClick={(e) => handleUpdate(expense.id)}
          className={styles.updateButton}
        >
          Update Record
        </button>
      </div>
    </div>
  );
}
