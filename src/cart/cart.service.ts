import { Injectable } from '@nestjs/common';
import { Cart } from './entities/cart.entity';
import { CartLine } from './entities/cartLine.entity';
import { ICartService } from './interfaces/cart.service.interface';

@Injectable()
export class CartService implements ICartService {
  private carts: Cart[] = [];

  getCart(cartId: string): Cart {
    return this.findOrCreateCart(cartId);
  }

  addToCart(cartId: string, cartItem: CartLine): void {
    let cart = this.findOrCreateCart(cartId);

    if (!cart) {
      cart = new Cart(cartId);
      this.carts.push(cart);
    }

    let existingItem = cart.lines.find(
      (item) => item.productId === cartItem.productId,
    );
    //non è una copia ma il riferimento all'oggeto

    if (!existingItem) cart.lines.push(cartItem);
    else existingItem.quantity += cartItem.quantity;
  }

  removeFromCart(cartId: string, productId: number): void {
    let cart = this.findOrCreateCart(cartId);
    cart.lines = cart.lines.filter((item) => item.productId !== productId);
  }

  clearCart(cartId: string): void {
    let cart = this.findOrCreateCart(cartId);
    cart.lines = [];
  }

  private findOrCreateCart(cartId: string): Cart {
    let cart = this.carts.find((cart) => cart.id === cartId);
    
    if (!cart) {
      cart = { id: cartId, lines: [] };
      this.carts.push(cart);
    }

    return cart;
  }
}
