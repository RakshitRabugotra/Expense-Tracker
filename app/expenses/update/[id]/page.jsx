import CreateExpense from "../../../(components)/CreateExpense";
import { cookies } from "next/headers";
import { getUser } from "../../../(lib)/auth";

export default async function UpdateExpense({ params }) {
  const token = cookies().get("session")?.value;
  const { record, tokenJWT } = await getUser(token);

  return (
    <div className="page">
      <CreateExpense patch={true} expenseID={params.id} userID={record.id} />
    </div>
  );
}
