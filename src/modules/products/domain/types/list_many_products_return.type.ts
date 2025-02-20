import { Products } from '../entities/products.entity';

export type ListManyProductsReturn = {
  data: Products[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};
