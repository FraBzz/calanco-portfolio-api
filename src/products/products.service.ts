import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';
import { IProductsService } from './interfaces/products.service.interface';
import { IdGeneratorService } from '../common/services/id-generator.service';

@Injectable()
export class ProductsService implements IProductsService {
  private readonly logger = new Logger(ProductsService.name);
  
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly idGenerator: IdGeneratorService
  ) {}

  async findAll(): Promise<Product[]> {
    try {
      const { data, error } = await this.supabaseService.getClient()
        .from('products')
        .select('*');
        
      this.logger.debug(`Fetched products data: ${JSON.stringify(data)}`);
      if (error) {
        this.logger.error(`Error fetching products: ${JSON.stringify(error)}`);
        throw new Error(`Database error: ${error.message}`);
      }
      
      return data as Product[];
    } catch (error) {
      this.logger.error(`Unexpected error in findAll: ${error.message}`);
      this.logger.error(error.stack);
      throw error;
    }
  }

  async findOne(id: string): Promise<Product | null> {
    try {
      if (!this.idGenerator.validateId(id)) {
        throw new Error('Invalid product ID format. Must be a valid UUID');
      }

      const { data, error } = await this.supabaseService.getClient()
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) {
        this.logger.error(`Error fetching product ${id}: ${JSON.stringify(error)}`);
        throw new Error(`Database error: ${error.message}`);
      }
      
      return data as Product;
    } catch (error) {
      this.logger.error(`Unexpected error in findOne: ${error.message}`);
      this.logger.error(error.stack);
      throw error;
    }
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      const newProduct = {
        ...createProductDto,
        id: this.idGenerator.generateId(),
        created_at: new Date(),
        updated_at: new Date()
      };

      const { data, error } = await this.supabaseService.getClient()
        .from('products')
        .insert(newProduct)
        .select()
        .single();
        
      if (error) {
        this.logger.error(`Error creating product: ${JSON.stringify(error)}`);
        throw new Error(`Database error: ${error.message}`);
      }
      
      return data as Product;
    } catch (error) {
      this.logger.error(`Unexpected error in create: ${error.message}`);
      this.logger.error(error.stack);
      throw error;
    }
  }
}
