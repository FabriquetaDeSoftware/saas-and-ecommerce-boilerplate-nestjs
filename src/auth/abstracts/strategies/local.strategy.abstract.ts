import { Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { SignInAuthDto } from 'src/auth/dto/sign_in_auth.dto';
import { Auth } from 'src/auth/entities/auth.entity';
import { IGenericExecute } from 'src/shared/interfaces/generic_execute.interface';
import { Strategy } from 'passport-local';

export class LocalStrategyAbstract extends PassportStrategy(Strategy) {
  @Inject('IValidateUserService')
  protected validateUserService: IGenericExecute<SignInAuthDto, Auth>;
}
