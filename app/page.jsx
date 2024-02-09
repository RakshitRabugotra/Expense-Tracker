import styles from "./page.module.css";
import Heading from "./(components)/Heading";
import GraphBox from "./(components)/GraphBox";
import ExpensePie from "./(components)/ExpensePie";
import moment from "moment";
import { groupBy, arraySum } from "./utils";

const getExpenseToday = async () => {
  // today's date
  const today = moment().format("YYYY-MM-DD");
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

  // Create a new object containing these pairs
  const categorizedExpenditure = {};
  groupedExpenses.forEach((expenses, category) => {
    categorizedExpenditure[category.toString()] = arraySum(expenses, (expense) => expense.expenditure);
  });

  return (
    <main className={styles.main}>
      <Heading text={"Hello,"} coloredText={username + "!"} />
      {/* The box showing the graph */}
      <GraphBox />
      {/* The canvas to show the expenses for the day */}
      <ExpensePie categorizedExpenditure={categorizedExpenditure} />
    </main>
  );
}
