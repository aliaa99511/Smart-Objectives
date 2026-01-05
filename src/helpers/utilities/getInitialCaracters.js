export const getInitialCaracters = (name) => {
  return name
    ?.split(" ")
    .map((word) => word[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
};
