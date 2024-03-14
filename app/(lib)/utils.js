import moment from "moment";

// The colors used in graphs
export const COLORS = [
  "#fe2e55" /* Red */,
  "#33a4db" /* light-blue */,
  "#fe9600" /* Orange */,
  "#fecf01" /* Yellow */,
  "#1775fe" /* Blue */,
  "#c7c6cb" /* Grey */,
];

export const EXPENDITURE_COLORS = [
  "#008450" /* Pastel Green */,
  "#efb700" /* Yellow */,
  "#b81d13" /* Red */,
];

// To clamp a number
export const clampNumber = (num, a, b) =>
  Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));

// Convert color from hex to RGB
export const hexToRgb = (hex) => {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

export const lerpRGB = (colorA, colorB, t) => {
  return {
    r: parseFloat(colorA.r + (colorB.r - colorA.r) * t),
    g: parseFloat(colorA.g + (colorB.g - colorA.g) * t),
    b: parseFloat(colorA.b + (colorB.b - colorA.b) * t),
  };
};

// Currency formatter
export const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});

// Number of days in this month
export const daysInCurrentMonth = () =>
  new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();

// Number of days left in this month
export const daysLeftInThisMonth = () =>
  daysInCurrentMonth() - new Date().getDate();

// Function to group certain elements in an listect by a key
export function groupBy(list, keyGetter) {
  const map = new Map();
  list.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
}

export function arraySum(list, keyGetter) {
  // Check if we're given some key
  if (typeof keyGetter === "undefined") {
    keyGetter = (item) => item;
  }

  // Base case: length is 0
  if (list.length === 0) {
    return 0;
  }
  // Base case: length is 1
  if (list.length === 1) {
    return keyGetter(list[0]);
  }
  // Else do this the old way
  let total = 0;
  list.forEach((value) => {
    total += keyGetter(value);
  });
  return total;
}

export const getExpenseToday = async (userID) => {
  const today = new Date();
  // Start of the day
  today.setHours(0, 0, 0);
  const startOfDay = moment(today).format("YYYY-MM-DD HH:MM:SS");

  // End of the day
  today.setHours(23, 59, 59);
  const endOfDay = moment(today).format("YYYY-MM-DD HH:MM:SS");

  // Send a fetch request for particular date
  const params = "/api/collections/expenses/records?page=1&perPage=50";
  const filter = `&filter=(expense_date>='${startOfDay}'%26%26expense_date<='${endOfDay}'%26%26user_id='${userID}')`;
  // Send the fetch request
  const res = await fetch(process.env.SERVER + params + filter, {
    cache: "no-store",
  });
  // Get the items
  const data = await res.json();
  // Return the items
  return await data?.items;
};

export const getExpenseThisMonth = async (userID) => {
  const monthStart = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  ).toISOString();
  const monthEnd = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    1
  ).toISOString();

  const params = "/api/collections/expenses/records?page=1&perPage=50";
  const filter = `&filter=(expense_date>='${monthStart}'%26%26expense_date<='${monthEnd}'%26%26user_id='${userID}')`;
  // Send the fetch request
  const res = await fetch(process.env.SERVER + params + filter, {
    cache: "no-cache",
  });
  // Get the items
  const data = await res.json();
  // Return the items
  return await data?.items;
};

export const getCategorizedExpenses = async (expenses) => {
  // Group the expenses by their category
  const groupedExpenses = groupBy(expenses, (expense) => expense.category);
  const categorizedExpenditure = {};
  groupedExpenses.forEach((exp, category) => {
    categorizedExpenditure[category] = arraySum(
      exp,
      (expense) => expense.expenditure
    );
  });
  return categorizedExpenditure;
};
