export function isDateOutsideCurrentQuarter(dateStr) {
  // convert dd/mm/yyyy → Date
  const [day, month, year] = dateStr.split("/").map(Number);
  const inputDate = new Date(year, month - 1, day);

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-11

  // get current quarter
  const currentQuarter = Math.floor(currentMonth / 3);

  // quarter start & end
  const start = new Date(currentYear, currentQuarter * 3, 1);
  const end = new Date(currentYear, currentQuarter * 3 + 3, 0);

  return inputDate < start || inputDate > end;
}
