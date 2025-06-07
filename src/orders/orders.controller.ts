import { Controller, Post, Get, Body, Param, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ApiResponseDto } from '../common/dto/api-response.dto';
import { IOrdersService } from './orders.interface';
import { CheckoutDto, OrderResponseDto } from './dto/checkout.dto';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(
    @Inject('IOrdersService')
    private readonly ordersService: IOrdersService,
  ) {}
  @Post('checkout')
  @ApiOperation({ summary: 'Checkout a cart and create an order' })
  @ApiResponse({ 
    status: 201, 
    description: 'Order created successfully',
    type: OrderResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Bad request - cart is empty or invalid' })
  async checkout(@Body() checkoutDto: CheckoutDto): Promise<ApiResponseDto<OrderResponseDto>> {
    try {
      const order = await this.ordersService.checkout(checkoutDto);
      return {
        type: 'success',
        data: order,
        status: 201,
        message: 'Order created successfully',
        timestamp: new Date()
      };
    } catch (error) {
      throw new HttpException({
        type: 'error',
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
        timestamp: new Date()
      }, HttpStatus.BAD_REQUEST);
    }
  }
  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiParam({ name: 'id', description: 'Order ID', example: 'order_123456789' })
  @ApiResponse({ 
    status: 200, 
    description: 'Order retrieved successfully',
    type: OrderResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async getOrder(@Param('id') id: string): Promise<ApiResponseDto<OrderResponseDto>> {
    try {
      const order = await this.ordersService.getOrder(id);
      return {
        type: 'success',
        data: order,
        status: 200,
        message: 'Order retrieved successfully',
        timestamp: new Date()
      };
    } catch (error) {
      throw new HttpException({
        type: 'error',
        message: error.message,
        status: HttpStatus.NOT_FOUND,
        timestamp: new Date()
      }, HttpStatus.NOT_FOUND);
    }
  }
}
