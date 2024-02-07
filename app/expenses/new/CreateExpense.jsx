// This should be an interactive component,
// that is rendered on the client
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./new-expense.module.css";
import Heading from "../../(components)/Heading";
import Loader from "../../(components)/Loader";
import PocketBase from "pocketbase";

export default function CreateExpense() {
  const router = useRouter();
  // For the valid categories in the system
  const [categories, setCategories] = useState([]);

  // The state variables for particular expense
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [expenditure, setExpenditure] = useState(0);

  // Get the categories from the backend
  const getCategories = async() => {
    const pb = new PocketBase('https://expense-tracker.pockethost.io');
    // you can also fetch all records at once via getFullList
    const records = await pb.collection('categories').getFullList({
      sort: '-created',
    });
    setCategories(records.map(record => record.name));
  }
  // Do this once
  useEffect(() => {
   getCategories();
  }, []);
  
  const handleSubmit = async (e) => {
    // Prevent the default behavior
    e.preventDefault();
    const pb = new PocketBase('https://expense-tracker.pockethost.io');

    // Create the data
    const data = {
      name,
      "category": category.length === 0 ? categories[0] : category,
      expenditure,
    }    
    const record = await pb.collection('expenses').create(data);

    router.replace("/expenses");
    setName("");
    setCategory(categories[0]);
    setExpenditure(0);
  };

  if(categories.length === 0) return <Loader context={"categories"}/>

  return (
    <form onSubmit={handleSubmit} className={styles.createExpenseForm}>
      <Heading text={"Add"} coloredText={"Expense"}/>
      <input
        type="text"
        placeholder="Expense Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <select name="category" onChange={e => setCategory(e.target.value)}>
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

      <button type="submit">Add Expense</button>
    </form>
  );
}
