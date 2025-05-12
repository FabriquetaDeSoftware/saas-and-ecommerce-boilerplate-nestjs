import { VerificationCodes } from 'src/modules/auth/domain/entities/verification_codes.entity';
import { Products } from 'src/modules/products/domain/entities/products.entity';
import { User } from 'src/shared/entities/user.entity';

const user = new User();
const product = new Products();
const verificationCode = new VerificationCodes();

export const testData = {
  user,
  product,
  verificationCode,
};
