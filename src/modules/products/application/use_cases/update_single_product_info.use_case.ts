import { Injectable } from '@nestjs/common';
import { UpadateProductInfoDto } from '../dto/update_product_info.dto';
import { Products } from '../../domain/entities/products.entity';
import { IUpdateSingleProductInfoUseCase } from '../../domain/interfaces/use_cases/update_single_product_info.use_case.interface';

@Injectable()
export class UpdateSingleProductInfoUseCase
  implements IUpdateSingleProductInfoUseCase
{
  public async execute(input: UpadateProductInfoDto): Promise<Products> {
    return;
  }
}
