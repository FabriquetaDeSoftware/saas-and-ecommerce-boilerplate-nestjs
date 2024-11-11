import { Injectable } from '@nestjs/common';
import { ISignInWithMagicLinkUseCase } from '../interfaces/use_cases/sign_in_with_magic_link.use_case.interface';

@Injectable()
export class SignInWithMagicLinkUseCase implements ISignInWithMagicLinkUseCase {
  public async execute(): Promise<void> {
    return;
  }
}
