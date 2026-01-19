import { ROLES } from "../../../settings/constants/system/permissions.constants";

export const canAccessPage = (user, page) => {
  if (!user || !user.roles) return false;

  return user.roles.some((role) => {
    const rolePages = ROLES[role]?.pages;

    // Check direct page permission
    if (rolePages?.[page]?.hasPermission) {
      return true;
    }

    // Check if page is a child of a parent link
    for (const key in rolePages) {
      const currentPage = rolePages[key];

      // If this is a parent link with children
      if (currentPage.parentText && currentPage.childLinks) {
        // Check each child
        for (const childObj of currentPage.childLinks) {
          const childKey = Object.keys(childObj)[0];

          // If this child matches our page and has permission
          if (childKey === page && childObj[childKey]?.hasPermission) {
            return true;
          }
        }
      }
    }

    return false;
  });
};
