// This page will show all the expenses
// and provide a form to new new expense
import styles from "./expense.module.css";
import Heading from "../(components)/Heading";
import ExpenseEntry from "../(components)/ExpenseEntry";
import { groupBy } from "../(lib)/utils";
import { getUser } from "../(lib)/auth";
import { cookies } from "next/headers";
import moment from "moment";

// Utility functions
async function getExpenses(userID) {
  const params = "/api/collections/expenses/records?page=1&perPage=30";
  const sort = "&sort=-created,id";
  const filter = `&filter=(user_id='${userID}')`;

  const res = await fetch(
    process.env.SERVER + params + filter + sort,
    {
      cache: "no-store",
    }
  );
  const data = await res.json();
  return data?.items;
}

// The rendering component
export default async function ExpensePage() {
  const session = cookies().get("session")?.value;
  const {record, token} = await getUser(session);
  const expenses = await getExpenses(record.id);
  return <ExpenseList expenses={expenses} />;
}

// The expense list component
const ExpenseList = ({ expenses }) => {
  const noExpense = {
    id: "",
    name: "No expenses yet",
    category: "null",
    expenditure: null,
  };

  // If we don't have any expenses
  if (expenses.length === 0) {
    return (
      <div className={styles.expensePage}>
        <Heading text={"Your"} coloredText={"Expenses"} />
        <div className={styles.expenseList}>
          <ExpenseEntry expense={noExpense} isLink={false}/>
        </div>
      </div>
    );
  }

  // Group expenses by their dates (not their exact times)
  const groupedExpenses = groupBy(expenses, (expense) => {
    const dateObj = moment.utc(expense.created).toDate();
    const month = dateObj.toLocaleString("default", { month: "short" });
    const day = dateObj.toLocaleString("default", { day: "2-digit" });
    const year = dateObj.toLocaleDateString("default", { year: "2-digit" });
    return [day, month, "'" + year].join(" ");
  });

  // The expense-list
  const expenseList = [];
  // Translate this into react-component
  groupedExpenses.forEach((expenses, date) => {
    // Push this component to the list
    expenseList.push(
      <div className={styles.dateGroup}>
        <div className={styles.dateContainer}>{date}</div>
        {expenses.map((expense, index) => {
          return <ExpenseEntry expense={expense} key={index} isLink={true} />;
        })}
      </div>
    );
  });

  // Else, return the whole list
  return (
    <div className="page">
      <Heading text={"Your"} coloredText={"Expenses"} />
      <div className={styles.expenseList}>
        {expenseList}
      </div>
    </div>
  );
};
