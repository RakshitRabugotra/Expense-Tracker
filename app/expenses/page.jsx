// This page will show all the expenses
// and provide a form to new new expense
import ExpenseList from "../(components)/ExpenseList";
import { getUser } from "../(lib)/auth";
import { cookies } from "next/headers";

// Utility functions
async function getExpenses(userID) {
  const params = "/api/collections/expenses/records?page=1&perPage=30";
  const sort = "&sort=-expense_date,id";
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