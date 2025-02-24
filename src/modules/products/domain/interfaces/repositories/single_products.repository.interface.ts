import { CreateProductDto } from 'src/modules/products/application/dto/create_product.dto';
import { Products } from '../../entities/products.entity';
import { ListManyProductsReturn } from '../../types/list_many_products_return.type';

export interface ISingleProductsRepository {
  create(input: CreateProductDto): Promise<Products>;
  delete(publicId: string): Promise<void>;
  listMany(where?: object): Promise<Products[]>;
  listManyWithPagination(
    where?: object,
    skip?: number,
    take?: number,
  ): Promise<ListManyProductsReturn>;
  findOneByPublicId(publicId: string): Promise<Products>;
  findOneBySlug(slug: string): Promise<Products>;
  update(publicId: string, input: CreateProductDto): Promise<Products>;
}
