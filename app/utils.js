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

export function arraySum(list, keyGetter = null) {
  // Check if we're given some key
  const isKeyDefined = typeof keyGetter !== "undefined";

  // Base case: length is 0
  if (list.length === 0) {
    return 0;
  }
  // Base case: length is 1
  if (list.length === 1) {
    return isKeyDefined ? keyGetter(list[0]) : list[0];
  }
  // Else do this the old way
  return list.reduce((prevValue, currentValue) => {
    return isKeyDefined
      ? keyGetter(prevValue) + keyGetter(currentValue)
      : prevValue + currentValue;
  });
}
