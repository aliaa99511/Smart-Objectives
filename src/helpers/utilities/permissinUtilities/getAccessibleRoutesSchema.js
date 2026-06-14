import { ROLES } from "../../../settings/constants";

export function getAccessibleRoutesSchema(user) {
  if (!user || !user.roles) return [];

  const accessibleRoutes = [];

  // Iterate through each role the user has
  for (const role of user.roles) {
    const rolePages = ROLES[role]?.pages;

    if (rolePages) {
      // Process regular pages
      Object.entries(rolePages)?.forEach(([key, page]) => {
        // Handle regular pages
        if (page?.to && page?.hasPermission && !page.parentText) {
          accessibleRoutes.push(page);
        }

        // Handle parent links with children
        if (page.parentText && page.childLinks) {
          // Check if any child has permission
          const hasChildWithPermission = page.childLinks.some((childObj) => {
            const childKey = Object.keys(childObj)[0];
            return childObj[childKey]?.hasPermission;
          });

          if (hasChildWithPermission) {
            // Create parent route
            const parentRoute = {
              text: page.parentText,
              icon: page.parentIcon,
              isParent: true,
              children: [],
            };

            // Add children with permission
            page.childLinks.forEach((childObj) => {
              const childKey = Object.keys(childObj)[0];
              const child = childObj[childKey];

              if (child?.hasPermission && child?.text) {
                parentRoute.children.push(child);
              }
            });

            accessibleRoutes.push(parentRoute);
          }
        }
      });
    }
  }

  // Remove duplicates (in case the user has overlapping roles)
  const finalRoutes = (() => {
    const arr = Array.from(
      new Map(accessibleRoutes.map((r) => [r.to + r.text, r])).values(),
    );
    return [
      ...arr.filter((r) => r.to !== "/about"),
      ...arr.filter((r) => r.to === "/about"),
    ];
  })();

  return finalRoutes;
}
