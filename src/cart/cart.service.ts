import { Injectable } from '@nestjs/common';
import { CartItem } from './entities/cart.entity';
import { ICartService } from './interfaces/cart.service.interface';

@Injectable()
export class CartService implements ICartService {
    private cart: CartItem[] = [];
    
    getCart(): CartItem[] {
        return this.cart;
    }

    addToCart(cartItem: CartItem): void {
        let existingItem = this.cart.find((item) => item.productId === cartItem.productId); 
        //non è una copia ma il riferimento all'oggeto

        if(!existingItem)
            this.cart.push(cartItem);
        else
            existingItem.quantity += cartItem.quantity;
    }

    removeFromCart(productId: number): void {
        this.cart = this.cart.filter((item) => item.productId !== productId);
    }

    clearCart(): void {
        this.cart = [];
    }
}
