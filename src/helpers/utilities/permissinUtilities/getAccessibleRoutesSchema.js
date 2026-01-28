import { ROLES } from "../../../settings/constants";

export function getAccessibleRoutesSchema(user) {
  if (!user || !user.roles || !user.roles.length) return [];

  const accessibleRoutes = [];
  const addedRoutes = new Set();

  // Check if user has CEO role - CEO gets only CEO pages
  if (user.roles.includes("CEO")) {
    const ceoPages = ROLES.CEO?.pages;
    if (ceoPages) {
      Object.entries(ceoPages).forEach(([key, page]) => {
        if (page?.to && page?.hasPermission && !page.parentText) {
          const routeKey = `${page.to}_${page.text}`;
          if (!addedRoutes.has(routeKey)) {
            accessibleRoutes.push(page);
            addedRoutes.add(routeKey);
          }
        }
      });
    }
    // Don't add any other roles' pages for CEO
    return accessibleRoutes;
  }

  // For non-CEO users, use the original logic
  for (const role of user.roles) {
    if (!ROLES[role]) continue;

    const rolePages = ROLES[role]?.pages;
    if (rolePages) {
      Object.entries(rolePages).forEach(([key, page]) => {
        // Handle regular pages
        if (page?.to && page?.hasPermission && !page.parentText) {
          const routeKey = `${page.to}_${page.text}`;
          if (!addedRoutes.has(routeKey)) {
            accessibleRoutes.push(page);
            addedRoutes.add(routeKey);
          }
        }

        // Handle parent links with children
        if (page?.parentText && page?.childLinks) {
          const hasChildWithPermission = page.childLinks.some((childObj) => {
            const childKey = Object.keys(childObj)[0];
            return childObj[childKey]?.hasPermission;
          });

          if (hasChildWithPermission) {
            const parentKey = `parent_${page.parentText}`;
            let parentRoute = accessibleRoutes.find(r => r.text === page.parentText);

            if (!parentRoute) {
              parentRoute = {
                text: page.parentText,
                icon: page.parentIcon,
                isParent: true,
                children: [],
              };
              accessibleRoutes.push(parentRoute);
              addedRoutes.add(parentKey);
            }

            page.childLinks.forEach((childObj) => {
              const childKey = Object.keys(childObj)[0];
              const child = childObj[childKey];

              if (child?.hasPermission) {
                const childExists = parentRoute.children.some(
                  c => c.text === child.text
                );
                if (!childExists) {
                  parentRoute.children.push(child);
                }
              }
            });
          }
        }
      });
    }
  }

  return accessibleRoutes;
}
