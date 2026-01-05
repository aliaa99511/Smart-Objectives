/**
 * Formats a SharePoint date string to DD/MM/YYYY format
 * @param {string} sharePointDate - SharePoint date in format "/Date(timestamp)/"
 * @returns {string} Formatted date string in DD/MM/YYYY format
 */
export const formatSharePointDate = (sharePointDate) => {
  if (!sharePointDate) return "";
  
  // Extract the timestamp from the SharePoint date format
  const timestampMatch = sharePointDate.match(/\/Date\((\d+)\)\//);
  if (!timestampMatch || !timestampMatch[1]) return "";
  
  const timestamp = parseInt(timestampMatch[1], 10);
  const date = new Date(timestamp);
  
  // Check if date is valid
  if (isNaN(date.getTime())) return "";
  
  // Format the date as DD/MM/YYYY
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
};

/**
 * Formats a date object to DD/MM/YYYY format
 * @param {Date} date - JavaScript Date object
 * @returns {string} Formatted date string in DD/MM/YYYY format
 */
export const formatDate = (date) => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) return "";
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
};