import CreateExpense from "./CreateExpense";
import styles from './new-expense.module.css';
import LoadingExpense from "./loading";

export default function CreateNewExpense() {
    return (<div className={styles.formContainer}>
        <CreateExpense/>
    </div>);
}