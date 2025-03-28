import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
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
