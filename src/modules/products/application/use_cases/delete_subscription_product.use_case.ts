import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Products } from '../../domain/entities/products.entity';
import { ISubscriptionProductsRepository } from '../../domain/interfaces/repositories/subscription_products.repository.interface';
import { ICryptoUtil } from 'src/shared/utils/interfaces/crypto.util.interface';
import { Action } from 'src/shared/enum/actions.enum';
import { RolesEnum } from 'src/shared/enum/roles.enum';
import { IPermissionManagerUtil } from 'src/shared/utils/interfaces/permission_manager.util.interface';
import { IDeleteSubscriptionProductUseCase } from '../../domain/interfaces/use_cases/delete_subscription_product.use_case';

@Injectable()
export class DeleteSubscriptionProductUseCase
  implements IDeleteSubscriptionProductUseCase
{
  @Inject('ISubscriptionProductsRepository')
  private readonly _productsRepository: ISubscriptionProductsRepository;

  @Inject('ICryptoUtil')
  private readonly _cryptoUtil: ICryptoUtil;

  @Inject('IPermissionManagerUtil')
  private readonly _permissionManagerUtil: IPermissionManagerUtil;

  public async execute(role: string, input: string): Promise<void> {
    const result = await this.intermediry(role, input);

    return result;
  }

  private async intermediry(role: string, publicId: string): Promise<void> {
    await this.verifyIfProductExist(publicId);

    const roleDecoded = await this.decryptPayload(role);

    this.isAllowedAction(roleDecoded, publicId);

    const result = await this._productsRepository.delete(publicId);

    return result;
  }

  private isAllowedAction(role: string, publicId: string): void {
    const isAllowed = this._permissionManagerUtil.validateFieldPermissions(
      role as RolesEnum,
      { publicId },
      Action.Delete,
      Products,
    );

    if (!isAllowed) {
      throw new UnauthorizedException('Unauthorized to perform this action');
    }
  }

  private async verifyIfProductExist(publicId: string): Promise<Products> {
    const result = await this._productsRepository.findOneByPublicId(publicId);

    if (!result) {
      throw new NotFoundException('Product not found');
    }

    return result;
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
