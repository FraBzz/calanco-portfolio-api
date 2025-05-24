import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { Cart } from './entities/cart.entity';
import { CartLine } from './entities/cartLine.entity';
import { ICartService } from './interfaces/cart.service.interface';
import { IdGeneratorService } from '../common/services/id-generator.service';
import { IProductsService } from '../products/interfaces/products.service.interface';

@Injectable()
export class CartService implements ICartService {
  private carts: Cart[] = [];

  constructor(
    private readonly idGenerator: IdGeneratorService,
    @Inject('IProductsService')
    private readonly productsService: IProductsService,
  ) {}

  createCart(): Cart {
    const cart = new Cart(this.idGenerator.generateId());
    this.carts.push(cart);
    return cart;
  }

  getCart(cartId: string): Cart {
    if (!this.idGenerator.validateId(cartId)) {
      throw new BadRequestException('Invalid cart ID format. Must be a valid UUID');
    }
    return this.findCart(cartId);
  }

  async addToCart(cartId: string, cartItem: CartLine): Promise<void> {
    this.validateCartId(cartId);
    
    // Verifica che il prodotto esista
    const product = await this.productsService.findOne(cartItem.productId);
    if (!product) {
      throw new BadRequestException(`Product with ID ${cartItem.productId} not found`);
    }

    let cart = this.findCart(cartId);
    let existingItem = cart.lines.find(
      (item) => item.productId === cartItem.productId,
    );

    if (!existingItem) {
      cart.lines.push(cartItem);
    } else {
      existingItem.quantity += cartItem.quantity;
    }

    cart.updateTimestamp();
  }

  removeFromCart(cartId: string, productId: string): void {
    this.validateCartId(cartId);
    let cart = this.findCart(cartId);
    cart.lines = cart.lines.filter((item) => item.productId !== productId);
    cart.updateTimestamp();
  }

  clearCart(cartId: string): void {
    this.validateCartId(cartId);
    let cart = this.findCart(cartId);
    cart.lines = [];
    cart.updateTimestamp();
  }

  private findCart(cartId: string): Cart {
    const cart = this.carts.find((cart) => cart.id === cartId);
    if (!cart) {
      throw new BadRequestException(`Cart with ID ${cartId} not found`);
    }
    return cart;
  }

  private validateCartId(cartId: string): void {
    if (!this.idGenerator.validateId(cartId)) {
      throw new BadRequestException('Invalid cart ID format. Must be a valid UUID');
    }
  }
}
