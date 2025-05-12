describe('🧪 E2E Test - Execution Order', () => {
  require('./auth/sign-up-default.e2e-spec');
  require('./auth/sign-up-password-less.e2e-spec');
  require('./auth/verify-account.e2e-spec');
  require('./auth/sign-in-default.e2e-spec');
  require('./auth/sign-in-magic-link.e2e-spec');
  require('./auth/refresh-token.e2e-spec');
  require('./auth/forgot-password.e2e-spec');
  require('./auth/recovery-password.e2e-spec');

  require('./root/protected.e2e-spec');
  require('./root/admin.e2e-spec');
  require('./root/user.e2e-spec');

  require('./products/create.e2e-spec');
  require('./products/update.e2e-spec');
  require('./products/list-many.e2e-spec');
  require('./products/show-one.e2e-spec');
  require('./products/delete.e2e-spec');
});
