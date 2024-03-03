// This should be an interactive component,
// that is rendered on the client
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./form.module.css";
import Heading from "./Heading";
import Loader from "./Loader";

export default function CreateExpense({ patch, expenseID, userID }) {
  const router = useRouter();
  // For the valid categories in the system
  const [categories, setCategories] = useState([]);

  const [isLoading, setLoading] = useState(false);

  // Fetch the expense itself
  const [expense, setExpense] = useState(null);

  // The state variables for particular expense
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [expenditure, setExpenditure] = useState(0);

  // Do this whenever dependency changes
  useEffect(() => {
    // Get the categories from the backend
    const getCategories = (getDefaults = false) => {
      const params = "/api/collections/categories/records?page=1&perPage=30";
      const filter = `&filter=(user_id='${getDefaults ? "" : userID}')`;

      fetch(process.env.SERVER + params + filter, { cache: "no-store" })
        .then((res) => res.json())
        .then((data) => {
          const cats = data?.items.map((item) => item.name);
          if (cats.length === 0) {
            // Initiate another fetch request, requesting defaults
            return getCategories(true);
          }
          setCategories(cats);
        })
        .catch((error) => console.log(error));
    };
    getCategories();
    // If we're doing an update (PATCH), fetch the expense
    if (patch) {
      // Get the expense
      (() => {
        fetch(
          process.env.SERVER + `/api/collections/expenses/records/${expenseID}`,
          { next: { revalidate: process.env.REVALIDATE_EXPENSE_SECONDS } }
        )
          .then((response) => response.json())
          .then((data) => setExpense(data));
      })();
    }
  }, [patch, expenseID, userID]);

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
    setLoading(true);

    let path = "";
    let method = "";
    // If we're serving a update request
    if (patch) {
      path = process.env.SERVER + `/api/collections/expenses/records/${expenseID}`;
      method = "PATCH";
    } else {
      path = process.env.SERVER + "/api/collections/expenses/records";
      method = "POST";
    }

    const expenseData = {
      name: name,
      category:
        typeof category === "undefined" || category.length === 0
          ? categories[0]
          : category,
      expenditure: expenditure,
      user_id: userID,
    };

    // Send the required request to the destined path
    const resp = await fetch(path, {
      method: method,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(expenseData),
    });
    // Change the loading state and redirect to expenses
    setLoading(false);
    router.replace("/expenses");
    // Reset the state
    setName("");
    setCategory(categories[0]);
    setExpenditure(0);
  };

  // Check if we should update the state to loading?
  if (patch && typeof expense?.id === "undefined")
    return <Loader context={"update"} />;

  if (categories.length === 0) return <Loader context={"categories"} />;

  return (
    <form onSubmit={handleSubmit} className={styles.customForm}>
      <Heading text={patch ? "Update" : "Add"} coloredText={"Expense"} />

      <label htmlFor="expense-name">
        <input
          type="text"
          placeholder="Expense Name"
          value={name}
          name="expense-name"
          onChange={(e) => setName(e.target.value)}
        />
        <span>Expense Name</span>
      </label>

      <select name="category" onChange={(e) => setCategory(e.target.value)}>
        {categories.map((cat, index) => {
          return (
            <option value={cat} key={index}>
              {cat}
            </option>
          );
        })}
      </select>

      <label htmlFor="expenditure">
        <input
          type="number"
          placeholder="Expenditure"
          value={expenditure}
          onChange={(e) => setExpenditure(e.target.value)}
        />
        <span>Expenditure</span>
      </label>
      <button type="submit" disabled={isLoading}>
        {(patch ? "Update" : "Add") + " Expense"}
      </button>
    </form>
  );
}
