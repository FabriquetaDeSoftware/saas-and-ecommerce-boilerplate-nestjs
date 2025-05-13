import { VerificationCodes } from 'src/modules/auth/domain/entities/verification_codes.entity';
import { Products } from 'src/modules/products/domain/entities/products.entity';
import { User } from 'src/shared/entities/user.entity';

export const testData = {
  userAdmin: new User(),
  userSignupDefault: new User(),
  userSignupPasswordLess: new User(),
  productSinglePurchase: new Products(),
  productSubscription: new Products(),
  verificationCode: new VerificationCodes(),
};
