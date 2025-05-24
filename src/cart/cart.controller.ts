import { Body, Controller, Delete, Get, Inject, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiResponseDto } from '../common/dto/api-response.dto';
import { CartDto } from './dto/cart.dto';
import { Cart } from './entities/cart.entity';
import { CartLine } from './entities/cartLine.entity';
import { ICartService } from './interfaces/cart.service.interface';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(
    @Inject('ICartService')
    private readonly cartService: ICartService,
  ) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get a cart by ID' })
  @ApiResponse({ status: 200, type: CartDto })
  getCart(@Param('id') id: string): ApiResponseDto<CartDto> {
    try {
      const cart: Cart = this.cartService.getCart(id);
      const cartDto = new CartDto(cart.id, cart.lines);
      return {
        type: 'success',
        data: cartDto,
        status: 200,
        message: 'Cart retrieved successfully',
        timestamp: new Date()
      };
    } catch (error) {
      return {
        type: 'error',
        status: 500,
        message: error.message,
        timestamp: new Date()
      };
    }
  }

  @Post(':id/items')
  @ApiOperation({ summary: 'Add an item to cart' })
  @ApiResponse({ status: 201, type: CartDto })
  addToCart(@Param('id') id: string, @Body() item: CartLine): ApiResponseDto<CartDto> {
    try {
      this.cartService.addToCart(id, item);
      const cart = this.cartService.getCart(id);
      const cartDto = new CartDto(cart.id, cart.lines);
      return {
        type: 'success',
        data: cartDto,
        status: 201,
        message: 'Item added to cart successfully',
        timestamp: new Date()
      };
    } catch (error) {
      return {
        type: 'error',
        status: 500,
        message: error.message,
        timestamp: new Date()
      };
    }
  }

  @Delete(':id/items/:productId')
  @ApiOperation({ summary: 'Remove an item from cart' })
  @ApiResponse({ status: 200, type: CartDto })
  removeFromCart(@Param('id') id: string, @Param('productId') productId: number): ApiResponseDto<CartDto> {
    try {
      this.cartService.removeFromCart(id, productId);
      const cart = this.cartService.getCart(id);
      const cartDto = new CartDto(cart.id, cart.lines);
      return {
        type: 'success',
        data: cartDto,
        status: 200,
        message: 'Item removed from cart successfully',
        timestamp: new Date()
      };
    } catch (error) {
      return {
        type: 'error',
        status: 500,
        message: error.message,
        timestamp: new Date()
      };
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Clear cart' })
  @ApiResponse({ status: 200, type: CartDto })
  clearCart(@Param('id') id: string): ApiResponseDto<CartDto> {
    try {
      this.cartService.clearCart(id);
      const cart = this.cartService.getCart(id);
      const cartDto = new CartDto(cart.id, cart.lines);
      return {
        type: 'success',
        data: cartDto,
        status: 200,
        message: 'Cart cleared successfully',
        timestamp: new Date()
      };
    } catch (error) {
      return {
        type: 'error',
        status: 500,
        message: error.message,
        timestamp: new Date()
      };
    }
  }
}
