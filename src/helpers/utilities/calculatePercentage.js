/**
 * Calculates the percentage of a number relative to a total
 * @param {number} value - The value to calculate percentage for
 * @param {number} total - The total value
 * @param {number} [defaultValue=0] - Default value to return if total is zero
 * @returns {number} - The calculated percentage
 */
export const calculatePercentage = (value, total, defaultValue = 0) => {
  if (!total || total === 0) return defaultValue;
  return (value / total) * 100;
};