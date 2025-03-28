import {
    Body,
    Controller,
    Get,
    Inject,
    NotFoundException,
    Param,
    ParseUUIDPipe,
    Post,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { IProductsService } from './interfaces/products.service.interface';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject('IProductsService')
    private readonly productsService: IProductsService,
  ) {}

  @Get()
  getAllProducts() {
    return this.productsService.findAll();
  }

  @Get(':id')
  getProduct(@Param('id', ParseUUIDPipe) id: string) {
    //parseuuidpipe controlla che l'id sia una guid valida
    const product = this.productsService.findOne(id);

    if(!product){
        throw new NotFoundException("Product not found")
    }

    return product;
  }

  @Post()
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }
}
