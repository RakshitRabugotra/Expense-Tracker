import styles from "./page.module.css";
import Heading from "./(components)/Heading";
import ExpensePie from "./(components)/ExpensePie";
import moment from "moment";
import { groupBy, arraySum } from "./(lib)/utils";
import { cookies } from "next/headers";
import { getUser } from "./(lib)/auth";

const getExpenseToday = async (userID) => {
  // Today's date
  // let today = new Date();

  let today = moment.utc().format("YYYY-MM-DD");
  // Send a fetch request for particular date
  const params = "/api/collections/expenses/records?page=1&perPage=50";
  const filter = `&filter=(created~'${today}'%26%26user_id='${userID}')`;
  // Send the fetch request
  const res = await fetch(process.env.SERVER + params + filter, {
    cache: "no-store",
  });

  console.log(process.env.SERVER + params + filter);
  // Get the items
  const data = await res.json();
  // Return the items
  return data?.items;
};

export default async function Home() {

  // Get the current logged-in user
  const session = cookies().get("session")?.value;
  // const {user = await getUser(session);
  const {record, token} = await getUser(session);
  // console.log(session);

  // Get today's expenses
  const expenses = await getExpenseToday(record.id);
  
  const username = record.name.split(" ")[0];

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
