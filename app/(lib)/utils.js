import moment from "moment";

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

export const getExpenseToday = async (userID) => {
  const today = new Date();
  // Start of the day
  today.setHours(0, 0, 0);
  const startOfDay = moment.utc(today).format("YYYY-MM-DD HH:MM:SS");
  // End of the day
  today.setHours(23, 59, 59);
  const endOfDay = moment.utc(today).format("YYYY-MM-DD HH:MM:SS");

  // Send a fetch request for particular date
  const params = "/api/collections/expenses/records?page=1&perPage=50";
  const filter = `&filter=(created>='${startOfDay}'%26%26created<='${endOfDay}'%26%26user_id='${userID}')`;
  // Send the fetch request
  const res = await fetch(process.env.SERVER + params + filter, {
    cache: "no-store",
  });
  // Get the items
  const data = await res.json();
  // Return the items
  return data?.items;
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
  const filter = `&filter=(created>='${monthStart}'%26%26created<='${monthEnd}'%26%26user_id='${userID}')`;
  // Send the fetch request
  const res = await fetch(process.env.SERVER + params + filter, {
    cache: "no-cache",
  });
  // Get the items
  const data = await res.json();
  // Return the items
  return data?.items;
};

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
