import styles from "./page.module.css";
import Heading from "./(components)/Heading";
import ExpensePie from "./(components)/ExpensePie";
import moment from "moment";
import { groupBy, arraySum } from "./utils";

const getExpenseToday = async () => {
  // Today's date
  // let today = new Date();

  let today = moment.utc().format("YYYY-MM-DD");
  // Send a fetch request for particular date
  const path = "https://expense-tracker.pockethost.io";
  const params = "/api/collections/expenses/records?page=1&perPage=50";
  const filter = `&filter=(created~'${today}')`;
  // Send the fetch request
  const res = await fetch(path + params + filter, {
    cache: "no-store",
  });
  // Get the items
  const data = await res.json();
  // Return the items
  return data?.items;
};

export default async function Home() {
  const username = "Rakshit";
  const expenses = await getExpenseToday();

  // Group the expenses by their category
  const groupedExpenses = groupBy(expenses, (expense) => expense.category);

  const dailyLimit = 10000/30;

  // Create a new object containing these pairs
  const categorizedExpenditure = {};
  groupedExpenses.forEach((expenses, category) => {
    categorizedExpenditure[category] = arraySum(expenses, (expense) => expense.expenditure);
  });

  return (
    <main className={styles.main}>
      <Heading text={"Hello,"} coloredText={username + "!"} />
      {/* The canvas to show the expenses for the day */}
      <ExpensePie categorizedExpenditure={categorizedExpenditure} dailyLimit={dailyLimit} />
    </main>
  );
}
