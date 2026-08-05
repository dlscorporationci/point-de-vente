/**
 * Service d'Autorisation Frontend pour ApexPOS Enterprise
 * Centralise les contrôles RBAC (Rôles & Permissions) et ABAC (Zones d'Accès & Périmètres)
 */

const MODULE_ALIASES = {
  stocks: ['catalog'],
  catalog: ['stocks'],
  sales: ['pos'],
  'cash-sessions': ['pos'],
  pos: ['sales', 'cash-sessions'],
  suppliers: ['purchases'],
  purchases: ['suppliers'],
  customers: ['pos', 'sales'],
};

export const getRoleSlug = (role) => {
  if (!role) return '';
  if (typeof role === 'string') return role.toLowerCase();
  if (typeof role === 'object') return String(role.slug || role.name || '').toLowerCase();
  return String(role).toLowerCase();
};

export const isSuperAdmin = (user) => {
  if (!user) return false;
  const roleSlug = getRoleSlug(user.role);
  return (
    roleSlug === 'super-admin' ||
    roleSlug === 'superadmin' ||
    user.email === 'superadmin@dls.com' ||
    !!user.is_superadmin
  );
};

export const canAccessModule = (user, moduleKey) => {
  if (!user) return false;
  if (isSuperAdmin(user)) return true;

  const roleSlug = getRoleSlug(user.role);
  if (roleSlug === 'admin' || roleSlug === 'administrateur entreprise') {
    return true;
  }

  const alwaysAllowed = ['home', 'dashboard', 'auth', 'userguide', 'notifications', 'sync-center', 'select-branch'];
  if (alwaysAllowed.includes(moduleKey)) return true;

  const allowedModules = user.access_zone?.allowed_modules;
  if (!allowedModules || !Array.isArray(allowedModules) || allowedModules.length === 0) {
    return true; // Si aucune zone restreinte n'est définie = accès complet
  }

  if (allowedModules.includes(moduleKey)) return true;

  const aliases = MODULE_ALIASES[moduleKey];
  if (aliases) {
    for (const alias of aliases) {
      if (allowedModules.includes(alias)) return true;
    }
  }

  return false;
};

export const hasPermission = (user, permissionSlug) => {
  if (!user) return false;
  if (isSuperAdmin(user)) return true;

  const roleSlug = getRoleSlug(user.role);
  if (roleSlug === 'admin' || roleSlug === 'administrateur entreprise') {
    return true;
  }

  const perms = user.permissions;
  if (Array.isArray(perms) && perms.includes(permissionSlug)) {
    return true;
  }

  if (user.role && Array.isArray(user.role.permissions)) {
    const rolePermSlugs = user.role.permissions.map(p => (typeof p === 'string' ? p : p.slug));
    if (rolePermSlugs.includes(permissionSlug)) return true;
  }

  return false;
};

export const canAccessBranch = (user, branchId) => {
  if (!user || !branchId) return true;
  if (isSuperAdmin(user)) return true;

  const bId = parseInt(branchId, 10);
  const allowedBranchIds = user.access_zone?.branch_ids;
  if (Array.isArray(allowedBranchIds) && allowedBranchIds.length > 0) {
    const mapped = allowedBranchIds.map(id => parseInt(id, 10));
    if (!mapped.includes(bId)) return false;
  }

  return true;
};
