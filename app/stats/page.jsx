import GraphBox from "../(components)/GraphBox";
import Heading from "../(components)/Heading";
import BarChart from "../(components)/BarChart";
import AnimCountUp from "../(components)/AnimCountUp";
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
    <div className="card">
      <h3>{text}</h3>
      <BarChart
        keyValuePairObj={categorizedExpenses}
        noDataFoundMessage={"No Expenditure yet..."}
      />
    </div>
  );
};

// The component that shows total monthly expenditure
const TotalMonthlyExpenditure = ({ expenditure, monthlyLimit }) => {
  // Format this to local currency
  const formattedExp = currencyFormatter.format(expenditure);
  // To get various attributes from the formatted string
  const currencyFormat = {
    symbol: formattedExp.charAt(0),
    integer: formattedExp.slice(1, -3),
    decimal: formattedExp.slice(-3),
  };

  return (
    <div className="card">
      <AnimCountUp
        start={0}
        end={expenditure}
        duration={1.5}
        decimals={2}
        delay={0.25}
        useEasing={true}
        prefix={"You Spent: "}
        currencySymbol={currencyFormat.symbol}
        styleClass={styles.expenditureCount}
        counterWrapperClass={styles.counterWrapper}
        monthlyLimit={monthlyLimit}
      />
    </div>
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

  return (
    <div className="page">
      <Heading text={"Your"} coloredText={"Statistics"} />
      {/* <GraphBox /> */}
      {/* The total expenditure of the user this month */}
      <div className={styles.content}>
        {/* The total expenditure this month */}
        <TotalMonthlyExpenditure
          expenditure={totalExpenditureThisMonth}
          monthlyLimit={record.monthly_limit}
        />
        {/* The expenditure categorized */}
        <CategorizedExpenditure
          categorizedExpenses={categorizedExpenses}
          text={"Monthly Breakdown"}
        />
      </div>
    </div>
  );
}
