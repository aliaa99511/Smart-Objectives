export function formatDecimal(value) {
  if (value === null || value === undefined) return "";

  return parseFloat(Number(value).toFixed(2)).toString();
}
