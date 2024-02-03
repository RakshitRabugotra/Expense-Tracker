import CreateExpense from "./CreateExpense";
import styles from './new-expense.module.css';

export default function CreateNewExpense() {

    return (<div className={styles.formContainer}>
        <CreateExpense/>
    </div>);
}