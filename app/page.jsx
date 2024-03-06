import styles from "./page.module.css";
import Heading from "./(components)/Heading";
import ExpensePie from "./(components)/ExpensePie";
import { groupBy, arraySum, getExpenseToday} from "./(lib)/utils";
import { cookies } from "next/headers";
import { getUser } from "./(lib)/auth";

export default async function Home() {

  // Get the current logged-in user
  const session = cookies().get("session")?.value;
  const {record, token} = await getUser(session);

  // Get today's expenses
  const expenses = await getExpenseToday(record.id);
  
  const username = record.name.split(" ")[0];
  // Group the expenses by their category
  const groupedExpenses = groupBy(expenses, (expense) => expense.category);
  // Create a new object containing these pairs
  const categorizedExpenditure = {};
  groupedExpenses.forEach((expenses, category) => {
    categorizedExpenditure[category] = arraySum(expenses, (expense) => expense.expenditure);
  });

  return (
    <main className={`page ${styles.main}`}>
      <Heading text={"Hello,"} coloredText={username + "!"} />
      {/* The canvas to show the expenses for the day */}
      <ExpensePie categorizedExpenditure={categorizedExpenditure} user={record}/>
    </main>
  );
}
