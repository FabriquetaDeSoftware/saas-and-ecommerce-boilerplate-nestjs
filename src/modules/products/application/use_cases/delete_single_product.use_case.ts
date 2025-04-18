import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Products } from '../../domain/entities/products.entity';
import { ICryptoUtil } from 'src/shared/utils/interfaces/crypto.util.interface';
import { ActionEnum } from 'src/shared/enum/actions.enum';
import { RolesEnum } from 'src/shared/enum/roles.enum';
import { IPermissionManagerUtil } from 'src/shared/utils/interfaces/permission_manager.util.interface';
import { ISingleProductsRepository } from '../../domain/interfaces/repositories/single_products.repository.interface';
import { IDeleteSingleProductUseCase } from '../../domain/interfaces/use_cases/delete_single_product.use_case.interface';

@Injectable()
export class DeleteSingleProductUseCase implements IDeleteSingleProductUseCase {
  @Inject('ISingleProductsRepository')
  private readonly _singleProductsRepository: ISingleProductsRepository;

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

    const result = await this._singleProductsRepository.delete(publicId);

    return result;
  }

  private isAllowedAction(role: string, publicId: string): void {
    const isAllowed = this._permissionManagerUtil.validateFieldPermissions(
      role as RolesEnum,
      { publicId },
      ActionEnum.Delete,
      Products,
    );

    if (!isAllowed) {
      throw new UnauthorizedException('Unauthorized to perform this action');
    }
  }

  private async verifyIfProductExist(publicId: string): Promise<void> {
    const result =
      await this._singleProductsRepository.findOneByPublicId(publicId);

    if (!result) {
      throw new NotFoundException('Product not found');
    }

    return;
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
