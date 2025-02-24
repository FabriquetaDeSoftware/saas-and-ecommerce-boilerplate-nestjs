import { CreateProductDto } from 'src/modules/products/application/dto/create_product.dto';
import { TypeProductEnum } from 'src/modules/products/application/enum/type_product.enum';
import { Products } from '../../entities/products.entity';
import { ListManyProductsWithoutIdReturn } from '../../types/list_many_products_return.type';
import { ListManyProductsDto } from 'src/modules/products/application/dto/list_many_products.dto';
import { TypeAndIdProductParamsDto } from 'src/modules/products/application/dto/params_to_product_routes.dto';
import { UpadateProductInfoDto } from 'src/modules/products/application/dto/update_product_info.dto';

export interface IProductsOrchestrator {
  create(
    role: string,
    input: CreateProductDto,
    type: TypeProductEnum,
  ): Promise<Products>;

  delete(role: string, input: TypeAndIdProductParamsDto): Promise<void>;

  update(
    role: string,
    params: TypeAndIdProductParamsDto,
    input: UpadateProductInfoDto,
  ): Promise<Products>;

  listMany(
    input: ListManyProductsDto,
    type: TypeProductEnum,
  ): Promise<ListManyProductsWithoutIdReturn>;
}
