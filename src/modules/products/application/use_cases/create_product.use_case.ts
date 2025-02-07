import { Inject, Injectable } from '@nestjs/common';
import { ICreateProductUseCase } from '../../domain/interfaces/use_cases/create_product.use_case.interface';
import { CreateProductDto } from '../dto/create_product.dto';
import { Products } from '../../domain/entities/products.entity';
import { IProductsRepository } from '../../domain/interfaces/repositories/products.repository.interface';
import { ICryptoUtil } from 'src/shared/utils/interfaces/crypto.util.interface';
import {
  CaslAbilityFactory,
  ProductFields,
} from 'src/common/casl/casl_ability.factory';
import { Action } from 'src/shared/enum/actions.enum';
import { RolesEnum } from 'src/shared/enum/roles.enum';

@Injectable()
export class CreateProductUseCase implements ICreateProductUseCase {
  @Inject('IProductsRepository')
  private readonly _productsRepository: IProductsRepository;

  @Inject('ICryptoUtil')
  private readonly _cryptoUtil: ICryptoUtil;

  @Inject()
  private readonly _caslAbilityFactory: CaslAbilityFactory;

  public async execute(
    role: string,
    input: CreateProductDto,
  ): Promise<Products> {
    const roleDecripted = await this.intermediry(role);

    const ability = this._caslAbilityFactory.createForUser(
      roleDecripted as RolesEnum,
    );

    const fieldsToUpdate = Object.keys(input) as (keyof CreateProductDto)[];
    const isAllowed = fieldsToUpdate.every((field) =>
      ability.can(Action.Update, Products, field as ProductFields),
    );

    const filteredInput = Object.fromEntries(
      Object.entries(input).filter(([field]) =>
        ability.can(Action.Update, Products, field as ProductFields),
      ),
    );

    const result = await this._productsRepository.create(input);

    return result;
  }

  private async intermediry(data: string): Promise<string> {
    const dataDecoded = await this.decryptPayload(data);

    return dataDecoded;
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
