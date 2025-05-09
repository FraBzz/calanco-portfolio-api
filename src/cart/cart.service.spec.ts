import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';
import { CartLine } from './entities/cartLine.entity';
import { ICartService } from './interfaces/cart.service.interface';

describe('CartService', () => {
  let service: ICartService;
  const testCartId = 'cart123';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{
        provide: 'ICartService',
        useClass: CartService
      }],
    }).compile();

    service = module.get<ICartService>('ICartService');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an empty cart initially', () => {
    const cart = service.getCart(testCartId);
    expect(cart).toBeDefined(); 
    expect(cart.lines.length).toBe(0); 
  });

  it('should return cart', () => {
    const cart = service.getCart(testCartId);
    expect(cart).toBeDefined();
  })

  it('should add item to cart', () => {
    const cartItem: CartLine = { productId: 1, quantity: 1 };
    service.addToCart(testCartId, cartItem);

    const cart = service.getCart(testCartId);
    expect(cart).toBeDefined();
    expect(cart!.lines.length).toBe(1);
    expect(cart!.lines[0].productId).toBe(cartItem.productId);
  });

  it('should remove item from cart', () => {
    const cartItem1: CartLine = { productId: 1, quantity: 1 };
    const cartItem2: CartLine = { productId: 2, quantity: 1 };

    service.addToCart(testCartId, cartItem1);
    service.addToCart(testCartId, cartItem2);

    service.removeFromCart(testCartId, 1);

    const cart = service.getCart(testCartId);
    expect(cart!.lines.length).toBe(1);
    expect(cart!.lines[0].productId).toBe(2);
  });

  it('should clear cart', () => {
    const cartItem: CartLine = { productId: 1, quantity: 1 };
    service.addToCart(testCartId, cartItem);
    service.clearCart(testCartId);

    const cart = service.getCart(testCartId);
    expect(cart!.lines.length).toBe(0);
  });
});
