export const load = async ({ locals }) => ({
  isAdmin: locals.isAdmin,
  isAuthenticated: locals.isAuthenticated,
});
