import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ICreateProductOrchestrator } from '../../domain/interfaces/orchestrators/create_product.orchestrator.interface';
import { CreateProductDto } from '../dto/create_product.dto';
import { TypeProductEnum } from '../../domain/enum/type_product.enum';
import { ICreateSubscriptionProductUseCase } from '../../domain/interfaces/use_cases/create_subscription_product.use_case.interface';
import { Products } from '../../domain/entities/products.entity';
import { ICreateSingleProductUseCase } from '../../domain/interfaces/use_cases/create_single_product.use_case.interface';

@Injectable()
export class CreateProductOrchestrator implements ICreateProductOrchestrator {
  @Inject('ICreateSubscriptionProductUseCase')
  private readonly _createSubscriptionProductUseCase: ICreateSubscriptionProductUseCase;

  @Inject('ICreateSingleProductUseCase')
  private readonly _createSingleProductUseCase: ICreateSingleProductUseCase;

  public async execute(
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
