import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from './cart.controller';
import { Cart } from './entities/cart.entity';
import { ICartService } from './interfaces/cart.service.interface';

describe('CartController', () => {
  let controller: CartController;

  const validCartId = '1d40e473-e034-49f5-ac5d-980c7b7e7942';

  const mockCart = {
    id: validCartId,
    lines: [],
  } as Cart;

  const mockCartService: ICartService = {
    getCart: jest.fn((id: string) => ({
      id,
      lines: [],
    })),
    addToCart: jest.fn(),
    removeFromCart: jest.fn(),
    clearCart: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        {
          provide: 'ICartService',
          useValue: mockCartService,
        },
      ],
    }).compile();

    controller = module.get<CartController>(CartController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a cart with the correct ID', () => {
    var response = controller.getCart(validCartId);
    const cart = response.data;
    expect(cart).toBeDefined();
    expect(cart.id).toBe(validCartId);
    expect(cart.lines.length).toBe(0);
  });

  it('should return a cart even for an unknown ID', () => {
    const newCartId = 'random-id';
    var response = controller.getCart(newCartId);
    const cart = response.data;
    expect(cart).toBeDefined();
    expect(cart.id).toBe(newCartId);
    expect(cart.lines.length).toBe(0);
  });

  it('should call getCart with the correct ID', () => {
    controller.getCart(validCartId);
    expect(mockCartService.getCart).toHaveBeenCalledWith(validCartId);
  });
});
