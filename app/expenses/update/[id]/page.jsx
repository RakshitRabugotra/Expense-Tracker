import CreateExpense from "../../../(components)/CreateExpense";
import { cookies } from "next/headers";
import styles from "../../expense.module.css";

export default async function UpdateExpense({ params }) {

    const token = cookies().get("session")?.value;
    const {record, tokenJWT} = await getUser(token);

    return(<div className={styles.newPage}>
        <CreateExpense patch={true} expenseID={params.id} userID={record.id}/>
    </div>);
}