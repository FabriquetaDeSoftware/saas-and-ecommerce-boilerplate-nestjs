import { Products } from '../../entities/products.entity';

export interface ListManyProductsReturn {
  data: Partial<Products[]>;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
