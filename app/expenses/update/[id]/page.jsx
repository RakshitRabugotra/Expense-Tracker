import CreateExpense from "../../../(components)/CreateExpense";
import styles from "../../expense.module.css";

export default function UpdateExpense({ params }) {
    return(<div className={styles.newPage}>
        <CreateExpense patch={true} expenseID={params.id}/>
    </div>);
}