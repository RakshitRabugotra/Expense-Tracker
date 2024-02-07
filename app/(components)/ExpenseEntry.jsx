import styles from "./component.module.css";
import Link from "next/link";
// Icons for the categories
import { FaCarSide } from "react-icons/fa6";
import { PiTShirtFill } from "react-icons/pi";
import { MdLocalGroceryStore } from "react-icons/md";
import { MdCurrencyRupee } from "react-icons/md";
import { MdFastfood } from "react-icons/md";
import { BsEmojiSmileUpsideDownFill } from "react-icons/bs";
import { FaPenAlt } from "react-icons/fa";

// The expense entry component
export default function  ExpenseEntry({ expense }) {
  let component = null;

  switch (expense.category) {
    case "transport":
      component = <FaCarSide />;
      break;
    case "clothes":
      component = <PiTShirtFill/>;
      break;
    case "grocery":
      component = <MdLocalGroceryStore/>;
      break;
    case "food":
      component = <MdFastfood />;
      break;
    case "stationery":
      component = <FaPenAlt/>;
      break;
    case "null":
      component = <BsEmojiSmileUpsideDownFill />;
      break;
    default:
      component = <MdCurrencyRupee/>;
      break;
  }

  return (
    <Link href={`/expenses/${expense.id}`}>
      <div className={styles.expenseItem}>
        <div className={styles.expenseIcon}>
          {/* Show the icon dynamically */}
          {component}
        </div>

        <div className={styles.expenseInformation}>
          {expense.name && <h4>{expense.name}</h4>}
          {expense.category && (
            <div className={styles.categoryContainer}>{expense.category}</div>
          )}
        </div>

        <div className={styles.expenseExpenditure}>
          {expense.expenditure && <p>{expense.expenditure}</p>}
        </div>
      </div>
    </Link>
  );
};
