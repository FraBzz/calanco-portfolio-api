import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { SupabaseModule } from '../supabase/supabase.module';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [SupabaseModule, CommonModule],
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
