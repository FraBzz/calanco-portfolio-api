import { Cart } from '../entities/cart.entity';
import { CartLine } from '../entities/cartLine.entity';

export interface ICartService {
  createCart(): Promise<Cart>;
  getCart(cartId: string): Promise<Cart>;
  addToCart(cartId: string, cartItem: CartLine): Promise<void>;
  removeFromCart(cartId: string, productId: string): Promise<void>;
  clearCart(cartId: string): Promise<void>;
}