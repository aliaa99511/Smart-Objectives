import { ROLES } from "../../../settings/constants/system/permissions.constants";
import { isArraySubset } from "../isArraySubset";

export const isUserAuthrized = (user) => {
  // If user has CEO role, they are always authorized
  if (user?.roles?.includes("CEO")) {
    return true;
  }

  // If user has no roles, they are not authorized
  if (!user?.roles || user.roles.length === 0) {
    return false;
  }

  // Fix for "Manger" typo - check both spellings
  const normalizedRoles = user?.roles?.map(role =>
    role === "Manger" ? "Manager" : role
  );

  const allAllowedRoles = Object.keys(ROLES);

  // Check if at least one role is in the allowed roles
  return normalizedRoles.some(role => allAllowedRoles.includes(role));
};