import styles from "./graph-box.module.css";

// Utility function to convert month name to month number
function getMonthNumberFromName(monthName) {
  const year = new Date().getFullYear();
  return new Date(`${monthName} 1, ${year}`).toLocaleString("default", {month: "2-digit"});
}

// Get the total expenses for a particular month
const getMonthlyExpenses = async({year, monthStart, monthEnd}) => {
  // Set the path and filter for the month
  const path = "/api/collections/expenses/records?page=1&perPage=30";
  const filter = `&filter=(created<'${year}-${monthStart}-01'&&created >='${year}-${monthEnd}-01')`;
  // Send the fetch request
  console.log(process.env.SERVER + path + filter);
  const res = await fetch(path + filter, {
    cache: "no-store"
  });

  if(res.status === 404) {
    return {items: []}
  }

  const data = await res.json();
  return data;
}

// Returns 'n' number of previous months from today
const getPreviousMonths = (n) => {
  const today = new Date();
  const todayMonth = today.getMonth();

  const previousMonths = [];
  for (let i = n - 1; i >= 0; i--) {
    const newMonth = todayMonth - i >= 0 ? todayMonth - i : todayMonth - i + 12;
    today.setMonth(newMonth);
    const month = today.toLocaleString("default", { month: "short" });
    previousMonths.push(month);
  }

  return previousMonths;
};

export default async function GraphBox() {

  const previousMonths = getPreviousMonths(5);

  const monthlyLimit = 1000;

  const today = new Date();

  const monthTotals = new Map();

  // const monthlyExpenses = await getMonthlyExpenses({
  //   year: today.getFullYear(),
  //   monthStart: getMonthNumberFromName(month)
  // })

  // previousMonths.forEach(async(month) => {
  //   Promise.resolve(getMonthlyExpenses({
  //     year: today.getFullYear(),
  //     month: getMonthNumberFromName(month)
  //   }))
  //   .then(data => {
  //     monthlyExpenses = data.items;
  //     const expenditures = monthlyExpenses.map(expense => expense.expenditure);
  //     const monthTotal = expenditures.reduce((accumulator, currentValue) => accumulator + currentValue);
  //     monthTotals.set(month, monthTotal);
  //     // console.log(monthlyExpenses);
  //   })
  //   .catch(error => console.log(error));
  // })

  return (
    <div className={styles.graphBox}>
      {previousMonths.map((month, index) => {
        // const height = (100*monthTotal)/monthlyLimit;
        const height = 100;
        return (
          <div className={styles.month} key={index}>
            <div className={styles.monthBar} style={{height: `${Math.round(height)}%`}}></div>
            <p>{month}</p>
          </div>
        );
      })}
    </div>
  );
}
