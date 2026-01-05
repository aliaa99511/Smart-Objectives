/**
 * Generates an array of years from a starting year to the current year
 * @param {number} startYear - The starting year (defaults to 2015 if not provided)
 * @returns {Array} - Array of years from startYear to current year in descending order
 */
export const getYearsArray = (startYear = 2015) => {
  const currentYear = new Date().getFullYear();
  const years = [];

  // Validate startYear
  if (
    typeof startYear !== "number" ||
    startYear < 1900 ||
    startYear > currentYear
  ) {
    startYear = 2015; // Default to 2015 if invalid
  }

  // Generate years array in descending order (newest first)
  for (let year = currentYear; year >= startYear; year--) {
    years.push(year);
  }

  return years;
};
