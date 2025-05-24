import { Cart } from '../entities/cart.entity';
import { CartLine } from '../entities/cartLine.entity';

export interface ICartService {
  createCart(): Cart;
  getCart(cartId: string): Cart;
  addToCart(cartId: string, cartItem: CartLine): Promise<void>;
  removeFromCart(cartId: string, productId: string): void;
  clearCart(cartId: string): void;
}