export function isSuperAdmin(roles: string[]) {
    return roles.includes('SUPERADMIN');
}
