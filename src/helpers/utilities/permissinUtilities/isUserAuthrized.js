import { ROLES } from "../../../settings/constants/system/permissions.constants";
import { isArraySubset } from "../isArraySubset";

export const isUserAuthrized = (user) => {
  const allAllowedRoles = Object.keys(ROLES);
  return isArraySubset(allAllowedRoles, user?.roles);
};
