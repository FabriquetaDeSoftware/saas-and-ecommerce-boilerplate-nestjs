import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ICreateProductUseCase } from '../../domain/interfaces/use_cases/create_product.use_case.interface';
import { CreateProductDto } from '../dto/create_product.dto';
import { Products } from '../../domain/entities/products.entity';
import { IProductsRepository } from '../../domain/interfaces/repositories/products.repository.interface';
import { ICryptoUtil } from 'src/shared/utils/interfaces/crypto.util.interface';
import { Action } from 'src/shared/enum/actions.enum';
import { RolesEnum } from 'src/shared/enum/roles.enum';
import { IPermissionManagerUtil } from 'src/shared/utils/interfaces/permission_manager.util.interface';

@Injectable()
export class CreateProductUseCase implements ICreateProductUseCase {
  @Inject('IProductsRepository')
  private readonly _productsRepository: IProductsRepository;

  @Inject('ICryptoUtil')
  private readonly _cryptoUtil: ICryptoUtil;

  @Inject('IPermissionManagerUtil')
  private readonly _permissionManagerUtil: IPermissionManagerUtil;

  public async execute(
    role: string,
    input: CreateProductDto,
  ): Promise<Products> {
    const result = await this.intermediry(role, input);

    return result;
  }

  private async intermediry(
    role: string,
    input: CreateProductDto,
  ): Promise<Products> {
    const roleDecoded = await this.decryptPayload(role);

    this.isAllowedAction(roleDecoded, input);

    const result = await this._productsRepository.create(input);

    return result;
  }

  private isAllowedAction(role: string, input: CreateProductDto): void {
    const isAllowed = this._permissionManagerUtil.validateFieldPermissions(
      role as RolesEnum,
      input,
      Action.Create,
      Products,
    );

    if (!isAllowed) {
      throw new UnauthorizedException('Unauthorized to perform this action');
    }
  }

  private async decryptPayload(data: string): Promise<string> {
    const dataFromBase64ToBuffer = Buffer.from(data, 'base64');

    const dataBuffer = await this._cryptoUtil.decryptData(
      dataFromBase64ToBuffer,
    );

    const dataDecoded = dataBuffer.toString();

    return dataDecoded;
  }
}
