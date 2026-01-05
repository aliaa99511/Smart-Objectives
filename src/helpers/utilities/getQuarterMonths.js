export const getQuarterMonths = (quarterNumber) => {
  // Ensure quarter number is between 1-4
  const normalizedQuarter = Math.min(Math.max(parseInt(quarterNumber), 1), 4);

  const quarters = [
    { quarter: "1", months: ["Jan", "Feb", "Mar"] },
    { quarter: "2", months: ["Apr", "May", "Jun"] },
    { quarter: "3", months: ["Jul", "Aug", "Sep"] },
    { quarter: "4", months: ["Oct", "Nov", "Dec"] },
  ];

  // Return the months for the specified quarter (index is quarterNumber - 1)
  return quarters[normalizedQuarter - 1].months;
};
