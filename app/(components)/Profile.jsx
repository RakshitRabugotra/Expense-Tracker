"use client";
import { useMemo, useState } from "react";
import Heading from "./Heading";
import Link from "next/link";

export default function Profile({ user, children }) {
  const [userMonthly, setUserMonthly] = useState(user.monthly_limit);
  const [monthlyLimit, setMonthlyLimit] = useState(userMonthly);
  const [isLoading, setLoading] = useState(false);

  const isChanged = useMemo(() => {
    return monthlyLimit !== userMonthly;
  }, [monthlyLimit, userMonthly]);

  const updateMonthlyLimit = (e) => {
    e.preventDefault();
    setLoading(true);
    fetch(process.env.SERVER + `/api/collections/users/records/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        monthly_limit: Math.max(1, parseInt(monthlyLimit)),
      }),
      next: { revalidate: process.env.REVALIDATE_EXPENSE_SECONDS },
    })
      .then((response) => {
        if (response.status !== 200) throw response;
      })
      .catch((error) => console.log(error));
    
    setUserMonthly(prev => monthlyLimit);
    setLoading(false);
  };

  return (
    <>
      <Heading text={"Welcome"} coloredText={user.username} />
      {children}

      {/* To change the username */}

      {/* To change the monthly limit */}

      <section>
        <h3>Preferences</h3>
        <form
          onSubmit={updateMonthlyLimit}
          className="customForm"
        >
          <label htmlFor={"monthly-limit"}>
            <input
              required
              type="number"
              name="monthly-limit"
              placeholder="Monthly Limit"
              value={monthlyLimit}
              onChange={(e) => {
                +e.target.value >= 0 && setMonthlyLimit(e.target.value);
              }}
            />
            <span>Monthly Limit</span>
          </label>

          <button type="submit" disabled={isLoading || !isChanged}>
            {isChanged ? (isLoading ? "Saving" : "Save") : "Saved"}
          </button>
        </form>
      </section>

      {/* The logout button */}
      <Link className="redirect-links" href="/logout">
        Logout
      </Link>
    </>
  );
}
