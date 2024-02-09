// This should be an interactive component,
// that is rendered on the client
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./expense.module.css";
import Heading from "./Heading";
import Loader from "./Loader";



export default function CreateExpense({ patch, expenseID }) {
  const router = useRouter();
  // For the valid categories in the system
  const [categories, setCategories] = useState([]);

  // Fetch the expense itself
  const [expense, setExpense] = useState(null);

  // The state variables for particular expense
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [expenditure, setExpenditure] = useState(0);

  // Get the categories from the backend
  const getCategories = () => {
    fetch(
      "https://expense-tracker.pockethost.io/api/collections/categories/records?page=1&perPage=30",
      { cache: "no-store" }
    )
      .then((res) => res.json())
      .then((data) => {
        const cats = data?.items.map((item) => item.name);
        setCategories(cats);
      })
      .catch((error) => console.log(error));
  };

  const getExpense = () => {
    fetch(`https://expense-tracker.pockethost.io/api/collections/expenses/records/${expenseID}`, {next: {revalidate: 10}})
    .then(response => response.json())
    .then(data => setExpense(data));
  }

  // Do this once
  useEffect(() => {
    getCategories();
    // If we're doing an update (PATCH), fetch the expense
    if(patch) {
      getExpense();
    }
  }, []);
  
  // Update the name, category and expenditure
  // whenever the expense updates
  useEffect(() => {
    // Set the variables to this value
    setName(expense?.name);
    setCategory(expense?.category);
    setExpenditure(expense?.expenditure);
  }, [expense]);

  const handleSubmit = async (e) => {
    // Prevent the default behavior
    e.preventDefault();

    let path = "";
    let method = "";
    // If we're serving a update request
    if (patch) {
      path = `https://expense-tracker.pockethost.io/api/collections/expenses/records/${expenseID}`;
      method = "PATCH";
    } else {
      path = "https://expense-tracker.pockethost.io/api/collections/expenses/records";
      method = "POST";
    }

    // Send the required request to the destined path
    await fetch(path, {
      method: method,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        name,
        category: category.length === 0 ? categories[0] : category,
        expenditure,
      }),
    });

    router.replace("/expenses");
    setName("");
    setCategory(categories[0]);
    setExpenditure(0);
  };

  if (patch && typeof expense?.id === "undefined") return <Loader context={"update"} />;
  if (categories.length === 0) return <Loader context={"categories"} />;

  return (
    <form onSubmit={handleSubmit} className={styles.createExpenseForm}>
      <Heading text={patch ? "Update" : "Add"} coloredText={"Expense"} />
      <input
        type="text"
        placeholder="Expense Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <select name="category" onChange={(e) => setCategory(e.target.value)}>
        {categories.map((cat, index) => {
          return (
            <option value={cat} key={index}>
              {cat}
            </option>
          );
        })}
      </select>

      <input
        type="number"
        placeholder="Expenditure"
        value={expenditure}
        onChange={(e) => setExpenditure(e.target.value)}
      />

      <button type="submit">{(patch ? "Update" : "Add") + " Expense"}</button>
    </form>
  );
}
