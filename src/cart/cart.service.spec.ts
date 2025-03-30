import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';
import { ICartService } from './interfaces/cart.service.interface';

describe('CartService', () => {
  let service: ICartService;

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

  it('should return cart', () => {
    const cart = service.getCart();
    expect(cart).toBeDefined();
  })

  it('should add item to cart', () => {
    const cartItem = { productId: 1, quantity: 1 };
    service.addToCart(cartItem);
    const cart = service.getCart();
    expect(cart.length).toBe(1);
    expect(cart[0].productId).toBe(cartItem.productId);
  })

  it('should remuve item from cart', () => {
    const cartItem = { productId: 1, quantity: 1 };
    const cartItem2 = { productId: 2, quantity: 1 };
    service.addToCart(cartItem);
    service.addToCart(cartItem2);
    service.removeFromCart(cartItem.productId);
    const cart = service.getCart();
    expect(cart.length).toBe(1);
  })

  it('should clean cart', () => {
    const cartItem = { productId: 1, quantity: 1 };
    service.addToCart(cartItem);
    service.clearCart();
    const cart = service.getCart();
    expect(cart.length).toBe(0);
  })
});
