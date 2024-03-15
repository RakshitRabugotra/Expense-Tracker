import GraphBox from "../(components)/GraphBox";
import Heading from "../(components)/Heading";
import BarChart from "../(components)/(charts)/BarChart";
import ExpenditureCountUp from "../(components)/ExpenditureCountUp";
import FilledExpenseLineChart from "../(components)/(charts)/FilledExpenseLineChart";
import { cookies } from "next/headers";
import styles from "./stats.module.css";

// Custom Components
import { getUser } from "../(lib)/auth";
import {
  getExpenseThisMonth,
  getCategorizedExpenses,
  arraySum,
  currencyFormatter,
} from "../(lib)/utils";

// The component that shows categorized expenses in form of horizontal bar-charts
const CategorizedExpenditure = ({ categorizedExpenses, text }) => {
  return (
    <>
      <h3>{text}</h3>
      <BarChart
        keyValuePairObj={categorizedExpenses}
        noDataFoundMessage={"No Expenditure yet..."}
      />
    </>
  );
};

export default async function StatsPage() {
  // Get the current logged-in user
  const session = cookies().get("session")?.value;
  const { record, token } = await getUser(session);

  // Get the expenses made this month
  const expensesThisMonth = await getExpenseThisMonth(record.id);
  // The total of these
  const totalExpenditureThisMonth = arraySum(
    expensesThisMonth,
    (expense) => expense.expenditure
  );
  // Get the categorized expenses
  const categorizedExpenses = await getCategorizedExpenses(expensesThisMonth);

  // Format this to local currency
  const formattedExp = currencyFormatter.format(totalExpenditureThisMonth);
  // To get various attributes from the formatted string
  const currencyFormat = {
    symbol: formattedExp.charAt(0),
    integer: formattedExp.slice(1, -3),
    decimal: formattedExp.slice(-3),
  };

  return (
    <div className="page">
      <Heading text={"Your"} coloredText={"Statistics"} />
      {/* <GraphBox /> */}
      {/* The total expenditure of the user this month */}
      <div className={styles.content}>
        {/* The total expenditure this month */}
        <div className={`card ${styles.countUp}`}>
          <ExpenditureCountUp
            title={"You Spent: "}
            duration={1.25}
            expenditure={totalExpenditureThisMonth}
            prefix={currencyFormat.symbol}
            styleClass={styles.expenditureCount}
            counterWrapperClass={styles.counterWrapper}
            monthlyLimit={record.monthly_limit}
          />
        </div>

        {/* The expenditure categorized */}
        <div className={`card ${styles.categoryBarChart}`}>
          <CategorizedExpenditure
            categorizedExpenses={categorizedExpenses}
            text={"Monthly Breakdown"}
          />
        </div>
        {/* The expense line chart */}
        <div className={`card ${styles.expenseLineChart}`}>
          <FilledExpenseLineChart user={record} />
        </div>

        {/* The percentage spent of monthly limit */}
        <div className={`card ${styles.monthlyPercentage}`}>
          <ExpenditureCountUp
            title={"Used this much:"}
            duration={3}
            expenditure={100*(totalExpenditureThisMonth/record.monthly_limit)}
            styleClass={styles.expenditureCount}
            counterWrapperClass={styles.counterWrapper}
            suffix={"%"}
            monthlyLimit={100}
          />
        </div>

      </div>
    </div>
  );
}
