import { CreateProductDto } from 'src/modules/products/application/dto/create_product.dto';
import { Products } from '../../entities/products.entity';
import { ListManyProductsReturn } from '../returns/list_many_products_return.type';
import { UpdateProductInfoDto } from 'src/modules/products/application/dto/update_product_info.dto';

export interface ISubscriptionProductsRepository {
  create(input: CreateProductDto): Promise<Products>;
  delete(publicId: string): Promise<void>;
  listMany(
    where?: object,
    skip?: number,
    take?: number,
    omitFields?: Partial<Record<keyof Products, true>>,
  ): Promise<ListManyProductsReturn>;
  findOneByPublicId(publicId: string): Promise<Products>;
  findOneBySlug(slug: string): Promise<Products>;
  update(publicId: string, input: UpdateProductInfoDto): Promise<Products>;
}
