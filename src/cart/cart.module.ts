import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CommonModule } from '../common/common.module';
import { ProductsModule } from '../products/products.module';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [CommonModule, ProductsModule, SupabaseModule],
  controllers: [CartController],
  providers: [
    {
      provide: 'ICartService',
      useClass: CartService
    }
  ]
})
export class CartModule {}
