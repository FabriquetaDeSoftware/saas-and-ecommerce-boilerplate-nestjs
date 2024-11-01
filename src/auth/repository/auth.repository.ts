import { Injectable } from '@nestjs/common';
import { IAuthRepository } from '../interfaces/repository/auth.repository.interface';

@Injectable()
export class AuthRepository implements IAuthRepository {}
