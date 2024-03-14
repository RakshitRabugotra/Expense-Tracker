import styles from "./page.module.css";
import Heading from "./(components)/Heading";
import ExpensePie from "./(components)/ExpensePie";
import { arraySum, getCategorizedExpenses, getExpenseThisMonth, getExpenseToday} from "./(lib)/utils";
import { cookies } from "next/headers";
import { getUser } from "./(lib)/auth";

export default async function Home() {

  // Get the current logged-in user
  const session = cookies().get("session")?.value;
  const {record, token} = await getUser(session);

  // Get today's expenses
  const expenses = await getExpenseToday(record.id);
  const todayTotal = arraySum(expenses, (exp) => parseFloat(exp.expenditure));
  // Monthly total
  const monthlyExpenses = await getExpenseThisMonth(record.id);
  const monthlyTotal = arraySum(monthlyExpenses, (exp) => parseFloat(exp.expenditure));
  // Get expenses grouped by their categories
  const categorizedExpenditure = await getCategorizedExpenses(expenses);  
  // Get the username of the client
  const username = record.name.split(" ")[0];

  return (
    <main className={`page ${styles.main}`}>
      <Heading text={"Hello,"} coloredText={username + "!"} />
      {/* The canvas to show the expenses for the day */}
      <ExpensePie categorizedExpenditure={categorizedExpenditure} todayTotal={todayTotal} monthlyTotal={monthlyTotal} user={record}/>
    </main>
  );
}
