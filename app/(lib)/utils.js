// Currency formatter
export const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR'
});

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
