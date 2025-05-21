import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CartModule } from './cart/cart.module';
import { CatsModule } from './cats/cats.module';
import { ProductsModule } from './products/products.module';
import { SupabaseModule } from './supabase/supabase.module';
import { WeatherModule } from './weather/weather.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',
    cache: true,
  }), CatsModule, ProductsModule, CartModule, SupabaseModule, WeatherModule], // 👈 così NestJS riconosce il CatsModule
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
