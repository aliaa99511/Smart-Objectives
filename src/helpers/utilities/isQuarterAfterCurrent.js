import { getYearAndQuarter } from "./getYearAndQuarter";
export const isQuarterAfterCurrent = (quarterToCheck) => {
  const { quarter: currentQuarter } = getYearAndQuarter();
  return parseInt(quarterToCheck) > parseInt(currentQuarter);
};
