import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateProductInfoDto } from '../dto/update_product_info.dto';
import { Products } from '../../domain/entities/products.entity';
import { IUpdateSingleProductInfoUseCase } from '../../domain/interfaces/use_cases/update_single_product_info.use_case.interface';
import { IPermissionManagerUtil } from 'src/shared/utils/interfaces/permission_manager.util.interface';
import { ICryptoUtil } from 'src/shared/utils/interfaces/crypto.util.interface';
import { ISingleProductsRepository } from '../../domain/interfaces/repositories/single_products.repository.interface';
import { RolesEnum } from 'src/shared/enum/roles.enum';
import { ActionEnum } from 'src/shared/enum/actions.enum';

@Injectable()
export class UpdateSingleProductInfoUseCase
  implements IUpdateSingleProductInfoUseCase
{
  @Inject('ISingleProductsRepository')
  private readonly _singleProductsRepository: ISingleProductsRepository;

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

    const result = await this._singleProductsRepository.update(
      public_id,
      {
        ...input,
      },
      { id: true },
    );

    return result;
  }

  private async verifyIfProductExist(publicId: string): Promise<void> {
    const result =
      await this._singleProductsRepository.findOneByPublicId(publicId);

    if (!result) {
      throw new NotFoundException('Product not found');
    }

    return;
  }

  private isAllowedAction(role: string, publicId: string): void {
    const isAllowed = this._permissionManagerUtil.validateFieldPermissions(
      role as RolesEnum,
      { publicId },
      ActionEnum.Update,
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
