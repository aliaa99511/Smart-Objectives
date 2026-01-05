export const isArraySubset = (mainArray, subArray) => {
  // Handle empty subset case
  if (!subArray?.length) return false;
  return subArray.every((item) => mainArray?.includes(item));
};
