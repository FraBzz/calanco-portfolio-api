import { Body, Controller, Delete, Get, Inject, Param, ParseUUIDPipe, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiParam, ApiBody } from '@nestjs/swagger';
import { ApiResponseDto } from '../common/dto/api-response.dto';
import { CartDto } from './dto/cart.dto';
import { CartLine } from './entities/cartLine.entity';
import { ICartService } from './interfaces/cart.service.interface';
import { AddItemDto } from './dto/add-item.dto';
import { IdGeneratorService } from '../common/services/id-generator.service';

const EMPTY_CART_ID = '00000000-0000-0000-0000-000000000000';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(
    @Inject('ICartService')
    private readonly cartService: ICartService,
    private readonly idGenerator: IdGeneratorService,
  ) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get or create a cart' })
  @ApiParam({ name: 'id', description: 'Cart ID (UUID)', type: 'string' })
  @ApiResponse({ status: 200, description: 'Cart found or created successfully', type: CartDto })
  @ApiResponse({ status: 400, description: 'Invalid cart ID format' })
  async getCart(@Param('id', ParseUUIDPipe) id: string): Promise<ApiResponseDto<CartDto>> {
    const cart = id === EMPTY_CART_ID 
      ? await this.cartService.createCart()
      : await this.cartService.getCart(id);

    return {
      type: 'success',
      status: 200,
      message: id === EMPTY_CART_ID ? 'Cart created successfully' : 'Cart retrieved successfully',
      data: new CartDto(cart.id, cart.lines),
      timestamp: new Date()
    };
  }
  
  @Post(':id/items')
  @ApiOperation({ summary: 'Add an item to cart' })
  @ApiParam({ name: 'id', description: 'Cart ID (UUID) or empty cart ID to create new cart', type: 'string' })
  @ApiBody({ type: AddItemDto })
  @ApiResponse({ status: 200, description: 'Item added successfully', type: CartDto })
  @ApiResponse({ status: 400, description: 'Invalid cart ID, invalid request body, or product not found' })
  @UsePipes(new ValidationPipe())
  async addToCart(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() item: AddItemDto,
  ): Promise<ApiResponseDto<CartDto>> {
    const cartLine: CartLine = {
      productId: item.productId,
      quantity: item.quantity
    };
    
    // Se l'ID è quello vuoto, genera un nuovo ID per il carrello
    const actualCartId = id === EMPTY_CART_ID 
      ? this.generateNewCartId()
      : id;
    
    await this.cartService.addToCart(actualCartId, cartLine);
    const cart = await this.cartService.getCart(actualCartId);
    
    return {
      type: 'success',
      status: 200,
      message: id === EMPTY_CART_ID 
        ? 'Cart created and item added successfully' 
        : 'Item added to cart successfully',
      data: new CartDto(cart.id, cart.lines),
      timestamp: new Date()
    };
  }
  private generateNewCartId(): string {
    return this.idGenerator.generateId();
  }

  @Delete(':id/items/:productId')
  @ApiOperation({ summary: 'Remove an item from cart' })
  @ApiParam({ name: 'id', description: 'Cart ID (UUID)', type: 'string' })
  @ApiParam({ name: 'productId', description: 'Product ID (UUID)', type: 'string' })
  @ApiResponse({ status: 200, description: 'Item removed successfully', type: CartDto })
  @ApiResponse({ status: 400, description: 'Invalid cart ID or product ID format' })
  async removeFromCart(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('productId', ParseUUIDPipe) productId: string,
  ): Promise<ApiResponseDto<CartDto>> {
    await this.cartService.removeFromCart(id, productId);
    const cart = await this.cartService.getCart(id);
    
    return {
      type: 'success',
      status: 200,
      message: 'Item removed from cart successfully',
      data: new CartDto(cart.id, cart.lines),
      timestamp: new Date()
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Clear cart' })
  @ApiParam({ name: 'id', description: 'Cart ID (UUID)', type: 'string' })
  @ApiResponse({ status: 200, description: 'Cart cleared successfully', type: CartDto })
  @ApiResponse({ status: 400, description: 'Invalid cart ID format' })
  async clearCart(@Param('id', ParseUUIDPipe) id: string): Promise<ApiResponseDto<CartDto>> {
    await this.cartService.clearCart(id);
    const cart = await this.cartService.getCart(id);
    
    return {
      type: 'success',
      status: 200,
      message: 'Cart cleared successfully',
      data: new CartDto(cart.id, cart.lines),
      timestamp: new Date()
    };
  }
}
