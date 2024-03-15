import styles from "./graph-box.module.css";


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
