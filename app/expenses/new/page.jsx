import CreateExpense from "../../(components)/CreateExpense";
import { cookies } from "next/headers";
import { getUser } from "../../(lib)/auth";
import styles from "../expense.module.css";

export default async function CreateNewExpense() {
  const token = cookies().get("session")?.value;
  const { record, tokenJWT } = await getUser(token);

  return <CreateExpense userID={record.id} />;
}
