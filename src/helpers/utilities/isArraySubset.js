export const isArraySubset = (mainArray, subArray) => {
  // Handle empty subset case
  if (!subArray?.length) return false;
  // Check if at least one item in subArray exists in mainArray
  return subArray.some((item) => mainArray?.includes(item));
};