import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CartModule } from './cart/cart.module';
import { CatsModule } from './cats/cats.module';
import { ProductsModule } from './products/products.module';
import { SupabaseModule } from './supabase/supabase.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }),CatsModule, ProductsModule, CartModule, SupabaseModule], // 👈 così NestJS riconosce il CatsModule
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
