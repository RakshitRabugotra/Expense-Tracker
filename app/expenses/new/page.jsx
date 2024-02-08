import CreateExpense from "../../(components)/CreateExpense";
import styles from '../expense.module.css';

export default function CreateNewExpense() {
    return (<div className={styles.newPage}>
        <CreateExpense/>
    </div>);
}