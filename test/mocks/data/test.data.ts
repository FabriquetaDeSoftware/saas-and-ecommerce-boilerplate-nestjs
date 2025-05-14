import { VerificationCodes } from 'src/modules/auth/domain/entities/verification_codes.entity';
import { Products } from 'src/modules/products/domain/entities/products.entity';
import { User } from 'src/shared/entities/user.entity';
import { ITokensReturnsHelper } from 'src/modules/auth/domain/interfaces/helpers/tokens_returns.helper.interface';

export const testData = {
  userSignupDefault: new User(),
  userSignupDefaultVerificationCode: new VerificationCodes(),

  userSignupPasswordLess: new User(),
  userSignupPasswordLessVerificationCode: new VerificationCodes(),

  productSinglePurchase: new Products(),
  productSubscription: new Products(),

  tokensReturnsUser: {} as ITokensReturnsHelper,
  tokensReturnsAdmin: {} as ITokensReturnsHelper,
};
