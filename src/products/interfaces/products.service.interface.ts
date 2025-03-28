import { CreateProductDto } from '../dto/create-product.dto';
import { Product } from '../entities/product.entity';

export interface IProductsService {
  findAll(): Product[];
  findOne(id: string): Product | undefined;
  create(dto: CreateProductDto): Product;
}
