"use client";

import styles from "./expense.module.css";
import { currencyFormatter } from "../(lib)/utils";
import { useEffect, useMemo, useState, useRef } from "react";

// Icons for the categories
import { FaCarSide } from "react-icons/fa6";
import { PiTShirtFill } from "react-icons/pi";
import { MdLocalGroceryStore } from "react-icons/md";
import { MdCurrencyRupee } from "react-icons/md";
import { MdFastfood } from "react-icons/md";
import { BsEmojiSmileUpsideDownFill } from "react-icons/bs";
import { FaPenAlt } from "react-icons/fa";

// Icons for edit and delete button
import { AiFillEdit } from "react-icons/ai";
import { MdDeleteForever } from "react-icons/md";
import { useRouter } from "next/navigation";

function Expense({ expense, iconComponent }) {
  // Extract the different components of the expenditure
  const formattedExp = currencyFormatter.format(expense.expenditure);
  const currencySymbol = formattedExp.charAt(0);
  const integerComponent = formattedExp.slice(1, -3);
  const decimalComponent = formattedExp.slice(-3);

  return (
    <div className={styles.expenseItem}>
      <div className={styles.expenseIcon}>
        {/* Show the icon dynamically */}
        {iconComponent}
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
  );
}

function chooseComponent(category) {
  switch (category) {
    case "transport":
      return <FaCarSide />;
    case "clothes":
      return <PiTShirtFill />;
    case "grocery":
      return <MdLocalGroceryStore />;
    case "food":
      return <MdFastfood />;
    case "stationery":
      return <FaPenAlt />;
    case "null":
      return <BsEmojiSmileUpsideDownFill />;
    default:
      return <MdCurrencyRupee />;
  }
}

// The expense entry component
export default function ExpenseEntry({ expense, isDisabled }) {
  // To toggle the menu of edit options
  const [showMenu, setShowMenu] = useState(false);
  // To hide the current entry
  const [isHidden, setHidden] = useState(false);
  // Get the icon component
  const iconComponent = useMemo(
    () => chooseComponent(expense.category),
    [expense.category]
  );

  // To navigate here and there
  const router = useRouter();

  // To delete this record
  const handleDelete = (expenseId) => {
    const res = fetch(
      `https://expense-tracker.pockethost.io/api/collections/expenses/records/${expenseId}`,
      { method: "DELETE" }
    );
    setHidden((prev) => true);
    return res.status;
  };

  // To update this record
  const handleUpdate = (expenseId, router) => {
    router.push(`/expenses/update/${expenseId}`);
    return;
  };

  // To close the menu
  const ref = useRef(null);

  useEffect(() => {
    const handleOutSideClick = (event) => {
      if (!ref.current?.contains(event.target)) {
        // console.log("Outside Clicked. ");
        setShowMenu(false);
      }
    };
    window.addEventListener("mousedown", handleOutSideClick);
    return () => {
      window.removeEventListener("mousedown", handleOutSideClick);
    };
  }, [ref]);

  return (
    <div
      id={expense.id}
      style={{ display: isHidden ? "none" : "block" }}
      className={"clickable"}
      onClick={(e) => {
        if (isDisabled) return;
        return setShowMenu((prev) => !prev);
      }}
      ref={ref}
    >
      <Expense expense={expense} iconComponent={iconComponent} />

      {showMenu && (
        <div className={styles.editMenu}>
          <div
            onClick={() => handleUpdate(expense.id, router)}
            className={styles.updateButton}
          >
            <AiFillEdit />
          </div>
          <div
            onClick={() => handleDelete(expense.id)}
            className={styles.deleteButton}
          >
            <MdDeleteForever />
          </div>
        </div>
      )}
    </div>
    // <Link href={isLink ? `/expenses/${expense.id}` : "#"} className="clickable">
    // </Link>
  );
}
