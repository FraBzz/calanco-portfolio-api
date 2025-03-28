import { Controller, Get, Inject, Param, ParseUUIDPipe } from '@nestjs/common';
import { IProductsService } from './interfaces/products.service.interface';

@Controller('products')
export class ProductsController {
    constructor(
        @Inject('IProductsService') private readonly productsService: IProductsService,
      ) {}

    @Get()
    getAllProducts() {
        return this.productsService.findAll();
    }

    @Get(':id')
    getProduct(@Param('id', ParseUUIDPipe) id: string) { //parseuuidpipe controlla che l'id sia una guid valida
        return this.productsService.findOne(id);
    }
}
