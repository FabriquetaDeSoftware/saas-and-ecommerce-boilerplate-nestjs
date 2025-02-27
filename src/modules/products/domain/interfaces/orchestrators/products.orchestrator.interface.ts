import { CreateProductDto } from 'src/modules/products/application/dto/create_product.dto';
import { TypeProductEnum } from 'src/modules/products/application/enum/type_product.enum';
import { Products } from '../../entities/products.entity';
import { ListManyProductsReturn } from '../returns/list_many_products_return.interface';
import { ListManyProductsDto } from 'src/modules/products/application/dto/list_many_products.dto';
import { TypeAndIdProductParamsDto } from 'src/modules/products/application/dto/params_to_product_routes.dto';
import { UpdateProductInfoDto } from 'src/modules/products/application/dto/update_product_info.dto';

export interface IProductsOrchestrator {
  create(
    role: string,
    input: CreateProductDto,
    type: TypeProductEnum,
  ): Promise<Partial<Products>>;

  delete(role: string, input: TypeAndIdProductParamsDto): Promise<void>;

  update(
    role: string,
    params: TypeAndIdProductParamsDto,
    input: UpdateProductInfoDto,
  ): Promise<Partial<Products>>;

  showOneBySlug(
    slug: string,
    type: TypeProductEnum,
  ): Promise<Partial<Products>>;

  listMany(
    input: ListManyProductsDto,
    type: TypeProductEnum,
  ): Promise<ListManyProductsReturn>;
}
