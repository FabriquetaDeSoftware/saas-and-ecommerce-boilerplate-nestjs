import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ICreateSingleProductUseCase } from '../../domain/interfaces/use_cases/create_single_product.use_case.interface';
import { CreateProductDto } from '../dto/create_product.dto';
import { Products } from '../../domain/entities/products.entity';
import { ICryptoUtil } from 'src/shared/utils/interfaces/crypto.util.interface';
import { ActionEnum } from 'src/shared/enum/actions.enum';
import { RolesEnum } from 'src/shared/enum/roles.enum';
import { IPermissionManagerUtil } from 'src/shared/utils/interfaces/permission_manager.util.interface';
import { ISingleProductsRepository } from '../../domain/interfaces/repositories/single_products.repository.interface';

@Injectable()
export class CreateSingleProductUseCase implements ICreateSingleProductUseCase {
  @Inject('ISingleProductsRepository')
  private readonly _singleProductsRepository: ISingleProductsRepository;

  @Inject('ICryptoUtil')
  private readonly _cryptoUtil: ICryptoUtil;

  @Inject('IPermissionManagerUtil')
  private readonly _permissionManagerUtil: IPermissionManagerUtil;

  public async execute(
    role: string,
    input: CreateProductDto,
  ): Promise<Partial<Products>> {
    const result = await this.intermediry(role, input);

    return result;
  }

  private async intermediry(
    role: string,
    input: CreateProductDto,
  ): Promise<Partial<Products>> {
    const roleDecoded = await this.decryptPayload(role);

    this.isAllowedAction(roleDecoded, input);

    await this.findProductBySlug(input.slug);

    const result = await this._singleProductsRepository.create(
      { ...input },
      { id: true },
    );

    return result;
  }

  private isAllowedAction(role: string, input: CreateProductDto): void {
    const isAllowed = this._permissionManagerUtil.validateFieldPermissions(
      role as RolesEnum,
      input,
      ActionEnum.Create,
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

  private async findProductBySlug(slug: string): Promise<void> {
    const response = await this._singleProductsRepository.findOneBySlug(slug, {
      id: true,
    });

    if (response) {
      throw new ConflictException('Product whith this slug already exists');
    }

    return;
  }
}
