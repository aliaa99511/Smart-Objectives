import { ROLES } from "../../../settings/constants/system/permissions.constants";

export const canAccessPage = (user, page) => {
  if (!user || !user.roles) {
    return false;
  }

  if (page === "unauthorized") {
    return false;
  }

  // Check each role the user has
  for (const role of user.roles) {
    // Handle "Manger" typo
    const normalizedRole = role === "Manger" ? "Manager" : role;
    const roleConfig = ROLES[normalizedRole];
    if (!roleConfig?.pages) continue;

    const rolePages = roleConfig.pages;

    // Check direct page permission
    if (rolePages?.[page]?.hasPermission) {
      return true;
    }

    // Check if page is a child of a parent link
    for (const key in rolePages) {
      const currentPage = rolePages[key];
      if (currentPage.parentText && currentPage.childLinks) {
        for (const childObj of currentPage.childLinks) {
          const childKey = Object.keys(childObj)[0];
          if (childKey === page && childObj[childKey]?.hasPermission) {
            return true;
          }
        }
      }
    }
  }

  return false;
};