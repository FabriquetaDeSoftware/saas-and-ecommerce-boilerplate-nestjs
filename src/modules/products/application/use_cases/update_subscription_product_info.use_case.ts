import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { IUpdateSubscriptionProductInfoUseCase } from '../../domain/interfaces/use_cases/update_subscription_product_info.use_case.interface';
import { UpdateProductInfoDto } from '../dto/update_product_info.dto';
import { Products } from '../../domain/entities/products.entity';
import { RolesEnum } from 'src/shared/enum/roles.enum';
import { Action } from 'src/shared/enum/actions.enum';
import { IPermissionManagerUtil } from 'src/shared/utils/interfaces/permission_manager.util.interface';
import { ICryptoUtil } from 'src/shared/utils/interfaces/crypto.util.interface';
import { ISubscriptionProductsRepository } from '../../domain/interfaces/repositories/subscription_products.repository.interface';

@Injectable()
export class UpdateSubscriptionProductInfoUseCase
  implements IUpdateSubscriptionProductInfoUseCase
{
  @Inject('ISubscriptionProductsRepository')
  private readonly _subscriptionProductsRepository: ISubscriptionProductsRepository;

  @Inject('ICryptoUtil')
  private readonly _cryptoUtil: ICryptoUtil;

  @Inject('IPermissionManagerUtil')
  private readonly _permissionManagerUtil: IPermissionManagerUtil;

  public async execute(
    role: string,
    public_id: string,
    input: UpdateProductInfoDto,
  ): Promise<Partial<Products>> {
    const response = await this.intermediary(role, public_id, input);

    return response;
  }

  private async intermediary(
    role: string,
    public_id: string,
    input: UpdateProductInfoDto,
  ): Promise<Partial<Products>> {
    await this.verifyIfProductExist(public_id);

    const roleDecoded = await this.decryptPayload(role);

    this.isAllowedAction(roleDecoded, public_id);

    const priceToCents =
      input.price !== undefined ? input.price * 100 : undefined;

    const result = await this._subscriptionProductsRepository.update(
      public_id,
      {
        ...input,
        ...(priceToCents !== undefined ? { price: priceToCents } : {}),
      },
      { id: true },
    );

    return result;
  }

  private async verifyIfProductExist(publicId: string): Promise<void> {
    const resulta =
      await this._subscriptionProductsRepository.findOneByPublicId(publicId);

    if (!resulta) {
      throw new NotFoundException('Product not found');
    }

    return;
  }

  private isAllowedAction(role: string, publicId: string): void {
    const isAllowed = this._permissionManagerUtil.validateFieldPermissions(
      role as RolesEnum,
      { publicId },
      Action.Update,
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
