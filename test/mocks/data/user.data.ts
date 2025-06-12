import { OneTimePassword } from 'src/modules/auth/domain/entities/one_time_password.entity';
import { VerificationCodes } from 'src/modules/auth/domain/entities/verification_codes.entity';
import { ITokensReturnsHelper } from 'src/modules/auth/domain/interfaces/helpers/tokens_returns.helper.interface';
import { User } from 'src/shared/entities/user.entity';

export const userSignupDefaultData = {
  user: new User(),
  verificationCode: new VerificationCodes(),
};

export const userSignupPasswordLessData = {
  user: new User(),
  verificationCode: new VerificationCodes(),
  oneTimePassword: new OneTimePassword(),
};

export const tokensReturns = {
  tokensUser: {} as ITokensReturnsHelper,
  tokensAdmin: {} as ITokensReturnsHelper,
};
