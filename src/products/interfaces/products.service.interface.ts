import { CreateProductDto } from '../dto/create-product.dto';
import { Product } from '../entities/product.entity';

export interface IProductsService {
  findAll(): Promise<Product[]>;
  findOne(id: string): Promise<Product | null>;
  create(dto: CreateProductDto): Promise<Product>;
}