import styles from "./expense.module.css";
import Link from "next/link";
// Icons for the categories
import { FaCarSide } from "react-icons/fa6";
import { PiTShirtFill } from "react-icons/pi";
import { MdLocalGroceryStore } from "react-icons/md";
import { MdCurrencyRupee } from "react-icons/md";
import { MdFastfood } from "react-icons/md";
import { BsEmojiSmileUpsideDownFill } from "react-icons/bs";
import { FaPenAlt } from "react-icons/fa";
import { currencyFormatter } from "../(lib)/utils";

// The expense entry component
export default function ExpenseEntry({ expense, isLink }) {
  let component = null;

  // Extract the different components of the expenditure
  const formattedExp = currencyFormatter.format(expense.expenditure);
  const currencySymbol = formattedExp.charAt(0);
  const integerComponent = formattedExp.slice(1, -3);
  const decimalComponent = formattedExp.slice(-3);

  switch (expense.category) {
    case "transport":
      component = <FaCarSide />;
      break;
    case "clothes":
      component = <PiTShirtFill />;
      break;
    case "grocery":
      component = <MdLocalGroceryStore />;
      break;
    case "food":
      component = <MdFastfood />;
      break;
    case "stationery":
      component = <FaPenAlt />;
      break;
    case "null":
      component = <BsEmojiSmileUpsideDownFill />;
      break;
    default:
      component = <MdCurrencyRupee />;
      break;
  }

  return (
    <Link href={isLink ? `/expenses/${expense.id}` : '#'} className="clickable">
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
          {expense.expenditure && (
            <>
              <p className={styles.currencySymbol}>{currencySymbol}</p>
              <p className={styles.currencyWhole}>{integerComponent}</p>
              <p className={styles.currencyDecimal}>{decimalComponent}</p>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
