import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ICreateProductOrchestrator } from '../../domain/interfaces/orchestrators/create_product.orchestrator.interface';
import { CreateProductDto } from '../dto/create_product.dto';
import { TypeProductEnum } from '../../domain/enum/type_product.enum';
import { ICreateSubscriptionProductUseCase } from '../../domain/interfaces/use_cases/create_subscription_product.use_case.interface';

@Injectable()
export class CreateProductOrchestrator implements ICreateProductOrchestrator {
  @Inject('ICreateSubscriptionProductUseCase')
  private readonly _createSubscriptionProductUseCase: ICreateSubscriptionProductUseCase;

  public async execute(
    role: string,
    input: CreateProductDto,
    type: TypeProductEnum,
  ): Promise<any> {
    if (type === TypeProductEnum.SUBSCRIPTION) {
      return await this._createSubscriptionProductUseCase.execute(role, input);
    }

    throw new BadRequestException(`Invalid product type: ${type}`);
  }
}
