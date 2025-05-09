import { Cart } from "../entities/cart.entity";
import { CartLine } from "../entities/cartLine.entity";

export interface ICartService {
    getCart(cartId: string): Cart;
    addToCart(cartId: string,cartItem: CartLine): void ;
    removeFromCart(cartId: string, productId: number): void;
    clearCart(cartId: string): void;
}