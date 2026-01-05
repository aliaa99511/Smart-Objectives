export const getYearAndQuarter = (date = new Date(), quarterNum, yearNum) => {
  const year = yearNum ?? date.getFullYear();
  const month = date.getMonth(); // January = 0, December = 11

  const quarters = [
    { quarter: "1", months: ["Jan", "Feb", "Mar"] },
    { quarter: "2", months: ["Apr", "May", "Jun"] },
    { quarter: "3", months: ["Jul", "Aug", "Sep"] },
    { quarter: "4", months: ["Oct", "Nov", "Dec"] },
  ];

  const index = Math.floor(month / 3);
  return {
    year,
    quarter: quarters[quarterNum ? quarterNum - 1 : index].quarter,
    quarterMonths: quarters[quarterNum ? quarterNum - 1 : index].months,
  };
};
