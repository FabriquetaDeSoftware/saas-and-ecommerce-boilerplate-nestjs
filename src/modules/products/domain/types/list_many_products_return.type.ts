import { Products } from '../entities/products.entity';

export type ListManyProductsWithoutIdReturn = {
  data: Omit<Products, 'id'>[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type ListManyProductsReturn = {
  data: Products[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};
