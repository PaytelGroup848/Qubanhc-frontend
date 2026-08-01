export const ADMIN_MODULES = [
  {
    id: 'categories',
    label: 'Categories',
    path: '/admin/categories',
  },
  {
    id: 'products',
    label: 'Products',
    path: '/admin/products',
  },
  {
    id: 'orders',
    label: 'Orders',
    path: '/admin/orders',
  },
  {
    id: 'customers',
    label: 'Customers',
    path: '/admin/customers',
  },
  {
    id: 'support',
    label: 'Support',
    path: '/admin/support',
  },
];

export const SUPER_ADMIN_MENUS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/admin/dashboard',
  },
  {
    id: 'sub_admins',
    label: 'Sub-Admins',
    path: '/admin/sub-admins',
  },
  {
    id: 'products',
    label: 'Products',
    path: '/admin/products',
  },
  {
    id: 'categories',
    label: 'Categories',
    path: '/admin/categories',
  },
  {
    id: 'orders',
    label: 'Orders',
    path: '/admin/orders',
  },
  {
    id: 'customers',
    label: 'Customers',
    path: '/admin/customers',
  },
  {
    id: 'coupons',
    label: 'Coupons',
    path: '/admin/coupons',
  },
  {
    id: 'reports',
    label: 'Reports',
    path: '/admin/reports',
  },
  {
    id: 'support',
    label: 'Support',
    path: '/admin/support',
  },
  {
    id: 'settings',
    label: 'Settings',
    path: '/admin/settings',
  },
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

export const isSubAdmin = (user) => {
  return user?.role === 'sub_admin' || user?.user?.role === 'sub_admin';
};

export const canAccessModule = (user, moduleId) => {
  if (isSuperAdmin(user)) return true;

  if (!isSubAdmin(user)) return false;

  const permissions = getUserPermissions(user);

  return permissions.includes(moduleId);
};

export const getFirstAllowedAdminPath = (user) => {
  if (!user) return '/admin/login';

  if (isSuperAdmin(user)) {
    return '/admin/dashboard';
  }

  const permissions = getUserPermissions(user);

  const firstModule = ADMIN_MODULES.find((module) =>
    permissions.includes(module.id)
  );

  return firstModule?.path || '/admin/no-access';
};

export const getAdminMenus = (user) => {
  if (isSuperAdmin(user)) {
    return SUPER_ADMIN_MENUS;
  }

  if (!isSubAdmin(user)) {
    return [];
  }

  const permissions = getUserPermissions(user);

  return ADMIN_MODULES.filter((module) => permissions.includes(module.id));
};

export const getModuleByPath = (pathname = '') => {
  if (pathname.startsWith('/admin/categories')) return 'categories';
  if (pathname.startsWith('/admin/products')) return 'products';
  if (pathname.startsWith('/admin/orders')) return 'orders';
  if (pathname.startsWith('/admin/customers')) return 'customers';
  if (pathname.startsWith('/admin/support')) return 'support';

  return null;
};