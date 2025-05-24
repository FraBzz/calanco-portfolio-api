import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiResponseDto } from '../common/dto/api-response.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';
import { IProductsService } from './interfaces/products.service.interface';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(
    @Inject('IProductsService')
    private readonly productsService: IProductsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, type: Product, isArray: true })
  async getAllProducts(): Promise<ApiResponseDto<Product[]>> {
    try {
      const products = await this.productsService.findAll();
      return {
        type: 'success',
        data: products,
        status: 200,
        message: 'Products retrieved successfully',
        timestamp: new Date()
      };
    } catch (error) {
      throw new HttpException({
        type: 'error',
        message: error.message,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        timestamp: new Date()
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiResponse({ status: 200, type: Product })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async getProduct(@Param('id', ParseUUIDPipe) id: string): Promise<ApiResponseDto<Product>> {
    try {
      const product = await this.productsService.findOne(id);
      
      if (!product) {
        throw new NotFoundException({
          type: 'error',
          message: 'Product not found',
          status: HttpStatus.NOT_FOUND,
          timestamp: new Date()
        });
      }

      return {
        type: 'success',
        data: product,
        status: 200,
        message: 'Product retrieved successfully',
        timestamp: new Date()
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException({
        type: 'error',
        message: error.message,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        timestamp: new Date()
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, type: Product })
  async createProduct(@Body() createProductDto: CreateProductDto): Promise<ApiResponseDto<Product>> {
    try {
      const product = await this.productsService.create(createProductDto);
      return {
        type: 'success',
        data: product,
        status: 201,
        message: 'Product created successfully',
        timestamp: new Date()
      };
    } catch (error) {
      throw new HttpException({
        type: 'error',
        message: error.message,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        timestamp: new Date()
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
