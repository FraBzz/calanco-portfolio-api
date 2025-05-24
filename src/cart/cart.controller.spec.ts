import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from './cart.controller';
import { CartLine } from './entities/cartLine.entity';
import { ICartService } from './interfaces/cart.service.interface';
import { Cart } from './entities/cart.entity';
import { BadRequestException } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { IdGeneratorService } from '../common/services/id-generator.service';

const EMPTY_CART_ID = '00000000-0000-0000-0000-000000000000';
const MOCK_PRODUCT_ID = '123e4567-e89b-12d3-a456-426614174001';
const MOCK_CART_ID = '123e4567-e89b-12d3-a456-426614174000';

describe('CartController', () => {
  let controller: CartController;
  let cartService: ICartService;
  let productsService: ProductsService;
  let idGenerator: IdGeneratorService;
  
  const mockCart: Cart = {
    id: MOCK_CART_ID,
    lines: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    updateTimestamp: jest.fn()
  };

  const mockIdGeneratorService = {
    generateId: jest.fn().mockReturnValue(MOCK_CART_ID),
    validateId: jest.fn().mockReturnValue(true),
  };

  const mockProductsService = {
    findOne: jest.fn().mockResolvedValue({ id: MOCK_PRODUCT_ID, name: 'Test Product' }),
  };
  
  const mockCartService = {
    createCart: jest.fn().mockResolvedValue(mockCart),
    getCart: jest.fn().mockResolvedValue(mockCart),
    addToCart: jest.fn().mockImplementation(async (cartId: string, item: CartLine) => {
      await mockProductsService.findOne(item.productId);
    }),
    removeFromCart: jest.fn().mockResolvedValue(undefined),
    clearCart: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        {
          provide: 'ICartService',
          useValue: mockCartService,
        },
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
        {
          provide: IdGeneratorService,
          useValue: mockIdGeneratorService,
        },
      ],
    }).compile();

    controller = module.get<CartController>(CartController);
    cartService = module.get<ICartService>('ICartService');
    productsService = module.get<ProductsService>(ProductsService);
    idGenerator = module.get<IdGeneratorService>(IdGeneratorService);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('getCart', () => {
    it('should create a new cart when empty UUID is provided', async () => {
      const result = await controller.getCart(EMPTY_CART_ID);
      
      expect(cartService.createCart).toHaveBeenCalled();
      expect(cartService.getCart).not.toHaveBeenCalled();
      expect(result.type).toBe('success');
      expect(result.status).toBe(200);
      expect(result.message).toBe('Cart created successfully');
      expect(result.data).toBeDefined();
      expect(result.data.id).toBe(mockCart.id);
    });

    it('should get existing cart when valid UUID is provided', async () => {
      const cartId = '123e4567-e89b-12d3-a456-426614174000';
      const result = await controller.getCart(cartId);
      
      expect(cartService.createCart).not.toHaveBeenCalled();
      expect(cartService.getCart).toHaveBeenCalledWith(cartId);
      expect(result.type).toBe('success');
      expect(result.status).toBe(200);
      expect(result.message).toBe('Cart retrieved successfully');
      expect(result.data).toBeDefined();
      expect(result.data.id).toBe(mockCart.id);
    });
  });

  describe('addToCart', () => {
    it('should add item to cart', async () => {
      const cartId = '123e4567-e89b-12d3-a456-426614174000';
      const item: CartLine = { productId: MOCK_PRODUCT_ID, quantity: 2 };
      
      const result = await controller.addToCart(cartId, item);
      
      expect(mockProductsService.findOne).toHaveBeenCalledWith(MOCK_PRODUCT_ID);
      expect(cartService.addToCart).toHaveBeenCalledWith(cartId, item);
      expect(cartService.getCart).toHaveBeenCalledWith(cartId);
      expect(result.type).toBe('success');
      expect(result.status).toBe(200);
      expect(result.message).toBe('Item added to cart successfully');
    });

    it('should throw error if product does not exist', async () => {
      const cartId = '123e4567-e89b-12d3-a456-426614174000';
      const item: CartLine = { productId: MOCK_PRODUCT_ID, quantity: 2 };
      
      jest.spyOn(mockProductsService, 'findOne').mockRejectedValue(new BadRequestException());
      await expect(controller.addToCart(cartId, item)).rejects.toThrow(BadRequestException);
    });
  });
  describe('removeFromCart', () => {
    it('should remove item from cart', async () => {
      const cartId = '123e4567-e89b-12d3-a456-426614174000';
      const productId = MOCK_PRODUCT_ID;
      
      const result = await controller.removeFromCart(cartId, productId);
      
      expect(cartService.removeFromCart).toHaveBeenCalledWith(cartId, productId);
      expect(cartService.getCart).toHaveBeenCalledWith(cartId);
      expect(result.type).toBe('success'); 
      expect(result.status).toBe(200);
      expect(result.message).toBe('Item removed from cart successfully');
    });
  });

  describe('clearCart', () => {
    it('should clear cart', async () => {
      const cartId = '123e4567-e89b-12d3-a456-426614174000';
      
      const result = await controller.clearCart(cartId);
      
      expect(cartService.clearCart).toHaveBeenCalledWith(cartId);
      expect(cartService.getCart).toHaveBeenCalledWith(cartId);
      expect(result.type).toBe('success');
      expect(result.status).toBe(200);
      expect(result.message).toBe('Cart cleared successfully');
    });
  });
});
