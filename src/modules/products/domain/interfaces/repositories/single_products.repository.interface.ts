import { CreateProductDto } from 'src/modules/products/application/dto/create_product.dto';
import { Products } from '../../entities/products.entity';
import { ListManyProductsReturn } from '../returns/list_many_products_return.interface';
import { UpdateProductInfoDto } from 'src/modules/products/application/dto/update_product_info.dto';

export interface ISingleProductsRepository {
  create(
    input: CreateProductDto,
    omitFields?: Partial<Record<keyof Products, true>>,
  ): Promise<Partial<Products>>;

  delete(publicId: string): Promise<void>;

  listMany(
    where?: object,
    skip?: number,
    take?: number,
    omitFields?: Partial<Record<keyof Products, true>>,
  ): Promise<ListManyProductsReturn>;

  findOneByPublicId(
    publicId: string,
    omitFields?: Partial<Record<keyof Products, true>>,
  ): Promise<Partial<Products>>;

  findOneBySlug(
    slug: string,
    omitFields?: Partial<Record<keyof Products, true>>,
  ): Promise<Partial<Products>>;

  update(
    publicId: string,
    input: UpdateProductInfoDto,
    omitFields?: Partial<Record<keyof Products, true>>,
  ): Promise<Partial<Products>>;
}
