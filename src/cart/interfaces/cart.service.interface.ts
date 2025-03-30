import { CartItem } from "../entities/cart.entity";

export interface ICartService {
    getCart(): CartItem[];
    addToCart(cartItem: CartItem): void;
    removeFromCart(productId: number): void;
    clearCart(): void;
}