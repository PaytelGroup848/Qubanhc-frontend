export const ADMIN_MODULES = [
  {
    id: "categories",
    label: "Categories",
    path: "/admin/categories",
  },
  {
    id: "products",
    label: "Products",
    path: "/admin/products",
  },
  {
    id: "orders",
    label: "Orders",
    path: "/admin/orders",
  },
  {
    id: "customers",
    label: "Customers",
    path: "/admin/customers",
  },
  {
    id: "support",
    label: "Support",
    path: "/admin/support",
  },
  {
    id: "get_in_touch",
    label: "Get in Touch",
    path: "/admin/get-in-touch",
  },
];

export const ADMIN_MODULE_ORDER = [
  "categories",
  "products",
  "orders",
  "customers",
  "support",
  "get_in_touch",
];

export const getUserPermissions = (user) => {
  if (!user) return [];

  if (Array.isArray(user.permissions)) {
    return user.permissions;
  }

  if (Array.isArray(user.user?.permissions)) {
    return user.user.permissions;
  }

  return [];
};

export const isSuperAdmin = (user) => {
  return user?.role === 'super_admin' || user?.user?.role === 'super_admin';
};

export const canAccessModule = (user, moduleId) => {
  if (isSuperAdmin(user)) return true;

  const permissions = getUserPermissions(user);

  return permissions.includes(moduleId);
};

export const getFirstAllowedAdminRoute = (user) => {
  if (!user) return '/login';

  if (isSuperAdmin(user)) {
    return '/admin/dashboard';
  }

  const permissions = getUserPermissions(user);

  const firstPermission = ADMIN_MODULE_ORDER.find((moduleId) =>
    permissions.includes(moduleId)
  );

  const module = ADMIN_MODULES.find((item) => item.id === firstPermission);

  return module?.path || '/admin/no-access';
};

export const getAllowedAdminMenus = (user) => {
  if (isSuperAdmin(user)) {
    return ADMIN_MODULES;
  }

  const permissions = getUserPermissions(user);

  return ADMIN_MODULES.filter((module) => permissions.includes(module.id));
};