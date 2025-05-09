import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ApiResponseDto } from '../common/dto/api-response.dto';
import { CartDto } from './dto/cart.dto';
import { Cart } from './entities/cart.entity';
import { ICartService } from './interfaces/cart.service.interface';

@Controller('cart')
export class CartController {
  constructor(
    @Inject('ICartService')
    private readonly cartService: ICartService,
  ) {}

  @Get(':id')
  getCart(@Param('id') id: string): ApiResponseDto<CartDto> {
    const cart: Cart = this.cartService.getCart(id);
    const cartDto = new CartDto(cart.id, cart.lines);
    return new ApiResponseDto(cartDto, 'Cart retrieved successfully', 200);
  }
}
