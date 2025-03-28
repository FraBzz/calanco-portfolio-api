import { Product } from '../entities/product.entity';

export interface IProductsService {
  findAll(): Product[];
  findOne(id: string): Product | undefined;
}
