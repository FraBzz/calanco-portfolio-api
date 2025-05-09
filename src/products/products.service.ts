import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';
import { IProductsService } from './interfaces/products.service.interface';

@Injectable()
export class ProductsService implements IProductsService {
    constructor(private readonly supabaseService: SupabaseService) {}

  async findAll(): Promise<Product[]> {
    const { data, error } = await this.supabaseService.getClient()
      .from('products')
      .select('*');
    if (error) throw new Error(error.message);
    return data as Product[];
  }

  async findOne(id: string): Promise<Product | null> {
    const { data, error } = await this.supabaseService.getClient()
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw new Error(error.message);
    return data as Product;
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { data, error } = await this.supabaseService.getClient()
      .from('products')
      .insert(createProductDto)
      .select()
      .single();
    if (error) {
        console.log("errore")
        throw new Error(error.message);}
    return data as Product;
  }
}
