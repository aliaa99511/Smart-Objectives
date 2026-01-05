import { ROLES } from "../../../settings/constants/system/permissions.constants";

export const hasPermission = (user, resource, action, data) => {
  return user?.roles.some((role) => {
    const permissions = ROLES[role]?.[resource]?.[action];
    if (permissions == null) return false;

    if (typeof permissions === "boolean") return permissions;
    return data != null && permissions(user, data);
  });
};
