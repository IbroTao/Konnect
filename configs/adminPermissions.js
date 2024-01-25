/**
 * @property read - admin can only view data in the admin dashboard
 * @property write - admin can write data in the admin dashboard
 * @property delete - admin can also delete users, groups and posts
 * @property super - super admin can add other admins as well as delete them
 */

const adminPermissions = ["read", "write", "delete", "super"];
module.exports = adminPermissions;
