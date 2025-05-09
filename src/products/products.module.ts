import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [SupabaseModule],
  controllers: [ProductsController],
  providers: [
    {
      provide: 'IProductsService', // Nome simbolico (interfaccia)
      useClass: ProductsService,   // Implementazione concreta
    },
  ],
  exports: ['IProductsService'],
})
export class ProductsModule {}
