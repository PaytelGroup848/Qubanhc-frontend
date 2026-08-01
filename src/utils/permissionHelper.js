/**
 * Check if user has specific permission
 * @param {Object} user - User object with permissions array
 * @param {string} permission - Permission to check (e.g., 'categories_view')
 * @returns {boolean}
 */
export const hasPermission = (user, permission) => {
  if (!user) return false;
  
  // Super admin has all permissions
  if (user.role === 'super_admin') return true;
  
  // Sub-admin check permissions
  if (user.role === 'sub_admin') {
    return user.permissions?.includes(permission) || false;
  }
  
  return false;
};

/**
 * Check if user has any of the given permissions
 * @param {Object} user - User object
 * @param {string[]} permissions - Array of permissions
 * @returns {boolean}
 */
export const hasAnyPermission = (user, permissions) => {
  if (!user || !permissions) return false;
  
  // Super admin has all permissions
  if (user.role === 'super_admin') return true;
  
  if (user.role === 'sub_admin') {
    return permissions.some(perm => user.permissions?.includes(perm));
  }
  
  return false;
};

/**
 * ✅ Check if user has any permission for a module (view, create, edit, delete)
 * @param {Object} user - User object
 * @param {string} module - Module name (e.g., 'categories')
 * @returns {boolean}
 */
export const hasModuleAccess = (user, module) => {
  if (!user) return false;
  
  // Super admin has all permissions
  if (user.role === 'super_admin') return true;
  
  if (user.role === 'sub_admin') {
    const modulePermissions = [
      `${module}_view`,
      `${module}_create`,
      `${module}_edit`,
      `${module}_delete`
    ];
    return modulePermissions.some(perm => user.permissions?.includes(perm));
  }
  
  return false;
};

/**
 * Check if user can view a module
 * @param {Object} user - User object
 * @param {string} module - Module name (e.g., 'categories')
 * @returns {boolean}
 */
export const canViewModule = (user, module) => {
  return hasPermission(user, `${module}_view`);
};

/**
 * Check if user can create in a module
 * @param {Object} user - User object
 * @param {string} module - Module name (e.g., 'categories')
 * @returns {boolean}
 */
export const canCreateModule = (user, module) => {
  return hasPermission(user, `${module}_create`);
};

/**
 * Check if user can edit in a module
 * @param {Object} user - User object
 * @param {string} module - Module name (e.g., 'categories')
 * @returns {boolean}
 */
export const canEditModule = (user, module) => {
  return hasPermission(user, `${module}_edit`);
};

/**
 * Check if user can delete in a module
 * @param {Object} user - User object
 * @param {string} module - Module name (e.g., 'categories')
 * @returns {boolean}
 */
export const canDeleteModule = (user, module) => {
  return hasPermission(user, `${module}_delete`);
};