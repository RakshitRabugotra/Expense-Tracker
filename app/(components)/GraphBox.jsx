import styles from "./component.module.css";

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

export default function GraphBox() {
  const previousMonths = getPreviousMonths(5);

  return (
    <div className={styles.graphBox}>
      {previousMonths.map((month, index) => {
        return (
          <div className={styles.month} key={index}>
            <div className={styles.monthBar}></div>
            <p>{month}</p>
          </div>
        );
      })}
    </div>
  );
}
