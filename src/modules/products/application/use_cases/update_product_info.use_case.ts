import { Injectable } from '@nestjs/common';
import { IUpdateProductInfoUseCase } from '../../domain/interfaces/use_cases/update_product_info.use_case.interface';
import { UpadateProductInfoDto } from '../dto/update_product_info.dto';
import { Products } from '../../domain/entities/products.entity';

@Injectable()
export class UpdateProductInfoUseCase implements IUpdateProductInfoUseCase {
  public async execute(input: UpadateProductInfoDto): Promise<Products> {
    return;
  }
}
