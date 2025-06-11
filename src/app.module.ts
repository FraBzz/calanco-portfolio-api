import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CartModule } from './cart/cart.module';
import { CatsModule } from './cats/cats.module';
import { CommonModule } from './common/common.module';
import { ContactModule } from './communication/contact.module';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
import { SupabaseModule } from './supabase/supabase.module';
import { WeatherModule } from './weather/weather.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',
    cache: true,
  }), CommonModule, CatsModule, ProductsModule, CartModule, OrdersModule, SupabaseModule, WeatherModule, ContactModule], // 👈 così NestJS riconosce tutti i moduli
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
