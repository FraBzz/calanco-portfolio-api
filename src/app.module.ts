import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';
import { ProductsModule } from './products/products.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [CatsModule, ProductsModule, CartModule], // 👈 così NestJS riconosce il CatsModule
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
