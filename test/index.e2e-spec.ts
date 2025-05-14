describe('🧪 E2E Test - Execution Order', () => {
  require('./cases/auth/sign-up-default.e2e-spec');
  require('./cases/auth/sign-up-password-less.e2e-spec');
  require('./cases/auth/verify-account.e2e-spec');
  require('./cases/auth/sign-in-default.e2e-spec');
  require('./cases/auth/sign-in-magic-link.e2e-spec');
  require('./cases/auth/refresh-token.e2e-spec');
  // require('./cases/auth/forgot-password.e2e-spec');
  //require('./cases/auth/recovery-password.e2e-spec');

  // require('./cases/root/protected.e2e-spec');
  // require('./cases/root/admin.e2e-spec');
  // require('./cases/root/user.e2e-spec');

  // require('./cases/products/create.e2e-spec');
  // require('./cases/products/update.e2e-spec');
  // require('./cases/products/list-many.e2e-spec');
  // require('./cases/products/show-one.e2e-spec');
  // require('./cases/products/delete.e2e-spec');
});
