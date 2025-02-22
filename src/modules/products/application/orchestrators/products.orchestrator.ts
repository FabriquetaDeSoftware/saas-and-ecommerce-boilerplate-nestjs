import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { IProductsOrchestrator } from '../../domain/interfaces/orchestrators/products.orchestrator.interface';
import { CreateProductDto } from '../dto/create_product.dto';
import { TypeProductEnum } from '../enum/type_product.enum';
import { ICreateSubscriptionProductUseCase } from '../../domain/interfaces/use_cases/create_subscription_product.use_case.interface';
import { Products } from '../../domain/entities/products.entity';
import { ICreateSingleProductUseCase } from '../../domain/interfaces/use_cases/create_single_product.use_case.interface';

@Injectable()
export class ProductsOrchestrator implements IProductsOrchestrator {
  @Inject('ICreateSubscriptionProductUseCase')
  private readonly _createSubscriptionProductUseCase: ICreateSubscriptionProductUseCase;

  @Inject('ICreateSingleProductUseCase')
  private readonly _createSingleProductUseCase: ICreateSingleProductUseCase;

  public async create(
    role: string,
    input: CreateProductDto,
    type: TypeProductEnum,
  ): Promise<Products> {
    if (type === TypeProductEnum.SINGLE) {
      return await this._createSingleProductUseCase.execute(role, input);
    }

    if (type === TypeProductEnum.SUBSCRIPTION) {
      return await this._createSubscriptionProductUseCase.execute(role, input);
    }

    throw new BadRequestException(`Invalid product type: ${type}`);
  }
}
